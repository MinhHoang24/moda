const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Tạo đơn hàng mới (user đã login)
router.post('/', verifyToken, async (req, res) => {
  console.log('Body received:', req.body);
  
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || !shippingAddress || !paymentMethod) {
    return res.status(400).json({ message: 'Thiếu dữ liệu bắt buộc' });
  }

  try {
    // Tính tổng tiền đơn hàng
    let totalAmount = 0;
    items.forEach(item => {
      totalAmount += item.price * item.quantity;
    });

    const newOrder = new Order({
      userId: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      status: 'pending',
      paymentMethod,
      paymentStatus: 'pending'
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy tất cả đơn hàng của user hiện tại
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: lấy tất cả đơn hàng
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name') // lấy name user
      .select('userId totalAmount status createdAt'); // chọn các trường cần thiết

    // Định dạng lại dữ liệu trả về frontend
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      name: order.userId?.name || 'N/A', // lấy tên user từ userId
      createdAt: order.createdAt,
      status: order.status,
      totalPrice: order.totalAmount, // đổi tên cho frontend
    }));

    res.json(formattedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cập nhật trạng thái đơn hàng (admin)
router.put('/:id/status', verifyToken, verifyAdmin, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    order.status = status;
    await order.save();

    res.json({ message: 'Cập nhật trạng thái thành công', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Xóa đơn hàng (admin)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    res.json({ message: 'Đã xóa đơn hàng' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;