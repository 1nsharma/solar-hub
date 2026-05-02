const { randomUUID } = require('crypto');
const auditService = require('../services/audit');
const notificationService = require('../services/notification');

const applyForSubsidy = async (req, res) => {
  const { user_id, scheme_name, documents } = req.body;
  
  const application = {
    id: `sub_${randomUUID()}`,
    user_id,
    scheme_name,
    status: 'pending_agent_review',
    agent_assigned: 'SolarHub Agent - Vikram',
    created_at: new Date().toISOString()
  };

  await auditService.log(user_id, 'SUBSIDY_APPLIED', 'subsidy', application.id, null, { scheme_name });
  await notificationService.sendSMS('VENDOR_PHONES', `New Subsidy Application for ${scheme_name} by user ${user_id}. Prepare for kit inquiry.`);

  res.status(201).json(application);
};

const getSubsidyStatus = (req, res) => {
  res.json([
    { 
      id: 'sub_demo_1', 
      scheme_name: 'PM Surya Ghar Yojana', 
      status: 'approved', 
      amount: 78000, 
      message: 'Your subsidy has been approved. Vendors have been notified to unlock special pricing.' 
    }
  ]);
};

module.exports = {
  applyForSubsidy,
  getSubsidyStatus
};
