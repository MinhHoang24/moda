import React, { useContext } from 'react';
import AdminMenu from '../../../components/AdminMenu/AdminMenu';
import { AuthContext } from '../../../contexts/AuthContext';
import { Outlet } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminMenu onLogout={logout} />
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet /> {/* Đây sẽ render các trang con admin */}
      </main>
    </div>
  );
};

export default Admin;