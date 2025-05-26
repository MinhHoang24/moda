const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const path = require('path');
app.use(cors());
app.use(express.json());

// Phục vụ static folder uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

const productRouter = require('./routes/product');
app.use('/api/products', productRouter);

const userRouter = require('./routes/user');
app.use('/api/users', userRouter);

const { verifyToken, verifyAdmin } = require('./middleware/auth');
const adminRouter = require('./routes/admin');
app.use('/api/admin', verifyToken, verifyAdmin, adminRouter);

const cartRouter = require('./routes/cart');
app.use('/api/cart', cartRouter);

const orderRouter = require('./routes/order');
app.use('/api/orders', orderRouter);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error(err));

app.get('/', (req, res) => res.send('Backend đang chạy 🛠'));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
