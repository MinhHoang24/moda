import React, { useState } from 'react';
import axiosClient from '../../../api/axiosClient';

const AddProduct = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await axiosClient.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          //...
        },
      });
      setMessage('Thêm sản phẩm thành công!');
      setForm({ name: '', description: '', price: '', quantity: '', category: '' });
      setImageFile(null);
      // Reset input file bằng cách lấy lại DOM nếu muốn
      document.getElementById('imageInput').value = '';
    } catch (err) {
      setMessage('Lỗi khi thêm sản phẩm.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Thêm sản phẩm mới</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="name"
          placeholder="Tên sản phẩm"
          value={form.name}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 10, padding: 8 }}
        />
        <textarea
          name="description"
          placeholder="Mô tả"
          value={form.description}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: 10, padding: 8, resize: 'vertical' }}
        />
        <input
          type="number"
          name="price"
          placeholder="Giá"
          value={form.price}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: 10, padding: 8 }}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Số lượng"
          value={form.quantity}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: 10, padding: 8 }}
        />
        <input
          type="text"
          name="category"
          placeholder="Danh mục"
          value={form.category}
          onChange={handleChange}
          style={{ width: '100%', marginBottom: 10, padding: 8 }}
        />
        <input
          id="imageInput"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginBottom: 10 }}
        />
        <button type="submit" style={{ padding: '10px 20px', fontSize: 16 }}>
          Thêm sản phẩm
        </button>
      </form>
    </div>
  );
};

export default AddProduct;