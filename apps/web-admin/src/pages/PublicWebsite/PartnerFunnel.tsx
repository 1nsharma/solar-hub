import React from 'react';
import { 
  Users, 
  Wrench, 
  Store, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  Handshake,
  LayoutDashboard,
  CheckCircle2,
  Briefcase,
  Sparkles,
  Award,
  Zap,
  BarChart3
} from 'lucide-react';

export default function PartnerFunnel({ onVendorOnboarding }) {
  return (
    <div className="bg-[#060907] text-white relative selection:bg-[#FFD700] selection:text-black">
      {/* Background Ambient Glows */}
      <div className="ambient-glow-solar top-10 -right-60" />
      <div className="ambient-glow-emerald top-[500px] -left-60" />

      {/* Hero */}
      <section className="relative pt-24 pb-28 px-6 overflow-hidden bg-grid-pattern">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#FFD700] shadow-[0_0_25px_rgba(255,215,0,0.15)]">
              <Handshake size={14} />
              <span>Partner Ecosystem & Gig Fulfillment</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-[0.98] tracking-tight font-heading">
              Scale Your Clean Energy <br/>
              <span className="text-gradient-gold">Business With SolarHub.</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/60 max-w-2xl mb-12 leading-relaxed font-normal">
              Whether you manufacture Tier-1 solar hardware, provide certified installation and maintenance services, or originate consumer rooftop leads, SolarHub provides the verified marketplace infrastructure to accelerate your growth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onVendorOnboarding}
                className="btn-gold text-sm uppercase tracking-widest py-4 sm:py-5 px-8 sm:px-10 rounded-2xl shadow-glow-gold flex items-center justify-center gap-3"
              >
                Become a Vendor Partner <Store size={19} />
              </button>
              <button 
                onClick={onVendorOnboarding}
                className="btn-ghost-glass text-sm uppercase tracking-widest py-4 sm:py-5 px-8 sm:px-10 rounded-2xl flex items-center justify-center gap-3"
              >
                Join Technician Roster <Wrench size={18} className="text-[#10B981]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Core Pillars */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#10B981] mb-4">
              <Sparkles size={14} /> Stakeholder Collaboration
            </div>
            <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight font-heading">Empowering Every Solar Stakeholder</h2>
            <p className="text-white/50 text-base sm:text-lg">
              Our unified ecosystem brings together verified product supplies, rapid gig technician dispatch, and transparent commission accounting.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PartnerCard 
              icon={<Store size={36} />} 
              title="Hardware Vendors" 
              desc="Supply the certified panels, inverters, and BOS hardware that power Indian homes. Direct logistics and bulk settlements."
              benefits={['5% Competitive Commission', 'Bulk Demand Aggregation', 'Direct Logistics Support']}
              isMain
              onAction={onVendorOnboarding}
              actionText="Vendor Registration"
            />
            <PartnerCard 
              icon={<Wrench size={32} />} 
              title="Certified Technicians" 
              desc="Execute verified rooftop installations and AMC servicing jobs with app-based task dispatch and digital work proof."
              benefits={['Continuous Job Allocation', 'Mobile Task Checklists', 'Instant Escrow Payouts']}
              onAction={onVendorOnboarding}
              actionText="Technician Sign Up"
            />
            <PartnerCard 
              icon={<Briefcase size={32} />} 
              title="Sales & CA Partners" 
              desc="The bridge connecting residential communities and business parks with SolarHub solar solutions."
              benefits={['High Lead Commission', 'Live Conversion Tracking', 'Full Marketing Toolkits']}
              onAction={onVendorOnboarding}
              actionText="Partner Portal"
            />
          </div>
        </div>
      </section>

      {/* Technician Academy & Quality Standards */}
      <section className="py-24 px-6 bg-[#040605] border-t border-white/[0.06] relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#10B981] mb-6">
                <CheckCircle2 size={14} /> Skill & Certification
              </div>
              <h2 className="text-3xl sm:text-5xl font-black mb-6 tracking-tight font-heading">
                Quality Verification in Every Connection.
              </h2>
              <p className="text-base sm:text-lg text-white/60 mb-8 leading-relaxed font-normal">
                We don't just assign jobs; we maintain stringent quality benchmarks. All technicians are validated for MNRE safety standards, earthing compliance, and digital net-metering readiness.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-5 rounded-2xl border border-white/[0.08]">
                   <p className="text-2xl font-black text-[#FFD700] font-heading mb-1">100%</p>
                   <p className="text-[11px] text-white/50 uppercase tracking-wider font-bold">Safety Audit Verified</p>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-white/[0.08]">
                   <p className="text-2xl font-black text-[#10B981] font-heading mb-1">48 Hours</p>
                   <p className="text-[11px] text-white/50 uppercase tracking-wider font-bold">Job Fulfillment SLA</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="glass-panel p-8 rounded-[36px] border border-white/[0.1] shadow-2xl relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFD700]/20 flex items-center justify-center text-[#FFD700]">
                      <BarChart3 size={20} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-white/40 font-bold">Partner Live Metric</p>
                      <p className="text-lg font-black text-white font-heading">Fulfillment Health</p>
                    </div>
                  </div>
                  <span className="badge-emerald">Optimal</span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex justify-between items-center">
                    <span className="text-sm font-semibold text-white/80">Average Installation Rating</span>
                    <span className="text-sm font-black text-[#FFD700]">4.92 / 5.0</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex justify-between items-center">
                    <span className="text-sm font-semibold text-white/80">Net Metering Energization Rate</span>
                    <span className="text-sm font-black text-[#10B981]">98.4%</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex justify-between items-center">
                    <span className="text-sm font-semibold text-white/80">Technician Payout Turnaround</span>
                    <span className="text-sm font-black text-white">&lt; 24 Hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="glass-panel bg-gradient-to-br from-[#0e1611] to-[#080d0a] border border-[#FFD700]/30 rounded-[40px] p-12 sm:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/10 blur-[90px] rounded-full pointer-events-none" />
            
            <h2 className="text-3xl sm:text-5xl font-black mb-6 tracking-tight font-heading">
              Ready to Accelerate Your Solar Business?
            </h2>
            <p className="text-base sm:text-lg text-white/60 max-w-xl mx-auto mb-10 font-normal">
              Join hundreds of solar distributors, vendors, and certified technicians powering the clean energy transition.
            </p>
            <button 
              onClick={onVendorOnboarding}
              className="btn-gold py-5 px-12 rounded-2xl text-xs uppercase tracking-widest font-black shadow-glow-gold inline-flex items-center gap-3 hover:scale-105 transition-transform"
            >
              Get Started with Partner Onboarding <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function PartnerCard({ icon, title, desc, benefits, isMain = false, onAction, actionText }) {
  return (
    <div className={`glass-panel p-8 sm:p-10 rounded-[32px] transition-all flex flex-col justify-between border ${
      isMain 
        ? 'border-[#FFD700]/40 shadow-[0_15px_40px_rgba(255,215,0,0.12)] bg-gradient-to-b from-[#FFD700]/[0.06] to-transparent relative' 
        : 'border-white/[0.08] hover:border-white/[0.18]'
    }`}>
      <div>
        <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#FFD700] mb-8">
          {icon}
        </div>
        
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-2xl font-black font-heading text-white">{title}</h3>
          {isMain && (
            <span className="badge-solar text-[9px] py-0.5 px-2">Primary</span>
          )}
        </div>
        
        <p className="text-white/50 text-sm mb-8 leading-relaxed font-normal">{desc}</p>
        
        <ul className="space-y-3.5 mb-8">
          {benefits.map(benefit => (
            <li key={benefit} className="flex items-center gap-3 text-xs font-bold text-white/80">
              <CheckCircle2 size={16} className="text-[#10B981] shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <button 
        onClick={onAction}
        className={`w-full py-3.5 rounded-xl text-xs uppercase tracking-widest font-black transition-all ${
          isMain 
            ? 'btn-gold shadow-md' 
            : 'bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/[0.08]'
        }`}
      >
        {actionText} →
      </button>
    </div>
  );
}
