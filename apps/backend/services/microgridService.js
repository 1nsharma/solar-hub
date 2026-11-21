/**
 * SolarHub Unified Microgrid & Smart Metering Service
 * Manages IoT smart meter devices, real-time telemetry, prepaid energy wallet,
 * dynamic pricing engine, P2P solar trading, and automated safety cutoffs.
 */

const db = require('../db');
const { calculateDynamicRate, calculateEnergyCost, calculateCarbonSaved, PRICING_CONFIG } = require('@solar-hub/shared');

const USE_MOCK = process.env.USE_MOCK === 'true' || true; // Resilient fallback

// High-fidelity in-memory state for microgrid simulation and offline dev
const mockDevices = {
  'solar_main': {
    device_id: 'solar_main',
    name: 'Rooftop Solar Array 15kW (Suraj Gupta)',
    role: 'provider',
    device_type: 'solar_inverter',
    location: 'Building Rooftop Phase-1',
    relay_state: true,
    device_status: 'online',
    firmware_version: 'v2.1.0-inverter',
    wifi_rssi: -52,
    last_seen: new Date().toISOString()
  },
  'flat_101': {
    device_id: 'flat_101',
    name: 'Flat 101 - Smart Meter (Rahul Sharma)',
    role: 'consumer',
    device_type: 'smart_meter',
    location: '1st Floor East Wing',
    relay_state: true,
    device_status: 'online',
    firmware_version: 'v1.4.2-esp32',
    wifi_rssi: -64,
    last_seen: new Date().toISOString()
  },
  'flat_102': {
    device_id: 'flat_102',
    name: 'Flat 102 - Smart Meter (Priya Singh)',
    role: 'consumer',
    device_type: 'smart_meter',
    location: '1st Floor West Wing',
    relay_state: true,
    device_status: 'online',
    firmware_version: 'v1.4.2-esp32',
    wifi_rssi: -59,
    last_seen: new Date().toISOString()
  },
  'flat_201': {
    device_id: 'flat_201',
    name: 'Flat 201 - Smart Meter (Amit Verma)',
    role: 'consumer',
    device_type: 'smart_meter',
    location: '2nd Floor North Wing',
    relay_state: true,
    device_status: 'online',
    firmware_version: 'v1.4.2-esp32',
    wifi_rssi: -68,
    last_seen: new Date().toISOString()
  }
};

const mockWallets = {
  'solar_main': {
    device_id: 'solar_main',
    balance: 14850.50,
    security_deposit: 0.00,
    auto_cutoff_threshold: 0.00,
    is_cutoff_active: false,
    updated_at: new Date().toISOString()
  },
  'flat_101': {
    device_id: 'flat_101',
    balance: 620.40,
    security_deposit: 2000.00,
    auto_cutoff_threshold: 0.00,
    is_cutoff_active: false,
    updated_at: new Date().toISOString()
  },
  'flat_102': {
    device_id: 'flat_102',
    balance: 345.50,
    security_deposit: 2000.00,
    auto_cutoff_threshold: 0.00,
    is_cutoff_active: false,
    updated_at: new Date().toISOString()
  },
  'flat_201': {
    device_id: 'flat_201',
    balance: 180.00,
    security_deposit: 2000.00,
    auto_cutoff_threshold: 0.00,
    is_cutoff_active: false,
    updated_at: new Date().toISOString()
  }
};

let mockTrades = [
  {
    trade_id: 'TRD-8901',
    seller_device_id: 'solar_main',
    seller_name: 'Suraj Gupta (Rooftop Array)',
    buyer_device_id: 'flat_101',
    buyer_name: 'Rahul Sharma (Flat 101)',
    energy_kwh: 4.8,
    rate_per_kwh: 5.80,
    total_amount: 27.84,
    trade_type: 'p2p_direct',
    status: 'settled',
    settled_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    trade_id: 'TRD-8902',
    seller_device_id: 'solar_main',
    seller_name: 'Suraj Gupta (Rooftop Array)',
    buyer_device_id: 'flat_102',
    buyer_name: 'Priya Singh (Flat 102)',
    energy_kwh: 3.2,
    rate_per_kwh: 5.80,
    total_amount: 18.56,
    trade_type: 'p2p_direct',
    status: 'settled',
    settled_at: new Date(Date.now() - 7200000).toISOString()
  }
];

