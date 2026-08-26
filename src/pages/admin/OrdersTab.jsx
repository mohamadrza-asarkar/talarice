import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
  ShoppingBag, Search, Eye, CheckCircle2, Clock, 
  Truck, AlertCircle, Phone, MapPin, Calendar, 
  CreditCard, ChevronDown, Printer, Trash2, RefreshCw,
  TrendingUp, PackageCheck, User
} from 'lucide-react';

export const OrdersTab = ({ onUpdate, showToast }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get('/orders').catch(() => null);
      if (res) {
        const rawOrders = Array.isArray(res) 
          ? res 
          : (Array.isArray(res?.data) 
              ? res.data 
              : (Array.isArray(res?.orders) 
                  ? res.orders 
                  : (Array.isArray(res?.data?.orders) ? res.data.orders : [])));

        if (rawOrders.length > 0) {
          setOrders(rawOrders);
        } else {
          try {
            const saved = localStorage.getItem('tala_orders');
            if (saved) setOrders(JSON.parse(saved));
          } catch {}
        }
      } else {
        try {
          const saved = localStorage.getItem('tala_orders');
          if (saved) setOrders(JSON.parse(saved));
        } catch {}
      }
    } catch (err) {
      console.warn('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    // Optimistically update local state immediately
    setOrders(prev => prev.map(o => (o._id === orderId || o.id === orderId) ? { ...o, status: newStatus } : o));
    if (selectedOrder && (selectedOrder._id === orderId || selectedOrder.id === orderId)) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
    if (showToast) showToast('وضعیت سفارش بروزرسانی شد');

    try {
      await API.put(`/admin/orders/${orderId}/status`, { status: newStatus })
        .catch(() => API.put(`/orders/${orderId}`, { status: newStatus }))
        .catch(e => console.warn('Backend update order status warning:', e));
      if (onUpdate) onUpdate();
    } catch (e) {
      console.warn(e);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('آیا از حذف این سفارش اطمینان دارید؟')) return;
    setOrders(prev => prev.filter(o => o._id !== orderId && o.id !== orderId));
    if (showToast) showToast('سفارش حذف شد');
    setSelectedOrder(null);

    try {
      await API.delete(`/orders/${orderId}`).catch(e => console.warn(e));
      if (onUpdate) onUpdate();
    } catch (e) {
      console.warn(e);
    }
  };

  // Filter Logic
  const filteredOrders = orders.filter(o => {
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || (
      (o.buyerName && o.buyerName.toLowerCase().includes(q)) ||
      (o.phone && o.phone.toLowerCase().includes(q)) ||
      (o.trackingCode && o.trackingCode.toLowerCase().includes(q)) ||
      (o.address && o.address.toLowerCase().includes(q)) ||
      (o._id && o._id.toLowerCase().includes(q))
    );

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'processing':
        return { label: 'در حال پردازش', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock };
      case 'shipped':
        return { label: 'ارسال شده', bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Truck };
      case 'delivered':
        return { label: 'تحویل داده شده', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 };
      case 'cancelled':
        return { label: 'لغو شده', bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: AlertCircle };
      default:
        return { label: 'نامشخص', bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: Clock };
    }
  };

  // KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'processing').length;
  const completedOrders = orders.filter(o => o.status === 'delivered' || o.status === 'shipped').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-none">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">مدیریت سفارش‌ها و ارسال</h1>
            <span className="bg-[#042a1b] text-[#d4af37] text-xs font-black px-2.5 py-1 rounded-xl">
              {orders.length} سفارش
            </span>
          </div>
          <p className="text-slate-500 font-medium text-xs mt-1">مشاهده فاکتورها، تغییر وضعیت ارسال، اطلاعات تماس و آدرس گیرنده</p>
        </div>

        <button 
          onClick={fetchOrders}
          className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors self-end sm:self-auto"
          title="بروزرسانی لیست"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-none flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">سفارش‌های در انتظار</div>
            <div className="text-xl font-black text-slate-800 mt-0.5">{pendingOrders} <span className="text-xs font-normal text-amber-600">نیاز به ارسال</span></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-none flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <PackageCheck size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">ارسال / تحویل شده</div>
            <div className="text-xl font-black text-slate-800 mt-0.5">{completedOrders} <span className="text-xs font-normal text-slate-400">سفارش</span></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-none flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">مجموع فروش ثبت شده</div>
            <div className="text-xl font-black text-slate-800 mt-0.5">{totalRevenue.toLocaleString()} <span className="text-xs font-normal text-slate-400">تومان</span></div>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-none overflow-hidden">
        {/* Filter bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="جستجو بر اساس نام خریدار، شماره تماس، کد رهگیری..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pr-11 pl-9 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium placeholder:text-slate-400 focus:border-[#d4af37] outline-none transition-colors"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'همه' },
              { id: 'processing', label: 'در انتظار' },
              { id: 'shipped', label: 'ارسال شده' },
              { id: 'delivered', label: 'تحویل داده شده' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors
                  ${statusFilter === tab.id 
                    ? 'bg-[#042a1b] text-[#d4af37]' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table / List */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-[#042a1b] rounded-full animate-spin mb-4"></div>
              <p className="font-bold text-sm">درحال بارگذاری سفارشات...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mb-4">
                <ShoppingBag size={40} strokeWidth={1.5} />
              </div>
              <h3 className="font-black text-lg text-slate-700">هیچ سفارشی یافت نشد</h3>
              <p className="text-xs text-slate-400 font-medium max-w-sm mt-1">
                هنوز سفارشی از طرف خریداران ثبت نشده است. پس از خرید در سایت، در اینجا به همراه مشخصات کامل فاکتور نمایش داده می‌شود.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="text-slate-400 font-bold border-b border-slate-100 pb-3">
                    <th className="pb-4 font-bold">کد و مشخصات سفارش</th>
                    <th className="pb-4 font-bold">خریدار و تماس</th>
                    <th className="pb-4 font-bold">مبلغ فاکتور</th>
                    <th className="pb-4 font-bold">تاریخ ثبت</th>
                    <th className="pb-4 font-bold">وضعیت سفارش</th>
                    <th className="pb-4 font-bold text-center">جزئیات و فاکتور</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredOrders.map(order => {
                    const statusInfo = getStatusBadge(order.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <tr key={order._id || order.id} className="group hover:bg-slate-50/70 transition-colors">
                        <td className="py-4">
                          <div>
                            <span className="font-black text-slate-800 text-sm">
                              {order.trackingCode || (order._id ? `#${order._id.slice(-6)}` : '#ORD')}
                            </span>
                            <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                              {order.products?.length || 1} قلم کالا
                            </div>
                          </div>
                        </td>

                        <td className="py-4">
                          <div>
                            <div className="font-black text-slate-800 text-sm">{order.buyerName || 'خریدار'}</div>
                            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5" dir="ltr">
                              <span>{order.phone || '-'}</span>
                              <Phone size={11} className="text-slate-400" />
                            </div>
                          </div>
                        </td>

                        <td className="py-4">
                          <div className="font-black text-slate-800 text-sm">
                            {order.totalPrice?.toLocaleString()} <span className="text-[10px] text-slate-400 font-bold">تومان</span>
                          </div>
                        </td>

                        <td className="py-4">
                          <span className="text-slate-500 font-bold">
                            {order.createdAt || 'امروز'}
                          </span>
                        </td>

                        <td className="py-4">
                          <select
                            value={order.status || 'processing'}
                            onChange={(e) => handleStatusChange(order._id || order.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black border outline-none cursor-pointer ${statusInfo.bg}`}
                          >
                            <option value="processing">در حال پردازش</option>
                            <option value="shipped">ارسال شده</option>
                            <option value="delivered">تحویل داده شده</option>
                            <option value="cancelled">لغو شده</option>
                          </select>
                        </td>

                        <td className="py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="px-3.5 py-2 bg-slate-100 hover:bg-[#042a1b] hover:text-[#d4af37] text-slate-700 rounded-xl font-bold transition-all flex items-center gap-1.5"
                            >
                              <Eye size={14} />
                              <span>مشاهده فاکتور</span>
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order._id || order.id)}
                              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                              title="حذف سفارش"
                            >
                              <Trash2 size={14} />
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
      </div>

      {/* Order Details & Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl border border-slate-200 overflow-hidden shadow-2xl p-6 md:p-8 my-8">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-xl text-slate-800">فاکتور سفارش</h3>
                  <span className="bg-[#042a1b] text-[#d4af37] px-2.5 py-1 rounded-xl text-xs font-black">
                    {selectedOrder.trackingCode || `#${selectedOrder._id?.slice(-6)}`}
                  </span>
                </div>
                <p className="text-slate-400 text-xs font-medium mt-1">
                  ثبت شده در: {selectedOrder.createdAt || 'امروز'}
                </p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Buyer & Delivery Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <div className="text-[11px] font-bold text-slate-400 mb-1">اطلاعات خریدار:</div>
                <div className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                  <User size={14} className="text-slate-400" />
                  <span>{selectedOrder.buyerName || 'خریدار'}</span>
                </div>
                <div className="font-bold text-slate-600 text-xs mt-1 flex items-center gap-1.5" dir="ltr">
                  <Phone size={13} className="text-slate-400" />
                  <span>{selectedOrder.phone || 'ثبت نشده'}</span>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 mb-1">آدرس ارسال مرسوله:</div>
                <div className="font-bold text-slate-700 text-xs flex items-start gap-1.5 leading-relaxed">
                  <MapPin size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>{selectedOrder.address || 'آدرس تحویل وارد نشده است'}</span>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3 mb-6">
              <div className="text-xs font-bold text-slate-700">اقلام خریداری شده:</div>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                {selectedOrder.products && selectedOrder.products.length > 0 ? (
                  selectedOrder.products.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between bg-white hover:bg-slate-50/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                          <img 
                            src={item.product?.image || item.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80'} 
                            alt={item.name || item.product?.name}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <div className="font-black text-slate-800 text-xs">
                            {item.name || item.product?.name || 'برنج اعلا'}
                          </div>
                          <div className="text-[10px] text-slate-400 font-semibold">
                            {item.weightKg || item.product?.weight || 10} کیلوگرم × {item.quantity || 1} کیسه
                          </div>
                        </div>
                      </div>
                      <div className="font-black text-slate-800 text-xs">
                        {((item.price || item.product?.price || 0) * (item.quantity || 1)).toLocaleString()} تومان
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-400 text-xs">محصولی در لیست موجود نیست</div>
                )}
              </div>
            </div>

            {/* Total Summary */}
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center justify-between mb-6">
              <span className="font-bold text-emerald-900 text-sm">مبلغ کل قابل پرداخت:</span>
              <span className="font-black text-emerald-900 text-base">
                {selectedOrder.totalPrice?.toLocaleString()} تومان
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button 
                onClick={() => window.print()}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors"
              >
                <Printer size={15} />
                <span>چاپ فاکتور</span>
              </button>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="flex-1 bg-[#042a1b] hover:bg-[#042a1b]/90 text-[#d4af37] p-3 rounded-xl font-black text-xs transition-colors"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
