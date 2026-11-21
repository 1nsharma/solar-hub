export type UserRole = 'admin' | 'vendor' | 'technician' | 'customer' | 'partner' | 'ca';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  created_at?: string;
}

export interface Address {
  id: string;
  user_id: string;
  address_text: string;
  pincode: string;
  is_default: boolean;
  created_at?: string;
}

export interface Vendor {
  id: string;
  user_id: string;
  business_name: string;
  gst_number?: string;
  status: 'pending' | 'approved' | 'blocked';
  rating: number;
  created_at?: string;
}

export interface Technician {
  id: string;
  user_id: string;
  region: string;
  specialization?: string;
  status: 'active' | 'on_job' | 'inactive';
  rating: number;
  created_at?: string;
}

export interface Product {
  id: string;
  vendor_id?: string;
  vendor?: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  stock_quantity: number;
  rating: number;
  created_at?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  icon_name: string;
  created_at?: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  subsidy_amount: number;
  emi_details?: any;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'milestone_pending';
  payment_status: 'pending' | 'partial' | 'paid';
  address_id: string;
  created_at?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
}

export interface PaymentMilestone {
  id: string;
  order_id: string;
  milestone_name: string;
  amount: number;
  status: 'pending' | 'paid' | 'in_escrow';
  due_date?: string;
  paid_at?: string;
  created_at?: string;
}

export interface ServiceBooking {
  id: string;
  user_id: string;
  service_id: string;
  technician_id?: string;
  booking_date: string;
  time_slot: string;
  status: 'confirmed' | 'technician_assigned' | 'completed' | 'cancelled';
  address_id: string;
  created_at?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending_payment';
  start_date: string;
  end_date: string;
  recurring_amount: number;
  last_service_date?: string;
  next_service_date?: string;
  created_at?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_yearly: number;
  features: string[];
}

// ============================================================
// MICROGRID & SMART METERING ARCHITECTURE TYPES
// ============================================================

export type MeterDeviceRole = 'provider' | 'consumer' | 'prosumer';
export type MeterDeviceStatus = 'online' | 'offline' | 'error' | 'maintenance' | 'cutoff';

export interface MeterDevice {
  device_id: string;
  user_id?: string;
  device_type: 'smart_meter' | 'solar_inverter' | 'relay_module' | 'microgrid_gateway';
  location: string;
  role: MeterDeviceRole;
  relay_state: boolean;
  device_status: MeterDeviceStatus;
  firmware_version: string;
  wifi_rssi: number;
  last_seen: string;
}

export interface MeterTelemetry {
  device_id: string;
  voltage: number;
  current: number;
  power_watts: number;
  energy_kwh: number;
  frequency: number;
  power_factor: number;
  solar_generation_watts?: number;
  recorded_at: string;
}

export interface EnergyWallet {
  wallet_id?: string;
  device_id: string;
  balance: number;
  security_deposit: number;
  auto_cutoff_threshold: number;
  is_cutoff_active: boolean;
  current_rate: number;
  hourly_cost_estimate: number;
  last_recharge_at?: string;
  updated_at: string;
}

export interface DynamicPricingInfo {
  current_rate: number;
  base_rate: number;
  min_rate: number;
  max_rate: number;
  time_of_day_multiplier: number;
  pricing_tier: 'excess_supply' | 'normal' | 'peak_demand';
  solar_supply_watts: number;
  grid_demand_watts: number;
  last_updated: string;
}

export interface MicrogridTrade {
  trade_id: string;
  seller_device_id: string;
  seller_name?: string;
  buyer_device_id: string;
  buyer_name?: string;
  energy_kwh: number;
  rate_per_kwh: number;
  total_amount: number;
  trade_type: 'p2p_direct' | 'community_pool' | 'grid_export';
  status: 'matched' | 'settled' | 'disputed';
  settled_at: string;
}

export interface P2PAgreement {
  agreement_id: string;
  device_id: string;
  agreement_type: string;
  version: string;
  digital_signature: string;
  is_active: boolean;
  accepted_at: string;
}

export interface MicrogridEvent {
  event_id: string;
  device_id: string;
  event_type: 'cutoff' | 'restore' | 'safety_trip' | 'rate_change' | 'p2p_trade' | 'recharge';
  description: string;
  metadata?: any;
  created_at: string;
}

export interface MicrogridSummary {
  grid_status: 'stable' | 'peak' | 'constrained';
  total_meters: number;
  online_meters: number;
  total_solar_generation_kw: number;
  total_microgrid_demand_kw: number;
  active_trades_count: number;
  current_tariff: number;
  carbon_offset_kg_today: number;
}

export const TYPES_VERSION = "1.3.0";

