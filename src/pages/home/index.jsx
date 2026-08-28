import React from 'react';
import { useApp } from '../../context';
import { HeroSlider } from '../../components/heroSlider';
import { TrustBar } from '../../components/trustBar';
import { AmazingDeals } from '../../components/amazingDeals';
import { BestSellers } from '../../components/bestSellers';
import { BrandStory } from '../../components/brandStory';
import { CustomerReviews } from '../../components/customerReviews';
import { Footer } from '../../components/footer';
import { Wifi, WifiOff, Loader2, RefreshCw, Server, Info, Database } from 'lucide-react';
import styles from './style.module.css';

const homeSections = [
  { id: 'hero', component: HeroSlider },
  { id: 'trust', component: TrustBar },
  { id: 'deals', component: AmazingDeals },
  { id: 'bestsellers', component: BestSellers },
  { id: 'story', component: BrandStory },
  { id: 'reviews', component: CustomerReviews },
  { id: 'footer', component: Footer }
];

export function HomePage() {
  const { 
    products, 
    heroSlides, 
    isConnecting, 
    connectionError, 
    refreshData 
  } = useApp();

  const [apiUrlInput, setApiUrlInput] = React.useState(function () {
    return localStorage.getItem('tala_api_url') || 'http://localhost:5000/api';
  });
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  function handleSaveUrl(e) {
    e.preventDefault();
    localStorage.setItem('tala_api_url', apiUrlInput.trim());
    setSaveSuccess(true);
    setTimeout(function () {
      window.location.reload();
    }, 1000);
  }

  function handleResetUrl() {
    localStorage.removeItem('tala_api_url');
    setApiUrlInput('http://localhost:5000/api');
    setSaveSuccess(true);
    setTimeout(function () {
      window.location.reload();
    }, 1000);
  }

  if (isConnecting) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-slate-50" dir="rtl">
        <Loader2 className="w-12 h-12 animate-spin text-amber-500 mb-4" />
        <p className="text-slate-600 font-medium">در حال اتصال به سرور بک‌بند شما...</p>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center p-4 bg-slate-50" dir="rtl">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 text-right transition-all duration-300">
          
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                <WifiOff className="w-10 h-10" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md border border-slate-50">
                <div className="w-4.5 h-4.5 rounded-full flex items-center justify-center bg-red-500">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </div>
              </div>
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-xl md:text-2xl font-bold text-center text-slate-800 mb-3">
            عدم برقراری ارتباط با بک‌بند (localhost:5000)
          </h2>

          {/* Explanation */}
          <p className="text-slate-600 text-sm md:text-base leading-relaxed text-center mb-6">
            فرانت‌اند نتوانست به آدرس سرور محصولات متصل شود. لطفاً مطمئن شوید بک‌بند شما به درستی در پورت ۵۰۰۰ ران شده است.
          </p>

          {/* Troubleshooting steps */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-6 space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm border-b pb-2">
              <Info className="w-4 h-4 text-amber-500" />
              <span>سه راهکار سریع برای برطرف کردن اتصال و ران شدن فرانت‌اند:</span>
            </h3>
            
            <ul className="space-y-3 text-xs md:text-sm text-slate-600 list-decimal list-inside pr-1">
              <li className="leading-relaxed">
                <strong className="text-slate-800">لغو انسداد مرورگر (مهم‌ترین دلیل):</strong>
                <div className="mt-1 mr-4 text-slate-500 space-y-1">
                  <p>از آنجایی که این پیش‌نویس در بستر امن <code className="bg-slate-100 px-1 rounded">https</code> لود شده، مرورگرها به دلایل امنیتی مانع ارسال درخواست به <code className="bg-slate-100 px-1 rounded">http://localhost</code> می‌شوند.</p>
                  <p className="text-amber-700 font-semibold">حل سریع در کروم:</p>
                  <p>روی علامت تنظیمات (یا قفل) سمت چپ آدرس‌بار همین صفحه کلیک کنید ➔ وارد <strong className="text-slate-700">Site Settings</strong> شوید ➔ گزینه <strong className="text-slate-700">Insecure content</strong> را پیدا کرده و روی <strong className="text-slate-700">Allow</strong> بگذارید و صفحه را رفرش کنید.</p>
                </div>
              </li>
              
              <li className="leading-relaxed">
                <strong className="text-slate-800">استفاده از آدرس امن یا تونل Ngrok:</strong>
                <div className="mt-1 mr-4 text-slate-500">
                  <p>اگر از ابزار رایگان <code className="bg-slate-100 px-1 rounded">ngrok</code> استفاده می‌کنید، دستور <code className="bg-slate-100 px-1 rounded">ngrok http 5000</code> را بزنید و آدرس امن خروجی آن (که با <code className="bg-slate-100 px-1 rounded">https</code> شروع می‌شود) را در کادر زیر وارد کنید تا بدون نیاز به تغییر تنظیمات مرورگر، فوراً متصل شود.</p>
                </div>
              </li>

              <li className="leading-relaxed">
                <strong className="text-slate-800">اجرای هر دو بخش به صورت لوکال (کاملاً آفلاین):</strong>
                <div className="mt-1 mr-4 text-slate-500">
                  <p>می‌توانید فایل ZIP کامل پروژه را از منوی بالا سمت راست دانلود کرده، دستور <code className="bg-slate-100 px-1 rounded">npm install</code> و سپس <code className="bg-slate-100 px-1 rounded">npm run dev</code> را در سیستم خود بزنید تا فرانت‌اند نیز روی همردهٔ بک‌اند لود شود.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Configurable URL Box */}
          <form onSubmit={handleSaveUrl} className="bg-amber-50/50 rounded-xl p-4 border border-amber-100 mb-6 text-right space-y-3">
            <label className="block text-xs md:text-sm font-semibold text-slate-700">
              آدرس وب‌سرویس فعلی فرانت‌اند:
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={apiUrlInput}
                onChange={function (e) { setApiUrlInput(e.target.value); }}
                dir="ltr"
                placeholder="http://localhost:5000/api"
                className="flex-1 bg-white border border-slate-200 p-2.5 rounded-lg text-sm text-left font-mono focus:outline-none focus:border-amber-500"
              />
              <button 
                type="submit"
                className="px-4 py-2.5 bg-amber-500 text-white font-semibold text-xs md:text-sm rounded-lg hover:bg-amber-600 transition cursor-pointer shrink-0"
              >
                ذخیره و اعمال
              </button>
            </div>
            
            <div className="flex justify-between items-center pt-1 text-2xs text-slate-400">
              <span>می‌توانید پورت یا آدرس را تغییر دهید.</span>
              <button 
                type="button" 
                onClick={handleResetUrl}
                className="text-amber-600 hover:text-amber-800 underline cursor-pointer"
              >
                بازنشانی به پیش‌فرض (پورت ۵۰۰۰)
              </button>
            </div>

            {saveSuccess && (
              <div className="text-xs text-center text-emerald-600 font-bold bg-emerald-50 p-2 rounded">
                تنظیمات با موفقیت ذخیره شد. در حال بارگذاری مجدد...
              </div>
            )}
          </form>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={refreshData}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl transition-all shadow-md cursor-pointer text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>تلاش مجدد فرانت‌ند</span>
            </button>
            
            <a
              href="/admin"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-all text-sm"
            >
              <Server className="w-4 h-4 text-slate-400" />
              <span>تست ورود به پنل ادمین</span>
            </a>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className={styles.homeWrapper}>
      {homeSections.map(function ({ id, component: Component }) {
        return <Component key={id} />;
      })}
    </div>
  );
}

export default HomePage;
