import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('carserv_token') || null);
  const [loading, setLoading] = useState(true);

  // Set default axios headers
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  // Load current user profile if token exists
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/api/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Session expired or error:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const login = async (identifier, password, userType) => {
    const res = await axios.post('/api/auth/login', { identifier, password, userType });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('carserv_token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (payload) => {
    const res = await axios.post('/api/auth/register', payload);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('carserv_token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const loginAsDemo = async (role = 'Customer') => {
    const res = await axios.post('/api/auth/demo-login', { role });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('carserv_token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      return res.data.user;
    }
    throw new Error(res.data.message || 'Demo login failed');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('carserv_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        loginAsDemo,
        logout,
        isAuthenticated: !!token && !!user,
        isCustomer: user?.userType === 'Customer',
        isPartner: user?.userType === 'ServiceCenter',
        isAdmin: user?.userType === 'Admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
