import React from 'react';
import { SEO } from '../../components/SEO';
import { HeroSlider } from '../../components/heroSlider';
import { TrustBar } from '../../components/trustBar';
import { AmazingDeals } from '../../components/amazingDeals';
import { BestSellers } from '../../components/bestSellers';
import { BrandStory } from '../../components/brandStory';
import { CustomerReviews } from '../../components/customerReviews';
import { Footer } from '../../components/footer';
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
  return (
    <div className={styles.homeWrapper} dir="rtl">
      <SEO
        title="فروشگاه طلا رایس | خرید مستقیم برنج اصیل کامفیروزی از شالیزار"
        description="خرید آنلاین برنج اصیل، خوش‌عطر و ری‌کشیده کامفیروزی فارس مستقیم از کشاورز با تضمین پخت و بازگشت وجه در فروشگاه طلا رایس."
        keywords="برنج کامفیروز, خرید برنج کامفیروزی, برنج معطر کامفیروز فارس, برنج اصیل ایرانی, فروشگاه برنج طلا رایس, برنج ارگانیک"
      />
      {homeSections.map(function ({ id, component: Component }) {
        return <Component key={id} />;
      })}
    </div>
  );
}

export default HomePage;
