import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
  Users, Search, UserPlus, Shield, ShieldCheck, 
  Trash2, Phone, Mail, Calendar, RefreshCw, UserCheck 
} from 'lucide-react';

export const UsersTab = ({ onUpdate, showToast }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: 'password123',
    role: 'user'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/users');
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const res = await API.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.success) {
        if (showToast) showToast('نقش کاربری تغییر یافت');
        fetchUsers();
        if (onUpdate) onUpdate();
      }
    } catch (e) {
      alert('خطا در تغییر سطح دسترسی');
    }
  };

  const handleDelete = async (userId, name) => {
    if (userId === 'user-admin') {
      alert('امکان حذف مدیر اصلی سیستم وجود ندارد.');
      return;
    }
    if (!window.confirm(`آیا از حذف کاربر «${name || 'انتخاب شده'}» اطمینان دارید؟`)) return;
    try {
      const res = await API.delete(`/admin/users/${userId}`);
      if (res.success) {
        if (showToast) showToast('کاربر با موفقیت حذف شد');
        fetchUsers();
        if (onUpdate) onUpdate();
      }
    } catch (e) {
      alert('خطا در حذف کاربر');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/admin/users', formData);
      if (res.success) {
        if (showToast) showToast('کاربر جدید با موفقیت اضافه شد');
        fetchUsers();
        if (onUpdate) onUpdate();
        setIsModalOpen(false);
        setFormData({ name: '', phone: '', email: '', password: 'password123', role: 'user' });
      }
    } catch (e) {
      alert('خطا در ایجاد کاربر');
    }
  };

  // Filter
  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase().trim();
    return !q || (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.phone && u.phone.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  });

  const adminCount = users.filter(u => u.role === 'admin').length;
  const normalUserCount = users.length - adminCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-none">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">مدیریت مشتریان و دسترسی‌ها</h1>
            <span className="bg-[#042a1b] text-[#d4af37] text-xs font-black px-2.5 py-1 rounded-xl">
              {users.length} کاربر
            </span>
          </div>
          <p className="text-slate-500 font-medium text-xs mt-1">مشاهده حساب‌ها، شماره‌های تماس و تفکیک دسترسی مدیر و مشتری</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={fetchUsers}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors"
            title="بروزرسانی"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex-1 sm:flex-none bg-[#042a1b] hover:bg-[#042a1b]/90 text-[#d4af37] px-6 py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <UserPlus size={19} strokeWidth={3} />
            <span>افزودن کاربر جدید</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-none flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Users size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">کل اعضا</div>
            <div className="text-xl font-black text-slate-800 mt-0.5">{users.length} <span className="text-xs font-normal text-slate-400">نفر</span></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-none flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#042a1b] flex items-center justify-center font-bold">
            <ShieldCheck size={24} className="text-[#d4af37]" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">مدیران پنل</div>
            <div className="text-xl font-black text-slate-800 mt-0.5">{adminCount} <span className="text-xs font-normal text-amber-600 font-bold">ادمین</span></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-none flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <UserCheck size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">مشتریان عادی</div>
            <div className="text-xl font-black text-slate-800 mt-0.5">{normalUserCount} <span className="text-xs font-normal text-slate-400">کاربر</span></div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-none overflow-hidden">
        {/* Search */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="جستجو در نام، شماره موبایل، ایمیل..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pr-11 pl-9 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium placeholder:text-slate-400 focus:border-[#d4af37] outline-none transition-colors"
            />
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-[#042a1b] rounded-full animate-spin mb-4"></div>
              <p className="font-bold text-sm">درحال بارگذاری کاربران...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="font-bold text-sm">هیچ کاربری یافت نشد</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="text-slate-400 font-bold border-b border-slate-100 pb-3">
                    <th className="pb-4 font-bold">مشخصات کاربر</th>
                    <th className="pb-4 font-bold">شماره موبایل</th>
                    <th className="pb-4 font-bold">ایمیل</th>
                    <th className="pb-4 font-bold">سطح دسترسی</th>
                    <th className="pb-4 font-bold text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map(u => {
                    const isAdmin = u.role === 'admin';
                    return (
                      <tr key={u._id || u.id} className="group hover:bg-slate-50/70 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs
                              ${isAdmin ? 'bg-[#042a1b] text-[#d4af37]' : 'bg-slate-100 text-slate-700'}
                            `}>
                              {u.name ? u.name[0] : 'ک'}
                            </div>
                            <div>
                              <div className="font-black text-slate-800 text-sm">{u.name || 'کاربر'}</div>
                              <div className="text-[10px] text-slate-400">{u.createdAt ? `عضویت: ${u.createdAt}` : ''}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 font-bold text-slate-700" dir="ltr">
                          {u.phone || '-'}
                        </td>

                        <td className="py-4 text-slate-500 font-medium" dir="ltr">
                          {u.email || '-'}
                        </td>

                        <td className="py-4">
                          <button
                            onClick={() => handleRoleToggle(u._id || u.id, u.role)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5
                              ${isAdmin 
                                ? 'bg-[#042a1b] text-[#d4af37] border border-[#d4af37]/30' 
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                            `}
                            title="کلیک برای تغییر دسترسی"
                          >
                            {isAdmin ? <ShieldCheck size={14} /> : <Shield size={14} />}
                            <span>{isAdmin ? 'مدیر (Admin)' : 'کاربر عادی'}</span>
                          </button>
                        </td>

                        <td className="py-4 text-center">
                          {u._id !== 'user-admin' ? (
                            <button
                              onClick={() => handleDelete(u._id || u.id, u.name)}
                              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                              title="حذف کاربر"
                            >
                              <Trash2 size={15} />
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-bold">مدیر اصلی</span>
                          )}
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

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg border border-slate-200 overflow-hidden shadow-2xl p-6 md:p-8 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="font-black text-xl text-slate-800">افزودن کاربر جدید</h3>
                <p className="text-slate-400 text-xs font-medium mt-1">مشخصات حساب کاربری را وارد نمایید</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">نام و نام خانوادگی</label>
                <input 
                  required 
                  type="text" 
                  placeholder="مثال: رضا محمدی" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full p-3.5 bg-white border border-slate-300 rounded-2xl text-xs font-medium placeholder:text-slate-400 focus:border-[#d4af37] outline-none transition-colors" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">شماره موبایل (جهت ورود)</label>
                <input 
                  required 
                  type="text" 
                  placeholder="مثال: 09123456789" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                  dir="ltr"
                  className="w-full p-3.5 bg-white border border-slate-300 rounded-2xl text-xs font-medium placeholder:text-slate-400 focus:border-[#d4af37] outline-none transition-colors" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">آدرس ایمیل (اختیاری)</label>
                <input 
                  type="email" 
                  placeholder="مثال: user@example.com" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  dir="ltr"
                  className="w-full p-3.5 bg-white border border-slate-300 rounded-2xl text-xs font-medium placeholder:text-slate-400 focus:border-[#d4af37] outline-none transition-colors" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">رمز عبور</label>
                <input 
                  required 
                  type="password" 
                  placeholder="حداقل ۶ کاراکتر" 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  className="w-full p-3.5 bg-white border border-slate-300 rounded-2xl text-xs font-medium placeholder:text-slate-400 focus:border-[#d4af37] outline-none transition-colors" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">سطح دسترسی</label>
                <select 
                  value={formData.role} 
                  onChange={e => setFormData({...formData, role: e.target.value})} 
                  className="w-full p-3.5 bg-white border border-slate-300 rounded-2xl text-xs font-bold focus:border-[#d4af37] outline-none transition-colors"
                >
                  <option value="user">کاربر عادی / مشتری</option>
                  <option value="admin">مدیر سیستم (دسترسی کامل به پنل)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition-colors"
                >
                  انصراف
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-[#042a1b] hover:bg-[#042a1b]/90 text-[#d4af37] p-3.5 rounded-2xl font-black text-xs transition-colors"
                >
                  ایجاد حساب کاربر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
