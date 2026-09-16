// -------------------------------------------------------------
// Reviews API (/api/reviews) using Axios
// -------------------------------------------------------------
import axiosInstance, { getStoredToken } from './axios';
import { unwrapDoc } from './auth.api';

export function normalizeReview(raw) {
  if (!raw) return null;
  const r = unwrapDoc(raw);
  if (!r || typeof r !== 'object') return null;

  return {
    ...r,
    id: String(r._id || r.id || `rev-${Date.now()}`),
    _id: String(r._id || r.id || `rev-${Date.now()}`),
    productId: r.productId || r.product || '',
    userName: r.userName || r.name || r.user?.name || 'کاربر خریدار',
    comment: r.comment || r.text || '',
    rating: Number(r.rating || 5),
    createdAt: r.createdAt || new Date().toISOString(),
    reply: r.reply || r.adminReply || null
  };
}

export const reviewsApi = {
  /**
   * Get reviews for a product using GET /api/reviews?productId=... (Section 6)
   */
  async getByProductId(productId) {
    let rawList = [];
    try {
      const res = await axiosInstance.get(`/reviews?productId=${productId}`);
      const parsed = res?.data || res;
      if (Array.isArray(parsed)) {
        rawList = parsed;
      } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.data)) {
        rawList = parsed.data;
      }
    } catch (err) {
      console.warn('Error getting reviews:', err);
    }
    return rawList.map(normalizeReview).filter(Boolean);
  },

  /**
   * Post new review using POST /api/reviews (Section 6)
   */
  async create({ productId, comment, rating = 5 }) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axiosInstance.post('/reviews', {
      productId,
      comment: comment?.trim(),
      rating: Number(rating)
    }, { headers });
    return normalizeReview(res?.data || res);
  },

  /**
   * Admin: Reply to user review using POST /api/reviews/:id/reply (Section 6)
   */
  async reply(reviewId, text) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    // Support both direct string or object containing replyText/comment
    const cleanText = typeof text === 'object' ? (text.replyText || text.comment) : text;
    
    const res = await axiosInstance.post(`/reviews/${reviewId}/reply`, {
      replyText: cleanText?.trim(),
      comment: cleanText?.trim() // Safe fallback
    }, { headers });
    return unwrapDoc(res?.data || res);
  },

  /**
   * Admin: Delete review using DELETE /api/reviews/:id (Section 6)
   */
  async delete(reviewId) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return await axiosInstance.delete(`/reviews/${reviewId}`, { headers });
  }
};

export default reviewsApi;
