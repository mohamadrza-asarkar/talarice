import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Setup Multer for file uploads
const uploadDir = path.join(__dirname, 'uploads');
const slidesUploadDir = path.join(__dirname, 'public', 'uploads', 'slides');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(slidesUploadDir)) fs.mkdirSync(slidesUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.originalUrl.includes('/slides')) {
      cb(null, slidesUploadDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, uniqueSuffix + '-' + safeName);
  }
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static(uploadDir));
app.use('/public/uploads/slides', express.static(slidesUploadDir));

// --- In-Memory Models & Clean Initial State ---
// Users (Default Admin for direct login & testing)
let users = [
  {
    _id: 'user-admin',
    name: 'مدیر کل فروشگاه',
    email: 'admin@store.ir',
    phone: '09120000000',
    username: 'admin',
    password: 'admin', // or admin123456
    role: 'admin',
    createdAt: new Intl.DateTimeFormat('fa-IR').format(new Date())
  },
  {
    _id: 'user-sample',
    name: 'کاربر تستی',
    email: 'user@store.ir',
    phone: '09123456789',
    username: 'user',
    password: 'user123456',
    role: 'user',
    createdAt: new Intl.DateTimeFormat('fa-IR').format(new Date())
  }
];

// Clean empty database for direct manual user testing
let products = [];
let sliders = [];
let orders = [];
let posts = [];
let cart = {
  products: [],
  totalPrice: 0
};

// --- Helper Functions ---
const formatPersianDate = () => {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
};

// --- API Endpoints ---

// 1. Health & Docs
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'healthy', uptime: process.uptime(), time: new Date() });
});

app.get('/api/docs/openapi.json', (req, res) => {
  res.json({
    openapi: '3.0.0',
    info: { title: 'Rice Store RESTful API', version: '1.0.0' },
    paths: {
      '/api/products': { get: { summary: 'Get all products' }, post: { summary: 'Create product' } },
      '/api/products/search': { get: { summary: 'Search products with query' } },
      '/api/slides': { get: { summary: 'Get slides' }, post: { summary: 'Upload slide' } },
      '/api/cart': { get: { summary: 'Get cart' } },
      '/api/orders': { get: { summary: 'Get orders' }, post: { summary: 'Create order' } },
      '/api/reviews': { get: { summary: 'Get reviews' }, post: { summary: 'Create review' } },
      '/api/posts': { get: { summary: 'Get blog posts' }, post: { summary: 'Create post' } },
      '/api/auth/login': { post: { summary: 'Login' } }
    }
  });
});

// 2. File Upload
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'هیچ فایلی آپلود نشد' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: imageUrl });
});

// 3. Products Endpoints

// Search API (/api/products/search?q=...&category=...&isAvailable=...&minPrice=...&maxPrice=...&sortBy=...)
app.get('/api/products/search', (req, res) => {
  const { q = '', category, isAvailable, minPrice, maxPrice, sortBy } = req.query;
  let results = [...products];

  if (q.trim()) {
    const query = q.trim().toLowerCase();
    results = results.filter(p =>
      (p.name && p.name.toLowerCase().includes(query)) ||
      (p.description && p.description.toLowerCase().includes(query)) ||
      (p.category && p.category.toLowerCase().includes(query)) ||
      (p.origin && p.origin.toLowerCase().includes(query))
    );
  }

  if (category && category !== 'all') {
    results = results.filter(p => p.category === category);
  }

  if (isAvailable !== undefined && isAvailable !== '') {
    const avail = isAvailable === 'true';
    results = results.filter(p => p.isAvailable === avail);
  }

  if (minPrice) {
    results = results.filter(p => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    results = results.filter(p => p.price <= Number(maxPrice));
  }

  if (sortBy === 'price-asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'stock') {
    results.sort((a, b) => (b.countInStock || 0) - (a.countInStock || 0));
  } else if (sortBy === 'newest') {
    results.reverse();
  }

  res.json({
    success: true,
    statusCode: 200,
    message: `نتایج دریافت شد`,
    data: {
      query: q,
      totalResults: results.length,
      page: 1,
      limit: 50,
      products: results
    }
  });
});

// List Products with pagination & category filter
app.get('/api/products', (req, res) => {
  const { search, category, sortBy } = req.query;
  let list = [...products];

  if (search) {
    const s = search.toLowerCase();
    list = list.filter(p => 
      (p.name && p.name.toLowerCase().includes(s)) || 
      (p.category && p.category.toLowerCase().includes(s)) ||
      (p.origin && p.origin.toLowerCase().includes(s))
    );
  }

  if (category && category !== 'all') {
    list = list.filter(p => p.category === category);
  }

  if (sortBy === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  }

  res.json({ success: true, statusCode: 200, data: list, total: list.length });
});

// Single Product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p._id === req.params.id || p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'محصول یافت نشد' });
  }
  res.json({ success: true, data: product });
});

