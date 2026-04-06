import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ShieldCheck, Globe, Landmark, ArrowRight } from 'lucide-react';

import Card from '../components/ui/Card';
import SignupForm from '../components/auth/SignupForm';

const SignupPage = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#050506] overflow-hidden">

      {/* 1. Ambient Background FX */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#5E6AD2]/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* Back Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-10 left-10"
      >
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all text-xs font-medium group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Portal
        </Link>
      </motion.div>

      {/* 2. WIDER CONTAINER: Expanded to 640px for a more breathable form */}
      <div className="w-full max-w-2xl flex flex-col gap-6 relative z-10 my-10">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="p-10 border-white/[0.08] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] bg-[#0A0A0C]/80 backdrop-blur-2xl relative overflow-hidden">
            
            {/* Metallic top border highlight */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#5E6AD2]/50 to-transparent" />

            <div className="flex flex-col gap-8">

              {/* 3. Redesigned Header Section */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-[#5E6AD2]/20 bg-[#5E6AD2]/10 text-[#5E6AD2] text-[10px] font-mono tracking-widest uppercase">
                    <Landmark size={12} /> Institutional Onboarding
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                      Apply for Issuer Access
                    </h1>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-[420px]">
                      Join the network of verified institutions. Once approved, you can issue immutable, blockchain-backed certificates on the BhoomiNet protocol.
                    </p>
                  </div>
                </div>
                
                {/* Right-aligned Icon Graphic */}
                <div className="hidden md:flex w-16 h-16 bg-gradient-to-br from-[#5E6AD2]/20 to-indigo-500/5 border border-[#5E6AD2]/30 rounded-2xl items-center justify-center shadow-[inset_0_0_15px_rgba(94,106,210,0.2)] shrink-0">
                  <ShieldCheck size={28} className="text-[#5E6AD2]" />
                </div>
              </div>

              {/* Form Component */}
              <div className="pt-2">
                 <SignupForm />
              </div>

              {/* Divider + Sign In */}
              <div className="flex items-center gap-4 pt-4 border-t border-white/[0.06]">
                <div className="flex-1 h-[1px] bg-white/[0.05]" />
                <p className="text-sm text-slate-400">
                  Already approved?{' '}
                  <Link
                    to="/login"
                    className="text-[#5E6AD2] hover:text-white font-medium transition-colors inline-flex items-center gap-1 group"
                  >
                    Sign in <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </p>
                <div className="flex-1 h-[1px] bg-white/[0.05]" />
              </div>

            </div>
          </Card>
        </motion.div>

        {/* 4. Protocol Trust Metadata */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="bg-[#0A0A0C]/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 space-y-2 hover:bg-[#0A0A0C]/80 transition-colors group">
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">
              <ShieldCheck size={14} className="text-[#5E6AD2]" />
              KYC Verified
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Manual review of institution credentials by network governance before approval.
            </p>
          </div>

          <div className="bg-[#0A0A0C]/60 backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 space-y-2 hover:bg-[#0A0A0C]/80 transition-colors group">
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">
              <Globe size={14} className="text-[#5E6AD2]" />
              Global Registry
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Approved institutions are permanently added to the Polygon Amoy public key whitelist.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default SignupPage;