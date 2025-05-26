import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './AdminMenu.css';

const AdminMenu = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <nav className="admin-menu">
      <h3>Quản trị viên</h3>
      <ul>
        <li>
          <NavLink to="/admin/add-product" className={({ isActive }) => isActive ? 'active' : ''}>
            Thêm sản phẩm
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'active' : ''}>
            Quản lý sản phẩm
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'active' : ''}>
            Quản lý đơn hàng
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''}>
            Quản lý người dùng
          </NavLink>
        </li>
        <li>
          <button onClick={handleLogout} className="logout-btn">
            Đăng xuất
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default AdminMenu;