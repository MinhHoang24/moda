import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { userRole } = useContext(AuthContext);
  if (userRole !== 'admin') return <Navigate to="/" />;
  return children;
};

export default AdminRoute;