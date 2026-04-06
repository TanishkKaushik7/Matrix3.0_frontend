import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShieldCheck, Fingerprint, Lock, Mail } from 'lucide-react';

// UI Components
import Card from '../components/ui/Card';
import EmailStep from '../components/auth/EmailStep';
import PasswordStep from '../components/auth/PasswordStep';

// Hooks & Context
import { useAuthFlow } from '../hooks/useAuthFlow';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  
  const {
    step,
    email,
    isLoading: flowLoading,
    error,
    verifyEmail,
    submitPassword,
    handleBack,
  } = useAuthFlow();

  /**
   * 1. SECURE REDIRECTION
   * When 'user' is populated in RAM, redirect immediately.
   * 'replace: true' removes the /login page from the history stack.
   */
  useEffect(() => {
    if (user) {
      const redirectPath = user.role === 'admin' ? '/admin' : '/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate]);

  // 2. Initial Auth Check (if any logic is running to verify cookies/session)
  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#050506]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-6 h-6 border-2 border-[#5E6AD2]/30 border-t-[#5E6AD2] rounded-full"
        />
      </div>
    );
  }

  // 3. Prevent rendering if user is already authenticated in this session
  if (user) return null;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#050506] overflow-hidden">
      
      {/* Visual background layers */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-[#5E6AD2]/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />

      {/* Back Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-10 left-10"
      >
        <Link
          to="/"
          className={`flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-[#8A8F98] hover:text-white transition-all text-xs font-medium group ${(flowLoading || authLoading) ? 'pointer-events-none opacity-50' : ''}`}
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Portal
        </Link>
      </motion.div>

      <div className="w-full max-w-[480px] flex flex-col gap-6 relative z-10">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="p-10 border-white/[0.08] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] bg-[#0A0A0C]/80 backdrop-blur-2xl relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#5E6AD2]/40 to-transparent" />

                <div className="mb-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 rounded-2xl flex items-center justify-center shadow-[inset_0_0_12px_rgba(94,106,210,0.1)]">
                      <Lock size={22} className="text-[#5E6AD2]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-8 rounded-full bg-[#5E6AD2] shadow-[0_0_15px_rgba(94,106,210,0.4)]" />
                      <div className="h-1.5 w-8 rounded-full bg-white/5" />
                    </div>
                  </div>
                  
                  <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
                    Institutional Login
                  </h1>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Verify your institutional credentials to access the BhoomiNet node.
                  </p>
                </div>

                <EmailStep
                  onSubmit={verifyEmail}
                  isLoading={flowLoading}
                  externalError={error}
                />
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="password-step"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="p-10 border-white/[0.08] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] bg-[#0A0A0C]/80 backdrop-blur-2xl relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#5E6AD2]/40 to-transparent" />

                <div className="mb-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 rounded-2xl flex items-center justify-center">
                      <ShieldCheck size={22} className="text-[#5E6AD2]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-8 rounded-full bg-white/10" />
                      <div className="h-1.5 w-8 rounded-full bg-[#5E6AD2] shadow-[0_0_15px_rgba(94,106,210,0.4)]" />
                    </div>
                  </div>
                  
                  <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
                    Identity Verified
                  </h1>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Please provide your master password to unlock your session metadata.
                  </p>
                </div>

                {/* Email Display / Change Button */}
                <div className="flex items-center justify-between bg-black/40 border border-white/[0.05] rounded-2xl px-5 py-4 mb-8 group hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Mail size={16} className="text-[#5E6AD2] shrink-0" />
                    <span className="text-sm text-slate-300 truncate font-mono">{email}</span>
                  </div>
                  <button 
                    onClick={handleBack}
                    disabled={flowLoading}
                    className="text-[10px] font-bold text-[#5E6AD2] hover:text-white uppercase tracking-widest transition-colors ml-4 shrink-0 disabled:opacity-30"
                  >
                    Change
                  </button>
                </div>

                <PasswordStep
                  email={email}
                  onSubmit={submitPassword}
                  onBack={handleBack}
                  isLoading={flowLoading}
                  externalError={error}
                />
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Metadata */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-6 mt-4"
        >
          <div className="flex items-center gap-6 bg-white/[0.02] border border-white/[0.05] px-6 py-3 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-2.5 text-[9px] font-mono text-slate-500 uppercase tracking-[0.25em]">
              <ShieldCheck size={12} className="text-[#5E6AD2]" />
              AES-256 Auth
            </div>
            <div className="w-[1px] h-3 bg-white/10" />
            <div className="flex items-center gap-2.5 text-[9px] font-mono text-slate-500 uppercase tracking-[0.25em]">
              <Fingerprint size={12} className="text-[#5E6AD2]" />
              End-to-End
            </div>
          </div>
          
          <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em]">
            BhoomiNet Security Protocol v2.4
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;