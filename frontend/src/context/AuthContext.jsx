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
          const userData = res?.data || res;
          if (userData && (userData.email || userData.id)) {
            setUser(userData);
            localStorage.setItem('learnhub_user', JSON.stringify(userData));
          }
        } catch (err) {
          console.warn("Token verification failed with backend:", err);
          // Only clear session if explicitly unauthorized (token invalid/expired)
          if (err.message && (err.message.includes('401') || err.message.toLowerCase().includes('unauthorized'))) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    // Defensive extraction: works with ApiResponse envelope { success, data } or direct object
    const payload = res?.data || res;
    const jwtToken = payload?.token;
    if (jwtToken) {
      const { token: _, ...userData } = payload;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('learnhub_token', jwtToken);
      localStorage.setItem('learnhub_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res?.message || 'Login failed: No authentication token received');
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const payload = res?.data || res;
    const jwtToken = payload?.token;
    if (jwtToken) {
      const { token: _, ...registeredUser } = payload;
      setToken(jwtToken);
      setUser(registeredUser);
      localStorage.setItem('learnhub_token', jwtToken);
      localStorage.setItem('learnhub_user', JSON.stringify(registeredUser));
      return registeredUser;
    }
    throw new Error(res?.message || 'Registration failed: No authentication token received');
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
