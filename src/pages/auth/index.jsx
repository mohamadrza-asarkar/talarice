import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Lock, Eye, EyeOff, AlertCircle, Wrench, FileWarning, RefreshCw } from 'lucide-react';
import { useApp } from '../../context';
import { Logo } from '../../components/logo';
import styles from './style.module.css';

export function AuthPage() {
  const navigate = useNavigate();
  const { loginUser, registerUser, serverHealth, checkHealth } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [errorMeta, setErrorMeta] = useState(null); // { isServerError, isValidationError, title, advice }

  function handleTabChange(tab) {
    setIsLogin(tab === 'login');
    setErrors({});
    setErrorMeta(null);
  }

  function handleInputChange(field, value) {
    setFormData(function (prev) {
      return { ...prev, [field]: value };
    });
    if (errors[field]) {
      setErrors(function (prev) {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function toEnglishDigits(str) {
    if (!str) return '';
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
    let res = String(str);
    for (let i = 0; i < 10; i++) {
      res = res.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
    }
    return res;
  }

  function validate() {
    const newErrors = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'لطفاً نام و نام خانوادگی را وارد کنید.';
    }

    const cleanPhone = toEnglishDigits(formData.phone).replace(/[\s-]/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'لطفاً شماره موبایل خود را وارد کنید.';
    } else if (!/^09\d{9}$/.test(cleanPhone)) {
      newErrors.phone = 'شماره موبایل باید ۱۱ رقم با فرمت ۰۹xxxxxxxx باشد (خطا در فرمت انتخابی).';
    }

    if (!formData.password) {
      newErrors.password = 'لطفاً رمز عبور را وارد کنید.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'رمز عبور باید حداقل ۸ رقم (کاراکتر) باشد (خطا در فرمت انتخابی).';
    }

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setErrorMeta({
        isValidationError: true,
        title: 'خطا در فرمت‌های انتخابی',
        message: 'برخی اطلاعات وارد شده مطابق الگوی صحیح نیستند. لطفاً موارد مشخص شده را اصلاح فرمایید.',
        advice: 'شماره موبایل باید ۱۱ رقم با ۰۹ شروع شود و رمز عبور حداقل ۸ کاراکتر باشد.'
      });
      return;
    }

    setLoading(true);
    setErrors({});
    setErrorMeta(null);

    const cleanPhone = toEnglishDigits(formData.phone).replace(/[\s-]/g, '');
    const res = isLogin
      ? await loginUser(cleanPhone, formData.password)
      : await registerUser(formData.name.trim(), cleanPhone, formData.password);

    setLoading(false);
    if (res?.success) {
      navigate('/profile');
    } else {
      const isServer = res?.isServerError || (res?.statusCode >= 500) || res?.errorType === 'NETWORK_ERROR' || res?.errorType === 'SERVER_MAINTENANCE';
      const isValidation = res?.isUserError || res?.errorType === 'VALIDATION_ERROR';

      const msg = res?.displayText || res?.message || 'خطا در عملیات ورود/ثبت‌نام';
      const rawMsg = (res?.message || '').toLowerCase();

      if (isServer) {
        setErrorMeta({
          isServerError: true,
          title: '🛠️ سرور در حال به‌روزرسانی است',
          message: 'سرویس‌دهنده موقتاً در حال به‌روزرسانی زیرساخت است یا ارتباط شبکه قطع شده است. لطفاً بعداً مجدداً امتحان کنید.',
          advice: 'اطلاعات شما محفوظ است. می‌توانید دقایقی دیگر مجدداً تلاش فرمایید.'
        });
      } else {
        setErrorMeta({
          isValidationError: true,
          title: '⚠️ خطا در اطلاعات ارسالی یا مشخصات کاربری',
          message: msg,
          advice: 'لطفاً فرمت شماره موبایل و صحت رمز عبور را مجدداً بررسی فرمایید.'
        });

        if (rawMsg.includes('رمز') || rawMsg.includes('کلمه عبور') || rawMsg.includes('پسورد')) {
          setErrors({ password: 'کلمه عبور وارد شده نادرست یا نامعتبر است.' });
        } else if (rawMsg.includes('شماره') || rawMsg.includes('موبایل') || rawMsg.includes('کاربر') || rawMsg.includes('یافت نشد') || rawMsg.includes('تکراری')) {
          setErrors({ phone: msg });
        } else if (rawMsg.includes('نام') && !isLogin) {
          setErrors({ name: msg });
        }
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

        {/* Server Maintenance Box */}
        {errorMeta?.isServerError && (
          <div className={styles.serverMaintenanceBox} role="alert">
            <div className={styles.serverMaintenanceHeader}>
              <Wrench size={16} />
              <span>{errorMeta.title}</span>
            </div>
            <p className={styles.serverMaintenanceDesc}>{errorMeta.message}</p>
            {errorMeta.advice && (
              <span style={{ fontSize: '0.72rem', color: '#1e3a8a', fontWeight: 700 }}>
                💡 {errorMeta.advice}
              </span>
            )}
          </div>
        )}

        {/* Validation / User Error Box */}
        {errorMeta?.isValidationError && (
          <div className={styles.validationErrorBox} role="alert">
            <div className={styles.validationErrorHeader}>
              <FileWarning size={16} />
              <span>{errorMeta.title}</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem' }}>{errorMeta.message}</p>
            {errorMeta.advice && (
              <span className={styles.validationErrorAdvice}>
                💡 {errorMeta.advice}
              </span>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className={styles.form} style={{ marginTop: errorMeta ? '0.75rem' : 0 }}>
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
                placeholder="09121234567"
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
