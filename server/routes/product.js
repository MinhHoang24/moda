const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products? page, limit, name, minPrice, maxPrice, category, sortBy, sortOrder
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      name,
      minPrice,
      maxPrice,
      category,
      sortBy = 'createdAt',    // Mặc định sắp xếp theo ngày tạo
      sortOrder = 'desc'       // Mặc định giảm dần
    } = req.query;

    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (minPrice) {
      filter.price = { ...filter.price, $gte: Number(minPrice) };
    }

    if (maxPrice) {
      filter.price = { ...filter.price, $lte: Number(maxPrice) };
    }

    if (category) {
      filter.category = category;
    }

    // Tạo object sort cho mongoose
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Tính skip và limit
    const skip = (Number(page) - 1) * Number(limit);

    // Truy vấn dữ liệu
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy tất cả sản phẩm
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    res.json(product);
  } catch (err) {
    console.error(err); // Thêm log lỗi
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Tạo mới sản phẩm
router.post('/', async (req, res) => {
  const { name, description, price, quantity, imageUrl } = req.body;
  const product = new Product({ name, description, price, quantity, imageUrl });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Lấy chi tiết sản phẩm theo ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cập nhật sản phẩm theo ID
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, quantity, imageUrl } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.imageUrl = imageUrl || product.imageUrl;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Xóa sản phẩm theo ID
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    // Cách 1: dùng deleteOne trên document
    await product.deleteOne();

    // Cách 2: hoặc dùng trực tiếp findByIdAndDelete
    // await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Sản phẩm đã được xóa' });
  } catch (err) {
    console.error('Lỗi khi xóa sản phẩm:', err);
    res.status(500).json({ message: 'Lỗi server khi xóa sản phẩm' });
  }
});

module.exports = router;