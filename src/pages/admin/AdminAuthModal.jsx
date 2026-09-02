import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context';
import { ShieldCheck, Lock, Phone, KeyRound, Loader2, ArrowRight, Sparkles, AlertCircle, X, FileWarning } from 'lucide-react';
import styles from './style.module.css';

export function AdminAuthModal({ isOpen, onClose }) {
  const { loginUser, showSuccess, showError } = useApp();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});
  const errorTimerRef = useRef(null);

  useEffect(() => {
    if (errorMessage) {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => {
        setErrorMessage('');
      }, 7000);
    }
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, [errorMessage]);

  if (!isOpen) return null;

  function toEnglishDigits(str) {
    if (!str) return '';
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
    for (let i = 0; i < 10; i++) {
      str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
    }
    return str;
  }

  function handlePhoneChange(val) {
    setPhone(val);
    if (errorMessage) setErrorMessage('');
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
  }

  function handlePasswordChange(val) {
    setPassword(val);
    if (errorMessage) setErrorMessage('');
    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
  }

  async function handleLogin(e) {
    if (e) e.preventDefault();
    
    // Client-side validation
    const cleanPhone = toEnglishDigits(phone.trim());
    const newErrors = {};
    if (!cleanPhone) {
      newErrors.phone = 'لطفاً شماره موبایل مدیریت را وارد فرمایید.';
    } else if (!/^09\d{9}$/.test(cleanPhone)) {
      newErrors.phone = 'شماره موبایل باید ۱۱ رقمی و با ۰۹ آغاز شود.';
    }

    if (!password) {
      newErrors.password = 'لطفاً رمز عبور را وارد فرمایید.';
    } else if (password.length < 6) {
      newErrors.password = 'رمز عبور حداقل باید ۶ کاراکتر باشد.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setErrors({});

    try {
      const res = await loginUser(cleanPhone, password);
      if (res.success) {
        showSuccess('خوش‌آمدید مدیر محترم. نشست امنیتی شما در سرور فعال شد.');
        if (onClose) onClose();
      } else {
        setErrorMessage(res.message || 'شماره موبایل یا رمز عبور اشتباه است.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'خطا در ارتباط با سرور برای تایید هویت');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.authModalOverlay} onClick={onClose}>
      <div className={styles.authModalCard} onClick={e => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className={styles.modalCloseBtn}
          style={{ position: 'absolute', top: '1rem', left: '1rem' }}
          aria-label="بستن"
        >
          <X size={18} />
        </button>

        <div className={styles.authModalIcon}>
          <ShieldCheck size={32} />
        </div>

        <div>
          <h2 className={styles.authModalTitle}>ورود به پنل مدیریت طلا رایس</h2>
          <p className={styles.authModalSubtitle}>
            جهت دسترسی به سفارشات، مشتریان، انبارداری و قیمت‌ها، مشخصات مدیر سیستم را وارد فرمایید.
          </p>
        </div>

        {errorMessage && (
          <div style={{
            backgroundColor: '#fff1f2',
            border: '1.5px solid #fecdd3',
            color: '#9f1239',
            borderRadius: '0.875rem',
            padding: '0.75rem 1rem',
            fontSize: '0.8125rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            textAlign: 'right',
            animation: 'slideDown 0.2s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 800, color: '#e11d48' }}>
                <AlertCircle size={16} />
                <span>خطای احراز هویت مدیریت</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage('')}
                style={{ background: 'transparent', border: 'none', color: '#9f1239', cursor: 'pointer', padding: '2px', display: 'flex' }}
                aria-label="بستن خطا"
              >
                <X size={14} />
              </button>
            </div>
            <span style={{ fontWeight: 600, marginTop: '2px' }}>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className={styles.authInputGroup}>
            <label className={styles.authInputLabel}>شماره موبایل مدیر سیستم:</label>
            <div style={{ position: 'relative' }}>
              <input
                type="tel"
                dir="ltr"
                value={phone}
                onChange={e => handlePhoneChange(e.target.value)}
                placeholder="۰۹۱۷۰۰۰۰۰۰۰"
                className={`${styles.authInput} ${errors.phone ? styles.inputError : ''}`}
                style={errors.phone ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}}
              />
            </div>
            {errors.phone && (
              <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, marginTop: '2px', display: 'block' }}>
                {errors.phone}
              </span>
            )}
          </div>

          <div className={styles.authInputGroup}>
            <label className={styles.authInputLabel}>رمز عبور پنل مدیریت:</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                dir="ltr"
                value={password}
                onChange={e => handlePasswordChange(e.target.value)}
                placeholder="••••••••"
                className={`${styles.authInput} ${errors.password ? styles.inputError : ''}`}
                style={errors.password ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}}
              />
            </div>
            {errors.password && (
              <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, marginTop: '2px', display: 'block' }}>
                {errors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.authSubmitBtn}
          >
            {loading ? <Loader2 size={18} className="spin-animation" /> : <Lock size={18} />}
            <span>{loading ? 'در حال تایید اعتبار...' : 'تایید هویت و ورود به پنل'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminAuthModal;
