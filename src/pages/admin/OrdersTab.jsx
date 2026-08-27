import React from 'react';
import { useApp } from '../../context';
import { Package, Truck, CheckCircle2 } from 'lucide-react';

export const OrdersTab = () => {
  const { orders, setOrders } = useApp();

  const updateStatus = (id, status) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">سفارشات فروشگاه</h1>
          <p className="text-slate-500 font-medium mt-1">مشاهده و بررسی وضعیت مرسولات مشتریان</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Package size={64} className="mb-4 opacity-20" />
            <p className="font-bold text-lg">سفارشی یافت نشد</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="text-slate-400 text-sm border-b border-slate-100">
                    <th className="pb-4 font-bold pl-4">کد رهگیری سیستم</th>
                    <th className="pb-4 font-bold">اطلاعات مشتری</th>
                    <th className="pb-4 font-bold">مبلغ نهایی (تومان)</th>
                    <th className="pb-4 font-bold">وضعیت فعلی</th>
                    <th className="pb-4 font-bold text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.map(o => (
                    <tr key={o.id || o._id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-5 pl-4">
                        <span className="font-mono text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                          {String(o.id || o._id).slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="py-5">
                        <div className="font-black text-slate-800">{o.user?.name || o.addresses?.[0]?.recipientName || 'مشتری ناشناس'}</div>
                        <div className="text-xs font-bold text-slate-500 mt-0.5">{o.user?.phone || o.addresses?.[0]?.phone || '---'}</div>
                      </td>
                      <td className="py-5 font-black text-slate-700">
                        {(o.finalAmount || o.totalPrice)?.toLocaleString()}
                      </td>
                      <td className="py-5">
                        {o.status === 'processing' && (
                          <div className="flex items-center gap-2 bg-amber-50 text-amber-700 w-fit px-3 py-1.5 rounded-xl text-sm font-bold border border-amber-100">
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                            در حال پردازش
                          </div>
                        )}
                        {o.status === 'shipped' && (
                          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 w-fit px-3 py-1.5 rounded-xl text-sm font-bold border border-blue-100">
                            <Truck size={14} />
                            ارسال شده
                          </div>
                        )}
                        {o.status === 'delivered' && (
                          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 w-fit px-3 py-1.5 rounded-xl text-sm font-bold border border-emerald-100">
                            <CheckCircle2 size={14} />
                            تحویل شده
                          </div>
                        )}
                      </td>
                      <td className="py-5 text-center">
                        {o.status === 'processing' ? (
                           <button onClick={() => updateStatus(o.id || o._id, 'shipped')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs flex items-center justify-center gap-2 font-bold mx-auto shadow-md shadow-slate-800/20 transition-all hover:-translate-y-0.5">
                             <Truck size={14} /> تغییر به ارسال شده
                           </button>
                        ) : (
                           <span className="text-slate-300 text-xs font-bold px-4 py-2">اقدامی نیاز نیست</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
