import React, { useState } from 'react';
import { Users, UserPlus, ShieldCheck, Trash2, X, AlertCircle } from 'lucide-react';
import styles from '../admin.module.css';

const initialForm = {
  name: '',
  phone: '',
  email: '',
  password: '',
  role: 'user'
};

export function AdminUsers({
  adminUsers = [],
  onAddUser,
  onDeleteUser,
  onUpdateRole
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredUsers = adminUsers.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      String(u.name || '').toLowerCase().includes(q) ||
      String(u.phone || '').includes(q) ||
      String(u.email || '').toLowerCase().includes(q)
    );
  });

  const handleFieldChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone.trim()) return;
    setIsSubmitting(true);
    try {
      if (onAddUser) {
        await onAddUser(form);
      }
      setForm(initialForm);
      setShowModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.card}>
      <div className={styles.toolbar}>
        <div className={styles.titleArea}>
          <h2 className={styles.title}>مدیریت کاربران سامانه</h2>
          <p className={styles.subtitle}>مشاهده، ارتقا نقش یا حذف حساب‌های کاربری</p>
        </div>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={() => setShowModal(true)}
        >
          <UserPlus size={16} />
          <span>افزودن کاربر جدید</span>
        </button>
      </div>

      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="جستجو با نام، شماره تماس یا ایمیل..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.itemsList}>
        {filteredUsers.length === 0 ? (
          <div className={styles.emptyState}>
            <Users size={32} />
            <p>کاربری با این مشخصات یافت نشد.</p>
          </div>
        ) : (
          filteredUsers.map((u) => {
            const uid = u.id || u._id;
            const isAdmin = u.role === 'admin' || u.isAdmin;
            return (
              <div key={uid} className={styles.itemRow}>
                <div className={styles.itemDetails}>
                  <div className={styles.rowCenter}>
                    <h3 className={styles.itemName}>{u.name || 'کاربر بدون نام'}</h3>
                    {isAdmin && (
                      <span className={`${styles.badge} ${styles.badgeWarning}`}>
                        <ShieldCheck size={12} />
                        <span>مدیر سیستم</span>
                      </span>
                    )}
                  </div>
                  <p className={styles.itemMeta}>
                    <span>تلفن: {u.phone || 'ثبت نشده'}</span>
                    <span>|</span>
                    <span>ایمیل: {u.email || 'ثبت نشده'}</span>
                  </p>
                </div>

                <div className={styles.itemActions}>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => onUpdateRole && onUpdateRole(uid, isAdmin ? 'user' : 'admin')}
                  >
                    {isAdmin ? 'تنظیم به کاربر عادی' : 'ارتقا به مدیر'}
                  </button>
                  <button
                    type="button"
                    className={styles.dangerBtn}
                    onClick={() => setUserToDelete(u)}
                  >
                    <Trash2 size={14} />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete confirmation modal */}
      {userToDelete && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>تأیید حذف کاربر</h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setUserToDelete(null)}
              >
                <X size={18} />
              </button>
            </div>
            <p className={styles.confirmText}>
              آیا از حذف حساب کاربری «{userToDelete.name || userToDelete.phone}» اطمینان دارید؟
            </p>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setUserToDelete(null)}
              >
                انصراف
              </button>
              <button
                type="button"
                className={styles.dangerBtn}
                onClick={() => {
                  const uid = userToDelete.id || userToDelete._id;
                  setUserToDelete(null);
                  if (onDeleteUser) onDeleteUser(uid);
                }}
              >
                حذف قطعی
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>افزودن کاربر جدید</h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>نام و نام خانوادگی</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="مثال: علی احمدی"
                  value={form.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>شماره تماس (الزامی)</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  value={form.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>رمز عبور (الزامی)</label>
                <input
                  type="password"
                  className={styles.input}
                  placeholder="حداقل ۶ کاراکتر"
                  value={form.password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>ایمیل (اختیاری)</label>
                <input
                  type="email"
                  className={styles.input}
                  placeholder="user@example.com"
                  value={form.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>سطح دسترسی</label>
                <select
                  className={styles.select}
                  value={form.role}
                  onChange={(e) => handleFieldChange('role', e.target.value)}
                >
                  <option value="user">کاربر عادی / خریدار</option>
                  <option value="admin">مدیر سیستم (دسترسی کامل)</option>
                </select>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => setShowModal(false)}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className={styles.primaryBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'در حال ثبت...' : 'ثبت کاربر'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminUsers;
