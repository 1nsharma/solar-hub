const calculateFinancing = (req, res) => {
  const { systemSize, totalCost } = req.body;
  
  if (!systemSize || !totalCost) {
    return res.status(400).json({ error: 'systemSize and totalCost are required' });
  }

  // Simplified MNRE Subsidy Logic (PM Surya Ghar)
  const capacity = parseFloat(systemSize);
  let subsidy = 0;
  if (capacity <= 2) {
    subsidy = capacity * 30000;
  } else if (capacity > 2 && capacity <= 3) {
    subsidy = 60000 + ((capacity - 2) * 18000);
  } else if (capacity > 3) {
    subsidy = 78000;
  }

  const customerPayable = totalCost - subsidy;
  const loanAmount = customerPayable * 0.8; // 80% LTV
  const interestRate = 0.09; // 9% per annum
  const tenureMonths = 60; // 5 years

  // EMI calculation (P * r * (1+r)^n)/((1+r)^n - 1)
  const monthlyRate = interestRate / 12;
  const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  res.json({
    totalCost,
    subsidyEstimated: Math.round(subsidy),
    customerPayable: Math.round(customerPayable),
    financing: {
      eligibleLoanAmount: Math.round(loanAmount),
      emiEstimated: Math.round(emi),
      tenureMonths,
      interestRate
    },
    milestones: [
      { name: 'Booking Advance (10%)', amount: Math.round(customerPayable * 0.10) },
      { name: 'Material Dispatch (50%)', amount: Math.round(customerPayable * 0.50) },
      { name: 'Installation Complete (30%)', amount: Math.round(customerPayable * 0.30) },
      { name: 'Net Metering & Handover (10%)', amount: Math.round(customerPayable * 0.10) }
    ]
  });
};

module.exports = {
  calculateFinancing
};
