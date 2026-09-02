import React, { useState, useEffect } from 'react';
import { Wrench, RefreshCw, Loader2, ServerCrash, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
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
    }, 800);
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
          <ServerCrash size={38} strokeWidth={2.2} />
        </div>

        <div className={styles.brandLogo}>
          <span>🌾 فروشگاه برنج اصیل طلا رایس</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'center' }}>
          <h1 className={styles.title}>عدم برقراری ارتباط با سرور</h1>
          <p className={styles.subtitle}>
            ارتباط با پایگاه داده یا وب‌سرویس در دسترس نیست یا سامانه در حال به‌روزرسانی است.
          </p>
        </div>

        {health && (health.message || health.statusCode) && (
          <div className={styles.errorDetailsBox}>
            <div className={styles.errorHeader}>
              <ShieldAlert size={15} className="text-amber-400" />
              <span>گزارش وضعیت اتصال:</span>
            </div>
            <p className={styles.errorText}>
              {health.displayText || health.message || `کد وضعیت: ${health.statusCode || 503}`}
            </p>
          </div>
        )}

        <div className={styles.countdownBadge}>
          <RefreshCw size={14} className={isRetrying ? 'animate-spin text-amber-400' : ''} />
          <span>تلاش خودکار مجدد تا</span>
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
          <span>{isRetrying ? 'در حال بررسی اتصال به سرور...' : 'تلاش مجدد و اتصال به سایت'}</span>
        </button>

        <div className={styles.footerNotice}>
          لطفاً از روشن بودن سرور یا اتصال پایدار اینترنت اطمینان حاصل فرمایید.
        </div>
      </div>
    </div>
  );
}

function RiceStalkLoaderIcon() {
  return (
    <svg
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.riceStalkSvg}
    >
      {/* Central curved stem */}
      <path
        d="M12 34C12 24 13 13 10.5 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Top grain */}
      <path
        d="M10.5 2C11.8 0.2 13.8 0.5 14 2.2C14.2 3.8 12.2 4.8 10.5 2Z"
        fill="currentColor"
      />
      {/* Pair 1 */}
      <path
        d="M10.5 6C7.2 4.8 5.8 7.2 7.2 9.2C8.8 11 11 9 10.5 6Z"
        fill="currentColor"
      />
      <path
        d="M11.5 7.2C14.8 6 16.2 8.5 14.8 10.5C13.2 12.2 11 10.2 11.5 7.2Z"
        fill="currentColor"
      />
      {/* Pair 2 */}
      <path
        d="M11 12.5C7.2 11.2 5.5 14 7.5 16.2C9.8 18 12 15.2 11 12.5Z"
        fill="currentColor"
      />
      <path
        d="M12 13.8C15.8 12.5 17.5 15.2 15.5 17.5C13.2 19.2 11 16.5 12 13.8Z"
        fill="currentColor"
      />
      {/* Pair 3 */}
      <path
        d="M11.5 19.5C7.8 18.2 6.2 21.2 8.2 23.5C10.5 25.2 12.5 22.5 11.5 19.5Z"
        fill="currentColor"
      />
      <path
        d="M12.5 20.8C16.2 19.5 17.8 22.5 15.8 24.8C13.5 26.5 11.5 23.8 12.5 20.8Z"
        fill="currentColor"
      />
      {/* Pair 4 */}
      <path
        d="M12 26.5C8.8 25.2 7.5 28.2 9.5 30C11.5 31.5 13 29.2 12 26.5Z"
        fill="currentColor"
      />
      <path
        d="M12.5 27.5C15.8 26.2 17 29.2 15 31C13 32.5 11.5 30.2 12.5 27.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function InitialLoadingScreen() {
  return (
    <div className={styles.digiSplashContainer}>
      <div className={styles.riceStalksOnlyWrapper}>
        <div className={styles.riceStalksLoader}>
          <div className={`${styles.stalkItem} ${styles.stalk1}`}>
            <RiceStalkLoaderIcon />
          </div>
          <div className={`${styles.stalkItem} ${styles.stalk2}`}>
            <RiceStalkLoaderIcon />
          </div>
          <div className={`${styles.stalkItem} ${styles.stalk3}`}>
            <RiceStalkLoaderIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaintenanceScreen;


