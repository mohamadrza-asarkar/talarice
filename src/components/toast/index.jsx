import React from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle, X, ServerCrash, RefreshCcw, ShieldAlert, FileWarning } from 'lucide-react';
import styles from './style.module.css';

export function ToastContainer({ toasts = [], onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer} role="region" aria-label="اعلانات سیستم">
      {toasts.map(toast => {
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
          badgeLabel = 'ارتباط با سرور / به‌روزرسانی';
        } else if (isValidationError) {
          typeClass = styles.toastValidationError;
          Icon = FileWarning;
          badgeLabel = 'خطای فرمت ورودی';
        }

        return (
          <div
            key={toast.id}
            className={`${styles.toastItem} ${typeClass}`}
            role="alert"
          >
            <div className={styles.iconWrapper}>
              <Icon size={20} />
            </div>
            <div className={styles.toastContent}>
              <div className={styles.toastHeader}>
                <span className={styles.toastTitle}>
                  {toast.title || (isServerError ? 'سرور در حال به‌روزرسانی است' : isValidationError ? 'خطا در فرمت اطلاعات' : 'خطای سیستم')}
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
                onClick={() => onDismiss(toast.id)}
                className={styles.closeBtn}
                aria-label="بستن اعلان"
              >
                <X size={16} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ToastContainer;
