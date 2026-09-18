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
  BadgePercent,
  Sliders,
  CheckCircle,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  MapPin,
  ExternalLink,
  Shield,
  Layers
} from 'lucide-react';
import { calculateSolarRecommendation } from '@solar-hub/shared';
import { useStore } from '../../store/useStore';

const heroImage = 'https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?auto=format&fit=crop&q=85&w=2400';

export default function ConsumerFunnel({ products = [], services = [], onAddProduct, onBookService }) {
  const { createLead } = useStore();
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
  const [selectedSystemType, setSelectedSystemType] = useState('residential');

  // Canonical Solar & PM Surya Ghar Subsidy Calculations from @solar-hub/shared
  const solarCalc = useMemo(() => {
    return calculateSolarRecommendation({
      monthlyBill: calcInputs.bill,
      roofAreaSqFt: calcInputs.area,
      tariffPerUnit: 7
    });
  }, [calcInputs.bill, calcInputs.area]);

  const recommendedKW = solarCalc.recommendedKw;
  const roundedKW = recommendedKW.toFixed(1);
  const unitsPerMonth = solarCalc.monthlyUnits;
  const estimatedSavings = solarCalc.monthlySavings;
  const annualSavings = solarCalc.annualSavings;
  const grossCost = solarCalc.grossCost;
  const centralSubsidy = solarCalc.centralSubsidy;
  const netCost = solarCalc.netCost;
  const paybackYears = solarCalc.paybackYears != null ? solarCalc.paybackYears.toFixed(1) : '2.1';
  const lifetime25yrSavings = solarCalc.lifetime25yrSavings;

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    if (activeCategory === 'Kits') return products.filter(p => p.category === 'Kits');
    if (activeCategory === 'Inverters') return products.filter(p => p.category === 'Inverters');
    if (activeCategory === 'Eco-Home') return products.filter(p => p.category === 'Eco-Home');
    return products;
  }, [products, activeCategory]);

  const handleSurveySubmit = async (e) => {
    e.preventDefault();
    try {
      const leadPayload = {
        name: surveyForm.name,
        customer_name: surveyForm.name,
        phone: surveyForm.phone,
        customer_phone: surveyForm.phone,
        city: surveyForm.city,
        pincode: calcInputs.pincode,
        requirement: `Rooftop Solar Survey (${surveyForm.roofArea}) | Bill: ₹${calcInputs.bill} | Recommended: ${roundedKW}kW`,
        interest_type: 'Residential Rooftop',
        estimated_load: recommendedKW,
        monthly_bill: calcInputs.bill,
        roof_area: calcInputs.area,
        roof_area_sqft: calcInputs.area,
        recommended_kw: recommendedKW,
        subsidy_amount: centralSubsidy,
        estimated_savings: estimatedSavings,
        source: 'web_survey_modal',
        calculator_payload: {
          monthlyBill: calcInputs.bill,
          roofAreaSqFt: calcInputs.area,
          recommendedKw: recommendedKW,
          centralSubsidy,
          grossCost,
          netCost,
          paybackYears,
          lifetime25yrSavings,
          annualSavings
        }
      };
      if (createLead) {
        await createLead(leadPayload);
      }
    } catch (err) {
      console.warn('Lead submission error:', err);
    }
    setSurveySubmitted(true);
    setTimeout(() => {
      setSurveySubmitted(false);
      setIsSurveyModalOpen(false);
    }, 2500);
  };

  return (
    <div className="bg-[#060907] text-white relative selection:bg-[#FFD700] selection:text-black">
      {/* Background Ambient Glows */}
      <div className="ambient-glow-solar top-10 -left-60" />
      <div className="ambient-glow-emerald top-[600px] -right-60" />

      {/* Top Subsidy Announcement Ticker */}
      <div className="bg-gradient-to-r from-[#FFD700]/10 via-[#10B981]/15 to-[#FFD700]/10 border-b border-white/[0.08] py-3 px-4 text-center text-xs font-semibold text-white/90 relative z-20">
        <div className="container mx-auto flex items-center justify-center gap-2.5 flex-wrap">
          <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-ping shrink-0" />
          <span className="font-bold text-[#FFD700]">PM Surya Ghar Muft Bijli Yojana:</span>
          <span>Claim direct DBT bank credit up to <strong className="text-white bg-white/10 px-2 py-0.5 rounded-md border border-white/20">₹78,000</strong> on verified residential installations!</span>
          <a href="#calculator" className="text-[#FFD700] hover:underline font-bold ml-1 inline-flex items-center gap-1">
            Calculate Eligibility <ArrowRight size={12} />
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-20 overflow-hidden bg-grid-pattern">
        {/* Background Image Layer with overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <img 
            src={heroImage} 
            alt="Solar Panels on Modern Rooftop" 
            className="h-full w-full object-cover opacity-15 mix-blend-luminosity" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060907] via-[#060907]/90 to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-7">
              {/* Certification Badge */}
              <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#FFD700] shadow-[0_0_25px_rgba(255,215,0,0.15)]">
                <Sun size={15} className="text-[#FFD700] animate-spin-slow" />
                <span>MNRE Approved & Certified Solar Platform</span>
              </div>
              
              {/* Main Headline */}
              <h1 className="mb-6 text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-black leading-[0.98] tracking-tight font-heading">
                Turn Sunlight Into <br/>
                <span className="text-gradient-solar">
                  Zero Electricity Bills.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="mb-8 text-base sm:text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed font-normal">
                India's all-in-one solar ecosystem: Calculate your exact PM Surya Ghar subsidy in seconds, configure certified Tier-1 Mono PERC kits, and schedule installation with verified local engineers.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <a 
                  href="#calculator" 
                  className="btn-gold text-sm uppercase tracking-widest py-4 sm:py-5 px-8 sm:px-10 rounded-2xl shadow-glow-gold"
                >
                  Calculate My Subsidy <Calculator size={19} />
                </a>
                <button 
                  onClick={() => setIsSurveyModalOpen(true)}
                  className="btn-ghost-glass text-sm uppercase tracking-widest py-4 sm:py-5 px-8 sm:px-10 rounded-2xl"
                >
                  Free Roof Survey <FileText size={18} className="text-[#FFD700]" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/[0.08]">
                <div className="glass-card-interactive p-4 rounded-2xl">
                  <p className="text-2xl sm:text-3xl font-black text-[#FFD700] font-heading">₹78,000</p>
                  <p className="text-[11px] text-white/50 uppercase tracking-wider font-bold mt-1">Direct DBT Subsidy</p>
                </div>
                <div className="glass-card-interactive p-4 rounded-2xl">
                  <p className="text-2xl sm:text-3xl font-black text-white font-heading">48 Hours</p>
                  <p className="text-[11px] text-white/50 uppercase tracking-wider font-bold mt-1">Site Survey SLA</p>
                </div>
                <div className="glass-card-interactive p-4 rounded-2xl">
                  <p className="text-2xl sm:text-3xl font-black text-[#10B981] font-heading">25 Years</p>
                  <p className="text-[11px] text-white/50 uppercase tracking-wider font-bold mt-1">Linear Warranty</p>
                </div>
                <div className="glass-card-interactive p-4 rounded-2xl">
                  <p className="text-2xl sm:text-3xl font-black text-white font-heading">4.9 ★</p>
                  <p className="text-[11px] text-white/50 uppercase tracking-wider font-bold mt-1">Verified Rating</p>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Interactive Quick Solar Estimator Card */}
            <div className="lg:col-span-5">
              <div className="glass-panel p-6 sm:p-8 rounded-[32px] border border-white/[0.12] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FFD700]/20 to-transparent rounded-bl-full pointer-events-none" />
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest text-white/80">Instant ROI Preview</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30">
                    2026 Policy
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Slider Preview */}
                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-xs font-bold text-white/60">Current Monthly DISCOM Bill:</span>
                      <span className="text-xl font-black text-[#FFD700] font-heading">₹{calcInputs.bill.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range" 
                      min="1500" 
                      max="20000" 
                      step="500"
                      value={calcInputs.bill}
                      onChange={(e) => setCalcInputs({...calcInputs, bill: Number(e.target.value)})}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[10px] text-white/40 mt-1 font-semibold">
                      <span>₹1,500</span>
                      <span>₹10,000</span>
                      <span>₹20,000</span>
                    </div>
                  </div>

                  {/* Dynamic Results Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-white/[0.03] border border-white/[0.06] p-4 rounded-2xl">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">Recommended Kit</span>
                      <span className="text-2xl font-black text-white font-heading">{roundedKW} kW</span>
                      <span className="text-[10px] text-white/50 block mt-0.5">~{unitsPerMonth} units/mo</span>
                    </div>

                    <div className="bg-[#FFD700]/[0.08] border border-[#FFD700]/25 p-4 rounded-2xl">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD700] block mb-1">Govt. DBT Subsidy</span>
                      <span className="text-2xl font-black text-[#FFD700] font-heading">₹{centralSubsidy.toLocaleString()}</span>
                      <span className="text-[10px] text-[#FFD700]/80 block mt-0.5">Credited to Bank</span>
                    </div>

                    <div className="bg-[#10B981]/[0.08] border border-[#10B981]/25 p-4 rounded-2xl">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#10B981] block mb-1">Monthly Savings</span>
                      <span className="text-2xl font-black text-[#10B981] font-heading">₹{estimatedSavings.toLocaleString()}</span>
                      <span className="text-[10px] text-[#10B981]/80 block mt-0.5">~90% Bill Reduction</span>
                    </div>

                    <div className="bg-white/[0.03] border border-white/[0.06] p-4 rounded-2xl">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">Payback Period</span>
                      <span className="text-2xl font-black text-white font-heading">{paybackYears} Yrs</span>
                      <span className="text-[10px] text-white/50 block mt-0.5">Free power after</span>
                    </div>
                  </div>

                  {/* Net Cost Highlight */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-white/[0.04] to-white/[0.02] border border-white/[0.08] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block">Estimated Net Investment</span>
                      <span className="text-xl font-black text-white font-heading">₹{netCost.toLocaleString()}</span>
                    </div>
                    <span className="text-xs text-white/40 line-through">MRP: ₹{grossCost.toLocaleString()}</span>
                  </div>

                  {/* Lock In CTA */}
                  <button 
                    onClick={() => setIsSurveyModalOpen(true)}
                    className="w-full btn-gold py-4 rounded-2xl text-xs uppercase tracking-widest font-black shadow-glow-gold flex items-center justify-center gap-2"
                  >
                    Lock In This Subsidy Quote <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tier-1 Manufacturer Ecosystem Ribbon */}
      <section className="py-12 border-y border-white/[0.06] bg-[#050706] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="shrink-0 flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck size={18} className="text-[#10B981]" />
              <span>Certified Equipment Ecosystem</span>
            </div>
            
            <div className="flex items-center gap-8 sm:gap-14 flex-wrap justify-center opacity-70 hover:opacity-100 transition-opacity text-sm sm:text-base font-black tracking-widest uppercase text-white/80">
              <span className="hover:text-[#FFD700] transition-colors">Tata Power Solar</span>
              <span className="hover:text-[#FFD700] transition-colors">Waaree Energies</span>
              <span className="hover:text-[#FFD700] transition-colors">Luminous Solar</span>
              <span className="hover:text-[#FFD700] transition-colors">Microtek Green</span>
              <span className="hover:text-[#FFD700] transition-colors">Havells Enviro</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive AI Savings Engine & Subsidy Calculator */}
      <section id="calculator" className="py-24 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#10B981] mb-4">
              <Sparkles size={14} /> Comprehensive Solar Calculator
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight font-heading mb-4">
              Stop Overpaying DISCOM.<br/>
              <span className="text-gradient-gold">See Your Exact Numbers.</span>
            </h2>
            <p className="text-white/60 text-base sm:text-lg">
              Adjust your monthly electric bill and roof space. Our engine applies the 2026 PM Surya Ghar DBT policy to output your recommended capacity, payback, and lifetime savings.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Input Controls Card */}
            <div className="lg:col-span-5 glass-panel p-8 rounded-[32px] border border-white/[0.1] shadow-2xl space-y-8">
              {/* Type Switcher */}
              <div className="flex p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setSelectedSystemType('residential')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${selectedSystemType === 'residential' ? 'bg-[#FFD700] text-black shadow-md' : 'text-white/60 hover:text-white'}`}
                >
                  Residential (Subsidy)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSystemType('commercial')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${selectedSystemType === 'commercial' ? 'bg-[#FFD700] text-black shadow-md' : 'text-white/60 hover:text-white'}`}
                >
                  Commercial (MSME)
                </button>
              </div>

              {/* Monthly Bill Slider */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-black uppercase tracking-widest text-white/70">Average Monthly Electricity Bill</span>
                  <span className="text-2xl font-black text-[#FFD700] font-heading">₹{calcInputs.bill.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="1000" 
                  max="35000" 
                  step="500"
                  value={calcInputs.bill}
                  onChange={(e) => setCalcInputs({...calcInputs, bill: Number(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-[11px] text-white/40 mt-2 font-semibold">
                  <span>₹1,000 (Small Home)</span>
                  <span>₹10,000 (3-4 BHK)</span>
                  <span>₹35,000+ (Villa)</span>
                </div>
              </div>

              {/* Roof Area & Pincode */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-white/70 mb-2">Roof Area (sq ft)</label>
                  <input 
                    type="number"
                    value={calcInputs.area}
                    onChange={(e) => setCalcInputs({...calcInputs, area: Math.max(100, Number(e.target.value))})}
                    className="w-full bg-white/[0.05] border border-white/[0.12] p-4 rounded-2xl font-black text-white focus:border-[#FFD700] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-white/70 mb-2">Location (PIN)</label>
                  <input 
                    type="text" 
                    value={calcInputs.pincode}
                    onChange={(e) => setCalcInputs({...calcInputs, pincode: e.target.value})}
                    placeholder="e.g. 208001"
                    className="w-full bg-white/[0.05] border border-white/[0.12] p-4 rounded-2xl font-black text-white focus:border-[#FFD700] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Subsidy Slab Breakdown Badge */}
              <div className="bg-[#FFD700]/[0.08] border border-[#FFD700]/25 rounded-2xl p-4 flex items-start gap-3.5 text-xs text-[#FFD700]">
                <CheckCircle2 size={20} className="shrink-0 mt-0.5 text-[#FFD700]" />
                <div>
                  <p className="font-black uppercase tracking-wide">PM Surya Ghar DBT Tier: ₹{centralSubsidy.toLocaleString()}</p>
                  <p className="text-white/60 text-[11px] mt-0.5">
                    Central government provides ₹30,000 for 1kW, ₹60,000 for 2kW, and max ₹78,000 for 3kW+ directly to your bank account.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <button 
                onClick={() => setIsSurveyModalOpen(true)}
                className="w-full btn-gold py-5 rounded-2xl text-xs uppercase tracking-widest font-black shadow-glow-gold flex items-center justify-center gap-2"
              >
                Schedule Free On-Site Feasibility <ArrowRight size={18} />
              </button>
            </div>

            {/* Live Calculation Output Cards */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {/* Recommended Capacity */}
              <div className="p-7 rounded-[28px] bg-[#0d1611] border border-[#10B981]/30 flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#10B981]">Recommended Solar Capacity</span>
                  <div className="w-9 h-9 rounded-xl bg-[#10B981]/15 flex items-center justify-center text-[#10B981]">
                    <Zap size={18} />
                  </div>
                </div>
                <div>
                  <span className="text-4xl font-black text-white font-heading">{roundedKW} kW</span>
                  <p className="text-xs text-white/50 mt-1">Generates ~{unitsPerMonth} units/month (Tier-1)</p>
                </div>
              </div>

              {/* PM Surya Ghar Subsidy */}
              <div className="p-7 rounded-[28px] bg-gradient-to-br from-[#FFD700]/15 to-white/[0.02] border border-[#FFD700]/30 flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#FFD700]">PM Surya Ghar DBT Subsidy</span>
                  <div className="w-9 h-9 rounded-xl bg-[#FFD700]/15 flex items-center justify-center text-[#FFD700]">
                    <BadgePercent size={18} />
                  </div>
                </div>
                <div>
                  <span className="text-4xl font-black text-[#FFD700] font-heading">₹{centralSubsidy.toLocaleString()}</span>
                  <p className="text-xs text-white/50 mt-1">Direct Benefit Transfer to your bank</p>
                </div>
              </div>

              {/* Net Investment */}
              <div className="p-7 rounded-[28px] glass-panel border border-white/[0.1] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black uppercase tracking-widest text-white/50">Net Homeowner Outlay</span>
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white/70">
                    <IndianRupee size={18} />
                  </div>
                </div>
                <div>
                  <span className="text-3xl font-black text-white font-heading">₹{netCost.toLocaleString()}</span>
                  <p className="text-xs text-white/40 mt-1 line-through">Gross MRP: ₹{grossCost.toLocaleString()}</p>
                </div>
              </div>

              {/* Monthly Savings */}
              <div className="p-7 rounded-[28px] bg-[#101b14] border border-[#10B981]/25 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#10B981]">Estimated Monthly Savings</span>
                  <div className="w-9 h-9 rounded-xl bg-[#10B981]/15 flex items-center justify-center text-[#10B981]">
                    <PackageCheck size={18} />
                  </div>
                </div>
                <div>
                  <span className="text-3xl font-black text-[#10B981] font-heading">₹{estimatedSavings.toLocaleString()}</span>
                  <p className="text-xs text-white/50 mt-1">Annual Savings: ₹{annualSavings.toLocaleString()}/yr</p>
                </div>
              </div>

              {/* Payback & 25-Year Cumulative ROI Banner */}
              <div className="sm:col-span-2 p-8 rounded-[28px] bg-gradient-to-r from-white/[0.04] via-[#FFD700]/[0.08] to-white/[0.04] border border-white/[0.12] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD700] block mb-1">Estimated Payback Period</span>
                  <span className="text-3xl font-black text-white font-heading">{paybackYears} Years</span>
                  <p className="text-xs text-white/50 mt-1">Enjoy 100% free electricity for the remaining 22+ years!</p>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#10B981] block mb-1">25-Year Cumulative Return</span>
                  <span className="text-3xl font-black text-[#10B981] font-heading">₹{(lifetime25yrSavings / 100000).toFixed(1)} Lakhs+</span>
                  <p className="text-xs text-white/50 mt-1">Beats Fixed Deposits & traditional savings returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verified Tier-1 Solar Hardware Catalog */}
      <section id="products" className="py-24 px-6 border-t border-white/[0.06]">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#FFD700] mb-4">
                <Sun size={14} /> Tier-1 Hardware Marketplace
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-heading mb-3">Verified Solar Packages</h2>
              <p className="text-white/50 text-base sm:text-lg max-w-xl font-normal">
                Complete all-inclusive packages: high-efficiency Mono PERC half-cut modules, smart grid-tie inverters, mounting structures, and 25-year performance warranty.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.08]">
              {['All', 'Kits', 'Inverters', 'Eco-Home'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    activeCategory === cat 
                      ? 'bg-[#FFD700] text-black shadow-lg shadow-yellow-500/20' 
                      : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {cat === 'All' ? 'All Systems' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* 4-Step Solar Adoption Journey */}
      <section id="journey" className="py-24 px-6 bg-[#040605] border-t border-white/[0.06] relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#FFD700] mb-4">
              <Layers size={14} /> Frictionless Workflow
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-heading mb-4">
              Your 4-Step Journey to <br/><span className="text-gradient-gold">Energy Independence</span>
            </h2>
            <p className="text-white/60 text-base sm:text-lg">
              From roof measurement to your first free electricity bill, SolarHub coordinates every single milestone.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: '3D Shadow Analysis',
                desc: 'Certified local solar engineer visits your roof to conduct satellite shadow evaluation and measure precise structural load.',
                icon: <FileText size={24} className="text-[#FFD700]" />
              },
              {
                step: '02',
                title: 'Hardware Selection',
                desc: 'Select your preferred Tier-1 brand kit (Tata, Waaree, Luminous) with optimal string inverter and bidirectional meter.',
                icon: <Sun size={24} className="text-[#FFD700]" />
              },
              {
                step: '03',
                title: '48-Hour Installation',
                desc: 'Experienced certified technicians assemble corrosion-resistant GI structure, mount panels, and execute electrical wiring.',
                icon: <Wrench size={24} className="text-[#10B981]" />
              },
              {
                step: '04',
                title: 'Net Metering & Subsidy',
                desc: 'DISCOM inspector energizes the bi-directional net meter and ₹78,000 subsidy is disbursed directly to your bank account via DBT.',
                icon: <BadgePercent size={24} className="text-[#10B981]" />
              }
            ].map((item, idx) => (
              <div key={idx} className="glass-card-interactive p-7 rounded-3xl flex flex-col justify-between relative group">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-black font-heading text-white/15 group-hover:text-[#FFD700]/30 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="font-black text-xl mb-3 text-white font-heading">{item.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed font-normal">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solar Care & Technician Network */}
      <section id="services" className="py-24 px-6 border-t border-white/[0.06]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#10B981] mb-4">
              <Wrench size={14} /> Certified Technician Network
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-heading mb-4">
              Solar Care & Maintenance
            </h2>
            <p className="text-white/60 text-base sm:text-lg">
              Dirty panels lose up to 25% energy output. Protect your 25-year investment with certified on-demand de-ionized water washing, inverter diagnostics, and Annual Maintenance Contracts (AMC).
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="glass-panel p-6 rounded-3xl border border-white/[0.08] hover:border-[#10B981]/40 flex flex-col justify-between transition-all group hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(16,185,129,0.15)]"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Wrench size={22} />
                  </div>
                  <h3 className="font-black text-lg mb-2 text-white font-heading">{service.title}</h3>
                  <p className="text-xs text-white/50 mb-6 leading-relaxed line-clamp-3">{service.description}</p>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-4 pt-4 border-t border-white/[0.08]">
                    <span className="text-2xl font-black text-[#10B981] font-heading">₹{service.price.toLocaleString()}</span>
                    <span className="text-[10px] uppercase font-bold text-white/40">{service.duration}</span>
                  </div>
                  <button 
                    onClick={() => onBookService(service)}
                    className="w-full bg-white/[0.06] hover:bg-[#10B981] hover:text-black text-white font-black uppercase tracking-wider text-xs py-3 rounded-xl transition-all shadow-sm"
                  >
                    Book Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Traditional DISCOM Power vs SolarHub Comparison */}
      <section className="py-24 px-6 border-t border-white/[0.06] bg-[#050706]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-heading mb-4">
              Traditional Grid Power vs. SolarHub
            </h2>
            <p className="text-white/50 text-base sm:text-lg">
              Why rooftop solar is the highest ROI financial upgrade for Indian homeowners.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Without Solar */}
            <div className="bg-red-500/[0.04] border border-red-500/20 rounded-[32px] p-8 sm:p-10">
              <span className="text-xs font-black uppercase tracking-widest text-red-400 block mb-3">Without Solar</span>
              <h3 className="text-2xl font-black mb-6 text-white font-heading">Traditional DISCOM Utility Grid</h3>
              <ul className="space-y-4 text-sm text-white/70">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-black text-base leading-tight">✕</span>
                  <span>High ₹7–₹10/unit peak tariffs rising 4-7% every single year.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-black text-base leading-tight">✕</span>
                  <span>Pure sunk cost with ₹0 financial return across 25 years of payments.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-black text-base leading-tight">✕</span>
                  <span>Summer voltage fluctuations and unannounced power outages.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-black text-base leading-tight">✕</span>
                  <span>Heavy reliance on coal-fired grid polluting local air quality.</span>
                </li>
              </ul>
            </div>

            {/* With SolarHub */}
            <div className="bg-[#10B981]/[0.08] border border-[#10B981]/30 rounded-[32px] p-8 sm:p-10 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 bg-[#10B981] text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl">
                Smart Choice
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-[#10B981] block mb-3">With SolarHub</span>
              <h3 className="text-2xl font-black mb-6 text-white font-heading">SolarHub Smart Rooftop System</h3>
              <ul className="space-y-4 text-sm text-white/90">
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-[#10B981] shrink-0 mt-0.5" />
                  <span>Up to ₹78,000 direct bank subsidy (DBT) deposited under PM Surya Ghar.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-[#10B981] shrink-0 mt-0.5" />
                  <span>Generates free clean electricity with 25-year linear performance warranty.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-[#10B981] shrink-0 mt-0.5" />
                  <span>Net metering export credits surplus daytime energy back to DISCOM grid.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-[#10B981] shrink-0 mt-0.5" />
                  <span>Full payback achieved in 2-3 years; massive lifetime household savings.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Case Studies / Proof */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-heading mb-4">Real Customers, Real Savings</h2>
            <p className="text-white/50 text-base sm:text-lg">See how homes across Uttar Pradesh and Delhi NCR eliminated their monthly bills.</p>
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
                quote: 'The hybrid kit with lithium battery means zero power cuts during summer heatwaves and zero electricity bills. Flawless installation!'
              },
              {
                name: 'Anil Gupta',
                loc: 'Noida, Sector 62',
                system: '10 kW Commercial Rooftop',
                billBefore: '₹14,800/mo',
                billAfter: '₹1,200/mo',
                quote: 'Net metering application was approved in record time. System ROI is on track for under 2.3 years. Highly recommended platform!'
              }
            ].map((story, i) => (
              <div key={i} className="glass-card-interactive p-8 rounded-[28px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-[#FFD700] mb-4">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed mb-6 italic">"{story.quote}"</p>
                </div>
                <div className="pt-6 border-t border-white/[0.08]">
                  <p className="font-black text-white font-heading">{story.name}</p>
                  <p className="text-xs text-[#FFD700] font-bold mt-0.5">{story.loc} • {story.system}</p>
                  <div className="mt-4 flex justify-between items-center text-xs bg-white/[0.03] border border-white/[0.06] p-3 rounded-xl">
                    <span className="text-white/40">Before: <span className="line-through">{story.billBefore}</span></span>
                    <span className="text-[#10B981] font-black">Now: {story.billAfter}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="py-24 px-6 border-t border-white/[0.06] bg-[#040605]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-heading mb-4">Frequently Asked Questions</h2>
            <p className="text-white/50 text-base sm:text-lg">Everything you need to know about rooftop solar installation and government subsidies.</p>
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
                className="glass-panel border border-white/[0.08] rounded-2xl overflow-hidden cursor-pointer transition-colors hover:border-white/[0.16]"
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
              >
                <div className="p-6 flex justify-between items-center gap-4">
                  <span className="font-black text-base sm:text-lg text-white font-heading">{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={20} className="text-[#FFD700] shrink-0" /> : <ChevronDown size={20} className="text-white/40 shrink-0" />}
                </div>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-sm text-white/70 leading-relaxed border-t border-white/[0.05] pt-4 font-normal">
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
        <div className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel bg-[#0a120c] border border-[#FFD700]/30 rounded-[32px] p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95">
            <button 
              onClick={() => setIsSurveyModalOpen(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-white text-xl font-bold w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
            >
              ✕
            </button>
            
            {surveySubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[#10B981]/20 text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={36} />
                </div>
                <h3 className="text-2xl font-black text-white font-heading mb-2">Request Received!</h3>
                <p className="text-white/60 text-sm">
                  Our certified solar technician will contact you within 24 hours to schedule your free rooftop survey and PM Surya Ghar subsidy filing.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#FFD700] mb-2">
                    Free Consultation
                  </div>
                  <h3 className="text-2xl font-black text-white font-heading">Book Free Roof Survey</h3>
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
                      className="w-full bg-white/[0.05] border border-white/[0.12] p-3.5 rounded-xl font-bold text-white text-sm focus:border-[#FFD700] outline-none transition-all"
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
                      className="w-full bg-white/[0.05] border border-white/[0.12] p-3.5 rounded-xl font-bold text-white text-sm focus:border-[#FFD700] outline-none transition-all"
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
                        className="w-full bg-white/[0.05] border border-white/[0.12] p-3.5 rounded-xl font-bold text-white text-sm focus:border-[#FFD700] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Approx Roof</label>
                      <select 
                        value={surveyForm.roofArea}
                        onChange={(e) => setSurveyForm({...surveyForm, roofArea: e.target.value})}
                        className="w-full bg-[#0a120c] border border-white/[0.12] p-3.5 rounded-xl font-bold text-white text-sm focus:border-[#FFD700] outline-none transition-all"
                      >
                        <option value="200-400 sq ft">200-400 sq ft</option>
                        <option value="400-600 sq ft">400-600 sq ft</option>
                        <option value="600-1000 sq ft">600-1000 sq ft</option>
                        <option value="1000+ sq ft">1000+ sq ft</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full btn-gold py-4 rounded-xl text-sm uppercase tracking-widest font-black shadow-lg shadow-yellow-500/20 transition-all mt-4"
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
    <div className="glass-panel rounded-[32px] overflow-hidden flex flex-col h-full group hover:border-[#FFD700]/50 transition-all duration-500 shadow-xl border border-white/[0.08]">
      {/* Product Image & Badges */}
      <div className="h-64 overflow-hidden relative bg-black/40">
        <img 
          src={product.image_url} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        />
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-[#FFD700] text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-white/10">
          {product.vendor || 'Tier-1 Certified'}
        </div>
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-[#FFD700] text-xs font-black px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
          <Star size={13} fill="currentColor" />
          <span>{product.rating || '4.8'}</span>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge-solar">Tier-1 Mono PERC</span>
          {isKit && <span className="badge-emerald">Govt. Subsidy</span>}
        </div>

        <h3 className="text-xl sm:text-2xl font-black mb-2 leading-snug text-white font-heading group-hover:text-[#FFD700] transition-colors">
          {product.title}
        </h3>
        <p className="text-sm text-white/50 mb-6 leading-relaxed line-clamp-2 font-normal">{product.description}</p>
        
        {isKit && (
          <div className="bg-[#10B981]/10 border border-[#10B981]/25 rounded-xl p-3 mb-6 text-xs text-[#10B981] font-bold flex items-center justify-between">
            <span>PM Surya Ghar Subsidy:</span>
            <span className="font-black text-sm">-₹78,000</span>
          </div>
        )}

        <div className="mt-auto pt-6 border-t border-white/[0.08] flex justify-between items-center">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-0.5">
              {isKit ? 'Net Outlay (After Subsidy)' : 'Price'}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white font-heading">₹{(isKit ? netPrice : product.price).toLocaleString()}</span>
            {isKit && (
              <span className="text-xs text-white/30 line-through block mt-0.5">MRP: ₹{product.price.toLocaleString()}</span>
            )}
          </div>
          
          <button 
            onClick={() => onAdd(product)}
            className="w-14 h-14 bg-[#FFD700] hover:bg-[#FFE033] text-black rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-yellow-500/20"
            title="Add to Cart"
          >
            <ShoppingCart size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
