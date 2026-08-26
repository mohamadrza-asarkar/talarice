import React from 'react';
import { HeroSlider } from '../../components/heroSlider';
import { TrustBar } from '../../components/trustBar';
import { AmazingDeals } from '../../components/amazingDeals';
import { Categories } from '../../components/categories';
import { BestSellers } from '../../components/bestSellers';
import { BrandStory } from '../../components/brandStory';
import { CustomerReviews } from '../../components/customerReviews';
import { Footer } from '../../components/footer';

export function HomePage() {
  return (
    <div className="flex flex-col gap-6 py-4 px-3">
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
}

export default HomePage;