// Create Product (Admin)
app.post('/api/products', (req, res) => {
  const countInStock = Number(req.body.countInStock || req.body.stock || 0);
  const newProduct = {
    _id: 'prod-' + Date.now().toString().slice(-6),
    name: req.body.name || 'برنج اعلا',
    description: req.body.description || '',
    price: Number(req.body.price || 0),
    isAvailable: req.body.isAvailable !== undefined ? Boolean(req.body.isAvailable) : countInStock > 0,
    countInStock: countInStock,
    category: req.body.category || 'برنج اعلا',
    origin: req.body.origin || 'گیلان، ایران',
    weight: Number(req.body.weight || 10),
    image: req.body.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
    features: req.body.features || ['۱۰۰٪ خالص و یکدست', 'الک شده بدون خرده', 'پخت مجلسی و خوش‌طعم'],
    cookingTime: req.body.cookingTime || '۳۰ دقیقه',
    smellLevel: req.body.smellLevel || 'فوق‌العاده عالی',
    grainType: req.body.grainType || 'دانه بلند',
    reviews: []
  };
  products = [newProduct, ...products];
  res.json({ success: true, statusCode: 201, message: 'محصول با موفقیت ثبت شد', data: newProduct });
});

// Update Product (Admin)
app.put('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p._id === req.params.id || p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'محصول یافت نشد' });
  }
  const countInStock = req.body.countInStock !== undefined ? Number(req.body.countInStock) : (req.body.stock !== undefined ? Number(req.body.stock) : products[index].countInStock);
  const isAvailable = req.body.isAvailable !== undefined ? Boolean(req.body.isAvailable) : (countInStock > 0);

  products[index] = {
    ...products[index],
    ...req.body,
    countInStock,
    isAvailable,
    price: req.body.price !== undefined ? Number(req.body.price) : products[index].price
  };

  res.json({ success: true, message: 'محصول با موفقیت ویرایش شد', data: products[index] });
});

// Delete Product (Admin)
app.delete('/api/products/:id', (req, res) => {
  products = products.filter(p => p._id !== req.params.id && p.id !== req.params.id);
  res.json({ success: true, message: 'محصول با موفقیت حذف شد' });
});

// 4. Slides & Banners Endpoints
app.get('/api/slides', (req, res) => {
  res.json({ success: true, data: sliders });
});
app.get('/api/sliders', (req, res) => {
  res.json({ success: true, data: sliders });
});

app.post('/api/slides', upload.single('image'), (req, res) => {
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = `/public/uploads/slides/${req.file.filename}`;
  }
  const newSlide = {
    _id: 'slide-' + Date.now().toString().slice(-6),
    title: req.body.title || 'بنر ویژه فروشگاه',
    subtitle: req.body.subtitle || 'پیشنهاد ویژه مستقیم از شالیزار',
    image: imageUrl || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1600&q=80',
    link: req.body.link || '/catalog',
    createdAt: formatPersianDate()
  };
  sliders = [newSlide, ...sliders];
  res.json({ success: true, message: 'اسلاید با موفقیت اضافه شد', data: newSlide });
});
app.post('/api/sliders', (req, res) => {
  const newSlider = { _id: 'slide-' + Date.now().toString().slice(-6), createdAt: formatPersianDate(), ...req.body };
  sliders = [newSlider, ...sliders];
  res.json({ success: true, data: newSlider });
});

app.delete('/api/slides/:id', (req, res) => {
  sliders = sliders.filter(s => s._id !== req.params.id && s.id !== req.params.id);
  res.json({ success: true, message: 'اسلاید حذف شد' });
});
app.delete('/api/sliders/:id', (req, res) => {
  sliders = sliders.filter(s => s._id !== req.params.id && s.id !== req.params.id);
  res.json({ success: true, message: 'اسلاید حذف شد' });
});

