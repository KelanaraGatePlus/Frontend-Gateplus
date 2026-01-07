/* eslint-disable react/react-in-jsx-scope */
"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import SliderBannerPage from "@/components/BannerPromoSlider/page";
import CategoryMenu from "@/components/CategoryMenu/page";
import CarouselNewest from "@/components/Carousel/CarouselHome/carouselNewest";
import CarouselHighlight from "@/components/Carousel/CarouselHome/carouselHighlight";
import CarouselTopTen from "@/components/Carousel/CarouselHome/carouselTopTen";
import "@splidejs/react-splide/css";
import CarouselLoading from "@/components/Carousel/CarouselLoading";

// Dynamic imports
const CarouselLastSeen = dynamic(() => import("@/components/Carousel/CarouselHome/carouselLastSeen"), {
  ssr: false,
});
const CarouselRecommendations = dynamic(() => import("@/components/Carousel/CarouselHome/carouselRecommendation"), {
  ssr: false,
});
const CarouselPopularEbooks = dynamic(() => import("@/components/Carousel/CarouselHome/carouselPopularEbooks"), {
  ssr: false,
});
const CarouselPopularComics = dynamic(() => import("@/components/Carousel/CarouselHome/carouselPopularComics"), {
  ssr: false,
});
const CarouselPopularPodcasts = dynamic(() => import("@/components/Carousel/CarouselHome/carouselPopularPodcasts"), {
  ssr: false,
});
const CarouselPopularMovies = dynamic(() => import("@/components/Carousel/CarouselHome/carouselPopularMovie"), {
  ssr: false,
});
const CarouselPopularSeries = dynamic(() => import("@/components/Carousel/CarouselHome/carouselPopularSeries"), {
  ssr: false,
});

export default function HomePage() {
  // Group the remaining carousels into pairs (or single last group)
  const groups = [
    [CarouselLastSeen, CarouselRecommendations],
    [CarouselPopularEbooks, CarouselPopularComics],
    [CarouselPopularPodcasts, CarouselPopularMovies],
    [CarouselPopularSeries],
  ];

  const groupCount = groups.length;
  const [loadedGroups, setLoadedGroups] = useState(() => Array(groupCount).fill(false));
  const refs = useRef([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-group-index"));
            setLoadedGroups((prev) => {
              if (prev[idx]) return prev;
              const next = [...prev];
              next[idx] = true;
              return next;
            });
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -40% 0px", // Trigger lebih awal dari bawah layar
        threshold: 0.1, // 10% elemen harus terlihat
      }
    );

    refs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [groupCount]);

  // {useEffect(() => {
  //   // blok klik kanan
  //   document.addEventListener("contextmenu", (e) => e.preventDefault());

  //   // blok CTRL+C, CTRL+U, CTRL+S
  //   document.addEventListener("keydown", (e) => {
  //     if (e.ctrlKey && ["c", "u", "s",].includes(e.key.toLowerCase())) {
  //       e.preventDefault();
  //     }
  //   });
  // }, []);}

  return (
    <div className="flex flex-col overflow-x-hidden">
      <head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </head>

      <div className="flex flex-col">
        <SliderBannerPage />

        <main className="flex flex-col px-3 md:mx-5 md:px-0">
          <CategoryMenu />

          {/* Load immediately */}
          <CarouselNewest />
          <CarouselHighlight />
          <CarouselTopTen />

          {/* Lazy load groups */}
          {groups.map((group, idx) => {
            const CompA = group[0];
            const CompB = group[1];
            return (
              <section
                key={idx}
                data-group-index={idx}
                ref={(el) => (refs.current[idx] = el)}
                className="my-6 min-h-[14rem] md:min-h-[16rem]"
              >
                {loadedGroups[idx] ? (
                  <>
                    {CompA ? <CompA /> : null}
                    {CompB ? <CompB /> : null}
                  </>
                ) : (
                  <CarouselLoading />
                )}
              </section>
            );
          })}
        </main>
      </div>
    </div>
  );
}
