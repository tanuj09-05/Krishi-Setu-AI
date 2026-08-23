'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService, AuthUser } from '../services/authService';

export type UserRoleType = 'FARMER' | 'BUYER' | 'FPO' | 'ADMIN';

interface AuthContextType {
  currentUser: AuthUser | null;
  currentRole: UserRoleType;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { email?: string; phone_number?: string; password?: string; otp?: string }) => Promise<any>;
  signup: (signupData: any) => Promise<any>;
  logout: () => void;
  updateProfile: (data: any) => Promise<AuthUser | null>;
  changePassword: (oldPassword: string, newPassword: string, confirmNewPassword?: string) => Promise<any>;
  loginAsRole: (role: UserRoleType) => Promise<void>;
  isFarmer: boolean;
  isBuyer: boolean;
  isFPO: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password', '/market', '/markets'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRoleType>('FARMER');
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth on page load
  useEffect(() => {
    async function initAuth() {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setCurrentRole((user.role as UserRoleType) || 'FARMER');
        } else {
          setCurrentUser(null);
        }
      } catch (e) {
        console.warn('Auth initialization error:', e);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (credentials: { email?: string; phone_number?: string; password?: string; otp?: string }) => {
    setLoading(true);
    try {
      const res = await authService.login(credentials);
      if (res && res.user) {
        setCurrentUser(res.user);
        setCurrentRole(res.user.role || 'FARMER');
        return res;
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (signupData: any) => {
    setLoading(true);
    try {
      const res = await authService.register(signupData);
      if (res && res.user) {
        setCurrentUser(res.user);
        setCurrentRole(res.user.role || 'FARMER');
        return res;
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const loginAsRole = async (role: UserRoleType) => {
    setLoading(true);
    try {
      const res = await authService.loginAsDemoUser(role);
      if (res && res.user) {
        setCurrentUser(res.user);
        setCurrentRole(res.user.role);
      }
    } catch (e) {
      console.warn(`Login as ${role} failed:`, e);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: any) => {
    const updated = await authService.updateProfile(data);
    if (updated) {
      setCurrentUser(updated);
      if (updated.role) setCurrentRole(updated.role as UserRoleType);
    }
    return updated;
  };

  const changePassword = async (oldPassword: string, newPassword: string, confirmNewPassword?: string) => {
    return await authService.changePassword({
      old_password: oldPassword,
      new_password: newPassword,
      confirm_new_password: confirmNewPassword,
    });
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentRole('FARMER');
    router.push('/login');
  };

  const isFarmer = currentRole === 'FARMER';
  const isBuyer = currentRole === 'BUYER';
  const isFPO = currentRole === 'FPO';
  const isAdmin = currentRole === 'ADMIN';
  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        changePassword,
        loginAsRole,
        isFarmer,
        isBuyer,
        isFPO,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
