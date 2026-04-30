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
    { title: 'System Revenue', value: stats?.systemRevenue || '₹0', trend: '+12%', icon: <TrendingUp className="text-secondary" />, color: 'secondary' },
    { title: 'Active Users', value: stats?.activeUsers || '0', trend: '+5%', icon: <Users className="text-primary" />, color: 'primary' },
    { title: 'Total Generation', value: stats?.totalGeneration || '0 GWh', trend: '+8%', icon: <Zap className="text-yellow-400" />, color: 'yellow' },
    { title: 'Open Support', value: stats?.openSupport || '0', trend: '-2%', icon: <Wrench className="text-blue-400" />, color: 'blue' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-28 pb-20">
      <div className="container max-w-[1400px]">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <button onClick={onBack} className="group flex items-center gap-2 text-primary/60 hover:text-primary transition-all font-bold text-sm mb-4">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Marketplace
            </button>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter flex items-center gap-4">
              Control <span className="text-primary">Center</span>
              <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-[10px] uppercase tracking-widest font-black text-primary">Live Pulse</span>
              </div>
            </h1>
          </div>

          <div className="flex gap-3">
            <button onClick={fetchStats} className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
              <RefreshCw size={20} className={loading ? 'animate-spin text-primary' : ''} />
            </button>
            <button className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
              <BarChart3 size={18} /> Reports
            </button>
            <button className="bg-primary text-black px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all">
              <Settings size={18} /> Settings
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Sidebar Nav */}
          <div className="lg:col-span-3 space-y-2">
            {[
              { id: 'overview', label: 'Ecosystem Pulse', icon: <Activity size={20} /> },
              { id: 'vendors', label: 'Partner Onboarding', icon: <ShieldCheck size={20} /> },
              { id: 'orders', label: 'Transaction Control', icon: <ShoppingBag size={20} /> },
              { id: 'infrastructure', label: 'System Health', icon: <Truck size={20} /> }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-5 rounded-3xl font-black transition-all group ${
                  activeTab === item.id 
                  ? 'bg-primary text-black shadow-2xl shadow-primary/20 scale-[1.02]' 
                  : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className={`${activeTab === item.id ? 'bg-black/10' : 'bg-white/5 group-hover:bg-white/10'} p-2 rounded-xl transition-all`}>
                  {item.icon}
                </div>
                <span className="tracking-tight">{item.label}</span>
                {item.id === 'vendors' && partners.length > 0 && (
                   <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] ${activeTab === item.id ? 'bg-black text-white' : 'bg-primary text-black'}`}>
                    {partners.length}
                   </span>
                )}
              </button>
            ))}
          </div>

          {/* Main Stage */}
          <div className="lg:col-span-9 space-y-8">
            {activeTab === 'overview' && (
              <div className="animate-in fade-in duration-500 space-y-8">
                {/* Real-time Stats Grid */}
                <div className="grid md:grid-cols-4 gap-6">
                  {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 p-6 rounded-[32px] hover:border-primary/20 transition-all group">
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">{stat.icon}</div>
                        <div className="bg-secondary/10 px-2 py-1 rounded-lg">
                          <span className="text-[10px] font-black text-secondary">{stat.trend}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em] mb-1">{stat.title}</p>
                      <h2 className="text-3xl font-black tracking-tighter">{stat.value}</h2>
                    </div>
                  ))}
                </div>

                {/* Growth Analytics Section */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] relative overflow-hidden">
                    <div className="flex justify-between items-end mb-8 relative z-10">
                      <div>
                        <h3 className="text-xl font-black tracking-tight">Revenue Trends</h3>
                        <p className="text-xs text-white/40 mt-1">Daily platform earnings analysis</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-primary">₹{stats?.systemRevenue || '0.00'}</span>
                        <p className="text-[10px] text-primary/40 uppercase font-black tracking-widest">Gross Target</p>
                      </div>
                    </div>
                    
                    <div className="h-[280px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '16px', fontWeight: 'bold' }}
                            itemStyle={{ color: '#FFD700' }}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#FFD700" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] relative overflow-hidden">
                    <div className="flex justify-between items-end mb-8 relative z-10">
                      <div>
                        <h3 className="text-xl font-black tracking-tight">User Adoption</h3>
                        <p className="text-xs text-white/40 mt-1">Platform user acquisition rate</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-secondary">{stats?.activeUsers || '0'}</span>
                        <p className="text-[10px] text-secondary/40 uppercase font-black tracking-widest">Active nodes</p>
                      </div>
                    </div>
                    
                    <div className="h-[280px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <Bar dataKey="users" fill="#4CAF50" radius={[10, 10, 10, 10]} />
                          <Tooltip 
                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                            contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '16px', fontWeight: 'bold' }}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Infrastructure Monitor */}
                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px]">
                  <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                    <Truck className="text-primary" size={24} /> Infrastructure Health
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {stats?.infrastructure?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-5 p-5 bg-white/5 rounded-3xl border border-white/5">
                        <div className={`w-3 h-3 rounded-full ${item.color === '#4CAF50' ? 'bg-secondary shadow-[0_0_15px_#4CAF50]' : 'bg-primary animate-pulse shadow-[0_0_15px_#FFD700]'}`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-black tracking-tight">{item.label}</p>
                          <p className="text-[10px] text-white/40 uppercase font-black">{item.status}</p>
                        </div>
                        <span className="text-xs font-black text-white/20">{item.latency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vendors' && (
              <div className="animate-in slide-in-from-right duration-500 space-y-6">
                <div className="flex justify-between items-center bg-white/5 p-6 rounded-[32px] border border-white/10">
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">Onboarding Requests</h3>
                    <p className="text-sm text-white/40">Verify and approve new partners</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search partners..."
                        className="pl-12 pr-6 py-3 bg-black/40 border border-white/10 rounded-2xl text-sm focus:border-primary transition-all w-64"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5 text-[10px] text-white/30 uppercase font-black tracking-[0.2em]">
                        <th className="px-8 py-6">Partner Identity</th>
                        <th className="px-8 py-6">Classification</th>
                        <th className="px-8 py-6">Status Marker</th>
                        <th className="px-8 py-6 text-right">Escalation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {partners.length > 0 ? (
                        partners.map((partner, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-8 py-8">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl font-black group-hover:bg-primary group-hover:text-black transition-all">
                                  {partner.name?.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-black text-lg tracking-tight">{partner.name}</p>
                                  <p className="text-xs text-white/40 tracking-widest uppercase">ID: {partner.id?.slice(0,8)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-8">
                              <span className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
                                {partner.type}
                              </span>
                            </td>
                            <td className="px-8 py-8">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                <span className="text-xs font-black text-primary uppercase tracking-widest">{partner.status}</span>
                              </div>
                            </td>
                            <td className="px-8 py-8 text-right">
                              <button className="bg-primary text-black px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-primary/10 hover:scale-105 active:scale-95 transition-all">
                                Review KYC
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-8 py-20 text-center">
                            <ShieldCheck size={48} className="mx-auto mb-4 text-white/10" />
                            <p className="text-white/40 font-black uppercase tracking-widest">No pending applications found</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab !== 'overview' && activeTab !== 'vendors' && (
              <div className="animate-in zoom-in duration-500 py-32 text-center bg-white/[0.02] border border-white/5 rounded-[40px]">
                <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-white/10">
                  <Activity size={40} className="text-white/20" />
                </div>
                <h3 className="text-3xl font-black tracking-tighter mb-4">Neural Link Active</h3>
                <p className="text-white/40 max-w-sm mx-auto font-medium">This module is currently being optimized for high-frequency trading and transaction control. Please verify other sectors.</p>
                <button onClick={() => setActiveTab('overview')} className="mt-8 text-primary font-black uppercase tracking-widest text-xs hover:underline decoration-2 underline-offset-8">
                  Return to Command Center
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
