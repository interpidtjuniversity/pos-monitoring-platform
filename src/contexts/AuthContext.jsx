import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查本地存储中是否有token
    const storedToken = localStorage.getItem('admin_token');
    if (storedToken) {
      // 检查token是否过期
      const expirationTime = localStorage.getItem('token_expiration');
      if (expirationTime && new Date().getTime() < parseInt(expirationTime)) {
        setToken(storedToken);
        setIsAuthenticated(true);
      } else {
        // Token已过期，清除本地存储
        localStorage.removeItem('admin_token');
        localStorage.removeItem('token_expiration');
      }
    }
    setLoading(false);
  }, []);

  const login = (token, expiresIn) => {
    const expirationTime = new Date().getTime() + (expiresIn * 1000);
    localStorage.setItem('admin_token', token);
    localStorage.setItem('token_expiration', expirationTime.toString());
    setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('token_expiration');
    setToken(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    token,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;