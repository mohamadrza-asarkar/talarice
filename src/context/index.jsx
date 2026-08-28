import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import {
  productsApi,
  ordersApi,
  blogApi,
  slidersApi,
  couponsApi,
  authApi,
  reviewsApi
} from '../api';
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

  // Internal Navigation History Stack for robust, instant back navigation
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
    // Pop all occurrences of currentPath from the end
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

  const [products, setProducts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState(null);

  const [categories, setCategories] = useState([
    { id: 'all', name: 'همه محصولات', iconClass: 'fa-solid fa-border-all' },
    { id: 'hashemi', name: 'برنج هاشمی', iconClass: 'fa-solid fa-wheat-awn' },
    { id: 'tarom', name: 'برنج طارم', iconClass: 'fa-solid fa-seedling' },
    { id: 'smoky', name: 'برنج دودی', iconClass: 'fa-solid fa-fire' },
    { id: 'broken', name: 'نیم‌دانه و سرلاشه', iconClass: 'fa-solid fa-mortar-pestle' }
  ]);
  const [trustItems, setTrustItems] = useState([
    { id: '1', title: 'ضمانت اصالت کامپیروز', iconClass: 'fa-solid fa-award', description: 'تمام محصولات ما مستقیماً از کشاورزان معتمد و اصیل شالیزارهای کامفیروز تهیه و بسته‌بندی می‌شوند.' },
    { id: '2', title: 'ارسال سریع به سراسر کشور', iconClass: 'fa-solid fa-truck-fast', description: 'سفارشات شما در سریع‌ترین زمان ممکن از طریق پست، تیپاکس یا باربری به درب منزل شما ارسال خواهد شد.' },
    { id: '3', title: 'امکان ارجاع وجه', iconClass: 'fa-solid fa-rotate-left', description: 'در صورت عدم رضایت از پخت یا کیفیت محصول، وجه پرداختی شما با احترام تمام مسترد خواهد شد.' }
  ]);
  const [brandStory, setBrandStory] = useState({
    title: 'داستان و اصالت برنج طلا رایس',
    description: 'طلا رایس با هدف حذف واسطه‌ها و ارائه مستقیم برنج معطر کامفیروز و هاشمی شمال تأسیس شده است. ما با همکاری مستقیم شالیکاران سنتی، عطر و طعم واقعی سفره ایرانی را با تضمین اصالت و بهترین کیفیت به دست شما می‌رسانیم.'
  });
  const [testTips, setTestTips] = useState([]);

  function getImageUrl(path) {
    if (!path) return '/images/products/hashemi.jpg';
    if (path.startsWith('http')) return path;
    return `http://localhost:3000${path}`;
  }

  async function fetchRealData() {
    setIsConnecting(true);
    let prodRes = null;
    let sliderRes = null;
    let artRes = null;
    let orderRes = null;
    let hasProdError = false;
    let hasSliderError = false;
    let prodErrorMessage = '';

    // Fetch products (primary endpoint)
    try {
      prodRes = await productsApi.getProducts();
    } catch (err) {
      console.warn('Products API failed:', err.message);
      hasProdError = true;
      prodErrorMessage = err.message || 'خطای اتصال به وب‌سرویس محصولات';
    }

    // Safely attempt secondary endpoints (since the user may not have them implemented)
    try {
      sliderRes = await slidersApi.getSliders();
    } catch (err) {
      console.warn('Sliders API not implemented on backend:', err.message);
      hasSliderError = true;
    }

    try {
      artRes = await blogApi.getArticles();
    } catch (err) {
      console.warn('Articles API not implemented on backend:', err.message);
    }

    try {
      orderRes = await ordersApi.getOrders();
    } catch (err) {
      console.warn('Orders API not implemented on backend:', err.message);
    }

    // Set Products
    if (!hasProdError) {
      if (prodRes?.success && Array.isArray(prodRes.data)) {
        setProducts(prodRes.data);
      } else if (Array.isArray(prodRes)) {
        setProducts(prodRes);
      } else {
        setProducts([]);
      }
    } else {
      setProducts([]);
    }

    // Set Sliders
    if (!hasSliderError) {
      if (sliderRes?.success && Array.isArray(sliderRes.data)) {
        setHeroSlides(sliderRes.data);
      } else if (Array.isArray(sliderRes)) {
        setHeroSlides(sliderRes);
      } else {
        setHeroSlides([]);
      }
    } else {
      setHeroSlides([]);
    }

    // Set Articles
    if (artRes?.success && Array.isArray(artRes.data)) {
      setArticles(artRes.data);
    } else if (Array.isArray(artRes)) {
      setArticles(artRes);
    } else {
      setArticles([]);
    }

    // Set Orders
    if (orderRes?.success && Array.isArray(orderRes.data)) {
      setOrders(orderRes.data);
    } else if (Array.isArray(orderRes)) {
      setOrders(orderRes);
    } else {
      setOrders([]);
    }

    // Determine real connection error
    if (hasProdError) {
      setConnectionError(prodErrorMessage);
    } else {
      setConnectionError(null);
    }
    setIsConnecting(false);
  }

  useEffect(function () {
    fetchRealData();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWeightFilter, setSelectedWeightFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [cart, setCart] = useState(function () {
    try {
      const saved = localStorage.getItem('tala_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [orders, setOrders] = useState(function () {
    try {
      const saved = localStorage.getItem('tala_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(function () {
    try {
      localStorage.setItem('tala_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  async function updateOrderStatus(id, newStatus) {
    setOrders(function (prev) {
      return prev.map(function (o) {
        const orderId = o.id || o._id;
        if (orderId === id) {
          return { ...o, status: newStatus };
        }
        return o;
      });
    });
    await ordersApi.updateOrderStatus(id, newStatus);
  }

  const [currentUser, setCurrentUser] = useState(function () {
    try {
      const userStr = localStorage.getItem('tala_user');
      if (userStr) return JSON.parse(userStr);
      return null;
    } catch {
      return null;
    }
  });

  const isAdmin = Boolean(currentUser && currentUser.role === 'admin');

  const [token, setToken] = useState(function () {
    return localStorage.getItem('tala_token') || '';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(function () {
    return Boolean(localStorage.getItem('tala_token') || localStorage.getItem('tala_auth') === 'true');
  });

  function login(userData = null, jwtToken = null) {
    setIsAuthenticated(true);
    localStorage.setItem('tala_auth', 'true');
    if (jwtToken) {
      setToken(jwtToken);
      localStorage.setItem('tala_token', jwtToken);
    }
    if (userData) {
      setCurrentUser(userData);
      localStorage.setItem('tala_user', JSON.stringify(userData));
    }
  }

  function logout() {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setToken('');
    localStorage.removeItem('tala_auth');
    localStorage.removeItem('tala_token');
    localStorage.removeItem('tala_user');
    navigate('/');
  }

  async function loginUser(phone, password) {
    try {
      const data = await API.post('/auth/login', { mobile: phone, password });
      if (data.success && data.data && data.data.token) {
        login(data.data.user, data.data.token);
        return { success: true, user: data.data.user, message: 'ورود با موفقیت انجام شد' };
      }
      return { success: false, message: data?.message || 'شماره موبایل یا رمز عبور اشتباه است' };
    } catch (err) {
      if (err?.response?.data?.message) {
        return { success: false, message: err.response.data.message };
      }
      return { success: false, message: 'خطا در ارتباط با سرور بک‌اند. لطفاً مطمئن شوید سرور شما به درستی اجرا شده است.' };
    }
  }

  async function registerUser(name, phone, password) {
    try {
      const data = await API.post('/auth/register', { name, mobile: phone, password });
      if (data.success && data.data && data.data.token) {
        login(data.data.user, data.data.token);
        return { success: true, user: data.data.user, message: data.message };
      }
      return { success: false, message: data?.message || 'خطا در ثبت نام' };
    } catch (err) {
      if (err?.response?.data?.message) {
        return { success: false, message: err.response.data.message };
      }
      return { success: false, message: 'خطا در ارتباط با سرور بک‌اند. لطفاً مطمئن شوید سرور شما به درستی اجرا شده است.' };
    }
  }

  useEffect(function () {
    try {
      localStorage.setItem('tala_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(function () {
    try {
      localStorage.setItem('tala_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  function addToCart(product, weightKg = null, quantity = 1) {
    const prodId = product._id || product.id;
    setCart(function (prevCart) {
      const existingIndex = prevCart.findIndex(function (item) {
        return (item.product?._id || item.product?.id) === prodId;
      });
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
  }

  function updateCartQuantity(productId, weightKg, newQuantity) {
    if (newQuantity <= 0) {
      removeFromCart(productId, weightKg);
      return;
    }
    setCart(function (prevCart) {
      return prevCart.map(function (item) {
        return (item.product?.id === productId || item.product?._id === productId)
          ? { ...item, quantity: newQuantity }
          : item;
      });
    });
  }

  function removeFromCart(productId, weightKg) {
    setCart(function (prevCart) {
      return prevCart.filter(function (item) {
        return !(item.product?.id === productId || item.product?._id === productId);
      });
    });
  }

  function clearCart() {
    setCart([]);
    setAppliedCoupon(null);
  }

  function applyCoupon(code) {
    const found = coupons.find(function (c) {
      return c.code.toLowerCase() === code.trim().toLowerCase();
    });
    if (!found) {
      return { success: false, message: 'کد تخفیف نامعتبر است.' };
    }
    if (found.minSpend && cartTotalAmount < found.minSpend) {
      return {
        success: false,
        message: `این کد برای خریدهای بالای ${found.minSpend.toLocaleString('fa-IR')} تومان فعال می‌شود.`
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `کد تخفیف ${found.discountPercent}٪ با موفقیت اعمال شد.` };
  }

  function removeCoupon() {
    setAppliedCoupon(null);
  }

  const cartTotalAmount = cart.reduce(function (sum, item) {
    const unitPrice = Number(item.product?.price || 0);
    return sum + unitPrice * (item.quantity || 1);
  }, 0);

  const cartCount = cart.reduce(function (count, item) {
    return count + item.quantity;
  }, 0);

  const discountAmount = appliedCoupon
    ? Math.round((cartTotalAmount * appliedCoupon.discountPercent) / 100)
    : 0;

  const shippingFee = cartTotalAmount > 1000000 || cartTotalAmount === 0 ? 0 : 45000;

  const finalAmount = Math.max(0, cartTotalAmount - discountAmount + shippingFee);

  function createOrder(orderData) {
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Intl.DateTimeFormat('fa-IR').format(new Date()),
      items: [...cart],
      totalAmount: cartTotalAmount,
      discountAmount,
      shippingFee,
      finalAmount,
      status: 'reviewing',
      trackingCode: `TRK-${Math.floor(1000000 + Math.random() * 9000000)}`,
      ...orderData
    };
    setOrders(function (prev) {
      return [newOrder, ...prev];
    });

    // If user is logged in, auto-save their entered address to addresses list
    if (currentUser && orderData?.postalCode && orderData?.fullAddress) {
      const existingAddr = currentUser.addresses?.find(function (a) {
        return a.postalCode === orderData.postalCode;
      });
      if (!existingAddr) {
        const newAddr = {
          id: 'addr-' + Date.now(),
          title: 'آدرس ثبت شده در خرید',
          recipientName: orderData.recipientName || currentUser.name,
          phone: orderData.phone || currentUser.phone,
          province: orderData.province || 'فارس',
          city: orderData.city || 'شیراز',
          postalCode: orderData.postalCode,
          fullAddress: orderData.fullAddress,
          isDefault: !currentUser.addresses || currentUser.addresses.length === 0
        };
        const updatedUser = {
          ...currentUser,
          addresses: [...(currentUser.addresses || []), newAddr]
        };
        setCurrentUser(updatedUser);
        try {
          localStorage.setItem('tala_user', JSON.stringify(updatedUser));
        } catch {}
      }
    }

    clearCart();
    return newOrder;
  }

  const filteredProducts = products.filter(function (p) {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name?.includes(searchQuery) ||
      p.description?.includes(searchQuery);

    return matchesSearch;
  }).sort(function (a, b) {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.reviewCount || 0) - (a.reviewCount || 0);
  });

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
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
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedWeightFilter,
        setSelectedWeightFilter,
        sortBy,
        setSortBy,
        filteredProducts,
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
        orders,
        setOrders,
        updateOrderStatus,
        getOrderStatusInfo,
        createOrder,
        addOrder: createOrder,
        addresses: currentUser?.addresses || [],
        isAuthenticated,
        currentUser,
        isAdmin,
        token,
        login,
        logout,
        loginUser,
        registerUser,
        refreshData: fetchRealData,
        goBack,
        historyStack: historyStackRef.current,
        // Modular API Services exposed for components
        api: {
          products: productsApi,
          orders: ordersApi,
          blog: blogApi,
          sliders: slidersApi,
          coupons: couponsApi,
          auth: authApi,
          reviews: reviewsApi
        },
        productsApi,
        ordersApi,
        blogApi,
        slidersApi,
        couponsApi,
        authApi,
        reviewsApi
      }}
    >
      {children}
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

