import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context';

export function ProfilePage() {
  const { currentUser, logout, isAdmin, orders } = useApp();

  return (
    <div className="p-4 flex flex-col gap-4 text-white">
      <div className="bg-[#073b27] border border-[#d4af37]/30 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#d4af37] text-[#042a1b] font-black text-lg flex items-center justify-center">
            {currentUser?.name ? currentUser.name[0] : 'U'}
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">{currentUser?.name || 'کاربر گرامی'}</h2>
            <p className="text-xs text-gray-300">{currentUser?.phone || currentUser?.email || '---'}</p>
          </div>
        </div>

        <button onClick={logout} className="text-xs text-red-400 hover:text-red-300">
          خروج
        </button>
      </div>

      {isAdmin && (
        <Link
          to="/admin"
          className="bg-gradient-to-r from-amber-600 to-amber-800 text-white p-3 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-crown" />
          <span>ورود به پنل مدیریت فروشگاه</span>
        </Link>
      )}

      <div className="flex flex-col gap-2 mt-2">
        <h3 className="text-xs font-bold text-[#d4af37]">سفارش‌های من</h3>
        {orders.length === 0 ? (
          <div className="bg-[#073b27] border border-white/10 rounded-xl p-6 text-center text-gray-400 text-xs">
            هنوز سفارشی ثبت نکرده‌اید.
          </div>
        ) : (
          orders.map((ord) => (
            <div key={ord._id || ord.id} className="bg-[#073b27] border border-white/10 rounded-xl p-3 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold block">کد سفارش: {ord._id || ord.id}</span>
                <span className="text-gray-400 text-[11px]">وضعیت: {ord.status || 'در حال بررسی'}</span>
              </div>
              <span className="font-black text-[#d4af37]">{Number(ord.totalAmount || 0).toLocaleString('fa-IR')} تومان</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
