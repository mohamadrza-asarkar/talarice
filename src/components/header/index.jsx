import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context';
import { Logo } from '../logo';
import { SearchBar } from '../searchBar';
import { Sparkles } from 'lucide-react';
import styles from './style.module.css';

export function Header() {
  const { isAdmin } = useApp();

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <Link to="/" className={styles.logoLink} aria-label="صفحه اصلی">
          <Logo />
        </Link>

        {isAdmin && (
          <Link to="/admin" className={styles.adminBtn}>
            <Sparkles size={14} color="#fbbf24" />
            <span>پنل ادمین</span>
          </Link>
        )}
      </div>
      <SearchBar />
    </header>
  );
};


