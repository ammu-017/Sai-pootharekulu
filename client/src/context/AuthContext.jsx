import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('sai_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('sai_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/profile');
          if (res.data.success) {
            setUser((prev) => ({ ...prev, ...res.data.user }));
            localStorage.setItem(
              'sai_user',
              JSON.stringify({ ...user, ...res.data.user })
            );
          }
        } catch (error) {
          console.warn('Session expired or invalid token:', error.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: userToken, ...userData } = res.data.user;
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('sai_token', userToken);
      localStorage.setItem('sai_user', JSON.stringify(userData));
      return res.data;
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      const { token: userToken, ...userInfo } = res.data.user;
      setUser(userInfo);
      setToken(userToken);
      localStorage.setItem('sai_token', userToken);
      localStorage.setItem('sai_user', JSON.stringify(userInfo));
      return res.data;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sai_token');
    localStorage.removeItem('sai_user');
  };

  const updateProfile = async (updatedData) => {
    const res = await api.put('/auth/profile', updatedData);
    if (res.data.success) {
      const { token: newToken, ...userInfo } = res.data.user;
      setUser(userInfo);
      if (newToken) {
        setToken(newToken);
        localStorage.setItem('sai_token', newToken);
      }
      localStorage.setItem('sai_user', JSON.stringify(userInfo));
      return res.data;
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

