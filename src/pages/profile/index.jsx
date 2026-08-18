import React, { useState } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const ProfilePage = () => {
  const { orders, addresses } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('orders');

  const [wholesaleForm, setWholesaleForm] = useState({
    businessName: '',
    contactName: '',
    phone: '',
    estimatedKg: '100',
    description: ''
  });
  const [wholesaleSuccess, setWholesaleSuccess] = useState(false);

  const [supportText, setSupportText] = useState('');
  const [supportSuccess, setSupportSuccess] = useState(false);

  const handleWholesaleSubmit = (e) => {
    e.preventDefault();
    setWholesaleSuccess(true);
    setTimeout(() => {
      setWholesaleSuccess(false);
      setWholesaleForm({
        businessName: '',
        contactName: '',
        phone: '',
        estimatedKg: '100',
        description: ''
      });
    }, 4000);
  };

  return (
    <div className={`px-4 py-3 pb-24 space-y-4 animate-fade-in ${styles.profileWrapper}`}>
      <div className="bg-gradient-to-br from-[#073b27] via-[#0b4f35] to-[#136f46] text-white p-4 rounded-2xl shadow-md border-2 border-[#d4af37] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-[#d4af37] text-[#073b27] rounded-full flex items-center justify-center font-black text-2xl shadow-md border-2 border-white">
            M
          </div>
          <div>
            <h2 className="text-base font-black text-[#fef08a]">محمد رضایی</h2>
            <p className="text-xs text-[#d1fae5] dir-ltr text-right font-bold">
              ۰۹۱۷ ۱۲۳ ۴۵۶۷
            </p>
            <span className="text-[10px] bg-[#d4af37] text-[#073b27] font-black px-2 py-0.5 rounded-full mt-1 inline-block border border-white">
              مشتری طلایی
            </span>
          </div>
        </div>

        <div className="bg-[#0b4f35]/90 backdrop-blur-md p-2.5 rounded-xl text-center border border-[#d4af37]">
          <span className="text-[10px] text-[#d1fae5] block font-bold">
            امتیاز طلا:
          </span>
          <span className="text-sm font-black text-[#fef08a]">۲۵۰ امتیاز</span>
        </div>
      </div>

      <div className="flex bg-[#f0fdf4] p-1 rounded-xl border-2 border-[#d4af37]/40 text-xs font-black">
        <button
          onClick={() => setActiveSubTab('orders')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            activeSubTab === 'orders'
              ? 'bg-[#073b27] text-[#fef08a] shadow-sm'
              : 'text-[#073b27]'
          }`}
        >
          سفارش‌ها
        </button>
        <button
          onClick={() => setActiveSubTab('addresses')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            activeSubTab === 'addresses'
              ? 'bg-[#073b27] text-[#fef08a] shadow-sm'
              : 'text-[#073b27]'
          }`}
        >
          آدرس‌ها
        </button>
        <button
          onClick={() => setActiveSubTab('wholesale')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            activeSubTab === 'wholesale'
              ? 'bg-[#073b27] text-[#fef08a] shadow-sm'
              : 'text-[#073b27]'
          }`}
        >
          سفارش عمده
        </button>
        <button
          onClick={() => setActiveSubTab('support')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            activeSubTab === 'support'
              ? 'bg-[#073b27] text-[#fef08a] shadow-sm'
              : 'text-[#073b27]'
          }`}
        >
          پشتیبانی
        </button>
      </div>

      {activeSubTab === 'orders' && (
        <div className="space-y-3">
          <h3 className="text-xs font-black text-[#073b27]">
            تاریخچه سفارش‌های شما:
          </h3>
          {orders.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl text-center text-[#073b27] border-2 border-[#d4af37]/30">
              <i className="fa-solid fa-file-invoice text-4xl text-[#d4af37] mb-2" />
              <p className="text-xs font-bold">هنوز هیچ سفارشی ثبت نکرده‌اید.</p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white p-3.5 rounded-2xl border-2 border-[#d4af37]/40 shadow-sm space-y-2 text-xs"
              >
                <div className="flex justify-between items-center border-b border-[#d4af37]/20 pb-2">
                  <span className="font-mono font-black text-[#073b27]">
                    {ord.id}
                  </span>
                  <span className="bg-[#f0fdf4] text-[#073b27] font-black px-2 py-0.5 rounded-full text-[10px] border border-[#d4af37]">
                    در حال پردازش و بسته‌بندی
                  </span>
                </div>

                <div className="flex justify-between text-[#1e3a29] font-medium">
                  <span>تاریخ ثبت: {ord.date}</span>
                  <span>
                    کد پیگیری:{' '}
                    <strong className="font-mono text-[#073b27]">
                      {ord.trackingCode}
                    </strong>
                  </span>
                </div>

                <div className="text-[#073b27] font-black">
                  تعداد اقلام: {ord.items.length} کیسه برنج
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#d4af37]/20 font-black">
                  <span>مبلغ کل:</span>
                  <span className="text-sm font-black text-[#073b27]">
                    {ord.finalAmount.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeSubTab === 'addresses' && (
        <div className="space-y-3">
          <h3 className="text-xs font-black text-[#073b27]">آدرس‌های ثبت شده:</h3>
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white p-3.5 rounded-2xl border-2 border-[#d4af37]/40 shadow-sm space-y-1.5 text-xs"
            >
              <div className="flex justify-between items-center">
                <span className="font-black text-[#073b27]">{addr.title}</span>
                {addr.isDefault && (
                  <span className="bg-[#fef08a] text-[#073b27] text-[10px] font-black px-2 py-0.5 rounded-full border border-[#d4af37]">
                    پیش‌فرض
                  </span>
                )}
              </div>
              <p className="text-[#1e3a29] leading-relaxed font-medium">
                {addr.fullAddress}
              </p>
              <div className="text-[11px] text-[#b45309] font-black">
                گیرنده: {addr.recipientName} ({addr.phone})
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'wholesale' && (
        <div className="bg-white p-4 rounded-2xl border-2 border-[#d4af37]/40 shadow-sm space-y-3">
          <div>
            <h3 className="text-sm font-black text-[#073b27] mb-1">
              درخواست خرید عمده (رستوران، تالار، ارگان)
            </h3>
            <p className="text-xs text-[#1e3a29] font-medium">
              برای سفارش‌های بالای ۱۰۰ کیلوگرم، قیمت ویژه شالیزار و فاکتور رسمی صادر می‌شود.
            </p>
          </div>

          {wholesaleSuccess ? (
            <div className="bg-[#f0fdf4] text-[#073b27] border border-[#d4af37] p-3 rounded-xl text-xs font-black text-center">
              درخواست شما با موفقیت ثبت شد. کارشناسان طلا رایس به زودی با شما تماس خواهند گرفت.
            </div>
          ) : (
            <form onSubmit={handleWholesaleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#073b27] font-black mb-1">
                  نام کسب‌وکار / ارگان:
                </label>
                <input
                  type="text"
                  required
                  value={wholesaleForm.businessName}
                  onChange={(e) =>
                    setWholesaleForm({
                      ...wholesaleForm,
                      businessName: e.target.value
                    })
                  }
                  placeholder="مثلاً: رستوران سنتی شیراز"
                  className="w-full bg-[#f0fdf4] border border-[#d4af37]/40 rounded-xl px-3 py-2 text-[#073b27] font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#073b27] font-black mb-1">
                    نام رابط:
                  </label>
                  <input
                    type="text"
                    required
                    value={wholesaleForm.contactName}
                    onChange={(e) =>
                      setWholesaleForm({
                        ...wholesaleForm,
                        contactName: e.target.value
                      })
                    }
                    className="w-full bg-[#f0fdf4] border border-[#d4af37]/40 rounded-xl px-3 py-2 text-[#073b27] font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#073b27] font-black mb-1">
                    شماره تماس:
                  </label>
                  <input
                    type="text"
                    required
                    value={wholesaleForm.phone}
                    onChange={(e) =>
                      setWholesaleForm({
                        ...wholesaleForm,
                        phone: e.target.value
                      })
                    }
                    className="w-full bg-[#f0fdf4] border border-[#d4af37]/40 rounded-xl px-3 py-2 text-[#073b27] font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#073b27] font-black mb-1">
                  حجم تخمینی (کیلوگرم):
                </label>
                <select
                  value={wholesaleForm.estimatedKg}
                  onChange={(e) =>
                    setWholesaleForm({
                      ...wholesaleForm,
                      estimatedKg: e.target.value
                    })
                  }
                  className="w-full bg-[#f0fdf4] border border-[#d4af37]/40 rounded-xl px-3 py-2 text-[#073b27] font-bold"
                >
                  <option value="100">۱۰۰ کیلوگرم (۱۰ کیسه)</option>
                  <option value="500">۵۰۰ کیلوگرم (۵۰ کیسه)</option>
                  <option value="1000">۱ تن به بالا (سفارش عمده)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#073b27] font-black mb-1">
                  توضیحات اضافی:
                </label>
                <textarea
                  rows={2}
                  value={wholesaleForm.description}
                  onChange={(e) =>
                    setWholesaleForm({
                      ...wholesaleForm,
                      description: e.target.value
                    })
                  }
                  placeholder="نوع برنج درخواستی، تاریخ تحویل و..."
                  className="w-full bg-[#f0fdf4] border border-[#d4af37]/40 rounded-xl p-2.5 text-[#073b27] font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#073b27] to-[#136f46] text-[#fef08a] font-black text-xs py-3 rounded-xl border border-[#d4af37]"
              >
                ثبت استعلام قیمت عمده
              </button>
            </form>
          )}
        </div>
      )}

      {activeSubTab === 'support' && (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-2xl border-2 border-[#d4af37]/40 shadow-sm space-y-3">
            <h3 className="text-xs font-black text-[#073b27]">
              ارتباط مستقیم با واحد فروش و امور مشتریان:
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:09170000000"
                className="flex items-center justify-center gap-2 bg-[#f0fdf4] hover:bg-[#d4af37]/20 text-[#073b27] font-black text-xs p-3 rounded-xl border border-[#d4af37]/40"
              >
                <i className="fa-solid fa-phone text-[#d4af37]" />
                <span>تماس تلفنی</span>
              </a>
              <a
                href="https://wa.me/#"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-[#f0fdf4] hover:bg-[#d4af37]/20 text-[#073b27] font-black text-xs p-3 rounded-xl border border-[#d4af37]/40"
              >
                <i className="fa-brands fa-whatsapp text-[#25d366] text-sm" />
                <span>واتساپ پشتیبانی</span>
              </a>
            </div>

            <div className="pt-2 border-t border-[#d4af37]/20">
              <label className="block text-xs font-black text-[#073b27] mb-1">
                ارسال پیام یا سوال به پشتیبانی:
              </label>
              <textarea
                rows={2}
                value={supportText}
                onChange={(e) => setSupportText(e.target.value)}
                placeholder="سوال خود درباره پخت، ارسال یا کیفیت برنج را بنویسید..."
                className="w-full bg-[#f0fdf4] border border-[#d4af37]/40 rounded-xl p-2.5 text-xs text-[#073b27] font-bold mb-2"
              />
              {supportSuccess ? (
                <p className="text-xs text-[#073b27] font-black text-center bg-[#f0fdf4] border border-[#d4af37] p-2 rounded-xl">
                  پیام شما دریافت شد. همکاران ما به زودی پاسخ خواهند داد.
                </p>
              ) : (
                <button
                  onClick={() => {
                    if (supportText.trim()) {
                      setSupportSuccess(true);
                      setSupportText('');
                      setTimeout(() => setSupportSuccess(false), 3000);
                    }
                  }}
                  className="w-full bg-[#073b27] text-[#fef08a] font-black text-xs py-2.5 rounded-xl border border-[#d4af37]"
                >
                  ارسال تیکت پشتیبانی
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
