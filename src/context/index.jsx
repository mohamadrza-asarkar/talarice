import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { CartProvider, useCart } from './CartContext';

export { useAuth } from './AuthContext';
export { useCart } from './CartContext';
export function useProduct() {
  return useCart();
}

export function getOrderStatusInfo(status) {
  const norm = String(status || '').toLowerCase().trim();
  switch (norm) {
    case 'تحویل شده':
    case 'delivered':
      return { label: 'تحویل شده', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' };
    case 'ارسال شده':
    case 'در حال ارسال':
    case 'shipped':
      return { label: 'در حال ارسال', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' };
    case 'لغو شده':
    case 'cancelled':
      return { label: 'لغو شده', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
    default:
      return { label: 'در حال پردازش', color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
  }
}

export function AppProvider({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  );
}

export function useApp() {
  const auth = useAuth();
  const cart = useCart();
  const navigate = useNavigate();

  return {
    ...auth,
    ...cart,
    login: auth.loginUser,
    register: auth.registerUser,
    addOrder: cart.createOrder,
    updateQuantity: cart.updateCartQuantity,
    getOrderStatusInfo,
    goBack: () => navigate(-1)
  };
}