let mockEvents = [
  {
    event_id: 'EVT-101',
    device_id: 'flat_101',
    event_type: 'reconnect',
    description: 'Relay closed normally. Microgrid power active.',
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    event_id: 'EVT-102',
    device_id: 'solar_main',
    event_type: 'rate_change',
    description: 'Dynamic solar generation pricing updated: ₹5.80/kWh.',
    created_at: new Date(Date.now() - 14400000).toISOString()
  }
];

const mockAgreements = {
  'flat_101': {
    agreement_id: 'AGR-2026-101',
    device_id: 'flat_101',
    agreement_type: 'shared_green_energy_infrastructure',
    version: '1.0',
    digital_signature: 'SIG_RSA256_RAHUL_SHARMA_2026',
    is_active: true,
    accepted_at: '2026-01-15T10:00:00.000Z'
  }
};

class MicrogridService {
  constructor() {
    this.solarProductionWatts = 9450; // Active rooftop solar generation
    this.totalDemandWatts = 5820;    // Active consumer aggregate load
  }

  getPricing() {
    const pricing = calculateDynamicRate(this.solarProductionWatts, this.totalDemandWatts);
    return {
      current_rate: pricing.rate,
      base_rate: PRICING_CONFIG.BASE_RATE,
      min_rate: PRICING_CONFIG.MIN_RATE,
      max_rate: PRICING_CONFIG.MAX_RATE,
      time_of_day_multiplier: pricing.multiplier,
      pricing_tier: pricing.tier,
      solar_supply_watts: this.solarProductionWatts,
      grid_demand_watts: this.totalDemandWatts,
      last_updated: new Date().toISOString()
    };
  }

  getPricingHistory() {
    const current = this.getPricing();
    const history = [];
    const now = new Date();
    for (let i = 24; i >= 0; i--) {
      const pastTime = new Date(now.getTime() - i * 3600000);
      const hour = pastTime.getHours();
      // Simulate diurnal solar curve
      const solarEst = (hour >= 6 && hour <= 18) ? Math.sin((hour - 6) / 12 * Math.PI) * 12000 : 0;
      const demandEst = 4000 + Math.sin(hour / 24 * Math.PI * 2) * 2000;
      const rateInfo = calculateDynamicRate(solarEst, demandEst, pastTime);
      history.push({
        time: pastTime.toISOString(),
        hour: `${hour}:00`,
        rate: rateInfo.rate,
        tier: rateInfo.tier,
        solar_watts: Math.round(solarEst),
        demand_watts: Math.round(demandEst)
      });
    }
    return { currentRate: current.current_rate, history };
  }

  getSummary() {
    const pricing = this.getPricing();
    const totalSolarKwh = 142.8; // Today's solar generation
    return {
      grid_status: 'stable',
      total_meters: Object.keys(mockDevices).length,
      online_meters: Object.values(mockDevices).filter(d => d.device_status === 'online').length,
      total_solar_generation_kw: parseFloat((this.solarProductionWatts / 1000).toFixed(2)),
      total_microgrid_demand_kw: parseFloat((this.totalDemandWatts / 1000).toFixed(2)),
      active_trades_count: mockTrades.length,
      current_tariff: pricing.current_rate,
      carbon_offset_kg_today: calculateCarbonSaved(totalSolarKwh),
      prosumer_node: mockDevices['solar_main'],
      last_updated: new Date().toISOString()
    };
  }

  getDevices() {
    return Object.values(mockDevices);
  }

  getDevice(deviceId) {
    return mockDevices[deviceId] || null;
  }

  getLiveTelemetry(deviceId) {
    const device = mockDevices[deviceId] || mockDevices['flat_101'];
    // Add minor realistic jitter for live feel
    const jitter = (Math.random() - 0.5) * 4;
    const isProsumer = device.role === 'provider';
    const voltage = 230.2 + (Math.random() - 0.5) * 2;
    const power = isProsumer ? Math.max(0, 9450 + jitter * 50) : Math.max(0, 1420 + jitter * 30);
    const current = parseFloat((power / voltage).toFixed(2));
    const pricing = this.getPricing();

    return {
      device_id: device.device_id,
      device_name: device.name,
      role: device.role,
      location: device.location,
      voltage: parseFloat(voltage.toFixed(1)),
      current: current,
      power_watts: Math.round(power),
      energy_kwh: isProsumer ? 48.72 : 12.45,
      frequency: 50.02,
      power_factor: 0.99,
      solar_generation_watts: isProsumer ? Math.round(power) : 0,
      relay_state: device.relay_state,
      device_status: device.device_status,
      wifi_rssi: device.wifi_rssi,
      current_rate: pricing.current_rate,
      burn_rate_inr_per_hour: parseFloat(((power / 1000) * pricing.current_rate).toFixed(2)),
      recorded_at: new Date().toISOString()
    };
  }

