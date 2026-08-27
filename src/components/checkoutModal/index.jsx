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

  const handleNext = () => {
    if (step === 3) {
      const order = addOrder(formData);
      setCreatedOrder(order);
      setStep(4);
    } else {
      setStep(step + 1);
    }
  };

  const handleFinish = () => {
    setIsCheckoutOpen(false);
    setTimeout(() => {
      setStep(1);
      setCreatedOrder(null);
      setActiveTab('profile');
    }, 300);
  };

  const stepLabels = ['آدرس', 'بررسی', 'پرداخت'];

  return (
    <aside className={styles.overlay} onClick={() => step !== 4 && setIsCheckoutOpen(false)}>
      <dialog open className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h3 className={styles.headerTitle}>
            <i className="fa-solid fa-truck-fast" />
            <span>تکمیل خرید و ارسال</span>
          </h3>
          {step !== 4 && (
            <button onClick={() => setIsCheckoutOpen(false)} className={styles.closeBtn} aria-label="بستن">
              <i className="fa-solid fa-xmark" />
            </button>
          )}
        </header>

        {step <= 3 && (
          <nav className={styles.stepper}>
            {stepLabels.map((lbl, idx) => {
              const num = idx + 1;
              return (
                <React.Fragment key={num}>
                  <div className={`${styles.step} ${step >= num ? styles.stepActive : ''}`}>
                    <span className={styles.stepCircle}>{num.toLocaleString('fa-IR')}</span>
                    <span>{lbl}</span>
                  </div>
                  {idx < stepLabels.length - 1 && (
                    <div className={`${styles.stepLine} ${step > num ? styles.stepLineActive : ''}`} />
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        )}

        <div className={styles.content}>
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className={styles.form}>
              <h4 className={styles.sectionTitle}>
                <i className="fa-solid fa-location-dot" />
                <span>اطلاعات گیرنده و آدرس ارسال:</span>
              </h4>

              <div className={styles.formGroup}>
                <label>نام و نام خانوادگی تحویل‌گیرنده</label>
                <input
                  required
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  placeholder="مثال: علی احمدی"
                />
              </div>

              <div className={styles.formGroup}>
                <label>شماره موبایل (جهت هماهنگی ارسال)</label>
                <input
                  required
                  type="tel"
                  dir="ltr"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="09120000000"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>استان</label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  >
                    <option>فارس</option>
                    <option>تهران</option>
                    <option>اصفهان</option>
                    <option>خراسان رضوی</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>شهر</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  >
                    <option>شیراز</option>
                    <option>مرودشت</option>
                    <option>کامفیروز</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>آدرس دقیق پستی</label>
                <textarea
                  required
                  rows={2}
                  value={formData.fullAddress}
                  onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                  placeholder="خیابان، کوچه، پلاک، واحد..."
                />
              </div>

              <button type="submit" className={styles.primaryBtn}>
                مرحله بعد: بررسی سفارش
              </button>
            </form>
          )}

          {step === 2 && (
            <div className={styles.form}>
              <h4 className={styles.sectionTitle}>
                <i className="fa-solid fa-clipboard-check" />
                <span>بررسی اقلام انتخابی:</span>
              </h4>

              <ul className={styles.cartItemsList}>
                {cart.map((item) => {
                  const baseW = item.product?.weight ?? 10;
                  const unitP = item.product?.price ?? 0;
                  const price = item.weightKg === baseW ? unitP : Math.round((unitP / baseW) * item.weightKg);
                  const total = price * (item.quantity ?? 1);

                  return (
                    <li key={`${item.product?.id}-${item.weightKg}`} className={styles.cartReviewItem}>
                      <div>
                        <strong>{item.product?.name ?? 'برنج کامفیروزی'}</strong>
                        <div className={styles.variantText}>
                          کیسه {(item.weightKg ?? 10).toLocaleString('fa-IR')} کیلویی × {(item.quantity ?? 1).toLocaleString('fa-IR')}
                        </div>
                      </div>
                      <span className={styles.itemPrice}>{total.toLocaleString('fa-IR')} تومان</span>
                    </li>
                  );
                })}
              </ul>

              <div className={styles.addressSummary}>
                <div><strong>تحویل‌گیرنده:</strong> {formData.recipientName} ({formData.phone})</div>
                <div><strong>آدرس:</strong> {formData.fullAddress}</div>
              </div>

              <div className={styles.btnRow}>
                <button type="button" onClick={() => setStep(1)} className={styles.secondaryBtn}>
                  ویرایش آدرس
                </button>
                <button type="button" onClick={() => setStep(3)} className={styles.primaryBtn}>
                  تایید و انتخاب روش پرداخت
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.form}>
              <h4 className={styles.sectionTitle}>
                <i className="fa-solid fa-credit-card" />
                <span>انتخاب روش پرداخت:</span>
              </h4>

              <div className={styles.paymentList}>
                <label
                  onClick={() => setFormData({ ...formData, paymentMethod: 'gateway' })}
                  className={`${styles.paymentOption} ${formData.paymentMethod === 'gateway' ? styles.paymentOptionActive : ''}`}
                >
                  <i className="fa-solid fa-credit-card" />
                  <div className={styles.paymentInfo}>
                    <strong>درگاه پرداخت آنلاین شتاب</strong>
                    <small>پرداخت امن بانکی با تمامی کارت‌های عضو شتاب</small>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'gateway'}
                    onChange={() => {}}
                  />
                </label>

                <label
                  onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                  className={`${styles.paymentOption} ${formData.paymentMethod === 'card' ? styles.paymentOptionActive : ''}`}
                >
                  <i className="fa-solid fa-building-columns" />
                  <div className={styles.paymentInfo}>
                    <strong>کارت به کارت حساب طلا رایس</strong>
                    <small>ارسال تصویر فیش واریزی در واتساپ یا تلگرام</small>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'card'}
                    onChange={() => {}}
                  />
                </label>
              </div>

              <div className={styles.totalsBox}>
                <div className={styles.totalsRow}>
                  <span>مبلغ سفارش:</span>
                  <span>{(cartSubtotal ?? 0).toLocaleString('fa-IR')} تومان</span>
                </div>
                {(discountAmount ?? 0) > 0 && (
                  <div className={styles.discountRow}>
                    <span>تخفیف:</span>
                    <span>- {(discountAmount ?? 0).toLocaleString('fa-IR')} تومان</span>
                  </div>
                )}
                <div className={styles.totalsRow}>
                  <span>هزینه ارسال:</span>
                  <span>{shippingFee === 0 ? 'رایگان' : `${(shippingFee ?? 0).toLocaleString('fa-IR')} تومان`}</span>
                </div>
                <div className={styles.finalTotalRow}>
                  <span>مبلغ پرداختی:</span>
                  <strong>{(finalTotal ?? 0).toLocaleString('fa-IR')} تومان</strong>
                </div>
              </div>

              <div className={styles.btnRow}>
                <button type="button" onClick={() => setStep(2)} className={styles.secondaryBtn}>
                  بازگشت
                </button>
                <button type="button" onClick={handleNext} className={styles.primaryBtn}>
                  پرداخت و ثبت نهایی
                </button>
              </div>
            </div>
          )}

          {step === 4 && createdOrder && (
            <div className={styles.successBox}>
              <i className={`fa-solid fa-circle-check ${styles.successIcon}`} />
              <h3>سفارش شما با موفقیت ثبت گردید!</h3>
              <p>کیسه‌های برنج کامفیروزی در حال آماده‌سازی و ارسال می‌باشند.</p>

              <div className={styles.orderSummaryCard}>
                <div><span>شماره سفارش:</span><strong>{createdOrder.id}</strong></div>
                <div><span>کد رهگیری پستی:</span><strong>{createdOrder.trackingCode}</strong></div>
                <div><span>مبلغ پرداخت شده:</span><strong>{((createdOrder.finalAmount ?? createdOrder.totalAmount) ?? 0).toLocaleString('fa-IR')} تومان</strong></div>
                <div><span>تحویل‌گیرنده:</span><span>{createdOrder.address?.recipientName ?? formData.recipientName}</span></div>
              </div>

              <button onClick={handleFinish} className={styles.primaryBtn}>
                مشاهده در تاریخچه سفارشات
              </button>
            </div>
          )}
        </div>
      </dialog>
    </aside>
  );
};
