import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const useAuthFlow = () => {
  const { login } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Phase 1: Local validation (or optional backend check)
  const verifyEmail = async (inputEmail: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Basic email validation regex
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail)) {
        throw new Error("Please enter a valid email address.");
      }
      
      setEmail(inputEmail);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Phase 2: Real Backend Authentication
  const submitPassword = async (password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific 403 (Not Approved) vs 401 (Wrong Creds)
        throw new Error(data.detail || "Authentication failed");
      }

      // Success: data contains { access_token, token_type, role }
      // We map this to your existing AuthContext login function
      login(email, data.access_token, {
        id: "user_from_token", // You can decode JWT for ID if needed
        email: email,
        name: email.split('@')[0], // Placeholder name
        isApproved: true,
        role: data.role as 'admin' | 'issuer'
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setError(null);
  };

  return { step, email, isLoading, error, verifyEmail, submitPassword, handleBack };
};