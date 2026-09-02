import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Phone, Lock, Eye, EyeOff, AlertCircle, Wrench, FileWarning, X } from 'lucide-react';
import { useApp } from '../../context';
import { SEO } from '../../components/SEO';
import { Logo } from '../../components/logo';
import styles from './style.module.css';

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, registerUser, currentUser, isAuthenticated } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // اگر کاربر از قبل وارد شده باشد، به صفحه مقصد یا پروفایل هدایت شود
  const targetPath = location.state?.from?.pathname || '/profile';
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      navigate(targetPath, { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate, targetPath]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [errorMeta, setErrorMeta] = useState(null);
  const errorTimerRef = useRef(null);

  // Auto-dismiss error banner after 8 seconds so it disappears smoothly
  useEffect(() => {
    if (errorMeta) {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => {
        setErrorMeta(null);
      }, 8000);
    }
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, [errorMeta]);

  function handleTabChange(tab) {
    setIsLogin(tab === 'login');
    setErrors({});
    setErrorMeta(null);
  }

  function handleInputChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errorMeta) {
      setErrorMeta(null);
    }
    if (errors[field]) {
      setErrors(prev => {
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
      newErrors.phone = 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود (مثال: 09121234567).';
    }

    if (!formData.password) {
      newErrors.password = 'لطفاً رمز عبور را وارد کنید.';
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
        title: 'بررسی اطلاعات ورودی',
        message: 'لطفاً فیلدهای مشخص شده را تکمیل فرمایید.',
        advice: 'شماره موبایل باید ۱۱ رقم با ۰۹ باشد.'
      });
      return;
    }

    setLoading(true);
    setErrors({});
    setErrorMeta(null);

    const cleanPhone = toEnglishDigits(formData.phone).replace(/[\s-]/g, '');
    
    // تفکیک کامل منطق ورود و ثبت‌نام با فراخوانی مستقیم
    const res = isLogin
      ? await loginUser(cleanPhone, formData.password)
      : await registerUser(formData.name.trim(), cleanPhone, formData.password);

    setLoading(false);

    if (res?.success) {
      navigate(targetPath, { replace: true });
    } else {
      const isServer = res?.statusCode === 0 || (res?.statusCode >= 500);
      const backendMessage = res?.message || (isLogin ? 'خطا در ورود به سیستم' : 'خطا در ثبت‌نام');
      const rawMsg = backendMessage.toLowerCase();

      if (isServer) {
        setErrorMeta({
          isServerError: true,
          title: '🛠️ وضعیت سرور',
          message: backendMessage,
          advice: 'لطفاً اتصال اینترنت خود را بررسی کرده یا دقایقی دیگر مجدداً تلاش کنید.'
        });
      } else {
        // مدیریت مستقیم خطای ۴۰۰ یا سایر خطاهای اعتبارسنجی ارسالی از سرور
        const isDuplicatePhone = rawMsg.includes('قبلاً') || rawMsg.includes('تکراری') || rawMsg.includes('ثبت نام کرده');
        
        setErrorMeta({
          isValidationError: true,
          title: isLogin ? 'خطا در ورود' : 'خطا در ثبت‌نام',
          message: backendMessage,
          advice: isDuplicatePhone ? 'این شماره قبلاً ثبت شده است. می‌توانید از تب «ورود» وارد شوید.' : ''
        });

        if (rawMsg.includes('رمز') || rawMsg.includes('پسورد') || rawMsg.includes('کلمه عبور')) {
          setErrors({ password: backendMessage });
        } else if (rawMsg.includes('شماره') || rawMsg.includes('موبایل') || rawMsg.includes('کاربر') || isDuplicatePhone) {
          setErrors({ phone: backendMessage });
        } else if (rawMsg.includes('نام') && !isLogin) {
          setErrors({ name: backendMessage });
        }
      }
    }
  }

  return (
    <div className={styles.authWrapper}>
      <SEO
        title={isLogin ? 'ورود به حساب کاربری' : 'ثبت نام مشتریان'}
        description="ورود و عضویت در فروشگاه آنلاین برنج طلا رایس جهت پیگیری سفارش‌ها و خرید آسان."
      />
      <div className={styles.logoContainer}>
        <Logo />
      </div>

      <div className={styles.card}>
        <h2 className={styles.title}>ورود / ثبت نام در طلا رایس</h2>

        <div className={styles.tabsContainer}>
          <button
            type="button"
            id="auth-tab-login"
            onClick={() => handleTabChange('login')}
            className={`${styles.tabBtn} ${isLogin ? styles.tabActive : styles.tabInactive}`}
          >
            ورود
          </button>
          <button
            type="button"
            id="auth-tab-register"
            onClick={() => handleTabChange('register')}
            className={`${styles.tabBtn} ${!isLogin ? styles.tabActive : styles.tabInactive}`}
          >
            ثبت نام
          </button>
        </div>

        {/* جعبه خطای سرور */}
        {errorMeta?.isServerError && (
          <div className={styles.serverMaintenanceBox} role="alert">
            <div className={styles.serverMaintenanceHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Wrench size={16} />
                <span>{errorMeta.title}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMeta(null)}
                className={styles.errorBoxCloseBtn}
                aria-label="بستن پیام"
              >
                <X size={15} />
              </button>
            </div>
            <p className={styles.serverMaintenanceDesc}>{errorMeta.message}</p>
            {errorMeta.advice && (
              <span style={{ fontSize: '0.72rem', color: '#1e3a8a', fontWeight: 700 }}>
                💡 {errorMeta.advice}
              </span>
            )}
          </div>
        )}

        {/* جعبه پیام خطا یا اعتبارسنجی سرور */}
        {errorMeta?.isValidationError && (
          <div className={styles.validationErrorBox} role="alert">
            <div className={styles.validationErrorHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <FileWarning size={16} />
                <span>{errorMeta.title}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMeta(null)}
                className={styles.errorBoxCloseBtn}
                aria-label="بستن پیام"
              >
                <X size={15} />
              </button>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>{errorMeta.message}</p>
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
                  onChange={e => handleInputChange('name', e.target.value)}
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
                onChange={e => handleInputChange('phone', e.target.value)}
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
                onChange={e => handleInputChange('password', e.target.value)}
                placeholder="رمز عبور خود را وارد کنید"
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <span className={styles.inputIcon}>
                <Lock size={18} />
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
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
