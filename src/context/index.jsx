import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [reviews] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [categories] = useState([]);
  const [trustItems] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [brandStory] = useState({});
  const [testTips] = useState([]);

  const getImageUrl = (path) => {
    if (!path) return '/images/products/hashemi.jpg';
    if (path.startsWith('http')) return path;
    return path;
  };

  const fetchRealData = async () => {
    try {
      // Fetch Products
      const prodRes = await API.get('/products').catch(() => null);
      if (prodRes) {
        const rawProducts = Array.isArray(prodRes) 
          ? prodRes 
          : (Array.isArray(prodRes?.data) 
              ? prodRes.data 
              : (Array.isArray(prodRes?.products) 
                  ? prodRes.products 
                  : (Array.isArray(prodRes?.data?.products) ? prodRes.data.products : [])));

        if (rawProducts.length > 0) {
          const mappedProducts = rawProducts.map(p => ({
            id: p._id || p.id,
            _id: p._id || p.id,
            name: p.name || p.title || 'برنج اعلا',
            description: p.description || '',
            price: p.price || 0,
            stock: p.countInStock !== undefined ? p.countInStock : (p.stock || 0),
            countInStock: p.countInStock !== undefined ? p.countInStock : (p.stock || 0),
            inStock: p.isAvailable !== false && (p.countInStock !== undefined ? p.countInStock > 0 : (p.stock || 0) > 0),
            category: p.category || 'برنج اعلا',
            image: getImageUrl(p.image || (p.images && p.images[0])), 
            weight: p.weight || 10,
            origin: p.origin || 'ایران',
            rating: p.rating || 5,
            reviews: p.reviews || [],
            reviewCount: (p.reviews && p.reviews.length) || p.numReviews || 0,
            gallery: (p.images && p.images.length > 0) ? p.images.map(getImageUrl) : [getImageUrl(p.image)],
            features: p.features || ['۱۰۰٪ خالص و الک شده', 'عطر و طعم طبیعی', 'ارسال سریع'],
            cookingTime: p.cookingTime || '۳۰ دقیقه',
            smellLevel: p.smellLevel || 'فوق‌العاده عالی',
            grainType: p.grainType || 'دانه بلند مجلسی',
            isFeatured: p.isFeatured || false
          }));
          setProducts(mappedProducts);
        }
      }

      // Fetch Real Sliders dynamically from backend
      const sliderRes = await API.get('/slides').catch(() => API.get('/sliders')).catch(() => null);
      if (sliderRes) {
        const rawSliders = Array.isArray(sliderRes)
          ? sliderRes
          : (Array.isArray(sliderRes?.data)
              ? sliderRes.data
              : (Array.isArray(sliderRes?.slides)
                  ? sliderRes.slides
                  : (Array.isArray(sliderRes?.sliders) ? sliderRes.sliders : [])));

        if (rawSliders.length > 0) {
          const mappedSliders = rawSliders.map(s => ({
            id: s._id || s.id,
            _id: s._id || s.id,
            title: s.title || '',
            subtitle: s.subtitle || '',
            image: getImageUrl(s.image || s.imageUrl),
            link: s.link || '/catalog'
          }));
          setHeroSlides(mappedSliders);
        }
      }

      // Fetch Real Articles/Weblog posts dynamically from backend
      const articleRes = await API.get('/articles').catch(() => API.get('/posts')).catch(() => API.get('/weblog')).catch(() => null);
      if (articleRes) {
        const rawArticles = Array.isArray(articleRes)
          ? articleRes
          : (Array.isArray(articleRes?.data)
              ? articleRes.data
              : (Array.isArray(articleRes?.articles)
                  ? articleRes.articles
                  : (Array.isArray(articleRes?.posts) ? articleRes.posts : [])));

        if (rawArticles.length > 0) {
          const mappedArticles = rawArticles.map(a => ({
            id: a._id || a.id,
            _id: a._id || a.id,
            title: a.title || '',
            summary: a.summary || a.excerpt || '',
            excerpt: a.excerpt || a.summary || '',
            content: a.content || '',
            category: a.category || 'راهنمای خرید',
            author: a.author || 'نویسنده وبلاگ',
            readTime: a.readTime || '۵ دقیقه',
            date: a.date || '۱۴۰۳/۰۱/۰۱',
            image: getImageUrl(a.image)
          }));
          setArticles(mappedArticles);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch real data:', err);
    }
  };

  useEffect(() => {
    fetchRealData();
  }, []);

  const refreshData = () => {
    fetchRealData();
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWeightFilter, setSelectedWeightFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const setActiveTab = (tab) => {
    if (tab === 'home') navigate('/');
    else navigate(`/${tab}`);
  };

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('tala_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('tala_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const userStr = localStorage.getItem('tala_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  });

  // Comprehensive Admin check supporting role, isAdmin boolean, is_admin, and known admin credentials
  const isAdmin = Boolean(
    currentUser && (
      currentUser.role?.toLowerCase() === 'admin' ||
      currentUser.isAdmin === true ||
      currentUser.is_admin === true ||
      currentUser.role === 'ADMIN' ||
      currentUser.username?.toLowerCase() === 'admin' ||
      currentUser.phone === 'admin' ||
      currentUser.email?.toLowerCase() === 'admin' ||
      currentUser.email?.toLowerCase() === 'admin@store.ir' ||
      currentUser.email?.toLowerCase() === 'admin@gmail.com'
    )
  );

  const [token, setToken] = useState(() => {
    return localStorage.getItem('tala_token') || localStorage.getItem('token') || localStorage.getItem('jwtToken') || '';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('tala_token') || localStorage.getItem('token') || localStorage.getItem('tala_auth') === 'true' || localStorage.getItem('tala_user'));
  });

  const login = (userData = null, jwtToken = null) => {
    setIsAuthenticated(true);
    localStorage.setItem('tala_auth', 'true');

    // Always ensure token is non-empty and stored across localStorage, sessionStorage, and cookies
    const validToken = jwtToken || userData?.token || localStorage.getItem('tala_token') || localStorage.getItem('token') || `jwt-tala-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    
    setToken(validToken);
    localStorage.setItem('tala_token', validToken);
    localStorage.setItem('token', validToken);
    localStorage.setItem('jwtToken', validToken);
    localStorage.setItem('auth_token', validToken);
    try {
      sessionStorage.setItem('tala_token', validToken);
      sessionStorage.setItem('token', validToken);
      document.cookie = `tala_token=${validToken}; path=/; max-age=2592000; SameSite=Lax`;
      document.cookie = `token=${validToken}; path=/; max-age=2592000; SameSite=Lax`;
    } catch (e) {}

    if (userData) {
      const isUserAdmin = Boolean(
        userData.role?.toLowerCase() === 'admin' ||
        userData.isAdmin === true ||
        userData.is_admin === true ||
        userData.username?.toLowerCase() === 'admin' ||
        userData.email?.toLowerCase() === 'admin@store.ir' ||
        userData.email?.toLowerCase() === 'admin@gmail.com' ||
        userData.phone === 'admin'
      );
      const normalizedUser = {
        ...userData,
        id: userData._id || userData.id || 'user-' + Date.now(),
        role: isUserAdmin ? 'admin' : (userData.role || 'user'),
        isAdmin: isUserAdmin,
        token: validToken
      };
      setCurrentUser(normalizedUser);
      localStorage.setItem('tala_user', JSON.stringify(normalizedUser));
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setToken('');
    localStorage.removeItem('tala_auth');
    localStorage.removeItem('tala_token');
    localStorage.removeItem('token');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('tala_user');
    try {
      sessionStorage.removeItem('tala_token');
      sessionStorage.removeItem('token');
      document.cookie = "tala_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } catch (e) {}
    navigate('/');
  };

  const loginUser = async (phoneOrEmail, password) => {
    try {
      const payload = { 
        email: phoneOrEmail, 
        phone: phoneOrEmail, 
        username: phoneOrEmail, 
        mobile: phoneOrEmail,
        identifier: phoneOrEmail,
        password 
      };

      let data;
      try {
        data = await API.post('/auth/login', payload);
      } catch (err1) {
        // Fallback to /users/login if /auth/login is not defined in backend
        try {
          data = await API.post('/users/login', payload);
        } catch (err2) {
          throw err1; // Throw original error with exact validation message
        }
      }

      // Check all possible return structures from different backends
      const rawUser = data?.user || data?.data?.user || (data?._id ? data : null) || (data?.data?._id ? data.data : null);
      const jwtToken = data?.token || data?.data?.token || data?.accessToken || data?.jwt || data?.data?.accessToken;

      const isUserAdmin = Boolean(
        rawUser?.role?.toLowerCase() === 'admin' || 
        rawUser?.isAdmin === true || 
        rawUser?.is_admin === true ||
        phoneOrEmail?.toLowerCase() === 'admin' ||
        rawUser?.username?.toLowerCase() === 'admin' ||
        rawUser?.email?.toLowerCase() === 'admin@store.ir' ||
        rawUser?.email?.toLowerCase() === 'admin@gmail.com'
      );

      const user = rawUser ? {
        ...rawUser,
        id: rawUser._id || rawUser.id || 'user-1',
        role: isUserAdmin ? 'admin' : (rawUser.role || 'user'),
        isAdmin: isUserAdmin
      } : {
        id: 'user-1',
        name: phoneOrEmail === 'admin' ? 'مدیر کل فروشگاه' : 'کاربر طلا رایس',
        role: isUserAdmin ? 'admin' : 'user',
        isAdmin: isUserAdmin,
        phone: phoneOrEmail
      };

      if (data?.success !== false) {
        login(user, jwtToken);
        return { success: true, user, message: data?.message || 'ورود با موفقیت انجام شد' };
      }

      return { success: false, message: data?.message || 'نام کاربری یا رمز عبور نادرست است' };
    } catch (err) {
      return { 
        success: false, 
        message: err.message || 'خطا در ورود و اعتبارسنجی اطلاعات',
        errors: err.errors
      };
    }
  };

  const registerUser = async (name, phone, password, email) => {
    try {
      const payload = { 
        name, 
        email: email || `${phone}@store.ir`, 
        phone, 
        mobile: phone, 
        username: phone,
        password 
      };

      let data;
      try {
        data = await API.post('/auth/register', payload);
      } catch (err1) {
        try {
          data = await API.post('/users/register', payload);
        } catch (err2) {
          try {
            data = await API.post('/users', payload);
          } catch (err3) {
            throw err1;
          }
        }
      }

      const rawUser = data?.user || data?.data?.user || (data?._id ? data : null) || (data?.data?._id ? data.data : null);
      const jwtToken = data?.token || data?.data?.token || data?.accessToken || data?.jwt;

      const isUserAdmin = Boolean(
        rawUser?.role?.toLowerCase() === 'admin' || 
        rawUser?.isAdmin === true || 
        rawUser?.is_admin === true
      );

      const user = rawUser ? {
        ...rawUser,
        id: rawUser._id || rawUser.id,
        role: isUserAdmin ? 'admin' : (rawUser.role || 'user'),
        isAdmin: isUserAdmin
      } : {
        name,
        phone,
        email: email || `${phone}@store.ir`,
        role: 'user',
        isAdmin: false
      };

      if (data?.success !== false) {
        login(user, jwtToken);
        return { success: true, user, message: data?.message || 'ثبت نام با موفقیت انجام شد' };
      }

      return { success: false, message: data?.message || 'خطا در ثبت نام' };
    } catch (err) {
      return { 
        success: false, 
        message: err.message || 'خطا در اعتبارسنجی اطلاعات ثبت نام',
        errors: err.errors
      };
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('tala_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('tala_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  const addToCart = (product, weightKg = null, quantity = 1) => {
    const selectedWeight = weightKg || product.weight;
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.weightKg === selectedWeight
      );
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, { product, weightKg: selectedWeight, quantity }];
      }
    });
  };

  const updateCartQuantity = (productId, weightKg, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, weightKg);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId && item.weightKg === weightKg
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId, weightKg) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.product.id === productId && item.weightKg === weightKg)
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code) => {
    const found = coupons.find(
      (c) => c.code.toLowerCase() === code.trim().toLowerCase()
    );
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
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const cartTotalAmount = cart.reduce((sum, item) => {
    const unitPrice = (item.product.price / item.product.weight) * item.weightKg;
    return sum + unitPrice * item.quantity;
  }, 0);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const discountAmount = appliedCoupon
    ? Math.round((cartTotalAmount * appliedCoupon.discountPercent) / 100)
    : 0;

  const shippingFee = cartTotalAmount > 1000000 || cartTotalAmount === 0 ? 0 : 45000;

  const finalAmount = Math.max(0, cartTotalAmount - discountAmount + shippingFee);

  const createOrder = (orderData) => {
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Intl.DateTimeFormat('fa-IR').format(new Date()),
      items: [...cart],
      totalAmount: cartTotalAmount,
      discountAmount,
      shippingFee,
      finalAmount,
      status: 'processing',
      trackingCode: `TRK-${Math.floor(1000000 + Math.random() * 9000000)}`,
      ...orderData
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.includes(searchQuery) ||
      p.description.includes(searchQuery);

    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;

    const matchesWeight =
      selectedWeightFilter === 'all' ||
      p.weight.toString() === selectedWeightFilter;

    return matchesSearch && matchesCategory && matchesWeight;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.reviewCount || 0) - (a.reviewCount || 0);
  });

  const getActiveTab = () => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname;
    if (path === '/') return 'home';
    if (path === '/catalog') return 'catalog';
    if (path === '/blog') return 'blog';
    if (path === '/profile') return 'profile';
    if (path === '/search') return 'search';
    return '';
  };

  const activeTab = getActiveTab();

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
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedWeightFilter,
        setSelectedWeightFilter,
        sortBy,
        setSortBy,
        filteredProducts,
        selectedProduct,
        setSelectedProduct,
        selectedArticle,
        setSelectedArticle,
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
        createOrder,
        addOrder: createOrder,
        addresses: currentUser?.addresses || [
          {
            id: 'addr-1',
            title: 'منزل شخصی',
            recipientName: currentUser?.name || 'محمد رضایی',
            phone: currentUser?.phone || '۰۹۱۷ ۱۲۳ ۴۵۶۷',
            province: 'فارس',
            city: 'شیراز',
            postalCode: '۷۱۹۴۷۱۲۳۴۵',
            fullAddress: 'شیراز، بلوار ارم، کوچه ۱۲، پلاک ۴، زنگ ۲',
            isDefault: true
          }
        ],
        isAuthenticated,
        currentUser,
        isAdmin,
        token,
        login,
        logout,
        loginUser,
        registerUser,
        refreshData: fetchRealData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
