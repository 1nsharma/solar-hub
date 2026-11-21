import Constants from 'expo-constants';
import { Platform } from 'react-native';

const extraApiUrl = Constants.expoConfig?.extra?.apiUrl;

// Logic to extract host IP for physical devices running Expo Go
const getHostIp = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    return debuggerHost.split(':')[0];
  }
  return null;
};

const hostIp = getHostIp();
const DEFAULT_API_URL = Platform.OS === 'android' 
  ? (hostIp ? `http://${hostIp}:5001` : 'http://10.0.2.2:5001') 
  : (hostIp ? `http://${hostIp}:5001` : 'http://localhost:5001');

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || extraApiUrl || DEFAULT_API_URL;

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

// ============================================================
// MICROGRID & SMART METERING API CLIENT
// ============================================================

export async function fetchMicrogridSummary() {
  try {
    const res = await fetch(apiUrl('/api/microgrid/summary'));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.log('[API] Using mock microgrid summary:', err);
    return {
      grid_status: 'stable',
      total_meters: 4,
      online_meters: 4,
      total_solar_generation_kw: 9.45,
      total_microgrid_demand_kw: 5.82,
      active_trades_count: 8,
      current_tariff: 5.80,
      carbon_offset_kg_today: 117.1,
      last_updated: new Date().toISOString()
    };
  }
}

export async function fetchLiveMeter(deviceId: string = 'flat_101') {
  try {
    const res = await fetch(apiUrl(`/api/microgrid/telemetry/${deviceId}`));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.log('[API] Using mock live meter data:', err);
    return {
      device_id: deviceId,
      device_name: deviceId === 'solar_main' ? 'Rooftop Solar Array 15kW' : 'Flat 101 - Smart Meter',
      role: deviceId === 'solar_main' ? 'provider' : 'consumer',
      location: deviceId === 'solar_main' ? 'Building Rooftop' : '1st Floor East Wing',
      voltage: 231.4,
      current: 6.18,
      power_watts: deviceId === 'solar_main' ? 9450 : 1420,
      energy_kwh: 14.85,
      frequency: 50.01,
      power_factor: 0.99,
      solar_generation_watts: deviceId === 'solar_main' ? 9450 : 0,
      relay_state: true,
      device_status: 'online',
      wifi_rssi: -58,
      current_rate: 5.80,
      burn_rate_inr_per_hour: 8.24,
      recorded_at: new Date().toISOString()
    };
  }
}

export async function fetchWallet(deviceId: string = 'flat_101') {
  try {
    const res = await fetch(apiUrl(`/api/microgrid/wallet/${deviceId}`));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.log('[API] Using mock wallet data:', err);
    return {
      device_id: deviceId,
      balance: 620.40,
      security_deposit: 2000.00,
      auto_cutoff_threshold: 0.00,
      is_cutoff_active: false,
      current_rate: 5.80,
      hourly_cost_estimate: 8.24,
      device_status: 'online',
      relay_state: true,
      updated_at: new Date().toISOString()
    };
  }
}

export async function rechargeWallet(deviceId: string, amount: number, paymentMethod: string = 'upi') {
  try {
    const res = await fetch(apiUrl('/api/microgrid/wallet/recharge'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, amount, paymentMethod })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.log('[API] Using mock wallet recharge response:', err);
    return {
      status: 'success',
      deviceId,
      recharged_amount: amount,
      new_balance: 620.40 + amount,
      relay_restored: true,
      payment_method: paymentMethod,
      timestamp: new Date().toISOString()
    };
  }
}

export async function fetchDynamicPricing() {
  try {
    const res = await fetch(apiUrl('/api/microgrid/pricing/current'));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      current_rate: 5.80,
      base_rate: 6.50,
      min_rate: 4.50,
      max_rate: 10.50,
      time_of_day_multiplier: 0.92,
      pricing_tier: 'excess_supply',
      solar_supply_watts: 9450,
      grid_demand_watts: 5820,
      last_updated: new Date().toISOString()
    };
  }
}

export async function fetchMicrogridTrades(deviceId?: string) {
  try {
    const url = deviceId ? apiUrl(`/api/microgrid/trades?deviceId=${deviceId}`) : apiUrl('/api/microgrid/trades');
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      trades: [
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
      ]
    };
  }
}

export async function executeMicrogridTrade(tradeData: {
  sellerDeviceId: string;
  buyerDeviceId: string;
  energyKwh: number;
  customRate?: number;
}) {
  try {
    const res = await fetch(apiUrl('/api/microgrid/trades/execute'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tradeData)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    const rate = tradeData.customRate || 5.80;
    return {
      trade_id: `TRD-${Date.now()}`,
      seller_device_id: tradeData.sellerDeviceId,
      buyer_device_id: tradeData.buyerDeviceId,
      energy_kwh: tradeData.energyKwh,
      rate_per_kwh: rate,
      total_amount: parseFloat((tradeData.energyKwh * rate).toFixed(2)),
      trade_type: 'p2p_direct',
      status: 'settled',
      settled_at: new Date().toISOString()
    };
  }
}

export async function controlMeterRelay(deviceId: string, command: 'CUTOFF' | 'RESTORE', reason?: string) {
  try {
    const res = await fetch(apiUrl('/api/microgrid/relay/control'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, command, reason })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      status: 'success',
      deviceId,
      command,
      relay_state: command !== 'CUTOFF',
      device_status: command === 'CUTOFF' ? 'cutoff' : 'online',
      timestamp: new Date().toISOString()
    };
  }
}

export async function fetchP2PAgreement(deviceId: string = 'flat_101') {
  try {
    const res = await fetch(apiUrl(`/api/microgrid/agreement/${deviceId}`));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      agreement_id: 'AGR-2026-101',
      device_id: deviceId,
      agreement_type: 'shared_green_energy_infrastructure',
      version: '1.0',
      is_active: true,
      digital_signature: 'SIG_RSA256_VERIFIED',
      accepted_at: '2026-01-15T10:00:00.000Z'
    };
  }
}

export async function acceptP2PAgreement(deviceId: string, digitalSignature: string) {
  try {
    const res = await fetch(apiUrl('/api/microgrid/agreement/accept'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, digitalSignature })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      message: 'Agreement accepted successfully',
      agreement: {
        agreement_id: `AGR-2026-${Date.now().toString().slice(-4)}`,
        device_id: deviceId,
        digital_signature: digitalSignature,
        is_active: true,
        accepted_at: new Date().toISOString()
      }
    };
  }
}


