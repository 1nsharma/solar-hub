import React, { useState } from 'react';
import { X, MapPin, CreditCard, ChevronRight, CheckCircle2, QrCode, ShieldCheck, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';

const CheckoutModal = ({ isOpen, onClose, onTrack }) => {
  const { user, cart, clearCart, addOrder, addSubscription } = useStore();
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Success
  const [address, setAddress] = useState('');
  
  const total = cart.reduce((acc, item) => {
    const price = typeof item.price === 'number' ? item.price : parseInt(item.price.replace(/,/g, ''));
    return acc + (price * item.quantity);
  }, 0);

  const handlePayment = async () => {
    if (!user) {
      alert('Please login to place an order');
      return;
    }

    // Generate Order
    const newOrder = {
      user_id: user.id,
      items: [...cart],
      total: total,
      address: address,
      status: 'Processing',
      timeline: [
        { status: 'Order Placed', date: new Date().toLocaleString(), completed: true },
        { status: 'Technician Assigned', date: 'Pending', completed: false },
        { status: 'Out for Delivery', date: 'Pending', completed: false },
        { status: 'Completed', date: 'Pending', completed: false },
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative glass-card w-full max-w-2xl overflow-hidden animate-fade-in">
        <button onClick={onClose} className="absolute top-6 right-6 text-text-dim hover:text-white">
          <X size={24} />
        </button>

        {step === 1 && (
          <div className="p-8">
            <h2 className="text-3xl mb-8 tracking-tighter font-bold">Secure <span className="text-primary">Checkout</span></h2>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-text-dim mb-3 flex items-center gap-2">
                    <MapPin size={14} className="text-primary" /> Installation Address
                  </label>
                  <textarea 
                    className="w-full"
                    placeholder="Where should we deliver and install?"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></textarea>
                </div>
                
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
                        <p className="font-bold">Cards / Net Banking</p>
                        <p className="text-[10px] text-text-dim uppercase tracking-tighter">Under Maintenance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
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
                    <div className="flex justify-between text-xs text-text-dim uppercase font-bold tracking-tighter">
                      <span>Logistics & Handling</span>
                      <span className="text-secondary">FREE</span>
                    </div>
                    <div className="flex justify-between items-end pt-2">
                      <span className="text-sm font-bold">Payable Amount</span>
                      <span className="text-3xl font-extrabold text-primary tracking-tighter">₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handlePayment}
                  disabled={!address}
                  className="btn-primary w-full py-5 justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Pay with UPI Intent <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
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
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Waiting for Payment...</span>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-4 tracking-tighter">Scan & Pay <span className="text-primary">₹{total.toLocaleString()}</span></h2>
            <p className="text-text-dim max-w-sm mx-auto leading-relaxed mb-8">
              Open any UPI app like PhonePe, GPay, or Paytm and scan the QR code to complete your solar purchase.
            </p>
            
            <div className="flex items-center justify-center gap-4 text-xs text-text-dim">
              <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-secondary" /> 256-bit Secure</span>
              <span className="w-1 h-1 bg-white/20 rounded-full"></span>
              <span className="flex items-center gap-1"><Zap size={14} className="text-primary" /> Instant Confirmation</span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-16 text-center animate-fade-in">
            <div className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-secondary/10 blur-2xl animate-pulse"></div>
              <CheckCircle2 size={48} className="text-secondary relative z-10" />
            </div>
            <h2 className="text-5xl font-extrabold mb-4 tracking-tighter">Success!</h2>
            <p className="text-text-dim text-lg mb-10 max-w-md mx-auto leading-relaxed">
              Your order has been placed successfully. A technician will visit your site for inspection within <span className="text-white font-bold">24 hours</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={onClose} className="btn-secondary px-10 py-4 font-bold">Browse More</button>
              <button 
                onClick={() => { onClose(); onTrack(); }}
                className="btn-primary px-10 py-4 font-bold"
              >
                Track My Solar
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CheckoutModal;