// 5. Cart Endpoints
app.get('/api/cart', (req, res) => {
  res.json({ success: true, data: cart });
});

app.post('/api/cart/items', (req, res) => {
  const { productId, quantity = 1, weightKg = 10 } = req.body;
  const product = products.find(p => p._id === productId || p.id === productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'محصول یافت نشد' });
  }
  const existingIndex = cart.products.findIndex(i => (i.productId === productId || i.product?._id === productId) && i.weightKg === weightKg);
  if (existingIndex > -1) {
    cart.products[existingIndex].quantity += Number(quantity);
  } else {
    cart.products.push({ productId, product, quantity: Number(quantity), weightKg });
  }
  cart.totalPrice = cart.products.reduce((acc, item) => acc + ((item.product?.price || 0) * item.quantity), 0);
  res.json({ success: true, message: 'به سبد خرید اضافه شد', data: cart });
});

app.put('/api/cart/items/:productId', (req, res) => {
  const { quantity } = req.body;
  const item = cart.products.find(i => i.productId === req.params.productId);
  if (item) {
    item.quantity = Number(quantity);
    cart.totalPrice = cart.products.reduce((acc, it) => acc + ((it.product?.price || 0) * it.quantity), 0);
  }
  res.json({ success: true, data: cart });
});

app.delete('/api/cart/items/:productId', (req, res) => {
  cart.products = cart.products.filter(i => i.productId !== req.params.productId);
  cart.totalPrice = cart.products.reduce((acc, it) => acc + ((it.product?.price || 0) * it.quantity), 0);
  res.json({ success: true, data: cart });
});

app.delete('/api/cart', (req, res) => {
  cart = { products: [], totalPrice: 0 };
  res.json({ success: true, message: 'سبد خرید خالی شد' });
});

// 6. Orders Endpoints
app.get('/api/orders', (req, res) => {
  res.json({ success: true, data: orders });
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o._id === req.params.id || o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'سفارش پیدا نشد' });
  res.json({ success: true, data: order });
});

app.post('/api/orders', (req, res) => {
  const newOrder = {
    _id: 'ord-' + Date.now().toString().slice(-6),
    buyerName: req.body.buyerName || req.body.recipientName || 'خریدار محترم',
    address: req.body.address || req.body.fullAddress || 'آدرس ثبت شده',
    phone: req.body.phone || '09120000000',
    products: req.body.products || cart.products,
    totalPrice: Number(req.body.totalPrice || req.body.finalTotal || req.body.totalAmount || 0),
    status: req.body.status || 'processing',
    trackingCode: 'TRK-' + Math.floor(100000 + Math.random() * 900000),
    createdAt: formatPersianDate()
  };
  orders = [newOrder, ...orders];
  // Empty cart after order
  cart = { products: [], totalPrice: 0 };
  res.json({ success: true, statusCode: 201, message: 'سفارش شما با موفقیت ثبت شد', data: newOrder });
});

app.delete('/api/orders/:id', (req, res) => {
  orders = orders.filter(o => o._id !== req.params.id && o.id !== req.params.id);
  res.json({ success: true, message: 'سفارش حذف شد' });
});

// 7. Reviews Endpoints
app.get('/api/reviews', (req, res) => {
  const { productId } = req.query;
  if (productId) {
    const product = products.find(p => p._id === productId || p.id === productId);
    return res.json({ success: true, data: product?.reviews || [] });
  }
  const allReviews = products.flatMap(p => (p.reviews || []).map(r => ({ ...r, productId: p._id, productName: p.name })));
  res.json({ success: true, data: allReviews });
});

app.post('/api/reviews', (req, res) => {
  const { productId, sender, comment, rating = 5 } = req.body;
  const productIndex = products.findIndex(p => p._id === productId || p.id === productId);
  if (productIndex === -1) {
    return res.status(404).json({ success: false, message: 'محصول مربوط به نظر یافت نشد' });
  }
  const newReview = {
    _id: 'rev-' + Date.now().toString().slice(-6),
    sender: sender || 'کاربر سایت',
    comment: comment || '',
    rating: Number(rating),
    date: formatPersianDate()
  };
  if (!products[productIndex].reviews) products[productIndex].reviews = [];
  products[productIndex].reviews = [newReview, ...products[productIndex].reviews];
  res.json({ success: true, statusCode: 201, message: 'دیدگاه شما با موفقیت ثبت شد', data: newReview });
});

