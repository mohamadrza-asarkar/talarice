import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './header';
import { BottomNav } from './bottomNav';
import { CartDrawer } from './cartDrawer';
import { CheckoutModal } from './checkoutModal';
import styles from '../App.module.css';

export function Layout() {
  return (
    <div className={styles.appWrapper}>
      <Header />
      <Outlet />
      <BottomNav />
      <CartDrawer />
      <CheckoutModal />
    </div>
  );
}

export function SimpleLayout() {
  return (
    <div className={styles.appWrapper}>
      <Outlet />
      <CartDrawer />
      <CheckoutModal />
    </div>
  );
}

export default Layout;
