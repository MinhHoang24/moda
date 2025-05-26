import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import './Register.css';
import { Link } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
    // eslint-disable-next-line no-unused-vars
      const res = await axiosClient.post('/auth/register', form);
      setSuccess('Đăng ký thành công! Bạn có thể đăng nhập ngay.');
      setForm({ name: '', email: '', password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="register-container">
      <h2>Đăng ký</h2>
      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Họ tên"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Đăng ký</button>
      </form>
      <p style={{ display: 'flex', justifyContent: 'space-between' }}>Bạn đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link></p>
    </div>
  );
};

export default Register;