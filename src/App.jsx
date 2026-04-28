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
import VendorOnboarding from './pages/VendorOnboarding';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'vendor'
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [bill, setBill] = useState(5000);
  const [notification, setNotification] = useState(null);
  const [apiData, setApiData] = useState({ products: [], services: [] });
  
  const { user, setUser, cart, addToCart } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        setApiData(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchData();
  }, []);

  // Simple calculation for demo
  const recommendedKW = (bill / 1500).toFixed(1);
  const estimatedSavings = (bill * 0.9).toFixed(0);

  const handleAddToCart = (product) => {
    addToCart(product);
    setNotification(`${product.title} added to cart!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (currentPage === 'vendor') {
    return <VendorOnboarding onBack={() => setCurrentPage('home')} />;
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
            <a href="#products" className="hover:text-primary">Marketplace</a>
            <a href="#services" className="hover:text-primary">Services</a>
            <a href="#calculator" className="hover:text-primary">Savings Calculator</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-white/5 rounded-full transition-all"
            >
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-bg-dark">
                  {cart.length}
                </span>
              )}
            </button>
            
            {user ? (
              <div className="hidden md:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="text-primary" size={16} />
                </div>
                <span className="text-sm font-semibold">{user.name}</span>
                <button onClick={handleLogout} className="text-text-dim hover:text-red-400 ml-2">
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

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Auth Modal & Cart Drawer */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center gap-8 text-2xl">
          <a href="#products" onClick={() => setIsMenuOpen(false)}>Marketplace</a>
          <a href="#services" onClick={() => setIsMenuOpen(false)}>Services</a>
          <a href="#calculator" onClick={() => setIsMenuOpen(false)}>Calculator</a>
          {!user && (
            <button 
              onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false); }}
              className="btn-primary"
            >
              Login / Sign Up
            </button>
          )}
          {user && (
            <button onClick={handleLogout} className="text-red-400 text-xl">Logout</button>
          )}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero.png" 
            alt="Solar House" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
        </div>
        
        <div className="container relative z-10 animate-fade-in">
          <div className="max-w-2xl">
            <h1 className="text-6xl md:text-8xl mb-6 leading-tight">
              Empowering Your <span className="gradient-text">Energy</span> Future
            </h1>
            <p className="text-xl md:text-2xl text-text-dim mb-10">
              India's #1 Marketplace for Solar Products & Premium Maintenance Services. From kits to cleaning, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#products" className="btn-primary text-lg px-10 py-4 flex items-center justify-center gap-2">
                Shop Solar Kits <ChevronRight size={20} />
              </a>
              <a href="#services" className="btn-secondary text-lg px-10 py-4 flex items-center justify-center">
                Book a Service
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 glass border-y border-white/10">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-4xl text-primary">5000+</h3>
            <p className="text-text-dim uppercase tracking-widest text-xs mt-2">Installations</p>
          </div>
          <div>
            <h3 className="text-4xl text-primary">200+</h3>
            <p className="text-text-dim uppercase tracking-widest text-xs mt-2">Verified Vendors</p>
          </div>
          <div>
            <h3 className="text-4xl text-primary">15+</h3>
            <p className="text-text-dim uppercase tracking-widest text-xs mt-2">Cities Covered</p>
          </div>
          <div>
            <h3 className="text-4xl text-primary">4.9/5</h3>
            <p className="text-text-dim uppercase tracking-widest text-xs mt-2">User Rating</p>
          </div>
        </div>
      </section>

      {/* Solar Calculator Section */}
      <section id="calculator" className="py-24">
        <div className="container">
          <div className="glass-card grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl mb-6">Calculate Your <span className="text-primary">Savings</span></h2>
              <p className="text-text-dim mb-8">
                Thinking about going solar? Use our smart calculator to estimate how much you can save and the system size you need.
              </p>
              
              <div className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm text-text-dim">Monthly Electricity Bill (₹)</label>
                  <input 
                    type="range" 
                    min="1000" 
                    max="50000" 
                    step="500"
                    value={bill}
                    onChange={(e) => setBill(e.target.value)}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between mt-2 font-bold">
                    <span>₹1,000</span>
                    <span className="text-primary text-xl">₹{Number(bill).toLocaleString()}</span>
                    <span>₹50,000</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-text-dim uppercase">Recommended System</p>
                    <p className="text-2xl font-bold mt-1">{recommendedKW} kW</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-text-dim uppercase">Est. Monthly Saving</p>
                    <p className="text-2xl font-bold mt-1 text-secondary">₹{Number(estimatedSavings).toLocaleString()}</p>
                  </div>
                </div>
                
                <button className="btn-primary w-full py-4">Get Detailed Quote</button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-primary/20 absolute -inset-10 blur-[100px] rounded-full"></div>
              <div className="relative z-10 glass-card p-8 text-center">
                <Calculator size={64} className="mx-auto mb-6 text-primary" />
                <h4 className="text-2xl mb-4">Why Solar?</h4>
                <ul className="text-left space-y-4">
                  <li className="flex gap-3">
                    <Zap className="text-primary shrink-0" />
                    <span>Reduce bills by up to 90%</span>
                  </li>
                  <li className="flex gap-3">
                    <ShieldCheck className="text-primary shrink-0" />
                    <span>Increase property value</span>
                  </li>
                  <li className="flex gap-3">
                    <Sun className="text-primary shrink-0" />
                    <span>Go Green - Help the planet</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 bg-white/[0.02]">
        <div className="container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl mb-4">Marketplace <span className="text-primary">Deals</span></h2>
              <p className="text-text-dim">Top-rated products from verified vendors.</p>
            </div>
            <button className="text-primary flex items-center gap-2 font-semibold">
              View All <ChevronRight size={18} />
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {apiData.products.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                onAdd={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24">
        <div className="container text-center mb-16">
          <h2 className="text-5xl mb-6">Expert <span className="text-primary">Services</span></h2>
          <p className="text-text-dim max-w-2xl mx-auto">
            Professional maintenance for your solar assets. We ensure maximum efficiency through regular care.
          </p>
        </div>
        
        <div className="container grid md:grid-cols-4 gap-6">
          {apiData.services.map(service => (
            <ServiceItem 
              key={service.id}
              icon={service.icon === 'Zap' ? <Zap className="text-primary" /> : <Settings className="text-primary" />}
              title={service.title}
              desc={service.duration}
            />
          ))}
        </div>
      </section>

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
              <li><a href="#" className="hover:text-primary">About Us</a></li>
              <li><a href="#" className="hover:text-primary">Marketplace</a></li>
              <li><a href="#" className="hover:text-primary">Services</a></li>
              <li>
                <button 
                  onClick={() => { setCurrentPage('vendor'); window.scrollTo(0,0); }}
                  className="hover:text-primary"
                >
                  Partner with Us
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
  return (
    <div className="glass-card p-4 group">
      <div className="h-64 rounded-xl overflow-hidden mb-6 bg-white/[0.03]">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" 
        />
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-primary uppercase tracking-widest">{product.category}</span>
        <div className="flex items-center gap-1 text-sm text-yellow-500">
          <Star size={14} fill="currentColor" />
          <span>{product.rating}</span>
        </div>
      </div>
      <h3 className="text-xl mb-4 font-bold">{product.title}</h3>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold">₹{product.price}</span>
        <button 
          onClick={() => onAdd(product)}
          className="bg-white/10 p-3 rounded-full hover:bg-primary hover:text-black transition-all"
        >
          <ShoppingCart size={20} />
        </button>
      </div>
    </div>
  );
}

function ServiceItem({ icon, title, desc }) {
  return (
    <div className="glass-card text-center p-8 group">
      <div className="mb-6 inline-block p-4 bg-white/5 rounded-2xl group-hover:bg-primary/20 transition-all">
        {React.cloneElement(icon, { size: 40 })}
      </div>
      <h4 className="text-xl mb-3 font-bold">{title}</h4>
      <p className="text-text-dim text-sm">{desc}</p>
      <button className="mt-6 text-sm font-bold text-primary flex items-center gap-1 mx-auto hover:gap-2 transition-all">
        Book Now <ChevronRight size={14} />
      </button>
    </div>
  );
}

export default App;
