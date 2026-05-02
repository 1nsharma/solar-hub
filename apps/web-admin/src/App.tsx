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
  Handshake
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
import { translations } from './utils/translations';
import { apiUrl } from './config/api';
import PwaInstallButton from './components/PwaInstallButton';
import { Product, Service } from '@solar-hub/types';
import { Card, Button, StatusBadge, Input } from '@solar-hub/ui';

function App() {
  const { user, setUser, cart, addToCart, products, services, fetchProducts, language, setLanguage } = useStore();
  const t = (translations as any)[language];
  
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'vendor', 'dashboard', 'technician', or 'admin'
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPitchOpen, setIsPitchOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  const [calcInputs, setCalcInputs] = useState<any>({
    bill: 5000,
    pincode: '',
    roofType: 'Flat',
    area: 500
  });
  const [notification, setNotification] = useState<string | null>(null);
  const [externalDeals, setExternalDeals] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products'); // 'products' or 'services'
  
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

  // Role-Based Automatic Routing
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

  const recommendedKW = (calcInputs.bill / 1500).toFixed(1);
  const estimatedSavings = (calcInputs.bill * 0.9).toFixed(0);
  const estimatedCost = (Number(recommendedKW) * 60000).toLocaleString();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setNotification(`${product.title} added to cart!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleBookService = (service: Service) => {
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
      {/* Notifications */}
      {notification && (
        <div className="fixed bottom-8 right-8 z-[200] bg-green-500 text-black font-black px-8 py-4 rounded-2xl shadow-[0_0_50px_rgba(34,197,94,0.3)] animate-in slide-in-from-right-4 flex items-center gap-3 border border-green-400/20">
          <CheckCircle2 size={20} />
          {notification.toUpperCase()}
        </div>
      )}

      {/* Navigation */}
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

      {/* Modals */}
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
        service={selectedService as any}
        onComplete={() => setCurrentPage('dashboard')}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?auto=format&fit=crop&q=80&w=2500" 
            alt="Solar House" 
            className="w-full h-full object-cover opacity-20 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/95 to-[#050505]"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,215,0,0.08)_0%,transparent_60%)]"></div>
        </div>
        
        <div className="container relative z-10 px-6">
          <div className="max-w-6xl mx-auto text-center md:text-left">
            <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-4 rounded-[24px] mb-12 animate-fade-in backdrop-blur-3xl shadow-2xl">
              <div className="bg-primary/20 p-2.5 rounded-xl border border-primary/20"><Zap size={20} className="text-primary animate-pulse" /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">Autonomous Energy Grid v2.0</span>
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[140px] mb-12 leading-[0.85] animate-fade-in font-black tracking-tighter text-white">
              LIGHT THE <br className="hidden md:block"/> <span className="text-primary relative inline-block italic">FUTURE<div className="absolute -bottom-8 left-0 w-full h-8 bg-primary/20 blur-[60px] rounded-full"></div></span>
            </h1>
            <p className="text-xl md:text-3xl text-white/40 mb-16 max-w-4xl leading-relaxed animate-fade-in font-medium italic" style={{ animationDelay: '0.2s' }}>
              The premium gateway for high-efficiency solar infrastructure, professional lifecycle services, and AI-driven energy optimization. 
            </p>
            <div className="flex flex-col sm:flex-row gap-10 animate-fade-in justify-center md:justify-start" style={{ animationDelay: '0.4s' }}>
              <Button 
                variant="primary"
                onClick={() => window.location.href = '#products'}
                className="text-xl px-20 py-8 shadow-[0_0_60px_rgba(255,215,0,0.3)] hover:scale-105 transition-all group"
              >
                START MISSION <ChevronRight size={28} className="inline ml-4 group-hover:translate-x-3 transition-transform" />
              </Button>
              <Button 
                variant="secondary"
                onClick={() => window.location.href = '#calculator'}
                className="text-xl px-20 py-8 bg-white/5 border-white/10 hover:bg-white/10"
              >
                COMPUTE ROI
              </Button>
            </div>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 -right-40 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[200px] animate-pulse pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[180px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* Unified Explore Section */}
      <section id="products" className="py-40 relative z-10">
        <div className="container px-6 mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-7xl font-black tracking-tighter mb-6 text-white uppercase italic">Neural <span className="text-primary">Marketplace</span></h2>
            <p className="text-white/30 text-xl font-medium tracking-[0.2em] uppercase">Authenticated Products & Professional Logistics</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex justify-center mb-20">
            <Card className="bg-white/5 p-2 rounded-[32px] border border-white/10 flex gap-2">
              <button 
                onClick={() => { setActiveTab('products'); setSelectedCategory('All'); }}
                className={`px-12 py-5 rounded-[24px] font-black transition-all flex items-center gap-4 text-xs uppercase tracking-[0.2em] ${activeTab === 'products' ? 'bg-primary text-black shadow-[0_0_30px_rgba(255,215,0,0.3)]' : 'text-white/30 hover:text-white'}`}
              >
                <ShoppingCart size={20} /> {t.productsTab}
              </button>
              <button 
                onClick={() => { setActiveTab('services'); setSelectedCategory('All'); }}
                className={`px-12 py-5 rounded-[24px] font-black transition-all flex items-center gap-4 text-xs uppercase tracking-[0.2em] ${activeTab === 'services' ? 'bg-primary text-black shadow-[0_0_30px_rgba(255,215,0,0.3)]' : 'text-white/30 hover:text-white'}`}
              >
                <Wrench size={20} /> {t.servicesTab}
              </button>
            </Card>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-10">
            {activeTab === 'products' ? (
              products
                .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
                .map(product => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onAdd={handleAddToCart}
                  />
                ))
            ) : (
              services
                .filter(s => {
                  if (selectedCategory === 'All') return true;
                  return s.title.toLowerCase().includes(selectedCategory.toLowerCase());
                })
                .map(service => (
                  <ServiceItem 
                    key={service.id}
                    icon={
                      service.icon_name === 'Zap' ? <Zap className="text-primary" /> : 
                      service.icon_name === 'Settings' ? <Settings className="text-primary" /> :
                      service.icon_name === 'Wrench' ? <Wrench className="text-primary" /> :
                      service.icon_name === 'ShieldCheck' ? <ShieldCheck className="text-primary" /> :
                      <Calculator className="text-primary" />
                    }
                    title={service.title}
                    desc={service.duration}
                    price={service.price as any}
                    fullDesc={service.description}
                    onBook={() => handleBookService(service)}
                  />
                ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
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

function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
  return (
    <Card className="p-6 group flex flex-col h-full relative overflow-hidden bg-white/[0.02] border-white/5 hover:border-primary/30 transition-all duration-500">
      <div className="h-72 rounded-[24px] overflow-hidden mb-8 bg-white/5 relative border border-white/5">
        <img 
          src={product.image_url} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" 
        />
        {parseFloat(product.rating as any) >= 4.8 && (
          <div className="absolute top-5 left-5">
             <StatusBadge status="ELITE" className="bg-[#FFD700] text-black border-none px-4 py-1" />
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <StatusBadge status={product.category} className="bg-primary/10 text-primary border-primary/20 px-3 py-1" />
          <div className="flex items-center gap-1.5 text-xs text-yellow-500 font-black bg-yellow-500/10 px-3 py-1 rounded-xl">
            <Star size={14} fill="currentColor" />
            <span>{product.rating}</span>
          </div>
        </div>
        
        <h3 className="text-3xl mb-2 font-black group-hover:text-primary transition-colors tracking-tighter text-white italic">{product.title}</h3>
        <div className="flex justify-between items-center mb-8">
          <p className="text-[10px] text-white/40 flex items-center gap-2 font-black uppercase tracking-widest">
            <ShieldCheck size={14} className="text-primary" /> {product.vendor}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></div>
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Low Stock</span>
          </div>
        </div>

        <Card className="bg-white/5 p-6 mb-8 border-white/5 group-hover:bg-white/[0.08] transition-all rounded-2xl">
          <p className="text-xs text-white/50 leading-relaxed font-medium mb-4 italic">
            {product.description}
          </p>
          <div className="flex justify-between items-center">
             <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">FINANCING READY</span>
             <span className="text-xs text-primary font-black italic">₹{Math.round(product.price / 36).toLocaleString()}/MO</span>
          </div>
        </Card>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-white/5 mt-auto">
        <div>
          <span className="text-3xl font-black text-white italic">₹{product.price.toLocaleString()}</span>
          <span className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em] block mt-1">Uplink Pricing</span>
        </div>
        <button 
          onClick={() => onAdd(product)}
          className="bg-primary text-black p-5 rounded-2xl hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] transition-all transform active:scale-90 shadow-2xl border border-primary/20"
        >
          <ShoppingCart size={28} strokeWidth={3} />
        </button>
      </div>
    </Card>
  );
}

function ServiceItem({ icon, title, desc, price, fullDesc, onBook }: { icon: any; title: string; desc: string; price: number; fullDesc: string; onBook: () => void }) {
  return (
    <Card className="text-center p-10 group flex flex-col h-full relative overflow-hidden bg-white/[0.02] border-white/5 hover:border-primary/30 transition-all duration-500">
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-all duration-700"></div>
      
      <div className="mb-10 inline-block p-6 bg-white/5 rounded-3xl group-hover:bg-primary/20 transition-all transform group-hover:rotate-12 border border-white/5">
        {React.cloneElement(icon as any, { size: 48 })}
      </div>
      
      <h4 className="text-3xl mb-3 font-black text-white italic tracking-tighter">{title}</h4>
      <div className="flex justify-center mb-6">
        <StatusBadge status={`STARTS @ ₹${price}`} className="bg-primary/10 text-primary border-primary/20 px-4 py-1" />
      </div>
      
      <div className="flex-1">
        <p className="text-white/40 text-sm mb-8 leading-relaxed font-medium italic">"{fullDesc}"</p>
        <div className="flex items-center justify-center gap-6 text-[10px] text-white/30 uppercase tracking-[0.2em] mb-10 font-black">
          <span className="flex items-center gap-2"><Calendar size={14} className="text-primary" /> {desc}</span>
          <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-primary" /> AUTHENTIC</span>
        </div>
      </div>

      <Button 
        onClick={onBook}
        variant="outline"
        className="w-full py-5 rounded-2xl uppercase font-black tracking-widest text-xs group-hover:bg-primary group-hover:text-black transition-all italic"
      >
        AUTHORIZE SERVICE <ChevronRight size={20} className="inline ml-2" />
      </Button>
    </Card>
  );
}

export default App;
