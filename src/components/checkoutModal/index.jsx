import React, { useState } from 'react';
import { useApp } from '../../context';

export function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, finalAmount, createOrder } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !address) return;

    setSubmitting(true);
    try {
      await createOrder({
        buyerName: name,
        phone,
        address,
      });
      setSuccess(true);
    } catch (err) {
      alert('خطا در ثبت سفارش');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !success && setIsCheckoutOpen(false)} />

      <div className="relative w-full max-w-md bg-[#073b27] border border-[#d4af37]/30 rounded-2xl p-5 z-10 text-white flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold text-[#d4af37]">ثبت نهایی سفارش</h3>
          {!success && (
            <button onClick={() => setIsCheckoutOpen(false)} className="text-gray-400 hover:text-white">
              <i className="fa-solid fa-xmark text-lg" />
            </button>
          )}
        </div>

        {success ? (
          <div className="text-center py-6 flex flex-col items-center gap-3">
            <i className="fa-solid fa-circle-check text-4xl text-emerald-400" />
            <h4 className="text-base font-bold text-white">سفارش شما با موفقیت ثبت شد</h4>
            <p className="text-xs text-gray-300">همکاران ما به زودی جهت ارسال با شما تماس خواهند گرفت.</p>
            <button
              onClick={() => {
                setSuccess(false);
                setIsCheckoutOpen(false);
              }}
              className="mt-2 bg-[#d4af37] text-[#042a1b] px-6 py-2 rounded-xl text-xs font-bold"
            >
              متوجه شدم
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-gray-300 block mb-1">نام و نام خانوادگی</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: محمد رضایی"
                className="w-full bg-[#042a1b] border border-white/20 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1">شماره تماس</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09123456789"
                className="w-full bg-[#042a1b] border border-white/20 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="text-xs text-gray-300 block mb-1">آدرس کامل پستی</label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="استان، شهر، خیابان، پلاک..."
                className="w-full bg-[#042a1b] border border-white/20 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#d4af37] resize-none"
              />
            </div>

            <div className="flex justify-between items-center py-2 text-sm border-t border-white/10">
              <span className="text-gray-300">مبلغ قابل پرداخت:</span>
              <span className="font-black text-[#d4af37]">{Number(finalAmount).toLocaleString('fa-IR')} تومان</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#d4af37] text-[#042a1b] py-3 rounded-xl font-bold text-xs hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {submitting ? 'در حال ثبت...' : 'تایید و ثبت سفارش'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default CheckoutModal;
