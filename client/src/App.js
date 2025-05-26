import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import Admin from './pages/Admin/Admin';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import ProductList from './pages/ProductList/ProductList';
import PrivateRoute from './routes/PrivateRoute';
import NotFound from './pages/NotFound/NotFound';
import Home from './pages/Home/Home';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Cart from './pages/Cart/Cart';
import Profile from './pages/Profile/Profile';

function App() {
  const { userRole } = useContext(AuthContext);

  return (
    <Router>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 80px)' }}>
        <Routes>

          {/* Nếu là admin, redirect / về trang admin */}
          <Route
            path="/"
            element={
              userRole === 'admin' ? (
                <Admin />
              ) : (
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              )
            }
          />
          {/* Route admin riêng, chỉ cho phép admin */}
          <Route
            path="/admin"
            element={
              userRole === 'admin' ? (
                <Admin />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route path="/" element={<Home />} />
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <ProductList />
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;