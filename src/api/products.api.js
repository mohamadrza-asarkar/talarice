// -------------------------------------------------------------
// Products API (/api/products)
// Native fetch implementation
// -------------------------------------------------------------
import { client } from './client';
import { unwrapDoc } from './auth.api';

export function normalizeProduct(raw) {
  if (!raw) return null;
  const p = unwrapDoc(raw);
  if (!p || typeof p !== 'object') return null;

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
}

export const productsApi = {
  /**
   * Get all products with optional filters
   */
  async getAll(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.sort) query.append('sort', params.sort);
    if (params.isAmazing) query.append('isAmazing', 'true');
    if (params.limit) query.append('limit', params.limit);
    
    const qs = query.toString();
    const endpoint = `/products${qs ? `?${qs}` : ''}`;
    const res = await client.get(endpoint);
    
    let rawList = [];
    if (Array.isArray(res)) rawList = res;
    else if (Array.isArray(res?.data)) rawList = res.data;
    else if (Array.isArray(res?.products)) rawList = res.products;
    else if (Array.isArray(res?.items)) rawList = res.items;

    const normalized = rawList.map(normalizeProduct).filter(Boolean);
    return {
      data: normalized,
      products: normalized,
      length: normalized.length,
      [Symbol.iterator]: function* () {
        for (const item of normalized) yield item;
      }
    };
  },

  getProducts(params = {}) {
    return this.getAll(params);
  },

  /**
   * Get single product by ID
   */
  async getById(id) {
    const res = await client.get(`/products/${id}`);
    const raw = res?.data || res?.product || res;
    return normalizeProduct(raw);
  },

  getProductById(id) {
    return this.getById(id);
  },

  /**
   * Get featured or amazing products
   */
  async getFeatured() {
    try {
      const res = await client.get('/products?featured=true');
      const list = Array.isArray(res) ? res : (res?.data || []);
      return list.map(normalizeProduct);
    } catch {
      return [];
    }
  },

  /**
   * Create a new product (Admin)
   */
  async create(productData) {
    const res = await client.post('/products', productData);
    const raw = res?.data || res?.product || res;
    return normalizeProduct(raw);
  },

  createProduct(productData) {
    return this.create(productData);
  },

  /**
   * Update product (Admin)
   */
  async update(id, productData) {
    const res = await client.put(`/products/${id}`, productData);
    const raw = res?.data || res?.product || res;
    return normalizeProduct(raw);
  },

  updateProduct(id, productData) {
    return this.update(id, productData);
  },

  /**
   * Delete product (Admin)
   */
  async delete(id) {
    return await client.delete(`/products/${id}`);
  },

  deleteProduct(id) {
    return this.delete(id);
  },

  /**
   * Add a review to a product
   */
  async addReview(productId, reviewData) {
    return await client.post(`/products/${productId}/reviews`, reviewData);
  }
};

export default productsApi;
