import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const getCartFromStorage = useCallback(() => {
    if (!user || !user._id) return [];
    try {
      const data = localStorage.getItem(`cartItems_${user._id}`);
      if (!data || data === 'undefined') return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  }, [user]);

  const [cartItems, setCartItems] = useState(getCartFromStorage);

  useEffect(() => {
    setCartItems(getCartFromStorage());
  }, [user, getCartFromStorage]);

  useEffect(() => {
    if (user && user._id) {
      localStorage.setItem(`cartItems_${user._id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = (productToAdd) => {
    setCartItems((prevCart) => {
      const index = prevCart.findIndex(item => item._id === productToAdd._id);
      if (index !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[index].quantity = (updatedCart[index].quantity || 0) + (productToAdd.quantity || 1);
        return updatedCart;
      } else {
        return [...prevCart, { ...productToAdd, quantity: productToAdd.quantity || 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevCart => prevCart.filter(item => item._id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
