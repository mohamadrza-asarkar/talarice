import React from 'react';
import { useApp } from '../../context';
import { HomePage } from '../../pages/home';
import { CatalogPage } from '../../pages/catalog';
import { BlogPage } from '../../pages/blog';
import { ProfilePage } from '../../pages/profile';
import styles from './style.module.css';

export const Main = () => {
  const { activeTab } = useApp();

  return (
    <main className={`min-h-[calc(100vh-140px)] ${styles.mainContainer}`}>
      {activeTab === 'home' && <HomePage />}
      {activeTab === 'catalog' && <CatalogPage />}
      {activeTab === 'blog' && <BlogPage />}
      {activeTab === 'profile' && <ProfilePage />}
    </main>
  );
};
