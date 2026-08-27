import React from 'react';
import { Link } from 'react-router-dom';
import styles from './style.module.css';

export const SearchBar = () => {
  return (
    <Link to="/search" className={styles.searchContainer}>
      <input
        type="text"
        placeholder="جستجوی محصول..."
        className={styles.searchInput}
        readOnly
        tabIndex={-1}
      />
      <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`} />
    </Link>
  );
};


