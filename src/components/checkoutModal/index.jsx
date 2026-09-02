import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  MapPin,
  Mail,
  Phone,
  User,
  Truck,
  CreditCard,
  Building2,
  X,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Upload,
  Image as ImageIcon,
  Copy,
  Check,
  Loader2
} from 'lucide-react';
import { useApp } from '../../context';
import styles from './style.module.css';

function toEnglishDigits(str) {
  if (!str) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let res = str.toString();
  for (let i = 0; i < 10; i++) {
    res = res.replaceAll(persianDigits[i], i.toString()).replaceAll(arabicDigits[i], i.toString());
  }
  return res;
}

export function CheckoutModal() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    setIsCartOpen,
    cart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    finalTotal,
    createOrder,
    currentUser,
    isAuthenticated,
    showToast
  } = useApp();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [formData, setFormData] = useState({
    recipientName: '',
    phone: '',
    province: 'فارس',
    city: 'شیراز',
    postalCode: '',
    fullAddress: '',
    deliveryNote: '',
    paymentMethod: 'gateway',
    receiptImage: ''
  });
  const [errors, setErrors] = useState({});
  const [createdOrder, setCreatedOrder] = useState(null);

  const isLoggedIn = Boolean(isAuthenticated && currentUser);

  // Synchronize recipient info from logged-in user profile automatically
  useEffect(function () {
    if (currentUser) {
      const defaultAddr = currentUser.addresses?.find(function (a) { return a.isDefault; }) || currentUser.addresses?.[0];
      setFormData(function (prev) {
        return {
          ...prev,
          recipientName: currentUser.name || prev.recipientName,
          phone: currentUser.phone || prev.phone,
          province: defaultAddr?.province || prev.province || 'فارس',
          city: defaultAddr?.city || prev.city || 'شیراز',
          postalCode: defaultAddr?.postalCode || prev.postalCode || '',
          fullAddress: defaultAddr?.fullAddress || prev.fullAddress || ''
        };
      });
    }
  }, [currentUser, isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  function handleInputChange(field, value) {
    setFormData(function (prev) {
      return { ...prev, [field]: value };
    });
    if (errors[field]) {
      setErrors(function (prev) {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function handleReceiptUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('لطفاً یک فایل تصویری (JPG, PNG) انتخاب کنید.', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('حجم تصویر نباید بیشتر از ۵ مگابایت باشد.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (uploadEvent) {
      const base64 = uploadEvent.target?.result;
      if (base64) {
        handleInputChange('receiptImage', base64);
        showToast('تصویر فیش واریزی با موفقیت بارگذاری شد.', 'success');
      }
    };
    reader.readAsDataURL(file);
  }

  function validateStep1() {
    const newErrors = {};

    // When NOT logged in, require recipientName and phone
    if (!isLoggedIn) {
      const trimmedName = (formData.recipientName || '').trim();
      if (!trimmedName) {
        newErrors.recipientName = 'لطفاً نام و نام خانوادگی تحویل‌گیرنده را وارد کنید.';
      } else if (trimmedName.length < 3) {
        newErrors.recipientName = 'نام و نام خانوادگی باید حداقل ۳ حرف باشد.';
      }

      const cleanPhone = toEnglishDigits(formData.phone || '').replace(/[\s-]/g, '');
      if (!cleanPhone) {
        newErrors.phone = 'لطفاً شماره موبایل تحویل‌گیرنده را وارد کنید.';
      } else if (!/^09\d{9}$/.test(cleanPhone)) {
        newErrors.phone = 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.';
      }
    }

    // Postal code is always required
    const cleanPostal = toEnglishDigits(formData.postalCode || '').replace(/[\s-]/g, '');
    if (!cleanPostal) {
      newErrors.postalCode = 'لطفاً کد پستی ۱۰ رقمی را وارد کنید.';
    } else if (!/^\d{10}$/.test(cleanPostal)) {
      newErrors.postalCode = 'کد پستی باید دقیقاً ۱۰ رقم عددی باشد.';
    }

    // Full address is always required
    const trimmedAddress = (formData.fullAddress || '').trim();
    if (!trimmedAddress) {
      newErrors.fullAddress = 'لطفاً آدرس دقیق پستی خود را وارد کنید.';
    } else if (trimmedAddress.length < 10) {
      newErrors.fullAddress = 'آدرس پستی باید کامل و دقیق (حداقل ۱۰ کاراکتر) باشد.';
    }

    return newErrors;
  }

  function handleStep1Submit(e) {
    e.preventDefault();
    const validationErrors = validateStep1();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setStep(2);
  }

  async function handleFinalPayment() {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        recipientName: isLoggedIn ? (currentUser?.name || formData.recipientName) : formData.recipientName,
        phone: isLoggedIn ? (currentUser?.phone || formData.phone) : formData.phone,
        province: formData.province,
        city: formData.city,
        postalCode: formData.postalCode,
        fullAddress: formData.fullAddress,
        paymentMethod: formData.paymentMethod,
        paymentReceipt: formData.receiptImage
      };

      const order = await createOrder(orderPayload);
      setCreatedOrder(order);
      setStep(4);
    } catch (err) {
      console.error('Error placing order:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleFinish() {
    setIsCheckoutOpen(false);
    setTimeout(function () {
      setStep(1);
      setCreatedOrder(null);
      navigate(isLoggedIn ? '/profile' : '/');
    }, 300);
  }

  function handleCopyOrderId(id) {
    if (!id) return;
    navigator.clipboard.writeText(id).then(function () {
      setCopiedId(true);
      setTimeout(function () { setCopiedId(false); }, 2000);
    });
  }

  const stepLabels = ['آدرس و تحویل', 'بررسی اقلام', 'پرداخت نهایی'];

  return (
    <aside className={styles.overlay} onClick={function () { if (step !== 4 && !isSubmitting) setIsCheckoutOpen(false); }}>
      <dialog open className={styles.modal} onClick={function (e) { e.stopPropagation(); }}>
        <header className={styles.header}>
          <h3 className={styles.headerTitle}>
            <Truck size={20} className={styles.headerIcon} />
            <span>تکمیل خرید و ارسال سفارش</span>
          </h3>
          {step !== 4 && (
            <button
              onClick={function () { setIsCheckoutOpen(false); }}
              className={styles.closeBtn}
              aria-label="بستن پنجره خرید"
              disabled={isSubmitting}
            >
              <X size={20} />
            </button>
          )}
        </header>

        {step <= 3 && (
          <nav className={styles.stepper}>
            {stepLabels.map(function (lbl, idx) {
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
            <form onSubmit={handleStep1Submit} noValidate className={styles.form}>
              <h4 className={styles.sectionTitle}>
                <MapPin size={18} />
                <span>اطلاعات گیرنده و آدرس ارسال:</span>
              </h4>

              {isLoggedIn ? (
                /* When user is logged in, name & phone are read directly from server/account */
                <div className={styles.loggedUserCard}>
                  <div className={styles.loggedUserHeader}>
                    <div className={styles.loggedUserTitle}>
                      <CheckCircle2 size={16} className={styles.verifiedIcon} />
                      <span>مشخصات تحویل‌گیرنده (از حساب کاربری شما):</span>
                    </div>
                    <span className={styles.verifiedBadge}>تأیید شده</span>
                  </div>
                  <div className={styles.loggedUserDetails}>
                    <div className={styles.loggedUserItem}>
                      <User size={15} className={styles.userItemIcon} />
                      <span className={styles.userItemLabel}>نام و نام خانوادگی:</span>
                      <strong className={styles.userItemValue}>{currentUser?.name || formData.recipientName}</strong>
                    </div>
                    <div className={styles.loggedUserItem}>
                      <Phone size={15} className={styles.userItemIcon} />
                      <span className={styles.userItemLabel}>شماره تماس:</span>
                      <strong dir="ltr" className={styles.userItemValue}>{currentUser?.phone || formData.phone}</strong>
                    </div>
                  </div>
                </div>
              ) : (
                /* Guest mode with login redirect */
                <>
                  <div className={styles.guestNotice}>
                    <div className={styles.guestNoticeText}>
                      <strong>ورود برای ثبت و رهگیری سفارش</strong>
                      <span>برای پیگیری آنلاین وضعیت مرسوله پستی، وارد حساب خود شوید.</span>
                    </div>
                    <button
                      type="button"
                      onClick={function () {
                        setIsCheckoutOpen(false);
                        navigate('/auth');
                      }}
                      className={styles.loginRedirectBtn}
                    >
                      ورود / عضویت
                    </button>
                  </div>

                  <div className={styles.formGroup}>
                    <label
                      htmlFor="checkout-recipient-name"
                      className={`${styles.label} ${errors.recipientName ? styles.labelError : ''}`}
                    >
                      نام و نام خانوادگی تحویل‌گیرنده
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="checkout-recipient-name"
                        type="text"
                        value={formData.recipientName}
                        onChange={function (e) { handleInputChange('recipientName', e.target.value); }}
                        placeholder="نام و نام خانوادگی خود را وارد کنید"
                        className={`${styles.input} ${errors.recipientName ? styles.inputError : ''}`}
                        autoComplete="name"
                      />
                      <span className={styles.inputIcon}>
                        <User size={17} />
                      </span>
                    </div>
                    {errors.recipientName && (
                      <div className={styles.fieldError} id="checkout-recipient-error">
                        <AlertCircle size={14} className={styles.fieldErrorIcon} />
                        <span>{errors.recipientName}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label
                      htmlFor="checkout-phone"
                      className={`${styles.label} ${errors.phone ? styles.labelError : ''}`}
                    >
                      شماره موبایل (جهت هماهنگی ارسال)
                    </label>
                    <div className={styles.inputWrapper}>
                      <input
                        id="checkout-phone"
                        type="tel"
                        dir="ltr"
                        value={formData.phone}
                        onChange={function (e) { handleInputChange('phone', e.target.value); }}
                        placeholder="شماره موبایل خود را وارد کنید"
                        className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                        autoComplete="tel"
                      />
                      <span className={styles.inputIcon}>
                        <Phone size={17} />
                      </span>
                    </div>
                    {errors.phone && (
                      <div className={styles.fieldError} id="checkout-phone-error">
                        <AlertCircle size={14} className={styles.fieldErrorIcon} />
                        <span>{errors.phone}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>استان مقصد</label>
                  <select
                    id="checkout-province"
                    value={formData.province}
                    onChange={function (e) { handleInputChange('province', e.target.value); }}
                    className={styles.select}
                  >
                    <option>فارس</option>
                    <option>تهران</option>
                    <option>اصفهان</option>
                    <option>خراسان رضوی</option>
                    <option>البرز</option>
                    <option>مازندران</option>
                    <option>گیلان</option>
                    <option>خوزستان</option>
                    <option>آذربایجان شرقی</option>
                    <option>یزد</option>
                    <option>کرمان</option>
                    <option>بوشهر</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>شهر مقصد</label>
                  <select
                    id="checkout-city"
                    value={formData.city}
                    onChange={function (e) { handleInputChange('city', e.target.value); }}
                    className={styles.select}
                  >
                    <option>شیراز</option>
                    <option>مرودشت</option>
                    <option>کامفیروز</option>
                    <option>تهران</option>
                    <option>اصفهان</option>
                    <option>مشهد</option>
                    <option>کرج</option>
                    <option>سایر شهرها</option>
                  </select>
                </div>
              </div>

              {/* Postal Code field */}
              <div className={styles.formGroup}>
                <label
                  htmlFor="checkout-postal-code"
                  className={`${styles.label} ${errors.postalCode ? styles.labelError : ''}`}
                >
                  کد پستی (۱۰ رقم عددی)
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="checkout-postal-code"
                    type="text"
                    dir="ltr"
                    maxLength={10}
                    value={formData.postalCode}
                    onChange={function (e) { handleInputChange('postalCode', e.target.value); }}
                    placeholder="کد پستی ۱۰ رقمی خود را وارد کنید"
                    className={`${styles.input} ${errors.postalCode ? styles.inputError : ''}`}
                    autoComplete="postal-code"
                  />
                  <span className={styles.inputIcon}>
                    <Mail size={17} />
                  </span>
                </div>
                {errors.postalCode && (
                  <div className={styles.fieldError} id="checkout-postal-error">
                    <AlertCircle size={14} className={styles.fieldErrorIcon} />
                    <span>{errors.postalCode}</span>
                  </div>
                )}
              </div>

              {/* Full Address field */}
              <div className={styles.formGroup}>
                <label
                  htmlFor="checkout-full-address"
                  className={`${styles.label} ${errors.fullAddress ? styles.labelError : ''}`}
                >
                  آدرس دقیق پستی
                </label>
                <div className={styles.inputWrapper}>
                  <textarea
                    id="checkout-full-address"
                    rows={3}
                    value={formData.fullAddress}
                    onChange={function (e) { handleInputChange('fullAddress', e.target.value); }}
                    placeholder="خیابان، کوچه، پلاک، طبقه و واحد..."
                    className={`${styles.textarea} ${errors.fullAddress ? styles.inputError : ''}`}
                    autoComplete="street-address"
                  />
                </div>
                {errors.fullAddress && (
                  <div className={styles.fieldError} id="checkout-address-error">
                    <AlertCircle size={14} className={styles.fieldErrorIcon} />
                    <span>{errors.fullAddress}</span>
                  </div>
                )}
              </div>

              <div className={styles.btnRow}>
                <button
                  type="button"
                  onClick={function () {
                    setIsCheckoutOpen(false);
                    setIsCartOpen(true);
                  }}
                  className={styles.secondaryBtn}
                >
                  بازگشت به سبد
                </button>
                <button type="submit" className={styles.primaryBtn} id="checkout-step1-btn">
                  <span>مرحله بعد: بررسی اقلام</span>
                  <ArrowLeft size={16} />
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className={styles.form}>
              <h4 className={styles.sectionTitle}>
                <ShoppingBag size={18} />
                <span>بررسی اقلام انتخابی:</span>
              </h4>

              <ul className={styles.cartItemsList}>
                {cart.map(function (item) {
                  const unitP = Number(item.product?.price ?? 0);
                  const total = unitP * (item.quantity ?? 1);

                  return (
                    <li key={item.product?.id || item.product?._id} className={styles.cartReviewItem}>
                      <div>
                        <strong>{item.product?.name ?? 'برنج کامفیروزی'}</strong>
                        <div className={styles.variantText}>
                          تعداد: {(item.quantity ?? 1).toLocaleString('fa-IR')} کیسه نخی اعلا
                        </div>
                      </div>
                      <span className={styles.itemPrice}>{total.toLocaleString('fa-IR')} تومان</span>
                    </li>
                  );
                })}
              </ul>

              <div className={styles.addressSummary}>
                <div className={styles.addressSummaryTitle}>
                  <ShieldCheck size={16} />
                  <strong>خلاصه اطلاعات تحویل و نشانی:</strong>
                </div>
                <div>
                  <strong>تحویل‌گیرنده:</strong> {isLoggedIn ? (currentUser?.name || formData.recipientName) : formData.recipientName} ({isLoggedIn ? (currentUser?.phone || formData.phone) : formData.phone})
                </div>
                <div>
                  <strong>مقصد:</strong> {formData.province} - {formData.city}
                </div>
                <div>
                  <strong>کد پستی:</strong> <span dir="ltr">{formData.postalCode}</span>
                </div>
                <div>
                  <strong>نشانی پستی:</strong> {formData.fullAddress}
                </div>
              </div>

              <div className={styles.btnRow}>
                <button type="button" onClick={function () { setStep(1); }} className={styles.secondaryBtn}>
                  ویرایش آدرس
                </button>
                <button type="button" onClick={function () { setStep(3); }} className={styles.primaryBtn}>
                  <span>تایید و مرحله پرداخت</span>
                  <ArrowLeft size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.form}>
              <h4 className={styles.sectionTitle}>
                <CreditCard size={18} />
                <span>انتخاب روش پرداخت و ثبت نهایی:</span>
              </h4>

              <div className={styles.paymentList}>
                <label
                  onClick={function () { setFormData({ ...formData, paymentMethod: 'gateway' }); }}
                  className={`${styles.paymentOption} ${formData.paymentMethod === 'gateway' ? styles.paymentOptionActive : ''}`}
                >
                  <CreditCard size={22} className={styles.paymentMethodIcon} />
                  <div className={styles.paymentInfo}>
                    <strong>درگاه پرداخت آنلاین شتاب</strong>
                    <small>پرداخت امن بانکی با تمامی کارت‌های عضو شتاب</small>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'gateway'}
                    onChange={function () {}}
                  />
                </label>

                <label
                  onClick={function () { setFormData({ ...formData, paymentMethod: 'card' }); }}
                  className={`${styles.paymentOption} ${formData.paymentMethod === 'card' ? styles.paymentOptionActive : ''}`}
                >
                  <Building2 size={22} className={styles.paymentMethodIcon} />
                  <div className={styles.paymentInfo}>
                    <strong>کارت به کارت حساب طلا رایس</strong>
                    <small>واریز به کارت و ثبت تصویر فیش پرداخت بانکی</small>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'card'}
                    onChange={function () {}}
                  />
                </label>
              </div>

              {/* Card to card bank details and receipt upload */}
              {formData.paymentMethod === 'card' && (
                <div className={styles.cardTransferBox}>
                  <div className={styles.bankCardHeader}>
                    <Building2 size={16} />
                    <span>اطلاعات کارت جهت واریز وجه:</span>
                  </div>
                  <div className={styles.cardInfoRow}>
                    <span>شماره کارت:</span>
                    <strong dir="ltr" className={styles.cardDigits}>۶۰۳۷ - ۹۹۷۵ - ۱۲۳۴ - ۵۶۷۸</strong>
                  </div>
                  <div className={styles.cardInfoRow}>
                    <span>بنام:</span>
                    <strong>محمدرضا اسدی (طلا رایس) - بانک ملی</strong>
                  </div>

                  {/* Receipt Uploader */}
                  <div className={styles.receiptUploadContainer}>
                    <label className={styles.receiptUploadLabel}>
                      <ImageIcon size={16} />
                      <span>تصویر فیش واریزی (اختیاری):</span>
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleReceiptUpload}
                      style={{ display: 'none' }}
                    />
                    
                    {formData.receiptImage ? (
                      <div className={styles.receiptPreviewBox}>
                        <img src={formData.receiptImage} alt="رسید پرداخت" className={styles.receiptPreviewImg} />
                        <div className={styles.receiptActions}>
                          <span className={styles.receiptSuccessText}>فیش واریزی ضمیمه شد</span>
                          <button
                            type="button"
                            onClick={function () { handleInputChange('receiptImage', ''); }}
                            className={styles.removeReceiptBtn}
                          >
                            حذف تصویر
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={function () { fileInputRef.current?.click(); }}
                        className={styles.uploadBtn}
                      >
                        <Upload size={16} />
                        <span>انتخاب و بارگذاری تصویر فیش</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

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
                  <span>مبلغ قابل پرداخت:</span>
                  <strong>{(finalTotal ?? 0).toLocaleString('fa-IR')} تومان</strong>
                </div>
              </div>

              <div className={styles.btnRow}>
                <button
                  type="button"
                  onClick={function () { setStep(2); }}
                  className={styles.secondaryBtn}
                  disabled={isSubmitting}
                >
                  بازگشت
                </button>
                <button
                  type="button"
                  onClick={handleFinalPayment}
                  className={styles.primaryBtn}
                  id="checkout-pay-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className={styles.spinner} />
                      <span>در حال ثبت سفارش...</span>
                    </>
                  ) : (
                    <>
                      <span>پرداخت و ثبت نهایی</span>
                      <CheckCircle2 size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 4 && createdOrder && (
            <div className={styles.successBox}>
              <CheckCircle2 size={56} className={styles.successIcon} />
              <h3>سفارش شما با موفقیت در سیستم ثبت گردید!</h3>
              <p>کیسه‌های برنج معطر کامفیروزی در حال آماده‌سازی و ارسال به نشانی شما می‌باشند.</p>

              <div className={styles.orderSummaryCard}>
                <div className={styles.summaryItem}>
                  <span>شناسه سفارش:</span>
                  <div className={styles.orderIdBox}>
                    <strong dir="ltr">{createdOrder.id || createdOrder._id}</strong>
                    <button
                      type="button"
                      onClick={function () { handleCopyOrderId(createdOrder.id || createdOrder._id); }}
                      className={styles.copyBtn}
                      title="کپی شناسه"
                    >
                      {copiedId ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                {createdOrder.postTrackingCode ? (
                  <div className={styles.summaryItem}>
                    <span>کد رهگیری پستی:</span>
                    <strong dir="ltr" style={{ color: '#0d5336', letterSpacing: '1px' }}>
                      {createdOrder.postTrackingCode}
                    </strong>
                  </div>
                ) : null}

                <div className={styles.summaryItem}>
                  <span>وضعیت سفارش:</span>
                  <span className={styles.orderStateBadge}>در انتظار بررسی و ارسال</span>
                </div>

                <div className={styles.summaryItem}>
                  <span>مبلغ پرداختی:</span>
                  <strong>{((createdOrder.totalPrice ?? createdOrder.finalAmount) ?? 0).toLocaleString('fa-IR')} تومان</strong>
                </div>

                <div className={styles.summaryItem}>
                  <span>تحویل‌گیرنده:</span>
                  <span>{createdOrder.name || formData.recipientName}</span>
                </div>

                <div className={styles.summaryItem}>
                  <span>کد پستی:</span>
                  <span dir="ltr">{createdOrder.postalCode || formData.postalCode}</span>
                </div>

                <div className={styles.summaryItem}>
                  <span>نشانی پستی:</span>
                  <span>{createdOrder.address || formData.fullAddress}</span>
                </div>
              </div>

              <div className={styles.btnRow}>
                <button
                  type="button"
                  onClick={function () {
                    setIsCheckoutOpen(false);
                    setTimeout(function () {
                      setStep(1);
                      setCreatedOrder(null);
                      navigate('/');
                    }, 300);
                  }}
                  className={styles.secondaryBtn}
                >
                  بازگشت به فروشگاه
                </button>
                <button onClick={handleFinish} className={styles.primaryBtn}>
                  <span>مشاهده در پنل سفارش‌ها</span>
                  <ArrowLeft size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </aside>
  );
}

export default CheckoutModal;
