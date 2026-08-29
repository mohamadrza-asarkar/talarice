import React, { useState, useEffect } from 'react';
import { useApp } from '../../context';
import { Users, Search, Plus, UserCheck, ShieldCheck, X, Phone, MapPin, ShoppingBag, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';
import styles from './style.module.css';

export function UsersTab() {
  const { currentUser, users, setUsers, orders, adminApi, showError, showSuccess } = useApp();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState(users || []);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await adminApi.getUsers();
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setUserList(res.data);
        if (setUsers) setUsers(res.data);
      } else if (users && users.length > 0) {
        setUserList(users);
      } else if (currentUser) {
        setUserList([currentUser]);
      }
    } catch (err) {
      // Graceful fallback to context users without annoying popup
      if (users && users.length > 0) {
        setUserList(users);
      } else if (currentUser) {
        setUserList([currentUser]);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'user',
    address: 'شیراز'
  });

  async function handleToggleStatus(user) {
    const userId = user._id || user.id;
    try {
      await adminApi.toggleUserStatus(userId);
      setUserList(prev => prev.map(u => (u._id === userId || u.id === userId ? { ...u, isActive: !u.isActive } : u)));
      showSuccess(`وضعیت کاربر "${user.name}" تغییر یافت.`);
    } catch (err) {
      showError(err, 'تغییر وضعیت کاربر');
    }
  }

  async function handleChangeRole(user, newRole) {
    const userId = user._id || user.id;
    try {
      await adminApi.updateUserRole(userId, newRole);
      setUserList(prev => prev.map(u => (u._id === userId || u.id === userId ? { ...u, role: newRole, isAdmin: newRole === 'admin' } : u)));
      showSuccess(`نقش کاربر به "${newRole === 'admin' ? 'مدیر' : 'کاربر'}" تغییر یافت.`);
    } catch (err) {
      showError(err, 'تغییر نقش کاربر');
    }
  }

  const filteredUsers = userList.filter(function (u) {
    const name = u.name || '';
    const phone = u.phone || '';
    const address = u.address || '';
    return (
      !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      phone.includes(search) ||
      address.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div>
      {/* Header */}
      <div className={styles.tabHeader}>
        <div>
          <h1 className={styles.tabTitle}>
            <span>مشتریان و کاربران فروشگاه</span>
          </h1>
          <p className={styles.tabSubtitle}>
            مشاهده سوابق خرید، سطح کاربری و مدیریت دسترسی‌های کاربران طلا رایس
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className={styles.card}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="جستجو بر اساس نام، شماره موبایل یا شهر..."
              value={search}
              onChange={function (e) { setSearch(e.target.value); }}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.countBadge}>
            تعداد کل کاربران: <span className={styles.countNumber}>{userList.length} نفر</span>
          </div>
        </div>

        {/* Users Table */}
        <div className={styles.tableContainer}>
          {loading ? (
            <div className={styles.emptyState}>
              <Loader2 size={36} className="animate-spin text-emerald-700" />
              <p className={styles.emptyText}>در حال دریافت لیست کاربران از سرور...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className={styles.emptyState}>
              <Users size={56} className={styles.emptyIcon} />
              <p className={styles.emptyText}>هیچ کاربری با این مشخصات یافت نشد</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>مشخصات کاربر</th>
                    <th className={styles.th}>شماره تماس</th>
                    <th className={styles.th}>سطح کاربری</th>
                    <th className={styles.th} style={{ textAlign: 'center' }}>وضعیت دسترسی</th>
                    <th className={styles.th} style={{ textAlign: 'center' }}>عملیات نقش</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(function (user) {
                    const id = user._id || user.id;
                    const name = user.name || 'کاربر سیستم';
                    const isAdminUser = user.role === 'admin' || user.isAdmin;
                    return (
                      <tr key={id} className={styles.tr}>
                        {/* User Avatar & Name */}
                        <td className={styles.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div className={styles.userAvatarCircle}>
                              {name.trim()[0] || 'ک'}
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, color: '#042a1b', fontSize: '0.875rem' }}>
                                {name}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.125rem' }}>
                                {user.address ? `نشانی: ${user.address}` : 'ثبت نام شده در سامانه'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className={styles.td}>
                          <span
                            dir="ltr"
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '0.8125rem',
                              fontWeight: 700,
                              color: '#334155',
                              backgroundColor: '#f8fafc',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.375rem',
                              border: '1px solid #e2e8f0'
                            }}
                          >
                            {user.phone || '---'}
                          </span>
                        </td>

                        {/* Role */}
                        <td className={styles.td}>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              padding: '0.25rem 0.625rem',
                              borderRadius: '9999px',
                              backgroundColor: isAdminUser ? '#fef3c7' : '#ecfdf5',
                              color: isAdminUser ? '#92400e' : '#065f46',
                              border: `1px solid ${isAdminUser ? '#fde68a' : '#a7f3d0'}`
                            }}
                          >
                            {isAdminUser ? 'مدیر سیستم' : 'مشتری فروشگاه'}
                          </span>
                        </td>

                        {/* Status Toggle */}
                        <td className={styles.td} style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(user)}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: user.isActive !== false ? '#059669' : '#dc2626'
                            }}
                          >
                            {user.isActive !== false ? (
                              <>
                                <ToggleRight size={22} />
                                <span>فعال</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft size={22} />
                                <span>مسدود</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Role Toggle Actions */}
                        <td className={styles.td} style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleChangeRole(user, isAdminUser ? 'user' : 'admin')}
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              background: '#f8fafc',
                              cursor: 'pointer'
                            }}
                          >
                            {isAdminUser ? 'تبدیل به کاربر عادی' : 'ارتقا به مدیر'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UsersTab;
