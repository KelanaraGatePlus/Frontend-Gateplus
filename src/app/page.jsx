/* eslint-disable react/react-in-jsx-scope */
"use client";
import Navbar from "@/components/Navbar/page";
import SliderBannerPage from "@/components/BannerPromoSlider/page";
import CategoryMenu from "@/components/CategoryMenu/page";
import CarouselNewest from "@/components/Carousel/CarouselHome/carouselNewest";
import CarouselHighlight from "@/components/Carousel/CarouselHome/carouselHighlight";
import CarouselTopTen from "@/components/Carousel/CarouselHome/carouselTopTen";
import CarouselLastSeen from "@/components/Carousel/CarouselHome/carouselLastSeen";
import CarouselRecommendations from "@/components/Carousel/CarouselHome/carouselRecommendation";
import CarouselPopularEbooks from "@/components/Carousel/CarouselHome/carouselPopularEbooks";
import CarouselPopularComics from "@/components/Carousel/CarouselHome/carouselPopularComics";
import CarouselPopularPodcasts from "@/components/Carousel/CarouselHome/carouselPopularPodcasts";
import Footer from "@/components/Footer/MainFooter";
import "@splidejs/react-splide/css";

export default function HomePage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      <div className="mt-15 flex flex-col md:mt-[85px]">
        <SliderBannerPage />
        <main className="flex flex-col px-3 md:mx-5 md:px-0">
          <CategoryMenu />
          <CarouselNewest />
          <CarouselHighlight />
          <CarouselTopTen />
          <CarouselLastSeen />
          <CarouselRecommendations />
          <CarouselPopularEbooks />
          <CarouselPopularComics />
          <CarouselPopularPodcasts />
        </main>
      </div>
    </div>
  );
}
