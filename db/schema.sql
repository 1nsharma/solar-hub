-- SolarHub Database Schema (PostgreSQL)

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    role VARCHAR(50) DEFAULT 'customer', -- customer, admin, vendor, technician, partner
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Addresses
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    address_text TEXT NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Vendors Table
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    gst_number VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, blocked
    rating DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Vendor Verifications (Trust Engine)
CREATE TABLE vendor_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    gst_verified BOOLEAN DEFAULT false,
    kyc_status VARCHAR(50) DEFAULT 'pending', -- pending, verified, rejected
    documents JSONB,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Technicians Table
CREATE TABLE technicians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    region VARCHAR(100) NOT NULL,
    specialization VARCHAR(255), -- solar, batteries, wiring
    status VARCHAR(50) DEFAULT 'active', -- active, on_job, inactive
    rating DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    vendor VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    category VARCHAR(100),
    image_url TEXT,
    stock_quantity INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Services Table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration VARCHAR(50),
    icon_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Orders Table (Transaction Control Layer)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    total_amount DECIMAL(12,2) NOT NULL,
    subsidy_amount DECIMAL(12,2) DEFAULT 0.00,
    emi_details JSONB,
    status VARCHAR(50) DEFAULT 'processing', -- processing, shipped, delivered, cancelled, milestone_pending
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, partial, paid
    address_id UUID REFERENCES addresses(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Order Items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL(12,2) NOT NULL
);

-- 10. Payment Milestones (Transaction Control Layer - Escrow/Tranches)
CREATE TABLE payment_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    milestone_name VARCHAR(100) NOT NULL, -- e.g., 'Booking Advance', 'Material Dispatch', 'Installation Complete'
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, paid, in_escrow
    due_date TIMESTAMP,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Service Bookings
