import client from './client';

function parseSlide(s) {
  if (!s) return null;
  return {
    id: String(s.id || s._id || `slide-${Date.now()}`),
    _id: String(s._id || s.id || `slide-${Date.now()}`),
    title: s.title || 'برنج کامفیروزی ممتاز طلا رایس',
    description: s.description || 'برنج اصیل و معطر کامفیروز مستقیم از شالیزار',
    subtitle: s.subtitle || 'پیشنهاد ویژه',
    image: s.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80',
    link: s.link || '/products',
    ctaText: s.ctaText || 'مشاهده تخفیف‌های امروز'
  };
}

export const slidersApi = {
  /**
   * Fetch home slider banners
   */
  async getSliders() {
    try {
      const response = await client.get('/slides');
      if (response && response.success && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data.map(parseSlide)
        };
      }
      return { success: false, data: [], message: 'خطا در دریافت بنرها' };
    } catch (err) {
      console.error('[slidersApi] Fetch slides error:', err.message || err);
      throw err;
    }
  },

  /**
   * Create new slide (Admin)
   */
  async createSlide(slideData) {
    try {
      const response = await client.post('/slides', slideData);
      if (response && response.success && response.data) {
        return {
          success: true,
          data: parseSlide(response.data),
          message: response.message || 'اسلاید جدید با موفقیت ایجاد شد.'
        };
      }
      return { success: false, message: 'خطا در ثبت اسلاید جدید.' };
    } catch (err) {
      console.error('[slidersApi] Create slide error:', err.message || err);
      throw err;
    }
  },

  /**
   * Delete slide (Admin)
   */
  async deleteSlide(id) {
    try {
      const response = await client.delete(`/slides/${id}`);
      return response || { success: true, message: 'اسلاید با موفقیت حذف شد.' };
    } catch (err) {
      console.error(`[slidersApi] Delete slide ${id} error:`, err.message || err);
      throw err;
    }
  }
};

export default slidersApi;
