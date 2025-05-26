const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Lấy thông tin profile user hiện tại
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Đổi mật khẩu user
router.put('/change-password', verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route lấy danh sách user (chỉ admin được phép)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cập nhật thông tin profile user hiện tại
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Lấy id user từ token
    const { name, email, phone, address } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });

    // Cập nhật các trường được phép thay đổi
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    res.json({ message: 'Cập nhật thông tin thành công', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;