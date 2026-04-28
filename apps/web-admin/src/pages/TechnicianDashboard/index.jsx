import React, { useState } from 'react';
import { 
  Wrench, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Phone, 
  ArrowLeft, 
  ChevronRight,
  User,
  Zap,
  Calendar,
  Filter
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function TechnicianDashboard({ onBack }) {
  const { bookings } = useStore();
  const [activeJob, setActiveJob] = useState(null);

  // Mock assigned jobs if none in store
  const jobs = bookings.length > 0 ? bookings : [
    {
      id: 'SRV-88291',
      service: 'Panel Cleaning',
      date: 'Today',
      slot: '09:00 AM',
      address: 'Sector 4, Noida, UP',
      status: 'Assigned',
      customer: 'Rahul Gupta',
      phone: '+91 98765 43210',
      description: 'Customer reports 15% drop in efficiency. 10 panels to be cleaned.'
    },
    {
      id: 'SRV-99302',
      service: 'Health Checkup',
      date: 'Tomorrow',
      slot: '11:00 AM',
      address: 'Civil Lines, Kanpur, UP',
      status: 'Pending',
      customer: 'Anjali Sharma',
      phone: '+91 88765 43211',
      description: 'Annual maintenance visit. Check inverter wiring and battery health.'
    }
  ];

  return (
    <div className="min-h-screen bg-bg-dark pt-32 pb-20">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <button onClick={onBack} className="text-primary mb-4 flex items-center gap-2 hover:gap-3 transition-all font-bold">
              <ArrowLeft size={18} /> Exit Tech View
            </button>
            <h1 className="text-5xl font-bold tracking-tighter">Technician <span className="text-primary">Console</span></h1>
            <p className="text-text-dim text-lg mt-2">Manage your service dispatches and job reports.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/10 text-center">
              <p className="text-[10px] text-text-dim uppercase font-bold mb-1 tracking-widest">Today's Jobs</p>
              <p className="text-2xl font-bold text-primary">03</p>
            </div>
            <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/10 text-center">
              <p className="text-[10px] text-text-dim uppercase font-bold mb-1 tracking-widest">Completed</p>
              <p className="text-2xl font-bold text-secondary">12</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Job List */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="text-primary" size={20} /> Assigned Tasks
              </h3>
              <button className="p-2 bg-white/5 rounded-lg text-text-dim hover:text-white">
                <Filter size={18} />
              </button>
            </div>

            {jobs.map(job => (
              <div 
                key={job.id}
                onClick={() => setActiveJob(job)}
                className={`glass-card p-6 cursor-pointer border-l-4 transition-all ${
                  activeJob?.id === job.id ? 'border-primary bg-white/10' : 'border-transparent hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest px-2 py-0.5 bg-primary/10 rounded mb-2 inline-block">
                      {job.status}
                    </span>
                    <h4 className="font-bold text-lg leading-tight">{job.service}</h4>
                  </div>
                  <p className="text-xs text-text-dim">{job.date}</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-text-dim flex items-center gap-2"><MapPin size={14} /> {job.address}</p>
                  <p className="text-xs text-text-dim flex items-center gap-2"><Clock size={14} /> {job.slot}</p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
                      <User size={12} className="text-text-dim" />
                    </div>
                    <span className="text-xs font-bold">{job.customer || 'Customer'}</span>
                  </div>
                  <ChevronRight size={16} className="text-text-dim" />
                </div>
              </div>
            ))}
          </div>

          {/* Job Details & Action */}
          <div className="lg:col-span-2">
            {!activeJob ? (
              <div className="glass-card h-full flex flex-col items-center justify-center p-20 text-center bg-white/[0.01] border-dashed">
                <Zap size={64} className="mb-6 text-white/10" />
                <h3 className="text-2xl font-bold mb-2">Select a Task</h3>
                <p className="text-text-dim max-w-sm">Pick a job from the list to start the service workflow and access customer details.</p>
              </div>
            ) : (
              <div className="glass-card p-10 animate-fade-in bg-white/[0.03]">
                <div className="flex flex-col md:flex-row justify-between gap-8 mb-12 border-b border-white/5 pb-8">
                  <div>
                    <h3 className="text-3xl font-bold mb-4">{activeJob.service}</h3>
                    <div className="flex flex-wrap gap-4">
                      <div className="bg-white/5 px-4 py-2 rounded-xl flex items-center gap-2">
                        <MapPin size={16} className="text-primary" />
                        <span className="text-sm font-bold">{activeJob.address}</span>
                      </div>
                      <div className="bg-white/5 px-4 py-2 rounded-xl flex items-center gap-2">
                        <Clock size={16} className="text-primary" />
                        <span className="text-sm font-bold">{activeJob.slot}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="bg-secondary text-black p-4 rounded-2xl hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all">
                      <Phone size={24} />
                    </button>
                    <button className="bg-primary text-black px-8 py-4 rounded-2xl font-bold hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all">
                      Start Navigation
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-lg font-bold mb-4">Job Description</h4>
                      <p className="text-text-dim leading-relaxed">{activeJob.description || 'Standard service procedure as per guidelines.'}</p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                      <h4 className="font-bold mb-4">Service Checklist</h4>
                      <div className="space-y-4">
                        {[
                          'Arrived at location',
                          'System inspection completed',
                          'Issue identified',
                          'Customer verified',
                          'Service performed',
                          'Final testing'
                        ].map((item, idx) => (
                          <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" className="w-5 h-5 rounded border-white/10 bg-white/5 checked:bg-primary" />
                            <span className="text-text-dim group-hover:text-white transition-colors">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
                      <h4 className="font-bold mb-6">Action Required</h4>
                      <div className="flex flex-col gap-4">
                        <button className="btn-primary py-4 justify-center">
                          Update Status to 'In Progress'
                        </button>
                        
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-text-dim text-left">Task Photos</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {[1, 2].map(i => (
                              <div key={i} className="aspect-square bg-white/10 rounded-lg border border-white/10 flex items-center justify-center text-text-dim">
                                <Plus size={16} />
                              </div>
                            ))}
                            <div className="aspect-square bg-primary/10 rounded-lg border border-primary/30 flex items-center justify-center text-primary cursor-pointer hover:bg-primary/20">
                              <Plus size={20} />
                            </div>
                          </div>
                          <button className="btn-secondary w-full py-2 text-xs">Upload Photo</button>
                        </div>

                        <button className="bg-secondary text-black py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all flex items-center justify-center gap-2">
                          <CheckCircle2 size={18} /> Mark Job as Completed
                        </button>

                        <button className="bg-red-500/10 text-red-500 border border-red-500/20 py-4 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all">
                          Raise an Issue
                        </button>
                      </div>
                    </div>

                    <div className="bg-secondary/10 p-6 rounded-2xl border border-secondary/20">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 size={20} className="text-secondary" />
                        <h4 className="font-bold">Payment Details</h4>
                      </div>
                      <p className="text-sm text-text-dim mb-4">Amount to be collected after service completion.</p>
                      <p className="text-2xl font-bold text-secondary">₹{activeJob.price || '499'}</p>
                      <p className="text-[10px] text-text-dim uppercase mt-2 font-bold">Mode: UPI / Cash</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
