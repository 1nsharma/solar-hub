import React, { useState, useEffect } from 'react';
import {
  Users, 
  ShoppingBag, 
  Truck, 
  Wrench, 
  Settings, 
  BarChart3, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Search,
  Filter,
  MoreVertical,
  Zap,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Star,
  User,
  MapPin,
  Activity,
  RefreshCw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { useStore } from '../../store/useStore';
import { apiUrl } from '../../config/api';

// Designer Tokens: High-Fidelity HSL System
const COLORS = {
  primary: 'hsla(51, 100%, 50%, 1)',
  secondary: 'hsla(145, 63%, 49%, 1)',
  danger: 'hsla(0, 100%, 67%, 1)',
  bg: 'hsla(0, 0%, 2%, 1)',
  glass: 'hsla(0, 0%, 100%, 0.03)',
  glassBorder: 'hsla(0, 0%, 100%, 0.05)',
  textDim: 'hsla(0, 0%, 100%, 0.4)',
};

const chartData = [
  { name: 'Mon', revenue: 4000, users: 240 },
  { name: 'Tue', revenue: 3000, users: 198 },
  { name: 'Wed', revenue: 2000, users: 320 },
  { name: 'Thu', revenue: 2780, users: 210 },
  { name: 'Fri', revenue: 1890, users: 150 },
  { name: 'Sat', revenue: 2390, users: 250 },
  { name: 'Sun', revenue: 3490, users: 210 },
];

export default function AdminDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [statsRes, partnersRes] = await Promise.all([
        fetch(apiUrl('/api/admin/stats')),
        fetch(apiUrl('/api/admin/partners/pending'))
      ]);
      const statsData = await statsRes.json();
      const partnersData = await partnersRes.json();
      setStats(statsData);
      setPartners(partnersData);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    { title: 'System Revenue', value: stats?.systemRevenue || '₹0', trend: '+12%', icon: <TrendingUp size={20} />, color: COLORS.secondary },
    { title: 'Active Users', value: stats?.activeUsers || '0', trend: '+5%', icon: <Users size={20} />, color: COLORS.primary },
    { title: 'Total Generation', value: stats?.totalGeneration || '0 GWh', trend: '+8%', icon: <Zap size={20} />, color: '#fbbf24' },
    { title: 'Open Support', value: stats?.openSupport || '0', trend: '-2%', icon: <Wrench size={20} />, color: COLORS.danger }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-28 pb-20 selection:bg-primary selection:text-black">
      <div className="container max-w-[1400px]">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <button 
              onClick={onBack} 
              className="group flex items-center gap-2 text-white/40 hover:text-primary transition-all font-bold text-xs uppercase tracking-widest mb-4"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Hub
            </button>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter flex items-center gap-4">
              Control <span className="text-primary italic">Center</span>
              <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full backdrop-blur-xl">
                <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-primary">Neural Link Active</span>
              </div>
            </h1>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={fetchStats} 
              className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-primary/30 transition-all group"
              title="Sync Data"
            >
              <RefreshCw size={20} className={`${loading ? 'animate-spin' : 'group-hover:rotate-180'} text-primary transition-all duration-500`} />
            </button>
            <button className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 transition-all">
              <BarChart3 size={18} /> Archive
            </button>
            <button className="bg-primary text-black px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-[0_0_30px_rgba(255,215,0,0.2)] hover:scale-105 active:scale-95 transition-all">
              <Settings size={18} /> Config
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Futuristic Nav Sidebar */}
          <div className="lg:col-span-3 space-y-3">
            {[
              { id: 'overview', label: 'Ecosystem Pulse', icon: <Activity size={20} /> },
              { id: 'vendors', label: 'Partner Matrix', icon: <ShieldCheck size={20} /> },
              { id: 'orders', label: 'Flow Control', icon: <ShoppingBag size={20} /> },
              { id: 'infrastructure', label: 'Grid Health', icon: <Truck size={20} /> }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-5 px-8 py-6 rounded-[32px] font-black transition-all group relative overflow-hidden ${
                  activeTab === item.id 
                  ? 'bg-primary text-black scale-[1.02] shadow-2xl shadow-primary/20' 
                  : 'text-white/30 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className={`${activeTab === item.id ? 'bg-black/10' : 'bg-white/5 group-hover:bg-white/10'} p-2.5 rounded-2xl transition-all`}>
                  {item.icon}
                </div>
                <span className="tracking-tight text-lg">{item.label}</span>
                {item.id === 'vendors' && partners.length > 0 && (
                   <span className={`ml-auto px-3 py-1 rounded-full text-[10px] font-black ${activeTab === item.id ? 'bg-black text-white' : 'bg-primary text-black animate-pulse'}`}>
                    {partners.length}
                   </span>
                )}
                {activeTab === item.id && (
                  <div className="absolute right-0 top-0 h-full w-1.5 bg-black/20" />
                )}
              </button>
            ))}
          </div>

          {/* Main Content Stage */}
          <div className="lg:col-span-9 space-y-10">
            {activeTab === 'overview' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
                {/* Real-time Stats Grid */}
                <div className="grid md:grid-cols-4 gap-6">
                  {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] hover:border-primary/20 hover:bg-white/[0.04] transition-all group relative overflow-hidden">
                      {loading ? (
                        <div className="space-y-4">
                           <div className="w-12 h-12 bg-white/5 rounded-2xl animate-pulse" />
                           <div className="w-20 h-2 bg-white/5 rounded-full animate-pulse" />
                           <div className="w-24 h-6 bg-white/5 rounded-full animate-pulse" />
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start mb-8">
                            <div 
                              className="p-4 rounded-2xl transition-transform group-hover:scale-110" 
                              style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                            >
                              {stat.icon}
                            </div>
                            <div className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                              <span className="text-[10px] font-black" style={{ color: stat.color }}>{stat.trend}</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em] mb-2">{stat.title}</p>
                          <h2 className="text-4xl font-black tracking-tighter">{stat.value}</h2>
                          <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                            {React.cloneElement(stat.icon, { size: 100 })}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Growth Analytics Section */}
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[48px] relative overflow-hidden group">
                    <div className="flex justify-between items-end mb-10 relative z-10">
                      <div>
                        <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">Revenue Stream</h3>
                        <p className="text-sm text-white/30 mt-1 uppercase tracking-widest font-bold">Neural Analysis: Growth +14%</p>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-black text-primary">₹{stats?.systemRevenue || '0.00'}</span>
                        <p className="text-[10px] text-primary/40 uppercase font-black tracking-widest mt-1">Live Liquidity</p>
                      </div>
                    </div>
                    
                    <div className="h-[320px] w-full">
                      {loading ? (
                        <div className="w-full h-full bg-white/5 rounded-3xl animate-pulse" />
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FFD700" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Tooltip 
                              cursor={{ stroke: 'rgba(255,215,0,0.2)', strokeWidth: 2 }}
                              contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '16px', fontWeight: 'bold' }}
                              itemStyle={{ color: '#FFD700' }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#FFD700" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[48px] relative overflow-hidden group">
                    <div className="flex justify-between items-end mb-10 relative z-10">
                      <div>
                        <h3 className="text-2xl font-black tracking-tight group-hover:text-secondary transition-colors">Node Acquisition</h3>
                        <p className="text-sm text-white/30 mt-1 uppercase tracking-widest font-bold">New Registrations: 42/hr</p>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-black text-secondary">{stats?.activeUsers || '0'}</span>
                        <p className="text-[10px] text-secondary/40 uppercase font-black tracking-widest mt-1">Total Nodes</p>
                      </div>
                    </div>
                    
                    <div className="h-[320px] w-full">
                      {loading ? (
                        <div className="w-full h-full bg-white/5 rounded-3xl animate-pulse" />
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <Bar dataKey="users" fill="#4CAF50" radius={[12, 12, 0, 0]} />
                            <Tooltip 
                              cursor={{fill: 'rgba(255,255,255,0.03)'}}
                              contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '16px', fontWeight: 'bold' }}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                </div>

                {/* Infrastructure Monitor */}
                <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[48px] group">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-black flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-2xl"><Truck className="text-primary" size={24} /></div>
                      Grid Infrastructure Monitoring
                    </h3>
                    <span className="text-xs font-black text-white/20 uppercase tracking-widest">Active Links: 3</span>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-8">
                    {loading ? (
                      [1,2,3].map(i => <div key={i} className="h-24 bg-white/5 rounded-3xl animate-pulse" />)
                    ) : (
                      stats?.infrastructure?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-6 p-6 bg-white/[0.03] rounded-[32px] border border-white/5 hover:border-primary/20 transition-all group/item">
                          <div 
                            className={`w-4 h-4 rounded-full relative ${item.color === '#4CAF50' ? 'bg-secondary' : 'bg-primary'}`}
                          >
                            <div className={`absolute inset-0 rounded-full animate-ping ${item.color === '#4CAF50' ? 'bg-secondary/40' : 'bg-primary/40'}`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-lg font-black tracking-tight group-hover/item:text-white transition-colors">{item.label}</p>
                            <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-0.5">{item.status}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-white/40 block">{item.latency}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vendors' && (
              <div className="animate-in slide-in-from-right-8 duration-700 space-y-8">
                <div className="flex justify-between items-center bg-white/[0.03] p-8 rounded-[40px] border border-white/10 backdrop-blur-3xl">
                  <div>
                    <h3 className="text-3xl font-black tracking-tight">Onboarding Matrix</h3>
                    <p className="text-sm text-white/30 font-bold uppercase tracking-widest mt-1">Neural Verification Required</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="relative group">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary transition-colors" size={20} />
                      <input 
                        type="text" 
                        placeholder="Search Identity..."
                        className="pl-14 pr-8 py-4 bg-black/40 border border-white/10 rounded-[20px] text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all w-80 font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white/[0.01] border border-white/5 rounded-[48px] overflow-hidden backdrop-blur-md">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/[0.03] text-[10px] text-white/30 uppercase font-black tracking-[0.3em]">
                        <th className="px-10 py-8">Entity Identity</th>
                        <th className="px-10 py-8">Matrix Class</th>
                        <th className="px-10 py-8">Status State</th>
                        <th className="px-10 py-8 text-right">Escalation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loading ? (
                        [1,2,3].map(i => (
                          <tr key={i}>
                            <td colSpan={4} className="px-10 py-10">
                              <div className="h-12 bg-white/5 rounded-2xl animate-pulse" />
                            </td>
                          </tr>
                        ))
                      ) : partners.length > 0 ? (
                        partners.map((partner, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.03] transition-all group/row">
                            <td className="px-10 py-10">
                              <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-white/5 rounded-[20px] flex items-center justify-center text-2xl font-black group-hover/row:bg-primary group-hover/row:text-black group-hover/row:rotate-6 transition-all duration-500">
                                  {partner.name?.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-black text-xl tracking-tight group-hover/row:text-primary transition-colors">{partner.name}</p>
                                  <p className="text-[10px] text-white/20 font-black tracking-[0.2em] uppercase mt-1">UID: {partner.id?.slice(0,12)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-10">
                              <span className="px-5 py-2.5 bg-primary/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20">
                                {partner.type}
                              </span>
                            </td>
                            <td className="px-10 py-10">
                              <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(255,215,0,0.5)]"></div>
                                <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">{partner.status}</span>
                              </div>
                            </td>
                            <td className="px-10 py-10 text-right">
                              <button className="bg-white text-black px-8 py-3.5 rounded-[20px] text-xs font-black uppercase tracking-widest shadow-xl hover:bg-primary hover:scale-105 active:scale-95 transition-all">
                                Review KYC
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-10 py-32 text-center">
                            <ShieldCheck size={64} className="mx-auto mb-6 text-white/5" />
                            <p className="text-white/20 font-black uppercase tracking-[0.3em] text-sm">Matrix clear: No pending entities</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab !== 'overview' && activeTab !== 'vendors' && (
              <div className="animate-in zoom-in-95 duration-700 py-40 text-center bg-white/[0.01] border border-white/5 rounded-[64px] backdrop-blur-xl">
                <div className="w-32 h-32 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto mb-10 border border-white/10 group">
                  <Activity size={48} className="text-white/10 group-hover:text-primary group-hover:scale-110 transition-all duration-500" />
                </div>
                <h3 className="text-4xl font-black tracking-tighter mb-6 italic">Neural Link: Pending</h3>
                <p className="text-white/30 max-w-sm mx-auto font-bold uppercase tracking-widest leading-relaxed">
                  Sector being optimized for high-frequency synchronization. Access restricted.
                </p>
                <button 
                  onClick={() => setActiveTab('overview')} 
                  className="mt-12 text-primary font-black uppercase tracking-[0.3em] text-[10px] hover:text-white transition-colors py-4 px-8 border border-primary/20 rounded-full hover:bg-primary/10"
                >
                  Return to Primary Matrix
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
