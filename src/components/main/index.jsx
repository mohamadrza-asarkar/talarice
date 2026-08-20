import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context';
import { HomePage } from '../../pages/home';
import { CatalogPage } from '../../pages/catalog';
import { BlogPage } from '../../pages/blog';
import { ProfilePage } from '../../pages/profile';
import { SearchPage } from '../../pages/search';
import styles from './style.module.css';

export const Main = () => {
  const { activeTab } = useApp();
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';

  return (
    <main className={`${!isSearchPage ? 'min-h-[calc(100vh-140px)] ' + styles.mainContainer : 'h-screen'}`}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
};
