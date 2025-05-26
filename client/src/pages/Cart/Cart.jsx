import { useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const totalPrice = (cartItems || []).reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate('/checkout');  // Chuyển tới trang thanh toán
  };

  return (
    <div className="cart-container">
      <h2>Giỏ hàng của bạn</h2>
      {cartItems.length === 0 ? (
        <p>Giỏ hàng đang trống.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map(item => (
              <li key={item._id} className="cart-item">
                <img src={`http://localhost:5000${item.imageUrl}`} alt={item.name} />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>Giá: {item.price} đ</p>
                  <p>Số lượng: {item.quantity}</p>
                  <button onClick={() => removeFromCart(item._id)}>Xóa</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <h3>Tổng tiền: {totalPrice.toLocaleString()} đ</h3>
            <button onClick={clearCart} className="clear-btn">Xóa tất cả</button>
            <button onClick={handleCheckout} className="checkout-btn" style={{ marginLeft: '10px' }}>
              Thanh Toán
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;