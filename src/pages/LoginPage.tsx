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
  
  // 1. Hooks must ALWAYS be called first, and always in the same order.
  const {
    step,
    email,
    isLoading: flowLoading,
    error,
    verifyEmail,
    submitPassword,
    handleBack,
  } = useAuthFlow();

  // 2. Handle redirection inside a useEffect to avoid "Order of hooks" errors.
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  // 3. Show a neutral loading state if the App is still determining if a user is logged in.
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

  // 4. If a user exists, return null. The useEffect above will handle the push to Dashboard.
  if (user) return null;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 bg-transparent overflow-hidden">
      
      {/* Ambient Background System */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-[#5E6AD2]/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-white/[0.03] blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Back Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 left-8"
      >
        <Link
          to="/"
          className={`flex items-center gap-2 text-[#8A8F98] hover:text-white transition-colors text-sm font-medium group ${(flowLoading || authLoading) ? 'pointer-events-none opacity-50' : ''}`}
        >
          <ChevronLeft
            size={16}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          Back to Portal
        </Link>
      </motion.div>

      <div className="w-full max-w-[500px] flex flex-col gap-6 relative z-10">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Card className="p-10 border-white/[0.08] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] bg-[#0A0A0C]/80 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#5E6AD2]/50 to-transparent" />

                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#5E6AD2]/20 to-indigo-500/5 border border-[#5E6AD2]/30 rounded-xl flex items-center justify-center shadow-[inset_0_0_12px_rgba(94,106,210,0.2)]">
                      <Lock size={20} className="text-[#5E6AD2]" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1 w-6 rounded-full bg-[#5E6AD2] shadow-[0_0_10px_rgba(94,106,210,0.5)]" />
                      <div className="h-1 w-6 rounded-full bg-white/10" />
                    </div>
                  </div>
                  
                  <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">
                    Institutional Login
                  </h1>
                  <p className="text-sm text-[#8A8F98] leading-relaxed">
                    Access restricted to whitelisted organizations. Please enter your registered email to continue.
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
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Card className="p-10 border-white/[0.08] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] bg-[#0A0A0C]/80 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#5E6AD2]/50 to-transparent" />

                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#5E6AD2]/20 to-indigo-500/5 border border-[#5E6AD2]/30 rounded-xl flex items-center justify-center shadow-[inset_0_0_12px_rgba(94,106,210,0.2)]">
                      <ShieldCheck size={20} className="text-[#5E6AD2]" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1 w-6 rounded-full bg-white/10" />
                      <div className="h-1 w-6 rounded-full bg-[#5E6AD2] shadow-[0_0_10px_rgba(94,106,210,0.5)]" />
                    </div>
                  </div>
                  
                  <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">
                    Secure Authentication
                  </h1>
                  <p className="text-sm text-[#8A8F98] leading-relaxed">
                    Enter your master password to decrypt your session and access the issuer dashboard.
                  </p>
                </div>

                <div className="flex items-center justify-between bg-[#0F0F12] border border-white/[0.06] rounded-xl px-4 py-3 mb-6 group transition-colors hover:border-white/10">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Mail size={16} className="text-[#5E6AD2] flex-shrink-0" />
                    <span className="text-sm text-gray-300 truncate font-medium">{email}</span>
                  </div>
                  <button 
                    onClick={handleBack}
                    disabled={flowLoading}
                    className="text-[11px] font-bold text-[#8A8F98] hover:text-white uppercase tracking-[0.1em] transition-colors ml-4 flex-shrink-0 disabled:opacity-30"
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

        {/* Footer Metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-4 mt-2"
        >
          <div className="flex items-center gap-6 bg-white/[0.02] border border-white/[0.05] px-6 py-2.5 rounded-full backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 uppercase tracking-[0.2em]">
              <ShieldCheck size={12} className="text-[#5E6AD2]" />
              SSL Encrypted
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 uppercase tracking-[0.2em]">
              <Fingerprint size={12} className="text-[#5E6AD2]" />
              MFA Support
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;