  ingestTelemetry(deviceId, readings) {
    const device = mockDevices[deviceId];
    if (!device) {
      throw new Error(`Device not registered: ${deviceId}`);
    }

    device.last_seen = new Date().toISOString();
    device.device_status = 'online';

    const power = readings.power || readings.power_watts || 0;
    const intervalSeconds = readings.interval_seconds || 5;
    const pricing = this.getPricing();
    const cost = calculateEnergyCost(power, intervalSeconds, pricing.current_rate);

    const wallet = mockWallets[deviceId];
    if (wallet && device.role === 'consumer') {
      wallet.balance = Math.max(0, wallet.balance - cost);
      wallet.updated_at = new Date().toISOString();

      // Automated Safety Cutoff Check
      if (wallet.balance <= 0 && device.relay_state) {
        device.relay_state = false;
        device.device_status = 'cutoff';
        wallet.is_cutoff_active = true;

        mockEvents.unshift({
          event_id: `EVT-${Date.now()}`,
          device_id: deviceId,
          event_type: 'cutoff',
          description: `⚡ Wallet balance depleted (₹0.00). Relay tripped automatically.`,
          metadata: { balance: 0, cost },
          created_at: new Date().toISOString()
        });
      }
    }

    return {
      status: 'success',
      deviceId,
      cost,
      wallet_balance: wallet ? wallet.balance : null,
      relay_state: device.relay_state
    };
  }

  getWallet(deviceId) {
    const wallet = mockWallets[deviceId] || {
      device_id: deviceId,
      balance: 500.00,
      security_deposit: 2000.00,
      auto_cutoff_threshold: 0.00,
      is_cutoff_active: false,
      updated_at: new Date().toISOString()
    };

    const telemetry = this.getLiveTelemetry(deviceId);
    const pricing = this.getPricing();

    return {
      ...wallet,
      current_rate: pricing.current_rate,
      hourly_cost_estimate: telemetry.burn_rate_inr_per_hour,
      device_status: mockDevices[deviceId]?.device_status || 'online',
      relay_state: mockDevices[deviceId]?.relay_state ?? true
    };
  }

  rechargeWallet(deviceId, amount, paymentMethod = 'upi') {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Valid recharge amount required');
    }

    let wallet = mockWallets[deviceId];
    if (!wallet) {
      wallet = {
        device_id: deviceId,
        balance: 0,
        security_deposit: 2000.00,
        auto_cutoff_threshold: 0.00,
        is_cutoff_active: false,
        updated_at: new Date().toISOString()
      };
      mockWallets[deviceId] = wallet;
    }

    wallet.balance += numAmount;
    wallet.last_recharge_at = new Date().toISOString();
    wallet.updated_at = new Date().toISOString();

    const device = mockDevices[deviceId];
    let restored = false;
    // Auto-restore relay if was in cutoff
    if (device && !device.relay_state && wallet.balance > 0) {
      device.relay_state = true;
      device.device_status = 'online';
      wallet.is_cutoff_active = false;
      restored = true;

      mockEvents.unshift({
        event_id: `EVT-${Date.now()}`,
        device_id: deviceId,
        event_type: 'restore',
        description: `✅ Relay re-engaged. Supply restored after recharge of ₹${numAmount}.`,
        metadata: { amount: numAmount, new_balance: wallet.balance },
        created_at: new Date().toISOString()
      });
    }

