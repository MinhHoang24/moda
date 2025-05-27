import React, { useEffect, useState } from 'react';
import axiosClient from '../../../api/axiosClient';

const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({}); // lưu trạng thái đang chọn

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axiosClient.get('/orders')
      .then(res => {
        const ordersData = res.data.map(o => ({
          _id: o._id,
          name: o.name,
          createdAt: o.createdAt,
          status: o.status,
          totalPrice: o.totalPrice,
        }));
        setOrders(ordersData);

        // Khởi tạo trạng thái chọn mặc định
        const initStatus = {};
        ordersData.forEach(o => {
          initStatus[o._id] = o.status;
        });
        setStatusUpdates(initStatus);
      })
      .catch(err => console.error(err));
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Bạn có chắc muốn xóa đơn hàng này không?')) return;

    try {
      await axiosClient.delete(`/orders/${orderId}`);
      setOrders(orders.filter(o => o._id !== orderId));
    } catch {
      alert('Xóa đơn hàng thất bại.');
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setStatusUpdates(prev => ({ ...prev, [orderId]: newStatus }));
  };

  const handleUpdateStatus = async (orderId) => {
    const newStatus = statusUpdates[orderId];
    try {
      await axiosClient.put(`/orders/${orderId}/status`, { status: newStatus });
      alert('Cập nhật trạng thái thành công');
      fetchOrders(); // tải lại danh sách đơn hàng
    } catch {
      alert('Cập nhật trạng thái thất bại');
    }
  };

  return (
    <div>
      <h2>Quản lý đơn hàng</h2>
      <table border="1" cellPadding="8" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Ngày đặt</th>
            <th>Trạng thái</th>
            <th>Tổng tiền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && (
            <tr><td colSpan="6">Chưa có đơn hàng nào</td></tr>
          )}
          {orders.map(o => (
            <tr key={o._id}>
              <td>{o._id}</td>
              <td>{o.name || 'N/A'}</td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td>
                <select
                  value={statusUpdates[o._id] || o.status}
                  onChange={e => handleStatusChange(o._id, e.target.value)}
                >
                  {validStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <button onClick={() => handleUpdateStatus(o._id)} style={{ marginLeft: 8 }}>
                  Cập nhật
                </button>
              </td>
              <td>{o.totalPrice?.toLocaleString()} đ</td>
              <td>
                <button onClick={() => handleDelete(o._id)} style={{ color: 'red' }}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;