import React from 'react';
import { Users, UserPlus, ShieldCheck, Trash2, X } from 'lucide-react';
import styles from '../../../pages/pages.module.css';

export function AdminUsers({
  adminUsers = [],
  userSearchQuery = '',
  setUserSearchQuery,
  showAddUserModal,
  setShowAddUserModal,
  newUserName = '',
  setNewUserName,
  newUserPhone = '',
  setNewUserPhone,
  newUserEmail = '',
  setNewUserEmail,
  newUserPassword = '',
  setNewUserPassword,
  newUserRole = 'user',
  setNewUserRole,
  handleAddUser,
  isSubmittingUser = false,
  handleDeleteUser,
  handleUpdateUserRole
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
          <p className={styles.pageSubtitle}>فهرست مشتریان، کشاورزان و مدیران ثبت‌نام شده در پایگاه داده با قابلیت مدیریت نقش و حذف</p>
        </div>
        <button
          type="button"
          className={styles.backButton}
          style={{ backgroundColor: '#1C3A27', color: '#fff', borderColor: '#1C3A27' }}
          onClick={() => setShowAddUserModal && setShowAddUserModal(true)}
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

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className={styles.backButton}
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    onClick={() => handleUpdateUserRole && handleUpdateUserRole(uid, u.role || (isAdminRole ? 'admin' : 'user'))}
                  >
                    {isAdminRole ? 'تنظیم به کاربر' : 'ارتقا به مدیر'}
                  </button>
                  <button
                    type="button"
                    className={styles.btnDanger}
                    style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => handleDeleteUser && handleDeleteUser(uid)}
                  >
                    <Trash2 size={14} />
                    حذف
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', maxWidth: '500px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#1C3A27', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={20} />
                افزودن کاربر جدید به سامانه
              </h3>
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>نام و نام خانوادگی *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="مثال: رضا کریمی"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>شماره تماس (موبایل) *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="09123456789"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>ایمیل (اختیاری)</label>
                <input
                  type="email"
                  className={styles.input}
                  placeholder="user@example.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>کلمه عبور اولیه *</label>
                <input
                  type="password"
                  required
                  className={styles.input}
                  placeholder="حداقل ۶ کاراکتر"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>نقش کاربر در سامانه</label>
                <select
                  className={styles.input}
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                >
                  <option value="user">کاربر عادی / مشتری</option>
                  <option value="admin">مدیر سیستم (Admin)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className={styles.backButton}
                  onClick={() => setShowAddUserModal(false)}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className={styles.btnPrimary}
                  disabled={isSubmittingUser}
                >
                  {isSubmittingUser ? 'در حال ثبت...' : 'ثبت و ایجاد کاربر'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