app.post('/api/products/:id/reviews', (req, res) => {
  const productIndex = products.findIndex(p => p._id === req.params.id || p.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ success: false, message: 'محصول یافت نشد' });
  }
  const newReview = {
    _id: 'rev-' + Date.now().toString().slice(-6),
    sender: req.body.sender || req.body.name || 'کاربر سایت',
    comment: req.body.comment || req.body.text || '',
    rating: Number(req.body.rating || 5),
    date: formatPersianDate()
  };
  if (!products[productIndex].reviews) products[productIndex].reviews = [];
  products[productIndex].reviews = [newReview, ...products[productIndex].reviews];
  res.json({ success: true, data: newReview });
});

app.delete('/api/reviews/:id', (req, res) => {
  products.forEach(p => {
    if (p.reviews) {
      p.reviews = p.reviews.filter(r => r._id !== req.params.id && r.id !== req.params.id);
    }
  });
  res.json({ success: true, message: 'دیدگاه حذف شد' });
});

// 8. Blog Posts Endpoints
app.get('/api/posts', (req, res) => {
  res.json({ success: true, data: posts });
});

app.post('/api/posts', (req, res) => {
  const newPost = {
    _id: 'post-' + Date.now().toString().slice(-6),
    title: req.body.title || 'مقاله جدید برنج',
    excerpt: req.body.excerpt || '',
    content: req.body.content || '',
    image: req.body.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
    createdAt: formatPersianDate()
  };
  posts = [newPost, ...posts];
  res.json({ success: true, statusCode: 201, message: 'مقاله ثبت شد', data: newPost });
});

app.delete('/api/posts/:id', (req, res) => {
  posts = posts.filter(p => p._id !== req.params.id && p.id !== req.params.id);
  res.json({ success: true, message: 'مقاله حذف شد' });
});

// 9. Auth Endpoints
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, mobile, password } = req.body;
  const userPhone = phone || mobile || '';
  const userEmail = email || (userPhone ? `${userPhone}@store.ir` : `user-${Date.now()}@store.ir`);
  
  const existing = users.find(u => (u.email && u.email === userEmail) || (u.phone && u.phone === userPhone));
  if (existing) {
    return res.status(400).json({ success: false, message: 'کاربری با این مشخصات قبلاً ثبت نام کرده است' });
  }

  const newUser = {
    _id: 'user-' + Date.now().toString().slice(-6),
    name: name || 'کاربر جدید',
    email: userEmail,
    phone: userPhone,
    password: password || '123456',
    role: 'user',
    createdAt: formatPersianDate()
  };
  users.push(newUser);
  const token = 'jwt-token-' + newUser._id;
  res.json({ success: true, message: 'ثبت نام با موفقیت انجام شد', token, user: newUser });
});

app.post('/api/auth/login', (req, res) => {
  const { email, phone, mobile, username, password } = req.body;
  const identifier = email || phone || mobile || username;

  // Master Admin direct credential check
  if ((identifier === 'admin' && password === 'admin') || 
      (identifier === 'admin@store.ir' && password === 'admin123456') ||
      (identifier === 'admin@store.ir' && password === 'admin')) {
    const adminUser = users.find(u => u.role === 'admin') || users[0];
    return res.json({
      success: true,
      message: 'ورود موفقیت‌آمیز مدیر کل',
      token: 'jwt-admin-token-secret-999',
      user: adminUser
    });
  }

  // Normal user match
  const user = users.find(u => 
    (u.email === identifier || u.phone === identifier || u.username === identifier) && 
    (u.password === password)
  );

  if (user) {
    return res.json({
      success: true,
      message: 'ورود موفقیت‌آمیز',
      token: 'jwt-token-' + user._id,
      user
    });
  }

  // Fast testing fallback for user@store.ir / user123456
  if (identifier === 'user@store.ir' && (password === 'user123456' || password === 'user')) {
    const normalUser = users.find(u => u.role === 'user') || users[1];
    return res.json({
      success: true,
      message: 'ورود موفقیت‌آمیز',
      token: 'jwt-user-token-123',
      user: normalUser
    });
  }

  res.status(401).json({ success: false, message: 'نام کاربری یا رمز عبور اشتباه است' });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'توکن احراز هویت الزامی است' });
  }
  if (authHeader.includes('admin')) {
    return res.json({ success: true, user: users[0] });
  }
  res.json({ success: true, user: users[1] || users[0] });
});

