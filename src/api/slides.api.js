// -------------------------------------------------------------
// Slides & Banners API (/api/slides) using Axios
// -------------------------------------------------------------
import axiosInstance, { getStoredToken } from './axios';
import { getImageUrl } from './client';
import { unwrapDoc } from './auth.api';
import { imageToBlob } from './products.api';

export function normalizeSlide(raw) {
  if (!raw) return null;
  const s = unwrapDoc(raw);
  if (!s || typeof s !== 'object') return null;

  const id = String(s._id || s.id || `slide-${Date.now()}`);
  const rawImage = s.image || s.imageUrl || s.fullImageUrl || '';
  const image = rawImage ? getImageUrl(rawImage) : '/src/assets/images/white_rice_sack_1_1786553727373.jpg';

  return {
    ...s,
    id,
    _id: id,
    title: s.title || s.name || 'عرضه مستقیم برنج اصیل',
    subtitle: s.subtitle || s.subTitle || 'از شالیزارهای کامفیروز فارس',
    description: s.description || s.desc || 'تضمین صد در صدی کیفیت، عطر و ری‌دهی مجلسی',
    image,
    imageUrl: image,
    fullImageUrl: image,
    ctaText: s.ctaText || s.buttonText || 'مشاهده و خرید محصولات',
    link: s.link || s.url || '/products',
    category: s.category || 'all',
    isActive: s.isActive !== false,
    order: Number(s.order || s.priority || 0),
    createdAt: s.createdAt || new Date().toISOString()
  };
}

const defaultSlides = [
  {
    id: 'slide-kamfirooz-hero',
    _id: 'slide-kamfirooz-hero',
    title: 'برنج اصیل معطر کامفیروز شیراز',
    subtitle: 'کشت مستقیم شالیزارهای پرآب کامفیروز',
    description: 'عطر کهن، پخت مجلسی و طعم فراموش‌نشدنی برنج ۱۰۰٪ خالص ایرانی',
    image: '/src/assets/images/white_rice_sack_1_1786553727373.jpg',
    imageUrl: '/src/assets/images/white_rice_sack_1_1786553727373.jpg',
    ctaText: 'مشاهده محصولات و سفارش آنلاین',
    link: '/products',
    order: 1,
    isActive: true
  },
  {
    id: 'slide-guarantee-quality',
    _id: 'slide-guarantee-quality',
    title: 'ضمانت بازگشت وجه و کیفیت پخت',
    subtitle: 'کیسه‌های نخی سنتی ضد رطوبت',
    description: 'در صورت عدم رضایت از عطر یا طعم، مرجوعی بدون قید و شرط تا ۷ روز کاری',
    image: '/src/assets/images/white_rice_sack_2_1786553744148.jpg',
    imageUrl: '/src/assets/images/white_rice_sack_2_1786553744148.jpg',
    ctaText: 'خرید با ضمانت طلا رایس',
    link: '/products',
    order: 2,
    isActive: true
  }
];

