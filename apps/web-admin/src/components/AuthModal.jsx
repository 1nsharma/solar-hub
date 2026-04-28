import React, { useState } from 'react';
import { X, Phone, ShieldCheck, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function AuthModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const setUser = useStore((state) => state.setUser);

  if (!isOpen) return null;

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (phone.length === 10) {
      setStep(2);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        onClose();
      } else {
        alert(data.message || 'Invalid OTP. Hint: 1234');
      }
    } catch (err) {
      console.error('Auth error:', err);
      // Fallback for dev
      if (otp === '1234') {
        setUser({ name: 'Dev User', phone: phone, role: 'customer' });
        onClose();
      }
    }
  };


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="glass-card relative w-full max-w-md p-8 animate-fade-in border-primary/20">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-dim hover:text-white">
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-primary" size={32} />
          </div>
          <h2 className="text-2xl font-bold">Welcome to SolarHub</h2>
          <p className="text-text-dim mt-2">
            {step === 1 ? 'Enter your phone number to continue' : 'Enter the 4-digit OTP sent to your phone'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label className="block text-sm text-text-dim mb-2">Phone Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim font-bold">+91</span>
                <input 
                  type="tel" 
                  autoFocus
                  maxLength={10}
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-14 pr-4 focus:border-primary outline-none text-lg tracking-widest"
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={phone.length !== 10}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Get OTP <ChevronRight size={20} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-sm text-text-dim mb-2">OTP (Mock: 1234)</label>
              <input 
                type="text" 
                autoFocus
                maxLength={4}
                placeholder="0000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 focus:border-primary outline-none text-center text-3xl tracking-[1rem]"
              />
            </div>
            <button 
              type="submit" 
              disabled={otp.length !== 4}
              className="btn-primary w-full py-4 disabled:opacity-50"
            >
              Verify & Login
            </button>
            <button 
              type="button" 
              onClick={() => setStep(1)}
              className="w-full text-text-dim text-sm hover:text-primary"
            >
              Change Phone Number
            </button>
          </form>
        )}

        <p className="text-center text-xs text-text-dim mt-8">
          By continuing, you agree to SolarHub's <br />
          <span className="text-primary cursor-pointer">Terms of Service</span> & <span className="text-primary cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
