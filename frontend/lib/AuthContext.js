/**
 * Authentication Context Provider
 */
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip auth check since backend doesn't require authentication
    setLoading(false);
  }, []);

  const checkAuth = async () => {
    // Authentication disabled - backend works without login
    setLoading(false);
  };

  const login = async (idToken) => {
    // Login disabled for MVP - all users can use the app
    console.log('Login skipped - authentication not required');
    return { user: null };
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