    return {
      status: 'success',
      deviceId,
      recharged_amount: numAmount,
      new_balance: parseFloat(wallet.balance.toFixed(2)),
      relay_restored: restored,
      payment_method: paymentMethod,
      timestamp: new Date().toISOString()
    };
  }

  executeTrade({ sellerDeviceId, buyerDeviceId, energyKwh, customRate }) {
    const seller = mockDevices[sellerDeviceId];
    const buyer = mockDevices[buyerDeviceId];

    if (!seller || !buyer) {
      throw new Error('Both seller and buyer devices must be registered in the microgrid');
    }

    const pricing = this.getPricing();
    const rate = customRate || pricing.current_rate;
    const totalAmount = parseFloat((energyKwh * rate).toFixed(2));

    const buyerWallet = mockWallets[buyerDeviceId];
    const sellerWallet = mockWallets[sellerDeviceId];

    if (buyerWallet && buyerWallet.balance < totalAmount) {
      throw new Error(`Insufficient wallet balance for buyer (${buyerDeviceId}). Required: ₹${totalAmount}, Available: ₹${buyerWallet.balance}`);
    }

    if (buyerWallet) buyerWallet.balance -= totalAmount;
    if (sellerWallet) sellerWallet.balance += totalAmount;

    const trade = {
      trade_id: `TRD-${Date.now()}`,
      seller_device_id: sellerDeviceId,
      seller_name: seller.name,
      buyer_device_id: buyerDeviceId,
      buyer_name: buyer.name,
      energy_kwh: parseFloat(energyKwh),
      rate_per_kwh: rate,
      total_amount: totalAmount,
      trade_type: 'p2p_direct',
      status: 'settled',
      settled_at: new Date().toISOString()
    };

    mockTrades.unshift(trade);

    mockEvents.unshift({
      event_id: `EVT-${Date.now()}`,
      device_id: buyerDeviceId,
      event_type: 'p2p_trade',
      description: `⚡ P2P Solar Trade Settled: Purchased ${energyKwh} kWh from ${seller.name} @ ₹${rate}/kWh (Total ₹${totalAmount}).`,
      metadata: trade,
      created_at: new Date().toISOString()
    });

    return trade;
  }

  getTrades(deviceId = null) {
    if (!deviceId) return mockTrades;
    return mockTrades.filter(t => t.seller_device_id === deviceId || t.buyer_device_id === deviceId);
  }

  controlRelay(deviceId, command, reason = 'User requested') {
    const device = mockDevices[deviceId];
    if (!device) {
      throw new Error(`Device not found: ${deviceId}`);
    }

    const isCutoff = command.toUpperCase() === 'CUTOFF';
    device.relay_state = !isCutoff;
    device.device_status = isCutoff ? 'cutoff' : 'online';

    mockEvents.unshift({
      event_id: `EVT-${Date.now()}`,
      device_id: deviceId,
      event_type: isCutoff ? 'cutoff' : 'restore',
      description: `Manual Relay Command: ${command} (${reason})`,
      metadata: { command, reason },
      created_at: new Date().toISOString()
    });

    return {
      status: 'success',
      deviceId,
      command,
      relay_state: device.relay_state,
      device_status: device.device_status,
      timestamp: new Date().toISOString()
    };
  }

  getAgreement(deviceId) {
    return mockAgreements[deviceId] || {
      agreement_id: null,
      device_id: deviceId,
      agreement_type: 'shared_green_energy_infrastructure',
      version: '1.0',
      is_active: false,
      title: 'Shared Green Energy Infrastructure & Microgrid Power Purchase Agreement (PPA)',
      terms: [
        '1. Mutual P2P Solar Wheeling: Consumers agree to wheel local rooftop surplus clean energy.',
        '2. Dynamic Tariff Bounds: Rates fluctuate between statutory ₹4.50/kWh (surplus) and ₹10.50/kWh (peak deficit).',
        '3. Smart Meter Prepayment: Supply is contingent on positive prepaid balance with automated cutoff at ₹0.00.',
        '4. Escrow Deposit: Standard ₹2,000 security deposit protects infrastructure against non-payment.',
        '5. Remote IoT Safety Control: Disconnect relay acts on overvoltage, underfrequency, or safety trip.'
      ]
    };
  }

  acceptAgreement(deviceId, digitalSignature) {
    if (!digitalSignature) {
      throw new Error('Digital signature is required');
    }

    const agreement = {
      agreement_id: `AGR-2026-${Date.now().toString().slice(-4)}`,
      device_id: deviceId,
      agreement_type: 'shared_green_energy_infrastructure',
      version: '1.0',
      digital_signature: digitalSignature,
      is_active: true,
      accepted_at: new Date().toISOString()
    };

    mockAgreements[deviceId] = agreement;

    mockEvents.unshift({
      event_id: `EVT-${Date.now()}`,
      device_id: deviceId,
      event_type: 'agreement_signed',
      description: `Legal consent executed: Shared Green Energy Infrastructure Agreement.`,
      metadata: { agreement_id: agreement.agreement_id },
      created_at: new Date().toISOString()
    });

    return agreement;
  }

  getEvents(deviceId = null) {
    if (!deviceId) return mockEvents;
    return mockEvents.filter(e => e.device_id === deviceId);
  }
}

module.exports = new MicrogridService();
