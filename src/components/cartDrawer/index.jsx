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
    
    const result = applyCoupon(couponInput);
    setCouponMessage({ type: result.success ? 'success' : 'error', text: result.message });
    if (result.success) setCouponInput('');
    
    setTimeout(() => setCouponMessage(null), 3000);
  };

  return (
    <div className={styles.drawerOverlay}>
      <div 
        className={styles.backdrop}
        onClick={() => setIsCartOpen(false)}
      ></div>
      
      <div className={styles.drawerWrapper}>
        <div className={styles.drawerContainer}>
          <div className={styles.drawerHeader}>
            <div className={styles.headerTitle}>
              <i className="fa-solid fa-cart-flatbed-suitcases" />
              <span>سبد خرید شما</span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className={styles.closeBtn}
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          <div className={styles.drawerContent}>
            {cart.length === 0 ? (
              <div className={styles.emptyCart}>
                <div className={styles.emptyIcon}>
                  <i className="fa-solid fa-bag-shopping" />
                </div>
                <p className={styles.emptyText}>سبد خرید شما در حال حاضر خالی است.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className={styles.returnBtn}
                >
                  بازگشت به فروشگاه
                </button>
              </div>
            ) : (
              <div className={styles.cartItemsWrapper}>
                <div className={styles.clearCartRow}>
                  <span className={styles.itemsCount}>{cart.length} کالا در سبد</span>
                  <button onClick={clearCart} className={styles.clearCartBtn}>
                    <i className="fa-solid fa-trash-arrow-up" />
                    خالی کردن
                  </button>
                </div>
                
                <div className={styles.itemsList}>
                  {cart.map((item) => (
                    <div key={`${item.product.id}-${item.weightKg}`} className={styles.cartItem}>
                      <div className={styles.itemImageWrapper}>
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className={styles.itemImage}
                        />
                      </div>
                      
                      <div className={styles.itemDetails}>
                        <div className={styles.itemTitleRow}>
                          <h4 className={styles.itemTitle}>{item.product.name}</h4>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.weightKg)}
                            className={styles.removeBtn}
                          >
                            <i className="fa-solid fa-trash-can" />
                          </button>
                        </div>
                        
                        <div className={styles.itemVariant}>
                          کیسه {(item.weightKg ?? 10).toLocaleString('fa-IR')} کیلویی
                        </div>
                        
                        <div className={styles.itemActionsRow}>
                          <div className={styles.priceDetails}>
                            {(
                              ((item.weightKg === (item.product?.weight || 10)
                                ? (item.product?.price || 0)
                                : Math.round(((item.product?.price || 0) / (item.product?.weight || 10)) * (item.weightKg || 10))) * (item.quantity || 1)) || 0
                            ).toLocaleString('fa-IR')} تومان
                          </div>
                          
                          <div className={styles.quantityControls}>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.weightKg, item.quantity - 1)}
                              className={styles.qtyBtn}
                            >
                              -
                            </button>
                            <span className={styles.qtyValue}>{(item.quantity ?? 1).toLocaleString('fa-IR')}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.weightKg, item.quantity + 1)}
                              className={styles.qtyBtn}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.couponSection}>
                  {appliedCoupon ? (
                    <div className={styles.appliedCoupon}>
                      <div className={styles.couponSuccess}>
                        <i className="fa-solid fa-check" />
                        <span>کد تخفیف «{appliedCoupon.code}» اعمال شد</span>
                      </div>
                      <button onClick={removeCoupon} className={styles.removeCouponBtn}>
                        <i className="fa-solid fa-xmark" />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
                      <input
                        type="text"
                        placeholder="کد تخفیف..."
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className={styles.couponInput}
                      />
                      <button type="submit" className={styles.couponBtn}>
                        اعمال
                      </button>
                    </form>
                  )}
                  {couponMessage && (
                    <p className={`${styles.couponMsg} ${couponMessage.type === 'success' ? styles.couponSuccessMsg : styles.couponErrorMsg}`}>
                      {couponMessage.text}
                    </p>
                  )}
                </div>

                <div className={styles.summarySection}>
                  <div className={styles.summaryRow}>
                    <span>جمع کل کالاها:</span>
                    <span>{(cartSubtotal || 0).toLocaleString('fa-IR')} تومان</span>
                  </div>
                  
                  {(discountAmount || 0) > 0 && (
                    <div className={styles.summaryRowDiscount}>
                      <span>تخفیف:</span>
                      <span>- {(discountAmount || 0).toLocaleString('fa-IR')} تومان</span>
                    </div>
                  )}
                  
                  <div className={styles.summaryRow}>
                    <span>هزینه ارسال:</span>
                    <span>{shippingFee === 0 ? 'رایگان' : `${(shippingFee || 0).toLocaleString('fa-IR')} تومان`}</span>
                  </div>
                  
                  <div className={styles.summaryTotalRow}>
                    <span>مبلغ قابل پرداخت:</span>
                    <span>{(finalTotal || 0).toLocaleString('fa-IR')} تومان</span>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className={styles.checkoutBtn}
                  >
                    تکمیل خرید و ثبت سفارش
                    <i className="fa-solid fa-arrow-left" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
