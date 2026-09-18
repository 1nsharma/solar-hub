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
    <div className="min-h-screen bg-[#060907] text-white selection:bg-[#FFD700] selection:text-black">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-8 right-8 z-[200] bg-[#0c140f] text-white font-bold px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(16,185,129,0.3)] animate-in slide-in-from-bottom-5 fade-in flex items-center gap-3 border border-[#10B981]/40">
          <div className="w-8 h-8 rounded-xl bg-[#10B981]/20 flex items-center justify-center text-[#10B981]">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-[#10B981] font-black">Success</p>
            <p className="text-sm font-semibold text-white/90">{notification}</p>
          </div>
        </div>
      )}

      {/* Floating Modern Header */}
      <header className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[94%] max-w-7xl z-50 transition-all">
        <div className="backdrop-blur-2xl bg-[#080e0a]/80 rounded-2xl sm:rounded-3xl px-5 sm:px-8 py-3.5 sm:py-4 flex justify-between items-center shadow-[0_8px_32px_rgba(0,0,0,0.65)] border border-white/[0.09] hover:border-white/[0.14] transition-all">
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group select-none" 
            onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#FF9E00] flex items-center justify-center shadow-[0_0_25px_rgba(255,215,0,0.35)] group-hover:scale-105 group-hover:rotate-6 transition-all">
              <Sun className="text-[#050806]" size={22} />
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight font-heading flex items-center gap-1.5">
                Solar<span className="text-gradient-gold">Hub</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-bold hidden sm:block">Clean Energy Platform</span>
            </div>
          </div>
          
          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.05]">
            <a 
              href="#products" 
              className="px-5 py-2 rounded-xl text-xs font-bold tracking-wider text-white/70 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              {t.marketplace}
            </a>
            <a 
              href="#services" 
              className="px-5 py-2 rounded-xl text-xs font-bold tracking-wider text-white/70 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              {t.services}
            </a>
            <a 
              href="#calculator" 
              className="px-5 py-2 rounded-xl text-xs font-bold tracking-wider text-white/70 hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-2"
            >
              <span>{t.calculator}</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30">DBT</span>
            </a>
            <a 
              href="#journey" 
              className="px-5 py-2 rounded-xl text-xs font-bold tracking-wider text-white/70 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              How It Works
            </a>
            <a 
              href="#faq" 
              className="px-5 py-2 rounded-xl text-xs font-bold tracking-wider text-white/70 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              FAQ
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Language Switcher */}
            <button 
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="h-10 px-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-black tracking-widest text-white/80 border border-white/[0.08] hover:border-[#FFD700]/40 transition-all flex items-center gap-1.5"
              title="Switch Language"
            >
              <span className="text-[#FFD700]">🌐</span>
              <span>{language === 'en' ? 'HI' : 'EN'}</span>
            </button>

            {/* Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-all group border border-white/[0.08] hover:border-[#FFD700]/40"
              title="Open Cart"
            >
              <ShoppingCart size={19} className="text-white/70 group-hover:text-[#FFD700] transition-colors" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#FFD700] text-black text-[10px] font-black w-5 h-5 rounded-lg flex items-center justify-center shadow-lg border border-[#060907] animate-bounce">
                  {cart.length}
                </span>
              )}
            </button>
            
            {/* User Profile or Sign In */}
            {user ? (
              <div 
                onClick={() => setCurrentPage('dashboard')}
                className="hidden sm:flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.08] pl-3 pr-4 py-1.5 rounded-xl font-bold cursor-pointer border border-white/[0.08] hover:border-[#FFD700]/40 transition-all group"
              >
                <div className="w-7 h-7 bg-[#FFD700]/20 rounded-lg flex items-center justify-center text-[#FFD700]">
                   <User size={15} />
                </div>
                <span className="text-xs uppercase tracking-wider text-white/80 group-hover:text-white font-semibold">{user.name}</span>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden sm:inline-flex btn-gold text-xs uppercase tracking-wider py-2.5 px-6 rounded-xl font-black shadow-[0_0_25px_rgba(255,215,0,0.25)]"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button 
              className="lg:hidden w-10 h-10 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl border border-white/[0.08] flex items-center justify-center text-white/80 hover:text-white transition-all" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={20} className="text-[#FFD700]" /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="lg:hidden mt-3 backdrop-blur-3xl bg-[#090f0c]/95 border border-white/[0.1] rounded-3xl p-6 shadow-2xl animate-in slide-in-from-top-4 fade-in">
            <div className="flex flex-col gap-3">
              <a 
                href="#products" 
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-2xl bg-white/[0.03] text-sm font-bold text-white/90 hover:text-[#FFD700] hover:bg-white/[0.06] transition-all flex items-center justify-between"
              >
                <span>{t.marketplace}</span>
                <ChevronRight size={16} className="text-white/40" />
              </a>
              <a 
                href="#services" 
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-2xl bg-white/[0.03] text-sm font-bold text-white/90 hover:text-[#FFD700] hover:bg-white/[0.06] transition-all flex items-center justify-between"
              >
                <span>{t.services}</span>
                <ChevronRight size={16} className="text-white/40" />
              </a>
              <a 
                href="#calculator" 
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-2xl bg-white/[0.03] text-sm font-bold text-white/90 hover:text-[#FFD700] hover:bg-white/[0.06] transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span>{t.calculator}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-[#FFD700]/20 text-[#FFD700]">₹78k Subsidy</span>
                </div>
                <ChevronRight size={16} className="text-white/40" />
              </a>
              <a 
                href="#journey" 
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-2xl bg-white/[0.03] text-sm font-bold text-white/90 hover:text-[#FFD700] hover:bg-white/[0.06] transition-all flex items-center justify-between"
              >
                <span>How It Works</span>
                <ChevronRight size={16} className="text-white/40" />
              </a>
              <a 
                href="#faq" 
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-2xl bg-white/[0.03] text-sm font-bold text-white/90 hover:text-[#FFD700] hover:bg-white/[0.06] transition-all flex items-center justify-between"
              >
                <span>Frequently Asked Questions</span>
                <ChevronRight size={16} className="text-white/40" />
              </a>

              <div className="pt-4 mt-2 border-t border-white/[0.08] flex flex-col gap-3">
                {user ? (
                  <button 
                    onClick={() => { setIsMenuOpen(false); setCurrentPage('dashboard'); }}
                    className="w-full py-3.5 rounded-xl bg-white/10 text-white font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2"
                  >
                    <User size={16} className="text-[#FFD700]" /> Go to My Dashboard
                  </button>
                ) : (
                  <button 
                    onClick={() => { setIsMenuOpen(false); setIsAuthModalOpen(true); }}
                    className="w-full btn-gold py-3.5 rounded-xl text-xs uppercase tracking-wider font-black shadow-lg"
                  >
                    Sign In to SolarHub
                  </button>
                )}
                
                <button 
                  onClick={() => { setIsMenuOpen(false); setCurrentPage('vendor'); }}
                  className="w-full py-3 rounded-xl bg-white/[0.04] text-white/70 font-semibold text-xs tracking-wider hover:text-white hover:bg-white/[0.08] transition-all"
                >
                  Join as Vendor or Partner →
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Modals & Drawers */}
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

      {/* Main Website Content */}
      <PublicWebsite 
        onAddProduct={handleAddToCart}
        onBookService={handleBookService}
        onVendorOnboarding={() => { setCurrentPage('vendor'); window.scrollTo(0,0); }}
      />

      {/* Modern Redesigned Footer */}
      <footer className="py-24 border-t border-white/[0.08] relative bg-[#040605] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent" />
        <div className="container mx-auto px-6 grid md:grid-cols-12 gap-12 sm:gap-16">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3.5 mb-6 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#FF9E00] flex items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                <Sun className="text-[#050806]" size={26} />
              </div>
              <span className="text-3xl font-black tracking-tight font-heading">Solar<span className="text-gradient-gold">Hub</span></span>
            </div>
            <p className="text-white/50 max-w-md text-sm sm:text-base leading-relaxed font-normal mb-8">
              India's comprehensive renewable ecosystem unifying certified solar equipment commerce, 48-hour technician dispatch, PM Surya Ghar DBT subsidy enablement, and verified vendor lifecycle management.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <span className="badge-solar">☀️ MNRE Approved</span>
              <span className="badge-emerald">⚡ DBT Subsidy Ready</span>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white/60">Tier-1 Guaranteed</span>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-[0.25em] text-[#FFD700] mb-6">Marketplace</h4>
            <ul className="space-y-3.5 text-white/50 text-xs sm:text-sm font-medium">
              <li><a href="#products" className="hover:text-white transition-colors">Residential Solar Kits</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Commercial & Industrial</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Hybrid Inverters</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Lithium Battery Storage</a></li>
              <li><a href="#calculator" className="hover:text-white transition-colors">Subsidy Calculator</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-[0.25em] text-[#FFD700] mb-6">Services & Network</h4>
            <ul className="space-y-3.5 text-white/50 text-xs sm:text-sm font-medium">
              <li><a href="#services" className="hover:text-white transition-colors">On-Demand Panel Wash</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Annual Maintenance (AMC)</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Inverter Diagnostics</a></li>
              <li>
                <button 
                  onClick={() => { setCurrentPage('vendor'); window.scrollTo(0,0); }}
                  className="hover:text-[#FFD700] transition-colors text-left"
                >
                  Vendor Onboarding
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentPage('partnerDashboard'); window.scrollTo(0,0); }}
                  className="hover:text-[#FFD700] transition-colors text-left"
                >
                  Partner Portal
                </button>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-3">
            <h4 className="text-xs font-black uppercase tracking-[0.25em] text-[#FFD700] mb-6">Headquarters & Support</h4>
            <ul className="space-y-4 text-white/50 text-xs sm:text-sm font-medium">
              <li className="flex items-start gap-3">
                <MapPin size={17} className="text-[#FFD700] shrink-0 mt-0.5" />
                <span>Civil Lines & IIT Corridor, Kanpur, Uttar Pradesh 208001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={17} className="text-[#FFD700] shrink-0" />
                <span>Toll-Free: 1800-SOLAR-HUB</span>
              </li>
              <li className="flex items-center gap-3">
                <Zap size={17} className="text-[#FFD700] shrink-0" />
                <span>support@solarhub.io</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto px-6 mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© 2026 SolarHub Renewable Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-6 text-[11px] font-semibold uppercase tracking-wider">
            <span className="text-[#10B981] flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span> Live Network Active</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
