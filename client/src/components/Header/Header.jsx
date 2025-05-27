import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { userToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/">mhoang</Link>
      </div>
      <nav className="header-nav">
        <nav className='header-nav-left'>
            <Link to="/">Trang Chủ</Link>
            <Link to="/products">Sản Phẩm</Link>
            <Link to="/cart">Giỏ Hàng</Link>
            <Link to="/profile">Trang Cá Nhân</Link>
            <Link to="/orders/my-orders">Đơn hàng của bạn</Link>
        </nav>
        <nav className='header-nav-right'>
            {userToken ? (
            <>
                <button onClick={handleLogout} className="btn-logout">Đăng xuất</button>
            </>
            ) : (
            <>
                <Link to="/login">Đăng nhập</Link>
                <Link to="/register">Đăng ký</Link>
            </>
            )}
        </nav>
      </nav>
    </header>
  );
};

export default Header;