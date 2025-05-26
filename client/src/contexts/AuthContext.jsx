import React, { createContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const tokenFromStorage = localStorage.getItem('token');
  const [userToken, setUserToken] = useState(tokenFromStorage || null);
  const [userRole, setUserRole] = useState(() => {
    if (tokenFromStorage) {
      try {
        const decoded = jwtDecode(tokenFromStorage);
        return decoded.role || null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = (token) => {
    localStorage.setItem('token', token);
    setUserToken(token);
    try {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role);
    } catch {
      setUserRole(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUserToken(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};