const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'SolarHub API is running' });
});

// Mock Database
const users = [
  { id: 'u1', name: 'Admin User', phone: '6393741171', role: 'admin' },
  { id: 'u2', name: 'Test User', phone: '9876543210', role: 'customer' }
];

const products = [
  {
    id: 'p1',
    type: 'physical',
    image: '/kit.png',
    title: '3kW Complete Home Kit',
    price: '1,85,000',
    rating: '4.8',
    category: 'Kits',
    vendor: 'SolarTech India'
  },
  {
    id: 'p2',
    type: 'physical',
    image: '/inverter.png',
    title: 'Smart Hybrid Inverter 5kVA',
    price: '45,999',
    rating: '4.9',
    category: 'Inverters',
    vendor: 'Loom Solar'
  }
];

const services = [
  {
    id: 's1',
    type: 'service',
    title: 'Panel Cleaning Service',
    price: '999',
    duration: '2 Hours',
    icon: 'Zap'
  },
  {
    id: 's2',
    type: 'service',
    title: 'Annual Maintenance (AMC)',
    price: '4,999',
    duration: 'Yearly',
    icon: 'Settings'
  }
];

// Routes
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/products', (req, res) => {
  res.json({ products, services });
});

// Auth Route Update
app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  if (otp === '1234') {
    const user = users.find(u => u.phone === phone) || { name: 'New User', phone, role: 'customer' };
    res.json({ 
      success: true, 
      token: 'mock-jwt-token',
      user 
    });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
