import React from 'react';
import { HeroSlider } from '../../components/heroSlider';
import { TrustBar } from '../../components/trustBar';
import { AmazingDeals } from '../../components/amazingDeals';
import { Categories } from '../../components/categories';
import { BestSellers } from '../../components/bestSellers';
import { BrandStory } from '../../components/brandStory';
import { CustomerReviews } from '../../components/customerReviews';
import { Footer } from '../../components/footer';
import styles from './style.module.css';

const homeSections = [
  { id: 'hero', component: HeroSlider },
  { id: 'trust', component: TrustBar },
  { id: 'deals', component: AmazingDeals },
  { id: 'categories', component: Categories },
  { id: 'bestsellers', component: BestSellers },
  { id: 'story', component: BrandStory },
  { id: 'reviews', component: CustomerReviews },
  { id: 'footer', component: Footer }
];

export const HomePage = () => {
  return (
    <div className={styles.homeWrapper}>
      {homeSections.map(({ id, component: Component }) => (
        <Component key={id} />
      ))}
    </div>
  );
};

