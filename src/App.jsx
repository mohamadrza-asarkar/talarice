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

function AppRoutes() {
  const { isAuthenticated } = useApp();
  const location = useLocation();

  const isSearch = location.pathname === '/search';
  const isProduct = location.pathname.startsWith('/product/');
  const isAuth = location.pathname === '/auth';
  const isAdmin = location.pathname.startsWith('/admin');
  const hideChrome = isSearch || isProduct || isAuth || isAdmin;

  return (
    <div className="min-h-screen bg-[#042a1b] text-white flex flex-col font-sans">
      {!hideChrome && <Header />}
      
      <main className={`flex-1 ${hideChrome ? 'w-full' : 'max-w-md mx-auto w-full pb-20'}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/auth" replace />} />
          <Route path="/auth" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/profile" replace />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!hideChrome && <BottomNav />}
      <CartDrawer />
      <CheckoutModal />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
