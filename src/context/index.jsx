import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import {
  initialProducts,
  initialHeroSlides,
  initialCategories,
  initialTrustItems,
  initialBrandStory,
  initialReviews,
  initialArticles,
  initialTestTips,
  initialCoupons,
  initialOrders
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(initialProducts);
  const [articles, setArticles] = useState(initialArticles);
  const [reviews, setReviews] = useState(initialReviews);
  const [coupons, setCoupons] = useState(initialCoupons);
  const [categories, setCategories] = useState(initialCategories);
  const [trustItems, setTrustItems] = useState(initialTrustItems);
  const [heroSlides, setHeroSlides] = useState(initialHeroSlides);
  const [brandStory, setBrandStory] = useState(initialBrandStory);
  const [testTips, setTestTips] = useState(initialTestTips);

  const getImageUrl = (path) => {
    if (!path) return '/images/products/hashemi.jpg';
    if (path.startsWith('http')) return path;
    return `http://localhost:3000${path}`;
  };

  const fetchRealData = async () => {
    try {
      // Fetch Products
      const prodRes = await API.get('/products');
      if (prodRes && prodRes.success && Array.isArray(prodRes.data) && prodRes.data.length > 0) {
        // Map API data to Frontend data schema to preserve UI and styles
        const mappedProducts = prodRes.data.map(p => ({
          id: p._id || p.id,
          _id: p._id || p.id,
          name: p.title || p.name,
          description: p.description || '',
          price: p.price,
          oldPrice: p.oldPrice || (p.price ? Math.round(p.price * 1.15) : null),
          discountPercent: p.discountPercent || (p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0),
          stock: p.stock ?? 20,
          inStock: (p.stock ?? 20) > 0,
          category: p.category || 'all',
          image: p.image || (p.images && p.images[0] ? getImageUrl(p.images[0]) : getImageUrl(p.image)), 
          weight: p.weight || 10,
          weightOptions: p.weightOptions || [5, 10, 20],
          origin: p.origin || 'کامفیروز، استان فارس',
          farmer: p.farmer || 'تعاونی شالیکاران',
          cookingRatio: p.cookingRatio || '۱ پیمانه برنج به ۱.۳ پیمانه آب',
          elongation: p.elongation || 'عالی',
          rating: p.rating || 5,
          reviewCount: p.numReviews || p.reviewCount || 10,
          gallery: (p.images && p.images.length > 0) ? p.images.map(getImageUrl) : [getImageUrl(p.image)],
          features: p.features || ['بسته‌بندی بهداشتی', 'ارسال سریع'],
          cookingTime: '۳۰ دقیقه',
          smellLevel: 'عالی',
          grainType: 'دانه بلند کامفیروزی',
          isFeatured: p.isFeatured || false,
          isDeal: p.isDeal || false
        }));
        setProducts(mappedProducts);
      }

      // Fetch Home Data (Sliders, etc)
      const homeRes = await API.get('/home').catch(() => null);
      if (homeRes && homeRes.success && homeRes.data && homeRes.data.sliders && homeRes.data.sliders.length > 0) {
        const mappedSliders = homeRes.data.sliders.map(s => ({
          id: s._id || s.id,
          _id: s._id || s.id,
          title: s.title,
          description: s.description || 'برنج اصیل و معطر کامفیروز مستقیم از شالیزار',
          subtitle: s.subtitle || 'پیشنهاد ویژه',
          image: getImageUrl(s.image),
          link: s.link || '/products',
          ctaText: 'مشاهده تخفیف‌های امروز'
        }));
        setHeroSlides(mappedSliders);
      } else {
        // Fallback to fetch sliders directly if /home is not available
        const sliderRes = await API.get('/sliders').catch(() => null);
        if (sliderRes && sliderRes.success && Array.isArray(sliderRes.data) && sliderRes.data.length > 0) {
          const mappedSliders = sliderRes.data.map(s => ({
            id: s._id || s.id,
            _id: s._id || s.id,
            title: s.title,
            description: s.description || 'برنج اصیل و معطر کامفیروز مستقیم از شالیزار',
            subtitle: s.subtitle || 'پیشنهاد ویژه',
            image: getImageUrl(s.image),
            link: s.link || '/products',
            ctaText: 'مشاهده تخفیف‌های امروز'
          }));
          setHeroSlides(mappedSliders);
        }
      }
    } catch (err) {
      console.warn('Backend API not reachable, using mock test data:', err);
    }
  };

  useEffect(() => {
    fetchRealData();
  }, []);

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
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return initialOrders;
    } catch {
      return initialOrders;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const userStr = localStorage.getItem('tala_user');
      if (userStr) return JSON.parse(userStr);
      return {
        id: 'usr-1',
        name: 'محمد رضایی',
        phone: '۰۹۱۷ ۱۲۳ ۴۵۶۷',
        role: 'admin',
        addresses: [
          {
            id: 'addr-1',
            title: 'منزل شخصی',
            recipientName: 'محمد رضایی',
            phone: '۰۹۱۷ ۱۲۳ ۴۵۶۷',
            province: 'فارس',
            city: 'شیراز',
            postalCode: '۷۱۹۴۷۱۲۳۴۵',
            fullAddress: 'شیراز، بلوار ارم، کوچه ۱۲، پلاک ۴، زنگ ۲',
            isDefault: true
          }
        ]
      };
    } catch {
      return null;
    }
  });

  const isAdmin = Boolean(currentUser && currentUser.role === 'admin');

  const [token, setToken] = useState(() => {
    return localStorage.getItem('tala_token') || '';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('tala_token') || localStorage.getItem('tala_auth') === 'true');
  });

  const login = (userData = null, jwtToken = null) => {
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
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setToken('');
    localStorage.removeItem('tala_auth');
    localStorage.removeItem('tala_token');
    localStorage.removeItem('tala_user');
    navigate('/');
  };

  const loginUser = async (phone, password) => {
    try {
      const data = await API.post('/auth/login', { mobile: phone, password });
      if (data.success && data.data && data.data.token) {
        login(data.data.user, data.data.token);
        return { success: true, user: data.data.user, message: 'ورود با موفقیت انجام شد' };
      }
      return { success: false, message: 'خطا در ورود' };
    } catch (err) {
      return { success: false, message: err.message || 'خطا در ارتباط با سرور' };
    }
  };

  const registerUser = async (name, phone, password, email) => {
    try {
      const data = await API.post('/auth/register', { name, mobile: phone, password });
      if (data.success && data.data && data.data.token) {
        login(data.data.user, data.data.token);
        return { success: true, user: data.data.user, message: data.message };
      }
      return { success: false, message: data.message || 'خطا در ثبت نام' };
    } catch (err) {
      return { success: false, message: err.message || 'خطا در ارتباط با سرور' };
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
