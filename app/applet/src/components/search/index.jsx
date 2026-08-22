import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import styles from './style.module.css';

export const Search = () => {
  const { searchQuery } = useApp();
  const navigate = useNavigate();

  const handleOpenSearchPage = () => {
    navigate('/search');
  };

  return (
    <div className={styles.searchWrapper}>
      <button
        type="button"
        onClick={handleOpenSearchPage}
        className={styles.searchButton}
      >
        <span className={searchQuery ? styles.textFilled : styles.textPlaceholder}>
          {searchQuery || 'جستجو در برنج‌های طلا رایس...'}
        </span>
        <div className={styles.iconWrapper}>
          <i className="fa-solid fa-magnifying-glass" />
        </div>
      </button>
    </div>
  );
};
