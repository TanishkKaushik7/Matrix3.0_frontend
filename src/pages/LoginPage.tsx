import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShieldCheck, Fingerprint, Lock, ArrowRight } from 'lucide-react';

// UI Components
import Card from '../components/ui/Card';
import EmailStep from '../components/auth/EmailStep';
import PasswordStep from '../components/auth/PasswordStep';

// Hooks & Context
import { useAuthFlow } from '../hooks/useAuthFlow';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    step,
    email,
    isLoading,
    error,
    verifyEmail,
    submitPassword,
    handleBack,
  } = useAuthFlow();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-transparent">

      {/* Back Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-8 left-8"
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-[#8A8F98] hover:text-white transition-colors text-sm font-medium group"
        >
          <ChevronLeft
            size={15}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          Back to Portal
        </Link>
      </motion.div>

      <div className="w-full max-w-[400px] flex flex-col gap-5">

        {/* Login Card */}
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <Card className="p-8 border-white/[0.08]">

                {/* Card Header */}
                <div className="mb-7">
                  <div className="w-10 h-10 bg-[#5E6AD2]/10 border border-[#5E6AD2]/25 rounded-xl flex items-center justify-center mb-5">
                    <Lock size={18} className="text-[#5E6AD2]" />
                  </div>
                  <h1 className="text-xl font-semibold text-white mb-1.5">
                    Institutional Login
                  </h1>
                  <p className="text-sm text-[#8A8F98] leading-relaxed">
                    Access restricted to whitelisted organizations on the BhoomiNet network.
                  </p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center gap-1.5 mb-7">
                  <div className="h-1 w-5 rounded-full bg-[#5E6AD2]" />
                  <div className="h-1 w-5 rounded-full bg-[#5E6AD2]/20" />
                </div>

                <EmailStep
                  onSubmit={verifyEmail}
                  isLoading={isLoading}
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
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <Card className="p-8 border-white/[0.08]">

                {/* Card Header */}
                <div className="mb-7">
                  <div className="w-10 h-10 bg-[#5E6AD2]/10 border border-[#5E6AD2]/25 rounded-xl flex items-center justify-center mb-5">
                    <Lock size={18} className="text-[#5E6AD2]" />
                  </div>
                  <h1 className="text-xl font-semibold text-white mb-1.5">
                    Enter Password
                  </h1>
                  <p className="text-sm text-[#8A8F98] leading-relaxed">
                    Signing in as a verified issuer on BhoomiNet.
                  </p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center gap-1.5 mb-7">
                  <div className="h-1 w-5 rounded-full bg-[#5E6AD2]/20" />
                  <div className="h-1 w-5 rounded-full bg-[#5E6AD2]" />
                </div>

                {/* Email Preview Pill */}
                <div className="flex items-center gap-2 bg-[#5E6AD2]/[0.06] border border-[#5E6AD2]/20 rounded-lg px-3 py-2.5 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5E6AD2] flex-shrink-0" />
                  <span className="text-sm text-[#5E6AD2] truncate">{email}</span>
                </div>

                <PasswordStep
                  email={email}
                  onSubmit={submitPassword}
                  onBack={handleBack}
                  isLoading={isLoading}
                  externalError={error}
                />
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#8A8F98] uppercase tracking-widest">
              <ShieldCheck size={11} className="text-[#5E6AD2]" />
              SSL Encrypted
            </div>
            <span className="w-1 h-1 rounded-full bg-white/15" />
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#8A8F98] uppercase tracking-widest">
              <Fingerprint size={11} className="text-[#5E6AD2]" />
              MFA Ready
            </div>
          </div>

          <p className="text-[11px] text-[#8A8F98]/60 text-center max-w-[280px] leading-relaxed">
            Your IP and credentials are logged for security. Unauthorized access attempts are reported.
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default LoginPage;