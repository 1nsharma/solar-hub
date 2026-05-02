export const ROLES = {
  ADMIN: 'admin' as const,
  VENDOR: 'vendor' as const,
  TECHNICIAN: 'technician' as const,
  CUSTOMER: 'customer' as const
};

export const ORDER_STATUS = {
  PENDING: 'pending' as const,
  PROCESSING: 'processing' as const,
  DISPATCHED: 'dispatched' as const,
  DELIVERED: 'delivered' as const,
  CANCELLED: 'cancelled' as const
};

export const BOOKING_STATUS = {
  REQUESTED: 'requested' as const,
  CONFIRMED: 'confirmed' as const,
  IN_PROGRESS: 'in_progress' as const,
  COMPLETED: 'completed' as const,
  CANCELLED: 'cancelled' as const
};

export const validatePhone = (phone: string): boolean => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};
