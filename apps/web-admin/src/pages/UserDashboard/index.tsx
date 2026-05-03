import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, Clock, MapPin, ChevronRight, ArrowLeft, Sun, Zap, Wrench, ShieldCheck, Star, Trophy } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Card, Button, StatusBadge } from '@solar-hub/ui';
// @ts-ignore
import { generateSprintNudge, defaultUserPsyche } from '@solar-hub/shared';

export default function UserDashboard({ onBack }: { onBack: () => void }) {
  const { user, orders, subscriptions, bookings } = useStore();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'bookings', 'subscriptions', or 'systems'
  const [nudge, setNudge] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Customer Profile: Gamification & Rewards
    const profile = {
      ...defaultUserPsyche,
      tendencies: ['GAMIFICATION_DRIVEN']
    };
    
    // Virtual Tasks for Customer
    const userTasks = [
      { id: 1, title: "Upload this month's electricity bill to unlock 500 Watts of virtual energy." },
      { id: 2, title: "Book annual maintenance to extend warranty." }
    ];

    const nextNudge = generateSprintNudge(userTasks, profile);
    setNudge(nextNudge);
  }, []);

  const handleClaimBadge = () => {
    setShowConfetti(true);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const renderTimeline = (item: any) => {
    const timeline = item.timeline || [
      { status: 'Order Placed', date: item.date, completed: true },
      { status: 'Processing', date: 'In progress', completed: true },
      { status: 'Shipped', date: 'Tomorrow', completed: false },
      { status: 'Delivered', date: 'Estimated 2 days', completed: false }
    ];

    return (
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/5"></div>
        <div className="space-y-12 relative z-10">
          {timeline.map((step: any, idx: number) => (
            <div key={idx} className="flex gap-8 items-start">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                step.completed ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/30'
              }`}>
                {step.completed ? <CheckCircle2 size={16} /> : <Clock size={16} />}
              </div>
              <div>
                <h4 className={`font-black uppercase tracking-widest text-xs ${step.completed ? 'text-white' : 'text-white/30'}`}>
                  {step.status}
                </h4>
                <p className="text-sm text-white/40 font-medium mt-1">{step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 text-white px-6">
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <button onClick={onBack} className="text-primary mb-4 flex items-center gap-2 hover:gap-3 transition-all font-bold text-sm uppercase tracking-widest text-[#FFD700]">
              <ArrowLeft size={18} /> Back to Home
            </button>
            <h1 className="text-5xl font-black tracking-tighter">My <span className="text-primary italic">Solar Journey</span></h1>
            <p className="text-white/40 text-lg mt-2 font-medium">Manage your products, services, and energy savings.</p>
          </div>
          
          <div className="flex gap-2 bg-white/5 p-1.5 rounded-[20px] border border-white/10 overflow-x-auto no-scrollbar w-full md:w-auto">
            {['orders', 'bookings', 'subscriptions', 'systems'].map(tab => (
              <button 
                key={tab}
                onClick={() => { setActiveTab(tab); setSelectedItem(null); }}
                className={`px-6 py-2.5 rounded-xl font-black transition-all capitalize whitespace-nowrap text-xs tracking-widest ${
                  activeTab === tab ? 'bg-primary text-black shadow-lg' : 'text-white/30 hover:text-white'
                }`}
              >
                {tab === 'systems' ? 'My Systems' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* 🧠 Behavioral Nudge Engine Gamification Widget */}
        {nudge && (
          <div className={`mb-8 animate-in slide-in-from-top-8 fade-in duration-1000 ${showConfetti ? 'scale-105 transition-transform' : ''}`}>
            <Card className="relative overflow-hidden p-6 border-purple-500/40 bg-gradient-to-r from-purple-500/10 via-[#050505] to-transparent shadow-[0_0_40px_rgba(168,85,247,0.1)] group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center animate-pulse">
                    <Trophy className="text-purple-400" size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      Eco-Warrior Challenge <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px] uppercase tracking-widest">Daily Quest</span>
                    </h3>
                    <p className="text-white/70 text-sm font-medium mt-1 max-w-xl leading-relaxed">
                      {nudge.message.replace('tasks right now', 'eco-actions today')}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleClaimBadge}
                  className="shrink-0 px-8 py-4 rounded-xl bg-purple-500 text-white font-black uppercase tracking-widest text-sm flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                >
                  {nudge.actionButton} <Star fill="currentColor" size={16} />
                </button>
              </div>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-10">
          {/* List Section */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3 mb-6 text-white/60">
              {activeTab === 'orders' ? <Package className="text-primary" size={20} /> : 
               activeTab === 'bookings' ? <Wrench className="text-primary" size={20} /> : 
               <Sun className="text-primary" size={20} />}
              {activeTab === 'orders' ? 'Active Orders' : 
               activeTab === 'bookings' ? 'Service Bookings' : 
               'AMC Plans'}
            </h3>
            
            {activeTab === 'orders' && (
              orders.length === 0 ? (
                <EmptyState icon={<Package size={48} />} text="No orders yet." onAction={onBack} actionText="Start Shopping" />
              ) : (
                orders.map((order: any) => (
                  <ItemCard 
                    key={order.id}
                    id={order.id}
                    title={order.items.map((i: any) => i.title).join(', ')}
                    date={order.date}
                    status={order.status}
                    amount={`₹${order.total.toLocaleString()}`}
                    isSelected={selectedItem?.id === order.id}
                    onClick={() => setSelectedItem(order)}
                  />
                ))
              )
            )}

            {activeTab === 'bookings' && (
              bookings.length === 0 ? (
                <EmptyState icon={<Wrench size={48} />} text="No bookings found." onAction={onBack} actionText="Book a Service" />
              ) : (
                bookings.map((booking: any) => (
                  <ItemCard 
                    key={booking.id}
                    id={booking.id}
                    title={booking.service}
                    date={`${booking.date} @ ${booking.slot}`}
                    status={booking.status}
                    amount={`₹${booking.price}`}
                    isSelected={selectedItem?.id === booking.id}
                    onClick={() => setSelectedItem(booking)}
                    isService
                  />
                ))
              )
            )}

            {activeTab === 'systems' && (
              <div className="space-y-6">
                <Card className="p-8 border-l-4 border-primary bg-primary/5">
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="font-black flex items-center gap-3 text-lg"><Sun size={20} className="text-primary" /> Main Rooftop</h4>
                    <StatusBadge status="ACTIVE" className="bg-primary/10 text-primary border-primary/20" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs mb-8">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-white/30 uppercase font-black tracking-widest mb-2 text-[10px]">Capacity</p>
                      <p className="font-black text-xl">5 kW</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-white/30 uppercase font-black tracking-widest mb-2 text-[10px]">Efficiency</p>
                      <p className="font-black text-xl text-green-400">98%</p>
                    </div>
                  </div>
                  <Button variant="primary" className="w-full py-4 text-xs justify-center uppercase tracking-widest" onClick={() => setSelectedItem({ id: 'SYS-001', type: 'SolarHub' })}>
                    View Performance
                  </Button>
                </Card>

                <Card className="p-8 border-l-4 border-white/10 bg-white/[0.01] border-dashed">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-black flex items-center gap-3 text-white/40"><Sun size={20} /> Add System</h4>
                  </div>
                  <p className="text-sm text-white/30 mb-8 font-medium leading-relaxed">Import details of your solar system installed by other vendors to get service alerts.</p>
                  <Button variant="outline" className="w-full py-4 text-xs justify-center border-dashed uppercase tracking-widest">
                    Add Existing System
                  </Button>
                </Card>
              </div>
            )}
          </div>


          {/* Tracking Details */}
          <div className="lg:col-span-2">
            {!selectedItem ? (
              <Card className="h-full flex flex-col items-center justify-center p-20 text-center bg-white/[0.01] border-dashed min-h-[500px]">
                <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mb-8 border border-white/10">
                   <Truck size={48} className="text-white/10" />
                </div>
                <h3 className="text-3xl font-black mb-3 text-white">Track Your Progress</h3>
                <p className="text-white/40 max-w-sm font-medium leading-relaxed">Select an item from the list to see real-time status and partner details.</p>
              </Card>
            ) : (
              <Card className="p-10 animate-in fade-in slide-in-from-right-4 duration-700 bg-white/[0.02] border-white/5">
                <div className="flex flex-col md:flex-row justify-between gap-8 mb-12 border-b border-white/5 pb-10">
                  {selectedItem.type === 'SolarHub' ? (
                    <div className="w-full">
                      <div className="flex items-center gap-3 mb-4">
                        <StatusBadge status="ACTIVE SYSTEM" className="bg-primary/20 text-primary border-primary/20 px-4 py-1.5" />
                        <span className="text-white/30 text-xs font-black uppercase tracking-widest">• Last sync: 2 mins ago</span>
                      </div>
                      <h3 className="text-4xl font-black mb-10 text-white tracking-tighter">System Health & Savings</h3>
                      
                      <div className="grid md:grid-cols-3 gap-8">
                        <Card className="bg-white/5 p-6 border-white/10 group">
                          <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-3">Today's Generation</p>
                          <p className="text-4xl font-black text-primary">24.5 <span className="text-sm italic">kWh</span></p>
                          <div className="mt-6 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[80%] shadow-[0_0_10px_rgba(255,215,0,0.5)]"></div>
                          </div>
                        </Card>
                        <Card className="bg-white/5 p-6 border-white/10 group">
                          <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-3">Total Savings</p>
                          <p className="text-4xl font-black text-green-400 italic">₹14,200</p>
                          <p className="text-[10px] text-green-400 mt-3 font-black uppercase tracking-widest">↑ 12% from last month</p>
                        </Card>
                        <Card className="bg-white/5 p-6 border-white/10 group">
                          <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-3">Carbon Offset</p>
                          <p className="text-4xl font-black text-blue-400">1.2 <span className="text-sm italic">Tons</span></p>
                          <p className="text-[10px] text-white/30 mt-3 font-black italic tracking-widest">Equivalent to 60 trees</p>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <StatusBadge status={selectedItem.id} className="bg-primary/20 text-primary border-primary/20" />
                          <span className="text-white/30 text-xs font-black uppercase tracking-widest">• {selectedItem.date}</span>
                        </div>
                        <h3 className="text-4xl font-black mb-6 text-white tracking-tighter">{selectedItem.items ? 'Order Details' : selectedItem.service}</h3>
                        <p className="text-white/50 flex items-center gap-2 font-medium"><MapPin size={18} className="text-primary" /> {selectedItem.address}</p>
                      </div>
                      <div className="md:text-right">
                        <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-2">Current Status</p>
                        <StatusBadge status={selectedItem.status} className="text-lg px-6 py-2" />
                        <p className="text-xs text-white/30 mt-6 font-black uppercase tracking-widest">Estimated {activeTab === 'bookings' ? 'Arrival' : 'Delivery'}</p>
                        <p className="font-black text-white mt-1">Tomorrow, 10:00 AM - 01:00 PM</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-16">
                  <div>
                    <h4 className="text-sm font-black mb-10 flex items-center gap-3 uppercase tracking-[0.2em] text-white/40"><Clock size={18} className="text-primary" /> Milestone Tracker</h4>
                    {renderTimeline(selectedItem)}
                  </div>
                  
                  <div className="space-y-10">
                    <Card className="bg-white/5 p-8 border-white/10">
                      <h4 className="font-black mb-6 flex items-center gap-3 text-xs uppercase tracking-widest text-white/60"><Zap size={18} className="text-primary" /> Partner Details</h4>
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                          {activeTab === 'bookings' ? <Wrench size={28} className="text-primary" /> : <Truck size={28} className="text-primary" />}
                        </div>
                        <div>
                          <p className="font-black text-xl text-white">{activeTab === 'bookings' ? 'Technician Assigned' : 'Delivery Partner'}</p>
                          <p className="text-sm text-white/40 mt-1 font-medium">{activeTab === 'bookings' ? 'Amit Sharma (+91 98XXX XXXXX)' : 'Delhivery (Tracking: SOL4593)'}</p>
                        </div>
                      </div>
                      <Button variant="secondary" className="w-full mt-8 py-4 text-xs font-black uppercase tracking-widest">Contact Partner</Button>
                    </Card>

                    <Card className="bg-white/5 p-8 border-white/10">
                      <h4 className="font-black mb-4 flex items-center gap-3 text-xs uppercase tracking-widest text-white/60"><ShieldCheck size={18} className="text-green-400" /> Need Help?</h4>
                      <p className="text-sm text-white/40 mb-6 font-medium leading-relaxed">Facing issues with your {activeTab === 'bookings' ? 'service' : 'delivery'}? Our support team is available 24/7.</p>
                      <button className="text-primary text-xs font-black uppercase tracking-[0.2em] hover:underline">Chat with Support →</button>
                    </Card>
                  </div>
                </div>

                {/* Personalized Features */}
                <div className="mt-16 pt-10 border-t border-white/5">
                  <Card className="bg-green-500/5 border-green-500/10 p-8 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex gap-6 items-center">
                      <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/20"><Sun size={32} className="text-green-400" /></div>
                      <div>
                        <h4 className="font-black text-xl text-white">Personalized Solar Insights</h4>
                        <p className="text-sm text-white/40 mt-1 font-medium">Upload your last 3 monthly electricity bills for accurate savings projection.</p>
                      </div>
                    </div>
                    <Button variant="outline" className="py-4 px-10 text-xs font-black uppercase tracking-widest whitespace-nowrap border-green-500/30 text-green-400 hover:bg-green-400 hover:text-black transition-all">
                      Upload Bill (Optional)
                    </Button>
                  </Card>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemCard({ id, title, date, status, amount, isSelected, onClick, isService }: any) {
  return (
    <Card 
      onClick={onClick}
      className={`p-8 cursor-pointer border-l-4 transition-all relative overflow-hidden group ${
        isSelected ? 'border-primary bg-white/5' : 'border-transparent hover:bg-white/[0.03]'
      }`}
    >
      {isSelected && <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:bg-primary/10"></div>}
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">{id}</p>
          <h4 className="font-black text-xl text-white leading-tight line-clamp-1 group-hover:text-primary transition-colors">{title}</h4>
        </div>
        <StatusBadge status={status} className={status === 'Confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''} />
      </div>
      
      <p className="text-xs text-white/40 mb-6 font-medium">{date}</p>
      
      <div className="flex justify-between items-center mt-2 pt-6 border-t border-white/5 relative z-10">
        <span className="text-2xl font-black text-white">{amount}</span>
        <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
          Details <ChevronRight size={16} />
        </div>
      </div>
    </Card>
  );
}

function EmptyState({ icon, text, onAction, actionText }: any) {
  return (
    <Card className="p-16 text-center bg-white/[0.01] border-dashed border-white/10">
      <div className="text-white/10 mb-6 flex justify-center">{icon}</div>
      <p className="text-white/40 mb-8 font-medium">{text}</p>
      <button onClick={onAction} className="text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:underline flex items-center justify-center gap-3 mx-auto group">
        {actionText} <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </Card>
  );
}
