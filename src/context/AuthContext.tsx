import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  id: string | number;
  email: string;
  name: string;
  isApproved: boolean; 
  role: 'admin' | 'issuer';
  wallet_connected: boolean;
  wallet_address: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, token: string, userData: User) => void;
  logout: () => void;
  updateWalletStatus: (address: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Since we are NOT using localStorage, the initial state is always null.
  // We set isLoading to false immediately on mount.
  useEffect(() => {
    setIsLoading(false);
  }, []);

  /**
   * Pure In-Memory Login: Data lives only as long as the tab is open.
   */
  const login = (_email: string, authToken: string, userData: User) => {
    setToken(authToken);
    setUser(userData);
  };

  /**
   * Pure In-Memory Logout: Wipes RAM and redirects.
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    window.location.href = '/';
  };

  /**
   * Updates user identity in RAM when MetaMask connects.
   */
  const updateWalletStatus = (address: string) => {
    if (user) {
      setUser({
        ...user,
        wallet_connected: true,
        wallet_address: address
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isLoading, 
      login, 
      logout, 
      updateWalletStatus 
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};