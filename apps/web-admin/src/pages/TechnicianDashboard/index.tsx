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
  Filter,
  Plus
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Card, Button, StatusBadge } from '@solar-hub/ui';

export default function TechnicianDashboard({ onBack }: { onBack: () => void }) {
  const { bookings } = useStore();
  const [activeJob, setActiveJob] = useState<any>(null);

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
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 text-white px-6">
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <button onClick={onBack} className="text-primary mb-4 flex items-center gap-2 hover:gap-3 transition-all font-bold text-sm uppercase tracking-widest text-[#FFD700]">
              <ArrowLeft size={18} /> Exit Tech View
            </button>
            <h1 className="text-5xl font-black tracking-tighter">Technician <span className="text-primary italic">Console</span></h1>
            <p className="text-white/40 text-lg mt-2 font-medium">Manage your service dispatches and job reports.</p>
          </div>
          
          <div className="flex gap-4">
            <Card className="px-8 py-4 bg-white/5 border-white/10 text-center">
              <p className="text-[10px] text-white/30 uppercase font-black mb-1 tracking-widest">Today's Jobs</p>
              <p className="text-3xl font-black text-primary">03</p>
            </Card>
            <Card className="px-8 py-4 bg-white/5 border-white/10 text-center">
              <p className="text-[10px] text-white/30 uppercase font-black mb-1 tracking-widest">Completed</p>
              <p className="text-3xl font-black text-green-400">12</p>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Job List */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3 text-white/60">
                <Calendar className="text-primary" size={20} /> Assigned Tasks
              </h3>
              <button className="p-3 bg-white/5 rounded-xl text-white/30 hover:text-white transition-colors">
                <Filter size={20} />
              </button>
            </div>

            {jobs.map((job: any) => (
              <Card 
                key={job.id}
                onClick={() => setActiveJob(job)}
                className={`p-8 cursor-pointer border-l-4 transition-all group relative overflow-hidden ${
                  activeJob?.id === job.id ? 'border-primary bg-white/5' : 'border-transparent hover:bg-white/[0.03]'
                }`}
              >
                {activeJob?.id === job.id && <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-12 -mt-12"></div>}
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <StatusBadge status={job.status} className="mb-3" />
                    <h4 className="font-black text-xl text-white leading-tight group-hover:text-primary transition-colors">{job.service}</h4>
                  </div>
                  <p className="text-xs font-black text-white/30 uppercase tracking-widest">{job.date}</p>
                </div>
                
                <div className="space-y-3 mb-6 relative z-10">
                  <p className="text-xs text-white/40 flex items-center gap-3 font-medium"><MapPin size={16} className="text-primary" /> {job.address}</p>
                  <p className="text-xs text-white/40 flex items-center gap-3 font-medium"><Clock size={16} className="text-primary" /> {job.slot}</p>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-white/5 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
                      <User size={14} className="text-white/60" />
                    </div>
                    <span className="text-xs font-black text-white/60 uppercase tracking-widest">{job.customer || 'Customer'}</span>
                  </div>
                  <ChevronRight size={18} className="text-white/20 group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            ))}
          </div>

          {/* Job Details & Action */}
          <div className="lg:col-span-2">
            {!activeJob ? (
              <Card className="h-full flex flex-col items-center justify-center p-20 text-center bg-white/[0.01] border-dashed min-h-[500px]">
                <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mb-8 border border-white/10">
                   <Zap size={48} className="text-white/10" />
                </div>
                <h3 className="text-3xl font-black mb-3 text-white">Select a Task</h3>
                <p className="text-white/40 max-w-sm font-medium leading-relaxed">Pick a job from the list to start the service workflow and access customer details.</p>
              </Card>
            ) : (
              <Card className="p-10 animate-in fade-in slide-in-from-right-4 duration-700 bg-white/[0.02] border-white/5">
                <div className="flex flex-col md:flex-row justify-between gap-8 mb-12 border-b border-white/5 pb-10">
                  <div>
                    <h3 className="text-4xl font-black text-white tracking-tighter mb-6">{activeJob.service}</h3>
                    <div className="flex flex-wrap gap-4">
                      <Card className="bg-white/5 px-6 py-3 border-white/10 flex items-center gap-3 group">
                        <MapPin size={18} className="text-primary" />
                        <span className="text-sm font-black text-white/80 uppercase tracking-widest">{activeJob.address}</span>
                      </Card>
                      <Card className="bg-white/5 px-6 py-3 border-white/10 flex items-center gap-3 group">
                        <Clock size={18} className="text-primary" />
                        <span className="text-sm font-black text-white/80 uppercase tracking-widest">{activeJob.slot}</span>
                      </Card>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="secondary" className="p-5 rounded-2xl bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-400 hover:text-black">
                      <Phone size={24} />
                    </Button>
                    <Button variant="primary" className="px-10 py-5 shadow-[0_0_30px_rgba(255,215,0,0.2)] uppercase font-black tracking-widest text-xs">
                      Start Navigation
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-16">
                  <div className="space-y-10">
                    <div>
                      <h4 className="text-sm font-black text-white/40 uppercase tracking-[0.2em] mb-6">Job Description</h4>
                      <p className="text-white/60 leading-relaxed font-medium text-lg italic border-l-4 border-primary/20 pl-6">{activeJob.description || 'Standard service procedure as per guidelines.'}</p>
                    </div>

                    <Card className="bg-white/5 p-8 border-white/10">
                      <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-8">Service Checklist</h4>
                      <div className="space-y-6">
                        {[
                          'Arrived at location',
                          'System inspection completed',
                          'Issue identified',
                          'Customer verified',
                          'Service performed',
                          'Final testing'
                        ].map((item, idx) => (
                          <label key={idx} className="flex items-center gap-4 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                               <input type="checkbox" className="peer w-6 h-6 rounded-lg border-2 border-white/10 bg-white/5 checked:bg-primary checked:border-primary appearance-none transition-all" />
                               <CheckCircle2 size={14} className="absolute text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                            <span className="text-white/40 font-black uppercase tracking-widest text-[10px] group-hover:text-white transition-colors">{item}</span>
                          </label>
                        ))}
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-10">
                    <Card className="bg-white/5 p-8 border-white/10 text-center">
                      <h4 className="text-xs font-black text-white/40 uppercase tracking-widest mb-8">Action Required</h4>
                      <div className="flex flex-col gap-6">
                        <Button variant="primary" className="py-5 justify-center uppercase font-black tracking-widest text-xs">
                          Update to 'In Progress'
                        </Button>
                        
                        <div className="space-y-6">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 text-left">Task Evidence (Photos)</h4>
                          <div className="grid grid-cols-3 gap-3">
                            {[1, 2].map(i => (
                              <div key={i} className="aspect-square bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-white/10">
                                <Plus size={20} />
                              </div>
                            ))}
                            <div className="aspect-square bg-primary/10 rounded-2xl border border-primary/30 flex items-center justify-center text-primary cursor-pointer hover:bg-primary/20 transition-all">
                              <Plus size={24} />
                            </div>
                          </div>
                          <Button variant="secondary" className="w-full py-3 text-[10px] uppercase font-black tracking-widest">Upload Photo</Button>
                        </div>

                        <Button variant="secondary" className="py-5 justify-center bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-400 hover:text-black uppercase font-black tracking-widest text-xs">
                          <CheckCircle2 size={18} className="mr-3" /> Mark Completed
                        </Button>

                        <button className="bg-red-500/5 text-red-400 border border-red-500/10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-black transition-all">
                          Raise an Issue
                        </button>
                      </div>
                    </Card>

                    <Card className="bg-green-500/5 p-8 border-green-500/10">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="p-2 bg-green-500/20 rounded-lg"><CheckCircle2 size={20} className="text-green-400" /></div>
                        <h4 className="font-black text-white uppercase tracking-widest text-xs">Collection Amount</h4>
                      </div>
                      <p className="text-sm text-white/40 mb-6 font-medium leading-relaxed">Amount to be collected after service completion.</p>
                      <p className="text-4xl font-black text-green-400 italic">₹{activeJob.price || '499'}</p>
                      <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                         <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">Preferred Mode</span>
                         <span className="text-[10px] text-white/60 font-black uppercase tracking-widest">UPI / Cash</span>
                      </div>
                    </Card>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
