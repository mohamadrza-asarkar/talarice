import client from './client';
import { parseApiError } from '../utils/errorHandler';

function parseSlide(s, index = 0) {
  if (!s) return null;
  if (typeof s === 'string') {
    return {
      id: `slide-${index}`,
      _id: `slide-${index}`,
      title: '',
      description: '',
      subtitle: '',
      image: s,
      imageUrl: s,
      fullImageUrl: s,
      link: '/catalog',
      ctaText: 'مشاهده محصولات'
    };
  }

  const id = String(s._id || s.id || `slide-${index}`);
  const img = s.fullImageUrl || s.imageUrl || s.image || s.url || '';

  return {
    id,
    _id: id,
    title: s.title || '',
    description: s.description || '',
    subtitle: s.subtitle || '',
    image: img,
    imageUrl: img,
    fullImageUrl: img,
    link: s.link || '/catalog',
    ctaText: s.ctaText || 'مشاهده محصولات',
    createdAt: s.createdAt || ''
  };
}

export const slidersApi = {
  /**
   * Fetch all slides
   * GET /api/slides
   */
  async getSliders() {
    try {
      let response;
      try {
        response = await client.get('/slides');
      } catch (err) {
        // Fallback to /sliders if server uses /sliders
        if (err.statusCode === 404) {
          response = await client.get('/sliders');
        } else {
          throw err;
        }
      }

      let slides = [];
      if (Array.isArray(response)) {
        slides = response;
      } else if (Array.isArray(response?.data)) {
        slides = response.data;
      } else if (Array.isArray(response?.slides)) {
        slides = response.slides;
      } else if (Array.isArray(response?.data?.slides)) {
        slides = response.data.slides;
      } else if (Array.isArray(response?.sliders)) {
        slides = response.sliders;
      } else if (Array.isArray(response?.data?.sliders)) {
        slides = response.data.sliders;
      }

      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: slides.map(parseSlide).filter(Boolean),
        message: response?.message || 'اسلایدرها با موفقیت دریافت شدند'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Add new slide (Admin)
   * POST /api/slides
   * Body: { imageBase64 } or { image, title, description, link }
   */
  async addSlider(slideData) {
    try {
      const payload = {
        imageBase64: slideData.imageBase64 || (typeof slideData.image === 'string' && slideData.image.startsWith('data:') ? slideData.image : undefined),
        image: typeof slideData.image === 'string' ? slideData.image : undefined,
        title: slideData.title,
        description: slideData.description,
        link: slideData.link
      };

      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

      let response;
      try {
        response = await client.post('/slides', payload);
      } catch (err) {
        if (err.statusCode === 404) {
          response = await client.post('/sliders', payload);
        } else {
          throw err;
        }
      }

      const raw = response?.data?.slide || response?.data;
      return {
        success: true,
        statusCode: response?.statusCode || 201,
        data: parseSlide(raw),
        message: response?.message || 'اسلاید جدید با موفقیت ایجاد شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Delete slide (Admin)
   * DELETE /api/slides/:id
   */
  async deleteSlider(id) {
    try {
      let response;
      try {
        response = await client.delete(`/slides/${id}`);
      } catch (err) {
        if (err.statusCode === 404) {
          response = await client.delete(`/sliders/${id}`);
        } else {
          throw err;
        }
      }

      return {
        success: true,
        statusCode: response?.statusCode || 200,
        message: response?.message || 'اسلاید حذف گردید'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  }
};

export default slidersApi;
