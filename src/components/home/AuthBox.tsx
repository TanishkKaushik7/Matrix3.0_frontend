import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignupForm from '../auth/SignupForm';
import EmailStep from '../auth/EmailStep';
import PasswordStep from '../auth/PasswordStep';

type AuthMode = 'login' | 'signup';

const AuthBox = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loginStep, setLoginStep] = useState<1 | 2>(1);
  const [tempEmail, setTempEmail] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(false);

  // Handle successful email verification (Step 1)
  const handleEmailSuccess = (email: string, approved: boolean) => {
    setTempEmail(email);
    setIsFirstTime(!approved); // If not previously "set up", trigger password creation
    setLoginStep(2);
  };

  // Reset login flow if user wants to change email
  const handleBackToEmail = () => {
    setLoginStep(1);
    setTempEmail('');
  };

  return (
    <div className="w-full max-w-[440px]">
      {/* Segmented Control / Tabs */}
      <div className="flex p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl mb-8 relative">
        <motion.div
          animate={{ x: mode === 'login' ? 0 : '100%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-white/[0.08] border border-white/10 rounded-lg shadow-sm"
        />
        <button
          onClick={() => { setMode('login'); setLoginStep(1); }}
          className={`relative z-10 w-1/2 py-2 text-sm font-medium transition-colors ${
            mode === 'login' ? 'text-white' : 'text-foreground-muted hover:text-foreground'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setMode('signup')}
          className={`relative z-10 w-1/2 py-2 text-sm font-medium transition-colors ${
            mode === 'signup' ? 'text-white' : 'text-foreground-muted hover:text-foreground'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Form Container */}
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
              {loginStep === 1 ? (
                <EmailStep onSuccess={handleEmailSuccess} />
              ) : (
                <PasswordStep 
                  email={tempEmail} 
                  isFirstTime={isFirstTime} 
                  onBack={handleBackToEmail}
                  onFinalSuccess={(token) => console.log("Logged in with:", token)}
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