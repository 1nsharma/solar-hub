import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function BookingModal({ isOpen, onClose, service, onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    slot: '',
    address: '',
    phone: '',
    notes: '',
    systemSource: 'SolarHub', // 'SolarHub' or 'Other'
    systemDetails: {
      kw: '',
      inverterBrand: '',
      installYear: ''
    }
  });

  if (!isOpen) return null;

  const slots = ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to book a service');
      return;
    }

    const bookingData = {
      user_id: user.id,
      service: service.title,
      price: service.price,
      ...formData,
      status: 'Confirmed',
      timeline: [
        { status: 'Confirmed', date: new Date().toLocaleString(), completed: true },
        { status: 'Technician Assigned', date: 'Pending', completed: false },
        { status: 'On the way', date: 'Pending', completed: false },
        { status: 'Completed', date: 'Pending', completed: false }
      ]
    };

    setStep(3); // Loading/Processing
    
    // Simulate API delay
    setTimeout(async () => {
      await addBooking(bookingData);
      setStep(4); // Success
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative glass-card w-full max-w-xl overflow-hidden animate-fade-in bg-bg-dark border-white/10">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-all z-10"
        >
          <X size={20} />
        </button>

        {step === 1 && (
          <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-primary/20 p-3 rounded-2xl">
                <Zap size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Book {service?.title}</h3>
                <p className="text-sm text-text-dim">Professional care for your solar system.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block mb-4 text-xs text-text-dim uppercase font-bold tracking-widest">
                  Is this a SolarHub Installation?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFormData({...formData, systemSource: 'SolarHub'})}
                    className={`py-4 px-4 rounded-xl border text-sm font-bold transition-all ${
                      formData.systemSource === 'SolarHub' 
                      ? 'bg-primary text-black border-primary' 
                      : 'bg-white/5 border-white/10 text-text-dim hover:border-primary/50'
                    }`}
                  >
                    Yes, SolarHub
                  </button>
                  <button
                    onClick={() => setFormData({...formData, systemSource: 'Other'})}
                    className={`py-4 px-4 rounded-xl border text-sm font-bold transition-all ${
                      formData.systemSource === 'Other' 
                      ? 'bg-primary text-black border-primary' 
                      : 'bg-white/5 border-white/10 text-text-dim hover:border-primary/50'
                    }`}
                  >
                    No, Other Vendor
                  </button>
                </div>
              </div>

              {formData.systemSource === 'Other' && (
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 animate-fade-in">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">System Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      placeholder="Size (e.g. 5kW)" 
                      className="bg-black/20 text-xs"
                      value={formData.systemDetails.kw}
                      onChange={(e) => setFormData({...formData, systemDetails: {...formData.systemDetails, kw: e.target.value}})}
                    />
                    <input 
                      type="text" 
                      placeholder="Inverter Brand" 
                      className="bg-black/20 text-xs"
                      value={formData.systemDetails.inverterBrand}
                      onChange={(e) => setFormData({...formData, systemDetails: {...formData.systemDetails, inverterBrand: e.target.value}})}
                    />
                  </div>
                </div>
              )}

              <button 
                onClick={() => setStep(1.5)}
                className="btn-primary w-full py-4 justify-center mt-4"
              >
                Next: Select Time <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 1.5 && (
          <div className="p-8">
            <h3 className="text-2xl font-bold mb-8">Schedule Service</h3>
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-xs text-text-dim uppercase font-bold tracking-widest flex items-center gap-2">
                  <Calendar size={14} /> Select Date
                </label>
                <input 
                  type="date" 
                  className="w-full"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block mb-2 text-xs text-text-dim uppercase font-bold tracking-widest flex items-center gap-2">
                  <Clock size={14} /> Preferred Time Slot
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {slots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setFormData({...formData, slot})}
                      className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                        formData.slot === slot 
                        ? 'bg-primary text-black border-primary' 
                        : 'bg-white/5 border-white/10 text-text-dim hover:border-primary/50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="btn-secondary flex-1 py-4 justify-center"
                >
                  Back
                </button>
                <button 
                  disabled={!formData.date || !formData.slot}
                  onClick={() => setStep(2)}
                  className="btn-primary flex-[2] py-4 justify-center disabled:opacity-50"
                >
                  Continue to Address <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="p-8">
            <h3 className="text-2xl font-bold mb-8">Delivery Details</h3>
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-xs text-text-dim uppercase font-bold tracking-widest flex items-center gap-2">
                  <MapPin size={14} /> Service Address
                </label>
                <textarea 
                  className="w-full h-24"
                  placeholder="Street, Landmark, Apartment..."
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                ></textarea>
              </div>

              <div>
                <label className="block mb-2 text-xs text-text-dim uppercase font-bold tracking-widest">Phone Number</label>
                <input 
                  type="tel" 
                  className="w-full"
                  placeholder="+91 XXXXX XXXXX"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center mb-4">
                <div>
                  <p className="text-xs text-text-dim uppercase">Amount Payable</p>
                  <p className="text-xl font-bold text-primary">₹{service?.price}</p>
                </div>
                <div className="text-right text-xs text-text-dim">
                  <p>Pay after service</p>
                  <p>UPI / Cash available</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary flex-1 py-4 justify-center"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  className="btn-primary flex-[2] py-4 justify-center"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="p-12 text-center">
            <div className="bg-secondary/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckCircle2 className="text-secondary" size={48} />
            </div>
            <h3 className="text-4xl font-bold mb-4 tracking-tighter">Booking Successful!</h3>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 inline-block mx-auto">
              <p className="text-[10px] text-text-dim uppercase font-bold tracking-widest mb-1">Ticket ID</p>
              <p className="text-xl font-mono font-bold text-primary">SRV-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
            </div>
            <p className="text-text-dim mb-8 max-w-sm mx-auto leading-relaxed">
              We've assigned your request to our technician pool. You'll receive a confirmation SMS and a call from the team shortly.
            </p>
            <div className="flex items-center justify-center gap-3 text-xs text-secondary font-bold mb-10 bg-secondary/10 py-3 rounded-xl border border-secondary/20 max-w-xs mx-auto">
              <Zap size={14} className="animate-pulse" /> Dispatching Technician...
            </div>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => { onComplete(); onClose(); }}
                className="btn-primary py-4 justify-center"
              >
                Track My Service
              </button>
              <button 
                onClick={onClose}
                className="text-text-dim hover:text-white text-sm font-bold"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
