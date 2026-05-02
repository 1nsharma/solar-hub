const db = require('../db');
const { randomUUID } = require('crypto');
const analyticsService = require('../services/analytics');

const USE_MOCK = process.env.USE_MOCK === 'true';

const getPartnerLeads = async (req, res) => {
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
};

const createLead = async (req, res) => {
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
};

module.exports = {
  getPartnerLeads,
  createLead
};
