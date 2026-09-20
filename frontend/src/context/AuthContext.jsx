import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('cakeshop_token');
      const savedUser = localStorage.getItem('cakeshop_user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Failed to parse saved user', error);
          localStorage.removeItem('cakeshop_token');
          localStorage.removeItem('cakeshop_user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    const { token, ...userData } = response.data.data;
    
    localStorage.setItem('cakeshop_token', token);
    localStorage.setItem('cakeshop_user', JSON.stringify(userData));
    setUser(userData);
    return response.data;
  };

  const register = async (name, email, password, role = 'user') => {
    const response = await API.post('/auth/register', { name, email, password, role });
    const { token, ...userData } = response.data.data;

    localStorage.setItem('cakeshop_token', token);
    localStorage.setItem('cakeshop_user', JSON.stringify(userData));
    setUser(userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('cakeshop_token');
    localStorage.removeItem('cakeshop_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
