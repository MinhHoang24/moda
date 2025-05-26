const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/Product');
const { verifyAdmin } = require('../middleware/auth'); // Sửa tên middleware đúng

// Cấu hình multer lưu file upload ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // thư mục lưu ảnh
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      name,
      minPrice,
      maxPrice,
      category,
      sortBy = 'createdAt',
      sortOrder = 'desc'
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

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);

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

// GET chi tiết sản phẩm theo ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST tạo mới sản phẩm, có hỗ trợ upload ảnh
router.post('/', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl || '';

    const { name, description, price, quantity, category } = req.body;

    const product = new Product({
      name,
      description,
      price,
      quantity,
      category,
      imageUrl,
    });

    const newProduct = await product.save();

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT cập nhật sản phẩm theo ID
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { name, description, price, quantity, imageUrl, category } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.imageUrl = imageUrl || product.imageUrl;
    product.category = category || product.category;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE xóa sản phẩm theo ID
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    await product.deleteOne();

    res.json({ message: 'Sản phẩm đã được xóa' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi xóa sản phẩm' });
  }
});

module.exports = router;