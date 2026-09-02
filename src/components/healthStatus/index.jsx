import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, RefreshCw, Server, WifiOff, Wrench, CheckCircle2 } from 'lucide-react';
import styles from './style.module.css';

export function HealthStatusIndicator({ health, onRetry }) {
  const [isRetrying, setIsRetrying] = useState(false);

  if (!health) return null;

  const isHealthy = health.status === 'healthy';
  const isChecking = health.status === 'checking' || isRetrying;

  let statusClass = styles.healthy;
  let statusText = 'سرور فعال و برخط';

  if (isChecking) {
    statusClass = styles.checking;
    statusText = 'در حال بررسی اتصال...';
  } else if (!isHealthy) {
    statusClass = styles.unhealthy;
    statusText = 'سرور در حال به‌روزرسانی';
  }

  async function handleClick() {
    if (onRetry && !isChecking) {
      setIsRetrying(true);
      try {
        await onRetry();
      } finally {
        setTimeout(() => setIsRetrying(false), 500);
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${styles.healthBadge} ${statusClass}`}
      style={{ cursor: onRetry ? 'pointer' : 'default' }}
      title={isHealthy ? 'وضعیت سرور: فعال و برخط (برای بررسی و به‌روزرسانی کلیک کنید)' : 'در حال تلاش برای اتصال به سرور'}
    >
      <span className={styles.pulseDot} />
      {isChecking ? (
        <RefreshCw size={13} className="spin-animation" />
      ) : isHealthy ? (
        <Activity size={13} />
      ) : (
        <Wrench size={13} />
      )}
      <span>{statusText}</span>
    </button>
  );
}

export function HealthErrorBanner({ health, onRetry }) {
  const [countdown, setCountdown] = useState(20);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (!health || health.status === 'healthy') {
      setCountdown(20);
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (onRetry) onRetry();
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [health, onRetry]);

  if (!health || health.status === 'healthy' || health.status === 'checking') return null;

  const handleManualRetry = async () => {
    setIsRetrying(true);
    if (onRetry) {
      await onRetry();
    }
    setTimeout(() => {
      setIsRetrying(false);
      setCountdown(20);
    }, 800);
  };

  return (
    <div className={styles.errorBanner} role="alert">
      <div className={styles.errorContent}>
        <div className={styles.bannerIconWrap}>
          <Wrench size={18} />
        </div>
        <div className={styles.bannerTextWrap}>
          <div className={styles.bannerTitle}>
            <span>🛠️ سرور در حال به‌روزرسانی و ارتقای زیرساخت است</span>
            <span className={styles.maintenanceBadge}>به‌روزرسانی خودکار تا {countdown} ثانیه دیگر</span>
          </div>
          <p className={styles.bannerDesc}>
            سرویس‌دهنده موقتاً در حال بهینه‌سازی است. لطفاً چند لحظه بعد مجدداً تلاش نمایید. اطلاعات شما کاملاً محفوظ است.
          </p>
        </div>
      </div>
      <div className={styles.bannerActions}>
        <button
          type="button"
          onClick={handleManualRetry}
          className={styles.retryBtn}
          disabled={isRetrying}
        >
          <RefreshCw size={13} className={isRetrying ? 'animate-spin' : ''} />
          <span>{isRetrying ? 'در حال اتصال...' : 'تلاش مجدد'}</span>
        </button>
      </div>
    </div>
  );
}

export default HealthStatusIndicator;
