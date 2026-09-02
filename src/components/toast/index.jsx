import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  X,
  ServerCrash,
  Sparkles,
  FileWarning,
  AlertCircle
} from 'lucide-react';
import styles from './style.module.css';

function ToastItem({ toast, onDismiss }) {
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const duration = toast.duration || (toast.isServerError ? 8000 : 5000);
  const startTimeRef = useRef(Date.now());
  const remainingRef = useRef(duration);
  const timerRef = useRef(null);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 280);
  };

  useEffect(() => {
    if (duration <= 0) return;

    if (!isPaused) {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        handleDismiss();
      }, remainingRef.current);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPaused, duration]);

  const handleMouseEnter = () => {
    if (duration > 0) {
      remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startTimeRef.current));
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (duration > 0) {
      setIsPaused(false);
    }
  };

  const type = toast.type || 'error';
  const isServerError = toast.isServerError;
  const isValidationError = toast.isValidationError || toast.errorType === 'VALIDATION_ERROR';

  let typeClass = styles.toastError;
  let Icon = XCircle;
  let badgeLabel = 'خطا';

  if (type === 'success') {
    typeClass = styles.toastSuccess;
    Icon = CheckCircle2;
    badgeLabel = 'موفقیت';
  } else if (type === 'warning') {
    typeClass = styles.toastWarning;
    Icon = AlertTriangle;
    badgeLabel = 'هشدار';
  } else if (type === 'info') {
    typeClass = styles.toastInfo;
    Icon = Info;
    badgeLabel = 'اطلاع‌رسانی';
  } else if (isServerError) {
    typeClass = styles.toastServerError;
    Icon = ServerCrash;
    badgeLabel = 'به‌روزرسانی سرور';
  } else if (isValidationError) {
    typeClass = styles.toastValidationError;
    Icon = FileWarning;
    badgeLabel = 'فرمت اطلاعات';
  }

  return (
    <div
      className={`${styles.toastItem} ${typeClass} ${isExiting ? styles.toastItemExiting : ''}`}
      role="alert"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.iconWrapper}>
        <Icon size={22} strokeWidth={2.2} />
      </div>

      <div className={styles.toastContent}>
        <div className={styles.toastHeader}>
          <span className={styles.toastTitle}>
            {toast.title || (isServerError ? 'سرور در حال به‌روزرسانی است' : isValidationError ? 'خطا در فرمت اطلاعات' : type === 'success' ? 'عملیات موفق' : 'خطای سیستم')}
          </span>
          <span className={styles.typeBadge}>{badgeLabel}</span>
          {toast.statusCode && (
            <span className={styles.codeBadge}>
              کد: {toast.statusCode}
            </span>
          )}
        </div>

        <p className={styles.toastMessage}>{toast.message}</p>

        {toast.actionAdvice && (
          <div className={styles.toastAdvice}>
            💡 {toast.actionAdvice}
          </div>
        )}

        {toast.details && (
          <div className={styles.toastDetails}>
            {toast.details}
          </div>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={handleDismiss}
          className={styles.closeBtn}
          aria-label="بستن پیام"
          title="بستن"
        >
          <X size={16} />
        </button>
      )}

      {duration > 0 && (
        <div className={styles.progressBarContainer}>
          <div
            className={`${styles.progressBar} ${isPaused ? styles.progressBarPaused : ''}`}
            style={{
              animationDuration: `${duration}ms`
            }}
          />
        </div>
      )}
    </div>
  );
}

export function ToastContainer({ toasts = [], onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer} role="region" aria-label="اعلانات سیستم">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}

export default ToastContainer;