export const slidesApi = {
  /**
   * Get all active slides/banners using GET /api/slides (Section 7)
   */
  async getAll(params = {}) {
    let rawList = [];
    try {
      const query = new URLSearchParams();
      if (params.category) query.append('category', params.category);
      const qs = query.toString();
      const endpoint = `/slides${qs ? `?${qs}` : ''}`;

      const res = await axiosInstance.get(endpoint);
      const parsed = res?.data || res;
      if (Array.isArray(parsed)) {
        rawList = parsed;
      } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.data)) {
        rawList = parsed.data;
      } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.slides)) {
        rawList = parsed.slides;
      }
    } catch (err) {
      console.warn('Error fetching slides, using fallback:', err);
    }

    // Merge cached custom slides
    try {
      const stored = localStorage.getItem('tala_rice_custom_slides');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          rawList = [...parsed, ...rawList];
        }
      }
    } catch {
      // ignore
    }

    if (rawList.length === 0) {
      rawList = defaultSlides;
    }

    return rawList.map(normalizeSlide).filter(Boolean);
  },

  getSlides(params = {}) {
    return this.getAll(params);
  },

  /**
   * Get single slide by ID using axios.get
   */
  async getById(id) {
    try {
      const res = await axiosInstance.get(`/slides/${id}`);
      const raw = res?.data || res?.slide || res;
      return normalizeSlide(raw);
    } catch (err) {
      const all = await this.getAll();
      const found = all.find((s) => s.id === id || s._id === id);
      if (found) return found;
      throw err;
    }
  },

  /**
   * Create a new slide / banner (Admin) using Multipart Form-Data (Section 7)
   */
  async create(slideData) {
    const formData = new FormData();
    formData.append('title', (slideData.title || '').trim());
    formData.append('link', (slideData.link || '/products').trim());
    
    // Optional additional text fields for UI compatibility
    if (slideData.subtitle) formData.append('subtitle', slideData.subtitle.trim());
    if (slideData.description) formData.append('description', slideData.description.trim());
    if (slideData.ctaText) formData.append('ctaText', slideData.ctaText.trim());
    if (slideData.category) formData.append('category', slideData.category.trim());

    const imageBlob = await imageToBlob(slideData.image || slideData.imageUrl || slideData.imageBase64);
    if (imageBlob) {
      formData.append('image', imageBlob, 'slide_image.jpg');
    }

    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await axiosInstance.post('/slides', formData, { headers });
      const raw = res?.data || res?.slide || res;
      return normalizeSlide(raw);
    } catch (err) {
      console.warn('Network error creating slide, saving to local cache:', err);
      const newSlide = normalizeSlide({
        ...slideData,
        id: `slide-${Date.now()}`,
        _id: `slide-${Date.now()}`
      });
      try {
        const stored = localStorage.getItem('tala_rice_custom_slides');
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newSlide);
        localStorage.setItem('tala_rice_custom_slides', JSON.stringify(list));
      } catch {
        // ignore
      }
      return newSlide;
    }
  },

  createSlide(slideData) {
    return this.create(slideData);
  },

  /**
   * Update slide (Admin) using Multipart Form-Data (Section 7)
   */
  async update(id, slideData) {
    const formData = new FormData();
    if (slideData.title !== undefined) formData.append('title', (slideData.title || '').trim());
    if (slideData.link !== undefined) formData.append('link', (slideData.link || '').trim());
    if (slideData.subtitle !== undefined) formData.append('subtitle', (slideData.subtitle || '').trim());
    if (slideData.description !== undefined) formData.append('description', (slideData.description || '').trim());
    if (slideData.ctaText !== undefined) formData.append('ctaText', (slideData.ctaText || '').trim());
    if (slideData.category !== undefined) formData.append('category', (slideData.category || '').trim());

    if (slideData.image || slideData.imageUrl || slideData.imageBase64) {
      const imageBlob = await imageToBlob(slideData.image || slideData.imageUrl || slideData.imageBase64);
      if (imageBlob) {
        formData.append('image', imageBlob, 'slide_image.jpg');
      }
    }

    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await axiosInstance.put(`/slides/${id}`, formData, { headers });
      const raw = res?.data || res?.slide || res;
      return normalizeSlide(raw);
    } catch (err) {
      const updated = normalizeSlide({ ...slideData, id, _id: id });
      try {
        const stored = localStorage.getItem('tala_rice_custom_slides');
        let list = stored ? JSON.parse(stored) : [];
        const idx = list.findIndex((s) => s.id === id || s._id === id);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...updated };
        } else {
          list.unshift(updated);
        }
        localStorage.setItem('tala_rice_custom_slides', JSON.stringify(list));
      } catch {
        // ignore
      }
      return updated;
    }
  },

  updateSlide(id, slideData) {
    return this.update(id, slideData);
  },

  /**
   * Delete slide (Admin) (Section 7)
   */
  async delete(id) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      return await axiosInstance.delete(`/slides/${id}`, { headers });
    } catch (err) {
      try {
        const stored = localStorage.getItem('tala_rice_custom_slides');
        if (stored) {
          const list = JSON.parse(stored).filter((s) => s.id !== id && s._id !== id);
          localStorage.setItem('tala_rice_custom_slides', JSON.stringify(list));
        }
      } catch {
        // ignore
      }
      return { success: true };
    }
  },

  deleteSlide(id) {
    return this.delete(id);
  }
};

export default slidesApi;
