import React from 'react';
import { ShoppingBag, Wrench, ChevronRight, ShieldCheck, Zap, TrendingUp, Users, Handshake } from 'lucide-react';

const PartnerSection = ({ onVendorJoin, onTechnicianJoin }) => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -z-10"></div>

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 mb-4">
            <Handshake size={16} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Join the Ecosystem</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6">
            Partner with <span className="gradient-text">SolarHub</span>
          </h2>
          <p className="text-text-dim max-w-2xl mx-auto text-lg">
            We've built dedicated paths for product manufacturers and service experts. Choose your track and grow with India's largest solar network.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 perspective-1000">
          {/* Vendor Track */}
          <div className="glass-premium p-10 rounded-[2.5rem] border-primary/20 hover:border-primary/50 transition-all duration-500 group card-3d">
            <div className="flex justify-between items-start mb-8">
              <div className="bg-primary/20 p-5 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                <ShoppingBag size={40} className="text-primary" />
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 block mb-1">Track 01</span>
                <span className="text-2xl font-bold">Product Vendor</span>
              </div>
            </div>

            <h3 className="text-3xl font-bold mb-4">Sell Solar Products</h3>
            <p className="text-text-dim mb-8 leading-relaxed">
              List your panels, inverters, and kits on our marketplace. Access verified buyers, manage orders, and scale your manufacturing business.
            </p>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <ShieldCheck size={14} className="text-primary" />
                </div>
                <span className="text-sm font-medium">Verified Vendor Badge</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp size={14} className="text-primary" />
                </div>
                <span className="text-sm font-medium">National Market Reach</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users size={14} className="text-primary" />
                </div>
                <span className="text-sm font-medium">Lead Management Dashboard</span>
              </li>
            </ul>

            <button 
              onClick={onVendorJoin}
              className="w-full py-5 bg-primary text-black rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:shadow-[0_20px_40px_rgba(255,215,0,0.2)] transition-all"
            >
              Start Selling <ChevronRight size={20} />
            </button>
          </div>

          {/* Maintenance/Technician Track */}
          <div className="glass-premium p-10 rounded-[2.5rem] border-secondary/20 hover:border-secondary/50 transition-all duration-500 group card-3d">
            <div className="flex justify-between items-start mb-8">
              <div className="bg-secondary/20 p-5 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                <Wrench size={40} className="text-secondary" />
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/60 block mb-1">Track 02</span>
                <span className="text-2xl font-bold">Service Partner</span>
              </div>
            </div>

            <h3 className="text-3xl font-bold mb-4">Maintenance & Install</h3>
            <p className="text-text-dim mb-8 leading-relaxed">
              Join our network of certified technicians. Get regular maintenance gigs, installation contracts, and recurring AMC revenue.
            </p>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Zap size={14} className="text-secondary" />
                </div>
                <span className="text-sm font-medium">On-Demand Service Jobs</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center">
                  <ShieldCheck size={14} className="text-secondary" />
                </div>
                <span className="text-sm font-medium">Certification Program</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center">
                  <TrendingUp size={14} className="text-secondary" />
                </div>
                <span className="text-sm font-medium">Stable AMC Earnings</span>
              </li>
            </ul>

            <button 
              onClick={onTechnicianJoin}
              className="w-full py-5 bg-secondary text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:shadow-[0_20px_40px_rgba(76,175,80,0.2)] transition-all"
            >
              Join Network <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
