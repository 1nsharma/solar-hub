import { create } from 'zustand';
import { apiUrl } from '../config/api';

const FALLBACK_PRODUCTS = [
  { id: 1, title: 'Premium On-Grid Kit 5kW', price: 280000, category: 'Kits', vendor: 'Tata Power', rating: 4.9, description: '10 Panels + 5kW Inverter + Structure + Net Metering. Perfect for large homes.', image_url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d' },
  { id: 2, title: 'Essential Hybrid Kit 3kW', price: 195000, category: 'Kits', vendor: 'Luminous', rating: 4.8, description: '6 Panels + 3kW Inverter + 2 Batteries. Ideal for areas with power cuts.', image_url: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d' },
  { id: 3, title: 'Micro Off-Grid Kit 1kW', price: 75000, category: 'Kits', vendor: 'Loom Solar', rating: 4.7, description: '2 Panels + 1kW Inverter + 1 Battery. Best for remote cabins or shops.', image_url: 'https://images.unsplash.com/photo-1509391366360-fe5bb58583bb' },
  { id: 4, title: 'Solar Inverter 5kVA', price: 45000, category: 'Inverters', vendor: 'Microtek', rating: 4.6, description: 'Pure sine wave solar inverter with high efficiency.', image_url: 'https://images.unsplash.com/photo-1558444479-c84851218670' },
  { id: 5, title: 'Smart Water Heater', price: 12000, category: 'Eco-Home', vendor: 'Havells', rating: 4.5, description: 'Energy efficient water heater with app control.', image_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70' }
];
const FALLBACK_SERVICES = [
  { id: 1, title: 'AMC: Basic Protection', price: 2999, duration: '1 Year', icon_name: 'ShieldCheck', description: '4 Cleaning visits + 2 Electrical safety audits per year.' },
  { id: 2, title: 'AMC: Premium Care', price: 5999, duration: '1 Year', icon_name: 'ShieldCheck', description: 'Monthly cleaning + Real-time monitoring + 24/7 Priority support.' },
  { id: 3, title: 'Panel Cleaning', price: 499, duration: '2 Hours', icon_name: 'Zap', description: 'Deep cleaning using high-pressure tools and solar-safe solvents.' },
  { id: 4, title: 'Battery Health Check', price: 799, duration: '1 Hour', icon_name: 'Settings', description: 'Full diagnostic of battery gravity, voltage, and backup time.' },
  { id: 5, title: 'Repair & Troubleshooting', price: 999, duration: 'As per task', icon_name: 'Wrench', description: 'Fixing inverters, panels, and wiring issues by certified experts.' }
];

export const useStore = create((set) => ({
  language: 'en', user: null, products: FALLBACK_PRODUCTS, services: FALLBACK_SERVICES, cart: [], orders: [], subscriptions: [], bookings: [],
  setLanguage: (lang) => set({ language: lang }),
  fetchProducts: async () => {
    try { const res = await fetch(apiUrl('/api/products')); if (!res.ok) throw new Error(`HTTP ${res.status}`); const data = await res.json(); if (data?.products?.length) set({ products: data.products, services: data.services || FALLBACK_SERVICES }); }
    catch (err) { console.warn('API unavailable, keeping fallback catalogue:', err); }
  },
  createLead: async (leadData) => {
    try {
      const res = await fetch(apiUrl('/api/leads'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(leadData) });
      if (!res.ok) throw new Error(`Lead API HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('API unavailable, keeping lead locally for staging:', err);
      return { id: `lead_local_${Date.now()}`, ...leadData, status: 'new', mode: 'offline_staging', created_at: new Date().toISOString() };
    }
  },
  addOrder: async (order) => {
    try { const res = await fetch(apiUrl('/api/orders'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) }); if (res.ok) { const newOrder = await res.json(); set((state) => ({ orders: [newOrder, ...state.orders] })); return newOrder; } throw new Error('Order API responded with error'); }
    catch (err) { console.warn('API unavailable, adding order locally:', err); const localOrder = { id: `ord_${Date.now()}`, ...order, created_at: new Date().toISOString(), status: 'Confirmed' }; set((state) => ({ orders: [localOrder, ...state.orders] })); return localOrder; }
  },
  addBooking: async (booking) => {
    try { const res = await fetch(apiUrl('/api/bookings'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(booking) }); if (res.ok) { const newBooking = await res.json(); set((state) => ({ bookings: [newBooking, ...state.bookings] })); return newBooking; } throw new Error('Booking API responded with error'); }
    catch (err) { console.warn('API unavailable, adding booking locally:', err); const localBooking = { id: `book_${Date.now()}`, ...booking, created_at: new Date().toISOString(), status: 'Scheduled' }; set((state) => ({ bookings: [localBooking, ...state.bookings] })); return localBooking; }
  },
  setUser: (user) => set({ user }),
  addToCart: (product) => set((state) => { const existing = state.cart.find(item => item.id === product.id); return existing ? { cart: state.cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) } : { cart: [...state.cart, { ...product, quantity: 1 }] }; }),
  removeFromCart: (productId) => set((state) => ({ cart: state.cart.filter(item => item.id !== productId) })),
  clearCart: () => set({ cart: [] }),
  addSubscription: (sub) => set((state) => ({ subscriptions: [sub, ...state.subscriptions] }))
}));
