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
  Zap
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const heroImage =
  'https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?auto=format&fit=crop&q=85&w=2400';

const categories = ['All', 'Kits', 'Inverters', 'Batteries', 'Eco-Home'];

export default function PublicWebsite({ onAddProduct, onBookService }) {
  const { products, services, language } = useStore();
  const [activeTab, setActiveTab] = useState('products');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [calcInputs, setCalcInputs] = useState({
    bill: 5000,
    area: 500,
    pincode: ''
  });

  const recommendedKW = Math.max(1, calcInputs.bill / 1500);
  const roundedKW = recommendedKW.toFixed(1);
  const estimatedSavings = Math.round(calcInputs.bill * 0.82);
  const estimatedCost = Math.round(recommendedKW * 62000);
  const paybackYears = Math.max(2.8, estimatedCost / Math.max(1, estimatedSavings * 12)).toFixed(1);

  const visibleProducts = useMemo(() => {
    if (selectedCategory === 'All') return products;
    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <>
      <section className="relative min-h-[92vh] overflow-hidden bg-[#f8faf7] text-[#102018] pt-32">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Residential rooftop solar panels" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f8faf7] via-[#f8faf7]/94 to-[#f8faf7]/28" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f8faf7] to-transparent" />
        </div>

        <div className="container relative z-10 grid min-h-[78vh] items-center gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d5e8d9] bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#326343] shadow-sm">
              <Sparkles size={16} />
              Solar marketplace + installation network
            </div>

            <h1 className="mb-7 text-5xl font-black leading-[0.95] tracking-tight text-[#102018] md:text-7xl">
              Buy solar with the service network already built in.
            </h1>

            <p className="mb-9 max-w-2xl text-lg font-medium leading-8 text-[#47584d] md:text-xl">
              SolarHub helps homeowners and small businesses compare verified solar kits, estimate savings, book installation, track technician jobs, and manage AMC from one platform.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a href="#calculator" className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#ffc400] px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-black shadow-lg shadow-yellow-500/20 transition hover:-translate-y-0.5 hover:bg-[#ffd84d]">
                Calculate savings <Calculator size={18} />
              </a>
              <a href="#products" className="inline-flex items-center justify-center gap-3 rounded-xl border border-[#cfded2] bg-white/85 px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#102018] shadow-sm transition hover:-translate-y-0.5 hover:border-[#89b08f]">
                Browse marketplace <ArrowRight size={18} />
              </a>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              {[
                ['5%', 'vendor commission model'],
                ['25 yrs', 'solar lifecycle support'],
                ['3 apps', 'customer, vendor, technician']
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur">
                  <p className="text-2xl font-black text-[#102018]">{value}</p>
                  <p className="mt-1 text-[10px] font-black uppercase leading-4 tracking-[0.14em] text-[#64736a]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/80 bg-white/88 p-5 shadow-2xl shadow-black/10 backdrop-blur md:p-7">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#6b7d70]">Live demo flow</p>
                <h2 className="mt-1 text-2xl font-black text-[#102018]">Solar order lifecycle</h2>
              </div>
              <div className="rounded-2xl bg-[#eff8ef] p-3 text-[#2f7d45]">
                <Sun size={26} />
              </div>
            </div>

            <div className="space-y-3">
              {[
                ['Savings estimate', 'Customer enters bill and roof area', Calculator],
                ['Verified kit checkout', 'Products from approved vendors', ShoppingCart],
                ['Vendor dispatch', 'Order, invoice, logistics and payout', Truck],
                ['Technician job', 'Checklist, photos and completion proof', Wrench],
                ['AMC retention', 'Cleaning, repairs and warranty support', ShieldCheck]
              ].map(([title, text, Icon], index) => (
                <div key={title as string} className="flex items-center gap-4 rounded-2xl border border-[#e4ece5] bg-[#fbfdfb] p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#102018] text-[#ffc400]">
                    {React.createElement(Icon as any, { size: 20 })}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-[#102018]">{index + 1}. {title}</p>
                    <p className="text-sm font-medium text-[#667469]">{text}</p>
                  </div>
                  <CheckCircle2 className="text-[#3e9b57]" size={20} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="calculator" className="bg-[#f8faf7] px-6 py-20 text-[#102018]">
        <div className="container grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#3e7c4d]">Solar ROI calculator</p>
            <h2 className="mb-5 text-4xl font-black tracking-tight md:text-5xl">Turn an electricity bill into a clear system estimate.</h2>
            <p className="max-w-xl text-lg font-medium leading-8 text-[#5f7165]">
              This demo calculator converts monthly bill, usable roof area, and location intent into a recommended system size, estimated setup cost, monthly savings, and payback range.
            </p>
          </div>

          <div className="grid gap-5 rounded-[28px] border border-[#dde9df] bg-white p-6 shadow-xl shadow-black/5 md:grid-cols-2">
            <div className="space-y-6">
              <Field label="Monthly bill">
                <input
                  type="range"
                  min="1000"
                  max="25000"
                  step="500"
                  value={calcInputs.bill}
                  onChange={(event) => setCalcInputs({ ...calcInputs, bill: Number(event.target.value) })}
                  className="w-full accent-[#ffc400]"
                />
                <p className="mt-2 text-3xl font-black">Rs. {calcInputs.bill.toLocaleString()}</p>
              </Field>

              <Field label="Usable roof area">
                <input
                  type="number"
                  value={calcInputs.area}
                  onChange={(event) => setCalcInputs({ ...calcInputs, area: Number(event.target.value) })}
                  className="w-full rounded-xl border border-[#dbe7dd] bg-[#f8faf7] p-4 text-[#102018]"
                />
              </Field>

              <Field label="Pincode">
                <input
                  value={calcInputs.pincode}
                  onChange={(event) => setCalcInputs({ ...calcInputs, pincode: event.target.value })}
                  placeholder="Enter service pincode"
                  className="w-full rounded-xl border border-[#dbe7dd] bg-[#f8faf7] p-4 text-[#102018]"
                />
              </Field>
            </div>

            <div className="grid gap-4">
              <Metric icon={<Zap size={22} />} label="Recommended system" value={`${roundedKW} kW`} tone="yellow" />
              <Metric icon={<IndianRupee size={22} />} label="Estimated setup" value={`Rs. ${estimatedCost.toLocaleString()}`} />
              <Metric icon={<Battery size={22} />} label="Monthly savings" value={`Rs. ${estimatedSavings.toLocaleString()}`} tone="green" />
              <Metric icon={<PackageCheck size={22} />} label="Payback estimate" value={`${paybackYears} years`} />
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white px-6 py-20 text-[#102018]">
        <div className="container">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#3e7c4d]">Why SolarHub works</p>
              <h2 className="max-w-3xl text-4xl font-black tracking-tight md:text-5xl">A marketplace is useful only when fulfillment is controlled.</h2>
            </div>
            <p className="max-w-md text-base font-medium leading-7 text-[#657268]">
              Customers see one trusted brand. Vendors, technicians, partners, and admins each get the operating view they need.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            {[
              ['Verified vendors', 'GST/KYC, catalog control, order queue and payout workflow.', ShieldCheck],
              ['Technician network', 'Gig-style service jobs with checklist and evidence capture.', Wrench],
              ['Partner lead engine', 'Local partners and CAs submit leads and track conversion.', Users],
              ['Admin control', 'Revenue, KYC, supply chain risk and operational health.', Sparkles]
            ].map(([title, text, Icon]) => (
              <article key={title as string} className="rounded-2xl border border-[#dde9df] bg-[#f8faf7] p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#102018] text-[#ffc400]">
                  {React.createElement(Icon as any, { size: 22 })}
                </div>
                <h3 className="mb-3 text-xl font-black">{title}</h3>
                <p className="text-sm font-medium leading-6 text-[#647268]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="bg-[#102018] px-6 py-20 text-white">
        <div className="container">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#ffc400]">Marketplace</p>
              <h2 className="text-4xl font-black tracking-tight md:text-5xl">Products and services ready for demo.</h2>
            </div>
            <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1">
              {['products', 'services'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl px-5 py-3 text-xs font-black uppercase tracking-[0.14em] ${activeTab === tab ? 'bg-[#ffc400] text-black' : 'text-white/55 hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'products' && (
            <div className="mb-8 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.12em] ${selectedCategory === category ? 'border-[#ffc400] bg-[#ffc400] text-black' : 'border-white/10 bg-white/5 text-white/60 hover:text-white'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
            {activeTab === 'products'
              ? visibleProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={onAddProduct} />)
              : services.map((service) => <ServiceCard key={service.id} service={service} onBook={() => onBookService(service)} />)}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.16em] text-[#657268]">{label}</span>
      {children}
    </label>
  );
}

function Metric({ icon, label, value, tone = 'dark' }) {
  const colors = {
    dark: 'bg-[#102018] text-white',
    yellow: 'bg-[#fff5c2] text-[#102018]',
    green: 'bg-[#e7f6e8] text-[#103b20]'
  };

  return (
    <div className={`rounded-2xl p-5 ${colors[tone]}`}>
      <div className="mb-4 flex items-center gap-2 opacity-80">
        {icon}
        <p className="text-[10px] font-black uppercase tracking-[0.16em]">{label}</p>
      </div>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}

function ProductCard({ product, onAdd }) {
  return (
    <article className="flex min-h-[520px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
      <div className="h-52 overflow-hidden bg-white/5">
        <img src={product.image_url} alt={product.title} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="rounded-full bg-[#ffc400]/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#ffc400]">{product.category}</span>
          <span className="inline-flex items-center gap-1 text-sm font-black text-[#ffc400]"><Star size={15} fill="currentColor" /> {product.rating}</span>
        </div>
        <h3 className="mb-3 text-xl font-black leading-tight">{product.title}</h3>
        <p className="mb-5 line-clamp-3 text-sm font-medium leading-6 text-white/62">{product.description}</p>
        <p className="mb-5 mt-auto text-[11px] font-black uppercase tracking-[0.14em] text-white/42">
          <ShieldCheck className="mr-2 inline text-[#ffc400]" size={14} />
          {product.vendor}
        </p>
        <div className="flex items-center justify-between border-t border-white/10 pt-5">
          <div>
            <p className="text-2xl font-black">Rs. {Number(product.price).toLocaleString()}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/35">financing ready</p>
          </div>
          <button onClick={() => onAdd(product)} className="rounded-xl bg-[#ffc400] p-4 text-black transition hover:-translate-y-0.5 hover:bg-[#ffd84d]" aria-label={`Add ${product.title} to cart`}>
            <ShoppingCart size={22} />
          </button>
        </div>
      </div>
    </article>
  );
}

function ServiceCard({ service, onBook }) {
  return (
    <article className="flex min-h-[340px] flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffc400]/15 text-[#ffc400]">
        <Wrench size={24} />
      </div>
      <h3 className="mb-3 text-xl font-black">{service.title}</h3>
      <p className="mb-5 text-sm font-medium leading-6 text-white/62">{service.description}</p>
      <div className="mt-auto border-t border-white/10 pt-5">
        <p className="mb-4 text-2xl font-black">Rs. {Number(service.price).toLocaleString()}</p>
        <button onClick={onBook} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#ffc400]/30 bg-[#ffc400] px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-black transition hover:bg-[#ffd84d]">
          Book service <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
}
