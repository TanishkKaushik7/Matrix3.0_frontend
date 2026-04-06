import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ShieldCheck, Globe, Landmark, ArrowRight } from 'lucide-react';

import Card from '../components/ui/Card';
import SignupForm from '../components/auth/SignupForm';

const SignupPage = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 bg-transparent overflow-hidden">

      {/* Ambient Lighting for the wider card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5E6AD2]/8 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Back Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 left-8"
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-[#8A8F98] hover:text-white transition-colors text-sm font-medium group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Portal
        </Link>
      </motion.div>

      {/* WIDER CONTAINER: Matched to LoginPage (500px) */}
      <div className="w-full max-w-[500px] flex flex-col gap-6 relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <Card className="p-10 border-white/[0.08] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] bg-[#0A0A0C]/80 backdrop-blur-xl relative overflow-hidden">
            
            {/* Subtle top border highlight */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#5E6AD2]/40 to-transparent" />

            <div className="flex flex-col gap-7">

              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  {/* Upgraded Icon Container */}
                  <div className="w-12 h-12 bg-gradient-to-br from-[#5E6AD2]/20 to-indigo-500/5 border border-[#5E6AD2]/30 rounded-xl flex items-center justify-center shadow-[inset_0_0_12px_rgba(94,106,210,0.2)]">
                    <Landmark size={20} className="text-[#5E6AD2]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#5E6AD2] uppercase tracking-[0.25em]">
                      Institutional Onboarding
                    </span>
                  </div>
                </div>

                <h1 className="text-2xl font-semibold text-white mb-2 tracking-tight">
                  Apply for Issuer Access
                </h1>
                <p className="text-sm text-[#8A8F98] leading-relaxed">
                  Join the network of verified institutions. Once approved, you can issue immutable, blockchain-backed certificates.
                </p>
              </div>

              {/* Trust Badges — inline, above the form */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-[#5E6AD2]/[0.07] border border-[#5E6AD2]/20 rounded-lg px-3 py-1.5 shadow-sm">
                  <ShieldCheck size={12} className="text-[#5E6AD2]" />
                  <span className="text-[10px] font-mono text-[#5E6AD2] uppercase tracking-widest">KYC Verified</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-1.5 shadow-sm">
                  <Globe size={12} className="text-[#8A8F98]" />
                  <span className="text-[10px] font-mono text-[#8A8F98] uppercase tracking-widest">Polygon Amoy</span>
                </div>
              </div>

              {/* Form */}
              <SignupForm />

              {/* Divider + Sign In */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <p className="text-sm text-[#8A8F98]">
                  Already approved?{' '}
                  <Link
                    to="/login"
                    className="text-[#5E6AD2] hover:text-[#7880e0] font-medium transition-colors inline-flex items-center gap-1 group"
                  >
                    Sign in <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
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
          <div className="bg-[#0A0A0C]/60 backdrop-blur-md border border-white/[0.06] rounded-xl p-5 space-y-2 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#8A8F98] uppercase tracking-widest">
              <ShieldCheck size={12} className="text-[#5E6AD2]" />
              KYC Verified
            </div>
            <p className="text-[11px] text-[#8A8F98]/60 leading-relaxed font-mono">
              Manual review of institution credentials by admins before approval.
            </p>
          </div>

          <div className="bg-[#0A0A0C]/60 backdrop-blur-md border border-white/[0.06] rounded-xl p-5 space-y-2 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#8A8F98] uppercase tracking-widest">
              <Globe size={12} className="text-[#5E6AD2]" />
              Global Registry
            </div>
            <p className="text-[11px] text-[#8A8F98]/60 leading-relaxed font-mono">
              Approved institutions are added to the Polygon Amoy public key whitelist.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default SignupPage;