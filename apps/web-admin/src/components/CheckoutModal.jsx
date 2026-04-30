import React, { useState, useEffect } from 'react';
import { X, MapPin, CreditCard, ChevronRight, CheckCircle2, QrCode, ShieldCheck, Zap, Info } from 'lucide-react';
import { useStore } from '../store/useStore';
import { apiUrl } from '../config/api';

const CheckoutModal = ({ isOpen, onClose, onTrack }) => {
  const { user, cart, clearCart, addOrder, addSubscription } = useStore();
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Success
  const [address, setAddress] = useState('');
  const [financeData, setFinanceData] = useState(null);
  
  const total = cart.reduce((acc, item) => {
    const price = typeof item.price === 'number' ? item.price : parseInt(item.price.replace(/,/g, ''));
    return acc + (price * item.quantity);
  }, 0);

  // Auto-calculate finance data if it's a kit
  useEffect(() => {
    if (!isOpen) return;
    const kitItem = cart.find(item => item.category === 'Kits' || item.title.includes('Kit'));
    if (kitItem) {
      // Extract size (e.g., '5kW' -> 5)
      const match = kitItem.title.match(/(\d+)\s*kW/i);
      const systemSize = match ? parseInt(match[1]) : 3;

      fetch(apiUrl('/api/finance/calculate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemSize, totalCost: total })
      })
      .then(res => res.json())
      .then(data => setFinanceData(data))
      .catch(err => console.error(err));
    } else {
      setFinanceData(null); // Simple checkout
    }
  }, [isOpen, cart, total]);

  const handlePayment = async () => {
    if (!user) {
      alert('Please login to place an order');
      return;
    }

    const customerPayable = financeData ? financeData.customerPayable : total;
    const upfrontAmount = financeData ? financeData.milestones[0].amount : total;

    // Generate Order
    const newOrder = {
      user_id: user.id,
      items: [...cart],
      total_amount: total,
      subsidy_amount: financeData ? financeData.subsidyEstimated : 0,
      emi_details: financeData ? financeData.financing : null,
      address: address,
      status: 'Processing',
      payment_status: 'partial',
      timeline: [
        { status: 'Order Placed & Advance Paid', date: new Date().toLocaleString(), completed: true },
        { status: 'Site Survey & Verification', date: 'Pending', completed: false },
        { status: 'Material Dispatch', date: 'Pending', completed: false },
        { status: 'Installation & Net Metering', date: 'Pending', completed: false },
      ]
    };

    // Check for subscriptions (AMC)
    cart.forEach(item => {
      if (item.title.toLowerCase().includes('amc') || item.title.toLowerCase().includes('maintenance')) {
        const newSub = {
          id: 'SUB-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
          title: item.title,
          expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString(),
          nextVisit: new Date(new Date().setMonth(new Date().getMonth() + 3)).toLocaleDateString(),
          status: 'Active'
        };
        addSubscription(newSub);
      }
    });

    setStep(2);
    // Simulate payment processing time
    setTimeout(async () => {
      await addOrder(newOrder);
      clearCart();
      setStep(3);
    }, 3000);
  };

  if (!isOpen) return null;

  const payableNow = financeData ? financeData.milestones[0].amount : total;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative glass-card w-full max-w-4xl overflow-hidden animate-fade-in bg-bg-dark">
        <button onClick={onClose} className="absolute top-6 right-6 text-text-dim hover:text-white z-10">
          <X size={24} />
        </button>

        {step === 1 && (
          <div className="p-8 flex flex-col md:flex-row gap-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl tracking-tighter font-bold">Secure <span className="text-primary">Checkout</span></h2>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-text-dim mb-3 flex items-center gap-2">
                  <MapPin size={14} className="text-primary" /> Installation Address
                </label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-primary outline-none"
                  placeholder="Where should we deliver and install?"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
              </div>

              {financeData && (
                <div className="glass-card bg-primary/5 p-6 border-primary/20">
                  <h4 className="font-bold mb-4 flex items-center gap-2 text-primary">
                    <ShieldCheck size={18} /> SolarHub Trust Engine
                  </h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-xs text-text-dim uppercase font-bold tracking-widest">MNRE Subsidy</p>
                      <p className="text-xl font-bold text-green-400">₹{financeData.subsidyEstimated.toLocaleString()}</p>
                      <p className="text-[10px] text-text-dim mt-1">Deducted from total</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-xs text-text-dim uppercase font-bold tracking-widest">Pre-approved EMI</p>
                      <p className="text-xl font-bold text-secondary">₹{financeData.financing.emiEstimated.toLocaleString()}<span className="text-sm font-normal">/mo</span></p>
                      <p className="text-[10px] text-text-dim mt-1">For {financeData.financing.tenureMonths} months</p>
                    </div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-xs text-text-dim flex gap-2 items-start">
                    <Info size={16} className="text-primary shrink-0" />
                    <p>SolarHub Escrow Protection: Your money is held in an escrow account and released to the vendor only upon successful completion of each milestone.</p>
                  </div>
                </div>
              )}
              
              <div className="glass-card bg-white/[0.03] p-6 border-white/5">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <CreditCard size={18} className="text-primary" /> Payment Method
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/50 cursor-pointer group hover:bg-primary/10 transition-all">
                    <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">UPI Payment</p>
                      <p className="text-[10px] text-text-dim uppercase tracking-tighter">PhonePe, Google Pay, BHIM</p>
                    </div>
                    <QrCode size={24} className="text-primary group-hover:scale-110 transition-transform" />
                  </label>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 opacity-50 flex items-center gap-4 grayscale">
                    <div className="w-6 h-6 rounded-full border-2 border-white/20"></div>
                    <div className="flex-1">
                      <p className="font-bold">Apply for Finance (NBFC)</p>
                      <p className="text-[10px] text-text-dim uppercase tracking-tighter">Requires KYC</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-[0.8] flex flex-col">
              <div className="glass-card bg-white/[0.03] p-8 border-white/5 flex-1 flex flex-col mb-6">
                <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-text-dim">Order Summary</h4>
                <div className="flex-1 space-y-5 overflow-y-auto max-h-56 mb-6 pr-2 custom-scrollbar">
                  {cart.map(item => {
                    const itemPrice = typeof item.price === 'number' ? item.price : parseInt(item.price.replace(/,/g, ''));
                    return (
                      <div key={item.id} className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm leading-tight">{item.title}</p>
                          <p className="text-[10px] text-text-dim mt-1">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-bold text-sm">₹{(itemPrice * item.quantity).toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="pt-6 border-t border-white/10 space-y-3">
                  <div className="flex justify-between text-xs text-text-dim font-bold">
                    <span>Total System Cost</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  {financeData && (
                    <div className="flex justify-between text-xs text-green-400 font-bold">
                      <span>Govt. Subsidy</span>
                      <span>- ₹{financeData.subsidyEstimated.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end pt-4 mt-2 border-t border-white/5">
                    <div>
                      <span className="text-sm font-bold text-white block">Payable Now</span>
                      {financeData && <span className="text-[10px] text-text-dim">Booking Advance (10%)</span>}
                    </div>
                    <span className="text-3xl font-extrabold text-primary tracking-tighter">₹{payableNow.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={handlePayment}
                disabled={!address}
                className="btn-primary w-full py-5 justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pay Advance <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-16 text-center">
            <div className="relative w-48 h-48 mx-auto mb-10">
              <div className="absolute inset-0 bg-primary/20 blur-[60px] animate-pulse"></div>
              <div className="relative glass-card p-4 border-primary/50 bg-white shadow-2xl rotate-3 hover:rotate-0 transition-transform">
                <QrCode size={144} className="text-black" />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black px-4 py-1 rounded-full border border-primary/50 flex items-center gap-2 whitespace-nowrap">
                <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Waiting for Escrow Payment...</span>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-4 tracking-tighter">Scan & Pay Advance <span className="text-primary">₹{payableNow.toLocaleString()}</span></h2>
            <p className="text-text-dim max-w-sm mx-auto leading-relaxed mb-8">
              Open any UPI app like PhonePe, GPay, or Paytm. Your funds are protected by SolarHub Escrow.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="p-16 text-center animate-fade-in">
            <div className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-secondary/10 blur-2xl animate-pulse"></div>
              <CheckCircle2 size={48} className="text-secondary relative z-10" />
            </div>
            <h2 className="text-5xl font-extrabold mb-4 tracking-tighter">Booking Confirmed!</h2>
            <p className="text-text-dim text-lg mb-10 max-w-md mx-auto leading-relaxed">
              Your advance payment is secured in Escrow. The next step is <span className="text-white font-bold">Site Survey & Verification</span>. We will contact you within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={onClose} className="btn-secondary px-10 py-4 font-bold">Back to Marketplace</button>
              <button 
                onClick={() => { onClose(); onTrack(); }}
                className="btn-primary px-10 py-4 font-bold"
              >
                Go to Solar Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CheckoutModal;
