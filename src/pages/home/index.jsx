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

  const isEmptyAndOffline = (!products || products.length === 0) && (!heroSlides || heroSlides.length === 0);

  if (isEmptyAndOffline) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50/50" dir="rtl">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 text-center transition-all duration-300">
          
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 animate-pulse">
                {isConnecting ? (
                  <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
                ) : connectionError ? (
                  <WifiOff className="w-10 h-10 text-red-500" />
                ) : (
                  <Database className="w-10 h-10 text-blue-500" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md border border-slate-50">
                <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center ${
                  isConnecting ? 'bg-amber-500 animate-ping' : connectionError ? 'bg-red-500' : 'bg-emerald-500'
                }`}>
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </div>
              </div>
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-3">
            {isConnecting ? (
              'در حال اتصال به پایگاه‌داده و سرور...'
            ) : connectionError ? (
              'خطا در برقراری ارتباط با سرور'
            ) : (
              'پایگاه داده خالی است'
            )}
          </h2>

          {/* Description */}
          <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-6">
            {isConnecting ? (
              'سیستم در حال تلاش برای برقراری ارتباط با سرویس ابری و دریافت ساختار اطلاعات است...'
            ) : connectionError ? (
              'امکان اتصال به آدرس وب‌سرویس وجود ندارد. لطفاً اطمینان حاصل کنید که دیتابیس و بک‌اند شما با موفقیت ران شده و پاسخگو هستند.'
            ) : (
              'اتصال با سرور برقرار شد، اما هیچ محصولی در دیتابیس یافت نشد. می‌توانید با ورود به پنل مدیریت، محصولات خود را اضافه کنید.'
            )}
          </p>

          {/* Live Indicator Alert */}
          <div className="bg-slate-50 rounded-xl p-4 text-right border border-slate-100 mb-6 space-y-2.5">
            <div className="flex items-center gap-2 text-slate-700 text-xs md:text-sm font-medium">
              <Server className="w-4 h-4 text-slate-400" />
              <span>آدرس سرور فعلی:</span>
            </div>
            <code className="block bg-slate-100 p-2.5 rounded text-xs text-left text-slate-600 font-mono select-all overflow-x-auto whitespace-nowrap">
              https://ais-dev-rpvkewlvjilhjnoamjgjvq-240344892228.europe-west1.run.app/api
            </code>

            <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50/50 p-2 rounded border border-amber-100/50 mt-2">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                سیستم هر <b>۶ ثانیه</b> به طور خودکار مجدداً تلاش می‌کند. با ران شدن بک‌اند شما، صفحه فوراً بارگذاری می‌شود.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={refreshData}
              disabled={isConnecting}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-medium rounded-xl transition-all shadow-md shadow-amber-500/10 cursor-pointer text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isConnecting ? 'animate-spin' : ''}`} />
              <span>تلاش مجدد دستی</span>
            </button>
            
            <a
              href="/admin"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-all text-sm"
            >
              <Server className="w-4 h-4 text-slate-400" />
              <span>ورود به پنل ادمین</span>
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
