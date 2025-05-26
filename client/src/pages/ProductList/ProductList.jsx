import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import ProductCard from '../../components/ProductCard/ProductCard';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
  axiosClient.get('/products')
    .then(res => {
      console.log('Dữ liệu products từ API:', res.data);
      setProducts(res.data.products);
    })
    .catch(err => console.error(err));
}, []);

  return (
    <div>
      <h2>Danh sách sản phẩm</h2>
      <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
        {products.map(product => (
          <ProductCard key={product._id} product={product}/>
        ))}
      </div>
    </div>
  );
};

export default ProductList;