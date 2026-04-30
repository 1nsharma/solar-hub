const express = require('express');
const cors = require('cors');
const db = require('./db');
const { randomUUID } = require('crypto');
require('dotenv').config();

// Operational Services
const paymentService = require('./services/payment');
const logisticsService = require('./services/logistics');
const notificationService = require('./services/notification');
const mapsService = require('./services/maps');
const analyticsService = require('./services/analytics');
const storageService = require('./services/storage');
const auditService = require('./services/audit');



const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Helper for Mock Fallback (during development)
const USE_MOCK = process.env.USE_MOCK === 'true';

// ... (mock data and service programs remain here for now)

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);

app.get('/api/health', async (req, res) => {
  let database = 'unavailable';
  try {
    await db.query('SELECT 1');
    database = 'ok';
  } catch (err) {
    database = USE_MOCK ? 'mock' : 'unavailable';
  }

  res.json({
    status: database === 'unavailable' && !USE_MOCK ? 'degraded' : 'ok',
    service: 'solarhub-api',
    database,
    mock_mode: USE_MOCK,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/revenue-model', (req, res) => {
  res.json(revenueModel);
});

app.get('/api/service-programs', (req, res) => {
  res.json(servicePrograms);
});

app.get('/api/provider-integrations', (req, res) => {
  res.json({
    mode: USE_MOCK ? 'local_mock' : 'production',
    integrations: providerIntegrations
  });
});


app.get('/api/subscriptions/plans', (req, res) => {
  // Backward-compatible alias for older clients. These are service programs, not platform-paid subscriptions.
  res.json(servicePrograms);
});

app.post('/api/payments/create-order', async (req, res) => {
  const { amount, currency = 'INR', user_id, purpose = 'checkout' } = req.body;
  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ error: 'amount is required and must be greater than 0' });
  }

  const paymentOrder = await paymentService.createOrder(Number(amount), currency);
  await analyticsService.trackEvent(user_id || 'guest', 'ecommerce_payment_order_created', { amount, currency, purpose });
  res.status(201).json({
    ...paymentOrder,
    gateway: process.env.RAZORPAY_KEY_ID ? 'razorpay' : 'mock',
    public_key: process.env.RAZORPAY_KEY_ID || 'mock_public_key'
  });
});

// 1.5 Finance & Trust Engine (Transaction Control)
app.post('/api/finance/calculate', (req, res) => {
  const { systemSize, totalCost } = req.body;
  
  if (!systemSize || !totalCost) {
    return res.status(400).json({ error: 'systemSize and totalCost are required' });
  }

  // Simplified MNRE Subsidy Logic (PM Surya Ghar)
  const capacity = parseFloat(systemSize);
  let subsidy = 0;
  if (capacity <= 2) {
    subsidy = capacity * 30000;
  } else if (capacity > 2 && capacity <= 3) {
    subsidy = 60000 + ((capacity - 2) * 18000);
  } else if (capacity > 3) {
    subsidy = 78000;
  }

  const customerPayable = totalCost - subsidy;
  const loanAmount = customerPayable * 0.8; // 80% LTV
  const interestRate = 0.09; // 9% per annum
  const tenureMonths = 60; // 5 years

  // EMI calculation (P * r * (1+r)^n)/((1+r)^n - 1)
  const monthlyRate = interestRate / 12;
  const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  res.json({
    totalCost,
    subsidyEstimated: Math.round(subsidy),
    customerPayable: Math.round(customerPayable),
    financing: {
      eligibleLoanAmount: Math.round(loanAmount),
      emiEstimated: Math.round(emi),
      tenureMonths,
      interestRate
    },
    milestones: [
      { name: 'Booking Advance (10%)', amount: Math.round(customerPayable * 0.10) },
      { name: 'Material Dispatch (50%)', amount: Math.round(customerPayable * 0.50) },
      { name: 'Installation Complete (30%)', amount: Math.round(customerPayable * 0.30) },
      { name: 'Net Metering & Handover (10%)', amount: Math.round(customerPayable * 0.10) }
    ]
  });
});

// 2. Orders
app.get('/api/orders/:userId', async (req, res) => {
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
});

app.post('/api/orders', async (req, res) => {
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
    
    // 0. Audit: Log system action
    await auditService.log(user_id, 'ORDER_CREATED', 'order', orderId, null, { amount: total_amount, milestones_created: true });

    // 1. Analytics: Track order creation
    await analyticsService.trackEvent(user_id, 'order_created', { orderId, amount: total_amount, financing: !!emi_details });

    // 2. Logistics: Create shipment (Simulated)
    const shipment = await logisticsService.createShipment({ id: orderId, total_amount, address_id });
    
    // 3. Notification: Send Confirmation
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
});

