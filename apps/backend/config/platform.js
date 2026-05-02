const revenueModel = {
  ecommerce: {
    commission_percentage: 5, // 5% platform commission
    listing_fee: 0,
    escrow_terms: 'Milestone-based release'
  },
  services: {
    commission_percentage: 10, // 10% platform commission on gig-work
    subscription_model: 'AMC Protection Plans'
  }
};

const servicePrograms = [
  { 
    id: 'sp_1', 
    name: 'Standard Installation', 
    channel: 'Residential', 
    revenue_model: 'milestone_commission',
    features: ['Site Survey', 'Component Installation', 'Net Metering Assistance']
  },
  { 
    id: 'sp_2', 
    name: 'AMC: Solar Guardian', 
    channel: 'Subscription', 
    revenue_model: 'recurring_fee',
    features: ['Quarterly Cleaning', 'Annual Health Audit', 'Priority Repair']
  }
];

const providerIntegrations = {
  payments: 'Razorpay / Escrow.pay',
  logistics: 'Delhivery / Shadowfax',
  notifications: 'Gupshup (WhatsApp/SMS)',
  maps: 'Google Maps API / MapmyIndia'
};

module.exports = {
  revenueModel,
  servicePrograms,
  providerIntegrations
};
