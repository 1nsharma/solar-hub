import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  ShoppingCart, 
  Settings, 
  Wrench, 
  Calculator, 
  Zap, 
  ShieldCheck, 
  Phone, 
  Menu, 
  X,
  ChevronRight,
  Star,
  MapPin,
  Calendar,
  CheckCircle2,
  User,
  LogOut,
  Handshake,
  Smartphone,
  Download,
  ArrowRight,
  Battery,
  Activity
} from 'lucide-react';
import { useStore } from './store/useStore';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import VendorOnboarding from './pages/VendorOnboarding/index';
import CheckoutModal from './components/CheckoutModal';
import UserDashboard from './pages/UserDashboard/index';
import AudiencePitch from './components/AudiencePitch';
import TechnicianDashboard from './pages/TechnicianDashboard/index';
import AdminDashboard from './pages/AdminDashboard/index';
import VendorDashboard from './pages/VendorDashboard/index';
import PartnerDashboard from './pages/PartnerDashboard/index';
import BookingModal from './components/BookingModal';
import PartnerSection from './components/PartnerSection';
import PublicWebsite from './pages/PublicWebsite/index';
import { translations } from './utils/translations';
import { apiUrl } from './config/api';
import PwaInstallButton from './components/PwaInstallButton';
import { Card, Button, StatusBadge, Input } from '@solar-hub/ui';

