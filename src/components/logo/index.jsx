import React from 'react';
import styles from './style.module.css';
import logoImg from '../../assets/logo.png';

export function Logo({ size }) {
  return (
    <img
      src={logoImg}
      alt="لوگوی طلا رایس"
      className={styles.logoImage}
      style={size ? { width: size.width, height: size.height } : null}
    />
  );
};

