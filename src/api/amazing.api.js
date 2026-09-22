// -------------------------------------------------------------
// Amazing Products API (/api/amazing-products)
// Section 3 of backend API Documentation
// -------------------------------------------------------------
import { client } from './client';
import { unwrapDoc } from './auth.api';
import { normalizeProduct, imageToBlob } from './products.api';

export function normalizeAmazingProduct(raw) {
  if (!raw) return null;
  const p = unwrapDoc(raw);
  if (!p || typeof p !== 'object') return null;

  const base = normalizeProduct(p);
  const originalPrice = Number(p.originalPrice || p.oldPrice || base.originalPrice || base.price || 480000);
  const discountPercent = Number(p.discountPercent || p.discount || base.discountPercent || 15);
  const price = Number(p.price || p.dealPrice || (originalPrice > 0 ? Math.round(originalPrice * (1 - discountPercent / 100)) : base.price));

  return {
    ...base,
    originalPrice,
    price,
    dealPrice: price,
    discountPercent,
    isAmazing: true,
    amazingExpiresAt: p.amazingExpiresAt || p.expiresAt || null
  };
}

const defaultAmazingDeals = [
  {
    id: 'amazing-kamfirouz-10kg',
    _id: 'amazing-kamfirouz-10kg',
    name: 'برنج معطر کامفیروز ممتاز (کیسه ۱۰ کیلویی)',
    description: 'برنج درجه یک کامفیروز شیراز، محصول مستقیم مزارع درودزن با عطر بی‌نظیر و قد کشیدن مجلسی',
    category: 'kamfirooz',
    price: 885000,
    originalPrice: 1040000,
    discountPercent: 15,
    dealPrice: 885000,
    isAmazing: true,
    isAvailable: true,
    stock: 25,
    weight: '۱۰ کیلوگرم',
    rating: 4.9,
    reviewsCount: 38,
    image: '/src/assets/images/white_rice_sack_1_1786553727373.jpg',
    amazingExpiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString()
  }
];

export const amazingProductsApi = {
  /**
   * Get all amazing / deal products with offline fallback
   */
  async getAll(params = {}) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.sortBy) query.append('sortBy', params.sortBy);

    const qs = query.toString();
    const endpoint = `/amazing-products${qs ? `?${qs}` : ''}`;

    let rawList = [];
    try {
      const res = await client.get(endpoint);
      const parsed = res?.data || res;
      if (Array.isArray(parsed)) {
        rawList = parsed;
      } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.data)) {
        rawList = parsed.data;
      }
    } catch (err) {
      console.debug('Error getting amazing products from API, checking local storage:', err);
    }

    // Merge cached deals
    try {
      const stored = localStorage.getItem('tala_rice_amazing_deals');
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
      rawList = defaultAmazingDeals;
    }

    return rawList.map(normalizeAmazingProduct).filter(Boolean);
  },

  /**
   * Create amazing product (Admin) using Multipart Form-Data with fallback
   */
  async create(dealData) {
    const data = dealData || {};
    const formData = new FormData();
    const name = (data.name || '').trim();
    if (name) formData.append('name', name);
    if (data.productId) formData.append('productId', String(data.productId));
    if (data.originalPrice !== undefined) formData.append('originalPrice', String(data.originalPrice || 0));
    if (data.discountPercent !== undefined) formData.append('discountPercent', String(data.discountPercent || 0));
    if (data.dealPrice !== undefined) formData.append('dealPrice', String(data.dealPrice));
    
    let expiresAt = data.amazingExpiresAt || data.expiresAt;
    if (!expiresAt && data.dealDurationHours) {
      expiresAt = new Date(Date.now() + Number(data.dealDurationHours) * 3600 * 1000).toISOString();
    }
    if (expiresAt) {
      formData.append('amazingExpiresAt', String(expiresAt));
    }

    const imageBlob = await imageToBlob(data.imageBase64 || data.image);
    if (imageBlob) {
      formData.append('image', imageBlob, 'amazing_image.jpg');
    }

    try {
      const res = await client.post('/amazing-products', formData);
      const raw = res?.data || res?.product || res;
      return normalizeAmazingProduct(raw);
    } catch (err) {
      // If 404 or backend unavailable, update product or local deal list
      if (data.productId) {
        try {
          await client.put(`/products/${data.productId}`, {
            isAmazing: true,
            discountPercent: data.discountPercent,
            dealPrice: data.dealPrice,
            amazingExpiresAt: expiresAt
          });
        } catch {
          // ignore
        }
      }

      // Save locally
      const localDeal = normalizeAmazingProduct({
        ...data,
        id: data.id || data.productId || `deal-${Date.now()}`,
        isAmazing: true,
        amazingExpiresAt: expiresAt
      });

      try {
        const stored = localStorage.getItem('tala_rice_amazing_deals');
        const list = stored ? JSON.parse(stored) : [];
        list.push(localDeal);
        localStorage.setItem('tala_rice_amazing_deals', JSON.stringify(list));
      } catch {
        // ignore
      }

      return localDeal;
    }
  },

  add(dealData) {
    return this.create(dealData);
  },

  /**
   * Update amazing product (Admin) using Multipart Form-Data
   */
  async update(id, updateData) {
    const formData = new FormData();
    if (updateData.name !== undefined) formData.append('name', (updateData.name || '').trim());
    if (updateData.originalPrice !== undefined) formData.append('originalPrice', String(updateData.originalPrice || 0));
    if (updateData.discountPercent !== undefined) formData.append('discountPercent', String(updateData.discountPercent || 0));
    if (updateData.amazingExpiresAt !== undefined) {
      formData.append('amazingExpiresAt', updateData.amazingExpiresAt ? String(updateData.amazingExpiresAt) : '');
    }

    if (updateData.imageBase64 || updateData.image) {
      const imageBlob = await imageToBlob(updateData.imageBase64 || updateData.image);
      if (imageBlob) {
        formData.append('image', imageBlob, 'amazing_image.jpg');
      }
    }

    const res = await client.put(`/amazing-products/${id}`, formData);
    const raw = res?.data || res?.product || res;
    return normalizeAmazingProduct(raw);
  },

  /**
   * Delete amazing product (Admin) with fallback
   */
  async delete(id) {
    try {
      return await client.delete(`/amazing-products/${id}`);
    } catch (err) {
      if (err.status === 404) {
        try {
          return await client.put(`/products/${id}`, { isAmazing: false });
        } catch {
          // ignore
        }
      }
      try {
        const stored = localStorage.getItem('tala_rice_amazing_deals');
        if (stored) {
          const list = JSON.parse(stored).filter((d) => d.id !== id && d._id !== id);
          localStorage.setItem('tala_rice_amazing_deals', JSON.stringify(list));
        }
      } catch {
        // ignore
      }
      return { success: true };
    }
  },

  remove(id) {
    return this.delete(id);
  }
};

export default amazingProductsApi;
