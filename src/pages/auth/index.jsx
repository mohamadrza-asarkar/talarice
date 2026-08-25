import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import { Logo } from '../../components/logo';
import styles from './style.module.css';

export const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { loginUser, registerUser } = useApp();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const res = await loginUser(phone, password);
    setLoading(false);
    if (res && res.success) {
      navigate('/profile');
    } else {
      setErrorMsg(res?.message || 'خطا در ورود');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const res = await registerUser(name, phone, password);
    setLoading(false);
    if (res && res.success) {
      navigate('/profile');
    } else {
      setErrorMsg(res?.message || 'خطا در ثبت نام');
    }
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
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
            className={`${styles.tabBtn} ${activeTab === 'login' ? styles.tabActive : styles.tabInactive}`}
          >
            ورود
          </button>
          <button
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
            className={`${styles.tabBtn} ${activeTab === 'register' ? styles.tabActive : styles.tabInactive}`}
          >
            ثبت نام
          </button>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm font-bold mb-4 border border-rose-200">
            {errorMsg}
          </div>
        )}

        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>شماره موبایل</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="مثال: 09123456789"
                className={styles.input}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>رمز عبور</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور خود را وارد کنید"
                className={styles.input}
              />
            </div>

            <button type="submit" disabled={loading} className={styles.primaryButton}>
              {loading ? 'درحال بررسی...' : 'ورود به حساب کاربری'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>نام و نام خانوادگی</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: محمد رضایی"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>شماره موبایل</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="مثال: 09123456789"
                className={styles.input}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>رمز عبور</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="حداقل ۶ کاراکتر"
                className={styles.input}
              />
            </div>

            <button type="submit" disabled={loading} className={styles.primaryButton}>
              {loading ? 'درحال ثبت نام...' : 'ثبت نام در طلا رایس'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
