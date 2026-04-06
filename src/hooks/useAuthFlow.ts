import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook to manage the phased authentication logic:
 * Step 1: Email Check -> Step 2: Password/Set Password
 */
export const useAuthFlow = () => {
  const { login } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Phase 1: Verify if the email belongs to an authorized institution 
   */
  const verifyEmail = async (inputEmail: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Logic: API call to check institution status
      // const response = await api.post('/auth/check-status', { email: inputEmail });
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setEmail(inputEmail);
      setIsApproved(true); // Example: Mocking that the admin has whitelisted them 
      setStep(2);
    } catch (err) {
      setError("Institution not found or pending admin approval.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Phase 2: Finalize login or password creation
   */
  const submitPassword = async (password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Logic: Authenticate and receive JWT from FastAPI [cite: 43]
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const mockUserData = {
        id: "inst_01",
        email: email,
        name: "Verified University",
        isApproved: true,
      };

      login(email, "mock_jwt_token", mockUserData);
    } catch (err) {
      setError("Invalid password. Access denied.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setError(null);
  };

  return {
    step,
    email,
    isApproved,
    isLoading,
    error,
    verifyEmail,
    submitPassword,
    handleBack
  };
};