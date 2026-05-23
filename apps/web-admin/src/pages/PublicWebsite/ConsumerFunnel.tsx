import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  ArrowRight, 
  Zap, 
  IndianRupee, 
  Battery, 
  PackageCheck, 
  Sun,
  ShoppingCart,
  Star,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Wrench
} from 'lucide-react';

const heroImage = 'https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?auto=format&fit=crop&q=85&w=2400';

export default function ConsumerFunnel({ products, services, onAddProduct, onBookService }) {
  const [calcInputs, setCalcInputs] = useState({
    bill: 5000,
    area: 500,
    pincode: ''
  });

  const recommendedKW = Math.max(1, calcInputs.bill / 1500);
  const roundedKW = recommendedKW.toFixed(1);
  const estimatedSavings = Math.round(calcInputs.bill * 0.82);
  const estimatedCost = Math.round(recommendedKW * 62000);
  const paybackYears = Math.max(2.8, estimatedCost / Math.max(1, estimatedSavings * 12)).toFixed(1);

  const kits = useMemo(() => products.filter(p => p.category === 'Kits'), [products]);

  return (
    <div className="bg-[#f8faf7] text-[#102018]">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Solar Panels" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f8faf7] via-[#f8faf7]/90 to-transparent" />
        </div>
        
        <div className="container relative z-10 px-6">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d5e8d9] bg-white/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#326343] shadow-sm">
              <Sun size={14} className="animate-pulse" />
              Save up to 80% on electricity
            </div>
            <h1 className="mb-8 text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
              Switch to Solar.<br/>
              <span className="text-[#3e7c4d]">Zero hassle.</span>
            </h1>
            <p className="mb-10 text-xl font-medium text-[#47584d] max-w-xl leading-relaxed">
              Estimate your savings in 30 seconds, pick a verified solar kit, and let our certified technicians handle the rest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#calculator" className="bg-[#ffc400] text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-yellow-500/20 hover:scale-105 transition-transform">
                Calculate Savings <Calculator size={20} />
              </a>
              <a href="#kits" className="bg-white border border-[#cfded2] text-[#102018] px-10 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#f0f5f1] transition-colors">
                View Kits <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Stop guessing.<br/>Start saving.</h2>
              <p className="text-lg text-[#5f7165] mb-10 leading-relaxed">
                Enter your monthly bill and roof area to see why solar is the best investment for your home.
              </p>
              
              <div className="space-y-10">
                <div className="bg-white p-8 rounded-[32px] border border-[#dde9df] shadow-sm">
                  <label className="block mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#657268] block mb-4">Monthly Bill (Average)</span>
                    <input 
                      type="range" 
                      min="1000" 
                      max="30000" 
                      step="500"
                      value={calcInputs.bill}
                      onChange={(e) => setCalcInputs({...calcInputs, bill: Number(e.target.value)})}
                      className="w-full h-2 bg-[#e8efe9] rounded-lg appearance-none cursor-pointer accent-[#ffc400]"
                    />
                    <div className="flex justify-between mt-4">
                      <span className="text-3xl font-black">₹{calcInputs.bill.toLocaleString()}</span>
                      <span className="text-xs font-bold text-[#3e7c4d]">₹30,000 max</span>
                    </div>
                  </label>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <label className="block">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#657268] block mb-2">Roof Area (sq ft)</span>
                      <input 
                        type="number"
                        value={calcInputs.area}
                        onChange={(e) => setCalcInputs({...calcInputs, area: Number(e.target.value)})}
                        className="w-full bg-[#f8faf7] border border-[#dbe7dd] p-4 rounded-xl font-bold"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#657268] block mb-2">Pincode</span>
                      <input 
                        type="text"
                        placeholder="e.g. 208001"
                        className="w-full bg-[#f8faf7] border border-[#dbe7dd] p-4 rounded-xl font-bold"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <MetricCard icon={<Zap size={24} />} label="Recommended System" value={`${roundedKW} kW`} color="bg-[#102018] text-white" />
              <MetricCard icon={<IndianRupee size={24} />} label="Monthly Savings" value={`₹${estimatedSavings.toLocaleString()}`} color="bg-[#e7f6e8] text-[#103b20]" />
              <MetricCard icon={<PackageCheck size={24} />} label="Payback Period" value={`${paybackYears} Years`} color="bg-white border border-[#dde9df]" />
              <MetricCard icon={<Battery size={24} />} label="Est. Setup Cost" value={`₹${estimatedCost.toLocaleString()}`} color="bg-[#fff5c2] text-[#102018]" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Kits */}
      <section id="kits" className="bg-[#102018] text-white py-32 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">One-Step Solar Kits</h2>
              <p className="text-white/40 max-w-xl text-lg">
                Verified high-efficiency panels and inverters from India's top brands, with installation included.
              </p>
            </div>
            <button className="bg-[#ffc400] text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs">
              Browse All Products
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {kits.slice(0, 3).map(kit => (
              <ProductCard key={kit.id} product={kit} onAdd={onAddProduct} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Markers */}
      <section className="py-32 px-6 bg-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl font-black mb-20 tracking-tight">The SolarHub Advantage</h2>
          <div className="grid md:grid-cols-4 gap-12">
            {[
              { title: 'Verified Kits', icon: ShieldCheck, desc: 'Only GST-registered vendors with 4+ ratings.' },
              { title: 'Quick Install', icon: Truck, desc: 'Site survey in 48h, install in 7 days.' },
              { title: 'Expert Care', icon: Wrench, desc: 'Certified technicians for lifetime support.' },
              { title: 'Subsidy Help', icon: CheckCircle2, desc: 'We handle your PM Surya Ghar paperwork.' }
            ].map(item => (
              <div key={item.title} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#f8faf7] rounded-2xl flex items-center justify-center text-[#3e7c4d] mb-6">
                  <item.icon size={32} />
                </div>
                <h3 className="font-black text-xl mb-3">{item.title}</h3>
                <p className="text-sm text-[#647268] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ icon, label, value, color }) {
  return (
    <div className={`p-8 rounded-[32px] flex flex-col justify-between ${color}`}>
      <div className="opacity-60 mb-8">{icon}</div>
      <div>
        <span className="text-[10px] font-black uppercase tracking-widest block mb-1 opacity-60">{label}</span>
        <span className="text-2xl font-black leading-tight">{value}</span>
      </div>
    </div>
  );
}

function ProductCard({ product, onAdd }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col h-full group hover:border-[#ffc400]/30 transition-all">
      <div className="h-56 overflow-hidden">
        <img src={product.image_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      </div>
      <div className="p-8 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <span className="bg-[#ffc400]/15 text-[#ffc400] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{product.vendor}</span>
          <div className="flex items-center gap-1 text-[#ffc400]">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-black">{product.rating}</span>
          </div>
        </div>
        <h3 className="text-2xl font-black mb-3 leading-tight">{product.title}</h3>
        <p className="text-sm text-white/40 mb-8 leading-relaxed line-clamp-2">{product.description}</p>
        <div className="mt-auto pt-6 border-t border-white/10 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-1">Price</span>
            <span className="text-2xl font-black">₹{product.price.toLocaleString()}</span>
          </div>
          <button 
            onClick={() => onAdd(product)}
            className="w-14 h-14 bg-[#ffc400] text-black rounded-2xl flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-yellow-500/10"
          >
            <ShoppingCart size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
