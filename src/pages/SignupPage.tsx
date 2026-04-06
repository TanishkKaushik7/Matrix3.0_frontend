import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ShieldCheck, Globe, Landmark, ArrowRight } from 'lucide-react';

import Card from '../components/ui/Card';
import SignupForm from '../components/auth/SignupForm';

const SignupPage = () => {
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
          <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Portal
        </Link>
      </motion.div>

      <div className="w-full max-w-[480px] flex flex-col gap-5">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <Card className="p-8 border-white/[0.08]">
            <div className="flex flex-col gap-7">

              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-[#5E6AD2]/10 border border-[#5E6AD2]/25 rounded-xl flex items-center justify-center">
                    <Landmark size={18} className="text-[#5E6AD2]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#5E6AD2] uppercase tracking-[0.25em]">
                      Institutional Onboarding
                    </span>
                  </div>
                </div>

                <h1 className="text-2xl font-semibold text-white mb-2">
                  Apply for Issuer Access
                </h1>
                <p className="text-sm text-[#8A8F98] leading-relaxed">
                  Join the network of verified institutions. Once approved, you can issue immutable, blockchain-backed certificates.
                </p>
              </div>

              {/* Trust Badges — inline, above the form */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-[#5E6AD2]/[0.07] border border-[#5E6AD2]/20 rounded-lg px-3 py-1.5">
                  <ShieldCheck size={11} className="text-[#5E6AD2]" />
                  <span className="text-[10px] font-mono text-[#5E6AD2] uppercase tracking-widest">KYC Verified</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-1.5">
                  <Globe size={11} className="text-[#8A8F98]" />
                  <span className="text-[10px] font-mono text-[#8A8F98] uppercase tracking-widest">Polygon Amoy</span>
                </div>
              </div>

              {/* Form */}
              <SignupForm />

              {/* Divider + Sign In */}
              <div className="flex items-center gap-3 pt-1 border-t border-white/[0.06]" style={{ paddingTop: '1.25rem' }}>
                <div className="flex-1 h-px bg-white/[0.06]" />
                <p className="text-sm text-[#8A8F98]">
                  Already approved?{' '}
                  <Link
                    to="/login"
                    className="text-[#5E6AD2] hover:text-[#7880e0] font-medium transition-colors inline-flex items-center gap-1"
                  >
                    Sign in <ArrowRight size={12} />
                  </Link>
                </p>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

            </div>
          </Card>
        </motion.div>

        {/* Protocol Trust Metadata */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#8A8F98] uppercase tracking-widest">
              <ShieldCheck size={11} className="text-[#5E6AD2]" />
              KYC Verified
            </div>
            <p className="text-[11px] text-[#8A8F98]/55 leading-relaxed">
              Manual review of institution credentials by BhoomiNet admins before approval.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#8A8F98] uppercase tracking-widest">
              <Globe size={11} className="text-[#5E6AD2]" />
              Global Registry
            </div>
            <p className="text-[11px] text-[#8A8F98]/55 leading-relaxed">
              Approved institutions are added to the Polygon Amoy public key whitelist.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default SignupPage;