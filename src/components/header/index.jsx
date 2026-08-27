import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import { Logo } from '../logo';
import { SearchBar } from '../searchBar';
import { Sparkles } from 'lucide-react';
import styles from './style.module.css';

export const Header = () => {
  const navigate = useNavigate();
  const { isAdmin } = useApp();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <div onClick={() => navigate('/')} className={styles.logoWrapper}>
            <Logo />
          </div>

          {isAdmin && (
            <button onClick={() => navigate('/admin')} className={styles.adminBtn}>
              <Sparkles size={14} color="#fbbf24" />
              پنل ادمین
            </button>
          )}
        </div>
        <SearchBar />
      </div>
    </header>
  );
};

