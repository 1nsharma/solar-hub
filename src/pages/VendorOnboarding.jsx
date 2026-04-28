import React, { useState } from 'react';
import { ShieldCheck, Upload, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function VendorOnboarding({ onBack }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    gst: '',
    address: '',
    contactName: '',
    email: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(3); // Show success
  };

  return (
    <div className="min-h-screen bg-bg-dark pt-32 pb-20">
      <div className="container max-w-3xl">
        <button onClick={onBack} className="text-primary mb-8 flex items-center gap-2 hover:gap-3 transition-all">
          ← Back to Home
        </button>

        {step < 3 && (
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">Partner with <span className="text-primary">SolarHub</span></h1>
            <p className="text-text-dim text-lg">Join India's fastest growing solar marketplace. Grow your business with us.</p>
          </div>
        )}

        {step === 1 && (
          <div className="glass-card p-10 animate-fade-in">
            <h2 className="text-2xl mb-8 font-bold">Business Details</h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-text-dim mb-2">Business Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-primary outline-none"
                    placeholder="Solar Solutions Pvt Ltd"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-dim mb-2">GST Number</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-primary outline-none"
                    placeholder="22AAAAA0000A1Z5"
                    value={formData.gst}
                    onChange={(e) => setFormData({...formData, gst: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-text-dim mb-2">Office Address</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-primary outline-none h-32"
                  placeholder="Full office address..."
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                ></textarea>
              </div>
              <button 
                onClick={() => setStep(2)}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2"
              >
                Next Step <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="glass-card p-10 animate-fade-in">
            <h2 className="text-2xl mb-8 font-bold">Document Upload</h2>
            <div className="space-y-8">
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center hover:border-primary transition-all group cursor-pointer">
                <Upload className="mx-auto mb-4 text-text-dim group-hover:text-primary" size={48} />
                <p className="font-bold text-lg">Upload GST Certificate</p>
                <p className="text-text-dim text-sm mt-2">PDF or JPEG (Max 5MB)</p>
              </div>
              
              <div className="flex items-center gap-4 bg-primary/10 p-4 rounded-xl border border-primary/20">
                <ShieldCheck className="text-primary" />
                <p className="text-sm">Your data is encrypted and stored securely.</p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="btn-secondary flex-1 py-4"
                >
                  Back
                </button>
                <button 
                  onClick={handleSubmit}
                  className="btn-primary flex-[2] py-4"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="glass-card p-12 text-center animate-fade-in">
            <div className="bg-secondary/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="text-secondary" size={64} />
            </div>
            <h2 className="text-4xl font-bold mb-4">Application Received!</h2>
            <p className="text-text-dim text-lg mb-10 max-w-md mx-auto">
              Our team will review your details and contact you within 24-48 hours. Welcome to the SolarHub ecosystem!
            </p>
            <button 
              onClick={onBack}
              className="btn-primary px-12 py-4"
            >
              Go to Homepage
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
