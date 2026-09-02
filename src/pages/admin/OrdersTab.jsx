import React, { useState, useMemo } from 'react';
import { useApp } from '../../context';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Eye,
  Search,
  X,
  FileText,
  MapPin,
  Phone,
  User,
  Check,
  Image as ImageIcon,
  Save,
  Send,
  AlertCircle,
  ExternalLink,
  Printer,
  ChevronLeft,
  ChevronRight,
  Copy,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  CreditCard,
  Layers,
  Loader2
} from 'lucide-react';
import styles from './style.module.css';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export function OrdersTab() {
  const {
    orders,
    setOrders,
    products,
    updateOrderStatus,
    updateOrder,
    deleteOrder,
    verifyOrderPayment,
    showToast,
    showSuccess,
    showError
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmOrder, setDeleteConfirmOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Inspector inputs
  const [postTrackingInput, setPostTrackingInput] = useState('');
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Add / Edit Form State
  const initialOrderForm = {
    customerName: '',
    phone: '',
    address: '',
    postalCode: '',
    productId: products?.[0]?.id || '',
    quantity: 1,
    unitPrice: products?.[0]?.price || 1450000,
    shippingFee: 0,
    totalPrice: products?.[0]?.price || 1450000,
    status: 'pending',
    paymentStatus: 'paid',
    paymentMethod: 'gateway',
    postTrackingCode: '',
    adminNote: ''
  };

  const [formData, setFormData] = useState(initialOrderForm);
  const [formErrors, setFormErrors] = useState({});

  function toEnglishDigits(str) {
    if (!str) return '';
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
    for (let i = 0; i < 10; i++) {
      str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
    }
    return str;
  }

  function handleFieldChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function handleSelectOrder(o) {
    setSelectedOrder(o);
    setPostTrackingInput(o.postTrackingCode || o.trackingCode || '');
    setAdminNoteInput(o.adminNote || '');
  }

  function openAddModal() {
    const firstP = products?.[0];
    const initialPrice = firstP?.price || 1450000;
    setEditingOrder(null);
    setFormData({
      customerName: '',
      phone: '',
      address: '',
      postalCode: '',
      productId: firstP?.id || '',
      quantity: 1,
      unitPrice: initialPrice,
      shippingFee: 0,
      totalPrice: initialPrice,
      status: 'pending',
      paymentStatus: 'paid',
      paymentMethod: 'manual',
      postTrackingCode: '',
      adminNote: ''
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  }

  function openEditModal(order) {
    setEditingOrder(order);
    const orderItems = order.products || order.items || [];
    const firstItem = orderItems[0];
    const unitPrice = firstItem?.price || firstItem?.product?.price || order.totalPrice || 1450000;
    const quantity = firstItem?.quantity || 1;

    setFormData({
      customerName: order.name || order.recipientName || order.user?.name || '',
      phone: order.phone || order.user?.phone || '',
      address: order.address || order.fullAddress || '',
      postalCode: order.postalCode || '',
      productId: firstItem?.product?.id || firstItem?.productId || products?.[0]?.id || '',
      quantity: quantity,
      unitPrice: unitPrice,
      shippingFee: Number(order.shippingFee || 0),
      totalPrice: Number(order.totalPrice || order.finalAmount || order.totalAmount || (unitPrice * quantity)),
      status: order.state || order.status || 'pending',
      paymentStatus: order.paymentStatus || (order.isPaid ? 'paid' : 'pending'),
      paymentMethod: order.paymentMethod || 'gateway',
      postTrackingCode: order.postTrackingCode || order.trackingCode || '',
      adminNote: order.adminNote || ''
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  }

  function handleProductChange(prodId) {
    const p = products?.find(item => String(item.id) === String(prodId));
    const uPrice = p ? p.price : formData.unitPrice;
    setFormData(prev => ({
      ...prev,
      productId: prodId,
      unitPrice: uPrice,
      totalPrice: (uPrice * prev.quantity) + prev.shippingFee
    }));
  }

  function handleQuantityChange(qty) {
    const q = Math.max(1, Number(qty) || 1);
    setFormData(prev => ({
      ...prev,
      quantity: q,
      totalPrice: (prev.unitPrice * q) + prev.shippingFee
    }));
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    const cleanName = formData.customerName.trim();
    const cleanPhone = toEnglishDigits(formData.phone.trim());
    const cleanAddress = formData.address.trim();
    const newErrors = {};

    if (!cleanName) {
      newErrors.customerName = 'لطفاً نام و نام خانوادگی خریدار را وارد فرمایید.';
    }

    if (!cleanPhone) {
      newErrors.phone = 'لطفاً شماره تماس خریدار را وارد فرمایید.';
    } else if (!/^09\d{9}$/.test(cleanPhone)) {
      newErrors.phone = 'شماره موبایل باید ۱۱ رقمی و با ۰۹ شروع شود.';
    }

    if (!cleanAddress) {
      newErrors.address = 'لطفاً نشانی کامل تحویل سفارش را وارد فرمایید.';
    }

    if (!formData.totalPrice || Number(formData.totalPrice) <= 0) {
      newErrors.totalPrice = 'مبلغ سفارش نامعتبر است.';
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setIsUpdating(true);
    setFormErrors({});

    const selProduct = products?.find(p => String(p.id) === String(formData.productId)) || {
      id: formData.productId,
      name: 'برنج کامفیروزی اعلا ممتاز طلا رایس',
      price: formData.unitPrice
    };

    const payload = {
      name: formData.customerName.trim(),
      recipientName: formData.customerName.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      fullAddress: formData.address.trim(),
      postalCode: formData.postalCode.trim(),
      state: formData.status,
      status: formData.status,
      paymentStatus: formData.paymentStatus,
      paymentMethod: formData.paymentMethod,
      isPaid: formData.paymentStatus === 'paid' || formData.paymentStatus === 'completed',
      postTrackingCode: formData.postTrackingCode.trim(),
      trackingCode: formData.postTrackingCode.trim(),
      adminNote: formData.adminNote.trim(),
      totalPrice: Number(formData.totalPrice),
      finalAmount: Number(formData.totalPrice),
      totalAmount: Number(formData.totalPrice),
      shippingFee: Number(formData.shippingFee),
      items: [
        {
          product: selProduct,
          name: selProduct.name,
          price: formData.unitPrice,
          quantity: formData.quantity
        }
      ],
      products: [
        {
          product: selProduct,
          name: selProduct.name,
          price: formData.unitPrice,
          quantity: formData.quantity
        }
      ]
    };

    try {
      if (editingOrder) {
        const orderId = editingOrder.id || editingOrder._id;
        if (updateOrder) {
          await updateOrder(orderId, payload);
        } else {
          setOrders(prev => prev.map(o => (o.id === orderId || o._id === orderId ? { ...o, ...payload } : o)));
        }
        showSuccess(`سفارش شماره ${String(orderId).slice(-8).toUpperCase()} با موفقیت به‌روزرسانی شد.`);
      } else {
        const newOrderId = `ORD-${Date.now().toString().slice(-6)}`;
        const createdOrder = {
          id: newOrderId,
          _id: newOrderId,
          ...payload,
          createdAt: new Date().toISOString(),
          date: new Date().toISOString().split('T')[0]
        };

        setOrders(prev => [createdOrder, ...prev]);
        showSuccess(`سفارش جدید "${newOrderId}" با موفقیت ثبت شد.`);
      }

      setIsAddModalOpen(false);
      setEditingOrder(null);
      setFormData(initialOrderForm);
    } catch (err) {
      showError(err, editingOrder ? 'ویرایش سفارش' : 'ثبت سفارش');
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDeleteOrder(order) {
    const orderId = order.id || order._id;
    try {
      if (deleteOrder) {
        await deleteOrder(orderId);
      } else {
        setOrders(prev => prev.filter(o => o.id !== orderId && o._id !== orderId));
      }
      setDeleteConfirmOrder(null);
      if (selectedOrder && (selectedOrder.id === orderId || selectedOrder._id === orderId)) {
        setSelectedOrder(null);
      }
      showSuccess('سفارش مورد نظر با موفقیت حذف گردید.');
    } catch (err) {
      showError(err, 'حذف سفارش');
    }
  }

  async function handleUpdateStatus(newStatus) {
    if (!selectedOrder) return;
    setIsUpdating(true);
    const orderId = selectedOrder.id || selectedOrder._id;
    try {
      if (updateOrderStatus) {
        await updateOrderStatus(orderId, newStatus, {
          postTrackingCode: postTrackingInput,
          adminNote: adminNoteInput
        });
      }
      setSelectedOrder(prev => ({
        ...prev,
        state: newStatus,
        status: newStatus,
        postTrackingCode: postTrackingInput,
        adminNote: adminNoteInput
      }));
      showSuccess(`وضعیت سفارش به "${newStatus}" تغییر یافت.`);
    } catch (err) {
      showError(err, 'به‌روزرسانی سفارش');
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleVerifyReceipt(isVerified) {
    if (!selectedOrder) return;
    setIsUpdating(true);
    const orderId = selectedOrder.id || selectedOrder._id;
    try {
      if (verifyOrderPayment) {
        await verifyOrderPayment(orderId, isVerified);
      }
      setSelectedOrder(prev => ({
        ...prev,
        paymentStatus: isVerified ? 'completed' : 'failed'
      }));
      showSuccess(isVerified ? 'فیش بانکی تایید شد.' : 'فیش بانکی رد شد.');
    } catch (err) {
      showError(err, 'بررسی فیش واریزی');
    } finally {
      setIsUpdating(false);
    }
  }

  function handleCopyTracking(code) {
    if (!code) return;
    navigator.clipboard.writeText(code);
    showSuccess('کد ۲۴ رقمی پستی در حافظه کپی شد.');
  }

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const orderId = String(o.id || o._id || '');
      const tracking = String(o.postTrackingCode || o.trackingCode || '');
      const customerName = o.name || o.user?.name || o.recipientName || '';
      const customerPhone = o.phone || o.user?.phone || '';
      const postalCode = o.postalCode || '';

      const s = search.toLowerCase();
      const matchesSearch =
        !search ||
        orderId.toLowerCase().includes(s) ||
        tracking.toLowerCase().includes(s) ||
        customerName.toLowerCase().includes(s) ||
        customerPhone.includes(search) ||
        postalCode.includes(search);

      const state = o.state || o.status || 'pending';
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'pending' && (state === 'pending' || state === 'reviewing')) ||
        (statusFilter === 'processing' && (state === 'processing' || state === 'shipping')) ||
        (statusFilter === 'shipped' && state === 'shipped') ||
        (statusFilter === 'delivered' && state === 'delivered') ||
        state === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  const pendingCount = orders.filter(o => {
    const s = o.state || o.status;
    return s === 'pending' || s === 'reviewing';
  }).length;

  const processingCount = orders.filter(o => {
    const s = o.state || o.status;
    return s === 'processing' || s === 'shipping';
  }).length;

  const shippedCount = orders.filter(o => (o.state || o.status) === 'shipped').length;
  const deliveredCount = orders.filter(o => (o.state || o.status) === 'delivered').length;

  return (
    <div>
      {/* Header */}
      <div className={styles.tabHeader}>
        <div>
          <h1 className={styles.tabTitle}>
            <span>مدیریت مرسولات، فاکتورها و سفارشات پستی</span>
          </h1>
          <p className={styles.tabSubtitle}>
            ثبت سفارش جدید، ویرایش فاکتور، درج کد رهگیری ۲۴ رقمی پست پیشتاز، تایید فیش و صدور صورتحساب
          </p>
        </div>
        <button onClick={openAddModal} className={styles.addBtn}>
          <Plus size={19} strokeWidth={2.5} />
          <span>ثبت سفارش جدید</span>
        </button>
      </div>

      {/* Main Card */}
      <div className={styles.card}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="جستجو در شماره سفارش، نام خریدار، تلفن یا کد رهگیری پستی..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              className={styles.searchInput}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
              className={`${styles.filterChip} ${statusFilter === 'all' ? styles.filterChipActive : ''}`}
            >
              همه ({orders.length})
            </button>
            <button
              onClick={() => { setStatusFilter('pending'); setCurrentPage(1); }}
              className={`${styles.filterChip} ${statusFilter === 'pending' ? styles.filterChipActive : ''}`}
            >
              بررسی و فیش ({pendingCount})
            </button>
            <button
              onClick={() => { setStatusFilter('processing'); setCurrentPage(1); }}
              className={`${styles.filterChip} ${statusFilter === 'processing' ? styles.filterChipActive : ''}`}
            >
              بسته‌بندی انبار ({processingCount})
            </button>
            <button
              onClick={() => { setStatusFilter('shipped'); setCurrentPage(1); }}
              className={`${styles.filterChip} ${statusFilter === 'shipped' ? styles.filterChipActive : ''}`}
            >
              ارسال پستی ({shippedCount})
            </button>
            <button
              onClick={() => { setStatusFilter('delivered'); setCurrentPage(1); }}
              className={`${styles.filterChip} ${statusFilter === 'delivered' ? styles.filterChipActive : ''}`}
            >
              تحویل شده ({deliveredCount})
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className={styles.tableContainer}>
          {filteredOrders.length === 0 ? (
            <div className={styles.emptyState}>
              <Package size={56} className={styles.emptyIcon} />
              <p className={styles.emptyText}>هیچ سفارشی با مشخصات مورد نظر یافت نشد</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>شناسه سفارش</th>
                    <th className={styles.th}>مشخصات خریدار</th>
                    <th className={styles.th}>تاریخ ثبت</th>
                    <th className={styles.th}>مبلغ کل</th>
                    <th className={styles.th}>پرداخت و فیش</th>
                    <th className={styles.th}>وضعیت مرسوله</th>
                    <th className={styles.th} style={{ textAlign: 'center' }}>عملیات و فاکتور</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map(o => {
                    const id = o.id || o._id;
                    const customerName = o.name || o.user?.name || o.recipientName || 'مشتری طلا رایس';
                    const customerPhone = o.phone || o.user?.phone || 'ثبت نشده';
                    const amount = o.totalPrice || o.finalAmount || o.totalAmount || 0;
                    const state = o.state || o.status || 'pending';

                    return (
                      <tr key={id} className={styles.tr}>
                        {/* Order code */}
                        <td className={styles.td}>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '0.8125rem',
                              fontWeight: 800,
                              color: '#042a1b',
                              backgroundColor: '#f1f5f9',
                              padding: '0.3125rem 0.625rem',
                              borderRadius: '0.5rem',
                              border: '1px solid #e2e8f0',
                              display: 'inline-block'
                            }}
                          >
                            {String(id).slice(-8).toUpperCase()}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className={styles.td}>
                          <div style={{ fontWeight: 800, color: '#042a1b', fontSize: '0.875rem' }}>
                            {customerName}
                          </div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginTop: '0.125rem' }}>
                            {customerPhone}
                          </div>
                        </td>

                        {/* Date */}
                        <td className={styles.td}>
                          <span style={{ fontSize: '0.8125rem', color: '#475569', fontWeight: 600 }}>
                            {o.date || o.createdAt?.split('T')[0] || 'امروز'}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className={styles.td}>
                          <span className={styles.priceText}>{Number(amount).toLocaleString('fa-IR')}</span>{' '}
                          <span className={styles.currency}>تومان</span>
                        </td>

                        {/* Payment & Receipt badge */}
                        <td className={styles.td}>
                          {o.paymentReceipt ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              background: '#f0fdf4',
                              color: '#166534',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '0.35rem',
                              fontSize: '0.725rem',
                              fontWeight: 800,
                              border: '1px solid #86efac'
                            }}>
                              <ImageIcon size={12} />
                              دارای فیش
                            </span>
                          ) : o.paymentMethod === 'card' ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              background: '#fffbeb',
                              color: '#b45309',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '0.35rem',
                              fontSize: '0.725rem',
                              fontWeight: 800,
                              border: '1px solid #fde68a'
                            }}>
                              کارت به کارت
                            </span>
                          ) : (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              background: '#f1f5f9',
                              color: '#475569',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '0.35rem',
                              fontSize: '0.725rem',
                              fontWeight: 800
                            }}>
                              درگاه آنلاین
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className={styles.td}>
                          {(state === 'pending' || state === 'reviewing') && (
                            <span className={styles.statusProcessing}>
                              <Clock size={13} />
                              در انتظار بررسی
                            </span>
                          )}
                          {(state === 'processing' || state === 'shipping') && (
                            <span
                              className={styles.statusShipped}
                              style={{ backgroundColor: '#f0f9ff', color: '#0284c7', borderColor: '#bae6fd' }}
                            >
                              <Package size={13} />
                              در حال بسته‌بندی
                            </span>
                          )}
                          {state === 'shipped' && (
                            <span
                              className={styles.statusShipped}
                              style={{ backgroundColor: '#f5f3ff', color: '#7c3aed', borderColor: '#ddd6fe' }}
                            >
                              <Truck size={13} />
                              تحویل پست شده
                            </span>
                          )}
                          {state === 'delivered' && (
                            <span className={styles.statusDelivered}>
                              <CheckCircle2 size={13} />
                              تحویل شده
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className={styles.td} style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              onClick={() => handleSelectOrder(o)}
                              className={styles.detailBtn}
                              title="مشاهده فاکتور و مدیریت مرسوله"
                            >
                              <Eye size={14} />
                              <span>فاکتور</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => openEditModal(o)}
                              className={styles.detailBtn}
                              style={{ color: '#0284c7', borderColor: '#bae6fd', background: '#f0f9ff' }}
                              title="ویرایش اطلاعات سفارش"
                            >
                              <Edit2 size={14} />
                              <span>ویرایش</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteConfirmOrder(o)}
                              className={styles.detailBtn}
                              style={{ color: '#dc2626', borderColor: '#fecaca', background: '#fef2f2' }}
                              title="حذف سفارش"
                            >
                              <Trash2 size={14} />
                              <span>حذف</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredOrders.length > pageSize && (
          <div className={styles.paginationContainer}>
            <span className={styles.paginationInfo}>
              نمایش {((currentPage - 1) * pageSize) + 1} تا {Math.min(currentPage * pageSize, filteredOrders.length)} از {filteredOrders.length} سفارش
            </span>

            <div className={styles.paginationButtons}>
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={styles.pageBtn}
                title="صفحه قبل"
              >
                <ChevronRight size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`${styles.pageBtn} ${currentPage === page ? styles.pageBtnActive : ''}`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={styles.pageBtn}
                title="صفحه بعد"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteConfirmOrder)}
        onClose={() => setDeleteConfirmOrder(null)}
        onConfirm={() => handleDeleteOrder(deleteConfirmOrder)}
        title="تأیید حذف سفارش"
        itemType="شناسه سفارش"
        itemName={deleteConfirmOrder ? `#${String(deleteConfirmOrder.id || deleteConfirmOrder._id).slice(-8).toUpperCase()} - ${deleteConfirmOrder.name || 'مشتری'}` : ''}
        message="آیا از حذف دائمی این فاکتور و سفارش از سیستم اطمینان دارید؟ این عملیات قابل بازگشت نخواهد بود."
        confirmText="حذف قطعی سفارش"
      />

      {/* Add / Edit Order Modal */}
      {isAddModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAddModalOpen(false)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>
                  {editingOrder ? `ویرایش سفارش: ${String(editingOrder.id || editingOrder._id).slice(-8).toUpperCase()}` : 'ثبت سفارش دستی جدید توسط مدیر'}
                </h3>
                <p className={styles.modalDesc}>مشخصات خریدار، محصول انتخابی، هزینه، آدرس و وضعیت مرسوله را وارد کنید.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className={styles.modalCloseBtn}
                aria-label="بستن"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalContent}>
              <form onSubmit={handleFormSubmit} noValidate className={styles.form}>
                <div className={styles.formGrid}>
                  {/* Customer Name */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>نام و نام خانوادگی خریدار *</label>
                    <input
                      type="text"
                      placeholder="مثال: علیرضا مرادی"
                      value={formData.customerName}
                      onChange={e => handleFieldChange('customerName', e.target.value)}
                      className={`${styles.input} ${formErrors.customerName ? styles.inputError : ''}`}
                      style={formErrors.customerName ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}}
                    />
                    {formErrors.customerName && (
                      <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, marginTop: '3px', display: 'block' }}>
                        {formErrors.customerName}
                      </span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>شماره تماس خریدار *</label>
                    <input
                      type="tel"
                      placeholder="۰۹۱۷۰۰۰۰۰۰۰"
                      value={formData.phone}
                      onChange={e => handleFieldChange('phone', e.target.value)}
                      className={`${styles.input} ${formErrors.phone ? styles.inputError : ''}`}
                      style={formErrors.phone ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}}
                      dir="ltr"
                    />
                    {formErrors.phone && (
                      <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, marginTop: '3px', display: 'block' }}>
                        {formErrors.phone}
                      </span>
                    )}
                  </div>

                  {/* Product Selection */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>انتخاب محصول برنج:</label>
                    <select
                      value={formData.productId}
                      onChange={e => handleProductChange(e.target.value)}
                      className={styles.select}
                    >
                      {products?.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} - {Number(p.price).toLocaleString('fa-IR')} تومان
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>تعداد کیسه (تعداد):</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={e => handleQuantityChange(e.target.value)}
                      className={styles.input}
                    />
                  </div>

                  {/* Total Price */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>مبلغ کل سفارش (تومان) *</label>
                    <input
                      type="number"
                      value={formData.totalPrice}
                      onChange={e => handleFieldChange('totalPrice', Number(e.target.value))}
                      className={`${styles.input} ${formErrors.totalPrice ? styles.inputError : ''}`}
                      style={formErrors.totalPrice ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}}
                    />
                    {formErrors.totalPrice && (
                      <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, marginTop: '3px', display: 'block' }}>
                        {formErrors.totalPrice}
                      </span>
                    )}
                  </div>

                  {/* Order Status */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>وضعیت پردازش سفارش:</label>
                    <select
                      value={formData.status}
                      onChange={e => handleFieldChange('status', e.target.value)}
                      className={styles.select}
                    >
                      <option value="pending">در انتظار بررسی فیش</option>
                      <option value="processing">در حال آماده‌سازی و بسته‌بندی</option>
                      <option value="shipped">تحویل پست شده (ارسال شده)</option>
                      <option value="delivered">تحویل به مشتری داده شده</option>
                    </select>
                  </div>

                  {/* Payment Method */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>روش پرداخت:</label>
                    <select
                      value={formData.paymentMethod}
                      onChange={e => handleFieldChange('paymentMethod', e.target.value)}
                      className={styles.select}
                    >
                      <option value="gateway">درگاه پرداخت اینترنتی</option>
                      <option value="card">کارت به کارت / فیش بانکی</option>
                      <option value="manual">ثبت دستی ادمین</option>
                    </select>
                  </div>

                  {/* Payment Status */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>وضعیت پرداخت:</label>
                    <select
                      value={formData.paymentStatus}
                      onChange={e => handleFieldChange('paymentStatus', e.target.value)}
                      className={styles.select}
                    >
                      <option value="paid">پرداخت شده و تایید شده</option>
                      <option value="pending">در انتظار واریز یا تایید فیش</option>
                      <option value="failed">ناموفق / رد شده</option>
                    </select>
                  </div>

                  {/* Postal Code */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>کد پستی ۱۰ رقمی:</label>
                    <input
                      type="text"
                      placeholder="7194712345"
                      value={formData.postalCode}
                      onChange={e => handleFieldChange('postalCode', e.target.value)}
                      className={styles.input}
                      dir="ltr"
                    />
                  </div>

                  {/* Postal Tracking Code */}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>کد ۲۴ رقمی رهگیری پست پیشتاز:</label>
                    <input
                      type="text"
                      placeholder="293847560182736452918273"
                      value={formData.postTrackingCode}
                      onChange={e => handleFieldChange('postTrackingCode', e.target.value)}
                      className={styles.input}
                      dir="ltr"
                    />
                  </div>

                  {/* Address */}
                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>نشانی کامل پستی تحویل *</label>
                    <input
                      type="text"
                      placeholder="استان، شهر، خیابان، کوچه، پلاک، واحد..."
                      value={formData.address}
                      onChange={e => handleFieldChange('address', e.target.value)}
                      className={`${styles.input} ${formErrors.address ? styles.inputError : ''}`}
                      style={formErrors.address ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}}
                    />
                    {formErrors.address && (
                      <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, marginTop: '3px', display: 'block' }}>
                        {formErrors.address}
                      </span>
                    )}
                  </div>

                  {/* Admin Note */}
                  <div className={`${styles.formGroup} ${styles.fullCol}`}>
                    <label className={styles.label}>یادداشت و پیام واحد لجستیک برای مشتری:</label>
                    <input
                      type="text"
                      placeholder="مثال: بسته‌بندی شد و با پست پیشتاز ارسال گردید."
                      value={formData.adminNote}
                      onChange={e => handleFieldChange('adminNote', e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className={styles.cancelBtn}
                    disabled={isUpdating}
                  >
                    انصراف
                  </button>
                  <button type="submit" className={styles.submitBtn} disabled={isUpdating}>
                    {isUpdating ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Loader2 size={16} className="animate-spin" />
                        <span>در حال ذخیره...</span>
                      </span>
                    ) : (
                      <span>{editingOrder ? 'ذخیره تغییرات سفارش' : 'ثبت سفارش در سیستم'}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Order Details / Invoice Modal */}
      {selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>مدیریت مرسوله، فیش بانکی و فاکتور</h3>
                <p className={styles.modalDesc}>
                  شناسه سفارش: {String(selectedOrder.id || selectedOrder._id).slice(-8).toUpperCase()} | تاریخ: {selectedOrder.date || selectedOrder.createdAt?.split('T')[0] || 'امروز'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className={styles.modalCloseBtn}
                  title="چاپ فاکتور رسمی"
                  style={{ color: '#073822' }}
                >
                  <Printer size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className={styles.modalCloseBtn}
                  aria-label="بستن پنجره"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.orderInspector}>
                {/* Status Chips */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.775rem', fontWeight: 800, color: '#042a1b' }}>
                    تغییر مرحله و وضعیت سفارش:
                  </label>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus('pending')}
                      disabled={isUpdating}
                      className={`${styles.filterChip} ${(selectedOrder.state || selectedOrder.status) === 'pending' ? styles.filterChipActive : ''}`}
                    >
                      در انتظار بررسی
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus('processing')}
                      disabled={isUpdating}
                      className={`${styles.filterChip} ${(selectedOrder.state || selectedOrder.status) === 'processing' ? styles.filterChipActive : ''}`}
                    >
                      در حال بسته‌بندی انبار
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus('shipped')}
                      disabled={isUpdating}
                      className={`${styles.filterChip} ${(selectedOrder.state || selectedOrder.status) === 'shipped' ? styles.filterChipActive : ''}`}
                    >
                      تحویل به پست (ارسال شده)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus('delivered')}
                      disabled={isUpdating}
                      className={`${styles.filterChip} ${(selectedOrder.state || selectedOrder.status) === 'delivered' ? styles.filterChipActive : ''}`}
                    >
                      تحویل داده شده
                    </button>
                  </div>
                </div>

                {/* Postal Tracking Code & Admin Note Inputs */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  padding: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '0.775rem', fontWeight: 800, color: '#042a1b' }}>
                        کد ۲۴ رقمی رهگیری پست پیشتاز:
                      </label>
                      {postTrackingInput && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => handleCopyTracking(postTrackingInput)}
                            style={{ background: 'none', border: 'none', color: '#073822', fontSize: '0.725rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                          >
                            <Copy size={12} /> کپی کد
                          </button>
                          <a
                            href="https://tracking.post.ir/"
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: '#0284c7', fontSize: '0.725rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none' }}
                          >
                            <ExternalLink size={12} /> سامانه رهگیری پست
                          </a>
                        </div>
                      )}
                    </div>
                    <input
                      type="text"
                      dir="ltr"
                      value={postTrackingInput}
                      onChange={e => setPostTrackingInput(e.target.value)}
                      placeholder="مثال: ۲۹۳۸۴۷۵۶۰۱۸۲۷۳۶۴۵۲۹۱۸۲۷۳"
                      style={{
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.825rem',
                        fontFamily: 'monospace',
                        fontWeight: 700
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.775rem', fontWeight: 800, color: '#042a1b' }}>
                      پیام و اطلاعیه واحد لجستیک برای مشتری:
                    </label>
                    <input
                      type="text"
                      value={adminNoteInput}
                      onChange={e => setAdminNoteInput(e.target.value)}
                      placeholder="مثال: کیسه برنج بسته‌بندی شد و تحویل باجه مرکزی پست شیراز گردید."
                      style={{
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.825rem'
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedOrder.state || selectedOrder.status || 'pending')}
                    disabled={isUpdating}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      background: '#073822',
                      color: '#fef08a',
                      border: 'none',
                      padding: '0.55rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    <Save size={15} />
                    <span>ثبت کد رهگیری و بروزرسانی اطلاعات مرسوله</span>
                  </button>
                </div>

                {/* Payment Receipt Verification */}
                {selectedOrder.paymentReceipt && (
                  <div style={{
                    background: '#f0fdf4',
                    border: '1.5px solid #86efac',
                    borderRadius: '0.75rem',
                    padding: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 800, color: '#166534' }}>
                      <ImageIcon size={16} />
                      <span>تصویر فیش واریزی ارسالی توسط مشتری:</span>
                    </div>
                    <img
                      src={selectedOrder.paymentReceipt}
                      alt="فیش بانکی"
                      style={{
                        maxHeight: '220px',
                        objectFit: 'contain',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => handleVerifyReceipt(true)}
                        disabled={isUpdating}
                        style={{
                          flex: 1,
                          background: '#16a34a',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.45rem',
                          borderRadius: '0.4rem',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        تأیید صحت واریز
                      </button>
                      <button
                        type="button"
                        onClick={() => handleVerifyReceipt(false)}
                        disabled={isUpdating}
                        style={{
                          flex: 1,
                          background: '#dc2626',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.45rem',
                          borderRadius: '0.4rem',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        رد فیش واریزی
                      </button>
                    </div>
                  </div>
                )}

                {/* Customer Information */}
                <div className={styles.invoiceSection}>
                  <h4 className={styles.invoiceSectionTitle}>
                    <User size={15} /> مشخصات تحویل‌گیرنده و نشانی پستی
                  </h4>
                  <div className={styles.invoiceRow}>
                    <span className={styles.invoiceLabel}>نام و نام خانوادگی:</span>
                    <span className={styles.invoiceVal}>
                      {selectedOrder.name || selectedOrder.recipientName || selectedOrder.user?.name || 'مشتری طلا رایس'}
                    </span>
                  </div>
                  <div className={styles.invoiceRow}>
                    <span className={styles.invoiceLabel}>شماره تماس خریدار:</span>
                    <span className={styles.invoiceVal} dir="ltr">
                      {selectedOrder.phone || selectedOrder.user?.phone || '۰۹۱۷۰۰۰۰۰۰۰'}
                    </span>
                  </div>
                  <div className={styles.invoiceRow}>
                    <span className={styles.invoiceLabel}>کد پستی ۱۰ رقمی:</span>
                    <span className={styles.invoiceVal} dir="ltr">
                      {selectedOrder.postalCode || '۷۱۹۴۷۱۲۳۴۵'}
                    </span>
                  </div>
                  <div className={styles.invoiceRow}>
                    <span className={styles.invoiceLabel}>نشانی کامل پستی:</span>
                    <span className={styles.invoiceVal} style={{ textAlign: 'left', maxWidth: '65%' }}>
                      {selectedOrder.address || selectedOrder.fullAddress || 'شیراز، فارس'}
                    </span>
                  </div>
                </div>

                {/* Items Ordered */}
                <div className={styles.invoiceSection}>
                  <h4 className={styles.invoiceSectionTitle}>
                    <Package size={15} /> اقلام سفارش داده شده
                  </h4>
                  <div className={styles.invoiceItemList}>
                    {(selectedOrder.products || selectedOrder.items || []).map((item, idx) => {
                      const pName = item.product?.name || item.name || 'برنج کامفیروزی ممتاز اعلا';
                      const pPrice = Number(item.price || item.product?.price || 1450000);
                      const pQty = Number(item.quantity || 1);

                      return (
                        <div key={idx} className={styles.invoiceItemCard}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.8125rem', color: '#042a1b' }}>
                              {pName}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.125rem' }}>
                              کیسه نخی اعلا | تعداد: {pQty} کیسه
                            </div>
                          </div>
                          <div style={{ fontWeight: 900, color: '#042a1b', fontSize: '0.8125rem' }}>
                            {(pPrice * pQty).toLocaleString('fa-IR')} تومان
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className={styles.invoiceSection}>
                  <h4 className={styles.invoiceSectionTitle}>
                    <FileText size={15} /> خلاصه مالی فاکتور
                  </h4>
                  <div
                    className={styles.invoiceRow}
                    style={{
                      borderTop: '1px solid #cbd5e1',
                      paddingTop: '0.5rem',
                      marginTop: '0.25rem'
                    }}
                  >
                    <span style={{ fontWeight: 900, color: '#042a1b', fontSize: '0.9375rem' }}>
                      مبلغ کل فاکتور:
                    </span>
                    <span style={{ fontWeight: 900, color: '#042a1b', fontSize: '1.0625rem' }}>
                      {Number(
                        selectedOrder.totalPrice ||
                        selectedOrder.finalAmount ||
                        selectedOrder.totalAmount ||
                        0
                      ).toLocaleString('fa-IR')}{' '}
                      تومان
                    </span>
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className={styles.cancelBtn}
                    style={{ width: '100%' }}
                  >
                    بستن پنجره مدیریت
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersTab;
