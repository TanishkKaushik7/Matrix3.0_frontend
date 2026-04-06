import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Logic to catch if the .env variable is missing
const API_BASE = import.meta.env.VITE_API_URL;

export const useAuthFlow = () => {
  const { login } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyEmail = async (inputEmail: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail)) {
        throw new Error("Please enter a valid institutional email.");
      }
      setEmail(inputEmail);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const submitPassword = async (password: string) => {
    // Safety check: if API_BASE is missing, don't even try to fetch
    if (!API_BASE) {
      setError("Configuration Error: VITE_API_URL is not defined in .env");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // 1. Check if the response is actually JSON before parsing
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server error: Expected JSON but got ${contentType || 'text'}. (Status: ${response.status})`);
      }

      const data = await response.json();

      // 2. Handle Logic Errors
      if (!response.ok) {
        if (Array.isArray(data.detail)) {
          throw new Error(data.detail[0].msg);
        }
        throw new Error(data.detail || "Authentication failed");
      }

      // 3. Success Login
      login(email, data.access_token, {
        id: `user_${Date.now()}`, 
        email: email,
        name: email.split('@')[0],
        isApproved: true, 
        role: data.role as 'admin' | 'issuer'
      });

    } catch (err: any) {
      // Handle Network errors (Server down)
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        setError("Network error: Cannot reach the backend. Is it running?");
      } else {
        setError(err.message);
      }
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