// /src/pages/Profile/Profile.jsx
import React, { useEffect, useState, useContext } from 'react';
import axiosClient from '../../api/axiosClient';
import { AuthContext } from '../../contexts/AuthContext';
import './Profile.css';

const Profile = () => {
  const { userToken } = useContext(AuthContext);
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosClient.get('/users/profile', {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        setUser(res.data);
      } catch (err) {
        setMessage('Lỗi khi tải thông tin');
      } finally {
        setLoading(false);
      }
    };

    if (userToken) fetchProfile();
  }, [userToken]);

  const handleChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      await axiosClient.put('/user/profile', user, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setMessage('Cập nhật thông tin thành công!');
    } catch (err) {
      setMessage('Cập nhật thất bại');
    }
  };

  if (loading) return <p>Đang tải thông tin...</p>;

  return (
    <div className="profile-container">
      <h2>Thông tin cá nhân</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Họ tên:
          <input type="text" name="name" value={user.name} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={user.email} disabled />
        </label>
        <label>
          Số điện thoại:
          <input type="text" name="phone" value={user.phone} onChange={handleChange} />
        </label>
        <label>
          Địa chỉ:
          <textarea name="address" value={user.address} onChange={handleChange} />
        </label>
        <button type="submit">Cập nhật</button>
      </form>
    </div>
  );
};

export default Profile;