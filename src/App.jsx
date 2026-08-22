import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context';
import { Header } from './components/header';
import { Main } from './components/main';
import { BottomNav } from './components/bottomNav';
import { CartDrawer } from './components/cartDrawer';
import { CheckoutModal } from './components/checkoutModal';
import styles from './App.module.css';

const AppLayout = () => {
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  const isProductPage = location.pathname.startsWith('/product/');

  const hideHeaderAndNav = isSearchPage || isProductPage;

  return (
    <div className={styles.appWrapper}>
      {!hideHeaderAndNav && <Header />}
      <Main />
      {!hideHeaderAndNav && <BottomNav />}
      <CartDrawer />
      <CheckoutModal />
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
