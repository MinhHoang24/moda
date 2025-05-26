import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosClient from '../api/axiosClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const tokenFromStorage = localStorage.getItem('token');

  const [userToken, setUserToken] = useState(tokenFromStorage || null);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Giải mã token để lấy role
  useEffect(() => {
    if (tokenFromStorage) {
      try {
        const decoded = jwtDecode(tokenFromStorage);
        setUserRole(decoded.role || null);
      } catch (err) {
        setUserRole(null);
      }
    }
    setLoading(false);
  }, [tokenFromStorage]);

  // Hàm fetch profile user từ backend
  const fetchUserProfile = async (token) => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (error) {
      console.error('Lỗi lấy profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Hàm login: lưu token, decode role, lấy profile user
  const login = async (token) => {
    localStorage.setItem('token', token);
    setUserToken(token);
    try {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role);
    } catch {
      setUserRole(null);
    }
    await fetchUserProfile(token);
  };

  // Khi app khởi động hoặc token thay đổi thì lấy profile user
  useEffect(() => {
    if (userToken) {
      fetchUserProfile(userToken);
    } else {
      setUser(null);
      setUserRole(null);
    }
  }, [userToken]);

  // Logout: xóa token, user, role
  const logout = () => {
    localStorage.removeItem('token');
    setUserToken(null);
    setUserRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ userToken, userRole, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};