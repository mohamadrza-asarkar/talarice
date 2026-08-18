import React, { useState } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export const CheckoutModal = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    finalTotal,
    addOrder,
    setActiveTab
  } = useApp();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    recipientName: '',
    phone: '',
    province: 'فارس',
    city: 'شیراز',
    postalCode: '',
    fullAddress: '',
    deliveryNote: '',
    paymentMethod: 'gateway'
  });

  const [createdOrder, setCreatedOrder] = useState(null);

  if (!isCheckoutOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    if (e) e.preventDefault();
    if (step === 1) {
      if (!formData.recipientName || !formData.phone || !formData.fullAddress) {
        alert('لطفاً مشخصات و آدرس تحویل را کامل وارد نمایید.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      const order = addOrder({
        items: cart,
        totalAmount: cartSubtotal,
        discountAmount,
        shippingFee,
        finalAmount: finalTotal,
        paymentMethod: formData.paymentMethod,
        address: {
          recipientName: formData.recipientName,
          phone: formData.phone,
          province: formData.province,
          city: formData.city,
          postalCode: formData.postalCode,
          fullAddress: formData.fullAddress
        }
      });
      setCreatedOrder(order);
      setStep(4);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep(1);
    setCreatedOrder(null);
  };

  const handleFinish = () => {
    handleClose();
    setActiveTab('profile');
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 ${styles.modalOverlay}`}>
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-2 border-[#d4af37] animate-fade-in text-[#073b27]">
        <div className="bg-gradient-to-r from-[#073b27] to-[#136f46] text-[#fef08a] p-4 flex justify-between items-center border-b-2 border-[#d4af37]">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-truck-fast text-xl text-[#fef08a]" />
            <h2 className="text-base font-black">
              تکمیل و ثبت سفارش گونی برنج طلا رایس
            </h2>
          </div>
          {step < 4 && (
            <button
              onClick={handleClose}
              className="text-[#fef08a] hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <i className="fa-solid fa-xmark text-lg" />
            </button>
          )}
        </div>

        {step < 4 && (
          <div className="flex justify-between items-center px-6 py-3 bg-[#f0fdf4] border-b border-[#d4af37]/30 text-xs font-black">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#073b27]' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-[#073b27] text-[#fef08a]' : 'bg-gray-200 text-gray-600'}`}>
                ۱
              </span>
              <span>آدرس گیرنده</span>
            </div>
            <div className="h-0.5 w-6 bg-[#d4af37]/40" />
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#073b27]' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#073b27] text-[#fef08a]' : 'bg-gray-200 text-gray-600'}`}>
                ۲
              </span>
              <span>بازبینی کیسه‌ها</span>
            </div>
            <div className="h-0.5 w-6 bg-[#d4af37]/40" />
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#073b27]' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-[#073b27] text-[#fef08a]' : 'bg-gray-200 text-gray-600'}`}>
                ۳
              </span>
              <span>پرداخت</span>
            </div>
          </div>
        )}

        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-3 text-xs">
              <h3 className="font-black text-sm text-[#073b27] mb-2 flex items-center gap-1.5">
                <i className="fa-solid fa-location-dot text-[#d4af37]" />
                اطلاعات تحویل‌گیرنده و آدرس ارسال:
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-[#073b27] mb-1">
                    نام و نام خانوادگی تحویل گیرنده:
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    required
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    placeholder="مثلاً: محمد رضایی"
                    className="w-full bg-[#f0fdf4] border border-[#d4af37]/40 rounded-xl px-3 py-2 text-[#073b27] font-bold outline-none focus:border-[#073b27]"
                  />
                </div>
                <div>
                  <label className="block font-black text-[#073b27] mb-1">
                    شماره همراه (جهت پیامک رهگیری):
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="۰۹۱۷۱۲۳۴۵۶۷"
                    className="w-full bg-[#f0fdf4] border border-[#d4af37]/40 rounded-xl px-3 py-2 text-[#073b27] font-bold outline-none focus:border-[#073b27]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-black text-[#073b27] mb-1">استان:</label>
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full bg-[#f0fdf4] border border-[#d4af37]/40 rounded-xl px-3 py-2 text-[#073b27] font-bold"
                  />
                </div>
                <div>
                  <label className="block font-black text-[#073b27] mb-1">شهر:</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-[#f0fdf4] border border-[#d4af37]/40 rounded-xl px-3 py-2 text-[#073b27] font-bold"
                  />
                </div>
                <div>
                  <label className="block font-black text-[#073b27] mb-1">کد پستی:</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="۱۰ رقمی"
                    className="w-full bg-[#f0fdf4] border border-[#d4af37]/40 rounded-xl px-3 py-2 text-[#073b27] font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black text-[#073b27] mb-1">
                  آدرس دقیق پستی:
                </label>
                <textarea
                  rows={2}
                  name="fullAddress"
                  required
                  value={formData.fullAddress}
                  onChange={handleInputChange}
                  placeholder="خیابان، کوچه، پلاک، واحد..."
                  className="w-full bg-[#f0fdf4] border border-[#d4af37]/40 rounded-xl p-2.5 text-[#073b27] font-bold outline-none focus:border-[#073b27]"
                />
              </div>

              <div>
                <label className="block font-black text-[#073b27] mb-1">
                  توضیحات تکمیلی تحویل (اختیاری):
                </label>
                <input
                  type="text"
                  name="deliveryNote"
                  value={formData.deliveryNote}
                  onChange={handleInputChange}
                  placeholder="مثلا: تماس قبل از رسیدن یا تحویل به نگهبانی"
                  className="w-full bg-[#f0fdf4] border border-[#d4af37]/40 rounded-xl px-3 py-2 text-[#073b27] font-bold"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#073b27] to-[#136f46] text-[#fef08a] font-black text-sm py-3 rounded-xl shadow-lg border border-[#d4af37]"
                >
                  مرحله بعد: بازبینی سفارش
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-black text-sm text-[#073b27] flex items-center gap-1.5">
                <i className="fa-solid fa-clipboard-check text-[#d4af37]" />
                بررسی اقلام و کیسه‌های انتخابی:
              </h3>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.weightKg}`}
                    className="flex justify-between items-center bg-[#f0fdf4] p-2.5 rounded-xl border border-[#d4af37]/30"
                  >
                    <div>
                      <div className="font-black text-[#073b27]">
                        {item.product.name}
                      </div>
                      <div className="text-[11px] text-[#b45309]">
                        کیسه {item.weightKg.toLocaleString('fa-IR')} کیلویی ×{' '}
                        {item.quantity.toLocaleString('fa-IR')}
                      </div>
                    </div>
                    <div className="font-black text-sm text-[#073b27]">
                      {(
                        (item.weightKg === item.product.weight
                          ? item.product.price
                          : Math.round(
                              (item.product.price / item.product.weight) *
                                item.weightKg
                            )) * item.quantity
                      ).toLocaleString('fa-IR')}{' '}
                      تومان
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#fefce8] p-3 rounded-xl border border-[#d4af37]/40 space-y-1.5 font-bold">
                <div className="flex justify-between">
                  <span>تحویل‌گیرنده:</span>
                  <span>{formData.recipientName} ({formData.phone})</span>
                </div>
                <div className="flex justify-between">
                  <span>آدرس:</span>
                  <span className="text-[11px] text-justify max-w-[220px]">
                    {formData.fullAddress}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-gray-100 text-[#073b27] font-black text-xs px-4 py-3 rounded-xl border border-gray-300"
                >
                  ویرایش آدرس
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gradient-to-r from-[#073b27] to-[#136f46] text-[#fef08a] font-black text-sm py-3 rounded-xl shadow-lg border border-[#d4af37]"
                >
                  تایید و انتخاب روش پرداخت
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-black text-sm text-[#073b27] flex items-center gap-1.5">
                <i className="fa-solid fa-credit-card text-[#d4af37]" />
                انتخاب روش پرداخت:
              </h3>

              <div className="space-y-2.5">
                <label
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: 'gateway' })
                  }
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.paymentMethod === 'gateway'
                      ? 'border-[#073b27] bg-[#f0fdf4]'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <i className="fa-solid fa-credit-card text-[#073b27] text-xl" />
                  <div>
                    <div className="font-black text-xs text-[#073b27]">
                      درگاه پرداخت آنلاین شتاب
                    </div>
                    <div className="text-[11px] text-[#1e3a29]">
                      پرداخت امن بانکی با تمامی کارت‌های عضو شتاب
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'gateway'}
                    onChange={() => {}}
                    className="mr-auto accent-[#073b27]"
                  />
                </label>

                <label
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: 'card' })
                  }
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.paymentMethod === 'card'
                      ? 'border-[#073b27] bg-[#f0fdf4]'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <i className="fa-solid fa-building-columns text-[#b45309] text-xl" />
                  <div>
                    <div className="font-black text-xs text-[#073b27]">
                      کارت به کارت حساب طلا رایس
                    </div>
                    <div className="text-[11px] text-[#1e3a29]">
                      ارسال تصویر فیش واریزی در واتساپ یا تلگرام
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'card'}
                    onChange={() => {}}
                    className="mr-auto accent-[#073b27]"
                  />
                </label>
              </div>

              <div className="bg-[#f0fdf4] p-3 rounded-2xl border border-[#d4af37]/40 space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span>مبلغ کل سفارش:</span>
                  <span>{cartSubtotal.toLocaleString('fa-IR')} تومان</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-red-600 font-bold">
                    <span>مبلغ تخفیف:</span>
                    <span>- {discountAmount.toLocaleString('fa-IR')} تومان</span>
                  </div>
                )}
                <div className="flex justify-between font-bold">
                  <span>هزینه حمل و نقل:</span>
                  <span>
                    {shippingFee === 0 ? 'رایگان' : `${shippingFee.toLocaleString('fa-IR')} تومان`}
                  </span>
                </div>
                <div className="flex justify-between font-black text-sm text-[#073b27] pt-2 border-t border-[#d4af37]/30">
                  <span>مبلغ قابل پرداخت نهایی:</span>
                  <span>{finalTotal.toLocaleString('fa-IR')} تومان</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-gray-100 text-[#073b27] font-black text-xs px-4 py-3 rounded-xl border border-gray-300"
                >
                  بازگشت
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-[#073b27] to-[#136f46] text-[#fef08a] font-black text-sm py-3 rounded-xl shadow-lg border border-[#d4af37]"
                >
                  پرداخت و ثبت نهایی سفارش
                </button>
              </div>
            </div>
          )}

          {step === 4 && createdOrder && (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 bg-[#f0fdf4] text-[#073b27] rounded-full flex items-center justify-center mx-auto shadow-lg border-2 border-[#d4af37]">
                <i className="fa-solid fa-circle-check text-4xl text-[#073b27]" />
              </div>

              <div>
                <h3 className="text-lg font-black text-[#073b27]">
                  سفارش شما با موفقیت ثبت گردید!
                </h3>
                <p className="text-xs text-[#1e3a29] mt-1 font-medium">
                  کیسه‌های برنج کامفیروزی در حال آماده‌سازی و ارسال می‌باشند.
                </p>
              </div>

              <div className="bg-[#f0fdf4] p-4 rounded-2xl border-2 border-[#d4af37]/50 text-right space-y-2 text-xs">
                <div className="flex justify-between border-b border-[#d4af37]/30 pb-2">
                  <span className="font-bold">شماره سفارش:</span>
                  <span className="font-black text-[#073b27] font-mono">
                    {createdOrder.id}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#d4af37]/30 pb-2">
                  <span className="font-bold">کد رهگیری پستی:</span>
                  <span className="font-black text-[#b45309] font-mono">
                    {createdOrder.trackingCode}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#d4af37]/30 pb-2">
                  <span className="font-bold">مبلغ پرداخت شده:</span>
                  <span className="font-black text-[#073b27]">
                    {createdOrder.finalAmount.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">تحویل‌گیرنده:</span>
                  <span>{createdOrder.address.recipientName}</span>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="w-full bg-[#073b27] text-[#fef08a] font-black text-sm py-3 rounded-xl border border-[#d4af37] shadow-lg"
              >
                مشاهده در تاریخچه سفارشات
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
