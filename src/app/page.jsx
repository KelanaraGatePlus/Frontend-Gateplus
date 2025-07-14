/* eslint-disable react/react-in-jsx-scope */
"use client";
import SliderBannerPage from "@/components/BannerPromoSlider/page";
import CarouselEbook from "@/components/Carousel/CarouselEbook/page";
import CarouselComic from "@/components/Carousel/CarouselComic/page";
import CarouselPodcast from "@/components/Carousel/CarouselPodcast/page";
import CarouselNewest from "@/components/Carousel/CarouselHome/carouselNewest";
import CarouselHighlight from "@/components/Carousel/CarouselHome/carouselHighlight";
import CarouselTopTen from "@/components/Carousel/CarouselHome/carouselTopTen";
import CategoryPage from "@/components/CategoryPage/page";
import Footer from "@/components/Footer/page";
import Navbar from "@/components/Navbar/page";
import "@splidejs/react-splide/css";

export default function HomePage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      <Navbar />
      <div className="mt-15 flex flex-col md:mt-[85px]">
        <SliderBannerPage />
        <main className="flex flex-col px-3 md:mx-5 md:px-0">
          <CategoryPage />
          <CarouselNewest />
          <CarouselHighlight />
          <CarouselTopTen />
          <CarouselEbook />
          <CarouselComic />
          <CarouselPodcast />
        </main>
        <Footer />
      </div>
    </div>
  );
}
