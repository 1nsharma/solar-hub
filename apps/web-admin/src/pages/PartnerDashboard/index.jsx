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
import { Card, Button, StatusBadge, Input } from '@solar-hub/ui';

const PartnerDashboard = ({ onBack }: { onBack: () => void }) => {
  const { user } = useStore();
  const [leads, setLeads] = useState<any[]>([]);
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
    if (!user) return;
    try {
      const res = await fetch(apiUrl(`/api/leads/${user.id}`));
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.error('Failed to fetch leads', err);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
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
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 pt-24 selection:bg-primary selection:text-black">
      <div className="container max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-3 hover:bg-white/5 rounded-2xl transition-all border border-white/5">
              <ArrowLeft size={24} className="text-[#FFD700]" />
            </button>
            <div>
              <h1 className="text-4xl font-black tracking-tighter">Partner <span className="text-primary italic">Dashboard</span></h1>
              <p className="text-white/40 mt-1 font-medium tracking-wide uppercase text-[10px]">Grow your solar referral business</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowLeadForm(true)}
            variant="primary"
            className="flex items-center gap-3 px-8 py-4 shadow-[0_0_30px_rgba(255,215,0,0.2)]"
          >
            <Plus size={20} /> Submit New Lead
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <Card key={i} className="p-8 bg-white/[0.03] border-white/5 group hover:border-primary/20 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${stat.color} bg-opacity-10 text-white group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <h3 className="text-3xl font-black tracking-tighter">{stat.value}</h3>
            </Card>
          ))}
        </div>

        {/* Referral Section */}
        <Card className="p-10 border-primary/20 bg-primary/5 mb-12 flex flex-col md:flex-row justify-between items-center gap-8 group">
          <div className="flex items-center gap-8 text-center md:text-left">
            <div className="p-5 bg-primary/20 rounded-3xl text-primary animate-pulse shadow-[0_0_30px_rgba(255,215,0,0.2)]">
              <Share2 size={40} />
            </div>
            <div>
              <h4 className="text-2xl font-black tracking-tight mb-2">Your Partner Referral Code</h4>
              <p className="text-white/40 font-medium leading-relaxed">Share this code with installers or use it for customer tracking.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-black/60 p-5 rounded-[32px] border border-white/10 w-full md:w-auto shadow-2xl">
            <code className="text-3xl font-black text-primary px-6 tracking-tighter italic">SH-SOLO-2026</code>
            <button className="p-4 hover:bg-white/10 rounded-2xl transition-all group/btn border border-white/5">
              <Copy size={24} className="text-white/30 group-hover/btn:text-white" />
            </button>
          </div>
        </Card>

        {/* Leads Table */}
        <Card className="bg-white/[0.01] border-white/5 overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h3 className="text-xl font-black uppercase tracking-widest text-white/60">Recent Leads</h3>
            <div className="w-80">
              <Input placeholder="Search leads..." />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.03] text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">
                  <th className="px-10 py-6">Customer Identity</th>
                  <th className="px-10 py-6">Interest Matrix</th>
                  <th className="px-10 py-6">Load Factor</th>
                  <th className="px-10 py-6">Status State</th>
                  <th className="px-10 py-6">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group/row">
                    <td className="px-10 py-8">
                      <div className="font-black text-lg text-white group-hover/row:text-primary transition-colors">{lead.customer_name}</div>
                      <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">{lead.customer_phone}</div>
                    </td>
                    <td className="px-10 py-8">
                       <StatusBadge status={lead.interest_type} className="bg-blue-500/10 text-blue-400 border-blue-500/20" />
                    </td>
                    <td className="px-10 py-8 text-sm font-black text-white/60 italic">{lead.estimated_load || '-'} <span className="text-[10px] uppercase">kW</span></td>
                    <td className="px-10 py-8">
                      <StatusBadge status={lead.status === 'new' ? 'PENDING' : lead.status === 'converted' ? 'ACTIVE' : 'PROCESSING'} />
                    </td>
                    <td className="px-10 py-8 text-xs font-black text-white/30 uppercase tracking-widest">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-10 py-24 text-center">
                      <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                        <Users size={32} className="text-white/10" />
                      </div>
                      <p className="text-white/20 font-black uppercase tracking-[0.3em] text-xs">No leads detected in primary matrix</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Lead Submission Modal */}
      {showLeadForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowLeadForm(false)}></div>
          <Card className="relative z-10 w-full max-w-2xl p-10 bg-[#0a0a0a] border-white/10 animate-in zoom-in-95 duration-500 shadow-[0_0_100px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-3xl font-black tracking-tighter">Submit <span className="text-primary italic">New Lead</span></h3>
                <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">Neural sync required for processing</p>
              </div>
              <button onClick={() => setShowLeadForm(false)} className="p-3 hover:bg-white/5 rounded-2xl transition-all border border-white/5">
                <XCircle size={24} className="text-white/20 hover:text-red-400" />
              </button>
            </div>
            
            <form onSubmit={handleCreateLead} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <Input 
                  label="CUSTOMER NAME"
                  required
                  placeholder="Enter full identity"
                  value={newLead.customer_name}
                  onChange={(e: any) => setNewLead({...newLead, customer_name: e.target.value})}
                />
                <Input 
                  label="PHONE NUMBER"
                  required
                  type="tel"
                  placeholder="10-digit uplink"
                  value={newLead.customer_phone}
                  onChange={(e: any) => setNewLead({...newLead, customer_phone: e.target.value})}
                />
              </div>

              <Input 
                label="EMAIL IDENTITY (OPTIONAL)"
                type="email"
                placeholder="customer@neural.net"
                value={newLead.customer_email}
                onChange={(e: any) => setNewLead({...newLead, customer_email: e.target.value})}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">INTEREST MATRIX</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary outline-none transition-all appearance-none text-white font-black uppercase tracking-widest text-xs"
                    value={newLead.interest_type}
                    onChange={e => setNewLead({...newLead, interest_type: e.target.value})}
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Agricultural">Agricultural</option>
                  </select>
                </div>
                <Input 
                  label="EST. LOAD FACTOR (KW)"
                  type="number"
                  placeholder="e.g. 5.0"
                  value={newLead.estimated_load}
                  onChange={(e: any) => setNewLead({...newLead, estimated_load: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">OBSERVATION NOTES</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 focus:border-primary outline-none transition-all h-32 text-white font-medium text-sm leading-relaxed"
                  placeholder="Define specific mission requirements..."
                  value={newLead.notes}
                  onChange={e => setNewLead({...newLead, notes: e.target.value})}
                ></textarea>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                variant="primary"
                className="w-full py-6 rounded-3xl font-black text-lg shadow-[0_0_50px_rgba(255,215,0,0.15)] disabled:opacity-50 uppercase tracking-widest italic"
              >
                {loading ? 'SYNCING MATRIX...' : 'Authorize Submission'}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PartnerDashboard;
