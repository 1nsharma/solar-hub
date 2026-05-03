import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Wrench, 
  Zap, 
  ShieldCheck, 
  ChevronRight,
  Star,
  Calendar,
  Activity,
  Battery,
  ArrowRight,
  Smartphone,
  Download
} from 'lucide-react';
import { Card, Button, StatusBadge } from '@solar-hub/ui';
import { useStore } from '../../store/useStore';
import { translations } from '../../utils/translations';

export default function PublicWebsite({ onAddProduct, onBookService }) {
  const { products, services, language } = useStore();
  const t = translations[language] || translations['en'];
  
  const [activeTab, setActiveTab] = useState('products');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [calcInputs, setCalcInputs] = useState({
    bill: 5000,
    pincode: '',
    roofType: 'Flat',
    area: 500
  });

  const recommendedKW = (calcInputs.bill / 1500).toFixed(1);
  const estimatedSavings = (calcInputs.bill * 0.9).toFixed(0);
  const estimatedCost = (Number(recommendedKW) * 60000).toLocaleString();

  return (
    <>
      {/* HERO SECTION */}
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
        
        <div className="container relative z-10 px-6 perspective-1000">
          <div className="max-w-6xl mx-auto text-center md:text-left preserve-3d">
            <div className="inline-flex items-center gap-4 glass-premium px-8 py-4 rounded-[24px] mb-12 animate-fade-in shadow-2xl shimmer">
              <div className="bg-primary/20 p-2.5 rounded-xl border border-primary/20">
                <Zap size={20} className="text-primary animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">Autonomous Energy Grid v2.0</span>
            </div>
            
            <h1 className="text-7xl md:text-9xl lg:text-[140px] mb-12 leading-[0.85] animate-fade-in font-black tracking-tighter text-white drop-shadow-2xl">
              LIGHT THE <br className="hidden md:block"/> 
              <span className="text-primary relative inline-block italic gradient-text">
                FUTURE
                <div className="absolute -bottom-8 left-0 w-full h-8 bg-primary/20 blur-[60px] rounded-full"></div>
              </span>
            </h1>
            
            <p className="text-xl md:text-3xl text-white/50 mb-16 max-w-4xl leading-relaxed animate-fade-in font-medium italic" style={{ animationDelay: '0.2s' }}>
              The premium gateway for high-efficiency solar infrastructure, professional lifecycle services, and AI-driven energy optimization. 
            </p>
            
            <div className="flex flex-col sm:flex-row gap-10 animate-fade-in justify-center md:justify-start" style={{ animationDelay: '0.4s' }}>
              <Button 
                variant="primary"
                onClick={() => window.location.href = '#products'}
                className="text-xl px-20 py-8 shadow-[0_0_60px_rgba(255,215,0,0.4)] hover:scale-105 transition-all group btn-primary glow-primary"
              >
                START MISSION <ChevronRight size={28} className="inline ml-4 group-hover:translate-x-3 transition-transform" />
              </Button>
              <Button 
                variant="secondary"
                onClick={() => window.location.href = '#calculator'}
                className="text-xl px-20 py-8 bg-white/5 border-white/10 hover:bg-white/10 btn-secondary"
              >
                COMPUTE ROI
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute top-1/4 -right-40 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[200px] animate-pulse pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[180px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* SMART ROI CALCULATOR */}
      <section id="calculator" className="py-32 relative z-10 border-t border-white/5 bg-[#050505]/50">
        <div className="container px-6 mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white uppercase italic">Compute <span className="text-primary gradient-text">ROI</span></h2>
            <p className="text-white/40 text-lg md:text-xl font-medium tracking-[0.2em] uppercase">AI-Driven Savings Estimation</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center perspective-1000">
            <div className="glass-premium rounded-[32px] p-8 card-3d">
              <div className="space-y-8">
                <div>
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-white/50 mb-4 block">Monthly Electricity Bill (₹)</label>
                  <input 
                    type="range" 
                    min="1000" max="20000" step="500" 
                    value={calcInputs.bill}
                    onChange={(e) => setCalcInputs({...calcInputs, bill: Number(e.target.value)})}
                    className="w-full accent-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer hover:bg-white/20 transition-all"
                  />
                  <div className="text-4xl font-black text-white mt-4 italic">₹{calcInputs.bill.toLocaleString()}</div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div>
                     <label className="text-xs font-black uppercase tracking-[0.2em] text-white/50 mb-4 block">Roof Type</label>
                     <select 
                       value={calcInputs.roofType}
                       onChange={(e) => setCalcInputs({...calcInputs, roofType: e.target.value})}
                       className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 text-white font-medium outline-none focus:border-primary/50 transition-all"
                     >
                        <option value="Flat">Flat Roof</option>
                        <option value="Slanted">Slanted Roof</option>
                     </select>
                   </div>
                   <div>
                     <label className="text-xs font-black uppercase tracking-[0.2em] text-white/50 mb-4 block">Available Area (sq ft)</label>
                     <input 
                       type="number" 
                       value={calcInputs.area}
                       onChange={(e) => setCalcInputs({...calcInputs, area: Number(e.target.value)})}
                       className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 text-white font-medium outline-none focus:border-primary/50 transition-all"
                     />
                   </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
               <div className="glass-card bg-primary/10 border-primary/20 rounded-[32px] relative overflow-hidden group glow-primary">
                 <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 rounded-full blur-[40px] group-hover:scale-150 transition-all duration-700"></div>
                 <div className="relative z-10">
                   <div className="flex items-center gap-4 mb-4">
                     <Zap className="text-primary" size={24} />
                     <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Recommended System</span>
                   </div>
                   <div className="text-6xl font-black text-white italic tracking-tighter">{recommendedKW} <span className="text-2xl text-white/50">kW</span></div>
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-6">
                 <div className="glass-card bg-white/[0.02] border-white/5 rounded-[32px] hover:border-green-500/30 transition-all group glow-secondary">
                   <div className="flex items-center gap-4 mb-4">
                     <Activity className="text-green-500 group-hover:animate-pulse" size={24} />
                     <span className="text-xs font-black uppercase tracking-[0.2em] text-white/50">Monthly Savings</span>
                   </div>
                   <div className="text-3xl font-black text-green-500 italic tracking-tighter">₹{estimatedSavings}</div>
                 </div>
                 <div className="glass-card bg-white/[0.02] border-white/5 rounded-[32px] hover:border-blue-500/30 transition-all group">
                   <div className="flex items-center gap-4 mb-4">
                     <Battery className="text-blue-500 group-hover:animate-pulse" size={24} />
                     <span className="text-xs font-black uppercase tracking-[0.2em] text-white/50">Est. Setup Cost</span>
                   </div>
                   <div className="text-3xl font-black text-white italic tracking-tighter">₹{estimatedCost}</div>
                 </div>
               </div>
               <Button variant="primary" className="w-full py-6 text-lg rounded-[24px] mt-4 glow-primary group" onClick={() => { setActiveTab('products'); window.location.href = '#products'; }}>
                 BROWSE RECOMMENDED KITS <ArrowRight className="inline ml-2 group-hover:translate-x-2 transition-transform" />
               </Button>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-32 relative z-10">
        <div className="container px-6 mx-auto max-w-7xl">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white uppercase italic">Deployment <span className="text-primary gradient-text">Matrix</span></h2>
            <p className="text-white/40 text-lg md:text-xl font-medium tracking-[0.2em] uppercase">End-to-End Operational Lifecycle</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative perspective-1000">
             <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0"></div>
             
             {[
               { step: '01', title: 'Procure Assets', desc: 'Browse authenticated solar hardware from verified OEM vendors on our high-speed marketplace.', icon: <ShoppingCart size={32} className="text-black" /> },
               { step: '02', title: 'Dispatch Tech', desc: 'Instant Blinkit-style allocation of certified technicians for site-survey and installation.', icon: <Wrench size={32} className="text-black" /> },
               { step: '03', title: 'Lifecycle AMC', desc: 'Continuous performance monitoring and automated maintenance scheduling for 25+ years.', icon: <ShieldCheck size={32} className="text-black" /> }
             ].map((item, i) => (
               <div key={i} className="glass-card card-3d p-10 bg-[#050505]/50 border border-white/10 rounded-[40px] relative z-10 group shadow-2xl">
                 <div className="text-[100px] font-black text-white/5 absolute -top-10 -right-4 italic tracking-tighter group-hover:text-primary/10 transition-colors pointer-events-none">{item.step}</div>
                 <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-all duration-500 group-hover:rotate-12 shadow-[0_0_30px_rgba(255,215,0,0.3)] shimmer">
                   {item.icon}
                 </div>
                 <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">{item.title}</h3>
                 <p className="text-white/40 font-medium leading-relaxed">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* NEURAL MARKETPLACE */}
      <section id="products" className="py-40 relative z-10">
        <div className="container px-6 mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white uppercase italic">Neural <span className="text-primary gradient-text">Marketplace</span></h2>
            <p className="text-white/30 text-lg md:text-xl font-medium tracking-[0.2em] uppercase">Authenticated Products & Professional Logistics</p>
          </div>

          <div className="flex justify-center mb-20 perspective-1000">
            <div className="glass-premium p-2 rounded-[32px] flex gap-2 card-3d">
              <button 
                onClick={() => { setActiveTab('products'); setSelectedCategory('All'); }}
                className={`px-12 py-5 rounded-[24px] font-black transition-all flex items-center gap-4 text-xs uppercase tracking-[0.2em] ${activeTab === 'products' ? 'bg-primary text-black shadow-[0_0_30px_rgba(255,215,0,0.3)]' : 'text-white/30 hover:text-white'}`}
              >
                <ShoppingCart size={20} /> {(t && t.productsTab) || 'Products'}
              </button>
              <button 
                onClick={() => { setActiveTab('services'); setSelectedCategory('All'); }}
                className={`px-12 py-5 rounded-[24px] font-black transition-all flex items-center gap-4 text-xs uppercase tracking-[0.2em] ${activeTab === 'services' ? 'bg-primary text-black shadow-[0_0_30px_rgba(255,215,0,0.3)]' : 'text-white/30 hover:text-white'}`}
              >
                <Wrench size={20} /> {(t && t.servicesTab) || 'Services'}
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-10">
            {activeTab === 'products' ? (
              products
                .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
                .map(product => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onAdd={onAddProduct}
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
                      service.icon_name === 'Settings' ? <Wrench className="text-primary" /> :
                      service.icon_name === 'Wrench' ? <Wrench className="text-primary" /> :
                      service.icon_name === 'ShieldCheck' ? <ShieldCheck className="text-primary" /> :
                      <Zap className="text-primary" />
                    }
                    title={service.title}
                    desc={service.duration}
                    price={service.price}
                    fullDesc={service.description}
                    onBook={() => onBookService(service)}
                  />
                ))
            )}
          </div>
        </div>
      </section>

      {/* APP DOWNLOAD CTA */}
      <section className="py-32 relative z-10 border-t border-white/5 bg-gradient-to-b from-[#050505] to-primary/5">
        <div className="container px-6 mx-auto max-w-6xl perspective-1000">
          <div className="glass-premium p-12 md:p-20 rounded-[48px] text-center relative overflow-hidden card-3d">
             <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-[80px]"></div>
             <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-[80px]"></div>
             
             <div className="relative z-10">
               <div className="w-24 h-24 bg-primary/10 border border-primary/30 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-[0_0_40px_rgba(255,215,0,0.2)] animate-float shimmer">
                 <Smartphone size={40} className="text-primary" />
               </div>
               <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-white uppercase italic">Install the <span className="text-primary gradient-text">Terminal</span></h2>
               <p className="text-white/40 text-lg md:text-2xl font-medium tracking-widest uppercase max-w-3xl mx-auto mb-14">
                 Full access to the SolarHub network right from your pocket. Track ROI, monitor generation, and deploy technicians instantly.
               </p>
               <div className="flex flex-col sm:flex-row gap-6 justify-center">
                 <Button variant="primary" className="py-6 px-12 text-lg rounded-[24px] shadow-[0_0_30px_rgba(255,215,0,0.2)] hover:scale-105 transition-all flex items-center justify-center gap-4 group glow-primary">
                   <Download size={24} className="group-hover:-translate-y-1 transition-transform" /> DOWNLOAD FOR IOS
                 </Button>
                 <Button variant="outline" className="py-6 px-12 text-lg rounded-[24px] hover:bg-white/10 transition-all flex items-center justify-center gap-4 group bg-white/5 border-white/20">
                   <Download size={24} className="group-hover:-translate-y-1 transition-transform" /> DOWNLOAD FOR ANDROID
                 </Button>
               </div>
             </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ProductCard({ product, onAdd }) {
  return (
    <div className="glass-card group flex flex-col h-full relative overflow-hidden p-6 hover:glow-primary card-3d">
      <div className="h-72 rounded-[24px] overflow-hidden mb-8 bg-white/5 relative border border-white/5">
        <img 
          src={product.image_url} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" 
        />
        {parseFloat(product.rating) >= 4.8 && (
          <div className="absolute top-5 left-5">
             <StatusBadge status="ELITE" className="bg-[#FFD700] text-black border-none px-4 py-1 font-black shadow-[0_0_15px_rgba(255,215,0,0.5)] shimmer" />
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <StatusBadge status={product.category} className="bg-primary/10 text-primary border-primary/20 px-3 py-1 font-black" />
          <div className="flex items-center gap-1.5 text-xs text-yellow-500 font-black bg-yellow-500/10 px-3 py-1 rounded-xl border border-yellow-500/20">
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

        <div className="bg-white/5 p-6 mb-8 border border-white/5 group-hover:bg-white/[0.08] transition-all rounded-2xl">
          <p className="text-xs text-white/50 leading-relaxed font-medium mb-4 italic">
            {product.description}
          </p>
          <div className="flex justify-between items-center">
             <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">FINANCING READY</span>
             <span className="text-xs text-primary font-black italic">₹{Math.round(product.price / 36).toLocaleString()}/MO</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-white/5 mt-auto">
        <div>
          <span className="text-3xl font-black text-white italic">₹{product.price.toLocaleString()}</span>
          <span className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em] block mt-1">Uplink Pricing</span>
        </div>
        <button 
          onClick={() => onAdd(product)}
          className="bg-primary text-black p-5 rounded-2xl hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] transition-all transform active:scale-90 shadow-2xl border border-primary/20 hover:-translate-y-1"
        >
          <ShoppingCart size={28} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

function ServiceItem({ icon, title, desc, price, fullDesc, onBook }) {
  return (
    <div className="glass-card text-center p-10 group flex flex-col h-full relative overflow-hidden hover:glow-primary card-3d">
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary/5 rounded-full group-hover:bg-primary/20 transition-all duration-700 blur-xl"></div>
      
      <div className="mb-10 inline-block p-6 bg-white/5 rounded-3xl group-hover:bg-primary/20 transition-all transform group-hover:rotate-12 border border-white/5 shadow-lg group-hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]">
        {React.cloneElement(icon, { size: 48 })}
      </div>
      
      <h4 className="text-3xl mb-3 font-black text-white italic tracking-tighter">{title}</h4>
      <div className="flex justify-center mb-6">
        <StatusBadge status={`STARTS @ ₹${price}`} className="bg-primary/10 text-primary border-primary/20 px-4 py-1 font-black shadow-[0_0_15px_rgba(255,215,0,0.2)]" />
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
        className="w-full py-5 rounded-2xl uppercase font-black tracking-widest text-xs group-hover:bg-primary group-hover:text-black transition-all italic border-white/20 bg-white/5"
      >
        AUTHORIZE SERVICE <ChevronRight size={20} className="inline ml-2" />
      </Button>
    </div>
  );
}
