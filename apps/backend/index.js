const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper for Mock Fallback (during development)
const USE_MOCK = process.env.USE_MOCK === 'true';

// Mock Data
let mockUsers = [
  { id: 'u1', name: 'Admin User', phone: '6393741171', role: 'admin' },
  { id: 'u2', name: 'Test User', phone: '9876543210', role: 'customer' }
];

// Routes

// 1. Products & Services
app.get('/api/products', async (req, res) => {
  try {
    const productsResult = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    const servicesResult = await db.query('SELECT * FROM services ORDER BY created_at DESC');
    
    res.json({ 
      products: productsResult.rows, 
      services: servicesResult.rows 
    });
  } catch (err) {
    console.error('DB Error:', err);
    // Fallback to static data if DB fails
    res.json({ 
      products: [
        { id: 1, title: 'Premium Solar Kit 5kW', price: 250000, category: 'Kits', vendor: 'Tata Solar', rating: 4.9, description: 'Complete on-grid solar solution for 3-4 BHK homes.', image_url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=800' }
      ],
      services: [
        { id: 1, title: 'Panel Cleaning', price: 499, icon_name: 'Zap', duration: '1 Hour', description: 'Deep cleaning of panels to increase efficiency.' }
      ]
    });
  }
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
  const { user_id, total_amount, address_id, items } = req.body;
  try {
    await db.query('BEGIN');
    const orderResult = await db.query(
      'INSERT INTO orders (user_id, total_amount, address_id, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, total_amount, address_id, 'processing']
    );
    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)',
        [orderId, item.id, item.quantity, item.price]
      );
    }
    await db.query('COMMIT');
    res.status(201).json(orderResult.rows[0]);
  } catch (err) {
    await db.query('ROLLBACK');
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
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Vendor Applications
app.get('/api/admin/vendors', async (req, res) => {
  try {
    const result = await db.query('SELECT v.*, u.name as owner_name FROM vendors v JOIN users u ON v.user_id = u.id ORDER BY v.created_at DESC');
    res.json(result.rows);
  } catch (err) {
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
    res.status(500).json({ error: err.message });
  }
});

// 4. Auth (Mock for now, but DB ready)
app.post('/api/auth/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  if (otp === '1234') {
    try {
      let result = await db.query('SELECT * FROM users WHERE phone = $1', [phone]);
      let user = result.rows[0];
      
      if (!user) {
        result = await db.query(
          'INSERT INTO users (name, phone, role) VALUES ($1, $2, $3) RETURNING *',
          ['New User', phone, 'customer']
        );
        user = result.rows[0];
      }
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
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`SolarHub API running on port ${PORT}`);
});

