import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignupForm from '../auth/SignupForm';
import EmailStep from '../auth/EmailStep';
import PasswordStep from '../auth/PasswordStep';
import { useAuthFlow } from '../../hooks/useAuthFlow';

type AuthMode = 'login' | 'signup';

const AuthBox = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  
  // Connect to our central auth logic
  const { 
    step, 
    email, 
    isLoading, 
    error, 
    verifyEmail, 
    submitPassword, 
    handleBack 
  } = useAuthFlow();

  return (
    <div className="w-full max-w-[440px]">
      {/* --- Segmented Control (Tabs) --- */}
      <div className="flex p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl mb-8 relative">
        <motion.div
          layoutId="activeTab"
          animate={{ x: mode === 'login' ? 0 : '100%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-white/[0.08] border border-white/10 rounded-lg shadow-sm"
        />
        
        <button
          onClick={() => { setMode('login'); }}
          className={`relative z-10 w-1/2 py-2 text-sm font-medium transition-colors ${
            mode === 'login' ? 'text-white' : 'text-[#8A8F98] hover:text-[#EDEDEF]'
          }`}
        >
          Login
        </button>
        
        <button
          onClick={() => setMode('signup')}
          className={`relative z-10 w-1/2 py-2 text-sm font-medium transition-colors ${
            mode === 'signup' ? 'text-white' : 'text-[#8A8F98] hover:text-[#EDEDEF]'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* --- Form Container --- */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {mode === 'signup' ? (
            <motion.div
              key="signup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <SignupForm />
            </motion.div>
          ) : (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {step === 1 ? (
                /* Aligned with updated EmailStep props */
                <EmailStep 
                  onSubmit={verifyEmail} 
                  isLoading={isLoading} 
                  externalError={error} 
                />
              ) : (
                /* Aligned with updated PasswordStep props */
                <PasswordStep 
                  email={email} 
                  onSubmit={submitPassword}
                  onBack={handleBack}
                  isLoading={isLoading}
                  externalError={error}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthBox;