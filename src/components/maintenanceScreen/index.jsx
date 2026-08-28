import React, { useState, useEffect } from 'react';
import { Wrench, RefreshCw, Loader2, ShieldCheck } from 'lucide-react';
import styles from './style.module.css';

export function MaintenanceScreen({ onRetry, health }) {
  const [countdown, setCountdown] = useState(20);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (onRetry) {
            onRetry();
          }
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onRetry]);

  const handleManualRetry = async () => {
    setIsRetrying(true);
    if (onRetry) {
      await onRetry();
    }
    setTimeout(() => {
      setIsRetrying(false);
      setCountdown(20);
    }, 1000);
  };

  function toPersianDigits(num) {
    const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, d => pDigits[d]);
  }

  return (
    <div className={styles.maintenanceContainer}>
      <div className={styles.maintenanceCard}>
        <div className={styles.iconWrapper}>
          <div className={styles.pulseRing} />
          <Wrench size={38} strokeWidth={2.2} />
        </div>

        <div className={styles.brandLogo}>
          <span>🌾 فروشگاه طلا رایس</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          <h1 className={styles.title}>سایت در حال تعمیر می‌باشد</h1>
          <p className={styles.subtitle}>لطفاً دقایقی دیگر امتحان کنید</p>
        </div>

        <div className={styles.countdownBadge}>
          <RefreshCw size={14} className={isRetrying ? 'animate-spin text-amber-400' : ''} />
          <span>بررسی خودکار اتصال تا</span>
          <span className={styles.countdownNumber}>{toPersianDigits(countdown)}</span>
          <span>ثانیه دیگر...</span>
        </div>

        <button
          type="button"
          onClick={handleManualRetry}
          disabled={isRetrying}
          className={styles.retryBtn}
        >
          <RefreshCw size={18} className={isRetrying ? 'animate-spin' : ''} />
          <span>{isRetrying ? 'در حال بررسی اتصال سرور...' : 'تلاش مجدد و ورود به سایت'}</span>
        </button>

        <div className={styles.footerNotice}>
          پشتیبانی فنی در حال به‌روزرسانی سامانه می‌باشد. از شکیبایی شما سپاسگزاریم.
        </div>
      </div>
    </div>
  );
}

export function InitialLoadingScreen() {
  return (
    <div className={styles.loadingContainer}>
      <Loader2 size={36} className={styles.loadingSpinner} />
      <span className={styles.loadingText}>در حال بررسی وضعیت سامانه...</span>
    </div>
  );
}

export default MaintenanceScreen;
