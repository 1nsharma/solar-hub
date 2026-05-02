const db = require('../db');

const mockProducts = [
  { id: 1, title: 'Premium On-Grid Kit 5kW', price: 280000, category: 'Kits', vendor: 'Tata Power', rating: 4.9, description: '10 Panels + 5kW Inverter + Structure + Net Metering. Perfect for large homes.', image_url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d' },
  { id: 2, title: 'Essential Hybrid Kit 3kW', price: 195000, category: 'Kits', vendor: 'Luminous', rating: 4.8, description: '6 Panels + 3kW Inverter + 2 Batteries. Ideal for areas with power cuts.', image_url: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d' },
  { id: 3, title: 'Micro Off-Grid Kit 1kW', price: 75000, category: 'Kits', vendor: 'Loom Solar', rating: 4.7, description: '2 Panels + 1kW Inverter + 1 Battery. Best for remote cabins or shops.', image_url: 'https://images.unsplash.com/photo-1509391366360-fe5bb58583bb' },
  { id: 4, title: 'Solar Inverter 5kVA', price: 45000, category: 'Inverters', vendor: 'Microtek', rating: 4.6, description: 'Pure sine wave solar inverter with high efficiency.', image_url: 'https://images.unsplash.com/photo-1558444479-c84851218670' },
  { id: 5, title: 'Smart Water Heater', price: 12000, category: 'Eco-Home', vendor: 'Havells', rating: 4.5, description: 'Energy efficient water heater with app control.', image_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70' }
];

const mockServices = [
  { id: 1, title: 'AMC: Basic Protection', price: 2999, duration: '1 Year', icon_name: 'ShieldCheck', description: '4 Cleaning visits + 2 Electrical safety audits per year.' },
  { id: 2, title: 'AMC: Premium Care', price: 5999, duration: '1 Year', icon_name: 'ShieldCheck', description: 'Monthly cleaning + Real-time monitoring + 24/7 Priority support.' },
  { id: 3, title: 'Panel Cleaning', price: 499, duration: '2 Hours', icon_name: 'Zap', description: 'Deep cleaning using high-pressure tools and solar-safe solvents.' },
  { id: 4, title: 'Battery Health Check', price: 799, duration: '1 Hour', icon_name: 'Settings', description: 'Full diagnostic of battery gravity, voltage, and backup time.' },
  { id: 5, title: 'Repair & Troubleshooting', price: 999, duration: 'As per task', icon_name: 'Wrench', description: 'Fixing inverters, panels, and wiring issues by certified experts.' }
];

const USE_MOCK = process.env.USE_MOCK === 'true';

const getProductsAndServices = async (req, res) => {
  if (USE_MOCK) {
    return res.json({ products: mockProducts, services: mockServices });
  }
  try {
    const productsResult = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    const servicesResult = await db.query('SELECT * FROM services ORDER BY created_at DESC');
    res.json({ products: productsResult.rows, services: servicesResult.rows });
  } catch (err) {
    console.error('Products Error:', err);
    return res.json({ products: mockProducts, services: mockServices });
  }
};

const getServices = async (req, res) => {
  if (USE_MOCK) {
    return res.json(mockServices);
  }
  try {
    const servicesResult = await db.query('SELECT * FROM services ORDER BY created_at DESC');
    res.json(servicesResult.rows);
  } catch (err) {
    console.error('Services Error:', err);
    return res.json(mockServices);
  }
};

module.exports = {
  getProductsAndServices,
  getServices
};
