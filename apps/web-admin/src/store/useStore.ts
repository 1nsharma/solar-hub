import { create } from 'zustand';
import { apiUrl } from '../config/api';
import { User, Product, Service, Order, ServiceBooking } from '@solar-hub/types';

interface StoreState {
  language: 'en' | 'hi';
  user: User | null;
  products: Product[];
  services: Service[];
  cart: (Product & { quantity: number })[];
  orders: Order[];
  subscriptions: any[];
  bookings: ServiceBooking[];
  
  setLanguage: (lang: 'en' | 'hi') => void;
  fetchProducts: () => Promise<void>;
  addOrder: (order: Partial<Order> & { items: any[] }) => Promise<void>;
  addBooking: (booking: Partial<ServiceBooking>) => Promise<void>;
  setUser: (user: User | null) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string | number) => void;
  clearCart: () => void;
  addSubscription: (sub: any) => void;
}

export const useStore = create<StoreState>((set) => ({
  language: 'en',
  user: null,
  products: [],
  services: [],
  cart: [],
  orders: [],
  subscriptions: [],
  bookings: [],
  
  setLanguage: (lang) => set({ language: lang }),
  
  fetchProducts: async () => {
    try {
      const res = await fetch(apiUrl('/api/products'));
      const data = await res.json();
      set({ products: data.products, services: data.services });
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  },

  addOrder: async (order) => {
    try {
      const res = await fetch(apiUrl('/api/orders'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      const newOrder = await res.json();
      set((state) => ({ orders: [newOrder, ...state.orders] }));
    } catch (err) {
      console.error('Failed to add order:', err);
    }
  },

  addBooking: async (booking) => {
    try {
      const res = await fetch(apiUrl('/api/bookings'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });
      const newBooking = await res.json();
      set((state) => ({ bookings: [newBooking, ...state.bookings] }));
    } catch (err) {
      console.error('Failed to add booking:', err);
    }
  },

  setUser: (user) => set({ user }),
  
  addToCart: (product) => set((state) => {
    const existing = state.cart.find(item => item.id === product.id);
    if (existing) {
      return {
        cart: state.cart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      };
    }
    return { cart: [...state.cart, { ...product, quantity: 1 }] };
  }),

  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(item => item.id !== productId)
  })),

  clearCart: () => set({ cart: [] }),
  
  addSubscription: (sub) => set((state) => ({
    subscriptions: [sub, ...state.subscriptions]
  }))
}));
