import React, { useState } from 'react';
import { useApp } from '../../context';
import { Users, Search, Plus, UserCheck, ShieldCheck, X, Phone, MapPin, ShoppingBag } from 'lucide-react';
import styles from './style.module.css';

export const UsersTab = () => {
  const { currentUser, orders } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initial rich user list
  const [userList, setUserList] = useState([
    {
      id: 'usr-admin',
      name: currentUser?.name || 'محمد رضایی',
      phone: currentUser?.phone || '۰۹۱۷ ۱۲۳ ۴۵۶۷',
      role: 'admin',
      roleTitle: 'مدیر ارشد سیستم',
      ordersCount: orders.length,
      totalSpend: orders.reduce((sum, o) => sum + (o.finalAmount || o.totalPrice || 1450000), 0),
      city: 'شیراز',
      regDate: '۱۴۰۳/۰۱/۱۵',
      status: 'active'
    },
    {
      id: 'usr-2',
      name: 'دکتر علیرضا محمودی',
      phone: '۰۹۱۷ ۹۸۷ ۶۵۴۳',
      role: 'vip',
      roleTitle: 'مشتری وفادار VIP',
      ordersCount: 4,
      totalSpend: 5800000,
      city: 'تهران',
      regDate: '۱۴۰۳/۰۳/۱۰',
      status: 'active'
    },
    {
      id: 'usr-3',
      name: 'خانم مریم کاظمی',
      phone: '۰۹۳۵ ۱۱۱ ۲۲۳۳',
      role: 'vip',
      roleTitle: 'خریدار عمده مجالس',
      ordersCount: 6,
      totalSpend: 11920000,
      city: 'شیراز',
      regDate: '۱۴۰۳/۰۲/۲۲',
      status: 'active'
    },
    {
      id: 'usr-4',
      name: 'مهندس سعید کرمی',
      phone: '۰۹۱۲ ۳۴۵ ۶۷۸۹',
      role: 'customer',
      roleTitle: 'مشتری همیشگی',
      ordersCount: 2,
      totalSpend: 3160000,
      city: 'اصفهان',
      regDate: '۱۴۰۳/۰۴/۱۸',
      status: 'active'
    },
    {
      id: 'usr-5',
      name: 'فاطمه رضایی',
      phone: '۰۹۱۸ ۵۵۵ ۴۴۳۳',
      role: 'customer',
      roleTitle: 'مشتری خانگی',
      ordersCount: 1,
      totalSpend: 820000,
      city: 'همدان',
      regDate: '۱۴۰۳/۰۵/۰۴',
      status: 'active'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'customer',
    city: 'شیراز'
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    const newUser = {
      id: `usr_${Date.now()}`,
      name: formData.name,
      phone: formData.phone,
      role: formData.role,
      roleTitle: formData.role === 'admin' ? 'مدیر سیستم' : formData.role === 'vip' ? 'مشتری وفادار VIP' : 'مشتری جدید',
      ordersCount: 0,
      totalSpend: 0,
      city: formData.city || 'ایران',
      regDate: new Intl.DateTimeFormat('fa-IR').format(new Date()),
      status: 'active'
    };

    setUserList([newUser, ...userList]);
    setIsModalOpen(false);
    setFormData({ name: '', phone: '', role: 'customer', city: 'شیراز' });
  };

  const filteredUsers = userList.filter((u) => {
    return (
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search) ||
      u.city.toLowerCase().includes(search.toLowerCase())
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
            مشاهده سوابق خرید، سطح کاربری و مشخصات مشتریان وفادار طلا رایس
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className={styles.addBtn}>
          <Plus size={19} strokeWidth={2.5} />
          <span>ثبت کاربر جدید</span>
        </button>
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
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.countBadge}>
            تعداد کل کاربران فعال: <span className={styles.countNumber}>{userList.length} نفر</span>
          </div>
        </div>

        {/* Users Table */}
        <div className={styles.tableContainer}>
          {filteredUsers.length === 0 ? (
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
                    <th className={styles.th}>تعداد سفارشات</th>
                    <th className={styles.th}>مجموع خرید</th>
                    <th className={styles.th} style={{ textAlign: 'center' }}>وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className={styles.tr}>
                      {/* User Avatar & Name */}
                      <td className={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className={styles.userAvatarCircle}>
                            {user.name.trim()[0] || 'ک'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: '#042a1b', fontSize: '0.875rem' }}>
                              {user.name}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.125rem' }}>
                              شهر: {user.city} | عضویت: {user.regDate}
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
                            border: '1px solid #e2e8f0',
                            display: 'inline-block'
                          }}
                        >
                          {user.phone}
                        </span>
                      </td>

                      {/* Role */}
                      <td className={styles.td}>
                        {user.role === 'admin' ? (
                          <span className={styles.roleBadgeAdmin}>مدیر ارشد</span>
                        ) : user.role === 'vip' ? (
                          <span className={styles.roleBadgeVIP}>مشتری VIP</span>
                        ) : (
                          <span className={styles.roleBadgeCustomer}>مشتری عادی</span>
                        )}
                      </td>

                      {/* Orders Count */}
                      <td className={styles.td}>
                        <span style={{ fontWeight: 800, color: '#042a1b' }}>
                          {user.ordersCount} سفارش
                        </span>
                      </td>

                      {/* Total Spend */}
                      <td className={styles.td}>
                        <span className={styles.priceText}>
                          {user.totalSpend > 0 ? user.totalSpend.toLocaleString() : '---'}
                        </span>
                        {user.totalSpend > 0 && <span className={styles.currency}>تومان</span>}
                      </td>

                      {/* Status */}
                      <td className={styles.td} style={{ textAlign: 'center' }}>
                        <span className={styles.userActiveBadge}>
                          <span className={styles.userActiveDot} />
                          فعال
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>افزودن کاربر یا مشتری جدید</h3>
                <p className={styles.modalDesc}>مشخصات تماس و سطح دسترسی کاربر را مشخص کنید.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className={styles.modalCloseBtn}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalContent}>
              <form onSubmit={handleAddUser} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>نام و نام خانوادگی کامل</label>
                    <input
                      required
                      type="text"
                      placeholder="مثال: رضا احمدی"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>شماره تماس همراه</label>
                    <input
                      required
                      type="text"
                      placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      dir="ltr"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>شهر سکونت</label>
                    <input
                      type="text"
                      placeholder="مثال: شیراز"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>سطح دسترسی / نقش کاربر</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className={styles.select}
                    >
                      <option value="customer">مشتری عادی</option>
                      <option value="vip">مشتری وفادار VIP</option>
                      <option value="admin">مدیر سیستم (دسترسی به پنل)</option>
                    </select>
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className={styles.cancelBtn}
                  >
                    انصراف
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    ثبت حساب کاربری
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
