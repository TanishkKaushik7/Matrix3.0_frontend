import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Loader2, ShieldCheck } from 'lucide-react';

interface EmailStepProps {
  onSuccess: (email: string, isApproved: boolean) => void;
}

const EmailStep = ({ onSuccess }: EmailStepProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Mock API call to FastAPI backend to check if institution exists/is approved
      // const response = await api.post('/auth/check-email', { email });
      
      // Simulation delay for that premium "processing" feel
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Example logic: if verified, move to password; else show pending/error
      onSuccess(email, true); 
    } catch (err) {
      setError("This email isn't associated with a verified institution.");
    } finally {
      setIsLoading(false);
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
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h2>
        <p className="text-sm text-foreground-muted">
          Enter your institutional email to access the BhoomiNet portal.
        </p>
      </div>

      <form onSubmit={handleVerifyEmail} className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail size={18} className="text-foreground-subtle group-focus-within:text-accent transition-colors" />
          </div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@university.edu"
            className="w-full bg-[#0F0F12] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-foreground placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
          />
        </div>

        {error && (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-xs text-red-400 ml-1"
          >
            {error}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={isLoading || !email}
          className="w-full bg-accent hover:bg-accent-bright disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg shadow-[0_0_20px_rgba(94,106,210,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              Continue
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-white/[0.06]">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <ShieldCheck size={18} className="text-accent shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-foreground-subtle uppercase tracking-wider">
            Access is restricted to whitelisted organizations. Your IP and credentials are logged for security.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EmailStep;