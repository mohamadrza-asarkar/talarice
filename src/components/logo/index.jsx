import React from 'react';
import styles from './style.module.css';
import logoImg from '../../assets/logo.png';

export const Logo = ({ size }) => {
  return (
    <div
      className={styles.circleLogo}
      style={size ? {
        width: size.width,
        height: size.height
      } : null}
    >
      <img src={logoImg} alt="Tala Rice" className={styles.logoImage} />
    </div>
  );
};

