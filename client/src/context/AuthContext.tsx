import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  username?: string;
  role: string;
}

interface AuthContextType {
  accessToken: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  updateProfile: (username: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
    setAccessToken(response.data.accessToken);
    setUser(response.data.user);
    localStorage.setItem('refreshToken', response.data.refreshToken);
  };

  const register = async (email: string, password: string) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, { email, password });
    } catch (error: any) {
      console.error('Registration API error:', error.response?.data, error.message);
      throw error;
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('refreshToken');
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, { refreshToken });
    setAccessToken(response.data.accessToken);
  };

  const updateProfile = async (username: string) => {
    if (!accessToken) throw new Error('Not authenticated');
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/user/profile`,
      { username },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    setUser(response.data);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshAccessToken().catch(() => logout());
    }, 14 * 60 * 1000); // Refresh every 14 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout, register, refreshAccessToken, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
