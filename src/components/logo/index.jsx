import React from 'react';
import styles from './style.module.css';
import logoImg from '../../assets/logo.png';

export const Logo = ({ variant = 'circle', size = 'md', className = '' }) => {
  if (variant === 'circle') {
    return (
      <div className={`${styles.logoCircleWrapper} ${className}`}>
        <div className={styles.logoGlowEffect} />
        <div className={styles.logoCircleContainer}>
          <img 
            src={logoImg} 
            alt="Tala Rice" 
            className={styles.logoImage}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.logoInlineContainer} ${className}`}>
      <div className={styles.logoInlineIcon}>
        <img 
          src={logoImg} 
          alt="Tala Rice Logo" 
          className={styles.logoImage}
        />
      </div>
      <div className={styles.logoTextContainer}>
        <span className={styles.logoTextPrimary}>
          طلا رایس
        </span>
        <span className={styles.logoTextSecondary}>
          TALA RICE
        </span>
      </div>
    </div>
  );
};
