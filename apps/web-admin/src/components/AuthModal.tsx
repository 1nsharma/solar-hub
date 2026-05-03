import React, { useState } from 'react';
import { X, Phone, ShieldCheck, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { apiUrl } from '../config/api';
import { Card, Button, Input } from '@solar-hub/ui';

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const setUser = useStore((state) => state.setUser);

  if (!isOpen) return null;

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) {
      setStep(2);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(apiUrl('/api/auth/verify-otp'), {
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
        setUser({ id: 'u1', name: 'Dev User', phone: phone, role: 'customer' });
        onClose();
      }
    }
  };


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      
      <Card className="relative w-full max-w-lg p-12 bg-[#0a0a0a] border-white/10 animate-in zoom-in-95 duration-500 shadow-[0_0_100px_rgba(0,0,0,1)]">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-2xl transition-all border border-white/5">
          <X size={24} className="text-white/20 hover:text-red-400" />
        </button>

        <div className="text-center mb-12">
          <div className="bg-primary/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(255,215,0,0.25)] border border-primary/30">
            <ShieldCheck className="text-primary" size={40} />
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-white">Welcome to <span className="text-primary italic">SolarHub</span></h2>
          <p className="text-white/30 mt-2 font-black uppercase tracking-[0.2em] text-[10px]">
            {step === 1 ? 'Neural link authentication required' : 'Enter the 4-digit authorization code'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">PHONE UPLINK</label>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-black tracking-tighter text-xl italic">+91</span>
                <input 
                  type="tel" 
                  autoFocus
                  maxLength={10}
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white/5 border border-white/10 rounded-[24px] py-6 pl-16 pr-6 focus:border-primary outline-none text-2xl font-black tracking-widest text-white transition-all group-hover:border-white/20"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={phone.length !== 10}
              variant="primary"
              className="w-full py-6 rounded-3xl font-black text-lg shadow-[0_0_50px_rgba(255,215,0,0.15)] disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest italic"
            >
              Get Authorization <ChevronRight size={24} className="inline ml-2" />
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1 text-center block">AUTH CODE (MOCK: 1234)</label>
              <input 
                type="text" 
                autoFocus
                maxLength={4}
                placeholder="0000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-white/5 border border-white/10 rounded-[24px] py-8 px-4 focus:border-primary outline-none text-center text-5xl font-black tracking-[2rem] text-primary transition-all"
              />
            </div>
            <Button 
              type="submit" 
              disabled={otp.length !== 4}
              variant="primary"
              className="w-full py-6 rounded-3xl font-black text-lg shadow-[0_0_50px_rgba(255,215,0,0.15)] disabled:opacity-30 uppercase tracking-widest italic"
            >
              Verify & Synchronize
            </Button>
            <button 
              type="button" 
              onClick={() => setStep(1)}
              className="w-full text-white/20 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors"
            >
              Reset Phone Uplink
            </button>
          </form>
        )}

        <Card className="mt-12 p-6 bg-white/[0.02] border-white/5 text-center">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">Development Personas</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[10px] font-black tracking-widest text-white/40">
             <span className="text-left text-primary">9999999991 <span className="text-white/20">(Partner)</span></span>
             <span className="text-left text-primary">9999999992 <span className="text-white/20">(Tech)</span></span>
             <span className="text-left text-primary">9999999993 <span className="text-white/20">(Vendor)</span></span>
             <span className="text-left text-primary">9999999994 <span className="text-white/20">(Admin)</span></span>
          </div>
        </Card>

        <p className="text-center text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mt-8 leading-relaxed">
          Authorization constitutes agreement to SolarHub <br />
          <span className="text-primary cursor-pointer hover:text-white transition-colors">Core Protocols</span> & <span className="text-primary cursor-pointer hover:text-white transition-colors">Privacy Matrix</span>
        </p>
      </Card>
    </div>
  );
}
