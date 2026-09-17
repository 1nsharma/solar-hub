const DEFAULT_TARIFF = 7;
const GENERATION_PER_KW_MONTH = 125;
const ROOF_SQFT_PER_KW = 95;
const TURNKEY_COST_PER_KW = 55000;

function calculateSubsidy(recommendedKw) {
  const kw = Math.max(0, Number(recommendedKw) || 0);
  return Math.min(78000, Math.floor(kw) * 30000);
}

function calculateFinancialROI(grossCost, subsidy, annualSavings) {
  const gross = Math.max(0, Number(grossCost) || 0);
  const centralSubsidy = Math.max(0, Number(subsidy) || 0);
  const savings = Math.max(0, Number(annualSavings) || 0);
  const netCost = Math.max(0, gross - centralSubsidy);
  const paybackYears = savings > 0 ? netCost / savings : null;
  return {
    grossCost: Math.round(gross),
    centralSubsidy: Math.round(centralSubsidy),
    netCost: Math.round(netCost),
    paybackYears: paybackYears == null ? null : Number(paybackYears.toFixed(2)),
    lifetime25yrSavings: Math.round(Math.max(0, savings * 25 - netCost)),
  };
}

function calculateSolarRecommendation({ monthlyBill = 0, roofAreaSqFt = 0, state = 'UP', tariffPerUnit = DEFAULT_TARIFF } = {}) {
  const bill = Math.max(0, Number(monthlyBill) || 0);
  const roof = Math.max(0, Number(roofAreaSqFt) || 0);
  const tariff = Math.max(0.01, Number(tariffPerUnit) || DEFAULT_TARIFF);
  const monthlyConsumption = bill / tariff;
  const billDrivenKw = monthlyConsumption / GENERATION_PER_KW_MONTH;
  const roofMaxKw = roof > 0 ? roof / ROOF_SQFT_PER_KW : Infinity;
  const recommendedKw = Math.max(0, Math.min(Math.ceil(billDrivenKw), Math.floor(roofMaxKw)));
  const effectiveKw = recommendedKw || (roof > 0 ? Math.min(1, Math.floor(roofMaxKw)) : Math.max(1, Math.ceil(billDrivenKw)));
  const monthlyUnits = effectiveKw * GENERATION_PER_KW_MONTH;
  const annualUnits = monthlyUnits * 12;
  const annualSavings = Math.min(monthlyConsumption, monthlyUnits) * tariff * 12;
  const monthlySavings = annualSavings / 12;
  const grossCost = effectiveKw * TURNKEY_COST_PER_KW;
  const centralSubsidy = calculateSubsidy(effectiveKw);
  const roi = calculateFinancialROI(grossCost, centralSubsidy, annualSavings);
  const requiredRoofSqFt = Math.max(0, Math.ceil(Math.max(1, Math.ceil(billDrivenKw)) * ROOF_SQFT_PER_KW));
  return {
    state,
    assumptions: { tariffPerUnit: tariff, generationPerKwMonth: GENERATION_PER_KW_MONTH, roofSqFtPerKw: ROOF_SQFT_PER_KW, turnkeyCostPerKw: TURNKEY_COST_PER_KW },
    recommendedKw: effectiveKw,
    monthlyUnits: Math.round(monthlyUnits),
    annualUnits: Math.round(annualUnits),
    grossCost: roi.grossCost,
    centralSubsidy: roi.centralSubsidy,
    netCost: roi.netCost,
    monthlySavings: Math.round(monthlySavings),
    annualSavings: Math.round(annualSavings),
    paybackYears: roi.paybackYears,
    lifetime25yrSavings: roi.lifetime25yrSavings,
    co2OffsetTonsPerYear: Number((annualUnits * 0.7 / 1000).toFixed(2)),
    roofConstraintWarning: roof > 0 && roof < requiredRoofSqFt,
    requiredRoofSqFt,
  };
}

export { calculateSolarRecommendation, calculateSubsidy, calculateFinancialROI, DEFAULT_TARIFF, GENERATION_PER_KW_MONTH, ROOF_SQFT_PER_KW, TURNKEY_COST_PER_KW };
export default calculateSolarRecommendation;
