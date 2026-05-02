const db = require('../db');
const { randomUUID } = require('crypto');
const notificationService = require('../services/notification');

const USE_MOCK = process.env.USE_MOCK === 'true';

const plans = [
  { 
    id: 'plan_basic', 
    name: 'AMC: Basic Protection', 
    price_yearly: 2999, 
    features: ['4 Cleaning visits', '2 Electrical safety audits', 'Priority Support'] 
  },
  { 
    id: 'plan_premium', 
    name: 'AMC: Premium Care', 
    price_yearly: 5999, 
    features: ['Monthly cleaning', 'Real-time monitoring', '24/7 Priority support', 'Zero-cost repairs'] 
  }
];

const getPlans = (req, res) => {
  res.json(plans);
};

const getUserSubscription = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query('SELECT * FROM subscriptions WHERE user_id = $1', [userId]);
    res.json(result.rows[0] || null);
  } catch (err) {
    if (USE_MOCK) {
      return res.json({
        id: `sub_${randomUUID()}`,
        user_id: userId,
        plan_id: 'plan_premium',
        plan_name: 'AMC: Premium Care',
        status: 'active',
        start_date: '2026-01-01',
        end_date: '2027-01-01',
        recurring_amount: 5999,
        next_service_date: '2026-06-15'
      });
    }
    res.status(500).json({ error: err.message });
  }
};

const createSubscription = async (req, res) => {
  const { user_id, plan_id } = req.body;
  const plan = plans.find(p => p.id === plan_id);
  
  if (!plan) return res.status(404).json({ error: 'Plan not found' });

  try {
    const startDate = new Date().toISOString();
    const endDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();
    
    const result = await db.query(
      'INSERT INTO subscriptions (user_id, plan_id, plan_name, status, start_date, end_date, recurring_amount) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [user_id, plan_id, plan.name, 'active', startDate, endDate, plan.price_yearly]
    );

    await notificationService.sendSMS('USER_PHONE', `Welcome to ${plan.name}! Your solar system is now under SolarHub protection.`);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (USE_MOCK) {
      const sub = {
        id: `sub_${randomUUID()}`,
        user_id,
        plan_id,
        plan_name: plan.name,
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        recurring_amount: plan.price_yearly
      };
      return res.status(201).json(sub);
    }
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getPlans,
  getUserSubscription,
  createSubscription
};
