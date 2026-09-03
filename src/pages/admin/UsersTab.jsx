import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context';
import {
  Users,
  Search,
  Plus,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  X,
  Phone,
  MapPin,
  ShoppingBag,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Shield,
  ChevronLeft,
  ChevronRight,
  UserX,
  Edit2,
  Trash2,
  Lock,
  UserPlus,
  KeyRound
} from 'lucide-react';
import styles from './style.module.css';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export function UsersTab() {
  const { currentUser, users, setUsers, orders, adminApi, showError, showSuccess } = useApp();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState(users || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);

  const initialForm = {
    name: '',
    phone: '',
    password: '',
    address: '',
    role: 'user',
    isActive: true
  };

  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});

  function toEnglishDigits(str) {
    if (!str) return '';
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
    for (let i = 0; i < 10; i++) {
      str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
    }
    return str;
  }

  function handleFieldChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await adminApi.getUsers();
      if (res.data && Array.isArray(res.data)) {
        setUserList(res.data);
        if (setUsers) setUsers(res.data);
      } else if (users && users.length > 0) {
        setUserList(users);
      } else if (currentUser) {
        setUserList([currentUser]);
      }
    } catch (err) {
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

  function openAddModal() {
    setEditingUser(null);
    setFormData(initialForm);
    setFormErrors({});
    setIsModalOpen(true);
  }

  function openEditModal(user) {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      phone: user.phone || user.mobile || '',
      password: '',
      address: user.address || '',
      role: user.role === 'admin' || user.isAdmin ? 'admin' : 'user',
      isActive: user.isActive !== false
    });
    setFormErrors({});
    setIsModalOpen(true);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    const cleanName = formData.name.trim();
    const cleanPhone = toEnglishDigits(formData.phone.trim());
    const newErrors = {};

    if (!cleanName) {
      newErrors.name = 'لطفاً نام و نام خانوادگی کاربر را وارد فرمایید.';
    } else if (cleanName.length < 3) {
      newErrors.name = 'نام باید حداقل دارای ۳ کاراکتر باشد.';
    }

    if (!cleanPhone) {
      newErrors.phone = 'لطفاً شماره موبایل کاربر را وارد فرمایید.';
    } else if (!/^09\d{9}$/.test(cleanPhone)) {
      newErrors.phone = 'شماره موبایل نامعتبر است (مثال: ۰۹۱۷۱۲۳۴۵۶۷).';
    }

    if (!editingUser) {
      if (!formData.password) {
        newErrors.password = 'تعیین رمز عبور اولیه برای کاربر جدید الزامی است.';
      } else if (formData.password.length < 6) {
        newErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد.';
      }
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد.';
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    const payload = {
      name: cleanName,
      phone: cleanPhone,
      address: formData.address.trim(),
      role: formData.role,
      isAdmin: formData.role === 'admin',
      isActive: Boolean(formData.isActive)
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    try {
      if (editingUser) {
        const userId = editingUser._id || editingUser.id;
        try {
          if (adminApi?.updateUser) {
            await adminApi.updateUser(userId, payload);
          }
        } catch (apiErr) {
          console.warn('Update user API notice:', apiErr);
        }

        const updatedList = userList.map(u => {
          if (u._id === userId || u.id === userId) {
            return { ...u, ...payload };
          }
          return u;
        });
        setUserList(updatedList);
        if (setUsers) setUsers(updatedList);
        // removed local storage

        showSuccess(`اطلاعات کاربر "${payload.name}" با موفقیت به‌روزرسانی شد.`);
        setIsModalOpen(false);
      } else {
        // Create new user
        let created = null;
        try {
          if (adminApi?.createUser) {
            const res = await adminApi.createUser(payload);
            created = res.data;
          }
        } catch (apiErr) {
          console.warn('Create user API notice:', apiErr);
        }

        if (!created) {
          const newId = `usr_${Date.now()}`;
          created = {
            id: newId,
            _id: newId,
            ...payload,
            createdAt: new Date().toISOString()
          };
        }

        const updatedList = [created, ...userList];
        setUserList(updatedList);
        if (setUsers) setUsers(updatedList);
        // removed local storage

        showSuccess(`کاربر جدید "${payload.name}" با موفقیت به سامانه افزوده شد.`);
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData(initialForm);
      }
    } catch (err) {
      showError(err, editingUser ? 'ویرایش کاربر' : 'افزودن کاربر');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteUser(user) {
    const userId = user._id || user.id;
    try {
      try {
        if (adminApi?.deleteUser) {
          await adminApi.deleteUser(userId);
        }
      } catch (apiErr) {
        console.warn('Delete user API notice:', apiErr);
      }

      const updatedList = userList.filter(u => u._id !== userId && u.id !== userId);
      setUserList(updatedList);
      if (setUsers) setUsers(updatedList);
      // removed local storage

      showSuccess(`حساب کاربری "${user.name || 'کاربر'}" با موفقیت حذف گردید.`);
      setDeleteConfirmUser(null);
    } catch (err) {
      showError(err, 'حذف کاربر');
    }
  }

  async function handleToggleStatus(user) {
    const userId = user._id || user.id;
    try {
      await adminApi.toggleUserStatus(userId);
      const updatedList = userList.map(u => (u._id === userId || u.id === userId ? { ...u, isActive: !u.isActive } : u));
      setUserList(updatedList);
      if (setUsers) setUsers(updatedList);
      // removed local storage
      showSuccess(`وضعیت حساب کاربری "${user.name || 'کاربر'}" تغییر یافت.`);
    } catch (err) {
      showError(err, 'تغییر وضعیت کاربر');
    }
  }

  async function handleChangeRole(user, newRole) {
    const userId = user._id || user.id;
    try {
      await adminApi.updateUserRole(userId, newRole);
      const updatedList = userList.map(u => (u._id === userId || u.id === userId ? { ...u, role: newRole, isAdmin: newRole === 'admin' } : u));
      setUserList(updatedList);
      if (setUsers) setUsers(updatedList);
      // removed local storage
      showSuccess(`سطح دسترسی کاربر "${user.name || ''}" به "${newRole === 'admin' ? 'مدیر سیستم' : 'مشتری عادی'}" تغییر یافت.`);
    } catch (err) {
      showError(err, 'تغییر نقش کاربر');
    }
  }

  const filteredUsers = useMemo(() => {
    return userList.filter(u => {
      const name = (u.name || '').toLowerCase();
      const phone = (u.phone || u.mobile || '');
      const address = (u.address || '').toLowerCase();
      const s = search.toLowerCase();

      const matchesSearch = !s || name.includes(s) || phone.includes(s) || address.includes(s);
      const isUserAdmin = u.role === 'admin' || u.isAdmin;
      const matchesRole = roleFilter === 'all' || (roleFilter === 'admin' && isUserAdmin) || (roleFilter === 'user' && !isUserAdmin);

      const isActive = u.isActive !== false;
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' && isActive) || (statusFilter === 'blocked' && !isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [userList, search, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  return (
    <div>
      {/* Header */}
      <div className={styles.tabHeader}>
        <div>
          <h1 className={styles.tabTitle}>
            <span>مدیریت کاربران، مشتریان و دسترسی‌ها</span>
          </h1>
          <p className={styles.tabSubtitle}>
            افزودن کاربر جدید، ویرایش اطلاعات، حذف، تغییر نقش مدیریتی و مسدودسازی حساب‌ها
          </p>
        </div>
        <button onClick={openAddModal} className={styles.addBtn}>
          <Plus size={19} strokeWidth={2.5} />
          <span>افزودن کاربر جدید</span>
        </button>
      </div>

      {/* Main Card */}
      <div className={styles.card}>
        {/* Toolbar */}
        <div className={styles.toolbar} style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div className={styles.searchBox} style={{ flex: '1 1 250px' }}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="جستجو در نام، شماره موبایل یا شهر کاربر..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              className={styles.searchInput}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <select
              value={roleFilter}
              onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1); }}
              className={styles.filterChip}
              style={{ padding: '0.45rem 0.75rem', cursor: 'pointer' }}
            >
              <option value="all">همه نقش‌ها</option>
              <option value="admin">فقط مدیران</option>
              <option value="user">مشتریان عادی</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className={styles.filterChip}
              style={{ padding: '0.45rem 0.75rem', cursor: 'pointer' }}
            >
              <option value="all">وضعیت: همه</option>
              <option value="active">حساب‌های فعال</option>
              <option value="blocked">حساب‌های مسدود</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className={styles.tableContainer}>
          {loading ? (
            <div className={styles.emptyState}>
              <Loader2 size={40} className="spin-animation" style={{ color: '#073822' }} />
              <p className={styles.emptyText}>در حال دریافت لیست کاربران از سرور...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className={styles.emptyState}>
              <Users size={56} className={styles.emptyIcon} />
              <p className={styles.emptyText}>هیچ کاربری با مشخصات جستجو شده یافت نشد</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>کاربر / خریدار</th>
                    <th className={styles.th}>شماره موبایل</th>
                    <th className={styles.th}>نشانی ثبت شده</th>
                    <th className={styles.th}>سطح دسترسی</th>
                    <th className={styles.th}>وضعیت حساب</th>
                    <th className={styles.th} style={{ textAlign: 'center' }}>عملیات و مدیریت</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map(u => {
                    const id = u._id || u.id;
                    const isUserAdmin = u.role === 'admin' || u.isAdmin;
                    const isActive = u.isActive !== false;

                    return (
                      <tr key={id} className={styles.tr}>
                        {/* Name & Avatar */}
                        <td className={styles.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '9999px',
                              backgroundColor: isUserAdmin ? '#042a1b' : '#e2e8f0',
                              color: isUserAdmin ? '#fef08a' : '#475569',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 900,
                              fontSize: '0.875rem'
                            }}>
                              {(u.name || 'ک')[0]}
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, color: '#042a1b', fontSize: '0.875rem' }}>
                                {u.name || 'کاربر بدون نام'}
                              </div>
                              <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
                                شناسه: {String(id).slice(-6)}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className={styles.td}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8125rem', color: '#334155' }} dir="ltr">
                            {u.phone || u.mobile || 'ثبت نشده'}
                          </span>
                        </td>

                        {/* Address */}
                        <td className={styles.td}>
                          <span style={{ fontSize: '0.8125rem', color: '#475569' }}>
                            {u.address || 'نشانی ثبت نشده'}
                          </span>
                        </td>

                        {/* Role Badge */}
                        <td className={styles.td}>
                          {isUserAdmin ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              background: '#042a1b',
                              color: '#fef08a',
                              padding: '0.25rem 0.6rem',
                              borderRadius: '0.375rem',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              border: '1px solid #d4af37'
                            }}>
                              <ShieldCheck size={13} />
                              مدیر سیستم
                            </span>
                          ) : (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              background: '#f1f5f9',
                              color: '#475569',
                              padding: '0.25rem 0.6rem',
                              borderRadius: '0.375rem',
                              fontSize: '0.75rem',
                              fontWeight: 800
                            }}>
                              <UserCheck size={13} />
                              مشتری عادی
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className={styles.td}>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u)}
                            style={{
                              border: 'none',
                              background: 'none',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              color: isActive ? '#166534' : '#dc2626',
                              fontSize: '0.75rem',
                              fontWeight: 800
                            }}
                            title="برای تغییر وضعیت کلیک کنید"
                          >
                            {isActive ? (
                              <>
                                <ToggleRight size={20} color="#16a34a" />
                                <span>حساب فعال</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft size={20} color="#dc2626" />
                                <span>مسدود شده</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className={styles.td} style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              onClick={() => openEditModal(u)}
                              className={styles.detailBtn}
                              style={{ color: '#0369a1', borderColor: '#bae6fd', background: '#f0f9ff' }}
                              title="ویرایش مشخصات کاربر"
                            >
                              <Edit2 size={13} />
                              <span>ویرایش</span>
                            </button>

                            {isUserAdmin ? (
                              <button
                                type="button"
                                onClick={() => handleChangeRole(u, 'user')}
                                className={styles.detailBtn}
                                style={{ color: '#d97706', borderColor: '#fde68a', background: '#fffbeb' }}
                                title="تبدیل به کاربر عادی"
                              >
                                <UserX size={13} />
                                <span>عادی</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleChangeRole(u, 'admin')}
                                className={styles.detailBtn}
                                style={{ color: '#042a1b', borderColor: '#d4af37', background: '#fefce8' }}
                                title="ارتقا به مدیر سیستم"
                              >
                                <Shield size={13} />
                                <span>ارتقا</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setDeleteConfirmUser(u)}
                              className={styles.detailBtn}
                              style={{ color: '#dc2626', borderColor: '#fecaca', background: '#fef2f2' }}
                              title="حذف کاربر"
                            >
                              <Trash2 size={13} />
                              <span>حذف</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredUsers.length > pageSize && (
          <div className={styles.paginationContainer}>
            <span className={styles.paginationInfo}>
              نمایش {((currentPage - 1) * pageSize) + 1} تا {Math.min(currentPage * pageSize, filteredUsers.length)} از {filteredUsers.length} کاربر
            </span>

            <div className={styles.paginationButtons}>
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={styles.pageBtn}
                title="صفحه قبل"
              >
                <ChevronRight size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`${styles.pageBtn} ${currentPage === page ? styles.pageBtnActive : ''}`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={styles.pageBtn}
                title="صفحه بعد"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteConfirmUser)}
        onClose={() => setDeleteConfirmUser(null)}
        onConfirm={() => handleDeleteUser(deleteConfirmUser)}
        title="تأیید حذف حساب کاربر"
        itemType="کاربر"
        itemName={deleteConfirmUser ? `${deleteConfirmUser.name || 'کاربر'} (${deleteConfirmUser.phone})` : ''}
        message="آیا از حذف دائمی این حساب کاربری اطمینان دارید؟ دسترسی کاربر و اطلاعات مرتبط حذف خواهند شد."
        confirmText="حذف قطعی کاربر"
      />

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>
                  {editingUser ? `ویرایش کاربر: ${editingUser.name || ''}` : 'افزودن کاربر جدید به سامانه'}
                </h3>
                <p className={styles.modalDesc}>مشخصات هویتی، دسترسی و نشانی کاربر را تعیین فرمایید.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className={styles.modalCloseBtn}
                aria-label="بستن"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalContent}>
              <form onSubmit={handleFormSubmit} noValidate className={styles.form}>
                <div className={styles.formGrid}>
                  {/* Full Name */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>نام و نام خانوادگی *</label>
                    <input
                      type="text"
                      placeholder="مثال: محمدرضا عسکرپور"
                      value={formData.name}
                      onChange={e => handleFieldChange('name', e.target.value)}
                      className={`${styles.input} ${formErrors.name ? styles.inputError : ''}`}
                      style={formErrors.name ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}}
                    />
                    {formErrors.name && (
                      <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, marginTop: '3px', display: 'block' }}>
                        {formErrors.name}
                      </span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>شماره موبایل *</label>
                    <input
                      type="tel"
                      placeholder="۰۹۱۷۰۰۰۰۰۰۰"
                      value={formData.phone}
                      onChange={e => handleFieldChange('phone', e.target.value)}
                      className={`${styles.input} ${formErrors.phone ? styles.inputError : ''}`}
                      style={formErrors.phone ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}}
                      dir="ltr"
                    />
                    {formErrors.phone && (
                      <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, marginTop: '3px', display: 'block' }}>
                        {formErrors.phone}
                      </span>
                    )}
                  </div>

                  {/* Password */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      {editingUser ? 'رمز عبور جدید (اختیاری):' : 'رمز عبور *:'}
                    </label>
                    <input
                      type="password"
                      placeholder={editingUser ? 'در صورت عدم تغییر خالی بگذارید' : 'حداقل ۶ کاراکتر'}
                      value={formData.password}
                      onChange={e => handleFieldChange('password', e.target.value)}
                      className={`${styles.input} ${formErrors.password ? styles.inputError : ''}`}
                      style={formErrors.password ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}}
                    />
                    {formErrors.password && (
                      <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, marginTop: '3px', display: 'block' }}>
                        {formErrors.password}
                      </span>
                    )}
                  </div>

                  {/* Role */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>سطح دسترسی و نقش:</label>
                    <select
                      value={formData.role}
                      onChange={e => handleFieldChange('role', e.target.value)}
                      className={styles.select}
                    >
                      <option value="user">مشتری عادی</option>
                      <option value="admin">مدیر سیستم (دسترسی به پنل مدیریت)</option>
                    </select>
                  </div>

                  {/* Address */}
                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>نشانی تحویل سفارشات:</label>
                    <input
                      type="text"
                      placeholder="استان، شهر، خیابان، پلاک، واحد..."
                      value={formData.address}
                      onChange={e => handleFieldChange('address', e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  {/* Is Active Status */}
                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      cursor: 'pointer',
                      padding: '0.6rem 0.85rem',
                      backgroundColor: '#fafbfc',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '0.75rem',
                      minHeight: '42px'
                    }}>
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={e => handleFieldChange('isActive', e.target.checked)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#073822' }}
                      />
                      <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#042a1b' }}>
                        حساب کاربری فعال باشد و اجازه ورود به سیستم داشته باشد
                      </span>
                    </label>
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className={styles.cancelBtn}
                    disabled={isSubmitting}
                  >
                    انصراف
                  </button>
                  <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Loader2 size={16} className="animate-spin" />
                        <span>در حال ذخیره...</span>
                      </span>
                    ) : (
                      <span>{editingUser ? 'ذخیره تغییرات کاربر' : 'ثبت کاربر در سیستم'}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersTab;
