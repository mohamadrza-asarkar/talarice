import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './header';
import { BottomNav } from './bottomNav';
import { CartDrawer } from './cartDrawer';
import { CheckoutModal } from './checkoutModal';
import { HealthErrorBanner } from './healthStatus';
import { useApp } from '../context';
import styles from '../App.module.css';

export function Layout() {
  const { serverHealth, checkHealth } = useApp();

  return (
    <div className={styles.appWrapper}>
      <HealthErrorBanner health={serverHealth} onRetry={checkHealth} />
      <Header />
      <Outlet />
      <BottomNav />
      <CartDrawer />
      <CheckoutModal />
    </div>
  );
}

export function SimpleLayout() {
  const { serverHealth, checkHealth } = useApp();

  return (
    <div className={styles.appWrapper}>
      <HealthErrorBanner health={serverHealth} onRetry={checkHealth} />
      <Outlet />
      <CartDrawer />
      <CheckoutModal />
    </div>
  );
}

export default Layout;
