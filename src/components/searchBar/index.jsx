import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';

export const SearchBar = () => {
  const navigate = useNavigate();

  return (
    <div 
      className={styles.searchContainer}
      onClick={() => navigate('/search')}
    >
      <input
        type="text"
        placeholder="جستجوی محصول..."
        className={styles.searchInput}
        readOnly
      />
      <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`} />
    </div>
  );
};
