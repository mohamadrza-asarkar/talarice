import client from './client';
import { parseApiError } from '../utils/errorHandler';

function parseProduct(p) {
  if (!p) return null;
  const price = typeof p.price === 'number' ? p.price : Number(p.price) || 0;
  const discount = typeof p.discount === 'number' ? p.discount : (typeof p.discountPercent === 'number' ? p.discountPercent : 0);
  const finalPrice = p.finalPrice ? Number(p.finalPrice) : (discount > 0 ? Math.round(price * (1 - discount / 100)) : price);
  const oldPrice = p.oldPrice ? Number(p.oldPrice) : (discount > 0 ? price : null);
  const stock = p.count !== undefined ? Number(p.count) : (p.countInStock !== undefined ? Number(p.countInStock) : (p.stock ?? 0));
  const inStock = p.isAvailable !== undefined ? Boolean(p.isAvailable) : (stock > 0);
  const image = p.fullImageUrl || p.imageUrl || p.image || (Array.isArray(p.images) ? p.images[0] : '');

  const id = String(p._id || p.id || '');
  const title = p.title || p.name || '';

  return {
    id,
    _id: id,
    title,
    name: title,
    description: p.description || '',
    price: discount > 0 && p.finalPrice ? finalPrice : price,
    rawPrice: price,
    oldPrice: oldPrice || (discount > 0 ? price : null),
    discount: discount,
    discountPercent: discount,
    finalPrice: finalPrice,
    stock: stock,
    count: stock,
    inStock: inStock,
    category: p.category || 'all',
    image: image,
    imageUrl: image,
    fullImageUrl: image,
    origin: p.origin || '',
    farmer: p.farmer || '',
    cookingRatio: p.cookingRatio || '',
    rating: Number(p.rating || 0),
    reviewCount: Number(p.numReviews || p.reviewCount || 0),
    numReviews: Number(p.numReviews || p.reviewCount || 0),
    gallery: Array.isArray(p.gallery) && p.gallery.length ? p.gallery : (image ? [image] : []),
    features: Array.isArray(p.features) ? p.features : [],
    cookingTime: p.cookingTime || '',
    smellLevel: p.smellLevel || '',
    grainType: p.grainType || '',
    isFeatured: Boolean(p.isFeatured || p.isAmazing),
    isAmazing: Boolean(p.isAmazing || p.isFeatured || p.isDeal),
    isDeal: Boolean(p.isDeal || p.isAmazing),
    createdAt: p.createdAt || ''
  };
}

export const productsApi = {
  /**
   * Fetch list of products with optional query parameters
   * GET /api/products
   */
  async getProducts(params = {}) {
    try {
      const response = await client.get('/products', { params });
      let productList = [];
      let pagination = null;

      if (response && response.success) {
        if (response.data?.products && Array.isArray(response.data.products)) {
          productList = response.data.products;
          pagination = response.data.pagination;
        } else if (Array.isArray(response.data)) {
          productList = response.data;
        }
      } else if (Array.isArray(response)) {
        productList = response;
      }

      const parsedProducts = productList.map(parseProduct).filter(Boolean);
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: parsedProducts,
        pagination: pagination,
        message: response?.message || 'لیست محصولات با موفقیت دریافت شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Fetch single product details by ID
   * GET /api/products/:id
   */
  async getProductById(id) {
    try {
      const response = await client.get(`/products/${id}`);
      let rawProd = null;
      if (response && response.success) {
        rawProd = response.data?.product || response.data;
      } else if (response && !response.success) {
        rawProd = response.data;
      } else {
        rawProd = response;
      }

      const parsed = parseProduct(rawProd);
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: parsed,
        product: parsed,
        message: response?.message || 'اطلاعات محصول دریافت شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Create new product (Admin)
   * POST /api/products
   */
  async createProduct(productData) {
    try {
      const payload = {
        title: productData.title || productData.name,
        name: productData.title || productData.name,
        description: productData.description || '',
        price: Number(productData.price || 0),
        discount: Number(productData.discount || productData.discountPercent || 0),
        count: Number(productData.count || productData.stock || 0),
        category: productData.category || 'all',
        imageBase64: productData.imageBase64 || (typeof productData.image === 'string' && productData.image.startsWith('data:') ? productData.image : undefined),
        image: typeof productData.image === 'string' ? productData.image : '',
        isAmazing: Boolean(productData.isAmazing || productData.isDeal)
      };

      const response = await client.post('/products', payload);
      const rawProd = response?.data?.product || response?.data;
      const parsed = parseProduct(rawProd);

      return {
        success: true,
        statusCode: response?.statusCode || 201,
        data: parsed,
        product: parsed,
        message: response?.message || 'محصول جدید با موفقیت ثبت شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Update product (Admin)
   * PUT /api/products/:id
   */
  async updateProduct(id, productData) {
    try {
      const payload = {
        title: productData.title || productData.name,
        name: productData.title || productData.name,
        description: productData.description,
        price: productData.price !== undefined ? Number(productData.price) : undefined,
        discount: productData.discount !== undefined ? Number(productData.discount) : (productData.discountPercent !== undefined ? Number(productData.discountPercent) : undefined),
        count: productData.count !== undefined ? Number(productData.count) : (productData.stock !== undefined ? Number(productData.stock) : undefined),
        category: productData.category,
        imageBase64: productData.imageBase64 || (typeof productData.image === 'string' && productData.image.startsWith('data:') ? productData.image : undefined),
        image: typeof productData.image === 'string' ? productData.image : undefined,
        isAmazing: productData.isAmazing !== undefined ? Boolean(productData.isAmazing) : undefined
      };

      // Clean undefined keys
      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

      const response = await client.put(`/products/${id}`, payload);
      const rawProd = response?.data?.product || response?.data;
      const parsed = parseProduct(rawProd);

      return {
        success: true,
        statusCode: response?.statusCode || 200,
        data: parsed,
        product: parsed,
        message: response?.message || 'محصول با موفقیت ویرایش شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  },

  /**
   * Delete product (Admin)
   * DELETE /api/products/:id
   */
  async deleteProduct(id) {
    try {
      const response = await client.delete(`/products/${id}`);
      return {
        success: true,
        statusCode: response?.statusCode || 200,
        message: response?.message || 'محصول با موفقیت حذف شد'
      };
    } catch (err) {
      const parsed = parseApiError(err);
      throw parsed;
    }
  }
};

export default productsApi;
