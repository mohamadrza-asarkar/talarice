import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../context';
import styles from './auth.module.css';
import logoImg from '../assets/logo.png';

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, registerUser, isAuthenticated, currentUser } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const redirectPath = location.state?.from?.pathname || '/profile';

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!phone.trim()) {
      setErrorMessage('لطفاً شماره موبایل خود را وارد نمایید.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('وارد کردن رمز عبور الزامی است.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'register') {
        if (password.trim().length < 4) {
          setErrorMessage('رمز عبور باید حداقل ۴ رقم یا کاراکتر باشد.');
          setIsSubmitting(false);
          return;
        }
        const res = await registerUser(name.trim(), phone.trim(), password.trim());
        if (res.success) {
          navigate(redirectPath, { replace: true });
        } else {
          setErrorMessage(res.message || 'خطا در ثبت‌نام.');
        }
      } else {
        const res = await loginUser(phone.trim(), password.trim());
        if (res.success) {
          navigate(redirectPath, { replace: true });
        } else {
          setErrorMessage(res.message || 'شماره موبایل یا رمز عبور اشتباه است.');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <main className={styles.authContainer}>
      {/* برندینگ طلا رایس */}
      <header className={styles.brandHeader}>
        <img src={logoImg} alt="لوگوی طلا رایس" className={styles.brandLogo} />
        <h1 className={styles.brandTitle}>فروشگاه طلا رایس</h1>
        <p className={styles.brandSubtitle}>ورود به سامانه مشتریان و پیگیری سفارش‌ها</p>
      </header>

      {/* کارت فرم */}
      <section className={styles.authCard}>
        {/* تب سوئیچر بین ورود و ثبت نام */}
        <div className={styles.tabSwitch}>
          <button
            type="button"
            className={mode === 'login' ? styles.tabBtnActive : styles.tabBtn}
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
          >
            <i className="fa-solid fa-right-to-bracket" />
            <span>ورود به حساب</span>
          </button>
          <button
            type="button"
            className={mode === 'register' ? styles.tabBtnActive : styles.tabBtn}
            onClick={() => {
              setMode('register');
              setErrorMessage('');
            }}
          >
            <i className="fa-solid fa-user-plus" />
            <span>ثبت‌نام جدید</span>
          </button>
        </div>

        {/* جعبه نمایش خطا */}
        {errorMessage && (
          <div className={styles.errorBox} role="alert">
            <i className="fa-solid fa-circle-exclamation" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === 'register' && (
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span>نام و نام خانوادگی</span>
              </label>
              <div className={styles.inputWrapper}>
                <i className={`fa-solid fa-user ${styles.inputIcon}`} />
                <input
                  type="text"
                  className={styles.input}
                  placeholder="مثال: علی محمدی"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <span>شماره موبایل</span>
              <span className={styles.requiredAsterisk}>* (الزامی)</span>
            </label>
            <div className={styles.inputWrapper}>
              <i className={`fa-solid fa-phone ${styles.inputIcon}`} />
              <input
                type="tel"
                className={styles.input}
                placeholder="مثال: 09123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                dir="ltr"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <span>کلمه عبور</span>
              <span className={styles.requiredAsterisk}>* (الزامی)</span>
            </label>
            <div className={styles.inputWrapper}>
              <i className={`fa-solid fa-lock ${styles.inputIcon}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                placeholder={mode === 'register' ? 'حداقل ۴ کاراکتر وارد کنید' : 'رمز عبور خود را وارد کنید'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="ltr"
              />
              <button
                type="button"
                className={styles.togglePasswordBtn}
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'مخفی کردن رمز' : 'نمایش رمز'}
                aria-label="تغییر نمایش رمز"
              >
                <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} />
              </button>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            <i className={isSubmitting ? 'fa-solid fa-spinner fa-spin' : (mode === 'login' ? 'fa-solid fa-arrow-left-to-bracket' : 'fa-solid fa-check')} />
            <span>{isSubmitting ? 'در حال برقراری ارتباط...' : (mode === 'login' ? 'ورود به حساب کاربری' : 'تکمیل و ایجاد حساب کاربری')}</span>
          </button>
        </form>

      </section>

      <Link to="/" className={styles.backHomeLink}>
        <i className="fa-solid fa-arrow-right" />
        <span>بازگشت به صفحه اصلی فروشگاه</span>
      </Link>
    </main>
  );
}

export { Auth };
