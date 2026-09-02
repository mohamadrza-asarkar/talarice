import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context';
import { Logo } from '../logo';
import { SearchBar } from '../searchBar';
import { User, LogIn } from 'lucide-react';
import styles from './style.module.css';

export function Header() {
  const { isAuthenticated, currentUser } = useApp();

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        {/* دکمه ورود / پروفایل در سمت راست هدر */}
        <Link
          to={isAuthenticated ? '/profile' : '/auth'}
          className={styles.userBtn}
          title={isAuthenticated ? (currentUser?.name || 'پروفایل کاربری') : 'ورود به حساب کاربری'}
          aria-label={isAuthenticated ? 'پروفایل کاربری' : 'ورود'}
        >
          {isAuthenticated ? <User size={15} /> : <LogIn size={15} />}
          <span className={styles.userBtnText}>
            {isAuthenticated ? (currentUser?.name?.split(' ')[0] || 'حساب من') : 'ورود'}
          </span>
        </Link>

        {/* لوگو طلا رایس در وسط */}
        <Link to="/" className={styles.logoLink} aria-label="صفحه اصلی">
          <Logo />
        </Link>
      </div>
      <SearchBar />
    </header>
  );
}

export default Header;
