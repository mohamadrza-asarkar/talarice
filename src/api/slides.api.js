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
      console.warn('Error fetching slides:', err);
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
    const res = await axiosInstance.get(`/slides/${id}`);
    const raw = res?.data || res?.slide || res;
    return normalizeSlide(raw);
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

    const res = await axiosInstance.post('/slides', formData, { headers });
    const raw = res?.data || res?.slide || res;
    return normalizeSlide(raw);
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

    const res = await axiosInstance.put(`/slides/${id}`, formData, { headers });
    const raw = res?.data || res?.slide || res;
    return normalizeSlide(raw);
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
    return await axiosInstance.delete(`/slides/${id}`, { headers });
  },

  deleteSlide(id) {
    return this.delete(id);
  }
};

export default slidesApi;
