import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Globe, GraduationCap, Send, ShieldCheck, Info } from 'lucide-react';

const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Logic: POST to FastAPI /auth/signup [cite: 69, 78]
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 space-y-6"
      >
        <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center mx-auto">
          <ShieldCheck className="text-accent" size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Application Received</h2>
          <p className="text-sm text-foreground-muted max-w-xs mx-auto">
            Our admin team is verifying your institution. You will receive an email once your account is whitelisted.
          </p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="text-xs text-accent hover:underline tracking-widest uppercase"
        >
          Return to Home
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Register Institution</h2>
        <p className="text-sm text-foreground-muted">
          Apply for an official issuer account on the BhoomiNet protocol[cite: 3].
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Organization Name */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase tracking-wider text-foreground-subtle ml-1">Institution Name</label>
          <div className="relative group">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle group-focus-within:text-accent transition-colors" size={18} />
            <input 
              required
              type="text"
              placeholder="e.g. Stanford University"
              className="w-full bg-[#0F0F12] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all"
            />
          </div>
        </div>

        {/* Website & Type */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-foreground-subtle ml-1">Official Website</label>
            <div className="relative group">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle group-focus-within:text-accent transition-colors" size={18} />
              <input 
                required
                type="url"
                placeholder="https://..."
                className="w-full bg-[#0F0F12] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-foreground-subtle ml-1">Type</label>
            <div className="relative group">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle group-focus-within:text-accent transition-colors" size={18} />
              <select className="w-full bg-[#0F0F12] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all appearance-none">
                <option>University</option>
                <option>Bootcamp</option>
                <option>Corporate</option>
                <option>Government</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Email */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase tracking-wider text-foreground-subtle ml-1">Admin Email</label>
          <input 
            required
            type="email"
            placeholder="registrar@institution.edu"
            className="w-full bg-[#0F0F12] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all"
          />
        </div>

        {/* Info Note */}
        <div className="flex gap-3 p-3 rounded-lg bg-accent/5 border border-accent/10">
          <Info size={16} className="text-accent shrink-0 mt-0.5" />
          <p className="text-[10px] text-foreground-muted leading-relaxed uppercase tracking-tight">
            Applications are typically reviewed within 24-48 hours. Ensure the email provided matches your official domain for faster approval.
          </p>
        </div>

        <button
          disabled={isLoading}
          type="submit"
          className="w-full bg-accent hover:bg-accent-bright text-white font-medium py-3 rounded-lg shadow-[0_0_20px_rgba(94,106,210,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
        >
          {isLoading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
          ) : (
            <>
              Submit Application
              <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default SignupForm;