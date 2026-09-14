// -------------------------------------------------------------
// Reviews API (/api/reviews)
// Section 6 of backend API Documentation
// -------------------------------------------------------------
import { client } from './client';
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
   * Get reviews for a product
   */
  async getByProductId(productId) {
    try {
      const res = await client.get(`/reviews?productId=${productId}`);
      const list = Array.isArray(res) ? res : (res?.data || []);
      return list.map(normalizeReview).filter(Boolean);
    } catch {
      return [];
    }
  },

  /**
   * Post new review
   */
  async create({ productId, comment, rating = 5 }) {
    const res = await client.post('/reviews', {
      productId,
      comment: comment?.trim(),
      rating: Number(rating)
    });
    return normalizeReview(res?.data || res);
  },

  /**
   * Admin: Reply to user review
   */
  async reply(reviewId, comment) {
    const res = await client.post(`/reviews/${reviewId}/reply`, {
      comment: comment?.trim()
    });
    return unwrapDoc(res?.data || res);
  },

  /**
   * Admin: Delete review
   */
  async delete(reviewId) {
    return await client.delete(`/reviews/${reviewId}`);
  }
};

export default reviewsApi;
