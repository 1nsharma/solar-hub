import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Share2,
  Copy
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { apiUrl } from '../../config/api';

const PartnerDashboard = ({ onBack }) => {
  const { user } = useStore();
  const [leads, setLeads] = useState([]);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [newLead, setNewLead] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    interest_type: 'Residential',
    estimated_load: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch(apiUrl(`/api/leads/${user.id}`));
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.error('Failed to fetch leads', err);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/leads'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newLead, partner_id: user.id })
      });
      if (res.ok) {
        setShowLeadForm(false);
        setNewLead({
          customer_name: '',
          customer_phone: '',
          customer_email: '',
          interest_type: 'Residential',
          estimated_load: '',
          notes: ''
        });
        fetchLeads();
      }
    } catch (err) {
      console.error('Failed to create lead', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Total Leads', value: leads.length, icon: <Users size={20} />, color: 'bg-blue-500' },
    { label: 'Converted', value: leads.filter(l => l.status === 'converted').length, icon: <CheckCircle size={20} />, color: 'bg-green-500' },
    { label: 'Potential Earnings', value: `₹${(leads.length * 1000).toLocaleString()}`, icon: <TrendingUp size={20} />, color: 'bg-yellow-500' },
    { label: 'Earned', value: '₹0', icon: <DollarSign size={20} />, color: 'bg-primary' },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 pt-24">
      <div className="container max-w-6xl">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">Partner Dashboard</h1>
              <p className="text-text-dim mt-1">Grow your solar referral business</p>
            </div>
          </div>
          <button 
            onClick={() => setShowLeadForm(true)}
            className="btn-primary flex items-center gap-2 px-6 py-3"
          >
            <Plus size={20} /> Submit New Lead
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card p-6 border border-white/5">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.color} bg-opacity-20 text-white`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-text-dim text-sm font-medium uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Referral Section */}
        <div className="glass-card p-8 border border-primary/20 bg-primary/5 mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 text-center md:text-left">
            <div className="p-4 bg-primary/20 rounded-2xl text-primary animate-pulse">
              <Share2 size={32} />
            </div>
            <div>
              <h4 className="text-2xl font-bold">Your Partner Referral Code</h4>
              <p className="text-text-dim">Share this code with installers or use it for customer tracking.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-black/40 p-4 rounded-2xl border border-white/10 w-full md:w-auto">
            <code className="text-2xl font-mono text-primary font-bold px-4">SH-SOLO-2026</code>
            <button className="p-3 hover:bg-white/10 rounded-xl transition-colors">
              <Copy size={20} />
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="glass-card border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xl font-bold">Recent Leads</h3>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
              <input 
                type="text" 
                placeholder="Search leads..." 
                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-primary outline-none transition-all w-64"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.02] text-text-dim text-xs uppercase tracking-widest">
                  <th className="px-6 py-4 font-bold">Customer</th>
                  <th className="px-6 py-4 font-bold">Interest</th>
                  <th className="px-6 py-4 font-bold">Load</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold">{lead.customer_name}</div>
                      <div className="text-xs text-text-dim">{lead.customer_phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">{lead.interest_type}</td>
                    <td className="px-6 py-4 text-sm font-mono">{lead.estimated_load || '-'} kW</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        lead.status === 'new' ? 'bg-blue-500/10 text-blue-500' :
                        lead.status === 'converted' ? 'bg-green-500/10 text-green-500' :
                        'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-dim">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-text-dim">
                      No leads submitted yet. Start referring to earn!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Lead Submission Modal */}
      {showLeadForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowLeadForm(false)}></div>
          <div className="glass-card relative z-10 w-full max-w-lg p-8 border border-white/10 animate-scale-in">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold">Submit New Lead</h3>
              <button onClick={() => setShowLeadForm(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <XCircle size={24} className="text-text-dim" />
              </button>
            </div>
            
            <form onSubmit={handleCreateLead} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-dim uppercase tracking-widest">Customer Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary outline-none transition-all"
                    placeholder="Enter full name"
                    value={newLead.customer_name}
                    onChange={e => setNewLead({...newLead, customer_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-dim uppercase tracking-widest">Phone Number</label>
                  <input 
                    required
                    type="tel" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary outline-none transition-all"
                    placeholder="10-digit mobile"
                    value={newLead.customer_phone}
                    onChange={e => setNewLead({...newLead, customer_phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-text-dim uppercase tracking-widest">Email (Optional)</label>
                <input 
                  type="email" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary outline-none transition-all"
                  placeholder="customer@email.com"
                  value={newLead.customer_email}
                  onChange={e => setNewLead({...newLead, customer_email: e.target.value})}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-dim uppercase tracking-widest">Interest Type</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary outline-none transition-all appearance-none"
                    value={newLead.interest_type}
                    onChange={e => setNewLead({...newLead, interest_type: e.target.value})}
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Agricultural">Agricultural</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-dim uppercase tracking-widest">Est. Load (kW)</label>
                  <input 
                    type="number" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary outline-none transition-all"
                    placeholder="e.g. 5"
                    value={newLead.estimated_load}
                    onChange={e => setNewLead({...newLead, estimated_load: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-text-dim uppercase tracking-widest">Notes</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary outline-none transition-all h-24"
                  placeholder="Any specific requirements?"
                  value={newLead.notes}
                  onChange={e => setNewLead({...newLead, notes: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-5 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Lead'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerDashboard;
