import axios from './axios';

export const normalizeSlide = (raw) => {
  if (!raw || typeof raw !== 'object') return null;
  const s = raw._doc ? { ...raw, ...raw._doc } : raw;
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
    order: Number(s.order || s.priority || 0)
  };
};

export const slidesApi = {
  async getAll(params = {}) {
    try {
      const res = await axios.get('/slides', { params });
      const rawList = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
      return rawList.map(normalizeSlide).filter(Boolean);
    } catch (err) {
      console.warn('Slides fetch notice:', err.message);
      return [];
    }
  },

  async getById(id) {
    try {
      const res = await axios.get(`/slides/${id}`);
      const raw = res?.data || res?.slide || res;
      return normalizeSlide(raw);
    } catch (err) {
      console.warn(`Slide ${id} fetch notice:`, err.message);
      return null;
    }
  }
};

export default slidesApi;
