const db = require('../db');

const getProductsAndServices = async (req, res) => {
  try {
    const productsResult = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    const servicesResult = await db.query('SELECT * FROM services ORDER BY created_at DESC');
    res.json({ products: productsResult.rows, services: servicesResult.rows });
  } catch (err) {
    console.error('Products Error:', err);
    res.status(500).json({ error: err.message });
  }
};

const getServices = async (req, res) => {
  try {
    const servicesResult = await db.query('SELECT * FROM services ORDER BY created_at DESC');
    res.json(servicesResult.rows);
  } catch (err) {
    console.error('Services Error:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getProductsAndServices,
  getServices
};
