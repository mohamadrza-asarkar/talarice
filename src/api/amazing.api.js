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

export const amazingProductsApi = {
  /**
   * Get all amazing / deal products
   */
  async getAll(params = {}) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.sortBy) query.append('sortBy', params.sortBy);

    const qs = query.toString();
    const endpoint = `/amazing-products${qs ? `?${qs}` : ''}`;

    const res = await client.get(endpoint);
    const parsed = res;
    let rawList = [];
    if (parsed && typeof parsed === 'object') {
      if (Array.isArray(parsed.data)) {
        rawList = parsed.data;
      } else if (Array.isArray(parsed.products)) {
        rawList = parsed.products;
      } else if (Array.isArray(parsed)) {
        rawList = parsed;
      }
    } else if (Array.isArray(parsed)) {
      rawList = parsed;
    }

    return rawList.map(normalizeAmazingProduct).filter(Boolean);
  },

  /**
   * Create amazing product (Admin) using Multipart Form-Data
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

    const res = await client.post('/amazing-products', formData);
    const raw = res?.data || res?.product || res;
    return normalizeAmazingProduct(raw);
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
   * Delete amazing product (Admin)
   */
  async delete(id) {
    return await client.delete(`/amazing-products/${id}`);
  },

  remove(id) {
    return this.delete(id);
  }
};

export default amazingProductsApi;
