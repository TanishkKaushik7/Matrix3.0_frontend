import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Globe, GraduationCap, Send, ShieldCheck, Info, ChevronDown } from 'lucide-react';

const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Logic: POST to FastAPI /auth/signup
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
        <div className="w-16 h-16 bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 rounded-full flex items-center justify-center mx-auto">
          <ShieldCheck className="text-[#5E6AD2]" size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">Application Received</h2>
          <p className="text-sm text-[#8A8F98] max-w-xs mx-auto">
            Our admin team is verifying your institution. You will receive an email once your account is whitelisted.
          </p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="text-xs text-[#5E6AD2] hover:text-[#6872D9] font-mono tracking-widest uppercase transition-colors"
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
        <h2 className="text-2xl font-semibold tracking-tight text-white">Register Institution</h2>
        <p className="text-sm text-[#8A8F98]">
          Apply for an official issuer account on the BhoomiNet protocol.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Organization Name */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase tracking-widest text-[#8A8F98] ml-1">Institution Name</label>
          <div className="relative group">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8F98] group-focus-within:text-[#5E6AD2] transition-colors" size={18} />
            <input 
              required
              type="text"
              placeholder="e.g. Stanford University"
              className="w-full bg-[#0F0F12] border border-white/10 rounded-lg pl-11 pr-4 py-3 text-sm text-[#EDEDEF] placeholder:text-[#555] focus:ring-2 focus:ring-[#5E6AD2]/30 focus:border-[#5E6AD2] outline-none transition-all"
            />
          </div>
        </div>

        {/* Website & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-widest text-[#8A8F98] ml-1">Official Website</label>
            <div className="relative group">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8F98] group-focus-within:text-[#5E6AD2] transition-colors" size={18} />
              <input 
                required
                type="url"
                placeholder="https://..."
                className="w-full bg-[#0F0F12] border border-white/10 rounded-lg pl-11 pr-4 py-3 text-sm text-[#EDEDEF] placeholder:text-[#555] focus:ring-2 focus:ring-[#5E6AD2]/30 focus:border-[#5E6AD2] outline-none transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-widest text-[#8A8F98] ml-1">Type</label>
            <div className="relative group">
              <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8F98] group-focus-within:text-[#5E6AD2] transition-colors" size={18} />
              <select className="w-full bg-[#0F0F12] border border-white/10 rounded-lg pl-11 pr-10 py-3 text-sm text-[#EDEDEF] focus:ring-2 focus:ring-[#5E6AD2]/30 focus:border-[#5E6AD2] outline-none transition-all appearance-none cursor-pointer">
                <option className="bg-[#0F0F12]">University</option>
                <option className="bg-[#0F0F12]">Bootcamp</option>
                <option className="bg-[#0F0F12]">Corporate</option>
                <option className="bg-[#0F0F12]">Government</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8F98] pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Contact Email */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase tracking-widest text-[#8A8F98] ml-1">Admin Email</label>
          <input 
            required
            type="email"
            placeholder="registrar@institution.edu"
            className="w-full bg-[#0F0F12] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#EDEDEF] placeholder:text-[#555] focus:ring-2 focus:ring-[#5E6AD2]/30 focus:border-[#5E6AD2] outline-none transition-all"
          />
        </div>

        {/* Info Note */}
        <div className="flex gap-3 p-4 rounded-xl bg-[#5E6AD2]/5 border border-[#5E6AD2]/10">
          <Info size={18} className="text-[#5E6AD2] shrink-0 mt-0.5" />
          <p className="text-[10px] text-[#8A8F98] leading-relaxed uppercase tracking-wider font-mono">
            Applications are reviewed within 24-48 hours. Ensure the email matches your official domain for faster approval.
          </p>
        </div>

        <button
          disabled={isLoading}
          type="submit"
          className="w-full bg-[#5E6AD2] hover:bg-[#6872D9] text-white font-medium py-3.5 rounded-lg shadow-[0_4px_20px_rgba(94,106,210,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group relative overflow-hidden"
        >
          {isLoading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
          ) : (
            <>
              <span className="relative z-10 flex items-center gap-2">
                Submit Application
                <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
              <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-700" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default SignupForm;