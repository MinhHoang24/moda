// /src/pages/Home/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Chào mừng đến với mhoang</h1>
      <p>Trang chủ của bạn, có thể thêm banner, giới thiệu, khuyến mãi, ...</p>
      <Link to="/products">Xem sản phẩm</Link>
    </div>
  );
};

export default Home;