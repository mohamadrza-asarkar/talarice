// -------------------------------------------------------------
// Slides & Banners API (/api/slides) using Axios
// -------------------------------------------------------------
import axiosInstance, { getStoredToken } from './axios';
import { unwrapDoc } from './auth.api';

export function normalizeSlide(raw) {
  if (!raw) return null;
  const s = unwrapDoc(raw);
  if (!s || typeof s !== 'object') return null;

  const id = String(s._id || s.id || `slide-${Date.now()}`);
  return {
    ...s,
    id,
    _id: id,
    title: s.title || s.name || 'عرضه مستقیم برنج اصیل',
    subtitle: s.subtitle || s.subTitle || 'از شالیزارهای کامفیروز فارس',
    description: s.description || s.desc || 'تضمین صد در صدی کیفیت، عطر و ری‌دهی مجلسی',
    image: s.image || s.imageUrl || s.fullImageUrl || '/src/assets/images/white_rice_sack_1_1786553727373.jpg',
    ctaText: s.ctaText || s.buttonText || 'مشاهده و خرید محصولات',
    link: s.link || s.url || '/products',
    category: s.category || 'all',
    isActive: s.isActive !== false,
    order: Number(s.order || s.priority || 0),
    createdAt: s.createdAt || new Date().toISOString()
  };
}

export const slidesApi = {
  /**
   * Get all active slides/banners using axios.get
   */
  async getAll(params = {}) {
    const candidateEndpoints = [
      '/slides',
      '/banners',
      '/sliders',
      '/admin/slides'
    ];

    let rawList = null;
    let lastError = null;

    for (const ep of candidateEndpoints) {
      try {
        const query = new URLSearchParams();
        if (params.category) query.append('category', params.category);
        const qs = query.toString();
        const fullEp = `${ep}${qs ? `?${qs}` : ''}`;

        const res = await axiosInstance.get(fullEp);
        if (Array.isArray(res)) {
          rawList = res;
          break;
        } else if (Array.isArray(res?.data)) {
          rawList = res.data;
          break;
        } else if (Array.isArray(res?.slides)) {
          rawList = res.slides;
          break;
        } else if (Array.isArray(res?.banners)) {
          rawList = res.banners;
          break;
        }
      } catch (err) {
        lastError = err;
      }
    }

    return (rawList || []).map(normalizeSlide).filter(Boolean);
  },

  getSlides(params = {}) {
    return this.getAll(params);
  },

  /**
   * Get single slide by ID using axios.get
   */
  async getById(id) {
    const res = await axiosInstance.get(`/slides/${id}`);
    const raw = res?.data || res?.slide || res;
    return normalizeSlide(raw);
  },

  /**
   * Create a new slide / banner (Admin) using axios.post with Token header
   */
  async create(slideData) {
    const payload = {
      title: slideData.title || '',
      subtitle: slideData.subtitle || '',
      description: slideData.description || '',
      image: slideData.image || slideData.imageUrl || slideData.imageBase64 || '',
      imageUrl: slideData.image || slideData.imageUrl || slideData.imageBase64 || '',
      imageBase64: slideData.imageBase64 || slideData.image || '',
      ctaText: slideData.ctaText || 'مشاهده و خرید محصولات',
      link: slideData.link || '/products',
      category: slideData.category || 'all',
      isActive: slideData.isActive !== false
    };

    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const endpoints = ['/slides', '/admin/slides', '/banners'];
    let res = null;
    let lastErr = null;

    for (const ep of endpoints) {
      try {
        res = await axiosInstance.post(ep, payload, { headers });
        break;
      } catch (err) {
        lastErr = err;
      }
    }

    if (!res && lastErr) {
      throw lastErr;
    }

    const raw = res?.data || res?.slide || res;
    return normalizeSlide(raw);
  },

  createSlide(slideData) {
    return this.create(slideData);
  },

  /**
   * Update slide (Admin) using axios.put/patch with Token header
   */
  async update(id, slideData) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const endpoints = [`/slides/${id}`, `/admin/slides/${id}`, `/banners/${id}`];
    let res = null;
    let lastErr = null;

    for (const ep of endpoints) {
      try {
        res = await axiosInstance.put(ep, slideData, { headers });
        break;
      } catch (err) {
        lastErr = err;
        try {
          res = await axiosInstance.patch(ep, slideData, { headers });
          break;
        } catch (patchErr) {
          lastErr = patchErr;
        }
      }
    }

    if (!res && lastErr) {
      throw lastErr;
    }

    const raw = res?.data || res?.slide || res;
    return normalizeSlide(raw);
  },

  updateSlide(id, slideData) {
    return this.update(id, slideData);
  },

  /**
   * Delete slide (Admin) using axios.delete with Token header
   */
  async delete(id) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const endpoints = [`/slides/${id}`, `/admin/slides/${id}`, `/banners/${id}`];
    let lastErr = null;

    for (const ep of endpoints) {
      try {
        return await axiosInstance.delete(ep, { headers });
      } catch (err) {
        lastErr = err;
      }
    }

    throw lastErr;
  },

  deleteSlide(id) {
    return this.delete(id);
  }
};

export default slidesApi;
