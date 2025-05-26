import React, { useState, useContext } from 'react';
import axiosClient from '../../api/axiosClient';
import { AuthContext } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axiosClient.post('/auth/login', form);
      login(res.data.token);   // lưu token vào context và localStorage
      navigate('/');           // chuyển đến trang chủ sau khi đăng nhập thành công
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Mật khẩu" value={form.password} onChange={handleChange} required />
        <button type="submit">Đăng nhập</button>
      </form>
      <p style={{ display: 'flex', justifyContent: 'space-between' }}>Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
    </div>
  );
};

export default Login;