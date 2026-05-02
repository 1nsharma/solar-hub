const db = require('../db');
const { getExternalPrices } = require('../scraper');

const USE_MOCK = process.env.USE_MOCK === 'true';

const getHealth = async (req, res) => {
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
};

const getExternalDeals = async (req, res) => {
  const query = req.query.q || 'Solar Panel';
  try {
    const deals = await getExternalPrices(query);
    res.json(deals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch external prices' });
  }
};

const seedDatabase = async (req, res) => {
  try {
    await db.query('DELETE FROM products');
    await db.query('DELETE FROM services');
    
    await db.query("INSERT INTO products (title, price, category, vendor, rating, description, image_url) VALUES ('Premium On-Grid Kit 5kW', 280000, 'Kits', 'Tata Power', 4.9, '10 Panels + 5kW Inverter + Structure + Net Metering. Perfect for large homes.', 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d')");
    await db.query("INSERT INTO products (title, price, category, vendor, rating, description, image_url) VALUES ('Essential Hybrid Kit 3kW', 195000, 'Kits', 'Luminous', 4.8, '6 Panels + 3kW Inverter + 2 Batteries. Ideal for areas with power cuts.', 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d')");
    await db.query("INSERT INTO products (title, price, category, vendor, rating, description, image_url) VALUES ('Micro Off-Grid Kit 1kW', 75000, 'Kits', 'Loom Solar', 4.7, '2 Panels + 1kW Inverter + 1 Battery. Best for remote cabins or shops.', 'https://images.unsplash.com/photo-1509391366360-fe5bb58583bb')");
    await db.query("INSERT INTO products (title, price, category, vendor, rating, description, image_url) VALUES ('Solar Inverter 5kVA', 45000, 'Inverters', 'Microtek', 4.6, 'Pure sine wave solar inverter with high efficiency.', 'https://images.unsplash.com/photo-1558444479-c84851218670')");
    await db.query("INSERT INTO products (title, price, category, vendor, rating, description, image_url) VALUES ('Smart Water Heater', 12000, 'Eco-Home', 'Havells', 4.5, 'Energy efficient water heater with app control.', 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70')");

    await db.query("INSERT INTO services (title, price, duration, icon_name, description) VALUES ('AMC: Basic Protection', 2999, '1 Year', 'ShieldCheck', '4 Cleaning visits + 2 Electrical safety audits per year.')");
    await db.query("INSERT INTO services (title, price, duration, icon_name, description) VALUES ('AMC: Premium Care', 5999, '1 Year', 'ShieldCheck', 'Monthly cleaning + Real-time monitoring + 24/7 Priority support.')");
    await db.query("INSERT INTO services (title, price, duration, icon_name, description) VALUES ('Panel Cleaning', 499, '2 Hours', 'Zap', 'Deep cleaning using high-pressure tools and solar-safe solvents.')");
    await db.query("INSERT INTO services (title, price, duration, icon_name, description) VALUES ('Battery Health Check', 799, '1 Hour', 'Settings', 'Full diagnostic of battery gravity, voltage, and backup time.')");
    await db.query("INSERT INTO services (title, price, duration, icon_name, description) VALUES ('Repair & Troubleshooting', 999, 'As per task', 'Wrench', 'Fixing inverters, panels, and wiring issues by certified experts.')");
    
    res.json({ message: 'Database seeded successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getHealth,
  getExternalDeals,
  seedDatabase
};
