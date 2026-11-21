/**
 * Unified Microgrid & Solar Trading Business Logic
 * Shared between backend, web-admin, and mobile client
 */

export const PRICING_CONFIG = {
  MIN_RATE: 4.50,
  BASE_RATE: 6.50,
  MAX_RATE: 10.50,
  DEFAULT_SECURITY_DEPOSIT: 2000.00,
  AUTO_CUTOFF_ZERO_BALANCE: true,
};

/**
 * Calculates dynamic tariff rate based on real-time solar supply, demand, and time of day
 * @param {number} solarProductionWatts - Total rooftop solar generation
 * @param {number} totalDemandWatts - Total microgrid load consumption
 * @param {Date} [time=new Date()] - Evaluation timestamp
 * @returns {{ rate: number, tier: string, multiplier: number }}
 */
export function calculateDynamicRate(solarProductionWatts, totalDemandWatts, time = new Date()) {
  const supplyDemandRatio = solarProductionWatts / Math.max(totalDemandWatts, 1);
  let baseRate = PRICING_CONFIG.BASE_RATE;
  let tier = 'normal';

  if (supplyDemandRatio >= 1.5) {
    // Excess clean solar supply: incentivize consumption or charging
    baseRate = PRICING_CONFIG.MIN_RATE + (PRICING_CONFIG.BASE_RATE - PRICING_CONFIG.MIN_RATE) * 0.2;
    tier = 'excess_supply';
  } else if (supplyDemandRatio >= 1.0) {
    // Balanced green supply
    baseRate = PRICING_CONFIG.MIN_RATE + (PRICING_CONFIG.BASE_RATE - PRICING_CONFIG.MIN_RATE) * 0.5;
    tier = 'balanced';
  } else if (supplyDemandRatio >= 0.5) {
    // Moderate microgrid demand
    baseRate = PRICING_CONFIG.BASE_RATE + (PRICING_CONFIG.MAX_RATE - PRICING_CONFIG.BASE_RATE) * 0.4;
    tier = 'normal';
  } else {
    // Peak deficit: high grid reliance
    baseRate = PRICING_CONFIG.MAX_RATE;
    tier = 'peak_demand';
  }

  // Time-of-day peak/off-peak multiplier
  const hour = time.getHours();
  let multiplier = 1.0;
  if (hour >= 6 && hour <= 10) {
    multiplier = 0.92; // Morning solar ramp incentive
  } else if (hour >= 11 && hour <= 15) {
    multiplier = 0.85; // Solar peak generation discount
  } else if (hour >= 18 && hour <= 22) {
    multiplier = 1.25; // Evening peak grid load
  }

  const finalRate = Math.max(
    PRICING_CONFIG.MIN_RATE,
    Math.min(PRICING_CONFIG.MAX_RATE, baseRate * multiplier)
  );

  return {
    rate: Math.round(finalRate * 100) / 100,
    tier,
    multiplier: Math.round(multiplier * 100) / 100,
  };
}

/**
 * Calculates energy cost for a reading interval
 * @param {number} powerWatts - Active load in Watts
 * @param {number} intervalSeconds - Interval duration
 * @param {number} ratePerKwh - Dynamic tariff rate in INR
 * @returns {number} cost in INR
 */
export function calculateEnergyCost(powerWatts, intervalSeconds, ratePerKwh) {
  const energyKwh = (powerWatts / 1000) * (intervalSeconds / 3600);
  return Math.round(energyKwh * ratePerKwh * 10000) / 10000;
}

/**
 * Calculates carbon offset saved by using solar vs coal grid (0.82 kg CO2 per kWh)
 * @param {number} solarKwh - Solar energy generated or traded
 * @returns {number} kg CO2 avoided
 */
export function calculateCarbonSaved(solarKwh) {
  return Math.round(solarKwh * 0.82 * 100) / 100;
}

/**
 * Formats electrical power reading
 * @param {number} watts
 * @returns {string} e.g. "1.45 kW" or "450 W"
 */
export function formatPower(watts) {
  if (watts >= 1000) {
    return `${(watts / 1000).toFixed(2)} kW`;
  }
  return `${Math.round(watts)} W`;
}
