import React, { useState } from 'react';
import { Sun, Users2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import ConsumerFunnel from './ConsumerFunnel';
import PartnerFunnel from './PartnerFunnel';

export default function PublicWebsite({ onAddProduct, onBookService, onVendorOnboarding }) {
  const { products, services } = useStore();
  const [funnel, setFunnel] = useState<'consumer' | 'partner'>('consumer');

  return (
    <div className="min-h-screen bg-[#060907]">
      {/* Floating Modern Mode Switcher */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] backdrop-blur-2xl bg-[#080d0a]/90 border border-white/[0.12] p-1.5 rounded-full flex gap-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.7)]">
        <button 
          type="button"
          onClick={() => { setFunnel('consumer'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
            funnel === 'consumer' 
              ? 'bg-[#FFD700] text-black shadow-[0_0_20px_rgba(255,215,0,0.3)]' 
              : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
          }`}
        >
          <Sun size={13} className={funnel === 'consumer' ? 'text-black' : 'text-[#FFD700]'} />
          <span>Homeowner</span>
        </button>
        <button 
          type="button"
          onClick={() => { setFunnel('partner'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
            funnel === 'partner' 
              ? 'bg-[#FFD700] text-black shadow-[0_0_20px_rgba(255,215,0,0.3)]' 
              : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
          }`}
        >
          <Users2 size={13} className={funnel === 'partner' ? 'text-black' : 'text-[#10B981]'} />
          <span>Partner & Vendor</span>
        </button>
      </div>

      {funnel === 'consumer' ? (
        <ConsumerFunnel 
          products={products} 
          services={services} 
          onAddProduct={onAddProduct} 
          onBookService={onBookService} 
        />
      ) : (
        <PartnerFunnel 
          onVendorOnboarding={onVendorOnboarding}
        />
      )}
    </div>
  );
}
