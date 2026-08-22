import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../logo';
import { SearchBar } from '../searchBar';
import styles from './style.module.css';

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div
          onClick={() => navigate('/')}
          className={styles.logoWrapper}
        >
          <Logo variant="circle" />
        </div>
        <SearchBar />
      </div>
    </header>
  );
};
