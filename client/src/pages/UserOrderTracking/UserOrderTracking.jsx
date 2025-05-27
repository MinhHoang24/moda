import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';

const UserOrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const res = await axiosClient.get('/orders/my-orders');
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        alert('Lấy danh sách đơn hàng thất bại');
      } finally {
        setLoading(false);
      }
    };
    fetchUserOrders();
  }, []);

  if (loading) return <p>Đang tải đơn hàng...</p>;

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', padding: 20 }}>
      <h2>Trạng thái đơn hàng của bạn</h2>
      {orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0" width="100%">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Ngày đặt</th>
              <th>Trạng thái</th>
              <th>Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>{o.status}</td>
                <td>{o.totalAmount?.toLocaleString()} đ</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserOrderTracking;