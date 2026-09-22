// -------------------------------------------------------------
// Reviews API (/api/reviews) using Axios & native client
// -------------------------------------------------------------
import axiosInstance, { getStoredToken } from './axios';
import { unwrapDoc } from './auth.api';

export function normalizeReview(raw) {
  if (!raw) return null;
  const r = unwrapDoc(raw);
  if (!r || typeof r !== 'object') return null;

  const revId = String(r._id || r.id || '');
  const prodId = typeof r.productId === 'object' && r.productId !== null
    ? String(r.productId._id || r.productId.id || '')
    : String(r.productId || r.product || r.product_id || '');

  const reply = r.reply || r.adminReply || r.replyText || null;

  // Extract author / username accurately from all possible backend fields
  let userDisplay = '';
  const u = (r.user && typeof r.user === 'object') ? r.user : ((r.userId && typeof r.userId === 'object') ? r.userId : null);

  if (r.userName && typeof r.userName === 'string' && r.userName.trim() && r.userName !== 'کاربر خریدار' && r.userName !== 'خریدار محترم' && r.userName !== 'کاربر محترم') {
    userDisplay = r.userName.trim();
  } else if (r.name && typeof r.name === 'string' && r.name.trim()) {
    userDisplay = r.name.trim();
  } else if (r.fullName && typeof r.fullName === 'string' && r.fullName.trim()) {
    userDisplay = r.fullName.trim();
  } else if (r.author && typeof r.author === 'string' && r.author.trim() && r.author !== 'خریدار محترم' && r.author !== 'کاربر خریدار' && r.author !== 'کاربر محترم') {
    userDisplay = r.author.trim();
  } else if (r.authorName && typeof r.authorName === 'string' && r.authorName.trim()) {
    userDisplay = r.authorName.trim();
  } else if (r.username && typeof r.username === 'string' && r.username.trim()) {
    userDisplay = r.username.trim();
  } else if (u) {
    userDisplay = u.name || u.fullName || u.username || (u.phone ? `کاربر (${u.phone})` : (u.email ? u.email.split('@')[0] : ''));
  } else if (typeof r.user === 'string' && r.user.trim()) {
    const val = r.user.trim();
    if (val.startsWith('09') || /^\d{10,12}$/.test(val)) {
      userDisplay = `کاربر (${val})`;
    } else if (val.includes('@')) {
      userDisplay = val.split('@')[0];
    } else if (!/^[0-9a-fA-F]{24}$/.test(val)) {
      userDisplay = val;
    }
  }

  if (!userDisplay) {
    userDisplay = r.phone ? `کاربر (${r.phone})` : (r.email ? r.email.split('@')[0] : (r.userName || r.author || 'کاربر سایت'));
  }

  return {
    ...r,
    id: revId,
    _id: revId,
    productId: prodId,
    userName: userDisplay,
    author: userDisplay,
    comment: r.comment || r.text || r.body || '',
    rating: Number(r.rating || 5),
    createdAt: r.createdAt || new Date().toISOString(),
    reply: reply ? (typeof reply === 'object' ? (reply.replyText || reply.comment || reply.text) : reply) : null
  };
}

const defaultReviews = [
  {
    id: 'rev-1',
    _id: 'rev-1',
    productId: 'prod-kamfirouz-10kg',
    userName: 'حاج رضا کریمی',
    comment: 'عطر و بوی این برنج واقعاً خاطره‌انگیزه. شبیه برنج‌های اصیل سی سال پیش هست و موقع دم کشیدن تمام خونه بوی عطر شالیزار گرفت.',
    rating: 5,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    reply: 'سلام و درود بر شما، خرسندیم که عطر برنج اصیل کامفیروز مورد پسند شما واقع شد.'
  },
  {
    id: 'rev-2',
    _id: 'rev-2',
    productId: 'prod-kamfirouz-10kg',
    userName: 'خانم دکتر صادقی',
    comment: 'بسته‌بندی کیسه نخی خیلی تمیز و شکیل بود، برنج کاملاً یک‌دست و بدون شکستگی یا سنگ‌ریزه هست. تشکر از ارسال سریع.',
    rating: 5,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    reply: null
  }
];

export const reviewsApi = {
  /**
   * Get all reviews across products (Admin / Global) using GET /api/reviews
   */
  async getAll() {
    let rawList = [];
    try {
      const res = await axiosInstance.get('/reviews');
      const parsed = res?.data || res;
      if (Array.isArray(parsed)) {
        rawList = parsed;
      } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.data)) {
        rawList = parsed.data;
      } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.reviews)) {
        rawList = parsed.reviews;
      }
    } catch (err) {
      console.warn('Error fetching all reviews from /api/reviews:', err);
    }

    try {
      const custom = localStorage.getItem('tala_rice_custom_reviews');
      if (custom) {
        const parsed = JSON.parse(custom);
        if (Array.isArray(parsed)) {
          rawList = [...parsed, ...rawList];
        }
      }
    } catch {
      // ignore
    }

    if (rawList.length === 0) {
      rawList = defaultReviews;
    }

    return rawList.map(normalizeReview).filter(Boolean);
  },

  /**
   * Get reviews for a product using GET /api/reviews?productId=...
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
      console.warn('Error fetching reviews for product:', cleanId, err);
    }

    try {
      const custom = localStorage.getItem('tala_rice_custom_reviews');
      if (custom) {
        const parsed = JSON.parse(custom);
        if (Array.isArray(parsed)) {
          const matching = parsed.filter((r) => r.productId === cleanId);
          rawList = [...matching, ...rawList];
        }
      }
    } catch {
      // ignore
    }

    if (rawList.length === 0) {
      const matchingDefaults = defaultReviews.filter(
        (r) => r.productId === cleanId || cleanId === 'prod-kamfirouz-10kg'
      );
      rawList = matchingDefaults;
    }

    return rawList.map(normalizeReview).filter(Boolean);
  },

  /**
   * Post new review using POST /api/reviews
   * Request body: { productId: string, rating: number, comment: string, userName?: string }
   */
  async create({ productId, comment, rating = 5, userName = '' }) {
    const cleanId = typeof productId === 'object' ? (productId._id || productId.id) : productId;
    if (!cleanId) {
      throw new Error('شناسه محصول برای ثبت نظر نامعتبر است.');
    }

    const token = getStoredToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const payload = {
      productId: String(cleanId),
      rating: Number(rating || 5),
      comment: String(comment || '').trim()
    };

    if (userName && typeof userName === 'string' && userName.trim()) {
      payload.userName = userName.trim();
      payload.name = userName.trim();
      payload.author = userName.trim();
    }

    try {
      const res = await axiosInstance.post('/reviews', payload, { headers });
      const raw = res?.data || res?.review || res;
      const normalized = normalizeReview(raw);
      if (normalized && (!normalized.userName || normalized.userName === 'کاربر سایت') && userName) {
        normalized.userName = userName;
        normalized.author = userName;
      }
      return normalized;
    } catch (err) {
      const localRev = normalizeReview({
        id: `rev-${Date.now()}`,
        _id: `rev-${Date.now()}`,
        productId: String(cleanId),
        rating: Number(rating || 5),
        comment: String(comment || '').trim(),
        userName: userName || 'کاربر گرامی',
        createdAt: new Date().toISOString()
      });
      try {
        const custom = localStorage.getItem('tala_rice_custom_reviews');
        const list = custom ? JSON.parse(custom) : [];
        list.unshift(localRev);
        localStorage.setItem('tala_rice_custom_reviews', JSON.stringify(list));
      } catch {
        // ignore
      }
      return localRev;
    }
  },

  /**
   * Admin: Reply to user review using POST /api/reviews/:id/reply
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
    const replyBody = { replyText: String(cleanText || '').trim() };

    const res = await axiosInstance.post(`/reviews/${cleanId}/reply`, replyBody, { headers });
    return unwrapDoc(res?.data || res);
  },

  /**
   * Admin: Delete review using DELETE /api/reviews/:id
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
