import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Lock, Phone, User } from 'lucide-react';
import { useApp } from '../../context';
import { Logo } from '../../components/logo';
import styles from './style.module.css';

function toEnglishDigits(str) {
  if (!str) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let res = str.toString();
  for (let i = 0; i < 10; i++) {
    res = res.replaceAll(persianDigits[i], i.toString()).replaceAll(arabicDigits[i], i.toString());
  }
  return res;
}

export function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { loginUser, registerUser } = useApp();
  const navigate = useNavigate();

  const isLogin = activeTab === 'login';

  function handleTabChange(tab) {
    setActiveTab(tab);
    setErrors({});
  }

  function handleInputChange(field, value) {
    setFormData(function (prev) {
      return { ...prev, [field]: value };
    });
    if (errors[field] || errors.general) {
      setErrors(function (prev) {
        const next = { ...prev };
        delete next[field];
        delete next.general;
        return next;
      });
    }
  }

  function validate() {
    const newErrors = {};

    if (!isLogin) {
      const trimmedName = formData.name.trim();
      if (!trimmedName) {
        newErrors.name = 'لطفاً نام و نام خانوادگی خود را وارد کنید.';
      } else if (trimmedName.length < 3) {
        newErrors.name = 'نام و نام خانوادگی باید حداقل ۳ حرف باشد.';
      }
    }

    const cleanPhone = toEnglishDigits(formData.phone).replace(/[\s-]/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'لطفاً شماره موبایل خود را وارد کنید.';
    } else if (!/^09\d{9}$/.test(cleanPhone)) {
      newErrors.phone = 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.';
    }

    if (!formData.password) {
      newErrors.password = 'لطفاً رمز عبور را وارد کنید.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'رمز عبور باید حداقل ۸ رقم (کاراکتر) باشد.';
    }

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    const cleanPhone = toEnglishDigits(formData.phone).replace(/[\s-]/g, '');
    const res = isLogin
      ? await loginUser(cleanPhone, formData.password)
      : await registerUser(formData.name.trim(), cleanPhone, formData.password);

    setLoading(false);
    if (res?.success) {
      navigate('/profile');
    } else {
      const msg = res?.message || 'خطا در عملیات ورود/ثبت‌نام';
      const lower = msg.toLowerCase();
      if (lower.includes('رمز') || lower.includes('کلمه عبور') || lower.includes('پسورد')) {
        setErrors({ password: msg });
      } else if (lower.includes('شماره') || lower.includes('موبایل') || lower.includes('کاربر') || lower.includes('یافت نشد') || lower.includes('تکراری')) {
        setErrors({ phone: msg });
      } else if (lower.includes('نام') && !isLogin) {
        setErrors({ name: msg });
      } else {
        setErrors({ general: msg });
      }
    }
  }

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
            id="auth-tab-login"
            onClick={function () { handleTabChange('login'); }}
            className={`${styles.tabBtn} ${isLogin ? styles.tabActive : styles.tabInactive}`}
          >
            ورود
          </button>
          <button
            type="button"
            id="auth-tab-register"
            onClick={function () { handleTabChange('register'); }}
            className={`${styles.tabBtn} ${!isLogin ? styles.tabActive : styles.tabInactive}`}
          >
            ثبت نام
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <label
                htmlFor="auth-name-input"
                className={`${styles.label} ${errors.name ? styles.labelError : ''}`}
              >
                نام و نام خانوادگی
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="auth-name-input"
                  type="text"
                  value={formData.name}
                  onChange={function (e) { handleInputChange('name', e.target.value); }}
                  placeholder="نام و نام خانوادگی خود را وارد کنید"
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  autoComplete="name"
                />
                <span className={styles.inputIcon}>
                  <User size={18} />
                </span>
              </div>
              {errors.name && (
                <div className={styles.fieldError} id="auth-name-error">
                  <AlertCircle size={14} className={styles.fieldErrorIcon} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label
              htmlFor="auth-phone-input"
              className={`${styles.label} ${errors.phone ? styles.labelError : ''}`}
            >
              شماره موبایل
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="auth-phone-input"
                type="tel"
                dir="ltr"
                value={formData.phone}
                onChange={function (e) { handleInputChange('phone', e.target.value); }}
                placeholder="شماره موبایل خود را وارد کنید"
                className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                autoComplete="tel"
              />
              <span className={styles.inputIcon}>
                <Phone size={18} />
              </span>
            </div>
            {errors.phone && (
              <div className={styles.fieldError} id="auth-phone-error">
                <AlertCircle size={14} className={styles.fieldErrorIcon} />
                <span>{errors.phone}</span>
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label
              htmlFor="auth-password-input"
              className={`${styles.label} ${errors.password ? styles.labelError : ''}`}
            >
              رمز عبور
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="auth-password-input"
                type={showPassword ? 'text' : 'password'}
                dir="ltr"
                value={formData.password}
                onChange={function (e) { handleInputChange('password', e.target.value); }}
                placeholder={isLogin ? 'رمز عبور خود را وارد کنید' : 'حداقل ۸ رقم (کاراکتر)'}
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <span className={styles.inputIcon}>
                <Lock size={18} />
              </span>
              <button
                type="button"
                onClick={function () { setShowPassword(!showPassword); }}
                className={styles.passwordToggleBtn}
                aria-label={showPassword ? 'مخفی‌سازی رمز عبور' : 'نمایش رمز عبور'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <div className={styles.fieldError} id="auth-password-error">
                <AlertCircle size={14} className={styles.fieldErrorIcon} />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {errors.general && (
            <div className={styles.generalError} id="auth-general-error">
              <AlertCircle size={16} />
              <span>{errors.general}</span>
            </div>
          )}

          <button
            type="submit"
            id="auth-submit-btn"
            disabled={loading}
            className={styles.primaryButton}
          >
            {loading ? 'درحال پردازش...' : isLogin ? 'ورود به حساب کاربری' : 'ثبت نام در طلا رایس'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;

