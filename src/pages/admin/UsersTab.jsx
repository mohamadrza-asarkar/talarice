import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const UsersTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">مشتریان فروشگاه</h1>
          <p className="text-slate-500 font-medium mt-1">مدیریت اطلاعات و سطح دسترسی کاربران</p>
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-xl p-16 rounded-[2rem] shadow-sm border border-slate-200/60 flex flex-col items-center justify-center text-slate-500 text-center">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mb-6 border border-emerald-100 shadow-inner">
          <ShieldCheck size={48} strokeWidth={2} />
        </div>
        <h2 className="text-xl font-black text-slate-800 mb-2">حریم خصوصی فعال است</h2>
        <p className="font-medium max-w-md">در راستای سادگی و حفظ امنیت اطلاعات، جزئیات لیست مشتریان در این نمای ساده پنهان شده است.</p>
      </div>
    </div>
  );
};
