import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowRight,
  Layers,
  RefreshCw,
  MessageSquare,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import { adminApi, ordersApi, productsApi, slidesApi, reviewsApi, amazingProductsApi } from '../api';
import { AdminOverview } from '../components/admin/adminOverview';
import { AdminProducts } from '../components/admin/adminProducts';
import { AdminOrders } from '../components/admin/adminOrders';
import { AdminUsers } from '../components/admin/adminUsers';
import { AdminSlides } from '../components/admin/adminSlides';
import styles from './pages.module.css';

export default function Admin() {
  const navigate = useNavigate();
  const {
    currentUser,
    products,
    setProducts,
    sliders,
    setSliders,
    amazingProducts,
    setAmazingProducts,
    getOrderStatusInfo,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'slides', 'reviews', 'users', 'amazing'
  const [dashboardStats, setDashboardStats] = useState(null);
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingSlides, setIsLoadingSlides] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isLoadingAmazing, setIsLoadingAmazing] = useState(false);

  // Search & Filter
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');

  // Editing Product States
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdPrice, setEditProdPrice] = useState('');
  const [editProdOriginalPrice, setEditProdOriginalPrice] = useState('');
  const [editProdDiscount, setEditProdDiscount] = useState('0');
  const [editProdCategory, setEditProdCategory] = useState('kamfirouz');
  const [editProdWeight, setEditProdWeight] = useState('۱۰ کیلوگرم');
  const [editProdStock, setEditProdStock] = useState('30');
  const [editProdDesc, setEditProdDesc] = useState('');
  const [editProdIsAmazing, setEditProdIsAmazing] = useState(false);
  const [editProdImageBase64, setEditProdImageBase64] = useState('');
  const [isUpdatingProd, setIsUpdatingProd] = useState(false);

  // Editing Slide States
  const [editingSlide, setEditingSlide] = useState(null);
  const [editSlideTitle, setEditSlideTitle] = useState('');
  const [editSlideSubtitle, setEditSlideSubtitle] = useState('');
  const [editSlideDesc, setEditSlideDesc] = useState('');
  const [editSlideCta, setEditSlideCta] = useState('');
  const [editSlideCategory, setEditSlideCategory] = useState('all');
  const [editSlideImageBase64, setEditSlideImageBase64] = useState('');
  const [isUpdatingSlide, setIsUpdatingSlide] = useState(false);

  // Form states for NEW Product
  const [showAddProdForm, setShowAddProdForm] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState('');
  const [newProdDiscount, setNewProdDiscount] = useState('0');
  const [newProdCategory, setNewProdCategory] = useState('kamfirouz');
  const [newProdWeight, setNewProdWeight] = useState('۱۰ کیلوگرم');
  const [newProdStock, setNewProdStock] = useState('30');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdIsAmazing, setNewProdIsAmazing] = useState(false);
  const [newProdImageBase64, setNewProdImageBase64] = useState('');
  const [isSubmittingProd, setIsSubmittingProd] = useState(false);

  // Auto-calculation functions for new product pricing
  const handleNewPriceChange = (val) => {
    setNewProdPrice(val);
    const orig = Number(newProdOriginalPrice);
    const cur = Number(val);
    if (orig > 0 && cur > 0 && orig > cur) {
      const disc = Math.round(((orig - cur) / orig) * 100);
      setNewProdDiscount(String(disc));
    } else if (cur >= orig && orig > 0) {
      setNewProdDiscount('0');
    }
  };

  const handleNewOriginalPriceChange = (val) => {
    setNewProdOriginalPrice(val);
    const orig = Number(val);
    const cur = Number(newProdPrice);
    const disc = Number(newProdDiscount);
    if (orig > 0 && cur > 0 && orig > cur) {
      const calculatedDisc = Math.round(((orig - cur) / orig) * 100);
      setNewProdDiscount(String(calculatedDisc));
    } else if (orig > 0 && disc > 0 && (!cur || cur === orig)) {
      const calculatedPrice = Math.round(orig * (1 - disc / 100));
      setNewProdPrice(String(calculatedPrice));
    }
  };

  const handleNewDiscountChange = (val) => {
    setNewProdDiscount(val);
    const disc = Number(val);
    const orig = Number(newProdOriginalPrice || newProdPrice);
    if (orig > 0 && disc >= 0 && disc <= 100) {
      const calculatedPrice = Math.round(orig * (1 - disc / 100));
      setNewProdPrice(String(calculatedPrice));
      if (!newProdOriginalPrice) {
        setNewProdOriginalPrice(String(orig));
      }
    }
  };

  // Auto-calculation functions for edit product pricing
  const handleEditPriceChange = (val) => {
    setEditProdPrice(val);
    const orig = Number(editProdOriginalPrice);
    const cur = Number(val);
    if (orig > 0 && cur > 0 && orig > cur) {
      const disc = Math.round(((orig - cur) / orig) * 100);
      setEditProdDiscount(String(disc));
    } else if (cur >= orig && orig > 0) {
      setEditProdDiscount('0');
    }
  };

  const handleEditOriginalPriceChange = (val) => {
    setEditProdOriginalPrice(val);
    const orig = Number(val);
    const cur = Number(editProdPrice);
    const disc = Number(editProdDiscount);
    if (orig > 0 && cur > 0 && orig > cur) {
      const calculatedDisc = Math.round(((orig - cur) / orig) * 100);
      setEditProdDiscount(String(calculatedDisc));
    } else if (orig > 0 && disc > 0 && (!cur || cur === orig)) {
      const calculatedPrice = Math.round(orig * (1 - disc / 100));
      setEditProdPrice(String(calculatedPrice));
    }
  };

  const handleEditDiscountChange = (val) => {
    setEditProdDiscount(val);
    const disc = Number(val);
    const orig = Number(editProdOriginalPrice || editProdPrice);
    if (orig > 0 && disc >= 0 && disc <= 100) {
      const calculatedPrice = Math.round(orig * (1 - disc / 100));
      setEditProdPrice(String(calculatedPrice));
      if (!editProdOriginalPrice) {
        setEditProdOriginalPrice(String(orig));
      }
    }
  };

  // Form states for NEW Slide
  const [showAddSlideForm, setShowAddSlideForm] = useState(false);
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideSubtitle, setNewSlideSubtitle] = useState('');
  const [newSlideDesc, setNewSlideDesc] = useState('');
  const [newSlideCta, setNewSlideCta] = useState('مشاهده و خرید آنلاین');
  const [newSlideCategory, setNewSlideCategory] = useState('all');
  const [newSlideImageBase64, setNewSlideImageBase64] = useState('');
  const [isSubmittingSlide, setIsSubmittingSlide] = useState(false);

  // Form states for NEW User
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserPhone.trim()) {
      showToast('لطفاً نام و شماره تلفن کاربر را وارد فرمایید.', 'error');
      return;
    }
    setIsSubmittingUser(true);
    try {
      await adminApi.createUser({
        name: newUserName.trim(),
        phone: newUserPhone.trim(),
        email: newUserEmail.trim(),
        password: newUserPassword.trim() || '123456',
        role: newUserRole
      });
      setNewUserName('');
      setNewUserPhone('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('user');
      setShowAddUserModal(false);
      fetchAdminUsers();
      showToast('کاربر جدید با موفقیت ایجاد شد.', 'success');
    } catch (err) {
      showToast('خطا در ایجاد کاربر: ' + err.message, 'error');
    } finally {
      setIsSubmittingUser(false);
    }
  };

  // Modals & Receipts
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState(null);
  const [editingTrackingOrderId, setEditingTrackingOrderId] = useState(null);
  const [trackingCodeInput, setTrackingCodeInput] = useState('');
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Fetch live orders
  const fetchAdminOrders = useCallback(async () => {
    setIsLoadingOrders(true);
    try {
      const list = await ordersApi.getAll();
      setAdminOrders(Array.isArray(list) ? list : []);
    } catch (err) {
      console.debug('Admin orders sync notice:', err.message);
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  // Fetch live registered users
  const fetchAdminUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const list = await adminApi.getUsers();
      setAdminUsers(Array.isArray(list) ? list : []);
    } catch (err) {
      console.debug('Admin users sync notice:', err.message);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  // Fetch products
  const fetchAdminProducts = useCallback(async () => {
    try {
      const res = await productsApi.getAll({ limit: 100 });
      const rawList = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : (Array.isArray(res?.products) ? res.products : []));
      if (rawList.length > 0) {
        setProducts(rawList);
      }
    } catch (err) {
      console.debug('Admin products sync notice:', err.message);
    }
  }, [setProducts]);

  // Fetch slides
  const fetchAdminSlides = useCallback(async () => {
    setIsLoadingSlides(true);
    try {
      const list = await slidesApi.getAll();
      if (Array.isArray(list) && list.length > 0) {
        setSliders(list);
      }
    } catch (err) {
      console.debug('Admin slides sync notice:', err.message);
    } finally {
      setIsLoadingSlides(false);
    }
  }, [setSliders]);

  // Fetch amazing products
  const fetchAdminAmazing = useCallback(async () => {
    setIsLoadingAmazing(true);
    try {
      const list = await amazingProductsApi.getAll();
      if (Array.isArray(list)) {
        setAmazingProducts(list);
      }
    } catch (err) {
      console.debug('Admin amazing sync notice:', err.message);
    } finally {
      setIsLoadingAmazing(false);
    }
  }, [setAmazingProducts]);

  // Fetch dashboard stats
  const fetchDashboard = useCallback(async () => {
    try {
      const res = await adminApi.getDashboard();
      if (res && typeof res === 'object') {
        setDashboardStats(res);
      }
    } catch (err) {
      console.debug('Admin dashboard sync notice:', err.message);
    }
  }, []);

  // Review states and actions
  const [replyingReviewId, setReplyingReviewId] = useState(null);
  const [replyInputText, setReplyInputText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Fetch reviews for all products
  const fetchAdminReviews = useCallback(async () => {
    setIsLoadingReviews(true);
    try {
      // 1. Try global /api/reviews first
      const globalList = await reviewsApi.getAll();
      if (Array.isArray(globalList) && globalList.length > 0) {
        setAllReviews(globalList);
        return;
      }

      // 2. Fallback: fetch per product
      let activeProds = products || [];
      if (activeProds.length === 0) {
        const res = await productsApi.getAll({ limit: 100 });
        activeProds = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : (Array.isArray(res?.products) ? res.products : []));
      }
      if (activeProds.length > 0) {
        const results = await Promise.allSettled(
          activeProds.map(async (p) => {
            const list = await reviewsApi.getByProductId(p._id || p.id);
            return list.map(r => ({ ...r, product: p }));
          })
        );
        const flattened = results
          .filter(r => r.status === 'fulfilled')
          .flatMap(r => r.value);
        setAllReviews(flattened);
      } else {
        setAllReviews([]);
      }
    } catch (err) {
      console.debug('Admin reviews sync notice:', err.message);
    } finally {
      setIsLoadingReviews(false);
    }
  }, [products]);

  const refreshAllAdminData = useCallback(async () => {
    setIsLoadingAll(true);
    await Promise.allSettled([
      fetchAdminOrders(),
      fetchAdminUsers(),
      fetchAdminProducts(),
      fetchAdminSlides(),
      fetchAdminAmazing(),
      fetchDashboard(),
      fetchAdminReviews()
    ]);
    setIsLoadingAll(false);
    showToast('اطلاعات پنل مدیریت از وب‌سرویس بروزرسانی شد.', 'info');
  }, [fetchAdminOrders, fetchAdminUsers, fetchAdminProducts, fetchAdminSlides, fetchAdminAmazing, fetchDashboard, fetchAdminReviews, showToast]);

  useEffect(() => {
    fetchAdminOrders();
    fetchAdminUsers();
    fetchAdminProducts();
    fetchAdminSlides();
    fetchAdminAmazing();
    fetchDashboard();
    fetchAdminReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handlers
  const handleFileChangeHelper = (file, callback) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('لطفاً فقط فایل تصویر انتخاب کنید.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      alert('حجم تصویر بسیار بالا است (حداکثر ۴ مگابایت مجاز است).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) {
      showToast('لطفاً عنوان و قیمت محصول را مشخص فرمایید.', 'error');
      return;
    }
    setIsSubmittingProd(true);
    const salePrice = Number(newProdPrice);
    const origPrice = Number(newProdOriginalPrice || newProdPrice);
    const computedDiscount = Number(newProdDiscount) > 0 
      ? Number(newProdDiscount) 
      : (origPrice > salePrice ? Math.round(((origPrice - salePrice) / origPrice) * 100) : 0);

    try {
      await productsApi.create({
        name: newProdName.trim(),
        price: salePrice,
        originalPrice: origPrice,
        discountPercent: computedDiscount,
        category: newProdCategory,
        weight: newProdWeight,
        stock: Number(newProdStock || 20),
        description: newProdDesc.trim() || 'برنج اصیل معطر درجه یک شالیزار کامفیروز',
        isAmazing: Boolean(newProdIsAmazing),
        image: newProdImageBase64 || '/src/assets/images/white_rice_sack_1_1786553727373.jpg'
      });
      if (newProdIsAmazing) {
        try {
          await amazingProductsApi.create({
            name: newProdName.trim(),
            originalPrice: origPrice,
            discountPercent: computedDiscount || 15,
            image: newProdImageBase64 || '/src/assets/images/white_rice_sack_1_1786553727373.jpg'
          });
          fetchAdminAmazingProducts();
        } catch (err) {
          console.debug('Failed to sync new amazing product:', err);
        }
      }
      setNewProdName('');
      setNewProdPrice('');
      setNewProdOriginalPrice('');
      setNewProdDiscount('0');
      setNewProdDesc('');
      setNewProdIsAmazing(false);
      setNewProdImageBase64('');
      setShowAddProdForm(false);
      fetchAdminProducts();
      showToast('محصول جدید با موفقیت اضافه شد.', 'success');
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'خطا در فرآیند ثبت محصول';
      showToast('خطا در افزودن محصول: ' + errMsg, 'error');
    } finally {
      setIsSubmittingProd(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('آیا از حذف این محصول اطمینان دارید؟')) return;
    try {
      await productsApi.delete(id);
      fetchAdminProducts();
      showToast('محصول با موفقیت حذف شد.', 'success');
    } catch (err) {
      showToast('خطا در حذف محصول', 'error');
    }
  };

  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsUpdatingProd(true);
    const salePrice = Number(editProdPrice);
    const origPrice = Number(editProdOriginalPrice || editProdPrice);
    const computedDiscount = Number(editProdDiscount) > 0
      ? Number(editProdDiscount)
      : (origPrice > salePrice ? Math.round(((origPrice - salePrice) / origPrice) * 100) : 0);

    try {
      await productsApi.update(editingProduct._id || editingProduct.id, {
        name: editProdName.trim(),
        price: salePrice,
        originalPrice: origPrice,
        discountPercent: computedDiscount,
        category: editProdCategory,
        weight: editProdWeight,
        stock: Number(editProdStock),
        description: editProdDesc.trim(),
        isAmazing: Boolean(editProdIsAmazing),
        image: editProdImageBase64 || editingProduct.image
      });

      // Synchronize with amazing deals endpoint
      const existingAmazing = amazingProducts.find(
        (ap) =>
          (ap.name && ap.name === editingProduct.name) ||
          (ap._id && (ap._id === editingProduct._id || ap._id === editingProduct.id)) ||
          (ap.id && (ap.id === editingProduct._id || ap.id === editingProduct.id))
      );

      if (editProdIsAmazing && !existingAmazing) {
        try {
          await amazingProductsApi.create({
            name: editProdName.trim(),
            originalPrice: origPrice,
            discountPercent: computedDiscount || 15,
            image: editProdImageBase64 || editingProduct.image
          });
          fetchAdminAmazingProducts();
        } catch (syncErr) {
          console.debug('Failed to sync amazing product creation:', syncErr);
        }
      } else if (!editProdIsAmazing && existingAmazing) {
        try {
          await amazingProductsApi.delete(existingAmazing._id || existingAmazing.id);
          fetchAdminAmazingProducts();
        } catch (syncErr) {
          console.debug('Failed to remove amazing product:', syncErr);
        }
      }

      setEditingProduct(null);
      fetchAdminProducts();
      showToast('محصول با موفقیت ویرایش شد.', 'success');
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'خطا در بروزرسانی اطلاعات محصول';
      showToast('خطا در ویرایش محصول: ' + errMsg, 'error');
    } finally {
      setIsUpdatingProd(false);
    }
  };

  const handleAddSlide = async (e) => {
    e.preventDefault();
    if (!newSlideTitle.trim()) {
      showToast('لطفاً عنوان اسلاید را وارد نمایید.', 'error');
      return;
    }
    if (!newSlideImageBase64) {
      showToast('لطفاً تصویر اسلاید را بارگذاری نمایید.', 'error');
      return;
    }
    setIsSubmittingSlide(true);
    try {
      await slidesApi.create({
        title: newSlideTitle.trim(),
        subtitle: newSlideSubtitle.trim() || 'فروش ویژه طلا رایس',
        description: newSlideDesc.trim() || 'عرضه مستقیم با ضمانت صد در صدی کیفیت و پخت',
        ctaText: newSlideCta.trim() || 'مشاهده و خرید آنلاین',
        category: newSlideCategory,
        image: newSlideImageBase64
      });
      setNewSlideTitle('');
      setNewSlideSubtitle('');
      setNewSlideDesc('');
      setNewSlideImageBase64('');
      setShowAddSlideForm(false);
      fetchAdminSlides();
      showToast('اسلاید جدید با موفقیت اضافه شد.', 'success');
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'خطا در ثبت اسلاید جدید';
      showToast('خطا در افزودن اسلاید: ' + errMsg, 'error');
    } finally {
      setIsSubmittingSlide(false);
    }
  };

  const handleDeleteSlide = async (id) => {
    if (!window.confirm('آیا از حذف این اسلاید اطمینان دارید؟')) return;
    try {
      await slidesApi.delete(id);
      fetchAdminSlides();
      showToast('اسلاید با موفقیت حذف شد.', 'success');
    } catch (err) {
      showToast('خطا در حذف اسلاید', 'error');
    }
  };

  const handleEditSlideSubmit = async (e) => {
    e.preventDefault();
    if (!editingSlide) return;
    setIsUpdatingSlide(true);
    try {
      await slidesApi.update(editingSlide._id || editingSlide.id, {
        title: editSlideTitle.trim(),
        subtitle: editSlideSubtitle.trim(),
        description: editSlideDesc.trim(),
        ctaText: editSlideCta.trim(),
        category: editSlideCategory,
        image: editSlideImageBase64 || editingSlide.image
      });
      setEditingSlide(null);
      fetchAdminSlides();
      showToast('اسلاید با موفقیت ویرایش شد.', 'success');
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'خطا در بروزرسانی بنر';
      showToast('خطا در ویرایش اسلاید: ' + errMsg, 'error');
    } finally {
      setIsUpdatingSlide(false);
    }
  };

  const openEditProductModal = (p) => {
    setEditingProduct(p);
    setEditProdName(p.name || p.title || '');
    setEditProdPrice(p.price || '');
    const orig = p.originalPrice || p.price || '';
    setEditProdOriginalPrice(orig);

    const origNum = Number(orig);
    const priceNum = Number(p.price);
    let computedDiscount = p.discountPercent;
    if (!computedDiscount || computedDiscount === '0' || computedDiscount === 0) {
      if (origNum > 0 && priceNum > 0 && origNum > priceNum) {
        computedDiscount = Math.round(((origNum - priceNum) / origNum) * 100);
      } else {
        computedDiscount = '0';
      }
    }
    setEditProdDiscount(String(computedDiscount));

    setEditProdCategory(p.category || 'kamfirouz');
    setEditProdWeight(p.weight || '۱۰ کیلوگرم');
    setEditProdStock(p.stock !== undefined ? p.stock : (p.countInStock || '30'));
    setEditProdDesc(p.description || '');
    setEditProdIsAmazing(Boolean(p.isAmazing || amazingProducts.some(ap => ap.name === p.name || ap._id === (p._id || p.id) || ap.id === (p._id || p.id))));
    setEditProdImageBase64(p.image || '');
  };

  const openEditSlideModal = (s) => {
    setEditingSlide(s);
    setEditSlideTitle(s.title || '');
    setEditSlideSubtitle(s.subtitle || '');
    setEditSlideDesc(s.description || '');
    setEditSlideCta(s.ctaText || 'مشاهده و خرید آنلاین');
    setEditSlideCategory(s.category || 'all');
    setEditSlideImageBase64(s.image || '');
  };

  const handleVerifyReceipt = async (orderId, approved) => {
    try {
      await ordersApi.verifyPayment(orderId, { approved });
      showToast(approved ? 'فیش بانکی تایید شد.' : 'فیش بانکی رد شد.', 'success');
      fetchAdminOrders();
    } catch (err) {
      showToast('خطا در بررسی فیش بانکی', 'error');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await ordersApi.updateOrderStatus(orderId, { status: newStatus });
      showToast('وضعیت سفارش بروزرسانی شد.', 'success');
      fetchAdminOrders();
    } catch (err) {
      showToast('خطا در بروزرسانی وضعیت سفارش', 'error');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('آیا از حذف این سفارش اطمینان دارید؟')) return;
    try {
      await ordersApi.delete(orderId);
      showToast('سفارش با موفقیت حذف شد.', 'success');
      fetchAdminOrders();
    } catch (err) {
      showToast('خطا در حذف سفارش', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('آیا از حذف این کاربر اطمینان دارید؟')) return;
    try {
      await adminApi.deleteUser(userId);
      showToast('کاربر با موفقیت حذف شد.', 'success');
      fetchAdminUsers();
    } catch (err) {
      showToast('خطا در حذف کاربر', 'error');
    }
  };

  const handleUpdateUserRole = async (userId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await adminApi.updateUserRole(userId, nextRole);
      showToast('نقش کاربر بروزرسانی شد.', 'success');
      fetchAdminUsers();
    } catch (err) {
      try {
        await adminApi.updateUser(userId, { role: nextRole, isAdmin: nextRole === 'admin' });
        showToast('نقش کاربر بروزرسانی شد.', 'success');
        fetchAdminUsers();
      } catch (subErr) {
        showToast('خطا در تغییر نقش کاربر', 'error');
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('آیا از حذف این نظر اطمینان دارید؟')) return;
    try {
      await reviewsApi.delete(reviewId);
      showToast('نظر با موفقیت حذف شد.', 'success');
      fetchAdminReviews();
    } catch (err) {
      showToast('خطا در حذف نظر: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleReplyReview = async (reviewId) => {
    if (!replyInputText.trim()) {
      showToast('لطفاً متن پاسخ را وارد نمایید.', 'error');
      return;
    }
    setIsSubmittingReply(true);
    try {
      await reviewsApi.reply(reviewId, replyInputText.trim());
      showToast('پاسخ به نظر با موفقیت ارسال شد.', 'success');
      setReplyingReviewId(null);
      setReplyInputText('');
      fetchAdminReviews();
    } catch (err) {
      showToast('خطا در ارسال پاسخ: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <main className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <div className={styles.flexRow} style={{ alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h1 className={styles.pageTitle} style={{ margin: 0 }}>پنل مدیریت طلا رایس</h1>
            <span className={styles.badge} style={{ backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fde68a' }}>
              <ShieldCheck size={13} style={{ display: 'inline', verticalAlign: '-2px', marginLeft: '3px' }} />
              مدیر سیستم: {currentUser?.name || 'مدیر'}
            </span>
          </div>
          <p className={styles.pageSubtitle}>مدیریت کامل سفارش‌ها، محصولات، اسلایدرها و کاربران متصل به وب‌سرویس</p>
        </div>
        <div className={styles.flexRow}>
          <button
            type="button"
            className={styles.backButton}
            onClick={refreshAllAdminData}
            title="تازه‌سازی اطلاعات"
            disabled={isLoadingAll}
          >
            <RefreshCw size={15} className={isLoadingAll ? styles.spinner : ''} />
            بروزرسانی داده‌ها
          </button>
          <button type="button" className={styles.backButton} onClick={() => navigate('/profile')} title="حساب من">
            <Users size={15} />
            حساب من
          </button>
          <button type="button" className={styles.backButton} onClick={() => navigate('/')} title="فروشگاه">
            <ArrowRight size={15} />
            فروشگاه
          </button>
        </div>
      </header>

      {/* Overview Stats Component */}
      <AdminOverview
        stats={dashboardStats}
        adminOrders={adminOrders}
        products={products}
        sliders={sliders}
        adminUsers={adminUsers}
      />

      {/* منوی تب‌ها */}
      <nav className={styles.tabsList}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <TrendingUp size={16} />
          مدیریت سفارشات ({adminOrders.length})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'products' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={16} />
          مدیریت محصولات ({products.length})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'slides' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('slides')}
        >
          <Layers size={16} />
          اسلایدر و بنرها ({sliders?.length || 0})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          <MessageSquare size={16} />
          نظرات مشتریان ({allReviews.length})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'users' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={16} />
          کاربران سامانه ({adminUsers.length})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'amazing' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('amazing')}
        >
          <ShieldCheck size={16} />
          محصولات شگفت‌انگیز ({amazingProducts?.length || 0})
        </button>
      </nav>

      {/* تب‌ها */}
      {activeTab === 'overview' && (
        <AdminOrders
          adminOrders={adminOrders}
          isLoadingOrders={isLoadingOrders}
          fetchAdminOrders={fetchAdminOrders}
          orderSearchQuery={orderSearchQuery}
          setOrderSearchQuery={setOrderSearchQuery}
          orderStatusFilter={orderStatusFilter}
          setOrderStatusFilter={setOrderStatusFilter}
          getOrderStatusInfo={getOrderStatusInfo}
          setPreviewReceiptUrl={setPreviewReceiptUrl}
          handleVerifyReceipt={handleVerifyReceipt}
          setEditingTrackingOrderId={setEditingTrackingOrderId}
          setTrackingCodeInput={setTrackingCodeInput}
          setAdminNoteInput={setAdminNoteInput}
          handleUpdateStatus={handleUpdateStatus}
          handleDeleteOrder={handleDeleteOrder}
        />
      )}

      {activeTab === 'products' && (
        <AdminProducts
          products={products}
          productSearchQuery={productSearchQuery}
          setProductSearchQuery={setProductSearchQuery}
          showAddProdForm={showAddProdForm}
          setShowAddProdForm={setShowAddProdForm}
          handleAddProduct={handleAddProduct}
          newProdName={newProdName}
          setNewProdName={setNewProdName}
          newProdPrice={newProdPrice}
          setNewProdPrice={setNewProdPrice}
          newProdOriginalPrice={newProdOriginalPrice}
          setNewProdOriginalPrice={setNewProdOriginalPrice}
          newProdDiscount={newProdDiscount}
          setNewProdDiscount={setNewProdDiscount}
          newProdCategory={newProdCategory}
          setNewProdCategory={setNewProdCategory}
          newProdWeight={newProdWeight}
          setNewProdWeight={newProdWeight}
          newProdStock={newProdStock}
          setNewProdStock={newProdStock}
          newProdDesc={newProdDesc}
          setNewProdDesc={setNewProdDesc}
          newProdIsAmazing={newProdIsAmazing}
          setNewProdIsAmazing={setNewProdIsAmazing}
          newProdImageBase64={newProdImageBase64}
          setNewProdImageBase64={setNewProdImageBase64}
          isSubmittingProd={isSubmittingProd}
          openEditProductModal={openEditProductModal}
          handleDeleteProduct={handleDeleteProduct}
          handleNewPriceChange={handleNewPriceChange}
          handleNewOriginalPriceChange={handleNewOriginalPriceChange}
          handleNewDiscountChange={handleNewDiscountChange}
        />
      )}

      {activeTab === 'slides' && (
        <AdminSlides
          sliders={sliders}
          showAddSlideForm={showAddSlideForm}
          setShowAddSlideForm={setShowAddSlideForm}
          handleAddSlide={handleAddSlide}
          newSlideTitle={newSlideTitle}
          setNewSlideTitle={setNewSlideTitle}
          newSlideSubtitle={newSlideSubtitle}
          setNewSlideSubtitle={setNewSlideSubtitle}
          newSlideDesc={newSlideDesc}
          setNewSlideDesc={setNewSlideDesc}
          newSlideCta={newSlideCta}
          setNewSlideCta={newSlideCta}
          newSlideCategory={newSlideCategory}
          setNewSlideCategory={setNewSlideCategory}
          newSlideImageBase64={newSlideImageBase64}
          setNewSlideImageBase64={setNewSlideImageBase64}
          isSubmittingSlide={isSubmittingSlide}
          openEditSlideModal={openEditSlideModal}
          handleDeleteSlide={handleDeleteSlide}
        />
      )}

      {activeTab === 'users' && (
        <AdminUsers
          adminUsers={adminUsers}
          userSearchQuery={userSearchQuery}
          setUserSearchQuery={setUserSearchQuery}
          showAddUserModal={showAddUserModal}
          setShowAddUserModal={setShowAddUserModal}
          newUserName={newUserName}
          setNewUserName={setNewUserName}
          newUserPhone={newUserPhone}
          setNewUserPhone={setNewUserPhone}
          newUserEmail={newUserEmail}
          setNewUserEmail={setNewUserEmail}
          newUserPassword={newUserPassword}
          setNewUserPassword={setNewUserPassword}
          newUserRole={newUserRole}
          setNewUserRole={setNewUserRole}
          handleAddUser={handleAddUser}
          isSubmittingUser={isSubmittingUser}
          handleDeleteUser={handleDeleteUser}
          handleUpdateUserRole={handleUpdateUserRole}
        />
      )}

      {activeTab === 'reviews' && (
        <section className={styles.card}>
          <div className={styles.pageHeader}>
            <div>
              <h2 className={styles.pageTitle} style={{ margin: 0 }}>مدیریت نظرات خریداران</h2>
              <p className={styles.pageSubtitle}>بررسی، پاسخ و حذف نظرات ثبت‌شده روی محصولات فروشگاه</p>
            </div>
            <button
              type="button"
              className={styles.backButton}
              onClick={fetchAdminReviews}
              disabled={isLoadingReviews}
            >
              <RefreshCw size={14} className={isLoadingReviews ? styles.spinner : ''} />
              بروزرسانی نظرات
            </button>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              className={styles.input}
              placeholder="جستجو در نظرات بر اساس متن نظر یا نام کاربر..."
              value={reviewSearchQuery}
              onChange={(e) => setReviewSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.flexCol} style={{ gap: '0.75rem' }}>
            {isLoadingReviews ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>در حال بارگذاری نظرات...</div>
            ) : allReviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#78716c', background: '#fafaf9', borderRadius: '12px' }}>
                <MessageSquare style={{ margin: '0 auto 0.5rem auto', opacity: 0.5 }} />
                <p>هیچ نظری روی محصولات ثبت نشده است.</p>
              </div>
            ) : (
              allReviews
                .filter(r => {
                  if (!reviewSearchQuery.trim()) return true;
                  const q = reviewSearchQuery.toLowerCase().trim();
                  return (
                    String(r.comment || '').toLowerCase().includes(q) ||
                    String(r.userName || '').toLowerCase().includes(q) ||
                    String(r.product?.name || '').toLowerCase().includes(q)
                  );
                })
                .map((r) => {
                  const rid = r._id || r.id;
                  const isReplying = replyingReviewId === rid;
                  return (
                    <div key={rid} className={styles.statBox} style={{ border: '1px solid #e2e8f0', background: '#fff', padding: '1rem', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div>
                          <strong style={{ color: '#111827' }}>{r.userName || r.author || 'کاربر خریدار'}</strong>
                          <span style={{ fontSize: '0.8rem', color: '#6b7280', marginRight: '0.5rem' }}>
                            روی محصول: <strong>{r.product?.name || r.productName || 'برنج اصیل'}</strong>
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ background: '#fef3c7', color: '#d97706', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                            ★ {r.rating}
                          </span>
                          <button
                            type="button"
                            className={styles.btnSecondary}
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                            onClick={() => {
                              if (isReplying) {
                                setReplyingReviewId(null);
                                setReplyInputText('');
                              } else {
                                setReplyingReviewId(rid);
                                setReplyInputText(r.reply || '');
                              }
                            }}
                          >
                            {isReplying ? 'انصراف' : (r.reply ? 'ویرایش پاسخ' : 'پاسخ به نظر')}
                          </button>
                          <button
                            type="button"
                            className={styles.btnDanger}
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                            onClick={() => handleDeleteReview(rid)}
                          >
                            حذف نظر
                          </button>
                        </div>
                      </div>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#374151', fontSize: '0.9rem', lineHeight: 1.6 }}>{r.comment}</p>

                      {r.reply && !isReplying && (
                        <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', background: '#f0fdf4', borderRight: '3px solid #16a34a', borderRadius: '6px', fontSize: '0.85rem' }}>
                          <strong style={{ color: '#166534', display: 'block', marginBottom: '0.2rem' }}>پاسخ ثبت‌شده ادمین:</strong>
                          <span style={{ color: '#14532d' }}>{r.reply}</span>
                        </div>
                      )}

                      {isReplying && (
                        <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                            متن پاسخ مدیر به این نظر:
                          </label>
                          <textarea
                            className={styles.textarea}
                            rows={2}
                            placeholder="متن پاسخ رسمی فروشگاه را بنویسید..."
                            value={replyInputText}
                            onChange={(e) => setReplyInputText(e.target.value)}
                            style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}
                          />
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              type="button"
                              className={styles.btnPrimary}
                              style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                              disabled={isSubmittingReply}
                              onClick={() => handleReplyReview(rid)}
                            >
                              {isSubmittingReply ? 'در حال ارسال...' : 'ثبت پاسخ'}
                            </button>
                            <button
                              type="button"
                              className={styles.btnSecondary}
                              style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                              onClick={() => {
                                setReplyingReviewId(null);
                                setReplyInputText('');
                              }}
                            >
                              لغو
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
            )}
          </div>
        </section>
      )}

      {activeTab === 'amazing' && (
        <section className={styles.card}>
          <div className={styles.pageHeader}>
            <div>
              <h2 className={styles.pageTitle} style={{ margin: 0 }}>مدیریت محصولات شگفت‌انگیز</h2>
              <p className={styles.pageSubtitle}>مشاهده و مدیریت محصولات با پیشنهادهای تخفیف ویژه و شگفت‌انگیز</p>
            </div>
            <button
              type="button"
              className={styles.backButton}
              onClick={fetchAdminAmazing}
              disabled={isLoadingAmazing}
            >
              <RefreshCw size={14} className={isLoadingAmazing ? styles.spinner : ''} />
              بروزرسانی
            </button>
          </div>

          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', color: '#166534', fontSize: '0.875rem' }}>
            <p style={{ margin: 0 }}>
              <strong>راهنما:</strong> هر محصولی که در بخش مدیریت محصولات برای آن «تخفیف ویژه» (بیشتر از صفر درصد) تنظیم نمایید، به عنوان محصول شگفت‌انگیز علامت‌گذاری شده و در کادرهای پیشنهادهای داغ صفحه نخست قرار می‌گیرد.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {isLoadingAmazing ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: '#15803d' }}>در حال بارگذاری اطلاعات محصولات شگفت‌انگیز...</div>
            ) : amazingProducts.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem 2rem', border: '2px dashed #cbd5e1', borderRadius: '12px', color: '#64748b' }}>
                <p style={{ margin: '0 0 1rem 0' }}>در حال حاضر محصول شگفت‌انگیزی با تخفیف فعال در سیستم ثبت نشده است.</p>
                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={() => setActiveTab('products')}
                  style={{ fontSize: '0.875rem' }}
                >
                  افزودن تخفیف به محصولات
                </button>
              </div>
            ) : (
              amazingProducts.map((p) => {
                const discount = p.discountPercent || p.dealDiscountPercent || 12;
                const regPrice = p.price || 430000;
                const dealPrice = p.dealPrice || Math.round(regPrice * (1 - discount / 100));
                return (
                  <div key={p.id || p._id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', display: 'flex', gap: '1rem', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', position: 'relative' }}>
                    <img src={p.image} alt={p.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #f1f5f9' }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: '#1C3A27', fontWeight: 'bold' }}>{p.name}</h4>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          <span style={{ background: '#fecdd3', color: '#be123c', padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                            {discount}٪ تخفیف
                          </span>
                          <span style={{ background: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                            شگفت‌انگیز فعال
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '8px' }}>
                        <div>
                          <del style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{Number(regPrice).toLocaleString('fa-IR')} تومان</del>
                          <div style={{ fontWeight: 'bold', color: '#15803d', fontSize: '0.9rem' }}>
                            {Number(dealPrice).toLocaleString('fa-IR')} <small style={{ fontSize: '0.7rem' }}>تومان</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* Modal for Receipt Preview */}
      {previewReceiptUrl && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem', color: '#1C3A27' }}>تصویر فیش واریزی</h3>
            <img src={previewReceiptUrl} alt="فیش بانکی" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e2e8f0' }} />
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => setPreviewReceiptUrl(null)}
            >
              بستن تصویر
            </button>
          </div>
        </div>
      )}

      {/* Modal for Editing Product */}
      {editingProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#1C3A27', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit size={20} />
                ویرایش محصول: {editingProduct.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>نام محصول</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={editProdName}
                  onChange={(e) => setEditProdName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>قیمت نهایی فروش (تومان)</label>
                  <input
                    type="number"
                    required
                    className={styles.input}
                    value={editProdPrice}
                    onChange={(e) => handleEditPriceChange(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>قیمت اصلی / خط‌خورده (تومان)</label>
                  <input
                    type="number"
                    required
                    className={styles.input}
                    value={editProdOriginalPrice}
                    onChange={(e) => handleEditOriginalPriceChange(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                    تخفیف (درصد) <span style={{ fontSize: '0.75rem', color: '#16a34a' }}>محاسبه خودکار ٪</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className={styles.input}
                    value={editProdDiscount}
                    onChange={(e) => handleEditDiscountChange(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>موجودی انبار</label>
                  <input
                    type="number"
                    required
                    className={styles.input}
                    value={editProdStock}
                    onChange={(e) => setEditProdStock(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>توضیحات محصول</label>
                <textarea
                  className={styles.input}
                  rows={3}
                  value={editProdDesc}
                  onChange={(e) => setEditProdDesc(e.target.value)}
                />
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                background: editProdIsAmazing ? '#fef2f2' : '#f8fafc',
                border: editProdIsAmazing ? '1.5px solid #f87171' : '1px solid #e2e8f0',
                borderRadius: '10px',
                transition: 'all 0.2s ease'
              }}>
                <input
                  type="checkbox"
                  id="editProdIsAmazing"
                  checked={editProdIsAmazing}
                  onChange={(e) => setEditProdIsAmazing(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#dc2626', cursor: 'pointer' }}
                />
                <label htmlFor="editProdIsAmazing" style={{ fontSize: '0.875rem', fontWeight: 600, color: editProdIsAmazing ? '#991b1b' : '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🔥 قرار گرفتن در بخش پیشنهادهای شگفت‌انگیز (فروش ویژه)
                </label>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>تصویر محصول <span style={{ color: '#cbd5e1' }}>(اختیاری برای تغییر)</span></label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  {editProdImageBase64 && (
                    <img src={editProdImageBase64} alt="پیش‌نمایش" style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileChangeHelper(e.target.files[0], setEditProdImageBase64);
                      }
                    }}
                    style={{ fontSize: '0.8rem', color: '#475569' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className={styles.backButton}
                  onClick={() => setEditingProduct(null)}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className={styles.btnPrimary}
                  disabled={isUpdatingProd}
                >
                  {isUpdatingProd ? 'در حال اعمال...' : 'اعمال تغییرات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Editing Slide */}
      {editingSlide && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', maxWidth: '500px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#1C3A27', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit size={20} />
                ویرایش اسلاید بنر صفحه اصلی
              </h3>
              <button
                type="button"
                onClick={() => setEditingSlide(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSlideSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>عنوان اسلاید</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={editSlideTitle}
                  onChange={(e) => setEditSlideTitle(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>عنوان فرعی</label>
                <input
                  type="text"
                  className={styles.input}
                  value={editSlideSubtitle}
                  onChange={(e) => setEditSlideSubtitle(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>توضیحات بنر</label>
                <textarea
                  className={styles.input}
                  rows={2}
                  value={editSlideDesc}
                  onChange={(e) => setEditSlideDesc(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>متن دکمه (CTA)</label>
                <input
                  type="text"
                  className={styles.input}
                  value={editSlideCta}
                  onChange={(e) => setEditSlideCta(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>تصویر اسلاید <span style={{ color: '#cbd5e1' }}>(اختیاری برای تغییر)</span></label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  {editSlideImageBase64 && (
                    <img src={editSlideImageBase64} alt="پیش‌نمایش" style={{ width: '84px', height: '56px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileChangeHelper(e.target.files[0], setEditSlideImageBase64);
                      }
                    }}
                    style={{ fontSize: '0.8rem', color: '#475569' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className={styles.backButton}
                  onClick={() => setEditingSlide(null)}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className={styles.btnPrimary}
                  disabled={isUpdatingSlide}
                >
                  {isUpdatingSlide ? 'در حال اعمال...' : 'اعمال تغییرات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export { Admin };
