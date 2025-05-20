const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { verifyToken } = require('../middleware/auth');

// Lấy giỏ hàng của user hiện tại
router.get('/', verifyToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Thêm sản phẩm vào giỏ hàng hoặc cập nhật số lượng
router.post('/add', verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || quantity <= 0) return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });

  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/update', verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || quantity < 0) return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });

  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex < 0) return res.status(404).json({ message: 'Sản phẩm không có trong giỏ hàng' });

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Xóa toàn bộ giỏ hàng
router.delete('/clear', verifyToken, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.id });
    res.json({ message: 'Đã xóa toàn bộ giỏ hàng' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;