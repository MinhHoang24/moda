import React, { useContext, useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { AuthContext } from '../../contexts/AuthContext';
import { CartContext } from '../../contexts/CartContext';
import './Checkout.css';

const Checkout = () => {
  const { user, token, loading } = useContext(AuthContext);
  const { cartItems, clearCart } = useContext(CartContext);

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderLoading, setOrderLoading] = useState(false);

  // Cập nhật phone, address khi user thay đổi
  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await axiosClient.get('/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPhone(res.data.phone || '');
      setAddress(res.data.address || '');
    } catch (error) {
      console.error('Lỗi lấy profile:', error);
    }
  };

  fetchProfile();
}, [token]);

  // Nếu đang tải dữ liệu user, hiện loading
  if (loading) {
    return <div className="checkout-loading">Đang tải thông tin người dùng...</div>;
  }

  // Nếu không có user, yêu cầu đăng nhập
  if (!user) {
    return <div>Vui lòng đăng nhập để tiếp tục thanh toán.</div>;
  }

  // Phần còn lại của component...
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOrderLoading(true);

    try {
        // Gộp địa chỉ thành chuỗi để phù hợp schema
        const shippingAddressStr = `${address} - SĐT: ${phone}`;

        const orderPayload = {
        items: cartItems.map(item => ({
            productId: item._id,
            quantity: item.quantity,
            price: item.price,
        })),
        shippingAddress: shippingAddressStr,  // gửi chuỗi
        paymentMethod: paymentMethod,
        totalAmount: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        };

        await axiosClient.post('/orders', orderPayload, {
        headers: { Authorization: `Bearer ${token}` },
        });

        alert('Đặt hàng thành công!');
        clearCart();
    } catch (error) {
        console.error('Lỗi đặt hàng:', error);
        alert('Đặt hàng thất bại, vui lòng thử lại.');
    } finally {
        setOrderLoading(false);
    }
  };



  return (
    <div className="checkout-container">
      <h2>Thanh Toán</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-group">
            <label>Tên khách hàng:</label>
            <div className="readonly-field">{user.name}</div>
        </div>
        <div className="form-group">
            <label>Số điện thoại:</label>
            <input
            type="text"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            />
        </div>
        <div className="form-group">
            <label>Địa chỉ:</label>
            <textarea
            rows="3"
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
            />
        </div>

        {/* Hiển thị danh sách sản phẩm trong giỏ hàng */}
        <div className="form-group">
            <label>Sản phẩm:</label>
            <ul className="product-list">
            {cartItems.length === 0 ? (
                <li>Giỏ hàng trống</li>
            ) : (
                cartItems.map(item => (
                <li key={item._id}>
                    {item.name} - {item.quantity} x {item.price.toLocaleString()} đ
                </li>
                ))
            )}
            </ul>
            <div className="total-price">
            Tổng tiền: <strong>{totalPrice.toLocaleString()} đ</strong>
            </div>
        </div>

        <div className="form-group">
            <label>Phương thức thanh toán:</label>
            <select
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value)}
            required
            >
            <option value="cod">Thanh toán khi nhận hàng (COD)</option>
            <option value="bank">Chuyển khoản ngân hàng</option>
            <option value="paypal">Paypal</option>
            </select>
        </div>

        <button type="submit" disabled={orderLoading} className="submit-btn">
            {orderLoading ? 'Đang xử lý...' : 'Đặt hàng'}
        </button>
    </form>
    </div>
  );
};

export default Checkout;