import axios from './axios';

export const normalizeProduct = (raw) => {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw._doc ? { ...raw, ...raw._doc } : raw;
  const id = String(p._id || p.id || `prod-${Date.now()}`);
  const image = p.image || p.imageUrl || p.fullImageUrl || '/src/assets/images/white_rice_sack_1_1786553727373.jpg';
  const price = Number(p.price || p.originalPrice || 0);
  const originalPrice = Number(p.originalPrice || p.oldPrice || p.price || 0);
  const discountPercent = Number(p.discountPercent || p.dealDiscountPercent || 0);

  return {
    ...p,
    id,
    _id: id,
    name: p.name || p.title || 'برنج اصیل ایرانی',
    description: p.description || '',
    price,
    originalPrice,
    oldPrice: originalPrice,
    discountPercent,
    dealPrice: p.dealPrice || (discountPercent > 0 ? Math.round(originalPrice * (1 - discountPercent / 100)) : price),
    isAmazing: Boolean(p.isAmazing || discountPercent > 0),
    amazingExpiresAt: p.amazingExpiresAt || null,
    isAvailable: p.isAvailable !== false,
    stock: p.countInStock !== undefined ? p.countInStock : (p.stock !== undefined ? p.stock : 20),
    countInStock: p.countInStock !== undefined ? p.countInStock : (p.stock !== undefined ? p.stock : 20),
    weight: p.weight || '۱۰ کیلوگرم',
    category: p.category || 'kamfirouz',
    rating: p.rating || 4.9,
    reviewsCount: p.reviews?.length || p.reviewsCount || 12,
    image,
    imageUrl: image,
    fullImageUrl: image
  };
};

export const productsApi = {
  async getAll(params = {}) {
    try {
      const res = await axios.get('/products', { params });
      const rawList = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
      const normalized = rawList.map(normalizeProduct).filter(Boolean);
      return {
        data: normalized,
        products: normalized,
        pagination: res?.pagination || null
      };
    } catch (err) {
      console.warn('Products fetch notice:', err.message);
      return { data: [], products: [], pagination: null };
    }
  },

  async getById(id) {
    try {
      const res = await axios.get(`/products/${id}`);
      const raw = res?.data || res?.product || res;
      return normalizeProduct(raw);
    } catch (err) {
      console.warn(`Product ${id} fetch notice:`, err.message);
      return null;
    }
  },

  async getAmazingDeals() {
    try {
      const res = await axios.get('/products', { params: { isAmazing: true } });
      const rawList = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
      return rawList.map(normalizeProduct).filter(Boolean);
    } catch (err) {
      console.warn('Amazing deals fetch notice:', err.message);
      return [];
    }
  }
};

export default productsApi;
