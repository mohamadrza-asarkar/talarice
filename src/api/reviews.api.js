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
   * Get reviews for a product using axios.get
   */
  async getByProductId(productId) {
    try {
      const res = await axiosInstance.get(`/reviews?productId=${productId}`);
      const list = Array.isArray(res) ? res : (res?.data || []);
      return list.map(normalizeReview).filter(Boolean);
    } catch {
      return [];
    }
  },

  /**
   * Post new review using axios.post with Token header
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
   * Admin: Reply to user review using axios.post with Token header
   */
  async reply(reviewId, comment) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axiosInstance.post(`/reviews/${reviewId}/reply`, {
      comment: comment?.trim()
    }, { headers });
    return unwrapDoc(res?.data || res);
  },

  /**
   * Admin: Delete review using axios.delete with Token header
   */
  async delete(reviewId) {
    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return await axiosInstance.delete(`/reviews/${reviewId}`, { headers });
  }
};

export default reviewsApi;
