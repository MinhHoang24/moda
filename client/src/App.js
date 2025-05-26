import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
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

import Admin from './pages/Admin/AdminPage/Admin';
import AddProduct from './pages/Admin/AddProduct/AddProduct';
import ProductManagement from './pages/Admin/ProductManagement/ProductManagement';
import OrderManagement from './pages/Admin/OrderManagement/OrderManagement';
import UserManagement from './pages/Admin/UserManagement/UserManagement';

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
          >
            <Route path="/admin/add-product" element={<AddProduct />}/>
            <Route path="/admin/products" element={<ProductManagement />}/>
            <Route path="/admin/orders" element={<OrderManagement />}/>
            <Route path="/admin/users" element={<UserManagement />}/>
          </Route>
          {/* Route admin riêng, chỉ cho phép admin */}
          <Route
            path="/admin"
            element={
              
              userRole === 'admin' ? (
                <Admin />
              ) : (
                <Navigate to="/" />
              )
            }>
              <Route path="/admin/add-product" element={<AddProduct />}/>
              <Route path="/admin/products" element={<ProductManagement />}/>
              <Route path="/admin/orders" element={<OrderManagement />}/>
              <Route path="/admin/users" element={<UserManagement />}/> 
            </Route>

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