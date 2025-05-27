import React, { useEffect, useState } from 'react';
import axiosClient from '../../../api/axiosClient';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axiosClient.get('/admin/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('Dữ liệu user nhận được:', res.data);
        setUsers(res.data);
      } catch (err) {
        console.error('Lỗi lấy user:', err);
        setError('Lỗi khi tải danh sách người dùng.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  // Hàm xử lý chỉnh sửa (ví dụ chuyển sang trang chỉnh sửa hoặc mở modal)
  const handleEdit = (userId) => {
    alert(`Chỉnh sửa user có ID: ${userId}`);
    // TODO: Điều hướng hoặc mở modal chỉnh sửa user
  };

  // Hàm xử lý xóa user
  const handleDelete = async (userId) => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này không?')) return;

    try {
      await axiosClient.delete(`/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      alert('Xóa người dùng thất bại.');
    }
  };


  if (loading) return <p>Đang tải danh sách người dùng...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', padding: 20 }}>
      <h2>Quản lý người dùng</h2>
      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        width="100%"
        style={{ borderCollapse: 'collapse', textAlign: 'left' }}
      >
        <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
          <tr>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.phone}</td>
                <td>{u.address}</td>
                <td>{formatDate(u.createdAt)}</td>
                <td>
                  <button
                    onClick={() => handleEdit(u._id)}
                    style={{ marginRight: 8 }}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    style={{ color: 'red' }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>
                Chưa có người dùng nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;