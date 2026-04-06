import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

/**
 * Interface for the Institution User [cite: 5, 6, 7, 8]
 */
// Inside AuthContext.tsx
interface User {
  id: string;
  email: string;
  name: string;
  isApproved: boolean; 
  walletAddress?: string;
  role: 'admin' | 'issuer'; // <-- ADD THIS LINE
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, token: string, userData: User) => void;
  logout: () => void;
  updateApprovalStatus: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Persistence: Check for existing session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('bn_auth_token');
    const storedUser = localStorage.getItem('bn_user_data');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  /**
   * Handles the successful login after PasswordStep.tsx
   */
  const login = (email: string, authToken: string, userData: User) => {
    setToken(authToken);
    setUser(userData);
    localStorage.setItem('bn_auth_token', authToken);
    localStorage.setItem('bn_user_data', JSON.stringify(userData));
  };

  /**
   * Clears session and redirects to Home
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('bn_auth_token');
    localStorage.removeItem('bn_user_data');
    window.location.href = '/';
  };

  /**
   * Syncs with Admin approval status 
   */
  const updateApprovalStatus = (status: boolean) => {
    if (user) {
      const updatedUser = { ...user, isApproved: status };
      setUser(updatedUser);
      localStorage.setItem('bn_user_data', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isLoading, 
      login, 
      logout, 
      updateApprovalStatus 
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook for accessing Auth state
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};