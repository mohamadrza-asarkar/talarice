import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import { Logo } from '../../components/logo';
import styles from './style.module.css';

export const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login();
    navigate('/profile');
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    login();
    navigate('/profile');
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.logoContainer}>
        <Logo variant="circle" />
      </div>

      <div className={styles.card}>
        <h2 className={styles.title}>ورود / ثبت نام در طلا رایس</h2>

        <div className={styles.tabsContainer}>
          <button
            onClick={() => setActiveTab('login')}
            className={`${styles.tabBtn} ${activeTab === 'login' ? styles.tabActive : styles.tabInactive}`}
          >
            ورود
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`${styles.tabBtn} ${activeTab === 'register' ? styles.tabActive : styles.tabInactive}`}
          >
            ثبت نام
          </button>
        </div>

        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>شماره موبایل</label>
              <input
                type="tel"
                required
                placeholder="مثال: 09123456789"
                className={styles.input}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>رمز عبور</label>
              <input
                type="password"
                required
                placeholder="رمز عبور خود را وارد کنید"
                className={styles.input}
              />
            </div>

            <button type="button" className={styles.forgotPassword}>
              رمز عبور خود را فراموش کرده‌اید؟
            </button>

            <button type="submit" className={styles.primaryButton}>
              ورود به حساب کاربری
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>نام و نام خانوادگی</label>
              <input
                type="text"
                required
                placeholder="مثال: محمد رضایی"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>شماره موبایل</label>
              <input
                type="tel"
                required
                placeholder="مثال: 09123456789"
                className={styles.input}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>رمز عبور</label>
              <input
                type="password"
                required
                placeholder="حداقل ۶ کاراکتر"
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.primaryButton}>
              ثبت نام در طلا رایس
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
