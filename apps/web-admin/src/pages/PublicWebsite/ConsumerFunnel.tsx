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
  Wrench,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Award,
  Phone,
  Check,
  FileText,
  BadgePercent
} from 'lucide-react';

const heroImage = 'https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?auto=format&fit=crop&q=85&w=2400';

export default function ConsumerFunnel({ products = [], services = [], onAddProduct, onBookService }) {
  const [calcInputs, setCalcInputs] = useState({
    bill: 4500,
    area: 450,
    pincode: '208001'
  });

  const [activeCategory, setActiveCategory] = useState('All');
  const [openFaq, setOpenFaq] = useState(0);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [surveySubmitted, setSurveySubmitted] = useState(false);
  const [surveyForm, setSurveyForm] = useState({ name: '', phone: '', city: 'Kanpur', roofArea: '400-600 sq ft' });

  // Solar & PM Surya Ghar Subsidy Calculations
  const recommendedKW = Math.max(1, Math.min(10, Math.round((calcInputs.bill / 1400) * 10) / 10));
  const roundedKW = recommendedKW.toFixed(1);
  const unitsPerMonth = Math.round(recommendedKW * 120); // ~4 units/day/kW * 30 days
  const estimatedSavings = Math.round(calcInputs.bill * 0.88);
  const annualSavings = estimatedSavings * 12;
  const grossCost = Math.round(recommendedKW * 58000);

  // PM Surya Ghar Muft Bijli Yojana Central DBT Subsidy Formula:
  // 1 kW = ₹30,000; 2 kW = ₹60,000; 3 kW and above = ₹78,000 max.
  const centralSubsidy = useMemo(() => {
    if (recommendedKW <= 1) return 30000;
    if (recommendedKW <= 2) return 60000;
    return 78000;
  }, [recommendedKW]);

  const netCost = Math.max(20000, grossCost - centralSubsidy);
  const paybackYears = Math.max(1.8, (netCost / Math.max(1, annualSavings))).toFixed(1);
  const lifetime25yrSavings = Math.round((annualSavings * 25) - netCost);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    if (activeCategory === 'Kits') return products.filter(p => p.category === 'Kits');
    if (activeCategory === 'Inverters') return products.filter(p => p.category === 'Inverters');
    if (activeCategory === 'Eco-Home') return products.filter(p => p.category === 'Eco-Home');
    return products;
  }, [products, activeCategory]);

  const handleSurveySubmit = (e) => {
    e.preventDefault();
    setSurveySubmitted(true);
    setTimeout(() => {
      setSurveySubmitted(false);
      setIsSurveyModalOpen(false);
    }, 2500);
  };

  return (
    <div className="bg-[#050505] text-white">
      {/* Top Highlight Banner */}
      <div className="bg-gradient-to-r from-[#ffd700]/15 via-[#22c55e]/15 to-[#ffd700]/15 border-b border-[#ffd700]/20 py-2.5 px-4 text-center text-xs font-semibold text-[#ffd700] flex items-center justify-center gap-2">
        <BadgePercent size={16} className="text-[#ffd700] shrink-0" />
        <span>PM Surya Ghar Muft Bijli Yojana: Get up to <strong className="text-white underline">₹78,000 direct bank subsidy</strong> on rooftop solar installation!</span>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[88vh] flex items-center pt-20 pb-16 overflow-hidden">
        {/* Background glow & overlay */}
        <div className="absolute inset-0">
          <img src={heroImage} alt="Solar Panels on Modern Rooftop" className="h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/85 to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#ffd700]/10 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#22c55e]/10 blur-[150px] rounded-full pointer-events-none" />
        </div>
        
        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#ffd700]/30 bg-[#ffd700]/10 px-5 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#ffd700] shadow-[0_0_25px_rgba(255,215,0,0.15)]">
              <Sun size={15} className="text-[#ffd700]" />
              MNRE Approved & Certified Solar Platform
            </div>
            
            <h1 className="mb-8 text-5xl sm:text-7xl md:text-8xl font-black leading-[0.95] tracking-tighter">
              Switch to Solar.<br/>
              <span className="bg-gradient-to-r from-[#ffd700] via-[#ffe066] to-[#22c55e] bg-clip-text text-transparent">
                Slash Bills to Zero.
              </span>
            </h1>

            <p className="mb-10 text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed font-medium">
              Calculate your exact PM Surya Ghar subsidy in 30 seconds, pick a certified tier-1 kit with 25-year panel warranty, and get installation handled by verified local technicians.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <a 
                href="#calculator" 
                className="bg-[#ffd700] text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(255,215,0,0.3)] hover:bg-[#ffdf33] hover:scale-105 transition-all"
              >
                Calculate My Subsidy <Calculator size={20} />
              </a>
              <button 
                onClick={() => setIsSurveyModalOpen(true)}
                className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-white/20 transition-all"
              >
                Free Roof Survey <FileText size={20} className="text-[#ffd700]" />
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/10">
              <div>
                <p className="text-3xl font-black text-[#ffd700]">₹78,000</p>
                <p className="text-xs text-white/50 uppercase tracking-wider font-semibold mt-1">Max Govt Subsidy</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">48 Hours</p>
                <p className="text-xs text-white/50 uppercase tracking-wider font-semibold mt-1">Site Survey Guarantee</p>
              </div>
              <div>
                <p className="text-3xl font-black text-[#22c55e]">25 Years</p>
                <p className="text-xs text-white/50 uppercase tracking-wider font-semibold mt-1">Performance Warranty</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">4.9 ★</p>
                <p className="text-xs text-white/50 uppercase tracking-wider font-semibold mt-1">Verified Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive PM Surya Ghar & Solar Savings Calculator */}
      <section id="calculator" className="py-24 px-6 relative bg-gradient-to-b from-[#050505] via-[#09140e] to-[#050505] border-y border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#22c55e] mb-4">
              <Sparkles size={14} /> AI Savings Engine
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              Stop Paying High Bills.<br/>
              <span className="text-[#ffd700]">See Your Exact Numbers.</span>
            </h2>
            <p className="text-white/60 text-lg">
              Adjust your monthly bill and roof area. We dynamically compute the recommended capacity, PM Surya Ghar DBT subsidy, and payback timeline.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* Input Controls */}
            <div className="lg:col-span-5 bg-white/5 backdrop-blur-2xl p-8 rounded-[32px] border border-white/10 shadow-2xl space-y-8">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-black uppercase tracking-widest text-white/70">Average Monthly Bill</span>
                  <span className="text-2xl font-black text-[#ffd700]">₹{calcInputs.bill.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="1000" 
                  max="30000" 
                  step="500"
                  value={calcInputs.bill}
                  onChange={(e) => setCalcInputs({...calcInputs, bill: Number(e.target.value)})}
                  className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ffd700]"
                />
                <div className="flex justify-between text-[11px] text-white/40 mt-2 font-bold">
                  <span>₹1,000 (Small home)</span>
                  <span>₹15,000+ (AC/Villa)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-white/70 mb-2">Roof Area (sq ft)</label>
                  <input 
                    type="number"
                    value={calcInputs.area}
                    onChange={(e) => setCalcInputs({...calcInputs, area: Math.max(100, Number(e.target.value))})}
                    className="w-full bg-white/10 border border-white/15 p-4 rounded-2xl font-black text-white focus:border-[#ffd700] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-white/70 mb-2">Pincode (Location)</label>
                  <input 
                    type="text" 
                    value={calcInputs.pincode}
                    onChange={(e) => setCalcInputs({...calcInputs, pincode: e.target.value})}
                    placeholder="e.g. 208001"
                    className="w-full bg-white/10 border border-white/15 p-4 rounded-2xl font-black text-white focus:border-[#ffd700] outline-none"
                  />
                </div>
              </div>

              <div className="bg-[#ffd700]/10 border border-[#ffd700]/20 rounded-2xl p-4 flex items-center gap-3 text-xs text-[#ffd700] font-bold">
                <CheckCircle2 size={18} className="shrink-0" />
                <span>Eligible for PM Surya Ghar DBT Subsidy of ₹{centralSubsidy.toLocaleString()}!</span>
              </div>

              <button 
                onClick={() => setIsSurveyModalOpen(true)}
                className="w-full bg-[#ffd700] text-black font-black uppercase tracking-widest py-5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,215,0,0.2)] hover:bg-[#ffdf33] hover:scale-[1.02] transition-all"
              >
                Lock In This Subsidy Quote <ArrowRight size={18} />
              </button>
            </div>

            {/* Live Calculation Cards */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              <div className="p-8 rounded-[32px] bg-[#102018] border border-[#22c55e]/30 flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#22c55e]">Recommended System</span>
                  <Zap size={22} className="text-[#22c55e]" />
                </div>
                <div>
                  <span className="text-4xl font-black text-white">{roundedKW} kW</span>
                  <p className="text-xs text-white/50 mt-1">Generates ~{unitsPerMonth} units/month</p>
                </div>
              </div>

              <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#ffd700]/15 to-white/5 border border-[#ffd700]/30 flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#ffd700]">PM Surya Ghar Subsidy</span>
                  <BadgePercent size={22} className="text-[#ffd700]" />
                </div>
                <div>
                  <span className="text-4xl font-black text-[#ffd700]">₹{centralSubsidy.toLocaleString()}</span>
                  <p className="text-xs text-white/50 mt-1">Direct Bank Transfer (DBT)</p>
                </div>
              </div>

              <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Gross Cost vs Net Investment</span>
                  <IndianRupee size={22} className="text-white/40" />
                </div>
                <div>
                  <span className="text-3xl font-black text-white">₹{netCost.toLocaleString()}</span>
                  <p className="text-xs text-white/40 mt-1 line-through">Gross: ₹{grossCost.toLocaleString()}</p>
                </div>
              </div>

              <div className="p-8 rounded-[32px] bg-[#141f17] border border-[#22c55e]/20 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#22c55e]">Estimated Monthly Savings</span>
                  <PackageCheck size={22} className="text-[#22c55e]" />
                </div>
                <div>
                  <span className="text-3xl font-black text-[#22c55e]">₹{estimatedSavings.toLocaleString()}</span>
                  <p className="text-xs text-white/50 mt-1">Annual: ₹{annualSavings.toLocaleString()}/yr</p>
                </div>
              </div>

              {/* Full Width Payback Banner */}
              <div className="sm:col-span-2 p-8 rounded-[32px] bg-gradient-to-r from-white/5 via-[#ffd700]/10 to-white/5 border border-white/15 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#ffd700] block mb-1">Payback Period</span>
                  <span className="text-3xl font-black text-white">{paybackYears} Years</span>
                  <p className="text-xs text-white/50 mt-1">Free electricity for remaining 22+ years!</p>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#22c55e] block mb-1">25-Year Cumulative Savings</span>
                  <span className="text-3xl font-black text-[#22c55e]">₹{(lifetime25yrSavings / 100000).toFixed(1)} Lakhs+</span>
                  <p className="text-xs text-white/50 mt-1">ROI outperforms bank FDs and mutual funds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verified Solar Kits */}
      <section id="products" className="py-24 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#ffd700] mb-4">
                <Sun size={14} /> Tier-1 Hardware Catalogue
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Verified One-Stop Solar Kits</h2>
              <p className="text-white/50 text-lg max-w-xl">
                Complete all-inclusive packages: high-efficiency Mono PERC panels, smart grid-tied inverters, structure & installation.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
              {['All', 'Kits', 'Inverters', 'Eco-Home'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    activeCategory === cat 
                      ? 'bg-[#ffd700] text-black shadow-lg shadow-yellow-500/20' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAdd={onAddProduct}
                onSurvey={() => setIsSurveyModalOpen(true)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Services & Maintenance Platform */}
      <section id="services" className="py-24 px-6 bg-[#080808] border-t border-white/5">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#22c55e] mb-4">
              <Wrench size={14} /> Certified Technician Network
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Solar Care & Maintenance
            </h2>
            <p className="text-white/60 text-lg">
              Dirty panels lose up to 25% energy output. Keep your system at peak performance with certified on-demand cleaning, diagnostics, and Annual Maintenance Contracts (AMC).
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-[#22c55e]/40 transition-all group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#22c55e]/10 text-[#22c55e] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Wrench size={22} />
                  </div>
                  <h3 className="font-black text-xl mb-2 text-white">{service.title}</h3>
                  <p className="text-xs text-white/50 mb-6 leading-relaxed">{service.description}</p>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-4 pt-4 border-t border-white/10">
                    <span className="text-2xl font-black text-[#22c55e]">₹{service.price.toLocaleString()}</span>
                    <span className="text-[10px] uppercase font-bold text-white/40">{service.duration}</span>
                  </div>
                  <button 
                    onClick={() => onBookService(service)}
                    className="w-full bg-white/10 hover:bg-[#22c55e] hover:text-black text-white font-black uppercase tracking-wider text-xs py-3 rounded-xl transition-all"
                  >
                    Book Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid vs Solar Comparison Section */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Traditional Power vs. SolarHub
            </h2>
            <p className="text-white/50 text-lg">
              Why rooftop solar is the smartest financial upgrade for Indian homeowners.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-500/5 border border-red-500/20 rounded-[32px] p-8">
              <span className="text-xs font-black uppercase tracking-widest text-red-400 block mb-4">Without Solar</span>
              <h3 className="text-2xl font-black mb-6 text-white">Traditional DISCOM Grid Power</h3>
              <ul className="space-y-4 text-sm text-white/70">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-black">✕</span> High ₹7–₹9/unit peak tariffs increasing every single year.
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-black">✕</span> Sunk expense with ₹0 return on lifelong electricity bills.
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-black">✕</span> Frequent power fluctuations, summer load shedding & blackouts.
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-black">✕</span> High carbon footprint polluting Indian cities.
                </li>
              </ul>
            </div>

            <div className="bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-[32px] p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 bg-[#22c55e] text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl">
                Smart Choice
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-[#22c55e] block mb-4">With SolarHub</span>
              <h3 className="text-2xl font-black mb-6 text-white">SolarHub Rooftop Solar System</h3>
              <ul className="space-y-4 text-sm text-white/90">
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-[#22c55e] shrink-0" /> Up to ₹78,000 direct PM Surya Ghar subsidy into your bank.
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-[#22c55e] shrink-0" /> Generates free clean electricity for 25+ guaranteed years.
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-[#22c55e] shrink-0" /> Net metering credit allows exporting excess energy to DISCOM grid.
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-[#22c55e] shrink-0" /> Payback achieved in 2 to 3 years; massive lifetime savings.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Stories / Proof */}
      <section className="py-24 px-6 bg-[#080808] border-t border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Real Customers, Real Savings</h2>
            <p className="text-white/50 text-lg">See how homes across Uttar Pradesh and Delhi NCR eliminated their bills.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Vikram & Sunita Sharma',
                loc: 'Kanpur, UP',
                system: '5 kW Tata Power On-Grid Kit',
                billBefore: '₹6,400/mo',
                billAfter: '₹220/mo',
                quote: 'SolarHub managed everything from roof inspection to the PM Surya Ghar ₹78,000 DBT subsidy. Our bill dropped by 95%!'
              },
              {
                name: 'Rajesh Verma',
                loc: 'Lucknow, UP',
                system: '3 kW Luminous Hybrid Kit',
                billBefore: '₹4,200/mo',
                billAfter: '₹140/mo',
                quote: 'The hybrid kit with lithium battery means zero power cuts during summers and zero electricity bills. Superb installation team!'
              },
              {
                name: 'Anil Gupta',
                loc: 'Noida, Sector 62',
                system: '10 kW Commercial Rooftop',
                billBefore: '₹14,800/mo',
                billAfter: '₹1,200/mo',
                quote: 'Net metering application was completed in record time. Payback is on track for under 2.5 years. Highly recommended platform!'
              }
            ].map((story, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-[28px] p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-[#ffd700] mb-4">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed mb-6 italic">"{story.quote}"</p>
                </div>
                <div className="pt-6 border-t border-white/10">
                  <p className="font-black text-white">{story.name}</p>
                  <p className="text-xs text-[#ffd700] font-bold">{story.loc} • {story.system}</p>
                  <div className="mt-3 flex justify-between text-xs bg-black/40 p-2.5 rounded-xl">
                    <span className="text-white/40">Before: <span className="line-through">{story.billBefore}</span></span>
                    <span className="text-[#22c55e] font-black">Now: {story.billAfter}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-white/50 text-lg">Everything you need to know about rooftop solar adoption.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How does the PM Surya Ghar ₹78,000 subsidy reach my account?',
                a: 'Once your rooftop solar system is installed and the DISCOM net meter is energized, SolarHub assists with the national portal documentation. The central government directly transfers the subsidy (up to ₹78,000 for 3kW+) via Direct Benefit Transfer (DBT) into your bank account within 30 days.'
              },
              {
                q: 'How much roof space do I need for a 3kW or 5kW solar system?',
                a: 'On average, you need approximately 100 square feet of shadow-free rooftop area per 1 kW of solar panels. A 3 kW system requires ~300 sq ft, while a 5 kW system requires ~500 sq ft.'
              },
              {
                q: 'What is the warranty on panels and inverters?',
                a: 'All Tier-1 solar panels on SolarHub come with a 25-year manufacturer performance warranty (guaranteeing at least 80% generation after 25 years). Inverters carry a 5 to 10 year comprehensive warranty.'
              },
              {
                q: 'What happens during cloudy days or monsoon seasons?',
                a: 'Solar panels work on ambient daylight and continue generating power even on overcast days, though output is slightly lower (~25-40%). With net metering or hybrid battery backup, your home power remains uninterrupted.'
              }
            ].map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
              >
                <div className="p-6 flex justify-between items-center">
                  <span className="font-black text-lg text-white">{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={20} className="text-[#ffd700]" /> : <ChevronDown size={20} className="text-white/40" />}
                </div>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-sm text-white/60 leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Survey Modal */}
      {isSurveyModalOpen && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#102018] border border-[#ffd700]/30 rounded-[32px] p-8 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setIsSurveyModalOpen(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-white text-xl font-bold"
            >
              ✕
            </button>
            
            {surveySubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[#22c55e]/20 text-[#22c55e] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={36} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Request Received!</h3>
                <p className="text-white/60 text-sm">
                  Our certified solar technician will contact you within 24 hours to schedule your free rooftop survey and PM Surya Ghar subsidy filing.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#ffd700]/30 bg-[#ffd700]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#ffd700] mb-2">
                    Free Consultation
                  </div>
                  <h3 className="text-2xl font-black text-white">Book Free Roof Survey</h3>
                  <p className="text-white/50 text-xs mt-1">Get an engineer to evaluate your roof shadow and solar feasibility.</p>
                </div>

                <form onSubmit={handleSurveySubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={surveyForm.name}
                      onChange={(e) => setSurveyForm({...surveyForm, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-3.5 rounded-xl font-bold text-white text-sm focus:border-[#ffd700] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={surveyForm.phone}
                      onChange={(e) => setSurveyForm({...surveyForm, phone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-3.5 rounded-xl font-bold text-white text-sm focus:border-[#ffd700] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">City</label>
                      <input 
                        type="text" 
                        required
                        value={surveyForm.city}
                        onChange={(e) => setSurveyForm({...surveyForm, city: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-3.5 rounded-xl font-bold text-white text-sm focus:border-[#ffd700] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Approx Roof</label>
                      <select 
                        value={surveyForm.roofArea}
                        onChange={(e) => setSurveyForm({...surveyForm, roofArea: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-3.5 rounded-xl font-bold text-white text-sm focus:border-[#ffd700] outline-none"
                      >
                        <option value="200-400 sq ft" className="bg-black">200-400 sq ft</option>
                        <option value="400-600 sq ft" className="bg-black">400-600 sq ft</option>
                        <option value="600-1000 sq ft" className="bg-black">600-1000 sq ft</option>
                        <option value="1000+ sq ft" className="bg-black">1000+ sq ft</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#ffd700] text-black font-black uppercase tracking-widest py-4 rounded-xl text-sm shadow-lg shadow-yellow-500/20 hover:bg-[#ffdf33] transition-all mt-4"
                  >
                    Confirm Free Survey Callback
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onAdd, onSurvey }) {
  // Estimated subsidy if it's a kit
  const isKit = product.category === 'Kits';
  const subsidyAmount = isKit ? 78000 : 0;
  const netPrice = Math.max(product.price - subsidyAmount, 20000);

  return (
    <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden flex flex-col h-full group hover:border-[#ffd700]/50 transition-all duration-500 shadow-xl">
      <div className="h-60 overflow-hidden relative">
        <img 
          src={product.image_url} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-[#ffd700] text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-white/10">
          {product.vendor}
        </div>
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-[#ffd700] text-xs font-black px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
          <Star size={13} fill="currentColor" />
          <span>{product.rating}</span>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-1">
        <h3 className="text-2xl font-black mb-2 leading-snug text-white group-hover:text-[#ffd700] transition-colors">
          {product.title}
        </h3>
        <p className="text-sm text-white/50 mb-6 leading-relaxed line-clamp-2">{product.description}</p>
        
        {isKit && (
          <div className="bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-xl p-2.5 mb-6 text-xs text-[#22c55e] font-bold flex items-center justify-between">
            <span>PM Surya Ghar Subsidy:</span>
            <span className="font-black">Up to -₹78,000</span>
          </div>
        )}

        <div className="mt-auto pt-6 border-t border-white/10 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-0.5">
              {isKit ? 'Price (Net of Subsidy)' : 'Price'}
            </span>
            <span className="text-2xl font-black text-white">₹{(isKit ? netPrice : product.price).toLocaleString()}</span>
            {isKit && (
              <span className="text-xs text-white/30 line-through block">₹{product.price.toLocaleString()}</span>
            )}
          </div>
          
          <button 
            onClick={() => onAdd(product)}
            className="w-14 h-14 bg-[#ffd700] hover:bg-[#ffdf33] text-black rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-yellow-500/10"
            title="Add to Cart"
          >
            <ShoppingCart size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
