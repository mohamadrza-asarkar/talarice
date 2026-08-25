import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context';
import { HomePage } from '../../pages/home';
import { CatalogPage } from '../../pages/catalog';
import { BlogPage } from '../../pages/blog';
import { ProfilePage } from '../../pages/profile';
import { SearchPage } from '../../pages/search';
import { ProductPage } from '../../pages/product';
import { AuthPage } from '../../pages/auth';
import { AdminPage } from '../../pages/admin';
import styles from './style.module.css';

export const Main = () => {
  const { activeTab, isAuthenticated } = useApp();
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  const isProductPage = location.pathname.startsWith('/product/');
  const isAdminPage = location.pathname.startsWith('/admin');

  const useFullHeight = isSearchPage || isProductPage || isAdminPage;

  return (
    <main className={`${!useFullHeight ? styles.minHeight + ' ' + styles.mainContainer : styles.fullHeight}`}>
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
  );
};


