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
  Briefcase
} from 'lucide-react';

export default function PartnerFunnel({ onVendorOnboarding }) {
  return (
    <div className="bg-[#050505] text-white">
      {/* Hero */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary shadow-sm">
              <Handshake size={14} />
              Join India's Fastest Growing Solar Network
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
              Scale your solar <br/>
              <span className="text-primary italic">business with us.</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mb-12 leading-relaxed">
              Whether you are a product vendor, a certified technician, or a local sales partner, SolarHub provides the tools and leads to grow your revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={onVendorOnboarding}
                className="bg-primary text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-transform"
              >
                Become a Vendor <Store size={20} />
              </button>
              <button className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-colors">
                Join as Technician <Wrench size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Priority: Vendor is Main */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="container mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">The Foundation: Vendors First.</h2>
            <p className="text-xl text-white/40 max-w-3xl mx-auto leading-relaxed">
              Our ecosystem starts with high-quality solar products. Without reliable vendors, we cannot provide solutions to customers or jobs to technicians.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <PartnerCard 
              icon={<Store size={40} />} 
              title="Main Pillar: Vendors" 
              desc="Supply the products that power India. List your solar kits and manage your inventory. You are the source of every installation."
              benefits={['5% Low Commission', 'Bulk Order Support', 'Direct Logistics']}
              isMain
            />
            <PartnerCard 
              icon={<Wrench size={32} />} 
              title="Technicians" 
              desc="Execute the vision. Once a vendor's product is sold, you ensure it is installed to the highest standards."
              benefits={['Steady Job Flow', 'App-Based Tasking', 'Digital Proofs']}
            />
            <PartnerCard 
              icon={<Briefcase size={32} />} 
              title="Sales Partners" 
              desc="The bridge between customers and vendors. Bring in leads and track their conversion through the lifecycle."
              benefits={['High Incentives', 'Live Lead Tracking', 'Marketing Kit']}
            />
          </div>
        </div>
      </section>

      {/* Technician Training & Certification */}
      <section className="py-32 px-6 bg-[#102018] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full" />
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">
                <CheckCircle2 size={14} /> Training Academy
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Skill is the soul <br/>of installation.</h2>
              <p className="text-xl text-white/60 mb-10 leading-relaxed">
                We don't just assign jobs; we build experts. Our training program ensures technicians are certified in the latest solar technologies and safety protocols.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                   <p className="text-2xl font-black text-primary mb-2">Certification</p>
                   <p className="text-xs text-white/40 uppercase tracking-widest font-black">Govt. Recognized</p>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                   <p className="text-2xl font-black text-primary mb-2">Workshops</p>
                   <p className="text-xs text-white/40 uppercase tracking-widest font-black">Live Practical Training</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative aspect-video rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1581092921461-7d1568637364?auto=format&fit=crop&q=80&w=1200" 
                  alt="Solar Technician Training" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-10">
                   <div>
                      <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2">Active Training</p>
                      <p className="text-2xl font-black">Proper PV Panel Wiring & Safety</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 px-6 bg-[#080808]">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">The platform built <br/>for fulfillment.</h2>
              <div className="space-y-8">
                <FeatureItem 
                  title="Mobile-First Operations" 
                  desc="Technicians use the SolarHub app to complete checklists, upload photos, and get instant job approvals."
                />
                <FeatureItem 
                  title="Vendor Storefronts" 
                  desc="Manage inventory, track orders, and view revenue analytics from a dedicated partner dashboard."
                />
                <FeatureItem 
                  title="Automated Logistics" 
                  desc="We coordinate with delivery partners to ensure your products reach the customer on time, every time."
                />
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-primary/20 rounded-[48px] border border-primary/20 flex items-center justify-center overflow-hidden">
                <LayoutDashboard size={200} className="text-primary opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="bg-[#102018] border border-primary/30 p-8 rounded-3xl shadow-2xl rotate-3 scale-110">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-black">
                           <TrendingUp size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Monthly Revenue</p>
                          <p className="text-3xl font-black">₹4.2L</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-2 w-48 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full w-2/3 bg-primary" />
                        </div>
                        <div className="h-2 w-48 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full w-1/2 bg-primary" />
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto bg-primary rounded-[48px] p-16 text-black">
            <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">Ready to power the future?</h2>
            <p className="text-lg font-bold mb-12 opacity-70">
              Join 50+ vendors and 200+ technicians already on the SolarHub platform.
            </p>
            <button className="bg-black text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 mx-auto hover:scale-105 transition-transform shadow-2xl">
              Get Started Now <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function PartnerCard({ icon, title, desc, benefits, isMain = false }) {
  return (
    <div className={`p-10 rounded-[32px] transition-all border ${isMain ? 'bg-primary/10 border-primary shadow-[0_0_50px_rgba(255,215,0,0.1)] scale-105 z-10' : 'bg-white/5 border-white/10 hover:border-primary/30'}`}>
      <div className="text-primary mb-8">{icon}</div>
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-2xl font-black">{title}</h3>
        {isMain && (
          <span className="bg-primary text-black text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md">Critical Pillar</span>
        )}
      </div>
      <p className="text-white/40 mb-8 leading-relaxed">{desc}</p>
      <ul className="space-y-4">
        {benefits.map(benefit => (
          <li key={benefit} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest">
            <CheckCircle2 size={16} className="text-primary" />
            {benefit}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeatureItem({ title, desc }) {
  return (
    <div className="flex gap-6">
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-primary">
        <CheckCircle2 size={24} />
      </div>
      <div>
        <h3 className="text-xl font-black mb-2">{title}</h3>
        <p className="text-white/40 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
