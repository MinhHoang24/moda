import React, { useEffect, useState } from 'react';
import axiosClient from '../../../api/axiosClient';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/products');
        // Lấy đúng mảng products trong response
        setProducts(res.data.products);
        setError('');
      } catch (err) {
        console.error('Lỗi lấy sản phẩm:', err);
        setError('Lỗi khi tải dữ liệu sản phẩm.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Đang tải sản phẩm...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Quản lý sản phẩm</h2>
      <table border="1" cellPadding="8" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Danh mục</th>
            <th>Ảnh</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(products) && products.length > 0 ? (
            products.map(product => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.price.toLocaleString()} đ</td>
                <td>{product.quantity}</td>
                <td>{product.category || 'Chưa phân loại'}</td>
                <td>
                  {product.imageUrl ? (
                    <img
                      src={`http://localhost:5000${product.imageUrl}`}
                      alt={product.name}
                      width="80"
                      style={{ borderRadius: 4 }}
                    />
                  ) : (
                    'Chưa có ảnh'
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                Chưa có sản phẩm nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;