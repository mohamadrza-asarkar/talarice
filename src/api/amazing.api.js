// -------------------------------------------------------------
// Amazing Products API (/api/amazing-products)
// Section 3 of backend API Documentation
// -------------------------------------------------------------
import { client } from './client';
import { unwrapDoc } from './auth.api';
import { normalizeProduct } from './products.api';

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
    const candidateEndpoints = [
      `/amazing-products${qs ? `?${qs}` : ''}`,
      `/products/amazing${qs ? `?${qs}` : ''}`,
      `/products?isAmazing=true${qs ? `&${qs}` : ''}`
    ];

    let rawList = null;
    let lastErr = null;

    for (const ep of candidateEndpoints) {
      try {
        const res = await client.get(ep);
        if (Array.isArray(res)) {
          rawList = res;
          break;
        } else if (Array.isArray(res?.data)) {
          rawList = res.data;
          break;
        } else if (Array.isArray(res?.products)) {
          rawList = res.products;
          break;
        }
      } catch (err) {
        lastErr = err;
      }
    }

    if (!rawList) {
      if (lastErr && !lastErr.isNetworkError && lastErr.status !== 404) {
        throw lastErr;
      }
      return [];
    }

    return rawList.map(normalizeAmazingProduct).filter(Boolean);
  },

  /**
   * Create amazing product (Admin)
   */
  async create({ name, originalPrice, discountPercent, amazingExpiresAt, imageBase64, image }) {
    const payload = {
      name: name?.trim(),
      originalPrice: Number(originalPrice || 0),
      discountPercent: Number(discountPercent || 0),
      amazingExpiresAt: amazingExpiresAt || null,
      imageBase64: imageBase64 || image || ''
    };

    const endpoints = ['/amazing-products', '/products/amazing'];
    let res = null;
    let lastErr = null;

    for (const ep of endpoints) {
      try {
        res = await client.post(ep, payload);
        break;
      } catch (err) {
        lastErr = err;
      }
    }

    if (!res && lastErr) {
      throw lastErr;
    }

    const raw = res?.data || res?.product || res;
    return normalizeAmazingProduct(raw);
  },

  /**
   * Update amazing product (Admin)
   */
  async update(id, updateData) {
    const endpoints = [`/amazing-products/${id}`, `/products/amazing/${id}`];
    let res = null;
    let lastErr = null;

    for (const ep of endpoints) {
      try {
        res = await client.put(ep, updateData);
        break;
      } catch (err) {
        lastErr = err;
        try {
          res = await client.patch(ep, updateData);
          break;
        } catch (patchErr) {
          lastErr = patchErr;
        }
      }
    }

    if (!res && lastErr) {
      throw lastErr;
    }

    const raw = res?.data || res?.product || res;
    return normalizeAmazingProduct(raw);
  },

  /**
   * Delete amazing product (Admin)
   */
  async delete(id) {
    const endpoints = [`/amazing-products/${id}`, `/products/amazing/${id}`];
    let lastErr = null;

    for (const ep of endpoints) {
      try {
        return await client.delete(ep);
      } catch (err) {
        lastErr = err;
      }
    }

    throw lastErr;
  }
};

export default amazingProductsApi;
