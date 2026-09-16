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
  return {
    ...base,
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
      console.debug('Error getting amazing products:', err);
    }

    return rawList.map(normalizeAmazingProduct).filter(Boolean);
  },

  /**
   * Create amazing product (Admin) using Multipart Form-Data
   */
  async create({ name, originalPrice, discountPercent, amazingExpiresAt, imageBase64, image }) {
    const formData = new FormData();
    formData.append('name', (name || '').trim());
    formData.append('originalPrice', String(originalPrice || 0));
    formData.append('discountPercent', String(discountPercent || 0));
    if (amazingExpiresAt) {
      formData.append('amazingExpiresAt', String(amazingExpiresAt));
    }

    const imageBlob = await imageToBlob(imageBase64 || image);
    if (imageBlob) {
      formData.append('image', imageBlob, 'amazing_image.jpg');
    }

    const res = await client.post('/amazing-products', formData);
    const raw = res?.data || res?.product || res;
    return normalizeAmazingProduct(raw);
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
  }
};

export default amazingProductsApi;
