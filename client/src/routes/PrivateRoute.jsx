import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { userToken } = useContext(AuthContext);

  if (!userToken) {
    // Nếu chưa đăng nhập, chuyển về trang login
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;