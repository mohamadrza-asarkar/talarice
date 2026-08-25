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

  return (
    <div className={styles.modalOverlay}>
      <div 
        className={styles.backdrop}
        onClick={() => step !== 4 && setIsCheckoutOpen(false)}
      ></div>
      
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <div className={styles.headerTitle}>
            <i className="fa-solid fa-truck-fast" />
            <span>تکمیل خرید و ارسال</span>
          </div>
          {step !== 4 && (
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className={styles.closeBtn}
            >
              <i className="fa-solid fa-xmark" />
            </button>
          )}
        </div>

        <div className={styles.stepperContainer}>
          <div className={styles.stepper}>
            <div className={`${styles.step} ${step >= 1 ? styles.stepActive : styles.stepInactive}`}>
              <div className={`${styles.stepCircle} ${step >= 1 ? styles.stepCircleActive : styles.stepCircleInactive}`}>۱</div>
              <span className={`${styles.stepLabel} ${step >= 1 ? styles.stepLabelActive : styles.stepLabelInactive}`}>آدرس</span>
            </div>
            <div className={`${styles.stepLine} ${step >= 2 ? styles.stepLineActive : styles.stepLineInactive}`}></div>
            <div className={`${styles.step} ${step >= 2 ? styles.stepActive : styles.stepInactive}`}>
              <div className={`${styles.stepCircle} ${step >= 2 ? styles.stepCircleActive : styles.stepCircleInactive}`}>۲</div>
              <span className={`${styles.stepLabel} ${step >= 2 ? styles.stepLabelActive : styles.stepLabelInactive}`}>بررسی</span>
            </div>
            <div className={`${styles.stepLine} ${step >= 3 ? styles.stepLineActive : styles.stepLineInactive}`}></div>
            <div className={`${styles.step} ${step >= 3 ? styles.stepActive : styles.stepInactive}`}>
              <div className={`${styles.stepCircle} ${step >= 3 ? styles.stepCircleActive : styles.stepCircleInactive}`}>۳</div>
              <span className={`${styles.stepLabel} ${step >= 3 ? styles.stepLabelActive : styles.stepLabelInactive}`}>پرداخت</span>
            </div>
          </div>
        </div>

        <div className={styles.modalContent}>
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className={styles.formContainer}>
              <h3 className={styles.sectionTitle}>
                <i className="fa-solid fa-location-dot" style={{ color: '#d4af37' }} />
                اطلاعات گیرنده و آدرس ارسال:
              </h3>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>نام و نام خانوادگی تحویل‌گیرنده</label>
                <input
                  required
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                  className={styles.formInput}
                  placeholder="مثال: علی احمدی"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>شماره موبایل (جهت هماهنگی ارسال)</label>
                <input
                  required
                  type="tel"
                  dir="ltr"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className={styles.formInput}
                  placeholder="09120000000"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>استان</label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({...formData, province: e.target.value})}
                    className={styles.formInput}
                  >
                    <option>فارس</option>
                    <option>تهران</option>
                    <option>اصفهان</option>
                    <option>خراسان رضوی</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>شهر</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className={styles.formInput}
                  >
                    <option>شیراز</option>
                    <option>مرودشت</option>
                    <option>کامفیروز</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>آدرس دقیق پستی</label>
                <textarea
                  required
                  rows={2}
                  value={formData.fullAddress}
                  onChange={(e) => setFormData({...formData, fullAddress: e.target.value})}
                  className={styles.formTextarea}
                  placeholder="خیابان، کوچه، پلاک، واحد..."
                />
              </div>

              <button type="submit" className={styles.primaryButton}>
                مرحله بعد: بررسی سفارش
              </button>
            </form>
          )}

          {step === 2 && (
            <div className={styles.formContainer}>
              <h3 className={styles.sectionTitle}>
                <i className="fa-solid fa-clipboard-check" style={{ color: '#d4af37' }} />
                بررسی اقلام و کیسه‌های انتخابی:
              </h3>
              
              <div className={styles.cartItemsList}>
                {cart.map((item) => (
                  <div key={`${item.product?.id || 'item'}-${item.weightKg}`} className={styles.cartItem}>
                    <div>
                      <div className={styles.cartItemName}>{item.product?.name || 'برنج کامفیروزی'}</div>
                      <div className={styles.cartItemVariant}>
                        کیسه {(item.weightKg ?? 10).toLocaleString('fa-IR')} کیلویی ×{' '}
                        {(item.quantity ?? 1).toLocaleString('fa-IR')}
                      </div>
                    </div>
                    <div className={styles.cartItemPrice}>
                      {(
                        ((item.weightKg === (item.product?.weight || 10)
                          ? (item.product?.price || 0)
                          : Math.round(((item.product?.price || 0) / (item.product?.weight || 10)) * (item.weightKg || 10))) * (item.quantity || 1)) || 0
                      ).toLocaleString('fa-IR')}{' '}
                      تومان
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.addressSummary}>
                <div className={styles.summaryRow}>
                  <span>تحویل‌گیرنده:</span>
                  <span>{formData.recipientName} ({formData.phone})</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>آدرس:</span>
                  <span className={styles.addressText}>{formData.fullAddress}</span>
                </div>
              </div>

              <div className={styles.buttonGroup}>
                <button type="button" onClick={() => setStep(1)} className={styles.secondaryButton}>
                  ویرایش آدرس
                </button>
                <button type="button" onClick={() => setStep(3)} className={`${styles.primaryButton} ${styles.flex1}`}>
                  تایید و انتخاب روش پرداخت
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.formContainer}>
              <h3 className={styles.sectionTitle}>
                <i className="fa-solid fa-credit-card" style={{ color: '#d4af37' }} />
                انتخاب روش پرداخت:
              </h3>
              
              <div className={styles.paymentMethods}>
                <label onClick={() => setFormData({ ...formData, paymentMethod: 'gateway' })} className={`${styles.paymentMethodLabel} ${formData.paymentMethod === 'gateway' ? styles.paymentMethodActive : styles.paymentMethodInactive}`}>
                  <i className="fa-solid fa-credit-card" style={{ color: '#073b27', fontSize: '1.25rem' }} />
                  <div>
                    <div className={styles.paymentMethodTitle}>درگاه پرداخت آنلاین شتاب</div>
                    <div className={styles.paymentMethodDesc}>پرداخت امن بانکی با تمامی کارت‌های عضو شتاب</div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'gateway'}
                    onChange={() => {}}
                    className={styles.radioInput}
                  />
                </label>
                
                <label onClick={() => setFormData({ ...formData, paymentMethod: 'card' })} className={`${styles.paymentMethodLabel} ${formData.paymentMethod === 'card' ? styles.paymentMethodActive : styles.paymentMethodInactive}`}>
                  <i className="fa-solid fa-building-columns" style={{ color: '#b45309', fontSize: '1.25rem' }} />
                  <div>
                    <div className={styles.paymentMethodTitle}>کارت به کارت حساب طلا رایس</div>
                    <div className={styles.paymentMethodDesc}>ارسال تصویر فیش واریزی در واتساپ یا تلگرام</div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'card'}
                    onChange={() => {}}
                    className={styles.radioInput}
                  />
                </label>
              </div>

              <div className={styles.totalsBox}>
                <div className={styles.totalsRow}>
                  <span>مبلغ کل سفارش:</span>
                  <span>{(cartSubtotal || 0).toLocaleString('fa-IR')} تومان</span>
                </div>
                {(discountAmount || 0) > 0 && (
                  <div className={styles.discountRow}>
                    <span>مبلغ تخفیف:</span>
                    <span>- {(discountAmount || 0).toLocaleString('fa-IR')} تومان</span>
                  </div>
                )}
                <div className={styles.totalsRow}>
                  <span>هزینه حمل و نقل:</span>
                  <span>
                    {shippingFee === 0 ? 'رایگان' : `${(shippingFee || 0).toLocaleString('fa-IR')} تومان`}
                  </span>
                </div>
                <div className={styles.finalTotalRow}>
                  <span>مبلغ قابل پرداخت نهایی:</span>
                  <span>{(finalTotal || 0).toLocaleString('fa-IR')} تومان</span>
                </div>
              </div>

              <div className={styles.buttonGroup}>
                <button type="button" onClick={() => setStep(2)} className={styles.secondaryButton}>
                  بازگشت
                </button>
                <button type="button" onClick={handleNext} className={`${styles.primaryButton} ${styles.flex1}`}>
                  پرداخت و ثبت نهایی سفارش
                </button>
              </div>
            </div>
          )}

          {step === 4 && createdOrder && (
            <div className={styles.successContainer}>
              <div className={styles.successIconWrapper}>
                <i className="fa-solid fa-circle-check" style={{ fontSize: '2.25rem' }} />
              </div>
              
              <div>
                <h3 className={styles.successTitle}>سفارش شما با موفقیت ثبت گردید!</h3>
                <p className={styles.successDesc}>
                  کیسه‌های برنج کامفیروزی در حال آماده‌سازی و ارسال می‌باشند.
                </p>
              </div>
              
              <div className={styles.orderDetailsBox}>
                <div className={styles.orderDetailRow}>
                  <span className={styles.orderDetailLabel}>شماره سفارش:</span>
                  <span className={`${styles.orderDetailValue} ${styles.monoText}`}>{createdOrder.id}</span>
                </div>
                <div className={styles.orderDetailRow}>
                  <span className={styles.orderDetailLabel}>کد رهگیری پستی:</span>
                  <span className={`${styles.orderDetailValueSecondary} ${styles.monoText}`}>{createdOrder.trackingCode}</span>
                </div>
                <div className={styles.orderDetailRow}>
                  <span className={styles.orderDetailLabel}>مبلغ پرداخت شده:</span>
                  <span className={styles.orderDetailValue}>{((createdOrder.finalAmount || createdOrder.totalAmount) || 0).toLocaleString('fa-IR')} تومان</span>
                </div>
                <div className={styles.orderDetailRowNoBorder}>
                  <span className={styles.orderDetailLabel}>تحویل‌گیرنده:</span>
                  <span>{createdOrder.address?.recipientName || formData.recipientName}</span>
                </div>
              </div>

              <button onClick={handleFinish} className={styles.finishButton}>
                مشاهده در تاریخچه سفارشات
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
