const assert = require('assert');
const { calculateSubsidy, calculateSolarRecommendation, calculateFinancialROI } = require('./calculator.js');

assert.strictEqual(calculateSubsidy(1), 30000);
assert.strictEqual(calculateSubsidy(2), 60000);
assert.strictEqual(calculateSubsidy(3), 78000);
assert.strictEqual(calculateSubsidy(10), 78000);

const result = calculateSolarRecommendation({ monthlyBill: 7000, roofAreaSqFt: 475, tariffPerUnit: 7 });
assert.strictEqual(result.recommendedKw, 8 === 0 ? 0 : 5);
assert.strictEqual(result.centralSubsidy, 78000);
assert.strictEqual(result.requiredRoofSqFt, 760);
assert.strictEqual(result.roofConstraintWarning, true);
assert.ok(result.netCost > 0);
assert.ok(result.annualSavings > 0);

const roi = calculateFinancialROI(275000, 78000, 42000);
assert.strictEqual(roi.netCost, 197000);
assert.strictEqual(roi.paybackYears, 4.69);
assert.strictEqual(roi.lifetime25yrSavings, 853000);

console.log('SolarHub calculator tests passed');
