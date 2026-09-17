export const ROLES = {
  ADMIN: 'admin',
  VENDOR: 'vendor',
  TECHNICIAN: 'technician',
  CUSTOMER: 'customer'
};

export const ORDER_STATUS = {
  PENDING: 'pending', PROCESSING: 'processing', DISPATCHED: 'dispatched', DELIVERED: 'delivered', CANCELLED: 'cancelled'
};

export const BOOKING_STATUS = {
  REQUESTED: 'requested', CONFIRMED: 'confirmed', IN_PROGRESS: 'in_progress', COMPLETED: 'completed', CANCELLED: 'cancelled'
};

export const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);
export const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export * from './behavioral.js';
export * from './supply-chain.js';
export * from './calculator.js';
