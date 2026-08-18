import React, { useState } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartSubtotal,
    discountAmount,
    shippingFee,
    finalTotal,
    setIsCheckoutOpen
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMessage(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden ${styles.drawerOverlay}`}>
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-r-2 border-[#d4af37]">
          <div className="p-4 border-b-2 border-[#d4af37]/30 flex items-center justify-between bg-[#f0fdf4]">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-bag-shopping text-[#073b27] text-xl" />
              <h2 className="text-base font-black text-[#073b27]">
                سبد خرید گونی‌های طلا رایس
              </h2>
              <span className="text-xs bg-[#d4af37] text-[#073b27] font-black px-2.5 py-0.5 rounded-full border border-white">
                ({cart.length} کیسه)
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-[#073b27] hover:bg-[#d4af37]/20 rounded-full p-1 transition-colors"
            >
              <i className="fa-solid fa-xmark text-xl" />
            </button>
          </div>

          <div className="bg-[#fefce8] p-2.5 px-4 text-[11px] font-bold text-[#073b27] border-b border-[#d4af37]/30 flex items-center justify-between">
            {cartSubtotal >= 2000000 ? (
              <span className="text-[#073b27] font-black flex items-center gap-1">
                <i className="fa-solid fa-check text-xs" />
                سفارش شما شامل ارسال کاملاً رایگان است!
              </span>
            ) : (
              <span className="text-[#b45309]">
                تا ارسال رایگان:{' '}
                <strong>{(2000000 - cartSubtotal).toLocaleString('fa-IR')}</strong> تومان
                دیگر
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#073b27]">
                <i className="fa-solid fa-cart-flatbed-suitcases text-6xl text-[#d4af37] mb-3" />
                <h3 className="text-base font-black text-[#073b27] mb-1">
                  سبد خرید شما خالی است
                </h3>
                <p className="text-xs text-[#1e3a29] mb-4 font-medium">
                  کیسه‌های ۵ و ۱۰ کیلویی برنج معطر کامفیروز را انتخاب و اضافه کنید.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#073b27] text-[#fef08a] text-xs font-black px-5 py-2.5 rounded-xl border border-[#d4af37] shadow-md"
                >
                  مشاهده کاتالوگ کیسه‌ها
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const unitPrice =
                  item.weightKg === item.product.weight
                    ? item.product.price
                    : Math.round(
                        (item.product.price / item.product.weight) * item.weightKg
                      );
                return (
                  <div
                    key={`${item.product.id}-${item.weightKg}`}
                    className="flex gap-3 bg-[#f0fdf4] p-3 rounded-2xl border border-[#d4af37]/40 shadow-sm"
                  >
                    <div className="relative w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 border border-[#d4af37]/40">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 bg-[#073b27] text-[#fef08a] text-[9px] font-black px-1.5 py-0.2 rounded border border-[#d4af37]">
                        {item.weightKg.toLocaleString('fa-IR')}k
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-black text-[#073b27] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <span className="text-[11px] text-[#b45309] font-bold">
                          کیسه سفید {item.weightKg.toLocaleString('fa-IR')} کیلوگرمی
                        </span>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-[#d4af37]/40 shadow-xs">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.weightKg, 1)
                            }
                            className="w-5 h-5 flex items-center justify-center text-[#073b27] hover:bg-[#d4af37]/20 rounded-md font-bold text-xs"
                          >
                            +
                          </button>
                          <span className="text-xs font-black text-[#073b27] min-w-4 text-center">
                            {item.quantity.toLocaleString('fa-IR')}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.weightKg, -1)
                            }
                            className="w-5 h-5 flex items-center justify-center text-[#073b27] hover:bg-[#d4af37]/20 rounded-md font-bold text-xs"
                          >
                            -
                          </button>
                        </div>

                        <div className="text-left">
                          <span className="text-xs font-black text-[#073b27]">
                            {(unitPrice * item.quantity).toLocaleString('fa-IR')}
                          </span>
                          <span className="text-[9px] text-[#b45309] mr-0.5">تومان</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        removeFromCart(item.product.id, item.weightKg)
                      }
                      className="text-gray-400 hover:text-red-600 p-1 self-start"
                      title="حذف از سبد"
                    >
                      <i className="fa-solid fa-trash-can text-sm" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-4 border-t-2 border-[#d4af37]/30 bg-white space-y-3">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="کد تخفیف (مثلا: TALA2026)"
                  className="flex-1 bg-[#f0fdf4] border border-[#d4af37]/40 rounded-xl px-3 py-2 text-xs font-bold text-[#073b27] placeholder:text-[#073b27]/40 outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#073b27] text-[#fef08a] font-black text-xs px-3.5 py-2 rounded-xl hover:bg-[#136f46] transition-colors border border-[#d4af37]"
                >
                  اعمال
                </button>
              </form>

              {couponMessage && (
                <div
                  className={`text-[11px] font-bold p-2 rounded-xl ${
                    couponMessage.success
                      ? 'bg-[#f0fdf4] text-[#073b27] border border-[#d4af37]'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {couponMessage.message}
                </div>
              )}

              {appliedCoupon && (
                <div className="flex justify-between items-center bg-[#f0fdf4] border border-[#d4af37] px-3 py-1.5 rounded-xl text-xs">
                  <span className="text-[#073b27] font-black">
                    کوپن {appliedCoupon.code} ({appliedCoupon.discountPercent}٪ تخفیف)
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-red-600 hover:text-red-800 text-[11px] font-bold"
                  >
                    حذف کوپن
                  </button>
                </div>
              )}

              <div className="space-y-1.5 text-xs pt-2 border-t border-[#e2e8f0]">
                <div className="flex justify-between text-[#1e3a29]">
                  <span>مجموع قیمت کیسه‌ها:</span>
                  <span className="font-bold">
                    {cartSubtotal.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-red-600 font-bold">
                    <span>تخفیف شگفت‌انگیز:</span>
                    <span>- {discountAmount.toLocaleString('fa-IR')} تومان</span>
                  </div>
                )}
                <div className="flex justify-between text-[#1e3a29]">
                  <span>هزینه بسته‌بندی و ارسال:</span>
                  <span>
                    {shippingFee === 0 ? (
                      <strong className="text-green-700">رایگان</strong>
                    ) : (
                      `${shippingFee.toLocaleString('fa-IR')} تومان`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-[#073b27] pt-2 border-t border-[#d4af37]/30">
                  <span>مبلغ نهایی قابل پرداخت:</span>
                  <span className="text-lg text-[#073b27]">
                    {finalTotal.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={clearCart}
                  className="bg-white hover:bg-red-50 text-red-600 font-bold text-xs px-3 py-3 rounded-xl border border-red-200"
                  title="خالی کردن سبد"
                >
                  <i className="fa-solid fa-trash-arrow-up text-base" />
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-[#073b27] to-[#136f46] hover:from-[#d4af37] hover:to-[#fef08a] hover:text-[#073b27] text-[#fef08a] font-black text-sm py-3 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 border border-[#d4af37]"
                >
                  <span>تکمیل سفارش کیسه‌ها</span>
                  <i className="fa-solid fa-arrow-left text-sm" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
