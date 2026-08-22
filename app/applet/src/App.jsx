import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context';
import { Header } from './components/header';
import { Main } from './components/main';
import { BottomNav } from './components/bottomNav';
import { CartDrawer } from './components/cartDrawer';
import { CheckoutModal } from './components/checkoutModal';
import { ProductDetailModal } from './components/productDetailModal';
import './app.css';

const AppLayout = () => {
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';

  return (
    <div className="app-container">
      {!isSearchPage && <Header />}
      <Main />
      {!isSearchPage && <BottomNav />}
      <CartDrawer />
      <CheckoutModal />
      <ProductDetailModal />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </BrowserRouter>
  );
}
