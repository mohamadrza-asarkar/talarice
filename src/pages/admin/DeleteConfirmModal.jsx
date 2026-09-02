import React from 'react';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';
import styles from './style.module.css';

/**
 * Reusable Luxury Delete Confirmation Modal
 * @param {boolean} isOpen - Whether modal is visible
 * @param {Function} onClose - Close handler
 * @param {Function} onConfirm - Confirm delete handler
 * @param {string} title - Title (e.g. "حذف محصول")
 * @param {string} message - Description message
 * @param {string} itemName - Optional specific name of item being deleted
 * @param {string} itemType - Optional item type tag (e.g. "سفارش", "کاربر", "محصول")
 * @param {boolean} isLoading - Loading state during deletion
 * @param {string} confirmText - Button label (default: "بله، حذف شود")
 */
export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'تأیید عملیات حذف',
  message = 'آیا از حذف این مورد اطمینان دارید؟ اطلاعات حذف شده قابل بازیابی نخواهند بود.',
  itemName,
  itemType,
  isLoading = false,
  confirmText = 'بله، حذف شود'
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.deleteModalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={styles.deleteModalBox}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={styles.deleteModalCloseBtn}
          aria-label="انصراف و بستن"
          disabled={isLoading}
        >
          <X size={18} />
        </button>

        {/* Danger Icon Header */}
        <div className={styles.deleteModalIconWrapper}>
          <div className={styles.deleteModalIconOuter}>
            <div className={styles.deleteModalIconInner}>
              <Trash2 size={28} strokeWidth={2.2} />
            </div>
          </div>
        </div>

        {/* Title and Message */}
        <div className={styles.deleteModalBody}>
          <h3 className={styles.deleteModalTitle}>{title}</h3>
          
          {itemName && (
            <div className={styles.deleteModalItemCard}>
              {itemType && <span className={styles.deleteModalItemType}>{itemType}</span>}
              <span className={styles.deleteModalItemName}>{itemName}</span>
            </div>
          )}

          <p className={styles.deleteModalMessage}>
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className={styles.deleteModalActions}>
          <button
            type="button"
            onClick={onClose}
            className={styles.deleteModalCancelBtn}
            disabled={isLoading}
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={styles.deleteModalConfirmBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                <Loader2 size={16} className="animate-spin" />
                <span>در حال حذف...</span>
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                <Trash2 size={16} />
                <span>{confirmText}</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
