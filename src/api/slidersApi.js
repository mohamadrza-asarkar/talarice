import client from './client';
import { initialHeroSlides } from '../data/mockData';

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
      if (response && response.success && Array.isArray(response.data) && response.data.length > 0) {
        return {
          success: true,
          data: response.data.map(parseSlide)
        };
      }
    } catch (err) {
      console.warn('[slidersApi] Fetch slides error:', err.message || err);
    }
    return {
      success: true,
      data: initialHeroSlides.map(parseSlide)
    };
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
    } catch (err) {
      console.warn('[slidersApi] Create slide error:', err.message || err);
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
      console.warn(`[slidersApi] Delete slide ${id} error:`, err.message || err);
      throw err;
    }
  }
};

export default slidersApi;
