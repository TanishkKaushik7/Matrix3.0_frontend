import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';

interface PasswordStepProps {
  email: string;
  isFirstTime: boolean; // Derived from your backend check in Step 1
  onFinalSuccess: (token: string) => void;
  onBack: () => void;
}

const PasswordStep = ({ email, isFirstTime, onFinalSuccess, onBack }: PasswordStepProps) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // API call to FastAPI: /auth/login or /auth/set-password
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // On success, pass the JWT/Session token back to the AuthContext
      onFinalSuccess("mock_jwt_token_bhoominet");
    } catch (err) {
      setError("Invalid password. Please try again or contact admin.");
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
      {/* Header with Breadcrumb-like "Back" option */}
      <div className="space-y-2">
        <button 
          onClick={onBack}
          className="text-xs text-accent hover:text-accent-bright transition-colors mb-2 flex items-center gap-1"
        >
          ← {email}
        </button>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {isFirstTime ? "Create your password" : "Enter password"}
        </h2>
        <p className="text-sm text-foreground-muted">
          {isFirstTime 
            ? "Your account was approved. Set a secure password to begin issuing." 
            : "Authorized personnel only. Please verify your identity."}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={18} className="text-foreground-subtle group-focus-within:text-accent transition-colors" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#0F0F12] border border-white/10 rounded-lg pl-10 pr-12 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all font-mono"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground-subtle hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-400 ml-1">
            <ShieldAlert size={14} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || password.length < 6}
          className="relative w-full bg-accent hover:bg-accent-bright disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg shadow-[0_0_20px_rgba(94,106,210,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group overflow-hidden"
        >
          {/* Subtle Shimmer Effect on Hover */}
          <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-700 ease-in-out" />
          
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              {isFirstTime ? "Initialize Account" : "Access Dashboard"}
              <CheckCircle2 size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </>
          )}
        </button>
      </form>

      {/* Security Footnote */}
      <div className="pt-4 border-t border-white/[0.06] text-center">
        <p className="text-[10px] text-foreground-subtle uppercase tracking-widest">
          Secured via AES-256 Encryption & Polygon Proof of Stake
        </p>
      </div>
    </motion.div>
  );
};

export default PasswordStep;