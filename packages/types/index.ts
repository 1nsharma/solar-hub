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

export const TYPES_VERSION = "1.2.0";
