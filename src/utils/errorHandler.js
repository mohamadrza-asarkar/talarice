/**
 * Intelligent Error & Maintenance Handler
 * Categorizes errors into Server/System issues vs User/Validation issues
 */

export function toPersianDigits(str) {
  if (str === null || str === undefined) return '';
  const s = String(str);
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return s.replace(/\d/g, d => persianDigits[d]);
}

/**
 * Parses and categorizes errors for optimal user experience
 */
export function parseApiError(err) {
  if (!err) {
    return {
      statusCode: 500,
      errorType: 'SERVER_ERROR',
      isServerError: true,
      isUserError: false,
      title: 'خطای سرور و سیستم',
      message: 'سرور در حال حاضر پاسخگو نیست یا در حال به‌روزرسانی است. لطفاً چند لحظه بعد مجدداً امتحان کنید.',
      errors: null,
      displayText: '[سرور در حال به‌روزرسانی] لطفاً اندکی بعد مجدداً تلاش کنید.'
    };
  }

  // If already parsed
  if (err.errorType && err.userFriendlyTitle) {
    return err;
  }

  const respData = err.response?.data || (typeof err === 'object' && !err.response ? err : {});
  const rawStatus = err.statusCode || respData.statusCode || err.response?.status || (err.code === 'ERR_NETWORK' ? 'NETWORK_ERROR' : 500);
  const status = Number(rawStatus) || (rawStatus === 'NETWORK_ERROR' ? 'NETWORK_ERROR' : 500);

  const rawMessage = respData.message || err.message || '';
  const errors = respData.errors || err.errors || null;

  // Determine error category
  const isNetwork = status === 'NETWORK_ERROR' || err.code === 'ERR_NETWORK' || rawMessage.includes('Network Error');
  const isServerError = isNetwork || (typeof status === 'number' && status >= 500);
  const isValidation = status === 400 || status === 422;
  const isAuth = status === 401 || status === 403;
  const isNotFound = status === 404;
  const isUserError = isValidation || isAuth || isNotFound || (typeof status === 'number' && status >= 400 && status < 500);

  let errorType = 'UNKNOWN';
  let title = 'خطا در عملیات';
  let message = rawMessage;
  let actionAdvice = '';

  if (isNetwork) {
    errorType = 'NETWORK_ERROR';
    title = 'عدم ارتباط با سرور';
    message = 'ارتباط با سرور طلا رایس برقرار نشد. سرور ممکن است در حال به‌روزرسانی باشد یا اتصال اینترنت شما ناپایدار است.';
    actionAdvice = 'لطفاً وضعیت اتصال اینترنت خود را بررسی کرده یا دقایقی دیگر مجدداً صفحه را بارگذاری فرمایید.';
  } else if (status === 503) {
    errorType = 'SERVER_MAINTENANCE';
    title = 'سرور در حال به‌روزرسانی و ارتقا';
    message = 'سامانه در حال ارتقا و بهینه‌سازی زیرساخت است. تا لحظاتی دیگر در دسترس خواهد بود.';
    actionAdvice = 'لطفاً چند دقیقه شکیبا باشید و سپس مجدداً امتحان کنید.';
  } else if (isServerError) {
    errorType = 'SERVER_ERROR';
    title = 'خطای داخلی سامانه';
    message = rawMessage || 'مشکلی در پردازش درخواست سمت سرور رخ داده است (احتمال به‌روزرسانی سرویس).';
    actionAdvice = 'تیم فنی در حال بررسی است. لطفاً کمی بعد دوباره امتحان فرمایید.';
  } else if (isValidation) {
    errorType = 'VALIDATION_ERROR';
    title = 'خطا در فرمت و اطلاعات ورودی';
    
    // Check specific validation keywords
    const lower = rawMessage.toLowerCase();
    if (lower.includes('شماره') || lower.includes('phone') || lower.includes('موبایل')) {
      message = 'فرمت شماره موبایل وارد شده صحیح نمی‌باشد (مثال معتبر: 09121234567).';
    } else if (lower.includes('رمز') || lower.includes('password') || lower.includes('پسورد')) {
      message = 'کلمه عبور وارد شده نامعتبر یا کوتاه‌تر از حد مجاز است.';
    } else if (lower.includes('کد تخفیف') || lower.includes('coupon')) {
      message = 'کد تخفیف وارد شده معتبر نبوده یا منقضی شده است.';
    } else if (lower.includes('موجودی') || lower.includes('انبار') || lower.includes('stock')) {
      message = 'موجودی کالای انتخاب شده کافی نمی‌باشد.';
    } else if (rawMessage) {
      message = rawMessage;
    } else {
      message = 'برخی از مقادیر یا فیلدهای فرم به درستی پر نشده‌اند. لطفاً فرمت‌های انتخابی را بازبینی کنید.';
    }
    actionAdvice = 'لطفاً فیلدهای مشخص شده را اصلاح کرده و مجدداً دکمه تایید را بزنید.';
  } else if (isAuth) {
    errorType = 'AUTH_ERROR';
    title = status === 403 ? 'عدم دسترسی' : 'نیاز به ورود به حساب کاربری';
    message = rawMessage || (status === 403 ? 'شما اجازه دسترسی به این بخش را ندارید.' : 'برای انجام این عملیات ابتدا وارد حساب کاربری خود شوید.');
    actionAdvice = status === 401 ? 'لطفاً از منوی ورود وارد حساب خود شوید.' : 'در صورت نیاز با پشتیبانی تماس حاصل فرمایید.';
  } else if (isNotFound) {
    errorType = 'NOT_FOUND';
    title = 'موردی یافت نشد';
    message = rawMessage || 'آیتم، کالا یا صفحه مورد نظر در سامانه موجود نمی‌باشد.';
    actionAdvice = 'لطفاً از طریق دسته‌بندی‌ها یا جستجو، کالای دیگری را بررسی نمایید.';
  } else {
    errorType = 'CLIENT_ERROR';
    title = 'خطا در درخواست کاربر';
    message = rawMessage || 'درخواست ارسالی معتبر نمی‌باشد.';
  }

  // Format field details if available
  let fieldDetails = '';
  if (errors && typeof errors === 'object' && Object.keys(errors).length > 0) {
    fieldDetails = Object.entries(errors)
      .map(([field, msg]) => {
        const faField = field === 'phone' ? 'شماره موبایل' :
                        field === 'password' ? 'کلمه عبور' :
                        field === 'name' ? 'نام و نام خانوادگی' :
                        field === 'address' ? 'آدرس' :
                        field === 'title' ? 'عنوان' :
                        field === 'price' ? 'قیمت' : field;
        return `${faField}: ${msg}`;
      })
      .join(' | ');
  }

  const statusLabel = isNetwork ? 'شبکه' : toPersianDigits(status);
  let displayText = isServerError
    ? `[سرور]: ${message}`
    : `[خطای ورودی]: ${message}`;

  if (fieldDetails) {
    displayText += ` (${fieldDetails})`;
  }

  return {
    statusCode: status,
    errorType,
    isServerError,
    isUserError,
    title,
    userFriendlyTitle: title,
    message,
    actionAdvice,
    errors,
    fieldDetails,
    displayText
  };
}

export default parseApiError;
