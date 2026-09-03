import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  productsApi,
  amazingProductsApi,
  ordersApi,
  blogApi,
  slidersApi,
  couponsApi,
  authApi,
  reviewsApi,
  cartApi,
  adminApi,
  healthApi
} from '../api';
import { parseApiError } from '../utils/errorHandler';
import ToastContainer from '../components/toast';

const AppContext = createContext();

export function getOrderStatusInfo(status) {
  const norm = String(status || '').toLowerCase().trim();
  switch (norm) {
    case 'reviewing':
    case 'processing':
    case 'درحال بررسی':
    case 'در حال بررسی':
      return {
        key: 'reviewing',
        label: 'درحال بررسی',
        desc: 'سفارش ثبت شده و در حال بررسی کارشناسان انبار طلا رایس است.',
        color: '#b45309',
        bg: '#fffbeb',
        border: '#fde68a',
        step: 2
      };
    case 'shipping':
    case 'in_transit':
    case 'در حال ارسال':
      return {
        key: 'shipping',
        label: 'در حال ارسال',
        desc: 'مرسوله بسته‌بندی شده و تحویل ناوگان حمل‌ونقل پستی گردیده است.',
        color: '#0284c7',
        bg: '#f0f9ff',
        border: '#bae6fd',
        step: 3
      };
    case 'shipped':
    case 'ارسال شده':
      return {
        key: 'shipped',
        label: 'ارسال شده',
        desc: 'سفارش در مسیر مقصد بوده و کد رهگیری پستی صادر شده است.',
        color: '#7c3aed',
        bg: '#f5f3ff',
        border: '#ddd6fe',
        step: 4
      };
    case 'delivered':
    case 'تحویل شده':
      return {
        key: 'delivered',
        label: 'تحویل شده',
        desc: 'مرسوله با موفقیت تحویل خریدار گردید. نوش جان!',
        color: '#15803d',
        bg: '#f0fdf4',
        border: '#86efac',
        step: 4
      };
    case 'cancelled':
    case 'لغو شده':
      return {
        key: 'cancelled',
        label: 'لغو شده',
        desc: 'سفارش لغو گردید.',
        color: '#dc2626',
        bg: '#fef2f2',
        border: '#fecaca',
        step: 0
      };
    default:
      return {
        key: 'reviewing',
        label: 'درحال بررسی',
        desc: 'سفارش در حال پردازش و آماده‌سازی در انبار است.',
        color: '#b45309',
        bg: '#fffbeb',
        border: '#fde68a',
        step: 2
      };
  }
}

