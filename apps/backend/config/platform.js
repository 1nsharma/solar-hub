const revenueModel = {
  ecommerce: {
    commission_percentage: 5, // 5% platform commission
    listing_fee: 0,
    escrow_terms: 'Milestone-based release',
    revenue_event: true,
    primary_monetization: true
  },
  services: {
    commission_percentage: 0,
    subscription_model: 'Operational AMC workflow',
    revenue_event: false,
    primary_monetization: false,
    note: 'Services support conversion, fulfillment, retention, and technician utilization. Do not count service bookings as platform revenue unless finance policy changes.'
  }
};

const servicePrograms = [
  { 
    id: 'sp_1', 
    name: 'Standard Installation', 
    channel: 'Residential', 
    revenue_model: 'order_fulfillment_workflow',
    platform_revenue: false,
    features: ['Site Survey', 'Component Installation', 'Net Metering Assistance']
  },
  { 
    id: 'sp_2', 
    name: 'AMC: Solar Guardian', 
    channel: 'Subscription', 
    revenue_model: 'retention_workflow',
    platform_revenue: false,
    features: ['Quarterly Cleaning', 'Annual Health Audit', 'Priority Repair']
  }
];

const founderReadiness = {
  concept: 'SolarHub is a full-stack solar commerce and fulfillment platform: customers buy verified solar products, vendors receive qualified orders, technicians complete field work, and partners generate demand.',
  audiences: [
    {
      id: 'customer',
      promise: 'Buy the right solar kit, finance it, track delivery and installation, then manage service over the system lifecycle.',
      proof_points: ['ROI calculator', 'Verified marketplace', 'Checkout and payment order flow', 'Order tracking', 'AMC and repair booking']
    },
    {
      id: 'vendor',
      promise: 'Receive qualified demand, manage catalog, quote leads, dispatch orders, and track payouts from one dashboard.',
      proof_points: ['Vendor onboarding', 'Inventory dashboard', 'Order queue', 'Quote workflow', 'Vendor health metrics']
    },
    {
      id: 'technician',
      promise: 'Gig-style job allocation for solar installation, cleaning, diagnostics, and repair with checklist and evidence capture.',
      proof_points: ['Assigned task queue', 'Job detail screen', 'Checklist workflow', 'Photo evidence placeholders', 'Completion actions']
    },
    {
      id: 'partner',
      promise: 'Solopreneurs and CAs can submit solar leads and track referral earnings while SolarHub handles conversion and fulfillment.',
      proof_points: ['Lead form', 'Referral code', 'Lead status table', 'Potential earnings view']
    },
    {
      id: 'admin',
      promise: 'Operate trust, supply chain, revenue, vendors, technicians, and infrastructure from a control center.',
      proof_points: ['Revenue stats', 'KYC queue', 'Supply-chain risk', 'Infrastructure health', 'Training queue']
    }
  ],
  production_gates: [
    'Real auth with role-based sessions and protected dashboard routing',
    'Verified vendor KYC, GST validation, document storage, and approval history',
    'Order state machine with payment milestones, invoice, logistics, and cancellation rules',
    'Technician dispatch rules based on pincode, skill, rating, availability, and SLA',
    'Customer support tickets, warranty claims, AMC renewal, and dispute escalation',
    'Analytics split by ecommerce revenue, service operations, lead funnel, and fulfillment SLA'
  ],
  market_segments: [
    'Residential rooftop solar buyers',
    'Small shops and commercial buildings',
    'Existing solar owners needing service',
    'Regional installers and solar dealers',
    'Independent technicians',
    'CA and local referral partners'
  ],
  north_star_metrics: [
    'Gross merchandise value from ecommerce checkout',
    'Qualified lead to paid order conversion',
    'Vendor order acceptance time',
    'Installation completion SLA',
    'Repeat AMC and service retention',
    'Technician utilization and first-time fix rate'
  ]
};

const providerIntegrations = {
  payments: 'Razorpay / Escrow.pay',
  logistics: 'Delhivery / Shadowfax',
  notifications: 'Gupshup (WhatsApp/SMS)',
  maps: 'Google Maps API / MapmyIndia'
};

module.exports = {
  revenueModel,
  servicePrograms,
  founderReadiness,
  providerIntegrations
};
