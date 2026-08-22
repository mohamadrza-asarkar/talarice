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
    cartSubtotal,
    setIsCheckoutOpen,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState(null);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput === 'TALA2026') {
      setAppliedCoupon({ code: 'TALA2026', discountPercent: 10 });
      setCouponMessage({ type: 'success', message: 'کد تخفیف اعمال شد!' });
    } else {
      setCouponMessage({ type: 'error', message: 'کد تخفیف نامعتبر است.' });
    }
    setCouponInput('');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponMessage(null);
  };

  const discountAmount = appliedCoupon
    ? (cartSubtotal * appliedCoupon.discountPercent) / 100
    : 0;

  const shippingFee = cartSubtotal > 1500000 ? 0 : 50000;
  const finalTotal = cartSubtotal - discountAmount + shippingFee;

  const clearCart = () => {
    cart.forEach(item => removeFromCart(item.product.id, item.weightKg));
  };

  if (!isCartOpen) return null;

  return (
    <div className={styles.drawerOverlay}>
      <div className={styles.drawerBackdrop} onClick={() => setIsCartOpen(false)} />
      <div className={styles.drawerContent}>
        <div className={styles.drawerHeader}>
          <div className={styles.headerTitleContainer}>
            <i className={`fa-solid fa-cart-flatbed-suitcases ${styles.headerIcon}`} />
            <h2 className={styles.headerTitle}>سبد خرید شما</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className={styles.closeButton}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className={styles.cartItemsContainer}>
          {cart.length === 0 ? (
            <div className={styles.emptyCartContainer}>
              <i className={`fa-solid fa-bag-shopping ${styles.emptyIcon}`} />
              <p className={styles.emptyText}>سبد خرید شما خالی است</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className={styles.shopNowButton}
              >
                بازگشت به فروشگاه
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const unitPrice = item.product.price * (item.weightKg / item.product.weight);
              return (
                <div
                  key={`${item.product.id}-${item.weightKg}`}
                  className={styles.cartItem}
                >
                  <div className={styles.itemImageWrapper}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className={styles.itemImage}
                    />
                    <span className={styles.itemWeightBadge}>
                      {item.weightKg.toLocaleString('fa-IR')}k
                    </span>
                  </div>
                  
                  <div className={styles.itemDetails}>
                    <div>
                      <h4 className={styles.itemName}>
                        {item.product.name}
                      </h4>
                      <span className={styles.itemVariant}>
                        کیسه {item.weightKg.toLocaleString('fa-IR')} کیلوگرمی
                      </span>
                    </div>
                    
                    <div className={styles.itemActions}>
                      <div className={styles.quantityControl}>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.weightKg, 1)}
                          className={styles.quantityBtn}
                        >
                          +
                        </button>
                        <span className={styles.quantityText}>
                          {item.quantity.toLocaleString('fa-IR')}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.weightKg, -1)}
                          className={styles.quantityBtn}
                        >
                          -
                        </button>
                      </div>
                      <div className={styles.priceInfo}>
                        <span className={styles.totalPrice}>
                          {(unitPrice * item.quantity).toLocaleString('fa-IR')}
                        </span>
                        <span className={styles.currencyLabel}>تومان</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.product.id, item.weightKg)}
                    className={styles.deleteBtn}
                    title="حذف از سبد"
                  >
                    <i className="fa-solid fa-trash-can" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className={styles.checkoutSection}>
            <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="کد تخفیف (مثلا: TALA2026)"
                className={styles.couponInput}
              />
              <button type="submit" className={styles.applyCouponBtn}>
                اعمال
              </button>
            </form>

            {couponMessage && (
              <div
                className={`${styles.couponMessage} ${
                  couponMessage.type === 'success' ? styles.couponSuccess : styles.couponError
                }`}
              >
                {couponMessage.message}
              </div>
            )}

            {appliedCoupon && (
              <div className={styles.activeCoupon}>
                <span className={styles.activeCouponText}>
                  کوپن {appliedCoupon.code} ({appliedCoupon.discountPercent}٪ تخفیف)
                </span>
                <button
                  onClick={removeCoupon}
                  className={styles.removeCouponBtn}
                >
                  حذف کوپن
                </button>
              </div>
            )}

            <div className={styles.summarySection}>
              <div className={styles.summaryRow}>
                <span>مجموع قیمت کیسه‌ها:</span>
                <span className={styles.summaryValueBold}>
                  {cartSubtotal.toLocaleString('fa-IR')} تومان
                </span>
              </div>
              
              {discountAmount > 0 && (
                <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                  <span>تخفیف شگفت‌انگیز:</span>
                  <span>- {discountAmount.toLocaleString('fa-IR')} تومان</span>
                </div>
              )}
              
              <div className={styles.summaryRow}>
                <span>هزینه بسته‌بندی و ارسال:</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className={styles.freeShipping}>رایگان</strong>
                  ) : (
                    `${shippingFee.toLocaleString('fa-IR')} تومان`
                  )}
                </span>
              </div>
              
              <div className={styles.finalTotalRow}>
                <span>مبلغ نهایی قابل پرداخت:</span>
                <span className={styles.finalTotalValue}>
                  {finalTotal.toLocaleString('fa-IR')} تومان
                </span>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button
                onClick={clearCart}
                className={styles.clearCartBtn}
                title="خالی کردن سبد"
              >
                <i className="fa-solid fa-trash-arrow-up" />
              </button>
              
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className={styles.checkoutBtn}
              >
                <span>تکمیل سفارش کیسه‌ها</span>
                <i className="fa-solid fa-arrow-left" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