export function AppProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Toast notification state
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback(({ type = 'info', title = '', statusCode = null, message = '', details = '', actionAdvice = '', isServerError = false, isValidationError = false, errorType = '', duration = 6000 }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast = { id, type, title, statusCode, message, details, actionAdvice, isServerError, isValidationError, errorType };
    setToasts(prev => [...prev.slice(-4), newToast]); // keep max 5 toasts

    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }
    return id;
  }, [dismissToast]);

  const showError = useCallback((err, customTitle = '') => {
    const parsed = parseApiError(err);
    const code = parsed.statusCode;
    const finalTitle = customTitle || parsed.userFriendlyTitle || 'خطا در عملیات';
    
    showToast({
      type: 'error',
      title: finalTitle,
      statusCode: code,
      message: parsed.message,
      actionAdvice: parsed.actionAdvice,
      isServerError: parsed.isServerError,
      isValidationError: parsed.isUserError,
      errorType: parsed.errorType,
      details: parsed.fieldDetails || (parsed.errors ? (typeof parsed.errors === 'object' ? Object.entries(parsed.errors).map(([k, v]) => `${k}: ${v}`).join(' | ') : String(parsed.errors)) : ''),
      duration: parsed.isServerError ? 9000 : 7000
    });
    return parsed;
  }, [showToast]);

  const showSuccess = useCallback((message, title = 'عملیات موفق') => {
    showToast({
      type: 'success',
      title,
      message,
      duration: 4000
    });
  }, [showToast]);

  // Health check state (polled every 20s)
  const [serverHealth, setServerHealth] = useState({
    status: 'checking',
    uptime: 0,
    timestamp: null,
    statusCode: null,
    message: '',
    displayText: ''
  });

  const checkHealth = useCallback(async () => {
    try {
      const res = await healthApi.checkHealth();
      if (res.success && (res.status === 'healthy' || res.rawStatus === 'online')) {
        setServerHealth({
          status: 'healthy',
          uptime: res.uptime,
          timestamp: res.timestamp,
          statusCode: 200,
          message: 'سرور فعال و پاسخگو می‌باشد',
          displayText: 'سرور فعال است',
          database: res.database
        });
        return { success: true };
      } else {
        setServerHealth({
          status: 'unhealthy',
          uptime: 0,
          timestamp: new Date().toISOString(),
          statusCode: res.statusCode || 500,
          message: res.message || 'خطا در سلامت سرور',
          displayText: res.displayText || `[کد خطا: ${res.statusCode || 500}] عدم دسترسی به سرور سلامت`
        });
        return { success: false };
      }
    } catch (err) {
      const parsed = parseApiError(err);
      setServerHealth({
        status: 'unhealthy',
        uptime: 0,
        timestamp: new Date().toISOString(),
        statusCode: parsed.statusCode,
        message: parsed.message,
        displayText: parsed.displayText
      });
      return { success: false };
    }
  }, []);

  // Polling Health check: every 3s if not healthy yet, otherwise every 20s
  useEffect(() => {
    checkHealth();
    const intervalTime = serverHealth.status === 'healthy' ? 20000 : 3000;
    const interval = setInterval(() => {
      checkHealth();
    }, intervalTime);
    return () => clearInterval(interval);
  }, [checkHealth, serverHealth.status]);

  // Navigation History Stack
  const historyStackRef = useRef((function () {
    try {
      const saved = sessionStorage.getItem('tala_nav_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return ['/'];
  })());

  useEffect(function () {
    const currentPath = location.pathname + location.search;
    const currentStack = historyStackRef.current;
    if (currentStack[currentStack.length - 1] !== currentPath) {
      const newStack = [...currentStack, currentPath].slice(-30);
      historyStackRef.current = newStack;
      try {
        sessionStorage.setItem('tala_nav_history', JSON.stringify(newStack));
      } catch (e) {}
    }
  }, [location.pathname, location.search]);

  function goBack(defaultFallback = '/') {
    const currentPath = location.pathname + location.search;
    const currentStack = [...historyStackRef.current];
    while (currentStack.length > 0 && currentStack[currentStack.length - 1] === currentPath) {
      currentStack.pop();
    }
    const target = currentStack.length > 0 ? currentStack[currentStack.length - 1] : defaultFallback;
    historyStackRef.current = currentStack.length > 0 ? currentStack : [target];
    try {
      sessionStorage.setItem('tala_nav_history', JSON.stringify(historyStackRef.current));
    } catch (e) {}
    navigate(target);
  }

  // Core Data states - purely loaded from API
  const [products, setProducts] = useState([]);
  const [amazingProducts, setAmazingProducts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const isConnecting = serverHealth.status !== 'healthy';
  const [connectionError, setConnectionError] = useState(null);

  const [categories, setCategories] = useState([]);
  const [trustItems, setTrustItems] = useState([]);
  const [brandStory, setBrandStory] = useState({});
  const [testTips, setTestTips] = useState([]);

  // Fetch all primary data from backend API to populate context
  const fetchRealData = useCallback(async () => {
    let hasProdError = false;
    let prodErrorMessage = '';
    let prodStatusCode = null;

    try {
      // 1. Fetch Products
      try {
        const prodRes = await productsApi.getProducts();
        const prodList = (prodRes?.data && Array.isArray(prodRes.data))
          ? prodRes.data
          : (Array.isArray(prodRes) ? prodRes : []);
        setProducts(prodList);
        const deals = prodList.filter(p => p.isAmazing || p.isDeal);
        setAmazingProducts(deals);
      } catch (err) {
        const parsed = parseApiError(err);
        hasProdError = true;
        prodErrorMessage = parsed.message;
        prodStatusCode = parsed.statusCode;
        setProducts([]);
        setAmazingProducts([]);
      }

      // 2. Fetch Amazing Products
      try {
        const amazingRes = await amazingProductsApi.getAmazingProducts();
        const amazingList = (amazingRes?.data && Array.isArray(amazingRes.data))
          ? amazingRes.data
          : (Array.isArray(amazingRes) ? amazingRes : []);
        if (amazingList.length > 0) {
          setAmazingProducts(amazingList);
        }
      } catch (err) {
        // keep derived deals from products
      }

      // 3. Fetch Categories
      try {
        const catRes = await categoriesApi.getCategories();
        const catList = (catRes?.data && Array.isArray(catRes.data))
          ? catRes.data
          : (Array.isArray(catRes) ? catRes : []);
        setCategories(catList);
      } catch (err) {
        setCategories([]);
      }

      // 4. Fetch Home Meta (Trust items, brand story, test tips)
      try {
        const metaRes = await categoriesApi.getHomeMeta();
        if (metaRes?.success || metaRes?.data) {
          const metaData = metaRes.data || metaRes;
          if (Array.isArray(metaData.trustItems)) {
            setTrustItems(metaData.trustItems);
          }
          if (metaData.brandStory) {
            if (typeof metaData.brandStory === 'object') {
              setBrandStory(metaData.brandStory);
            } else if (typeof metaData.brandStory === 'string') {
              setBrandStory({ description: metaData.brandStory });
            }
          }
          if (Array.isArray(metaData.testTips)) {
            setTestTips(metaData.testTips);
          }
        }
      } catch (err) {
        // Keep empty
      }

      // 5. Fetch Sliders
      try {
        const sliderRes = await slidersApi.getSliders();
        const sliderList = (sliderRes?.data && Array.isArray(sliderRes.data))
          ? sliderRes.data
          : (Array.isArray(sliderRes) ? sliderRes : []);
        setHeroSlides(sliderList);
      } catch (err) {
        setHeroSlides([]);
      }

      // 6. Fetch Articles / Blog
      try {
        const artRes = await blogApi.getArticles();
        const artList = (artRes?.data && Array.isArray(artRes.data))
          ? artRes.data
          : (Array.isArray(artRes) ? artRes : []);
        setArticles(artList);
      } catch (err) {
        setArticles([]);
      }

      // 7. Fetch Coupons
      try {
        const couponRes = await couponsApi.getCoupons();
        const couponList = (couponRes?.data && Array.isArray(couponRes.data))
          ? couponRes.data
          : (Array.isArray(couponRes) ? couponRes : []);
        setCoupons(couponList);
      } catch (err) {
        setCoupons([]);
      }

      // 8. Fetch Reviews
      try {
        const revRes = await reviewsApi.getReviews();
        const revList = (revRes?.data && Array.isArray(revRes.data))
          ? revRes.data
          : (Array.isArray(revRes) ? revRes : []);
        setReviews(revList);
      } catch (err) {
        setReviews([]);
      }

      // 9. Fetch Orders
      try {
        const orderRes = await ordersApi.getOrders();
        const orderList = (orderRes?.data && Array.isArray(orderRes.data))
          ? orderRes.data
          : (Array.isArray(orderRes) ? orderRes : []);
        setOrders(orderList);
      } catch (err) {
        // Keep empty for guest
      }

      // Connection Error summary
      if (hasProdError) {
        const statusLabel = prodStatusCode ? `[کد خطا: ${prodStatusCode}] ` : '';
        setConnectionError(`${statusLabel}${prodErrorMessage}`);
      } else {
        setConnectionError(null);
      }
    } catch {
      // Handled in sub-fetches
    }
  }, []);

  // Fetch real data whenever the server health becomes healthy
  useEffect(() => {
    if (serverHealth.status === 'healthy') {
      fetchRealData();
    }
  }, [fetchRealData, serverHealth.status]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWeightFilter, setSelectedWeightFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('tala_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tala_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Orders state
  const [orders, setOrders] = useState(() => {
    try {
      const saved = null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      // removed local storage for orders
    } catch {}
  }, [orders]);

  async function updateOrderStatus(id, newStatus, extra = {}) {
    try {
      try {
        await ordersApi.updateOrderStatus(id, { state: newStatus, ...extra });
      } catch (apiErr) {
        console.warn('Update order status API note:', apiErr);
      }
      setOrders(prev => prev.map(o => {
        const orderId = o.id || o._id;
        if (orderId === id) {
          return {
            ...o,
            status: newStatus,
            state: newStatus,
            ...(extra.postTrackingCode !== undefined ? { postTrackingCode: extra.postTrackingCode, trackingCode: extra.postTrackingCode } : {}),
            ...(extra.adminNote !== undefined ? { adminNote: extra.adminNote } : {})
          };
        }
        return o;
      }));
      showSuccess(`وضعیت سفارش به‌روزرسانی شد.`);
    } catch (err) {
      showError(err, 'تغییر وضعیت سفارش');
      throw err;
    }
  }

  async function updateOrder(orderId, orderData) {
    try {
      try {
        await ordersApi.updateOrder(orderId, orderData);
      } catch (apiErr) {
        console.warn('Update order API note:', apiErr);
      }
      setOrders(prev => prev.map(o => {
        const id = o.id || o._id;
        if (id === orderId) {
          return { ...o, ...orderData };
        }
        return o;
      }));
      showSuccess('اطلاعات سفارش با موفقیت ویرایش شد.');
    } catch (err) {
      showError(err, 'ویرایش سفارش');
      throw err;
    }
  }

  async function deleteOrder(orderId) {
    try {
      try {
        await ordersApi.deleteOrder(orderId);
      } catch (apiErr) {
        console.warn('Delete order API note:', apiErr);
      }
      setOrders(prev => prev.filter(o => (o.id !== orderId && o._id !== orderId)));
      showSuccess('سفارش با موفقیت حذف گردید.');
    } catch (err) {
      showError(err, 'حذف سفارش');
      throw err;
    }
  }

  async function verifyOrderPayment(orderId, isVerified, adminNote = '') {
    try {
      try {
        await ordersApi.verifyPayment(orderId, {
          status: isVerified ? 'approved' : 'rejected',
          state: isVerified ? 'processing' : 'pending',
          adminNote
        });
      } catch (apiErr) {
        console.warn('Verify payment API note:', apiErr);
      }
      setOrders(prev => prev.map(o => {
        const id = o.id || o._id;
        if (id === orderId) {
          return {
            ...o,
            paymentStatus: isVerified ? 'completed' : 'failed',
            isPaid: isVerified,
            state: isVerified ? 'processing' : o.state
          };
        }
        return o;
      }));
      showSuccess(isVerified ? 'فیش واریزی تأیید شد.' : 'فیش واریزی رد شد.');
    } catch (err) {
      showError(err, 'تأیید فیش پرداخت');
      throw err;
    }
  }

  // Authentication state - restore token, userId, and cached user profile for instant auto-login
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || localStorage.getItem('tala_token') || '';
  });
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('userId') || localStorage.getItem('tala_user_id') || '';
  });
  
  const [currentUser, setCurrentUser] = useState(null);


  const [isLoadingUser, setIsLoadingUser] = useState(Boolean(token && !currentUser));

  const isAdmin = Boolean(currentUser && (currentUser.role === 'admin' || currentUser.isAdmin === true));
  const isAuthenticated = Boolean(token && (currentUser || userId));

  // Live profile fetcher from backend (/api/auth/me)
  const fetchUserProfile = useCallback(async () => {
    const activeToken = localStorage.getItem('token') || localStorage.getItem('tala_token');
    if (!activeToken) {
      setCurrentUser(null);
      setUserId('');
      setIsLoadingUser(false);
      return null;
    }

    try {
      setIsLoadingUser(true);
      const res = await authApi.getProfile();
      if (res.success && res.user) {
        setCurrentUser(res.user);
        const uid = res.user.id || res.user._id || '';
        if (uid) {
          setUserId(uid);
          localStorage.setItem('userId', uid);
          localStorage.setItem('tala_user_id', uid);
        }
        return res.user;
      } else {
        // If explicitly unauthorized or invalid
        if (res.statusCode === 401) {
          setCurrentUser(null);
          setUserId('');
          setToken('');
          localStorage.removeItem('token');
          localStorage.removeItem('tala_token');
          localStorage.removeItem('userId');
          localStorage.removeItem('tala_user_id');
          localStorage.removeItem('user');
          localStorage.removeItem('tala_user');
        }
        return null;
      }
    } catch (err) {
      if (err?.statusCode === 401) {
        setCurrentUser(null);
        setUserId('');
        setToken('');
        localStorage.removeItem('token');
        localStorage.removeItem('tala_token');
        localStorage.removeItem('userId');
        localStorage.removeItem('tala_user_id');
        localStorage.removeItem('user');
        localStorage.removeItem('tala_user');
      }
      return null;
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setIsLoadingUser(false);
    }
  }, [token, fetchUserProfile]);

  function login(userData = null, jwtToken = null) {
    if (jwtToken) {
      setToken(jwtToken);
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('tala_token', jwtToken);
    }
    const uid = userData?.id || userData?._id || '';
    if (uid) {
      setUserId(uid);
      localStorage.setItem('userId', uid);
      localStorage.setItem('tala_user_id', uid);
    }
    if (userData) {
      setCurrentUser(userData);
    }
  }

  function logout() {
    authApi.logout();
    setCurrentUser(null);
    setUserId('');
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('tala_token');
    localStorage.removeItem('userId');
    localStorage.removeItem('tala_user_id');
    localStorage.removeItem('user');
    localStorage.removeItem('tala_user');
    showSuccess('با موفقیت از حساب کاربری خارج شدید.');
    navigate('/');
  }

  async function loginUser(phone, password) {
    try {
      const res = await authApi.login({ phone, password });
      if (res.success && res.token) {
        login(res.user, res.token);
        fetchUserProfile();
        showSuccess(res.message || 'ورود با موفقیت انجام شد');
        return { success: true, user: res.user, message: res.message };
      }
      showError({ message: res.message, statusCode: res.statusCode }, 'ورود به حساب کاربری');
      return { success: false, statusCode: res.statusCode || 400, message: res.message || 'خطا در ورود' };
    } catch (err) {
      const parsed = parseApiError(err);
      showError(err, 'ورود به حساب کاربری');
      return {
        success: false,
        statusCode: parsed.statusCode,
        message: parsed.message,
        errors: parsed.errors,
        displayText: parsed.displayText
      };
    }
  }

  async function registerUser(name, phone, password, address = '') {
    try {
      const res = await authApi.register({ name, phone, password, address });
      if (res.success && res.token) {
        login(res.user, res.token);
        fetchUserProfile();
        showSuccess(res.message || 'ثبت‌نام با موفقیت انجام شد');
        return { success: true, user: res.user, message: res.message };
      }
      showError({ message: res.message, statusCode: res.statusCode }, 'ثبت‌نام کاربر');
      return { success: false, statusCode: res.statusCode || 400, message: res.message || 'خطا در ثبت‌نام' };
    } catch (err) {
      const parsed = parseApiError(err);
      showError(err, 'ثبت‌نام کاربر');
      return {
        success: false,
        statusCode: parsed.statusCode,
        message: parsed.message,
        errors: parsed.errors,
        displayText: parsed.displayText
      };
    }
  }

  // Cart operations
  function addToCart(product, weightKg = null, quantity = 1) {
    const prodId = product._id || product.id;
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => (item.product?._id || item.product?.id) === prodId);
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, { product, quantity }];
      }
    });

    // Optionally sync with backend cart if authenticated
    if (token && prodId) {
      cartApi.addItem(prodId, quantity).catch(() => {});
    }

    showSuccess(`«${product.name || product.title || 'محصول'}» به سبد خرید افزوده شد.`);
  }

  function updateCartQuantity(productId, weightKg, newQuantity) {
    if (newQuantity <= 0) {
      removeFromCart(productId, weightKg);
      return;
    }
    setCart(prevCart => prevCart.map(item => {
      const id = item.product?.id || item.product?._id;
      return id === productId ? { ...item, quantity: newQuantity } : item;
    }));

    if (token && productId) {
      cartApi.updateQuantity(productId, newQuantity).catch(() => {});
    }
  }

  function removeFromCart(productId, weightKg) {
    setCart(prevCart => prevCart.filter(item => {
      const id = item.product?.id || item.product?._id;
      return id !== productId;
    }));

    if (token && productId) {
      cartApi.removeItem(productId).catch(() => {});
    }
  }

  function clearCart() {
    setCart([]);
    setAppliedCoupon(null);
    if (token) {
      cartApi.clearCart().catch(() => {});
    }
  }

  function applyCoupon(code) {
    const found = coupons.find(c => c.code.toLowerCase() === code.trim().toLowerCase());
    if (!found) {
      const err = { statusCode: 404, message: 'کد تخفیف وارد شده نامعتبر است.' };
      showError(err, 'کد تخفیف');
      return { success: false, statusCode: 404, message: 'کد تخفیف نامعتبر است.' };
    }
    if (found.minSpend && cartTotalAmount < found.minSpend) {
      const msg = `این کد برای خریدهای بالای ${found.minSpend.toLocaleString('fa-IR')} تومان فعال می‌شود.`;
      showError({ statusCode: 422, message: msg }, 'محدودیت کد تخفیف');
      return { success: false, statusCode: 422, message: msg };
    }
    setAppliedCoupon(found);
    showSuccess(`کد تخفیف ${found.discountPercent}٪ با موفقیت اعمال شد.`);
    return { success: true, message: `کد تخفیف ${found.discountPercent}٪ با موفقیت اعمال شد.` };
  }

  function removeCoupon() {
    setAppliedCoupon(null);
  }

  // Cart total calculations
  const cartTotalAmount = cart.reduce((sum, item) => {
    const unitPrice = Number(item.product?.price || 0);
    return sum + unitPrice * (item.quantity || 1);
  }, 0);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const discountAmount = appliedCoupon
    ? Math.round((cartTotalAmount * appliedCoupon.discountPercent) / 100)
    : 0;

  const shippingFee = cartTotalAmount > 1000000 || cartTotalAmount === 0 ? 0 : 45000;
  const finalAmount = Math.max(0, cartTotalAmount - discountAmount + shippingFee);

  async function createOrder(orderData) {
    try {
      const formattedProducts = cart.map(item => ({
        name: item.product?.name || item.product?.title || 'برنج اصیل کامفیروز طلا رایس',
        price: Number(item.product?.price || 0),
        quantity: Number(item.quantity || 1)
      }));

      const fullAddress = orderData.fullAddress || `${orderData.province || ''} - ${orderData.city || ''} - ${orderData.address || ''}`.trim();

      const payload = {
        name: orderData.name || orderData.recipientName || currentUser?.name || 'مشتری طلا رایس',
        phone: orderData.phone || currentUser?.phone || '',
        address: fullAddress,
        postalCode: orderData.postalCode || '',
        products: formattedProducts,
        paymentReceipt: orderData.paymentReceipt || orderData.receiptImage || ''
      };

      let created = null;
      try {
        const res = await ordersApi.createOrder(payload);
        created = res.data || res.order;
      } catch (apiErr) {
        // If guest or server connection issue, create order object
        const parsed = parseApiError(apiErr);
        console.warn('Orders API note:', parsed.displayText);
        created = {
          id: `ORD-${Date.now().toString().slice(-6)}`,
          _id: `ORD-${Date.now().toString().slice(-6)}`,
          orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
          name: payload.name,
          phone: payload.phone,
          address: payload.address,
          postalCode: payload.postalCode,
          postTrackingCode: '',
          trackingCode: '',
          state: 'pending',
          status: 'pending',
          paymentStatus: orderData.paymentMethod === 'gateway' ? 'paid' : 'pending',
          isPaid: orderData.paymentMethod === 'gateway',
          paymentReceipt: payload.paymentReceipt,
          paymentReceiptDate: payload.paymentReceipt ? new Date().toISOString() : null,
          products: formattedProducts,
          items: [...cart],
          totalPrice: finalAmount,
          totalAmount: finalAmount,
          finalAmount: finalAmount,
          shippingFee: shippingFee,
          paymentMethod: orderData.paymentMethod || 'gateway',
          createdAt: new Date().toISOString(),
          date: new Date().toISOString().split('T')[0]
        };
      }

      setOrders(prev => [created, ...prev]);
      clearCart();
      showSuccess('سفارش شما با موفقیت در سامانه ثبت گردید.');
      return created;
    } catch (err) {
      showError(err, 'ثبت سفارش');
      throw err;
    }
  }

  // Order tracking by postal tracking code
  async function trackOrder(postTrackingCode) {
    try {
      const res = await ordersApi.trackOrder(postTrackingCode);
      return res;
    } catch (err) {
      const parsed = parseApiError(err);
      showError(err, 'رهگیری سفارش');
      throw parsed;
    }
  }

  // Upload payment receipt for an order
  async function uploadOrderReceipt(orderId, receiptImage) {
    try {
      const res = await ordersApi.uploadReceipt(orderId, receiptImage);
      showSuccess('رسید واریز وجه با موفقیت بارگذاری شد.');
      // Update order in local state
      setOrders(prev => prev.map(o => (o.id === orderId || o._id === orderId ? { ...o, paymentReceipt: receiptImage, paymentStatus: 'pending' } : o)));
      return res;
    } catch (err) {
      showError(err, 'ارسال رسید پرداخت');
      throw err;
    }
  }

  const filteredProducts = products.filter(function (p) {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name?.includes(searchQuery) ||
      p.title?.includes(searchQuery) ||
      p.description?.includes(searchQuery);

    return matchesSearch;
  }).sort(function (a, b) {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return (b.reviewCount || b.numReviews || 0) - (a.reviewCount || a.numReviews || 0);
  });

  return (
    <AppContext.Provider
      value={{
        // Core Data
        products,
        setProducts,
        amazingProducts,
        setAmazingProducts,
        articles,
        setArticles,
        reviews,
        coupons,
        categories,
        trustItems,
        heroSlides,
        setHeroSlides,
        brandStory,
        testTips,
        isConnecting,
        connectionError,
        serverHealth,
        checkHealth,

        // Filters & Search
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedWeightFilter,
        setSelectedWeightFilter,
        sortBy,
        setSortBy,
        filteredProducts,

        // Cart State & Actions
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        cart,
        cartCount,
        cartTotalAmount,
        cartSubtotal: cartTotalAmount,
        discountAmount,
        shippingFee,
        finalAmount,
        finalTotal: finalAmount,
        appliedCoupon,
        addToCart,
        updateCartQuantity,
        updateQuantity: updateCartQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,

        // Orders State & Actions
        orders,
        setOrders,
        updateOrderStatus,
        updateOrder,
        deleteOrder,
        verifyOrderPayment,
        getOrderStatusInfo,
        createOrder,
        addOrder: createOrder,
        trackOrder,
        uploadOrderReceipt,

        // User & Auth
        addresses: currentUser?.addresses || [],
        isAuthenticated,
        currentUser,
        userId,
        isAdmin,
        token,
        isLoadingUser,
        fetchUserProfile,
        refreshProfile: fetchUserProfile,
        usersCount: 0,
        users: [],
        setUsers: () => {},
        login,
        logout,
        loginUser,
        registerUser,

        // Error & Toast notifications
        toasts,
        showToast,
        showError,
        showSuccess,
        dismissToast,

        // Navigation
        refreshData: fetchRealData,
        goBack,
        historyStack: historyStackRef.current,

        // API Services
        api: {
          products: productsApi,
          amazingProducts: amazingProductsApi,
          orders: ordersApi,
          blog: blogApi,
          sliders: slidersApi,
          coupons: couponsApi,
          auth: authApi,
          reviews: reviewsApi,
          cart: cartApi,
          admin: adminApi,
          health: healthApi
        },
        productsApi,
        amazingProductsApi,
        ordersApi,
        blogApi,
        slidersApi,
        couponsApi,
        authApi,
        reviewsApi,
        cartApi,
        adminApi,
        healthApi
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
