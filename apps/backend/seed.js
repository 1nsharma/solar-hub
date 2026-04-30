const db = require('./db');
const { randomUUID } = require('crypto');

async function seed() {
  console.log('--- SolarHub Real Data Seeding Started ---');
  try {
    // 1. Cleanup
    console.log('Cleaning up old data...');
    await db.query('TRUNCATE users, vendors, technicians, products, services, orders, order_items, payments, payment_milestones CASCADE');

    // 2. Users
    console.log('Seeding Users...');
    const admin = await db.query("INSERT INTO users (name, phone, role) VALUES ('Super Admin', '9999999994', 'admin') RETURNING id");
    const customer = await db.query("INSERT INTO users (name, phone, role) VALUES ('Test Customer', '9876543210', 'customer') RETURNING id");
    const vendorUser = await db.query("INSERT INTO users (name, phone, role) VALUES ('Solar Solution Vendor', '9999999993', 'vendor') RETURNING id");
    const techUser = await db.query("INSERT INTO users (name, phone, role) VALUES ('Expert Tech', '9999999992', 'technician') RETURNING id");

    const adminId = admin.rows[0].id;
    const customerId = customer.rows[0].id;
    const vendorUserId = vendorUser.rows[0].id;
    const techUserId = techUser.rows[0].id;

    // 3. Vendors
    console.log('Seeding Vendors...');
    const vendor = await db.query(`
      INSERT INTO vendors (user_id, business_name, gst_number, status, rating) 
      VALUES ($1, 'Surya Solar Solutions', '24AAAAA0000A1Z5', 'approved', 4.9) RETURNING id
    `, [vendorUserId]);
    const vendorId = vendor.rows[0].id;

    // 4. Technicians
    console.log('Seeding Technicians...');
    await db.query(`
      INSERT INTO technicians (user_id, region, specialization, status, rating) 
      VALUES ($1, 'Noida/NCR', 'Solar PV & Inverters', 'active', 4.8)
    `, [techUserId]);

    // 5. Products
    console.log('Seeding Products...');
    const p1 = await db.query(`
      INSERT INTO products (vendor_id, title, price, category, vendor, rating, description, image_url) 
      VALUES ($1, 'Premium On-Grid Kit 5kW', 280000, 'Kits', 'Tata Power', 4.9, '10 Panels + 5kW Inverter + Structure. Perfect for large homes.', 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d')
      RETURNING id
    `, [vendorId]);
    
    await db.query(`
      INSERT INTO products (vendor_id, title, price, category, vendor, rating, description, image_url) 
      VALUES ($1, 'Essential Hybrid Kit 3kW', 195000, 'Kits', 'Luminous', 4.8, '6 Panels + 3kW Inverter + 2 Batteries. Ideal for power cuts.', 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d')
    `, [vendorId]);

    // 6. Services
    console.log('Seeding Services...');
    await db.query("INSERT INTO services (title, price, duration, icon_name, description) VALUES ('AMC: Premium Care', 5999, '1 Year', 'ShieldCheck', 'Monthly cleaning + Real-time monitoring.')");

    // 7. Orders & Payments (To populate stats)
    console.log('Seeding Orders & Payments...');
    for (let i = 0; i < 15; i++) {
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - i);
      
      const order = await db.query(`
        INSERT INTO orders (user_id, total_amount, status, payment_status, created_at) 
        VALUES ($1, $2, 'delivered', 'paid', $3) RETURNING id
      `, [customerId, 280000, orderDate]);
      
      const orderId = order.rows[0].id;
      
      await db.query(`
        INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) 
        VALUES ($1, $2, 1, 280000)
      `, [orderId, p1.rows[0].id]);
      
      await db.query(`
        INSERT INTO payments (order_id, amount, status, method, created_at) 
        VALUES ($1, 280000, 'success', 'UPI', $2)
      `, [orderId, orderDate]);
    }

    console.log('--- Seeding Completed Successfully! ---');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Failed:', err);
    process.exit(1);
  }
}

seed();
