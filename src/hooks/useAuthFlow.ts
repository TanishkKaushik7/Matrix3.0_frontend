import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const RAW_API_BASE = import.meta.env.VITE_API_URL;
// Ensures no trailing slash logic for consistent API routing
const API_BASE = RAW_API_BASE?.endsWith('/') ? RAW_API_BASE.slice(0, -1) : RAW_API_BASE;

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
      // Basic institutional email validation regex
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
    if (!API_BASE) {
      setError("Configuration Error: VITE_API_URL is missing.");
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

      // Guard against non-JSON error pages (like 404 or 500 HTML)
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server connection failed (Status: ${response.status}).`);
      }

      const data = await response.json();

      if (!response.ok) {
        if (Array.isArray(data.detail)) {
          throw new Error(data.detail[0].msg);
        }
        throw new Error(data.detail || "Authentication failed");
      }

      /**
       * PURE IN-MEMORY STATE INJECTION
       * Backend response mapping: 
       * { access_token, role, wallet_connected, wallet_address, issuer_id }
       */
      login(email, data.access_token, {
        id: data.issuer_id, 
        email: email,
        name: email.split('@')[0], // UI placeholder for Name
        role: data.role as 'admin' | 'issuer',
        isApproved: true, // Assuming login permission implies approval
        wallet_connected: data.wallet_connected, 
        wallet_address: data.wallet_address 
      });

    } catch (err: any) {
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        setError("Network error: BhoomiNet Node is unreachable.");
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