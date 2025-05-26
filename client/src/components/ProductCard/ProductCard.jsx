import React, { useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="product-card">
      <img src={`http://localhost:5000${product.imageUrl}`} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price} đ</p>
      <button onClick={() => addToCart(product)}>Thêm vào giỏ</button>
    </div>
  );
};

export default ProductCard;