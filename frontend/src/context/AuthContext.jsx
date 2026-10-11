import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('learnhub_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('learnhub_token');
      const storedUser = localStorage.getItem('learnhub_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Verify with backend
          const res = await api.get('/auth/me');
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('learnhub_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error("Token verification failed, logging out:", err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.data) {
      const { token, ...userData } = res.data;
      setToken(token);
      setUser(userData);
      localStorage.setItem('learnhub_token', token);
      localStorage.setItem('learnhub_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.success && res.data) {
      const { token, ...registeredUser } = res.data;
      setToken(token);
      setUser(registeredUser);
      localStorage.setItem('learnhub_token', token);
      localStorage.setItem('learnhub_user', JSON.stringify(registeredUser));
      return registeredUser;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('learnhub_token');
    localStorage.removeItem('learnhub_user');
  };

  const isStudent = user?.role === 'ROLE_STUDENT';
  const isInstructor = user?.role === 'ROLE_INSTRUCTOR';
  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isStudent,
        isInstructor,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
