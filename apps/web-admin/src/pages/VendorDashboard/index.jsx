import React, { useState } from 'react';
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
  Truck
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function VendorDashboard({ onBack }) {
  const { products } = useStore();
  const [activeTab, setActiveTab] = useState('products');

  const vendorProducts = products.filter(p => p.vendor === 'Tata Solar' || p.vendor === 'SolarTech India');

  const stats = [
    { title: 'Total Sales', value: '₹4.5L', trend: '+18%', icon: <DollarSign className="text-secondary" /> },
    { title: 'Orders', value: '12', trend: '+3', icon: <Package className="text-primary" /> },
    { title: 'Growth', value: '24%', trend: '+4%', icon: <TrendingUp className="text-blue-400" /> }
  ];

  return (
    <div className="min-h-screen bg-bg-dark pt-32 pb-20">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <button onClick={onBack} className="text-primary mb-4 flex items-center gap-2 hover:gap-3 transition-all font-bold">
              <ArrowLeft size={18} /> Exit Vendor View
            </button>
            <h1 className="text-5xl font-bold tracking-tighter">Vendor <span className="text-primary">Dashboard</span></h1>
            <p className="text-text-dim text-lg mt-2">Manage your inventory, orders, and business performance.</p>
          </div>
          
          <div className="flex gap-4">
            <button className="bg-white/5 hover:bg-white/10 text-white py-4 px-8 rounded-2xl font-bold border border-white/10 transition-all flex items-center gap-2">
              <Plus size={20} /> Bulk Upload (CSV)
            </button>
            <button className="btn-primary py-4 px-8 flex items-center gap-2">
              <Plus size={20} /> Add New Product
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Stats Summary */}
          <div className="lg:col-span-1 space-y-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="glass-card p-6 bg-white/[0.03] border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/5 rounded-xl">{stat.icon}</div>
                  <span className="text-xs font-bold text-secondary">{stat.trend}</span>
                </div>
                <p className="text-xs text-text-dim uppercase font-bold tracking-widest">{stat.title}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
            ))}

            <div className="glass-card p-6 border-primary/20 bg-primary/5">
              <h4 className="font-bold mb-2 flex items-center gap-2 text-sm text-primary">
                <ShieldCheck size={16} /> Vendor Health
              </h4>
              <p className="text-xs text-text-dim mb-4">Your performance is excellent. 98% on-time fulfillment.</p>
              <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[92%]"></div>
              </div>
            </div>
          </div>

          {/* Main Management Area */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex gap-4 bg-white/5 p-1.5 rounded-2xl border border-white/10 w-fit">
              {['products', 'orders', 'quotes', 'payouts'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-xl font-bold transition-all capitalize ${
                    activeTab === tab ? 'bg-primary text-black' : 'text-text-dim hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'quotes' && (
              <div className="animate-fade-in space-y-6">
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 mb-6">
                  <p className="text-xs text-primary font-bold uppercase tracking-widest mb-1 flex items-center gap-2"><ShieldCheck size={14} /> SolarHub Qualified Leads</p>
                  <p className="text-sm text-text-dim">Submit quotes directly through the platform. Customers are protected by Escrow, ensuring you get paid securely upon milestone completion.</p>
                </div>
                {[
                  { id: 'LD-4091', system: '5kW Residential', customer_pin: '208001', match_score: '92%', status: 'New Request' },
                  { id: 'LD-4092', system: '3kW Hybrid', customer_pin: '201301', match_score: '85%', status: 'Quote Sent' }
                ].map(lead => (
                  <div key={lead.id} className="glass-card p-6 flex flex-col gap-6 bg-white/[0.03] border-white/5">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-6 items-center">
                        <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                          <CheckCircle2 className="text-secondary" size={24} />
                        </div>
                        <div>
                          <p className="text-xs text-text-dim uppercase font-bold tracking-widest">Lead {lead.id} • Match: <span className="text-green-400">{lead.match_score}</span></p>
                          <h4 className="font-bold">{lead.system} System</h4>
                          <p className="text-sm text-text-dim">Pincode: {lead.customer_pin}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                          lead.status === 'Quote Sent' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
                        }`}>
                          {lead.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/5 flex gap-4">
                      {lead.status === 'New Request' ? (
                         <>
                           <input type="number" placeholder="Your Quote (₹)" className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm w-40 outline-none focus:border-primary" />
                           <button className="btn-primary py-2 px-6 text-xs font-bold" onClick={() => alert('Quote submitted via /api/quotes API')}>Submit Quote Securely</button>
                         </>
                      ) : (
                         <p className="text-sm text-text-dim italic">Awaiting customer approval through SolarHub Escrow. (Workflow Engine)</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'products' && (
              <div className="animate-fade-in space-y-6">
                <div className="flex justify-between items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search my products..."
                      className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {vendorProducts.map(product => (
                    <div key={product.id} className="glass-card p-6 flex gap-6 bg-white/[0.03] border-white/5 group">
                      <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                        <img src={product.image_url || product.image} alt={product.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-lg mb-1">{product.title}</h4>
                            <p className="text-xs text-text-dim mb-4">SKU: SOL-{product.id}00</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 hover:bg-white/10 rounded-lg text-text-dim hover:text-white transition-colors">
                              <Edit3 size={16} />
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-lg text-red-400/50 hover:text-red-400 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-end">
                          <p className="text-xl font-bold text-primary">₹{product.price.toLocaleString()}</p>
                          <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase">In Stock</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="animate-fade-in space-y-6">
                {[
                  { id: 'ORD-9921', item: 'On-Grid Solar Kit 5kW', customer: 'Amit S.', date: 'Today', status: 'Pending', logistics: 'Shiprocket #SR-1022' },
                  { id: 'ORD-8812', item: 'Mono Perc Panel 540W', customer: 'Rahul K.', date: 'Yesterday', status: 'Shipped', logistics: 'Delhivery #DL-9921' }
                ].map(order => (
                  <div key={order.id} className="glass-card p-6 flex flex-col gap-6 bg-white/[0.03] border-white/5">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-6 items-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Package className="text-primary" size={24} />
                        </div>
                        <div>
                          <p className="text-xs text-text-dim uppercase font-bold tracking-widest">{order.id}</p>
                          <h4 className="font-bold">{order.item}</h4>
                          <p className="text-sm text-text-dim">Customer: {order.customer} • {order.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                          order.status === 'Shipped' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
                        }`}>
                          {order.status}
                        </span>
                        <button className="p-2 hover:bg-white/10 rounded-lg">
                          <MoreVertical size={20} className="text-text-dim" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2 text-text-dim">
                        <Truck size={14} className="text-primary" />
                        <span>Tracking: <span className="text-white font-medium">{order.logistics}</span></span>
                      </div>
                      <button className="text-primary font-bold hover:underline">Download Invoice</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'payouts' && (
              <div className="animate-fade-in text-center py-20 glass-card border-white/5">
                <Clock size={48} className="mx-auto mb-4 text-white/10" />
                <h3 className="text-xl font-bold">Settlement Logic Processing</h3>
                <p className="text-text-dim text-sm max-w-xs mx-auto mt-2">Next payout of ₹1,42,500 is scheduled for Monday, 4th May via Razorpay Settlements.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