function App() {
  const { user, setUser, cart, addToCart, products, services, fetchProducts, language, setLanguage } = useStore();
  const t = translations[language];
  
  const [currentPage, setCurrentPage] = useState('home'); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPitchOpen, setIsPitchOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [notification, setNotification] = useState(null);
  const [externalDeals, setExternalDeals] = useState([]);
  
  useEffect(() => {
    fetchProducts();
    
    const fetchExternal = async () => {
      try {
        const res = await fetch(apiUrl('/api/external-deals'));
        const data = await res.json();
        setExternalDeals(data);
      } catch (err) {
        setExternalDeals([
          { id: 1, title: 'Tata Solar Panel 400W', price: '12,500', platform: 'Amazon', rating: 4.5 },
          { id: 2, title: 'Luminous NXG 1100', price: '7,200', platform: 'Flipkart', rating: 4.3 },
          { id: 3, title: 'Microtek Solar Inverter', price: '6,800', platform: 'Amazon', rating: 4.4 }
        ]);
      }
    };
    fetchExternal();
  }, [fetchProducts]);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') setCurrentPage('admin');
      else if (user.role === 'vendor') setCurrentPage('vendorDashboard');
      else if (user.role === 'technician') setCurrentPage('technician');
      else if (user.role === 'partner' || user.role === 'ca') setCurrentPage('partnerDashboard');
      else if (user.role === 'customer') setCurrentPage('dashboard');
    } else {
      setCurrentPage('home');
    }
  }, [user]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setNotification(`${product.title} added to cart!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleBookService = (service) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedService(service);
    setIsBookingOpen(true);
  };

  if (currentPage === 'vendor') {
    return <VendorOnboarding onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'dashboard') {
    return <UserDashboard onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'technician') {
    return <TechnicianDashboard onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'admin') {
    return <AdminDashboard onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'vendorDashboard') {
    return <VendorDashboard onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'partnerDashboard') {
    return <PartnerDashboard onBack={() => setCurrentPage('home')} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {notification && (
        <div className="fixed bottom-8 right-8 z-[200] bg-green-500 text-black font-black px-8 py-4 rounded-2xl shadow-[0_0_50px_rgba(34,197,94,0.3)] animate-in slide-in-from-right-4 flex items-center gap-3 border border-green-400/20">
          <CheckCircle2 size={20} />
          {notification.toUpperCase()}
        </div>
      )}

      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
        <div className="backdrop-blur-3xl bg-white/[0.03] rounded-[32px] px-10 py-5 flex justify-between items-center shadow-2xl border border-white/5">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="bg-primary p-3 rounded-2xl group-hover:rotate-12 transition-all shadow-[0_0_30px_rgba(255,215,0,0.2)]">
              <Sun className="text-black" size={28} />
            </div>
            <span className="text-4xl font-black tracking-tighter italic">SolarHub</span>
          </div>
          
          <div className="hidden lg:flex gap-12 font-black text-[10px] uppercase tracking-[0.3em]">
            <a href="#products" className="text-white/40 hover:text-primary transition-all py-2 relative group">
              {t.marketplace}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full shadow-[0_0_10px_rgba(255,215,0,0.5)]"></span>
            </a>
            <a href="#services" className="text-white/40 hover:text-primary transition-all py-2 relative group">
              {t.services}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full shadow-[0_0_10px_rgba(255,215,0,0.5)]"></span>
            </a>
            <a href="#calculator" className="text-white/40 hover:text-primary transition-all py-2 relative group">
              {t.calculator}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full shadow-[0_0_10px_rgba(255,215,0,0.5)]"></span>
            </a>
          </div>

          <div className="flex items-center gap-8">
            <button 
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="bg-white/5 w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-black border border-white/5 hover:border-primary/30 transition-all hover:bg-white/10"
            >
              {language === 'en' ? 'HI' : 'EN'}
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 hover:bg-white/5 rounded-2xl transition-all group border border-white/5"
            >
              <ShoppingCart size={24} className="text-white/40 group-hover:text-primary" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-black text-[10px] font-black w-6 h-6 rounded-xl flex items-center justify-center border-2 border-[#050505] shadow-lg">
                  {cart.length}
                </span>
              )}
            </button>
            
            {user ? (
              <div 
                onClick={() => setCurrentPage('dashboard')}
                className="hidden md:flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl font-black cursor-pointer border border-white/10 hover:border-primary/30 transition-all group"
              >
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                   <User size={18} className="text-primary" />
                </div>
                <span className="text-xs uppercase tracking-widest text-white/60 group-hover:text-white">{user.name}</span>
              </div>
            ) : (
              <Button 
                onClick={() => setIsAuthModalOpen(true)}
                variant="primary"
                className="hidden md:block px-10 py-4 shadow-[0_0_30px_rgba(255,215,0,0.2)]"
              >
                AUTHORIZE
              </Button>
            )}

            <button className="lg:hidden p-3 bg-white/5 rounded-2xl border border-white/5" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
      />
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        onTrack={() => setCurrentPage('dashboard')}
      />
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        service={selectedService}
        onComplete={() => setCurrentPage('dashboard')}
      />

      <PublicWebsite 
        onAddProduct={handleAddToCart}
        onBookService={handleBookService}
      />

      <footer className="py-24 border-t border-white/5 relative bg-[#030303]">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-10 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <div className="bg-primary/20 p-3 rounded-2xl border border-primary/20">
                <Sun className="text-primary" size={36} />
              </div>
              <span className="text-5xl font-black tracking-tighter italic text-white">SolarHub</span>
            </div>
            <p className="text-white/30 max-w-lg text-lg leading-relaxed font-medium">
              The standardized terminal for high-performance solar assets. Connecting vendors, technicians, and mission-critical logistics to power the next century.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-10">CORE NODES</h4>
            <ul className="space-y-6 text-white/40 text-xs font-black tracking-widest uppercase">
              <li><a href="#" className="hover:text-primary transition-all">About Matrix</a></li>
              <li><a href="#products" className="hover:text-primary transition-all">Marketplace</a></li>
              <li><a href="#services" className="hover:text-primary transition-all">Service Grid</a></li>
              <li>
                <button 
                  onClick={() => { setCurrentPage('vendor'); window.scrollTo(0,0); }}
                  className="hover:text-primary transition-all uppercase"
                >
                  Partner Uplink
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-10">COMMS CENTER</h4>
            <ul className="space-y-6 text-white/40 text-xs font-black tracking-widest uppercase">
              <li className="flex items-center gap-4"><MapPin size={18} className="text-primary" /> KANPUR SECTOR-7</li>
              <li className="flex items-center gap-4"><Phone size={18} className="text-primary" /> +91 98XXX XXXXX</li>
              <li className="flex items-center gap-4"><Zap size={18} className="text-primary" /> UPLINK@SOLARHUB.IO</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">© 2026 SOLARHUB PROTOCOL. SYSTEM STANDBY.</p>
           <div className="flex gap-10">
              <span className="text-primary animate-pulse text-[10px] font-black uppercase tracking-widest">SERVER: OPTIMAL</span>
              <span className="text-white/20 text-[10px] font-black uppercase tracking-widest italic cursor-pointer hover:text-white transition-colors">SECURITY MATRIX</span>
           </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
