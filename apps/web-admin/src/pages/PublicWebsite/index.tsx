import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Battery,
  Calculator,
  CheckCircle2,
  IndianRupee,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Sun,
  Truck,
  Users,
  Wrench,
  Zap,
  LayoutDashboard,
  Users2
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import ConsumerFunnel from './ConsumerFunnel';
import PartnerFunnel from './PartnerFunnel';

export default function PublicWebsite({ onAddProduct, onBookService, onVendorOnboarding }) {
  const { products, services, language } = useStore();
  const [funnel, setFunnel] = useState<'consumer' | 'partner'>('consumer');

  return (
    <div className="pt-24 min-h-screen bg-[#050505]">
      {/* Funnel Switcher */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] bg-white/5 backdrop-blur-3xl border border-white/10 p-2 rounded-2xl flex gap-2 shadow-2xl">
        <button 
          onClick={() => setFunnel('consumer')}
          className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${funnel === 'consumer' ? 'bg-[#ffc400] text-black' : 'text-white/40 hover:text-white'}`}
        >
          <Sun size={14} /> Consumer
        </button>
        <button 
          onClick={() => setFunnel('partner')}
          className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${funnel === 'partner' ? 'bg-[#ffc400] text-black' : 'text-white/40 hover:text-white'}`}
        >
          <Users2 size={14} /> Partner
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
