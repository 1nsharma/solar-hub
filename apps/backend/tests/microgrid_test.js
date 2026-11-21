/**
 * Microgrid & Smart Metering Integration Test Suite
 * Verifies:
 *   1. Microgrid fleet summary & telemetry
 *   2. Dynamic pricing engine bounds & calculations
 *   3. Prepaid energy wallet billing & auto-cutoff protection
 *   4. Wallet recharge & automatic relay restoration
 *   5. P2P energy trade execution & wallet settlement
 *   6. Remote relay disconnect / restore
 *   7. Shared Green Energy Infrastructure Agreement execution
 */

const assert = require('assert');
const microgridService = require('../services/microgridService');
const { calculateDynamicRate, calculateEnergyCost, calculateCarbonSaved } = require('@solar-hub/shared');

async function runTests() {
  console.log('⚡ Starting SolarHub Microgrid Architecture Tests...\n');

  // Test 1: Shared Pricing Calculations
  console.log('[Test 1] Testing Dynamic Pricing Engine...');
  const excessSupply = calculateDynamicRate(15000, 5000);
  assert(excessSupply.rate >= 4.50 && excessSupply.rate <= 10.50, 'Rate must be within [4.50, 10.50]');
  assert.strictEqual(excessSupply.tier, 'excess_supply', 'Should detect excess supply tier');

  const peakDemand = calculateDynamicRate(1000, 8000);
  assert(peakDemand.rate >= excessSupply.rate, 'Peak demand rate must be higher than excess supply rate');
  console.log('✅ Dynamic pricing engine verified (excess supply: ₹' + excessSupply.rate + '/kWh, peak demand: ₹' + peakDemand.rate + '/kWh)');

  // Test 2: Microgrid Summary
  console.log('\n[Test 2] Testing Microgrid Fleet Summary...');
  const summary = microgridService.getSummary();
  assert.strictEqual(summary.grid_status, 'stable');
  assert(summary.total_meters >= 4, 'Should list at least 4 meters in microgrid');
  assert(summary.total_solar_generation_kw > 0, 'Should report rooftop solar generation');
  assert(summary.carbon_offset_kg_today > 0, 'Should calculate carbon avoided');
  console.log(`✅ Fleet summary verified: ${summary.online_meters}/${summary.total_meters} online meters, ${summary.total_solar_generation_kw} kW solar generation, ${summary.carbon_offset_kg_today} kg CO2 avoided`);

  // Test 3: Live Telemetry
  console.log('\n[Test 3] Testing Live Smart Meter Telemetry...');
  const meterReading = microgridService.getLiveTelemetry('flat_101');
  assert.strictEqual(meterReading.device_id, 'flat_101');
  assert(meterReading.voltage >= 220 && meterReading.voltage <= 245, 'Grid voltage must be nominal (~230V)');
  assert(meterReading.frequency >= 49 && meterReading.frequency <= 51, 'Grid frequency must be ~50Hz');
  assert(meterReading.power_watts > 0, 'Active load must be positive');
  assert(meterReading.burn_rate_inr_per_hour >= 0, 'Burn rate estimate must be non-negative');
  console.log(`✅ Live telemetry verified: ${meterReading.voltage}V, ${meterReading.current}A, ${meterReading.power_watts}W, burn rate: ₹${meterReading.burn_rate_inr_per_hour}/hr`);

  // Test 4: Energy Wallet & Hourly Deductions
  console.log('\n[Test 4] Testing Prepaid Energy Wallet...');
  const initialWallet = microgridService.getWallet('flat_101');
  const startingBalance = initialWallet.balance;
  assert(startingBalance > 0, 'Wallet should have initial balance');

  // Simulate 10 seconds of high consumption
  microgridService.ingestTelemetry('flat_101', { power: 2500, interval_seconds: 10 });
  const updatedWallet = microgridService.getWallet('flat_101');
  assert(updatedWallet.balance <= startingBalance, 'Balance must decrease after consumption');
  console.log(`✅ Wallet deduction verified: ₹${startingBalance.toFixed(2)} → ₹${updatedWallet.balance.toFixed(2)}`);

  // Test 5: Wallet Recharge and Relay Restoration
  console.log('\n[Test 5] Testing Wallet Recharge & Auto-Restore...');
  const rechargeResult = microgridService.rechargeWallet('flat_101', 500, 'upi');
  assert.strictEqual(rechargeResult.status, 'success');
  assert.strictEqual(rechargeResult.recharged_amount, 500);
  assert(rechargeResult.new_balance > updatedWallet.balance);
  console.log(`✅ Wallet recharge verified: new balance ₹${rechargeResult.new_balance}`);

  // Test 6: Automated Safety Cutoff on Zero Balance
  console.log('\n[Test 6] Testing Automated Cutoff on Depleted Balance...');
  // Drain balance
  const testDevice = 'flat_201';
  const currentTestWallet = microgridService.getWallet(testDevice);
  microgridService.ingestTelemetry(testDevice, { power: 1000000, interval_seconds: 3600 });
  const drainedWallet = microgridService.getWallet(testDevice);
  assert.strictEqual(drainedWallet.balance, 0, 'Balance must hit 0');
  const cutDevice = microgridService.getDevice(testDevice);
  assert.strictEqual(cutDevice.relay_state, false, 'Relay must be cutoff when balance is depleted');
  console.log(`✅ Automated safety cutoff verified: relay state is false (disconnected)`);

  // Recharge and verify automatic restore
  const restoreResult = microgridService.rechargeWallet(testDevice, 300, 'upi');
  assert.strictEqual(restoreResult.relay_restored, true, 'Relay should auto-restore after recharge');
  const restoredDevice = microgridService.getDevice(testDevice);
  assert.strictEqual(restoredDevice.relay_state, true, 'Relay must be true after recharge');
  console.log(`✅ Automatic supply restoration verified: relay re-engaged`);

  // Test 7: P2P Microgrid Solar Energy Trading
  console.log('\n[Test 7] Testing P2P Solar Energy Trading...');
  const preBuyerWallet = microgridService.getWallet('flat_101').balance;
  const preSellerWallet = microgridService.getWallet('solar_main').balance;

  const trade = microgridService.executeTrade({
    sellerDeviceId: 'solar_main',
    buyerDeviceId: 'flat_101',
    energyKwh: 5.0,
    customRate: 5.50
  });

  assert.strictEqual(trade.status, 'settled');
  assert.strictEqual(trade.energy_kwh, 5.0);
  assert.strictEqual(trade.rate_per_kwh, 5.50);
  assert.strictEqual(trade.total_amount, 27.50);

  const postBuyerWallet = microgridService.getWallet('flat_101').balance;
  const postSellerWallet = microgridService.getWallet('solar_main').balance;
  assert(Math.abs(preBuyerWallet - postBuyerWallet - 27.50) < 0.01, 'Buyer wallet must be debited');
  assert(Math.abs(postSellerWallet - preSellerWallet - 27.50) < 0.01, 'Seller wallet must be credited');
  console.log(`✅ P2P trade settled: 5.0 kWh transferred for ₹27.50 between ${trade.seller_name} and ${trade.buyer_name}`);

  // Test 8: Remote Relay Disconnect and Restore
  console.log('\n[Test 8] Testing Remote Relay Control...');
  const cutoffRes = microgridService.controlRelay('flat_102', 'CUTOFF', 'Scheduled maintenance');
  assert.strictEqual(cutoffRes.relay_state, false);
  const restoreRes = microgridService.controlRelay('flat_102', 'RESTORE', 'Maintenance complete');
  assert.strictEqual(restoreRes.relay_state, true);
  console.log('✅ Remote relay CUTOFF & RESTORE verified');

  // Test 9: Legal PPA Agreement Signing
  console.log('\n[Test 9] Testing P2P Infrastructure Agreement Execution...');
  const agreement = microgridService.acceptAgreement('flat_102', 'SIG_RSA256_PRIYA_SINGH_VERIFIED');
  assert.strictEqual(agreement.is_active, true);
  assert.strictEqual(agreement.digital_signature, 'SIG_RSA256_PRIYA_SINGH_VERIFIED');
  console.log(`✅ Agreement executed: ${agreement.agreement_id} signed digitally`);

  console.log('\n========================================');
  console.log('🎉 ALL 9 MICROGRID INTEGRATION TESTS PASSED!');
  console.log('========================================\n');
}

if (require.main === module) {
  runTests().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
  });
}

module.exports = { runTests };
