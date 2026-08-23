'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, AuthUser } from '../services/authService';

export type UserRoleType = 'FARMER' | 'BUYER' | 'FPO' | 'ADMIN';

interface AuthContextType {
  currentUser: AuthUser | null;
  currentRole: UserRoleType;
  isAuthenticated: boolean;
  loading: boolean;
  loginAsRole: (role: UserRoleType) => Promise<void>;
  logout: () => void;
  isFarmer: boolean;
  isBuyer: boolean;
  isFPO: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRoleType>('FARMER');
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth on load
  useEffect(() => {
    async function initAuth() {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setCurrentRole(user.role);
        } else {
          // Default initial demo session as Farmer
          const defaultUser: AuthUser = {
            id: 1,
            phone_number: '9823012345',
            name: 'Rameshwar Patil',
            email: 'farmer@demo.krishisetu',
            role: 'FARMER',
            role_display: 'Farmer',
            location: 'Dindori, Nashik',
          };
          setCurrentUser(defaultUser);
          setCurrentRole('FARMER');
        }
      } catch (e) {
        console.warn('Auth init failed:', e);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  const loginAsRole = async (role: UserRoleType) => {
    setLoading(true);
    try {
      const res = await authService.loginAsDemoUser(role);
      if (res && res.user) {
        setCurrentUser(res.user);
        setCurrentRole(res.user.role);
      } else {
        // Fallback demo state
        const names: Record<UserRoleType, string> = {
          FARMER: 'Rameshwar Patil',
          BUYER: 'Aniket Deshmukh (Reliance Fresh Hub)',
          FPO: 'Sahyadri Agro Farmers Co.',
          ADMIN: 'System Administrator',
        };
        const demoUser: AuthUser = {
          id: role === 'FARMER' ? 1 : role === 'BUYER' ? 2 : role === 'FPO' ? 3 : 4,
          phone_number: role === 'FARMER' ? '9823012345' : '9823098765',
          name: names[role],
          email: `${role.toLowerCase()}@demo.krishisetu`,
          role: role,
          role_display: role,
        };
        setCurrentUser(demoUser);
        setCurrentRole(role);
      }
    } catch (e) {
      console.warn(`Login as ${role} failed:`, e);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentRole('FARMER');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated: !!currentUser,
        loading,
        loginAsRole,
        logout,
        isFarmer: currentRole === 'FARMER',
        isBuyer: currentRole === 'BUYER',
        isFPO: currentRole === 'FPO',
        isAdmin: currentRole === 'ADMIN',
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
