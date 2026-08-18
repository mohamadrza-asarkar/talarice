import React from 'react';
import { Logo } from '../logo';
import { Search } from '../search';
import { useApp } from '../../context';
import styles from './style.module.css';

export const Header = () => {
  const { setActiveTab } = useApp();

  return (
    <header className={`bg-[#042a1b] px-4 pt-3 pb-3 border-b-2 border-[#d4af37]/40 shadow-lg ${styles.headerContainer}`}>
      <div className="max-w-md mx-auto flex flex-col items-center space-y-3">
        <div
          onClick={() => setActiveTab('home')}
          className="cursor-pointer"
        >
          <Logo variant="circle" />
        </div>
        <Search />
      </div>
    </header>
  );
};