// 3. Bookings
app.get('/api/bookings/:userId', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT sb.*, s.title as service_title, s.icon_name
      FROM service_bookings sb
      JOIN services s ON sb.service_id = s.id
      WHERE sb.user_id = $1
      ORDER BY sb.booking_date DESC
    `, [req.params.userId]);
    res.json(result.rows);
  } catch (err) {
    if (USE_MOCK) {
      return res.json([]);
    }

    res.status(500).json({ error: err.message });
  }
});

// Phase 2: Vendor Quote Engine (Prevent Offline Leakage)
app.post('/api/quotes', async (req, res) => {
  const { vendor_id, lead_id, system_size, proposed_price, notes } = req.body;
  // In a real scenario, this inserts into a `quotes` table.
  
  const quote = {
    id: `qt_${randomUUID()}`,
    vendor_id,
    lead_id,
    system_size,
    proposed_price,
    notes,
    status: 'submitted',
    created_at: new Date().toISOString()
  };

  // Trigger Notification to Customer
  await notificationService.sendWhatsApp('customer_phone', 'new_quote_received', {
    quote_id: quote.id,
    vendor_id
  });

  res.status(201).json(quote);
});

// Phase 3: Workflow Engine (State Machine & Escrow Release)
app.put('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, milestone_completed } = req.body;
  
  // Valid States: processing -> site_survey_done -> material_dispatched -> installation_done -> net_metering_done -> completed
  
  try {
    // 1. Update Order Status
    await db.query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
    
    // 2. Update Milestone if applicable
    if (milestone_completed) {
      await db.query("UPDATE payment_milestones SET status = 'paid', paid_at = CURRENT_TIMESTAMP WHERE order_id = $1 AND milestone_name = $2", [id, milestone_completed]);
      // Event: Trigger vendor payout from Escrow
      // await paymentService.releaseEscrow(id, milestone_completed);
    }
    
    // 3. Dispatch Background Job (Simulation of BullMQ)
    setTimeout(() => {
      console.log(`[BullMQ Worker] Processed state transition for ${id} to ${status}`);
      notificationService.sendSMS('9876543210', `Order ${id} is now ${status}`);
    }, 100);

    res.json({ success: true, id, status });
  } catch (err) {
    if (USE_MOCK) {
      // Mock State Machine Execution
      setTimeout(() => {
        console.log(`[BullMQ Worker Mock] Processed state transition for ${id} to ${status} and released escrow for ${milestone_completed || 'none'}`);
      }, 100);
      return res.json({ success: true, id, status, mock: true });
    }
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  const { user_id, service_id, booking_date, time_slot, address_id } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO service_bookings (user_id, service_id, booking_date, time_slot, address_id, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user_id, service_id, booking_date, time_slot, address_id, 'confirmed']
    );
    const booking = result.rows[0];

    // --- Live Operational Flow ---

    // 1. Maps: Distance Calculation for Dispatch
    const distanceInfo = await mapsService.calculateDistance('SolarHub Central', 'User Address');
    
    // 2. Notification: Alert Technician & User
    await notificationService.sendWhatsApp('9876543210', 'booking_confirmed', { 
      booking_id: booking.id, 
      date: booking_date, 
      slot: time_slot 
    });

    res.status(201).json({ 
      ...booking, 
      dispatch_estimate: distanceInfo 
    });

  } catch (err) {
    if (USE_MOCK) {
      const booking = {
        id: `book_${randomUUID()}`,
        user_id,
        service_id,
        booking_date,
        time_slot,
        address_id,
        status: 'confirmed',
        created_at: new Date().toISOString()
      };
      const distanceInfo = await mapsService.calculateDistance('SolarHub Central', 'User Address');
      return res.status(201).json({ ...booking, dispatch_estimate: distanceInfo });
    }

    res.status(500).json({ error: err.message });
  }
});

// 3.1 Leads (Referral Business)
app.get('/api/leads/:partnerId', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM leads WHERE partner_id = $1 ORDER BY created_at DESC', [req.params.partnerId]);
    res.json(result.rows);
  } catch (err) {
    if (USE_MOCK) {
      return res.json([
        { id: 'l1', customer_name: 'John Doe', customer_phone: '9988776655', status: 'new', created_at: new Date().toISOString() },
        { id: 'l2', customer_name: 'Jane Smith', customer_phone: '8877665544', status: 'survey_done', created_at: new Date().toISOString() }
      ]);
    }
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/leads', async (req, res) => {
  const {
    partner_id,
    customer_name,
    customer_phone,
    customer_email,
    interest_type = 'Residential',
    estimated_load,
    notes,
    name,
    phone,
    pincode,
    requirement,
    source = 'web'
  } = req.body;

  const leadName = customer_name || name || 'New Lead';
  const leadPhone = customer_phone || phone;
  const leadRequirement = requirement || notes || interest_type;

  if (!leadPhone || !leadRequirement) {
    return res.status(400).json({ error: 'phone and requirement are required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO leads (partner_id, name, customer_name, phone, customer_phone, customer_email, pincode, requirement, interest_type, estimated_load, source, status, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
      [partner_id || null, leadName, leadName, leadPhone, leadPhone, customer_email || null, pincode || null, leadRequirement, interest_type, estimated_load || null, source, 'new', notes || null]
    );
    
    // Analytics: Track Lead Creation
    await analyticsService.trackEvent(partner_id || leadPhone, 'lead_created', { customer_name: leadName, source });

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (USE_MOCK) {
      const lead = {
        id: `lead_${randomUUID()}`,
        partner_id,
        customer_name: leadName,
        customer_phone: leadPhone,
        phone: leadPhone,
        pincode,
        requirement: leadRequirement,
        interest_type,
        estimated_load,
        source,
        status: 'new',
        created_at: new Date().toISOString()
      };
      await analyticsService.trackEvent(partner_id || leadPhone, 'lead_created_mock', { customer_name: leadName });
      return res.status(201).json(lead);
    }
    res.status(500).json({ error: err.message });
  }
});

// 4. Vendor Applications
app.get('/api/admin/vendors', async (req, res) => {
  try {
    const result = await db.query('SELECT v.*, u.name as owner_name FROM vendors v JOIN users u ON v.user_id = u.id ORDER BY v.created_at DESC');
    res.json(result.rows);
  } catch (err) {
    if (USE_MOCK) {
      return res.json([
        { id: 'vendor_mock_1', business_name: 'SolarNova Ltd.', owner_name: 'Demo Owner', status: 'pending', rating: 4.7, product_count: 12, created_at: new Date().toISOString() }
      ]);
    }

    res.status(500).json({ error: err.message });
  }
});

app.post('/api/vendors/apply', async (req, res) => {
  const { user_id, business_name, gst_number } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO vendors (user_id, business_name, gst_number, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, business_name, gst_number, 'pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (USE_MOCK) {
      return res.status(201).json({
        id: `vendor_${randomUUID()}`,
        user_id,
        business_name,
        gst_number,
        status: 'pending',
        created_at: new Date().toISOString()
      });
    }

    res.status(500).json({ error: err.message });
  }
});

// 4.1 Government Subsidy & Agents
app.post('/api/subsidy/apply', async (req, res) => {
  const { user_id, scheme_name, documents } = req.body;
  
  const application = {
    id: `sub_${randomUUID()}`,
    user_id,
    scheme_name,
    status: 'pending_agent_review',
    agent_assigned: 'SolarHub Agent - Vikram',
    created_at: new Date().toISOString()
  };

  // Notify Admin/Agent
  await auditService.log(user_id, 'SUBSIDY_APPLIED', 'subsidy', application.id, null, { scheme_name });
  
  // Notify Vendors (to prepare for potential orders)
  await notificationService.sendSMS('VENDOR_PHONES', `New Subsidy Application for ${scheme_name} by user ${user_id}. Prepare for kit inquiry.`);

  res.status(201).json(application);
});

app.get('/api/subsidy/status/:userId', (req, res) => {
  // Mock status for demo
  res.json([
    { 
      id: 'sub_demo_1', 
      scheme_name: 'PM Surya Ghar Yojana', 
      status: 'approved', 
      amount: 78000, 
      message: 'Your subsidy has been approved. Vendors have been notified to unlock special pricing.' 
    }
  ]);
});

// 4. Auth (Mock for now, but DB ready)
app.post('/api/auth/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  if (otp === '1234') {
    try {
      let result = await db.query('SELECT * FROM users WHERE phone = $1', [phone]);
      let user = result.rows[0];
      
      if (!user) {
        let role = 'customer';
        let name = 'New User';
        
        // Magic Numbers for Testing
        if (phone === '9999999991') { role = 'partner'; name = 'Solo Partner'; }
        else if (phone === '9999999992') { role = 'technician'; name = 'Master Tech'; }
        else if (phone === '9999999993') { role = 'vendor'; name = 'Solar Vendor'; }
        else if (phone === '9999999994') { role = 'admin'; name = 'Super Admin'; }
        else if (phone === '9999999995') { role = 'ca'; name = 'CA Partner'; }

        result = await db.query(
          'INSERT INTO users (name, phone, role) VALUES ($1, $2, $3) RETURNING *',
          [name, phone, role]
        );
        user = result.rows[0];
      }

      // Analytics: Track Login
      await analyticsService.trackEvent(user.id, 'user_login', { role: user.role });

      res.json({ success: true, token: 'mock-jwt-token', user });
    } catch (err) {
      // Fallback if DB fails
      res.json({ success: true, token: 'mock-jwt-token', user: { id: 'u1', name: 'Dev User', phone, role: 'customer' } });
    }
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});

const { getExternalPrices } = require('./scraper');

// 5. External Deals (Integrated Scraper Simulation)
app.get('/api/external-deals', async (req, res) => {
  const query = req.query.q || 'Solar Panel';
  try {
    const deals = await getExternalPrices(query);
    res.json(deals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch external prices' });
  }
});

// Seed Route (Temporary)
app.get('/api/dev/seed', async (req, res) => {
  try {
    await db.query('DELETE FROM products');
    await db.query('DELETE FROM services');
    
    // Solar Kits & Components
    await db.query("INSERT INTO products (title, price, category, vendor, rating, description, image_url) VALUES ('Premium On-Grid Kit 5kW', 280000, 'Kits', 'Tata Power', 4.9, '10 Panels + 5kW Inverter + Structure + Net Metering. Perfect for large homes.', 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d')");
    await db.query("INSERT INTO products (title, price, category, vendor, rating, description, image_url) VALUES ('Essential Hybrid Kit 3kW', 195000, 'Kits', 'Luminous', 4.8, '6 Panels + 3kW Inverter + 2 Batteries. Ideal for areas with power cuts.', 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d')");
    await db.query("INSERT INTO products (title, price, category, vendor, rating, description, image_url) VALUES ('Micro Off-Grid Kit 1kW', 75000, 'Kits', 'Loom Solar', 4.7, '2 Panels + 1kW Inverter + 1 Battery. Best for remote cabins or shops.', 'https://images.unsplash.com/photo-1509391366360-fe5bb58583bb')");
    await db.query("INSERT INTO products (title, price, category, vendor, rating, description, image_url) VALUES ('Solar Inverter 5kVA', 45000, 'Inverters', 'Microtek', 4.6, 'Pure sine wave solar inverter with high efficiency.', 'https://images.unsplash.com/photo-1558444479-c84851218670')");
    
    // House-use Items
    await db.query("INSERT INTO products (title, price, category, vendor, rating, description, image_url) VALUES ('Smart Water Heater', 12000, 'Eco-Home', 'Havells', 4.5, 'Energy efficient water heater with app control.', 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70')");

    // Services
    await db.query("INSERT INTO services (title, price, duration, icon_name, description) VALUES ('AMC: Basic Protection', 2999, '1 Year', 'ShieldCheck', '4 Cleaning visits + 2 Electrical safety audits per year.')");
    await db.query("INSERT INTO services (title, price, duration, icon_name, description) VALUES ('AMC: Premium Care', 5999, '1 Year', 'ShieldCheck', 'Monthly cleaning + Real-time monitoring + 24/7 Priority support.')");
    await db.query("INSERT INTO services (title, price, duration, icon_name, description) VALUES ('Panel Cleaning', 499, '2 Hours', 'Zap', 'Deep cleaning using high-pressure tools and solar-safe solvents.')");
    await db.query("INSERT INTO services (title, price, duration, icon_name, description) VALUES ('Battery Health Check', 799, '1 Hour', 'Settings', 'Full diagnostic of battery gravity, voltage, and backup time.')");
    await db.query("INSERT INTO services (title, price, duration, icon_name, description) VALUES ('Repair & Troubleshooting', 999, 'As per task', 'Wrench', 'Fixing inverters, panels, and wiring issues by certified experts.')");
    
    res.json({ message: 'Database seeded with expanded catalog!' });
  } catch (err) {
    console.error('Seed Error:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

const server = app.listen(PORT, () => {
  console.log(`SolarHub API running on port ${PORT}`);
});

// Keep-alive for dev environment
if (process.env.NODE_ENV !== 'production') {
  setInterval(() => {}, 1000 * 60 * 60);
}
