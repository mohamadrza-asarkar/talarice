import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context';
import { Header } from './components/header';
import { BottomNav } from './components/bottomNav';
import { CartDrawer } from './components/cartDrawer';
import { CheckoutModal } from './components/checkoutModal';
import { HomePage } from './pages/home';
import { CatalogPage } from './pages/catalog';
import { BlogPage } from './pages/blog';
import { ProfilePage } from './pages/profile';
import { SearchPage } from './pages/search';
import { ProductPage } from './pages/product';
import { AuthPage } from './pages/auth';
import { AdminPage } from './pages/admin';
import styles from './App.module.css';

const AppLayout = () => {
  const { isAuthenticated } = useApp();
  const location = useLocation();

  const isSearchPage = location.pathname === '/search';
  const isProductPage = location.pathname.startsWith('/product/');
  const isAdminPage = location.pathname.startsWith('/admin');

  const hideHeaderAndNav = isSearchPage || isProductPage || isAdminPage;

  const routes = [
    { path: '/', element: <HomePage /> },
    { path: '/catalog', element: <CatalogPage /> },
    { path: '/blog', element: <BlogPage /> },
    { path: '/profile', element: isAuthenticated ? <ProfilePage /> : <Navigate to="/auth" replace /> },
    { path: '/auth', element: !isAuthenticated ? <AuthPage /> : <Navigate to="/profile" replace /> },
    { path: '/search', element: <SearchPage /> },
    { path: '/product/:id', element: <ProductPage /> },
    { path: '/admin/*', element: <AdminPage /> },
    { path: '/admin', element: <AdminPage /> },
    { path: '*', element: <Navigate to="/" replace /> }
  ];

  return (
    <div className={styles.appWrapper}>
      {!hideHeaderAndNav && <Header />}
      
      <main className={!hideHeaderAndNav ? `${styles.mainContainer} ${styles.minHeight}` : styles.fullHeight}>
        <Routes>
          {routes.map((route, idx) => (
            <Route key={idx} path={route.path} element={route.element} />
          ))}
        </Routes>
      </main>

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


