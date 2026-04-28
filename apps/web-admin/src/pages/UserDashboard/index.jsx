import React, { useState } from 'react';
import { Package, Truck, CheckCircle2, Clock, MapPin, ChevronRight, ArrowLeft, Sun, Zap, Wrench, ShieldCheck, Star } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function UserDashboard({ onBack }) {
  const { user, orders, subscriptions, bookings } = useStore();
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'bookings', 'subscriptions', or 'systems'

  const renderTimeline = (item) => {
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
          {timeline.map((step, idx) => (
            <div key={idx} className="flex gap-8 items-start">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                step.completed ? 'bg-secondary text-black' : 'bg-white/10 text-text-dim'
              }`}>
                {step.completed ? <CheckCircle2 size={16} /> : <Clock size={16} />}
              </div>
              <div>
                <h4 className={`font-bold ${step.completed ? 'text-white' : 'text-text-dim'}`}>
                  {step.status}
                </h4>
                <p className="text-sm text-text-dim">{step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-bg-dark pt-32 pb-20">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <button onClick={onBack} className="text-primary mb-4 flex items-center gap-2 hover:gap-3 transition-all font-bold">
              <ArrowLeft size={18} /> Back to Home
            </button>
            <h1 className="text-5xl font-bold tracking-tighter">My <span className="text-primary">Solar Journey</span></h1>
            <p className="text-text-dim text-lg mt-2">Manage your products, services, and energy savings.</p>
          </div>
          
          <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar w-full md:w-auto">
            {['orders', 'bookings', 'subscriptions', 'systems'].map(tab => (
              <button 
                key={tab}
                onClick={() => { setActiveTab(tab); setSelectedItem(null); }}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all capitalize whitespace-nowrap ${
                  activeTab === tab ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-text-dim hover:text-white'
                }`}
              >
                {tab === 'systems' ? 'My Systems' : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* List Section */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
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
                orders.map(order => (
                  <ItemCard 
                    key={order.id}
                    id={order.id}
                    title={order.items.map(i => i.title).join(', ')}
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
                bookings.map(booking => (
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
                <div className="glass-card p-6 border-l-4 border-primary bg-primary/5">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold flex items-center gap-2"><Sun size={18} className="text-primary" /> Main Rooftop</h4>
                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase">SolarHub Install</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs mb-6">
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p className="text-text-dim mb-1">Capacity</p>
                      <p className="font-bold">5 kW</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p className="text-text-dim mb-1">Efficiency</p>
                      <p className="font-bold text-secondary">98%</p>
                    </div>
                  </div>
                  <button className="w-full btn-primary py-3 text-xs justify-center" onClick={() => setSelectedItem({ id: 'SYS-001', type: 'SolarHub' })}>View Performance</button>
                </div>

                <div className="glass-card p-6 border-l-4 border-white/20 bg-white/[0.02] border-dashed">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold flex items-center gap-2 text-text-dim"><Sun size={18} /> Add System</h4>
                  </div>
                  <p className="text-xs text-text-dim mb-6">Import details of your solar system installed by other vendors to get service alerts.</p>
                  <button className="w-full btn-secondary py-3 text-xs justify-center border-dashed">Add Existing System</button>
                </div>
              </div>
            )}
          </div>


          {/* Tracking Details */}
          <div className="lg:col-span-2">
            {!selectedItem ? (
              <div className="glass-card h-full flex flex-col items-center justify-center p-20 text-center bg-white/[0.01] border-dashed">
                <Truck size={64} className="mb-6 text-white/10" />
                <h3 className="text-2xl font-bold mb-2">Track Your Progress</h3>
                <p className="text-text-dim max-w-sm">Select an item from the list to see real-time status and partner details.</p>
              </div>
            ) : (
              <div className="glass-card p-10 animate-fade-in bg-white/[0.03]">
                <div className="flex flex-col md:flex-row justify-between gap-8 mb-12 border-b border-white/5 pb-8">
                  {selectedItem.type === 'SolarHub' ? (
                    <div className="w-full">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-primary/20 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Active System</span>
                        <span className="text-text-dim text-sm">• Last sync: 2 mins ago</span>
                      </div>
                      <h3 className="text-3xl font-bold mb-8">System Health & Savings</h3>
                      
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                          <p className="text-xs text-text-dim uppercase font-bold mb-2">Today's Generation</p>
                          <p className="text-4xl font-bold text-primary">24.5 <span className="text-sm">kWh</span></p>
                          <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[80%]"></div>
                          </div>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                          <p className="text-xs text-text-dim uppercase font-bold mb-2">Total Savings</p>
                          <p className="text-4xl font-bold text-secondary">₹14,200</p>
                          <p className="text-xs text-secondary mt-2 font-bold">↑ 12% from last month</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                          <p className="text-xs text-text-dim uppercase font-bold mb-2">Carbon Offset</p>
                          <p className="text-4xl font-bold text-green-400">1.2 <span className="text-sm">Tons</span></p>
                          <p className="text-xs text-text-dim mt-2 italic">Equivalent to 60 trees</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-primary/20 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{selectedItem.id}</span>
                          <span className="text-text-dim text-sm">• {selectedItem.date}</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-4">{selectedItem.items ? 'Order Details' : selectedItem.service}</h3>
                        <p className="text-text-dim flex items-center gap-2"><MapPin size={18} className="text-primary" /> {selectedItem.address}</p>
                      </div>
                      <div className="md:text-right">
                        <p className="text-xs text-text-dim uppercase font-bold tracking-widest mb-1">Status</p>
                        <p className="text-2xl font-bold text-secondary uppercase">{selectedItem.status}</p>
                        <p className="text-sm text-text-dim mt-4">Estimated {activeTab === 'bookings' ? 'Arrival' : 'Delivery'}</p>
                        <p className="font-bold text-white">Tomorrow, 10:00 AM - 01:00 PM</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-lg font-bold mb-8 flex items-center gap-2"><Clock size={20} className="text-primary" /> Timeline</h4>
                    {renderTimeline(selectedItem)}
                  </div>
                  
                  <div className="space-y-8">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                      <h4 className="font-bold mb-4 flex items-center gap-2"><Zap size={18} className="text-primary" /> Partner Details</h4>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center">
                          {activeTab === 'bookings' ? <Wrench size={24} className="text-primary" /> : <Truck size={24} className="text-primary" />}
                        </div>
                        <div>
                          <p className="font-bold text-lg">{activeTab === 'bookings' ? 'Technician Assigned' : 'Delivery Partner'}</p>
                          <p className="text-sm text-text-dim">{activeTab === 'bookings' ? 'Amit Sharma (+91 98XXX XXXXX)' : 'Delhivery (Tracking: SOL4593)'}</p>
                        </div>
                      </div>
                      <button className="w-full btn-secondary mt-6 py-3 text-sm justify-center">Contact Partner</button>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                      <h4 className="font-bold mb-4 flex items-center gap-2"><ShieldCheck size={18} className="text-secondary" /> Need Help?</h4>
                      <p className="text-sm text-text-dim mb-4">Facing issues with your {activeTab === 'bookings' ? 'service' : 'delivery'}? Our support team is available 24/7.</p>
                      <button className="text-primary text-sm font-bold hover:underline">Chat with Support →</button>
                    </div>

                    {selectedItem.status === 'Completed' && (
                      <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
                        <h4 className="font-bold mb-2">Rate Your Experience</h4>
                        <p className="text-xs text-text-dim mb-4">Help us improve by rating the {activeTab === 'bookings' ? 'technician' : 'product'}.</p>
                        <div className="flex gap-2 mb-4">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button key={star} className="text-white/20 hover:text-yellow-500 transition-colors">
                              <Star size={24} fill="currentColor" />
                            </button>
                          ))}
                        </div>
                        <textarea className="w-full text-xs p-3" placeholder="Leave a review..."></textarea>
                        <button className="btn-primary w-full mt-4 py-2 text-xs">Submit Review</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Personalized Features */}
                <div className="mt-12 pt-8 border-t border-white/5">
                  <div className="glass-card bg-secondary/5 border-secondary/20 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex gap-4 items-center">
                      <div className="p-3 bg-secondary/10 rounded-xl"><Sun size={24} className="text-secondary" /></div>
                      <div>
                        <h4 className="font-bold">Personalized Solar Insights</h4>
                        <p className="text-xs text-text-dim">Upload your last 3 monthly electricity bills for accurate savings projection.</p>
                      </div>
                    </div>
                    <button className="btn-secondary py-3 px-8 text-xs font-bold whitespace-nowrap">Upload Electricity Bill (Optional)</button>
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

function ItemCard({ id, title, date, status, amount, isSelected, onClick, isService }) {
  return (
    <div 
      onClick={onClick}
      className={`glass-card p-6 cursor-pointer border-l-4 transition-all relative overflow-hidden ${
        isSelected ? 'border-primary bg-white/10' : 'border-transparent hover:bg-white/[0.04]'
      }`}
    >
      {isSelected && <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-8 -mt-8"></div>}
      
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-1">{id}</p>
          <h4 className="font-bold text-lg leading-tight line-clamp-1">{title}</h4>
        </div>
        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
          status === 'Confirmed' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
        }`}>
          {status}
        </span>
      </div>
      
      <p className="text-xs text-text-dim mb-4">{date}</p>
      
      <div className="flex justify-between items-center mt-2 pt-4 border-t border-white/5">
        <span className="text-lg font-bold">{amount}</span>
        <div className="flex items-center gap-1 text-primary text-xs font-bold uppercase tracking-widest">
          Details <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, text, onAction, actionText }) {
  return (
    <div className="glass-card p-12 text-center bg-white/[0.02] border-dashed border-white/5">
      <div className="text-white/20 mb-4 flex justify-center">{icon}</div>
      <p className="text-text-dim mb-6">{text}</p>
      <button onClick={onAction} className="text-primary text-sm font-bold hover:underline flex items-center justify-center gap-1 mx-auto">
        {actionText} <ChevronRight size={16} />
      </button>
    </div>
  );
}
