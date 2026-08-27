import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import { Logo } from '../../components/logo';
import styles from './style.module.css';

export const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { loginUser, registerUser } = useApp();
  const navigate = useNavigate();

  const isLogin = activeTab === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = isLogin
      ? await loginUser(formData.phone, formData.password)
      : await registerUser(formData.name, formData.phone, formData.password);

    setLoading(false);
    if (res?.success) {
      navigate('/profile');
    } else {
      setErrorMsg(res?.message ?? 'خطا در عملیات ورود/ثبت‌نام');
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.logoContainer}>
        <Logo />
      </div>

      <div className={styles.card}>
        <h2 className={styles.title}>ورود / ثبت نام در طلا رایس</h2>

        <div className={styles.tabsContainer}>
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
            className={`${styles.tabBtn} ${isLogin ? styles.tabActive : styles.tabInactive}`}
          >
            ورود
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
            className={`${styles.tabBtn} ${!isLogin ? styles.tabActive : styles.tabInactive}`}
          >
            ثبت نام
          </button>
        </div>

        {errorMsg && <div className={styles.errorBanner}>{errorMsg}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>نام و نام خانوادگی</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="مثال: محمد رضایی"
                className={styles.input}
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.label}>شماره موبایل</label>
            <input
              type="tel"
              dir="ltr"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="09123456789"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>رمز عبور</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={isLogin ? 'رمز عبور خود را وارد کنید' : 'حداقل ۶ کاراکتر'}
              className={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} className={styles.primaryButton}>
            {loading ? 'درحال پردازش...' : isLogin ? 'ورود به حساب کاربری' : 'ثبت نام در طلا رایس'}
          </button>
        </form>
      </div>
    </div>
  );
};
