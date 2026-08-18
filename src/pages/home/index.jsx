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

export const HomePage = () => {
  return (
    <div className={`pb-12 ${styles.homeWrapper}`}>
      <HeroSlider />
      <TrustBar />
      <AmazingDeals />
      <Categories />
      <BestSellers />
      <BrandStory />
      <CustomerReviews />
      <Footer />
    </div>
  );
};
