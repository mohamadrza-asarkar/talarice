import React from 'react';
import { Users, UserPlus, ShieldCheck } from 'lucide-react';
import styles from '../../../pages/pages.module.css';

export function AdminUsers({
  adminUsers,
  userSearchQuery,
  setUserSearchQuery,
  setShowAddUserModal
}) {
  const filteredUsers = adminUsers.filter((u) => {
    if (!userSearchQuery.trim()) return true;
    const q = userSearchQuery.toLowerCase().trim();
    return (
      String(u.name || '').toLowerCase().includes(q) ||
      String(u.phone || u.mobile || '').includes(q) ||
      String(u.email || '').toLowerCase().includes(q)
    );
  });

  return (
    <section className={styles.card}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle} style={{ margin: 0 }}>مدیریت کاربران سامانه</h2>
          <p className={styles.pageSubtitle}>فهرست مشتریان، کشاورزان و مدیران ثبت‌نام شده در پایگاه داده</p>
        </div>
        <button
          type="button"
          className={styles.backButton}
          style={{ backgroundColor: '#1C3A27', color: '#fff', borderColor: '#1C3A27' }}
          onClick={() => setShowAddUserModal(true)}
        >
          <UserPlus size={15} />
          افزودن کاربر جدید
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          className={styles.input}
          placeholder="جستجو با نام، شماره تماس یا ایمیل کاربر..."
          value={userSearchQuery}
          onChange={(e) => setUserSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.flexCol} style={{ gap: '0.75rem' }}>
        {filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#78716c', background: '#fafaf9', borderRadius: '12px' }}>
            <Users size={32} style={{ margin: '0 auto 0.5rem auto', opacity: 0.5 }} />
            <p>کاربری با مشخصات مورد نظر یافت نشد.</p>
          </div>
        ) : (
          filteredUsers.map((u) => {
            const uid = u._id || u.id;
            const isAdminRole = u.role === 'admin' || u.isAdmin;
            return (
              <div key={uid} className={styles.statBox} style={{ border: '1px solid #e2e8f0', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div className={styles.flexRow} style={{ alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <strong style={{ fontSize: '1rem', color: '#111827' }}>{u.name || 'کاربر بدون نام'}</strong>
                    {isAdminRole && (
                      <span className={styles.badge} style={{ backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fde68a' }}>
                        <ShieldCheck size={12} style={{ display: 'inline', verticalAlign: '-2px', marginLeft: '3px' }} />
                        مدیر سیستم
                      </span>
                    )}
                  </div>
                  <p className={styles.pageSubtitle} style={{ margin: 0 }}>
                    تلفن: <span dir="ltr">{u.phone || u.mobile || 'ثبت نشده'}</span> | ایمیل: {u.email || 'ثبت نشده'}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
