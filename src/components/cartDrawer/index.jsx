import React, { useState } from 'react';
import { useApp } from '../../context';
import styles from './style.module.css';

export function CartDrawer() {
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

  function handleApplyCoupon(e) {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMessage({ success: res.success, text: res.message });
    if (res.success) setCouponInput('');
    setTimeout(function () { setCouponMessage(null); }, 3000);
  }

  function openCheckout() {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }

  return (
    <aside className={styles.overlay} onClick={function () { setIsCartOpen(false); }}>
      <section className={styles.drawer} onClick={function (e) { e.stopPropagation(); }}>
        <header className={styles.header}>
          <h3 className={styles.title}>
            <i className="fa-solid fa-cart-flatbed-suitcases" />
            <span>سبد خرید شما</span>
          </h3>
          <button onClick={function () { setIsCartOpen(false); }} className={styles.closeBtn} aria-label="بستن سبد خرید">
            <i className="fa-solid fa-xmark" />
          </button>
        </header>

        {!cart?.length ? (
          <div className={styles.emptyState}>
            <i className={`fa-solid fa-bag-shopping ${styles.emptyIcon}`} />
            <p>سبد خرید شما در حال حاضر خالی است.</p>
            <button onClick={function () { setIsCartOpen(false); }} className={styles.returnBtn}>
              بازگشت به فروشگاه
            </button>
          </div>
        ) : (
          <div className={styles.body}>
            <div className={styles.clearRow}>
              <span>{cart.length.toLocaleString('fa-IR')} کالا در سبد</span>
              <button onClick={clearCart} className={styles.clearBtn}>
                <i className="fa-solid fa-trash-arrow-up" />
                <span>خالی کردن</span>
              </button>
            </div>

            <ul className={styles.itemsList}>
              {cart.map(function (item) {
                const unitPrice = Number(item.product?.price ?? 0);
                const itemTotal = unitPrice * (item.quantity ?? 1);

                return (
                  <li key={item.product?.id || item.product?._id} className={styles.itemCard}>
                    <img src={item.product?.image} alt={item.product?.name} className={styles.itemImg} />
                    <div className={styles.itemInfo}>
                      <div className={styles.itemTop}>
                        <h4>{item.product?.name}</h4>
                        <button
                          onClick={function () { removeFromCart(item.product.id, item.weightKg); }}
                          className={styles.deleteBtn}
                          aria-label="حذف"
                        >
                          <i className="fa-solid fa-trash-can" />
                        </button>
                      </div>

                      <span className={styles.variant}>
                        بسته‌بندی گونی نخی ضد رطوبت
                      </span>

                      <div className={styles.itemBottom}>
                        <strong className={styles.itemPrice}>
                          {itemTotal.toLocaleString('fa-IR')} تومان
                        </strong>

                        <div className={styles.qtyControl}>
                          <button onClick={function () { updateQuantity(item.product.id, item.weightKg, item.quantity - 1); }}>-</button>
                          <span>{(item.quantity ?? 1).toLocaleString('fa-IR')}</span>
                          <button onClick={function () { updateQuantity(item.product.id, item.weightKg, item.quantity + 1); }}>+</button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className={styles.couponBox}>
              {appliedCoupon ? (
                <div className={styles.appliedCoupon}>
                  <span>کد تخفیف «{appliedCoupon.code}» اعمال شد</span>
                  <button onClick={removeCoupon}><i className="fa-solid fa-xmark" /></button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
                  <input
                    type="text"
                    placeholder="کد تخفیف..."
                    value={couponInput}
                    onChange={function (e) { setCouponInput(e.target.value); }}
                  />
                  <button type="submit">اعمال</button>
                </form>
              )}
              {couponMessage && (
                <small className={couponMessage.success ? styles.successMsg : styles.errorMsg}>
                  {couponMessage.text}
                </small>
              )}
            </div>

            <footer className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>جمع کل:</span>
                <span>{(cartSubtotal ?? 0).toLocaleString('fa-IR')} تومان</span>
              </div>
              {(discountAmount ?? 0) > 0 && (
                <div className={styles.discountRow}>
                  <span>تخفیف:</span>
                  <span>- {(discountAmount ?? 0).toLocaleString('fa-IR')} تومان</span>
                </div>
              )}
              <div className={styles.summaryRow}>
                <span>هزینه ارسال:</span>
                <span>{shippingFee === 0 ? 'رایگان' : `${(shippingFee ?? 0).toLocaleString('fa-IR')} تومان`}</span>
              </div>
              <div className={styles.totalRow}>
                <span>مبلغ نهایی:</span>
                <strong>{(finalTotal ?? 0).toLocaleString('fa-IR')} تومان</strong>
              </div>

              <button onClick={openCheckout} className={styles.checkoutBtn}>
                <span>تکمیل خرید و ثبت سفارش</span>
                <i className="fa-solid fa-arrow-left" />
              </button>
            </footer>
          </div>
        )}
      </section>
    </aside>
  );
}
