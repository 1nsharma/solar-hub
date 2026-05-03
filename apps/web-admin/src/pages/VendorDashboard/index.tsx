import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Package, 
  DollarSign, 
  TrendingUp, 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Search,
  CheckCircle2,
  Clock,
  MoreVertical,
  ShieldCheck,
  Truck,
  Zap,
  Play
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Card, Button, StatusBadge, Input } from '@solar-hub/ui';
// @ts-ignore - The module is in plain JS
import { generateSprintNudge, defaultUserPsyche } from '@solar-hub/shared';

export default function VendorDashboard({ onBack }: { onBack: () => void }) {
  const { products } = useStore();
  const [activeTab, setActiveTab] = useState('orders'); // Default to orders to show the nudge relevance
  const [nudge, setNudge] = useState<any>(null);
  const [isSprintActive, setIsSprintActive] = useState(false);

  const vendorProducts = products.filter(p => p.vendor === 'Tata Solar' || p.vendor === 'SolarTech India' || p.vendor === 'Tata Power');
  
  // Pending orders logic
  const pendingOrders = [
    { id: 'ORD-9921', item: 'On-Grid Solar Kit 5kW', customer: 'Amit S.', date: 'Today', status: 'Pending', logistics: 'Shiprocket #SR-1022' },
    { id: 'ORD-9922', item: 'Luminous Solar Inverter', customer: 'Priya R.', date: 'Today', status: 'Pending', logistics: 'Awaiting Dispatch' },
    { id: 'ORD-9923', item: 'Mono Perc Panel 540W', customer: 'Rahul K.', date: 'Yesterday', status: 'Pending', logistics: 'Awaiting Dispatch' }
  ];

  // Initialize Nudge Engine
  useEffect(() => {
    // We simulate an 'Overwhelmed' user profile to demonstrate the cognitive load reduction
    const profile = {
      ...defaultUserPsyche,
      status: 'Overwhelmed',
      tendencies: ['GAMIFICATION_DRIVEN']
    };
    const nextNudge = generateSprintNudge(pendingOrders, profile);
    setNudge(nextNudge);
  }, []);

  const stats = [
    { title: 'Total Sales', value: '₹4.5L', trend: '+18%', icon: <DollarSign className="text-[#FFD700]" /> },
    { title: 'Orders', value: '12', trend: '+3', icon: <Package className="text-[#FFD700]" /> },
    { title: 'Growth', value: '24%', trend: '+4%', icon: <TrendingUp className="text-blue-400" /> }
  ];

  const handleStartSprint = () => {
    setIsSprintActive(true);
    setActiveTab('orders');
    // Add satisfying haptic feedback pattern using browser API if available
    if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 text-white px-6">
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <button onClick={onBack} className="text-primary mb-4 flex items-center gap-2 hover:gap-3 transition-all font-bold text-sm uppercase tracking-widest text-[#FFD700]">
              <ArrowLeft size={18} /> Exit Vendor View
            </button>
            <h1 className="text-5xl font-black tracking-tighter text-white">Vendor <span className="text-primary italic">Dashboard</span></h1>
            <p className="text-white/40 text-lg mt-2 font-medium">Manage your inventory, orders, and business performance.</p>
          </div>
          
          <div className="flex gap-4">
            <Button variant="secondary" className="px-8 py-4 flex items-center gap-2">
              <Plus size={20} /> Bulk Upload (CSV)
            </Button>
            <Button variant="primary" className="px-8 py-4 flex items-center gap-2 shadow-[0_0_30px_rgba(255,215,0,0.2)]">
              <Plus size={20} /> Add New Product
            </Button>
          </div>
        </div>

        {/* 🧠 Behavioral Nudge Engine Widget */}
        {nudge && !isSprintActive && (
          <div className="mb-8 animate-in slide-in-from-top-8 fade-in duration-1000">
            <Card className="relative overflow-hidden p-6 border-primary/40 bg-gradient-to-r from-primary/10 via-[#050505] to-transparent shadow-[0_0_40px_rgba(255,215,0,0.1)] group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/50 flex items-center justify-center animate-pulse">
                    <Zap className="text-primary" size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      Momentum Coach <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] uppercase tracking-widest">Active</span>
                    </h3>
                    <p className="text-white/70 text-sm font-medium mt-1 max-w-xl leading-relaxed">
                      {nudge.message}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleStartSprint}
                  className="shrink-0 px-8 py-4 rounded-xl bg-primary text-black font-black uppercase tracking-widest text-sm flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,215,0,0.4)]"
                >
                  {nudge.actionButton || "Start Sprint"} <Play fill="currentColor" size={16} />
                </button>
              </div>
            </Card>
          </div>
        )}

        {isSprintActive && (
           <div className="mb-8 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl flex justify-between items-center animate-in fade-in zoom-in duration-500">
             <div className="flex items-center gap-3">
               <div className="w-3 h-3 rounded-full bg-green-400 animate-ping"></div>
               <p className="text-green-400 font-black uppercase tracking-widest text-sm">Sprint Active: 5:00 Remaining</p>
             </div>
             <p className="text-white/60 text-xs font-medium">Knock out this order to earn your daily badge!</p>
             <button onClick={() => setIsSprintActive(false)} className="text-white/40 hover:text-white text-xs uppercase tracking-widest">End Sprint</button>
           </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Stats Summary */}
          <div className="lg:col-span-1 space-y-6">
            {stats.map((stat, idx) => (
              <Card key={idx} className="p-6 bg-white/[0.03] border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/5 rounded-xl">{stat.icon}</div>
                  <StatusBadge status={stat.trend} />
                </div>
                <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">{stat.title}</p>
                <p className="text-3xl font-black mt-1 text-white">{stat.value}</p>
              </Card>
            ))}

            <Card className="p-6 border-primary/20 bg-primary/5">
              <h4 className="font-black mb-2 flex items-center gap-2 text-xs text-primary uppercase tracking-widest">
                <ShieldCheck size={16} /> Vendor Health
              </h4>
              <p className="text-xs text-white/40 mb-4 font-medium">Your performance is excellent. 98% on-time fulfillment.</p>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[92%] shadow-[0_0_10px_rgba(255,215,0,0.5)]"></div>
              </div>
            </Card>
          </div>

          {/* Main Management Area */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex gap-2 bg-white/5 p-1.5 rounded-[20px] border border-white/10 w-fit">
              {['products', 'orders', 'quotes', 'payouts'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-xl font-black transition-all capitalize text-xs tracking-widest ${
                    activeTab === tab ? 'bg-primary text-black shadow-lg' : 'text-white/30 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'quotes' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
                <Card className="bg-primary/5 p-6 border-primary/20">
                  <p className="text-xs text-primary font-black uppercase tracking-widest mb-2 flex items-center gap-2"><ShieldCheck size={14} /> SolarHub Qualified Leads</p>
                  <p className="text-sm text-white/50 leading-relaxed font-medium">Submit quotes directly through the platform. Customers are protected by Escrow, ensuring you get paid securely upon milestone completion.</p>
                </Card>
                {[
                  { id: 'LD-4091', system: '5kW Residential', customer_pin: '208001', match_score: '92%', status: 'New Request' },
                  { id: 'LD-4092', system: '3kW Hybrid', customer_pin: '201301', match_score: '85%', status: 'Quote Sent' }
                ].map(lead => (
                  <Card key={lead.id} className="p-6 flex flex-col gap-6 bg-white/[0.03] border-white/5">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-6 items-center">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20">
                          <CheckCircle2 className="text-green-400" size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Lead {lead.id} • Match: <span className="text-green-400">{lead.match_score}</span></p>
                          <h4 className="font-black text-lg text-white">{lead.system} System</h4>
                          <p className="text-sm text-white/40 font-medium">Pincode: {lead.customer_pin}</p>
                        </div>
                      </div>
                      <StatusBadge status={lead.status === 'Quote Sent' ? 'ACTIVE' : 'PENDING'} />
                    </div>
                    
                    <div className="pt-6 border-t border-white/5 flex gap-4 items-end">
                      {lead.status === 'New Request' ? (
                         <>
                           <div className="w-40">
                             <Input label="YOUR QUOTE (₹)" type="number" placeholder="Enter amount" />
                           </div>
                           <Button variant="primary" className="py-2.5 px-6 text-[10px]" onClick={() => alert('Quote submitted via /api/quotes API')}>
                             Submit Quote Securely
                           </Button>
                         </>
                      ) : (
                         <p className="text-sm text-white/30 italic font-medium">Awaiting customer approval through SolarHub Escrow. (Workflow Engine)</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'products' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="w-80">
                    <Input placeholder="Search my products..." />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {vendorProducts.map(product => (
                    <Card key={product.id} className="p-6 flex gap-6 bg-white/[0.03] border-white/5 group">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-white/10 bg-white/5">
                        <img src={product.image_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-black text-lg mb-1 text-white group-hover:text-primary transition-colors">{product.title}</h4>
                            <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">SKU: SOL-{product.id}00</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 hover:bg-white/10 rounded-lg text-white/30 hover:text-white transition-colors">
                              <Edit3 size={16} />
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-lg text-red-400/30 hover:text-red-400 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-end mt-4">
                          <p className="text-xl font-black text-primary italic">₹{product.price.toLocaleString()}</p>
                          <StatusBadge status="ACTIVE" className="bg-green-500/10 text-green-400 border-green-500/20" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
                {(isSprintActive ? [pendingOrders[0]] : pendingOrders).map((order, index) => (
                  <Card key={order.id} className={`p-6 flex flex-col gap-6 bg-white/[0.03] border-white/5 transition-all duration-500 ${isSprintActive && index === 0 ? 'border-primary/50 shadow-[0_0_30px_rgba(255,215,0,0.15)] scale-[1.02]' : ''}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-6 items-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                          <Package className="text-primary" size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">{order.id}</p>
                          <h4 className="font-black text-white text-lg">{order.item}</h4>
                          <p className="text-sm text-white/40 font-medium">Customer: {order.customer} • {order.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <StatusBadge status={order.status === 'Shipped' ? 'ACTIVE' : 'PENDING'} />
                        <button className="p-2 hover:bg-white/10 rounded-lg">
                          <MoreVertical size={20} className="text-white/20" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-white/5 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3 text-white/40 font-medium">
                        <Truck size={14} className="text-primary" />
                        <span>Tracking: <span className="text-white font-black">{order.logistics}</span></span>
                      </div>
                      {isSprintActive && index === 0 ? (
                        <Button variant="primary" className="py-2.5 px-8 text-xs flex items-center gap-2 font-black shadow-[0_0_20px_rgba(255,215,0,0.4)]">
                          Approve Dispatch <CheckCircle2 size={16} />
                        </Button>
                      ) : (
                        <button className="text-primary font-black hover:underline uppercase tracking-widest text-[10px]">Download Invoice</button>
                      )}
                    </div>
                  </Card>
                ))}
                {!isSprintActive && (
                  <Card className="p-6 flex flex-col gap-6 bg-white/[0.03] border-white/5 opacity-50">
                    <div className="flex justify-between items-center">
                       <div className="flex gap-6 items-center">
                         <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                           <CheckCircle2 className="text-green-500" size={24} />
                         </div>
                         <div>
                           <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">ORD-8812</p>
                           <h4 className="font-black text-white/50 text-lg line-through">Off-Grid Inverter 3kVA</h4>
                           <p className="text-sm text-white/40 font-medium">Completed Yesterday</p>
                         </div>
                       </div>
                       <StatusBadge status="ACTIVE" className="bg-green-500/10 text-green-500 border-green-500/20" />
                    </div>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'payouts' && (
              <Card className="text-center py-20 bg-white/[0.02] border-white/5">
                <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <Clock size={40} className="text-white/10" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">Settlement Logic Processing</h3>
                <p className="text-white/40 text-sm max-w-xs mx-auto mt-2 font-medium">Next payout of <span className="text-primary font-black">₹1,42,500</span> is scheduled for Monday, 4th May via Razorpay Settlements.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
