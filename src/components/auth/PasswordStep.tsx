import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, ShieldAlert, ChevronLeft } from 'lucide-react';

// Interface strictly aligned with LoginPage.tsx
interface PasswordStepProps {
  email: string;
  onSubmit: (password: string) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  externalError: string | null;
  isFirstTime?: boolean; // Optional: derived from backend whitelisting check
}

const PasswordStep = ({ 
  email, 
  onSubmit, 
  onBack, 
  isLoading, 
  externalError, 
  isFirstTime = false 
}: PasswordStepProps) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length >= 6) {
      await onSubmit(password);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header with Breadcrumb-like "Back" option */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          {isFirstTime ? "Create your password" : "Enter password"}
        </h2>
        <p className="text-sm text-[#8A8F98]">
          {isFirstTime 
            ? "Your account was approved. Set a secure password to begin issuing." 
            : "Authorized personnel only. Please verify your identity."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Lock size={18} className="text-[#8A8F98] group-focus-within:text-[#5E6AD2] transition-colors" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#0F0F12] border border-white/10 rounded-lg pl-11 pr-12 py-3 text-[#EDEDEF] focus:outline-none focus:ring-2 focus:ring-[#5E6AD2]/50 focus:border-[#5E6AD2] transition-all font-mono"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8A8F98] hover:text-[#EDEDEF] transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Displaying Error from useAuthFlow hook */}
        {externalError && (
          <div className="flex items-center gap-2 text-[11px] font-medium text-red-500 ml-1">
            <ShieldAlert size={14} />
            <span>{externalError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || password.length < 6}
          className="relative w-full bg-[#5E6AD2] hover:bg-[#6872D9] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg shadow-[0_4px_12px_rgba(94,106,210,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group overflow-hidden"
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-700 ease-in-out" />
          
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              <span className="relative z-10 flex items-center gap-2">
                {isFirstTime ? "Initialize Account" : "Access Dashboard"}
                <CheckCircle2 size={18} className="opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100" />
              </span>
            </>
          )}
        </button>
      </form>

      {/* Security Footnote */}
      <div className="pt-4 border-t border-white/[0.06] text-center">
        <p className="text-[10px] text-[#8A8F98] uppercase tracking-[0.2em] font-mono">
          AES-256 Encryption & Polygon PoS
        </p>
      </div>
    </motion.div>
  );
};

export default PasswordStep;