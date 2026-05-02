const db = require('../db');
const { randomUUID } = require('crypto');
const paymentService = require('../services/payment');
const logisticsService = require('../services/logistics');
const notificationService = require('../services/notification');
const analyticsService = require('../services/analytics');
const auditService = require('../services/audit');

const USE_MOCK = process.env.USE_MOCK === 'true';

const getUserOrders = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT o.*, 
      json_agg(json_build_object('title', p.title, 'quantity', oi.quantity, 'price', oi.price_at_purchase)) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [req.params.userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createOrder = async (req, res) => {
  const { user_id, total_amount, address_id, items, subsidy_amount = 0, emi_details = null } = req.body;
  try {
    await db.query('BEGIN');
    const orderResult = await db.query(
      'INSERT INTO orders (user_id, total_amount, address_id, status, subsidy_amount, emi_details, payment_status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [user_id, total_amount, address_id, 'processing', subsidy_amount, emi_details, 'partial']
    );
    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)',
        [orderId, item.id, item.quantity, item.price]
      );
    }

    // Generate Payment Milestones (Transaction Control)
    const customerPayable = total_amount - subsidy_amount;
    const milestones = [
      { name: 'Booking Advance (10%)', amount: customerPayable * 0.10, status: 'paid' }, // Paid at checkout
      { name: 'Material Dispatch (50%)', amount: customerPayable * 0.50, status: 'pending' },
      { name: 'Installation Complete (30%)', amount: customerPayable * 0.30, status: 'pending' },
      { name: 'Net Metering & Handover (10%)', amount: customerPayable * 0.10, status: 'pending' }
    ];

    for (const m of milestones) {
      await db.query(
        'INSERT INTO payment_milestones (order_id, milestone_name, amount, status) VALUES ($1, $2, $3, $4)',
        [orderId, m.name, m.amount, m.status]
      );
    }

    await db.query('COMMIT');

    // --- Live Operational Flow ---
    await auditService.log(user_id, 'ORDER_CREATED', 'order', orderId, null, { amount: total_amount, milestones_created: true });
    await analyticsService.trackEvent(user_id, 'order_created', { orderId, amount: total_amount, financing: !!emi_details });
    const shipment = await logisticsService.createShipment({ id: orderId, total_amount, address_id });
    await notificationService.sendSMS('9876543210', `Order #${orderId} confirmed! Next Milestone: Material Dispatch. Tracking: ${shipment.tracking_id}`);

    res.status(201).json({ 
      ...orderResult.rows[0], 
      shipment_details: shipment,
      milestones_tracked: true
    });
  } catch (err) {
    try {
      await db.query('ROLLBACK');
    } catch (rollbackErr) {
      console.error('Rollback failed:', rollbackErr.message);
    }

    if (USE_MOCK) {
      const customerPayable = total_amount - subsidy_amount;
      const order = {
        id: `ord_${randomUUID()}`,
        user_id,
        total_amount,
        subsidy_amount,
        emi_details,
        address_id,
        status: 'processing',
        payment_status: 'partial',
        items,
        milestones: [
          { name: 'Booking Advance (10%)', amount: customerPayable * 0.10, status: 'paid' },
          { name: 'Material Dispatch (50%)', amount: customerPayable * 0.50, status: 'pending' }
        ],
        created_at: new Date().toISOString()
      };
      const shipment = await logisticsService.createShipment(order);
      await analyticsService.trackEvent(user_id || 'guest', 'order_created_mock', { orderId: order.id, amount: total_amount });
      return res.status(201).json({ ...order, shipment_details: shipment });
    }

    res.status(500).json({ error: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, milestone_completed, user_id } = req.body;
  
  try {
    await db.query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
    
    if (milestone_completed) {
      await db.query("UPDATE payment_milestones SET status = 'paid', paid_at = CURRENT_TIMESTAMP WHERE order_id = $1 AND milestone_name = $2", [id, milestone_completed]);
    }
    
    // Dispatch Background Job (Simulation)
    setTimeout(() => {
      console.log(`[BullMQ Worker] Processed state transition for ${id} to ${status}`);
      notificationService.sendSMS('9876543210', `Order ${id} is now ${status}`);
    }, 100);

    res.json({ success: true, id, status });
  } catch (err) {
    if (USE_MOCK) {
      return res.json({ success: true, id, status, mock: true });
    }
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getUserOrders,
  createOrder,
  updateOrderStatus
};
