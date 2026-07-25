import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, logoutUser } from '../services/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    const stored = window.localStorage.getItem('vendorVoice-user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(typeof window !== 'undefined' && window.localStorage.getItem('vendorVoice-user')));
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await getCurrentUser();
        const currentUser = response?.data?.data?.user || response?.data?.user;
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
          window.localStorage.setItem('vendorVoice-user', JSON.stringify(currentUser));
        } else {
          throw new Error('No active user.');
        }
      } catch {
        setUser(null);
        setIsAuthenticated(false);
        window.localStorage.removeItem('vendorVoice-user');
      } finally {
        setIsAuthLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (user && isAuthenticated) {
      window.localStorage.setItem('vendorVoice-user', JSON.stringify(user));
    } else {
      window.localStorage.removeItem('vendorVoice-user');
    }
  }, [user, isAuthenticated]);

  const signOut = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore logout errors, still clear local state
    }
    setUser(null);
    setIsAuthenticated(false);
    window.localStorage.removeItem('vendorVoice-user');
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated,
      setIsAuthenticated,
      isAuthLoading,
      signOut,
    }),
    [user, isAuthenticated, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
