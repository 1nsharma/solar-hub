import React from 'react';
import { Users, Briefcase, TrendingUp, CheckCircle2, Zap, BarChart3 } from 'lucide-react';

const AudiencePitch = () => {
  const audiences = [
    {
      title: "Customers",
      subtitle: "Homeowners & MSMEs",
      hook: "Convenience & Savings",
      message: "One app for buy + install + service",
      features: [
        "Solar purchase & installation",
        "Flexible EMI options",
        "On-demand AMC & cleaning",
        "Real-time savings tracking"
      ],
      icon: <Users className="text-primary" size={32} />,
      gradient: "from-yellow-500/20 to-orange-500/5"
    },
    {
      title: "Solopreneurs",
      subtitle: "Local Dealers & Partners",
      hook: "Business OS",
      message: "Start selling and servicing with low setup",
      features: [
        "Consistent lead flow",
        "Vendor onboarding support",
        "Local service income",
        "Zero inventory model"
      ],
      icon: <Briefcase className="text-primary" size={32} />,
      gradient: "from-blue-500/20 to-cyan-500/5"
    },
    {
      title: "Investors",
      subtitle: "Angels & VCs",
      hook: "Scalable Growth",
      message: "Asset-light solar commerce + services",
      features: [
        "Recurring service revenue",
        "Scalable marketplace model",
        "Renewable energy expansion",
        "Data-driven operations"
      ],
      icon: <TrendingUp className="text-primary" size={32} />,
      gradient: "from-green-500/20 to-emerald-500/5"
    }
  ];

  return (
    <section id="audience" className="py-24 relative overflow-hidden bg-black">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full"></div>
      
      <div className="container relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl md:text-6xl mb-6 font-extrabold tracking-tight">
            Target <span className="gradient-text">Audience</span> & Positioning
          </h2>
          <p className="text-text-dim max-w-3xl mx-auto text-lg md:text-xl">
            SolarHub is built to empower every stakeholder in the solar ecosystem, from homeowners to large-scale investors.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {audiences.map((item, index) => (
            <div 
              key={index}
              className={`glass-card group relative p-10 border border-white/5 hover:border-primary/40 transition-all duration-500 overflow-hidden`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Shimmer Overlay on Hover */}
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

              {/* Card Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                <div className="mb-8 inline-flex p-4 bg-white/5 rounded-2xl group-hover:bg-primary/10 transition-all duration-500 animate-float">
                  {item.icon}
                </div>
                
                <h3 className="text-3xl font-bold mb-1">{item.title}</h3>
                <p className="text-primary font-semibold mb-4 text-sm tracking-widest uppercase">{item.subtitle}</p>
                
                <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/5 group-hover:border-primary/20 transition-all">
                  <p className="text-xs text-text-dim uppercase font-bold mb-1">The Hook</p>
                  <p className="text-xl font-bold text-white">{item.hook}</p>
                </div>

                <p className="text-white/80 mb-8 font-medium italic">
                  "{item.message}"
                </p>

                <div className="space-y-4">
                  {item.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-primary shrink-0" />
                      <span className="text-text-dim group-hover:text-white transition-colors">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-text-dim">
                    <span>Market Potential</span>
                    <span className="text-primary">High Growth</span>
                  </div>
                  <div className="mt-2 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[85%] group-hover:w-full transition-all duration-1000"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pitch Summary / Investor Angle */}
        <div className="mt-20 glass p-8 md:p-12 rounded-3xl border border-white/10 bg-white/[0.02] animate-fade-in">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h4 className="text-3xl mb-6 font-bold flex items-center gap-3">
                <Zap className="text-primary" /> Investor Perspective
              </h4>
              <p className="text-text-dim mb-6 leading-relaxed">
                Backing the renewable energy revolution in India. SolarHub offers an <strong>asset-light model</strong> with <strong>recurring service revenue</strong> and <strong>marketplace scale</strong> across solar products and maintenance.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-2xl font-bold text-primary">85%</p>
                  <p className="text-xs text-text-dim uppercase">Asset Light</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-2xl font-bold text-secondary">10x</p>
                  <p className="text-xs text-text-dim uppercase">Scale Potential</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="bg-primary/20 p-2 rounded-lg mt-1">
                  <BarChart3 className="text-primary" size={20} />
                </div>
                <div>
                  <h5 className="font-bold mb-1">Marketplace Scale</h5>
                  <p className="text-sm text-text-dim">Connecting millions of households with thousands of verified local vendors and technicians.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-primary/20 p-2 rounded-lg mt-1">
                  <TrendingUp className="text-primary" size={20} />
                </div>
                <div>
                  <h5 className="font-bold mb-1">Recurring Revenue</h5>
                  <p className="text-sm text-text-dim">Subscription-based cleaning and maintenance services create stable, predictable cash flows.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AudiencePitch;
