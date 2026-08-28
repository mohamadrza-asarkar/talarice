import client from './client';
import { initialCoupons } from '../data/mockData';

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
    } catch (err) {
      console.warn('[couponsApi] Fetch coupons server fallback:', err.message);
    }
    return {
      success: true,
      data: initialCoupons.map(parseCoupon)
    };
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
    } catch (err) {
      console.warn('[couponsApi] Validate coupon server fallback:', err.message);
    }

    // Local parsing fallback
    const found = initialCoupons.find(c => c.code.toUpperCase() === cleanCode);
    if (found) {
      const parsed = parseCoupon(found);
      const discountAmount = Math.round((cartTotal * parsed.discountPercent) / 100);
      return {
        success: true,
        coupon: parsed,
        discountAmount: discountAmount,
        message: `کد تخفیف ${parsed.discountPercent}٪ با موفقیت اعمال شد.`
      };
    }

    return {
      success: false,
      message: 'کد تخفیف وارد شده نامعتبر یا منقضی شده است.'
    };
  }
};

export default couponsApi;
