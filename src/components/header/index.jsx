import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context';
import { Logo } from '../logo';
import { SearchBar } from '../searchBar';
import { Sparkles } from 'lucide-react';
import styles from './style.module.css';

export const Header = () => {
  const { isAdmin } = useApp();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <Link to="/" className={styles.logoWrapper}>
            <Logo />
          </Link>

          {isAdmin && (
            <Link to="/admin" className={styles.adminBtn}>
              <Sparkles size={14} color="#fbbf24" />
              پنل ادمین
            </Link>
          )}
        </div>
        <SearchBar />
      </div>
    </header>
  );
};


