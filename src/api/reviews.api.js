// -------------------------------------------------------------
// Reviews API (/api/reviews) using Axios
// -------------------------------------------------------------
import axiosInstance, { getStoredToken } from './axios';
import { unwrapDoc } from './auth.api';

export function normalizeReview(raw) {
  if (!raw) return null;
  const r = unwrapDoc(raw);
  if (!r || typeof r !== 'object') return null;

  const revId = String(r._id || r.id || `rev-${Date.now()}`);
  const prodId = typeof r.productId === 'object' && r.productId !== null
    ? String(r.productId._id || r.productId.id || '')
    : String(r.productId || r.product || '');

  const reply = r.reply || r.adminReply || r.replyText || null;

  return {
    ...r,
    id: revId,
    _id: revId,
    productId: prodId,
    userName: r.userName || r.name || r.user?.name || (typeof r.user === 'string' ? r.user : 'کاربر خریدار'),
    author: r.userName || r.name || r.user?.name || 'خریدار محترم',
    comment: r.comment || r.text || '',
    rating: Number(r.rating || 5),
    createdAt: r.createdAt || new Date().toISOString(),
    reply: reply ? (typeof reply === 'object' ? (reply.replyText || reply.comment || reply.text) : reply) : null
  };
}

export const reviewsApi = {
  /**
   * Get all reviews across products (Admin / Global) using GET /api/reviews (Section 6)
   */
  async getAll() {
    try {
      const res = await axiosInstance.get('/reviews');
      const parsed = res?.data || res;
      let rawList = [];
      if (Array.isArray(parsed)) {
        rawList = parsed;
      } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.data)) {
        rawList = parsed.data;
      } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.reviews)) {
        rawList = parsed.reviews;
      }
      return rawList.map(normalizeReview).filter(Boolean);
    } catch (err) {
      console.warn('Error fetching all reviews:', err);
      return [];
    }
  },

  /**
   * Get reviews for a product using GET /api/reviews?productId=... (Section 6)
   */
  async getByProductId(productId) {
    if (!productId) return [];
    const cleanId = typeof productId === 'object' ? (productId._id || productId.id) : productId;
    if (!cleanId) return [];

    let rawList = [];
    try {
      const res = await axiosInstance.get(`/reviews?productId=${encodeURIComponent(cleanId)}`);
      const parsed = res?.data || res;
      if (Array.isArray(parsed)) {
        rawList = parsed;
      } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.data)) {
        rawList = parsed.data;
      } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.reviews)) {
        rawList = parsed.reviews;
      }
    } catch (err) {
      console.warn('Error getting reviews for product:', cleanId, err);
    }
    return rawList.map(normalizeReview).filter(Boolean);
  },

  /**
   * Post new review using POST /api/reviews (Section 6)
   * Request body: { productId: string, rating: number, comment: string }
   */
  async create({ productId, comment, rating = 5 }) {
    const cleanId = typeof productId === 'object' ? (productId._id || productId.id) : productId;
    if (!cleanId) {
      throw new Error('شناسه محصول برای ثبت نظر نامعتبر است.');
    }

    const token = getStoredToken();
    if (!token) {
      throw new Error('برای ثبت نظر، ابتدا باید وارد حساب کاربری خود شوید.');
    }
    const headers = { Authorization: `Bearer ${token}` };

    const payload = {
      productId: String(cleanId),
      rating: Number(rating || 5),
      comment: String(comment || '').trim()
    };

    const res = await axiosInstance.post('/reviews', payload, { headers });
    const raw = res?.data || res?.review || res;
    return normalizeReview(raw);
  },

  /**
   * Admin: Reply to user review using POST /api/reviews/:id/reply (Section 6)
   * Request body: { replyText: string }
   */
  async reply(reviewId, text) {
    const cleanId = typeof reviewId === 'object' ? (reviewId._id || reviewId.id) : reviewId;
    if (!cleanId) {
      throw new Error('شناسه نظر نامعتبر است.');
    }

    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const cleanText = typeof text === 'object' ? (text.replyText || text.comment || text.text) : text;
    
    const res = await axiosInstance.post(`/reviews/${cleanId}/reply`, {
      replyText: String(cleanText || '').trim()
    }, { headers });
    return unwrapDoc(res?.data || res);
  },

  /**
   * Admin: Delete review using DELETE /api/reviews/:id (Section 6)
   */
  async delete(reviewId) {
    const cleanId = typeof reviewId === 'object' ? (reviewId._id || reviewId.id) : reviewId;
    if (!cleanId) {
      throw new Error('شناسه نظر نامعتبر است.');
    }

    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return await axiosInstance.delete(`/reviews/${cleanId}`, { headers });
  }
};

export default reviewsApi;
