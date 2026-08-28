import client from './client';

function parseSlide(s, index = 0) {
  if (!s) return null;
  
  // If s is a string (direct image URL)
  if (typeof s === 'string') {
    return {
      id: `slide-${index}`,
      _id: `slide-${index}`,
      title: '',
      description: '',
      subtitle: '',
      image: s,
      link: '/catalog',
      ctaText: 'مشاهده محصولات'
    };
  }
  
  // Otherwise, if s is an object
  return {
    id: String(s.id || s._id || `slide-${index}`),
    _id: String(s._id || s.id || `slide-${index}`),
    title: s.title || '',
    description: s.description || '',
    subtitle: s.subtitle || '',
    image: s.image || s.url || s.imageUrl || '',
    link: s.link || '/catalog',
    ctaText: s.ctaText || 'مشاهده محصولات'
  };
}

export const slidersApi = {
  /**
   * Fetch home slider banners
   */
  async getSliders() {
    try {
      const response = await client.get('/slides');
      
      // Case 1: Backend returns direct array of URLs or slide objects
      if (Array.isArray(response)) {
        return {
          success: true,
          data: response.map((item, idx) => parseSlide(item, idx))
        };
      }
      
      // Case 2: Backend returns standard { success: true, data: [...] } wrapper
      if (response && response.success && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data.map((item, idx) => parseSlide(item, idx))
        };
      }
      
      // Case 3: Backend returns { success: true } but with raw array of urls as response.data
      if (response && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data.map((item, idx) => parseSlide(item, idx))
        };
      }
      
      // Case 4: Single string or object slide
      if (response && (typeof response === 'string' || response.image)) {
        return {
          success: true,
          data: [parseSlide(response, 0)]
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
