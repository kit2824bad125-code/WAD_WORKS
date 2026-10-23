import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ProviderProfile, UserRole } from '@fixnear/shared';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  providerProfile: ProviderProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  switchDemoAccount: (role: UserRole) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('fixnear_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [providerProfile, setProviderProfile] = useState<ProviderProfile | null>(() => {
    const saved = localStorage.getItem('fixnear_provider_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('fixnear_token');
  });
  const [isLoading, setIsLoading] = useState(true);

  const saveAuth = (accessToken: string, newUser: User, newProfile?: ProviderProfile | null) => {
    setToken(accessToken);
    setUser(newUser);
    setProviderProfile(newProfile || null);
    localStorage.setItem('fixnear_token', accessToken);
    localStorage.setItem('fixnear_user', JSON.stringify(newUser));
    if (newProfile) {
      localStorage.setItem('fixnear_provider_profile', JSON.stringify(newProfile));
    } else {
      localStorage.removeItem('fixnear_provider_profile');
    }
  };

  const login = async (email: string, password: string) => {
    const data = await api.post<{
      accessToken: string;
      user: User;
      providerProfile?: ProviderProfile;
    }>('/auth/login', { email, password });

    saveAuth(data.accessToken, data.user, data.providerProfile);
  };

  const register = async (formData: any) => {
    const data = await api.post<{
      accessToken: string;
      user: User;
    }>('/auth/register', formData);

    saveAuth(data.accessToken, data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setProviderProfile(null);
    localStorage.removeItem('fixnear_token');
    localStorage.removeItem('fixnear_user');
    localStorage.removeItem('fixnear_provider_profile');
    window.location.href = '/login';
  };

  const switchDemoAccount = async (role: UserRole) => {
    let email = 'customer@fixnear.dev';
    if (role === 'SERVICE_PROVIDER') email = 'provider@fixnear.dev';
    if (role === 'ADMIN') email = 'admin@fixnear.dev';

    await login(email, 'FixNear@123');
  };

  const refreshUser = async () => {
    try {
      if (!token) return;
      const data = await api.get<{ user: User; providerProfile?: ProviderProfile }>('/auth/me');
      setUser(data.user);
      setProviderProfile(data.providerProfile || null);
      localStorage.setItem('fixnear_user', JSON.stringify(data.user));
    } catch {
      // Ignore if not logged in
    }
  };

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        providerProfile,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        switchDemoAccount,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
