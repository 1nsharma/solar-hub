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
  LogOut
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
import { translations } from './utils/translations';
import { apiUrl } from './config/api';
import PwaInstallButton from './components/PwaInstallButton';

function App() {
  const { user, setUser, cart, addToCart, products, services, fetchProducts, language, setLanguage } = useStore();
  const t = translations[language];
  
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'vendor', 'dashboard', 'technician', or 'admin'
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPitchOpen, setIsPitchOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  
  const [calcInputs, setCalcInputs] = useState({
    bill: 5000,
    pincode: '',
    roofType: 'Flat',
    area: 500
  });
  const [notification, setNotification] = useState(null);
  const [externalDeals, setExternalDeals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'services'
  
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
  const estimatedCost = (recommendedKW * 60000).toLocaleString();

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
    <div className="min-h-screen">
      {/* Notifications */}
      {notification && (
        <div className="fixed bottom-8 right-8 z-[200] bg-secondary text-white px-6 py-3 rounded-xl shadow-2xl animate-fade-in flex items-center gap-2">
          <CheckCircle2 size={20} />
          {notification}
        </div>
      )}

      {/* Navigation */}
      <nav className="glass fixed top-0 w-full z-50">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Sun className="text-black" size={24} />
            </div>
            <span className="text-2xl font-extrabold tracking-tighter">SolarHub</span>
          </div>
          
          <div className="hidden md:flex gap-8 font-medium">
            <a href="#products" className="hover:text-primary transition-colors">{t.marketplace}</a>
            <a href="#services" className="hover:text-primary transition-colors">{t.services}</a>
            <a href="#calculator" className="hover:text-primary transition-colors">{t.calculator}</a>
            <a href="#audience" className="hover:text-primary transition-colors">{t.forBusiness}</a>
            <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="bg-white/5 px-3 py-1 rounded-lg text-xs font-bold text-primary border border-primary/20"
              >
                {language === 'en' ? 'HI' : 'EN'}
              </button>
          </div>

          <div className="flex items-center gap-4">
            <PwaInstallButton />
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 hover:bg-white/5 rounded-full transition-all group"
            >
              <ShoppingCart size={24} className="group-hover:text-primary" />
              {cart.length > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-bg-dark">
                  {cart.length}
                </span>
              )}
            </button>
            
            {user ? (
              <div className="hidden md:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10 group relative cursor-pointer">
                <div 
                  onClick={() => setCurrentPage('dashboard')}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="text-primary" size={16} />
                  </div>
                  <span className="text-sm font-semibold">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="text-text-dim hover:text-red-400 ml-2 transition-colors">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden md:block btn-primary"
              >
                Login / Sign Up
              </button>
            )}

            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
        service={selectedService}
        onComplete={() => setCurrentPage('dashboard')}
      />

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 text-2xl animate-fade-in">
          <button className="absolute top-8 right-8 p-4" onClick={() => setIsMenuOpen(false)}><X size={32} /></button>
          <a href="#products" onClick={() => setIsMenuOpen(false)}>Marketplace</a>
          <a href="#services" onClick={() => setIsMenuOpen(false)}>Services</a>
          <a href="#calculator" onClick={() => setIsMenuOpen(false)}>Calculator</a>
          {!user && (
            <button 
              onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false); }}
              className="btn-primary mt-4"
            >
              Login / Sign Up
            </button>
          )}
          {user && (
            <>
              <button onClick={() => { setCurrentPage('dashboard'); setIsMenuOpen(false); }} className="text-primary">My Dashboard</button>
              <button onClick={handleLogout} className="text-red-400 text-xl">Logout</button>
            </>
          )}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?auto=format&fit=crop&q=80&w=2000" 
            alt="Solar House" 
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-8 animate-fade-in">
              <Zap size={16} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">India's Leading Solar Ecosystem</span>
            </div>
            <h1 className="text-6xl md:text-8xl mb-8 leading-tight animate-fade-in">
              {t.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl text-text-dim mb-12 max-w-xl leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {t.heroSub}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <a href="#products" className="btn-primary text-lg px-12 py-5 group">
                {t.marketplace} <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#services" className="btn-secondary text-lg px-12 py-5">
                {t.services}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 glass border-y border-white/5 relative z-10">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div className="space-y-2">
            <h3 className="text-5xl font-extrabold text-primary tracking-tighter">5k+</h3>
            <p className="text-text-dim uppercase tracking-widest text-[10px] font-bold">Installs</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-5xl font-extrabold text-primary tracking-tighter">200+</h3>
            <p className="text-text-dim uppercase tracking-widest text-[10px] font-bold">Vendors</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-5xl font-extrabold text-primary tracking-tighter">₹5Cr+</h3>
            <p className="text-text-dim uppercase tracking-widest text-[10px] font-bold">Saved by Users</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-5xl font-extrabold text-primary tracking-tighter">4.9</h3>
            <p className="text-text-dim uppercase tracking-widest text-[10px] font-bold">Avg. Rating</p>
          </div>
        </div>
      </section>

      {/* Solar Calculator Section */}
      <section id="calculator" className="py-24">
        <div className="container">
          <div className="glass-card grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl mb-6">{t.savingsTitle}</h2>
              <p className="text-text-dim mb-8">
                Get a personalized solar recommendation in seconds.
              </p>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-xs text-text-dim uppercase font-bold tracking-widest">Monthly Bill (₹)</label>
                    <input 
                      type="number" 
                      value={calcInputs.bill}
                      onChange={(e) => setCalcInputs({...calcInputs, bill: e.target.value})}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-xs text-text-dim uppercase font-bold tracking-widest">Pincode</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 208001"
                      value={calcInputs.pincode}
                      onChange={(e) => setCalcInputs({...calcInputs, pincode: e.target.value})}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-xs text-text-dim uppercase font-bold tracking-widest">Roof Type</label>
                    <select 
                      value={calcInputs.roofType}
                      onChange={(e) => setCalcInputs({...calcInputs, roofType: e.target.value})}
                      className="w-full"
                    >
                      <option>Flat</option>
                      <option>Slanted</option>
                      <option>Industrial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-xs text-text-dim uppercase font-bold tracking-widest">Est. Area (sq ft)</label>
                    <input 
                      type="number" 
                      value={calcInputs.area}
                      onChange={(e) => setCalcInputs({...calcInputs, area: e.target.value})}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                    <p className="text-[10px] text-text-dim uppercase font-bold">Recommended</p>
                    <p className="text-xl font-bold mt-1">{recommendedKW} kW</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                    <p className="text-[10px] text-text-dim uppercase font-bold">Monthly Saving</p>
                    <p className="text-xl font-bold mt-1 text-secondary">₹{Number(estimatedSavings).toLocaleString()}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                    <p className="text-[10px] text-text-dim uppercase font-bold">EMI Starts @</p>
                    <p className="text-xl font-bold mt-1 text-primary">₹{(Number(recommendedKW) * 1500).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-primary/10 rounded-xl border border-primary/20">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Expert Match</p>
                  <p className="text-sm font-semibold">
                    We suggest the <span className="text-white">"{recommendedKW > 3 ? 'Premium On-Grid Kit 5kW' : 'Essential Hybrid Kit 3kW'}"</span> for your needs.
                  </p>
                </div>
                
                <button 
                  onClick={() => {
                    const targetKit = recommendedKW > 3 ? 'Premium On-Grid Kit 5kW' : 'Essential Hybrid Kit 3kW';
                    const product = products.find(p => p.title === targetKit);
                    if (product) handleAddToCart(product);
                    window.location.href = '#products';
                  }}
                  className="btn-primary w-full py-4 justify-center"
                >
                  Buy Recommended Kit & Save
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-primary/20 absolute -inset-10 blur-[100px] rounded-full"></div>
              <div className="relative z-10 glass-card p-8 text-center bg-white/[0.02]">
                <Calculator size={64} className="mx-auto mb-6 text-primary" />
                <h4 className="text-2xl mb-6">Why SolarHub?</h4>
                <div className="space-y-6">
                  <div className="flex gap-4 items-start text-left">
                    <div className="bg-primary/20 p-2 rounded-lg"><Zap className="text-primary" size={20} /></div>
                    <div>
                      <h5 className="font-bold">Instant Quotes</h5>
                      <p className="text-sm text-text-dim">Real-time pricing from verified local vendors.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start text-left">
                    <div className="bg-secondary/20 p-2 rounded-lg"><ShieldCheck className="text-secondary" size={20} /></div>
                    <div>
                      <h5 className="font-bold">End-to-End Service</h5>
                      <p className="text-sm text-text-dim">From purchase to lifelong maintenance.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unified Explore Section (Products & Services Tabs) */}
      <section id="products" className="py-24 bg-white/[0.02]">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-5xl mb-4">Explore <span className="text-primary">SolarHub</span></h2>
            <p className="text-text-dim">One-stop shop for products and professional solar services.</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/5 p-1 rounded-2xl border border-white/10 flex">
              <button 
                onClick={() => { setActiveTab('products'); setSelectedCategory('All'); }}
                className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'products' ? 'bg-primary text-black shadow-lg' : 'text-text-dim hover:text-white'}`}
              >
                <ShoppingCart size={18} /> {t.productsTab}
              </button>
              <button 
                onClick={() => { setActiveTab('services'); setSelectedCategory('All'); }}
                className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'services' ? 'bg-primary text-black shadow-lg' : 'text-text-dim hover:text-white'}`}
              >
                <Wrench size={18} /> {t.servicesTab}
              </button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h3 className="text-2xl mb-2">
                {activeTab === 'products' ? 'Marketplace Deals' : 'Professional Services'}
              </h3>
              <p className="text-sm text-text-dim">
                {activeTab === 'products' ? 'Top-rated products from verified vendors.' : 'Expert care for your solar assets.'}
              </p>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
              {activeTab === 'products' ? (
                ['All', 'Kits', 'Inverters', 'Batteries', 'Panels', 'UPS', 'Eco-Home'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                      selectedCategory === cat 
                      ? 'bg-primary text-black border-primary' 
                      : 'bg-white/5 text-text-dim border-white/10 hover:border-primary/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))
              ) : (
                ['All', 'Installation', 'Maintenance', 'Cleaning', 'Repair'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                      selectedCategory === cat 
                      ? 'bg-primary text-black border-primary' 
                      : 'bg-white/5 text-text-dim border-white/10 hover:border-primary/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))
              )}
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
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
                    price={service.price}
                    fullDesc={service.description}
                    onBook={() => handleBookService(service)}
                  />
                ))
            )}
          </div>
        </div>
      </section>

      {/* Target Audience & Pitch Slide */}
      <AudiencePitch />

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 mt-12">
        <div className="container grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Sun className="text-primary" size={32} />
              <span className="text-3xl font-bold tracking-tighter">SolarHub</span>
            </div>
            <p className="text-text-dim max-w-md">
              The ultimate destination for all your solar needs. We connect vendors, technicians, and consumers to create a sustainable future.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-text-dim">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#products" className="hover:text-primary transition-colors">Marketplace</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Services</a></li>
              <li>
                <button 
                  onClick={() => { setCurrentPage('vendor'); window.scrollTo(0,0); }}
                  className="hover:text-primary transition-colors"
                >
                  Partner with Us
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg mb-6">Partner With Us</h4>
            <ul className="space-y-4 text-text-dim">
              <li>
                <button 
                  onClick={() => { setCurrentPage('vendor'); window.scrollTo(0,0); }}
                  className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-bold w-full hover:bg-primary/20 transition-all"
                >
                  Apply as Vendor
                </button>
              </li>
              <li>
                <button 
                  className="bg-white/5 text-text-dim px-4 py-2 rounded-lg text-sm font-bold w-full hover:bg-white/10 transition-all"
                >
                  Technician Registration
                </button>
              </li>
            </ul>
          </div>


          <div>
            <h4 className="text-lg mb-6">Contact</h4>
            <ul className="space-y-4 text-text-dim">
              <li className="flex items-center gap-2"><MapPin size={18} /> Kanpur, Uttar Pradesh</li>
              <li className="flex items-center gap-2"><Phone size={18} /> +91 98765 43210</li>
              <li className="flex items-center gap-2"><Zap size={18} /> support@solarhub.in</li>
            </ul>
          </div>
        </div>
        <div className="container mt-12 pt-8 border-t border-white/5 text-center text-text-dim text-sm">
          © 2026 SolarHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ product, onAdd }) {
  const [showComparison, setShowComparison] = useState(false);
  
  // Simulated external prices
  const externalPrices = {
    Amazon: product.price + 5000,
    Flipkart: product.price + 2000
  };

  const isBestPrice = product.price < externalPrices.Amazon && product.price < externalPrices.Flipkart;

  return (
    <div className="glass-card p-4 group flex flex-col h-full relative overflow-hidden">
      {isBestPrice && (
        <div className="absolute top-0 right-0 bg-secondary text-black text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-widest z-10 animate-pulse">
          Best Price Found
        </div>
      )}
      
      <div className="h-64 rounded-xl overflow-hidden mb-6 bg-white/[0.03] relative">
        <img 
          src={product.image_url || product.image || 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=800'} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" 
        />
        {parseFloat(product.rating) >= 4.8 && (
          <div className="absolute top-4 left-4 bg-primary text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
            Top Rated
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest px-2 py-1 bg-primary/10 rounded">{product.category}</span>
          <div className="flex items-center gap-1 text-sm text-yellow-500 font-bold">
            <Star size={14} fill="currentColor" />
            <span>{product.rating}</span>
          </div>
        </div>
        
        <h3 className="text-xl mb-1 font-bold group-hover:text-primary transition-colors">{product.title}</h3>
        <p className="text-xs text-text-dim mb-4 flex items-center gap-1">
          <ShieldCheck size={12} className="text-secondary" /> Sold by <span className="text-white/80">{product.vendor}</span>
        </p>
        {/* Kit Contents / Features */}
        <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/5 group-hover:border-primary/20 transition-all">
          <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-text-dim mb-3 font-bold">
            <span>{product.category === 'Kits' ? 'Kit Includes' : 'Key Specs'}</span>
            {product.category === 'Kits' && (
              <span className="text-secondary flex items-center gap-1">
                <ShieldCheck size={10} /> Installation Included
              </span>
            )}
          </div>
          <p className="text-xs text-text-dim leading-relaxed mb-3">
            {product.description}
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
              <span className="text-text-dim">Financing</span>
              <span className="text-primary">₹{Math.round(product.price / 36).toLocaleString()}/mo EMI</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-auto">
        <div>
          <span className="text-xs text-text-dim block">Starting from</span>
          <span className="text-2xl font-bold">₹{product.price.toLocaleString()}</span>
        </div>
        <button 
          onClick={() => onAdd(product)}
          className="bg-primary text-black p-3 rounded-xl hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all transform active:scale-95"
          title="Add to Cart"
        >
          <ShoppingCart size={22} />
        </button>
      </div>
    </div>
  );
}

function ServiceItem({ icon, title, desc, price, fullDesc, onBook }) {
  return (
    <div className="glass-card text-center p-8 group flex flex-col h-full relative overflow-hidden">
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/5 rounded-full group-hover:bg-primary/20 transition-all duration-500"></div>
      
      <div className="mb-6 inline-block p-5 bg-white/5 rounded-2xl group-hover:bg-primary/20 transition-all transform group-hover:rotate-6">
        {React.cloneElement(icon, { size: 40 })}
      </div>
      
      <h4 className="text-2xl mb-2 font-bold">{title}</h4>
      <p className="text-primary font-bold text-sm mb-4 bg-primary/10 inline-block px-3 py-1 rounded-full">
        {price === 'Free' ? 'FREE CONSULTATION' : `Starts @ ₹${price}`}
      </p>
      
      <div className="flex-1">
        <p className="text-text-dim text-sm mb-4 leading-relaxed">{fullDesc}</p>
        <div className="flex items-center justify-center gap-4 text-[10px] text-text-dim uppercase tracking-widest mb-6 font-bold">
          <span className="flex items-center gap-1"><Calendar size={12} /> {desc}</span>
          <span className="w-1 h-1 bg-white/20 rounded-full"></span>
          <span className="flex items-center gap-1"><ShieldCheck size={12} /> Certified</span>
        </div>
      </div>

      <button 
        onClick={onBook}
        className="mt-auto w-full py-3 rounded-xl border border-primary/30 text-primary font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary hover:text-black transition-all group-hover:gap-3"
      >
        Book Now <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default App;