// 10. Admin Endpoints
app.get('/api/admin/dashboard', (req, res) => {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  res.json({
    success: true,
    data: {
      totalSales: orders.length,
      totalRevenue,
      totalUsers: users.length,
      totalProducts: products.length,
      totalSliders: sliders.length,
      pendingOrders: orders.filter(o => o.status === 'processing').length
    }
  });
});

app.get('/api/admin/users', (req, res) => {
  res.json({ success: true, data: users });
});

app.post('/api/admin/users', (req, res) => {
  const { name, email, phone, role = 'user', password = 'password123' } = req.body;
  const newUser = {
    _id: 'user-' + Date.now().toString().slice(-6),
    name: name || 'کاربر جدید',
    email: email || `${phone || Date.now()}@store.ir`,
    phone: phone || '',
    password,
    role,
    createdAt: formatPersianDate()
  };
  users.push(newUser);
  res.json({ success: true, message: 'کاربر جدید ثبت شد', data: newUser });
});

app.delete('/api/admin/users/:id', (req, res) => {
  if (req.params.id === 'user-admin') {
    return res.status(400).json({ success: false, message: 'امکان حذف مدیر اصلی وجود ندارد' });
  }
  users = users.filter(u => u._id !== req.params.id && u.id !== req.params.id);
  res.json({ success: true, message: 'کاربر حذف شد' });
});

app.put('/api/admin/users/:id/role', (req, res) => {
  const user = users.find(u => u._id === req.params.id || u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'کاربر یافت نشد' });
  user.role = req.body.role || (user.role === 'admin' ? 'user' : 'admin');
  res.json({ success: true, message: 'سطح دسترسی کاربر تغییر یافت', data: user });
});

app.get('/api/admin/orders', (req, res) => {
  res.json({ success: true, data: orders });
});

app.put('/api/admin/orders/:id/status', (req, res) => {
  const order = orders.find(o => o._id === req.params.id || o.id === req.params.id);
  if (order) {
    order.status = req.body.status || 'shipped';
    return res.json({ success: true, message: 'وضعیت سفارش بروزرسانی شد', data: order });
  }
  res.status(404).json({ success: false, message: 'سفارش یافت نشد' });
});

// Reset / Clear Data helper
app.post('/api/admin/reset-data', (req, res) => {
  products = [];
  sliders = [];
  orders = [];
  posts = [];
  cart = { products: [], totalPrice: 0 };
  res.json({ success: true, message: 'تمام داده‌های فروشگاه با موفقیت پاکسازی شدند' });
});

// Seed sample data helper for quick 1-click test if user wants
app.post('/api/admin/seed-data', (req, res) => {
  products = [
    {
      _id: 'prod-1',
      name: 'برنج طارم هاشمی درجه یک گیلان (کیسه ۱۰ کیلوگرمی)',
      description: 'برنج فوق‌العاده معطر و اعلا با پخت مجلسی، دانه‌های یکدست و ری‌کشی بی‌نظیر شالیزارهای گیلان.',
      price: 1350000,
      isAvailable: true,
      countInStock: 25,
      category: 'برنج اعلا',
      origin: 'گیلان، فریدونکنار',
      weight: 10,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
      reviews: []
    }
  ];
  sliders = [
    {
      _id: 'slide-1',
      title: 'عرضه مستقیم برنج تازه از شالیزار',
      subtitle: 'تضمین اصالت و پخت بی‌نظیر',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1600&q=80',
      link: '/catalog',
      createdAt: formatPersianDate()
    }
  ];
  res.json({ success: true, message: 'داده‌های نمونه اولیه اضافه شدند' });
});

// 11. Fallback for SPA
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`🌾 Rice Store Clean Backend Server running on port ${port}`);
});
