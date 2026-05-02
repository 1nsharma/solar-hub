const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { revenueModel, servicePrograms, providerIntegrations } = require('./config/platform');

// Route Imports
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const financeRoutes = require('./routes/finance');
const bookingRoutes = require('./routes/bookings');
const leadRoutes = require('./routes/leads');
const subsidyRoutes = require('./routes/subsidy');
const systemRoutes = require('./routes/system');
const technicianRoutes = require('./routes/technician');
const amcRoutes = require('./routes/amc');

// Service Imports for index-level routes
const paymentService = require('./services/payment');
const analyticsService = require('./services/analytics');

const app = express();
const PORT = process.env.PORT || 5001;
const USE_MOCK = process.env.USE_MOCK === 'true';

app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/subsidy', subsidyRoutes);
app.use('/api/technician', technicianRoutes);
app.use('/api/amc', amcRoutes);
app.use('/api', systemRoutes); // health, seed, external-deals

// Platform Info Routes
app.get('/api/revenue-model', (req, res) => res.json(revenueModel));
app.get('/api/service-programs', (req, res) => res.json(servicePrograms));
app.get('/api/provider-integrations', (req, res) => res.json({
  mode: USE_MOCK ? 'local_mock' : 'production',
  integrations: providerIntegrations
}));
app.get('/api/subscriptions/plans', (req, res) => res.json(servicePrograms));

// Payment Creation (Move to payment controller if needed, but keeping here for direct gateway access)
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

const server = app.listen(PORT, () => {
  console.log(`SolarHub API running on port ${PORT}`);
});

// Keep-alive for dev environment
if (process.env.NODE_ENV !== 'production') {
  setInterval(() => {}, 1000 * 60 * 60);
}
