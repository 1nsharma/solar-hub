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

-- 4. Technicians Table
CREATE TABLE technicians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    region VARCHAR(100) NOT NULL,
    specialization VARCHAR(255), -- solar, batteries, wiring
    status VARCHAR(50) DEFAULT 'active', -- active, on_job, inactive
    rating DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Products Table
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

-- 6. Services Table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration VARCHAR(50),
    icon_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    total_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'processing', -- processing, shipped, delivered, cancelled
    address_id UUID REFERENCES addresses(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Order Items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL(12,2) NOT NULL
);

-- 9. Service Bookings
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

-- 10. Service Programs
-- These are operational service workflows, not SolarHub platform revenue plans.
CREATE TABLE service_programs (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    channel VARCHAR(100) NOT NULL, -- on_demand_service, vendor_after_sales, scheme_facilitation
    revenue_model VARCHAR(100) DEFAULT 'non_monetized_service_workflow',
    customer_charge_owner VARCHAR(100),
    platform_revenue BOOLEAN DEFAULT false,
    features JSONB DEFAULT '[]'::jsonb,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Ecommerce Revenue Events
-- Only ecommerce checkout should be counted as direct platform monetization.
CREATE TABLE ecommerce_revenue_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    gross_amount DECIMAL(12,2) NOT NULL,
    platform_margin DECIMAL(12,2),
    commission_amount DECIMAL(12,2),
    source VARCHAR(50) DEFAULT 'product_checkout',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Leads
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES users(id),
    name VARCHAR(255),
    customer_name VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    pincode VARCHAR(10),
    requirement TEXT NOT NULL,
    interest_type VARCHAR(100),
    estimated_load DECIMAL(6,2),
    notes TEXT,
    source VARCHAR(50) DEFAULT 'web',
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Payments Table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    booking_id UUID REFERENCES service_bookings(id),
    amount DECIMAL(12,2) NOT NULL,
    method VARCHAR(50), -- UPI, card, net_banking
    transaction_id VARCHAR(255) UNIQUE,
    status VARCHAR(50) DEFAULT 'success', -- success, failed, pending
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Audit Logs Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- order, booking, vendor, product
    entity_id UUID NOT NULL,
    old_value JSONB,
    new_value JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Partners Table (Solopreneurs/Referrers)
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    referral_code VARCHAR(50) UNIQUE NOT NULL,
    payout_details JSONB, -- Bank info, UPI ID, etc.
    status VARCHAR(50) DEFAULT 'active', -- active, suspended
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Leads Table (Referred Customers)
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES partners(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    interest_type VARCHAR(100), -- residential, commercial, industrial
    estimated_load DECIMAL(10,2), -- in kW
    status VARCHAR(50) DEFAULT 'new', -- new, contacted, survey_done, converted, lost
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Commissions Table
CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES partners(id),
    lead_id UUID REFERENCES leads(id),
    order_id UUID REFERENCES orders(id), -- Linked when lead converts to order
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, paid, cancelled
    payout_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
