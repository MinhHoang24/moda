import React, { useEffect, useState } from 'react';
import axiosClient from '../../../api/axiosClient';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axiosClient.get('/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

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
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && (
            <tr><td colSpan="5">Chưa có đơn hàng nào</td></tr>
          )}
          {orders.map(o => (
            <tr key={o._id}>
              <td>{o._id}</td>
              <td>{o.customerName || 'N/A'}</td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td>{o.status}</td>
              <td>{o.totalPrice?.toLocaleString()} đ</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;