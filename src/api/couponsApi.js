import client from './client';

function parseCoupon(c) {
  if (!c) return null;
  return {
    code: String(c.code || '').toUpperCase(),
    discountPercent: Number(c.discountPercent || 0),
    title: c.title || `${c.discountPercent}% تخفیف ویژه`
  };
}

export const couponsApi = {
  /**
   * Fetch active discount coupons
   */
  async getCoupons() {
    try {
      const response = await client.get('/coupons');
      if (response && response.success && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data.map(parseCoupon)
        };
      }
      return { success: false, data: [], message: 'خطا در دریافت کدهای تخفیف' };
    } catch (err) {
      console.error('[couponsApi] Fetch coupons error:', err.message || err);
      throw err;
    }
  },

  /**
   * Validate coupon code against total cart amount
   */
  async validateCoupon(code, cartTotal = 0) {
    const cleanCode = String(code || '').trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'لطفاً کد تخفیف را وارد کنید.' };
    }

    try {
      const response = await client.post('/coupons/validate', { code: cleanCode, cartTotal });
      if (response && response.success && response.coupon) {
        return {
          success: true,
          coupon: parseCoupon(response.coupon),
          discountAmount: Number(response.discountAmount || Math.round((cartTotal * response.coupon.discountPercent) / 100)),
          message: response.message || `کد تخفیف ${response.coupon.discountPercent}٪ با موفقیت اعمال شد.`
        };
      }
      return { success: false, message: response.message || 'کد تخفیف وارد شده معتبر نمی‌باشد.' };
    } catch (err) {
      console.error('[couponsApi] Validate coupon error:', err.message || err);
      throw err;
    }
  }
};

export default couponsApi;
