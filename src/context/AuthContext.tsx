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
const AUTH_SESSION_KEY = 'auth_session_v1';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistSession = (authToken: string, userData: User) => {
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.setItem(
        AUTH_SESSION_KEY,
        JSON.stringify({ token: authToken, user: userData })
      );
    } catch (storageError) {
      console.warn('Unable to persist auth session:', storageError);
    }
  };

  const clearSession = () => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
    } catch (storageError) {
      console.warn('Unable to clear auth session:', storageError);
    }
  };

  // Restore session on refresh so users stay logged in while tab is open.
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    try {
      const raw = sessionStorage.getItem(AUTH_SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { token?: string; user?: User };
        if (parsed?.token && parsed?.user) {
          setToken(parsed.token);
          setUser(parsed.user);
        }
      }
    } catch (storageError) {
      console.warn('Unable to restore auth session:', storageError);
      clearSession();
    }

    setIsLoading(false);
  }, []);

  /**
   * Login and persist auth state so refresh does not log the user out.
   */
  const login = (_email: string, authToken: string, userData: User) => {
    setToken(authToken);
    setUser(userData);
    persistSession(authToken, userData);
  };

  /**
   * Logout wipes RAM + session storage, then redirects.
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    clearSession();
    window.location.href = '/';
  };

  /**
   * Updates user identity and keeps session storage in sync.
   */
  const updateWalletStatus = (address: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        wallet_connected: true,
        wallet_address: address
      };

      setUser(updatedUser);
      if (token) {
        persistSession(token, updatedUser);
      }
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