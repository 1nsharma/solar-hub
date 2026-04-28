import React, { useState } from 'react';
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
  Star
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function AdminDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [vendors, setVendors] = useState([]);

  React.useEffect(() => {
    if (activeTab === 'vendors') {
      fetch('http://localhost:5000/api/admin/vendors')
        .then(res => res.json())
        .then(data => setVendors(data))
        .catch(err => console.error('Failed to fetch vendors:', err));
    }
  }, [activeTab]);

  // Mock data for management
  const stats = [
    { title: 'Total Revenue', value: '₹1.2Cr', trend: '+12%', icon: <TrendingUp className="text-secondary" /> },
    { title: 'Active Users', value: '1,240', trend: '+5%', icon: <Users className="text-primary" /> },
    { title: 'Pending Orders', value: '18', trend: '-2%', icon: <ShoppingBag className="text-orange-400" /> },
    { title: 'Service Requests', value: '42', trend: '+8%', icon: <Wrench className="text-blue-400" /> }
  ];

  const technicians = [
    { id: 'T1', name: 'Amit Sharma', region: 'Noida', jobs: 45, rating: 4.8, status: 'Active' },
    { id: 'T2', name: 'Rahul Kumar', region: 'Kanpur', jobs: 32, rating: 4.6, status: 'On Job' },
    { id: 'T3', name: 'Suresh Singh', region: 'Lucknow', jobs: 28, rating: 4.7, status: 'Active' },
  ];

  return (
    <div className="min-h-screen bg-bg-dark pt-32 pb-20">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <button onClick={onBack} className="text-primary mb-4 flex items-center gap-2 hover:gap-3 transition-all font-bold">
              <ArrowLeft size={18} /> Exit Admin View
            </button>
            <h1 className="text-5xl font-bold tracking-tighter">Admin <span className="text-primary">Control Center</span></h1>
            <p className="text-text-dim text-lg mt-2">Oversee marketplace operations, vendors, and system health.</p>
          </div>
          
          <div className="flex gap-4">
            <button className="btn-secondary py-3 px-6 text-sm flex items-center gap-2">
              <Settings size={18} /> System Settings
            </button>
            <button className="btn-primary py-3 px-6 text-sm flex items-center gap-2">
              <BarChart3 size={18} /> Export Reports
            </button>
          </div>
        </div>

        {/* Sidebar + Main Content Layout */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 size={20} /> },
              { id: 'orders', label: 'Order Management', icon: <ShoppingBag size={20} /> },
              { id: 'vendors', label: 'Vendor Approvals', icon: <ShieldCheck size={20} /> },
              { id: 'techs', label: 'Technician Pool', icon: <Wrench size={20} /> },
              { id: 'users', label: 'User Directory', icon: <Users size={20} /> },
              { id: 'payments', label: 'Payouts & Settlements', icon: <CreditCard size={20} /> }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === item.id 
                  ? 'bg-primary text-black shadow-lg shadow-primary/20' 
                  : 'text-text-dim hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {activeTab === 'overview' && (
              <div className="animate-fade-in">
                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="glass-card p-6 bg-white/[0.03] border-white/5">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white/5 rounded-xl">{stat.icon}</div>
                        <span className="text-xs font-bold text-secondary">{stat.trend}</span>
                      </div>
                      <p className="text-xs text-text-dim uppercase font-bold tracking-widest">{stat.title}</p>
                      <p className="text-3xl font-bold mt-1 tracking-tighter">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Activity Section */}
                <div className="glass-card p-8 bg-white/[0.03]">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Zap className="text-primary" size={20} /> System Alerts & Activity
                  </h3>
                  <div className="space-y-6">
                    {[
                      { msg: 'New Vendor application from SolarNova Ltd.', time: '10 mins ago', type: 'info' },
                      { msg: 'High demand for Installation services in Noida region.', time: '45 mins ago', type: 'success' },
                      { msg: 'Payment failure detected for Order #ORD-9921.', time: '2 hours ago', type: 'error' },
                      { msg: 'System backup completed successfully.', time: '5 hours ago', type: 'success' }
                    ].map((alert, idx) => (
                      <div key={idx} className="flex items-center gap-4 py-4 border-b border-white/5 last:border-0">
                        <div className={`w-2 h-2 rounded-full ${
                          alert.type === 'error' ? 'bg-red-500' : alert.type === 'success' ? 'bg-secondary' : 'bg-primary'
                        }`}></div>
                        <p className="flex-1 text-sm font-medium">{alert.msg}</p>
                        <span className="text-xs text-text-dim">{alert.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vendors' && (
              <div className="animate-fade-in space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">Vendor Directory</h3>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" size={16} />
                      <input 
                        type="text" 
                        placeholder="Search vendors..."
                        className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm"
                      />
                    </div>
                    <button className="btn-secondary py-2 px-4 text-xs"><Filter size={14} /> Filter</button>
                  </div>
                </div>

                <div className="glass-card overflow-hidden border-white/5">
                  <table className="w-full text-left">
                    <thead className="bg-white/5 text-xs text-text-dim uppercase font-bold tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Vendor Name</th>
                        <th className="px-6 py-4">Products</th>
                        <th className="px-6 py-4">Rating</th>
                        <th className="px-6 py-4">Joined</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {vendors.map(vendor => (
                        <tr key={vendor.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold">{vendor.business_name}</p>
                            <p className="text-[10px] text-text-dim">By {vendor.owner_name}</p>
                          </td>
                          <td className="px-6 py-4 text-sm">{vendor.product_count || 0} Items</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                              <Star size={12} fill="currentColor" /> {vendor.rating}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-text-dim">{new Date(vendor.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                              vendor.status === 'approved' ? 'bg-secondary/10 text-secondary' : 'bg-orange-400/10 text-orange-400'
                            }`}>
                              {vendor.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                              <MoreVertical size={16} className="text-text-dim" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'techs' && (
              <div className="animate-fade-in space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">Technician Pool</h3>
                  <button className="btn-primary py-2 px-4 text-xs font-bold">+ Onboard New Technician</button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {technicians.map(tech => (
                    <div key={tech.id} className="glass-card p-6 border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                          <User className="text-primary" size={24} />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                          tech.status === 'Active' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
                        }`}>
                          {tech.status}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold mb-1">{tech.name}</h4>
                      <p className="text-xs text-text-dim mb-4 flex items-center gap-1"><MapPin size={12} /> {tech.region}</p>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div>
                          <p className="text-[10px] text-text-dim uppercase font-bold tracking-widest">Jobs Done</p>
                          <p className="text-lg font-bold">{tech.jobs}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-text-dim uppercase font-bold tracking-widest">Rating</p>
                          <p className="text-lg font-bold flex items-center gap-1"><Star size={14} className="text-yellow-500" fill="currentColor" /> {tech.rating}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-6">
                        <button className="flex-1 btn-secondary py-2 text-xs font-bold">View Profile</button>
                        <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-xl text-xs font-bold transition-all border border-white/10">Assign Job</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === 'orders' || activeTab === 'users' || activeTab === 'payments') && (
              <div className="animate-fade-in py-20 text-center glass-card border-white/5">
                <Settings size={48} className="mx-auto mb-6 text-white/10 animate-spin-slow" />
                <h3 className="text-2xl font-bold mb-2">Section Under Construction</h3>
                <p className="text-text-dim max-w-sm mx-auto">This management interface is being wired up to the live database. Stay tuned for full CRUD controls.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
