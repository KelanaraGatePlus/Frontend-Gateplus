/* eslint-disable react/react-in-jsx-scope */
"use client";

import SliderBannerPage from "@/components/BannerPromoSlider/page";
import CarouselEbook from "@/components/CarouselEbook/page";
import CarouselComic from "@/components/CarouselComic/page";
import CategoryPage from "@/components/CategoryPage/page";
import Footer from "@/components/Footer/page";
import Navbar from "@/components/Navbar/page";
import "@splidejs/react-splide/css";

export default function HomePage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      <Navbar />
      <div className="mt-15 flex flex-col md:mt-24">
        <SliderBannerPage />
        <main className="flex flex-col px-3 md:mx-5 md:px-0">
          <CategoryPage />
          <CarouselEbook />
          <CarouselComic />
        </main>
        <Footer />
      </div>
    </div>
  );
}