CREATE TABLE service_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    service_id UUID REFERENCES services(id),
    technician_id UUID REFERENCES technicians(id),
    booking_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed', -- confirmed, technician_assigned, completed, cancelled
    address_id UUID REFERENCES addresses(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Service Programs
CREATE TABLE service_programs (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    channel VARCHAR(100) NOT NULL,
    revenue_model VARCHAR(100) DEFAULT 'non_monetized_service_workflow',
    customer_charge_owner VARCHAR(100),
    platform_revenue BOOLEAN DEFAULT false,
    features JSONB DEFAULT '[]'::jsonb,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Ecommerce Revenue Events
CREATE TABLE ecommerce_revenue_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    gross_amount DECIMAL(12,2) NOT NULL,
    platform_margin DECIMAL(12,2),
    commission_amount DECIMAL(12,2),
    source VARCHAR(50) DEFAULT 'product_checkout',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Partners Table (Solopreneurs/Referrers)
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    referral_code VARCHAR(50) UNIQUE NOT NULL,
    payout_details JSONB, 
    status VARCHAR(50) DEFAULT 'active', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. Leads Table (Referred Customers)
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES partners(id),
    name VARCHAR(255),
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    pincode VARCHAR(10),
    requirement TEXT,
    interest_type VARCHAR(100), 
    estimated_load DECIMAL(10,2), 
    status VARCHAR(50) DEFAULT 'new', 
    notes TEXT,
    source VARCHAR(50) DEFAULT 'web',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. Commissions Table
CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES partners(id),
    lead_id UUID REFERENCES leads(id),
    order_id UUID REFERENCES orders(id), 
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', 
    payout_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. Payments Table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    booking_id UUID REFERENCES service_bookings(id),
    milestone_id UUID REFERENCES payment_milestones(id),
    amount DECIMAL(12,2) NOT NULL,
    method VARCHAR(50), 
    transaction_id VARCHAR(255) UNIQUE,
    status VARCHAR(50) DEFAULT 'success', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. Audit Logs Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, 
    entity_id UUID NOT NULL,
    old_value JSONB,
    new_value JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 19. UNIFIED MICROGRID & SMART METERING ARCHITECTURE
-- Interconnecting SolarHub Expo with solar_wallet IoT Database
-- ============================================================

-- Meter Device Registry
CREATE TABLE IF NOT EXISTS meter_devices (
    device_id VARCHAR(50) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    device_type VARCHAR(50) NOT NULL DEFAULT 'smart_meter', -- 'smart_meter', 'solar_inverter', 'relay_module', 'microgrid_gateway'
    location VARCHAR(255) DEFAULT 'Building Microgrid Main',
    role VARCHAR(20) NOT NULL DEFAULT 'consumer', -- 'provider', 'consumer', 'prosumer'
    relay_state BOOLEAN DEFAULT true,
    device_status VARCHAR(20) DEFAULT 'online', -- 'online', 'offline', 'error', 'maintenance', 'cutoff'
    firmware_version VARCHAR(20) DEFAULT 'v1.4.2-esp32',
    wifi_rssi INTEGER DEFAULT -58,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Smart Meter Real-Time Telemetry
CREATE TABLE IF NOT EXISTS meter_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id VARCHAR(50) NOT NULL REFERENCES meter_devices(device_id) ON DELETE CASCADE,
    voltage DECIMAL(6, 2) NOT NULL DEFAULT 230.0,
    current DECIMAL(6, 3) NOT NULL DEFAULT 0.0,
    power_watts DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
    energy_kwh DECIMAL(12, 4) NOT NULL DEFAULT 0.0,
    frequency DECIMAL(5, 2) NOT NULL DEFAULT 50.0,
    power_factor DECIMAL(4, 3) NOT NULL DEFAULT 0.99,
    solar_generation_watts DECIMAL(10, 2) DEFAULT 0.0,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Energy Wallets (Prepaid microgrid metering balance)
CREATE TABLE IF NOT EXISTS energy_wallets (
    wallet_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id VARCHAR(50) UNIQUE NOT NULL REFERENCES meter_devices(device_id) ON DELETE CASCADE,
    balance DECIMAL(12, 2) NOT NULL DEFAULT 500.00 CHECK (balance >= 0),
    security_deposit DECIMAL(10, 2) NOT NULL DEFAULT 2000.00,
    auto_cutoff_threshold DECIMAL(6, 2) NOT NULL DEFAULT 0.00,
    is_cutoff_active BOOLEAN DEFAULT false,
    last_recharge_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dynamic Pricing Engine Log
CREATE TABLE IF NOT EXISTS dynamic_pricing_log (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    current_rate DECIMAL(6, 2) NOT NULL,
    base_rate DECIMAL(6, 2) NOT NULL DEFAULT 6.50,
    solar_supply_watts DECIMAL(10, 2) NOT NULL,
    grid_demand_watts DECIMAL(10, 2) NOT NULL,
    time_of_day_multiplier DECIMAL(4, 2) DEFAULT 1.0,
    pricing_tier VARCHAR(20) DEFAULT 'normal', -- 'excess_supply', 'normal', 'peak_demand'
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- P2P Microgrid Energy Trades (Prosumer-to-Consumer / Consumer-to-Grid)
CREATE TABLE IF NOT EXISTS microgrid_trades (
    trade_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_device_id VARCHAR(50) NOT NULL REFERENCES meter_devices(device_id),
    buyer_device_id VARCHAR(50) NOT NULL REFERENCES meter_devices(device_id),
    energy_kwh DECIMAL(10, 4) NOT NULL,
    rate_per_kwh DECIMAL(6, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    trade_type VARCHAR(30) DEFAULT 'p2p_direct', -- 'p2p_direct', 'community_pool', 'grid_export'
    status VARCHAR(20) DEFAULT 'settled', -- 'matched', 'settled', 'disputed'
    settled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Legal Consent & Infrastructure Agreement
CREATE TABLE IF NOT EXISTS p2p_agreements (
    agreement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id VARCHAR(50) NOT NULL REFERENCES meter_devices(device_id) ON DELETE CASCADE,
    agreement_type VARCHAR(100) DEFAULT 'shared_green_energy_infrastructure',
    version VARCHAR(20) DEFAULT 'v1.0',
    digital_signature TEXT NOT NULL,
    ip_address VARCHAR(45),
    is_active BOOLEAN DEFAULT true,
    accepted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Microgrid Events & Safety Cutoff Log
CREATE TABLE IF NOT EXISTS microgrid_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id VARCHAR(50) NOT NULL REFERENCES meter_devices(device_id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'cutoff', 'restore', 'safety_trip', 'rate_change', 'p2p_trade'
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_telemetry_device ON meter_telemetry(device_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_trades_buyer ON microgrid_trades(buyer_device_id, settled_at DESC);
CREATE INDEX IF NOT EXISTS idx_trades_seller ON microgrid_trades(seller_device_id, settled_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_device ON microgrid_events(device_id, created_at DESC);