import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Loader2, ShieldCheck } from 'lucide-react';

// Interface aligned with LoginPage.tsx usage
interface EmailStepProps {
  onSubmit: (email: string) => Promise<void>;
  isLoading: boolean;
  externalError: string | null;
}

const EmailStep = ({ onSubmit, isLoading, externalError }: EmailStepProps) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      await onSubmit(email);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Welcome back
        </h2>
        <p className="text-sm text-[#8A8F98]">
          Enter your institutional email to access the BhoomiNet portal.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Mail size={18} className="text-[#8A8F98] group-focus-within:text-[#5E6AD2] transition-colors" />
          </div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@university.edu"
            className="w-full bg-[#0F0F12] border border-white/10 rounded-lg pl-11 pr-4 py-3 text-[#EDEDEF] placeholder:text-[#555] focus:outline-none focus:ring-2 focus:ring-[#5E6AD2]/50 focus:border-[#5E6AD2] transition-all font-sans"
          />
        </div>

        {/* Displaying error from useAuthFlow hook */}
        {externalError && (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-[11px] font-medium text-red-500 ml-1"
          >
            {externalError}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={isLoading || !email}
          className="w-full bg-[#5E6AD2] hover:bg-[#6872D9] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg shadow-[0_4px_12px_rgba(94,106,210,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group relative overflow-hidden"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              <span className="relative z-10 flex items-center gap-2">
                Continue
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
              {/* Subtle shimmer effect on hover */}
              <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-700 ease-in-out" />
            </>
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-white/[0.06]">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <ShieldCheck size={18} className="text-[#5E6AD2] shrink-0 mt-0.5" />
          <p className="text-[10px] leading-relaxed text-[#8A8F98] uppercase tracking-widest font-mono">
            Institutional access only. All authentication attempts are cryptographically logged.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EmailStep;