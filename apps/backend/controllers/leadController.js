const db = require('../db');
const { randomUUID } = require('crypto');
const analyticsService = require('../services/analytics');
const eventBus = require('../services/eventBus');

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
    partner_id, customer_name, customer_phone, customer_email,
    interest_type = 'Residential', estimated_load, notes, name, phone,
    pincode, requirement, source = 'web', monthly_bill, roof_area,
    roof_area_sqft = roof_area, recommended_kw, subsidy_amount,
    estimated_savings, city, calculator_payload
  } = req.body;

  const leadName = customer_name || name || 'New Lead';
  const leadPhone = customer_phone || phone;
  const leadRequirement = requirement || notes || interest_type;

  if (!leadPhone || !leadRequirement) {
    return res.status(400).json({ error: 'phone and requirement are required' });
  }

  const commercialPayload = {
    monthly_bill: monthly_bill == null ? null : Number(monthly_bill),
    roof_area_sqft: roof_area_sqft == null ? null : Number(roof_area_sqft),
    recommended_kw: recommended_kw == null ? null : Number(recommended_kw),
    subsidy_amount: subsidy_amount == null ? null : Number(subsidy_amount),
    estimated_savings: estimated_savings == null ? null : Number(estimated_savings),
    city: city || null,
    calculator_payload: calculator_payload || null
  };

  try {
    const result = await db.query(
      `INSERT INTO leads (
        partner_id, name, customer_name, phone, customer_phone, customer_email,
        pincode, requirement, interest_type, estimated_load, source, status, notes,
        monthly_bill, roof_area_sqft, recommended_kw, subsidy_amount, estimated_savings, city, calculator_payload
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) RETURNING *`,
      [partner_id || null, leadName, leadName, leadPhone, leadPhone, customer_email || null,
       pincode || null, leadRequirement, interest_type, estimated_load || null, source, 'new', notes || null,
       commercialPayload.monthly_bill, commercialPayload.roof_area_sqft, commercialPayload.recommended_kw,
       commercialPayload.subsidy_amount, commercialPayload.estimated_savings, commercialPayload.city,
       commercialPayload.calculator_payload]
    );
    const lead = result.rows[0];
    await analyticsService.trackEvent(partner_id || leadPhone, 'lead_created', { customer_name: leadName, source });
    const event = eventBus.emit('lead.created', { lead, commercial: commercialPayload }, 'customer', lead.id);
    res.status(201).json({ ...lead, event_id: event.event_id });
  } catch (err) {
    if (USE_MOCK) {
      const lead = {
        id: `lead_${randomUUID()}`, partner_id, customer_name: leadName,
        customer_phone: leadPhone, phone: leadPhone, pincode,
        requirement: leadRequirement, interest_type, estimated_load, source,
        status: 'new', created_at: new Date().toISOString(), ...commercialPayload
      };
      await analyticsService.trackEvent(partner_id || leadPhone, 'lead_created_mock', { customer_name: leadName });
      const event = eventBus.emit('lead.created', { lead, commercial: commercialPayload }, 'customer', lead.id);
      return res.status(201).json({ ...lead, event_id: event.event_id, mode: 'mock' });
    }
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getPartnerLeads, createLead };
