/* eslint-disable react/react-in-jsx-scope */
"use client";

import { useEffect, useRef, useState, useCallback } from "react"; // Tambah useCallback
import dynamic from "next/dynamic";
import SliderBannerPage from "@/components/BannerPromoSlider/page";
import CategoryMenu from "@/components/CategoryMenu/page";
import CarouselNewest from "@/components/Carousel/CarouselHome/carouselNewest";
import CarouselHighlight from "@/components/Carousel/CarouselHome/carouselHighlight";
import CarouselTopTen from "@/components/Carousel/CarouselHome/carouselTopTen";
import "@splidejs/react-splide/css";
import CarouselLoading from "@/components/Carousel/CarouselLoading";
import getMinAge from "@/lib/helper/minAge";
import useSyncUserData from "@/hooks/api/useSyncUserData";

// Dynamic imports tetap sama...
const CarouselLastSeen = dynamic(
  () => import("@/components/Carousel/CarouselHome/carouselLastSeen"),
  { ssr: false },
);
const CarouselRecommendations = dynamic(
  () => import("@/components/Carousel/CarouselHome/carouselRecommendation"),
  { ssr: false },
);
const CarouselPopularEbooks = dynamic(
  () => import("@/components/Carousel/CarouselHome/carouselPopularEbooks"),
  { ssr: false },
);
const CarouselPopularComics = dynamic(
  () => import("@/components/Carousel/CarouselHome/carouselPopularComics"),
  { ssr: false },
);
const CarouselPopularPodcasts = dynamic(
  () => import("@/components/Carousel/CarouselHome/carouselPopularPodcasts"),
  { ssr: false },
);
const CarouselPopularMovies = dynamic(
  () => import("@/components/Carousel/CarouselHome/carouselPopularMovie"),
  { ssr: false },
);
const CarouselPopularSeries = dynamic(
  () => import("@/components/Carousel/CarouselHome/carouselPopularSeries"),
  { ssr: false },
);

export default function HomePage() {
  const groups = [
    [CarouselLastSeen, CarouselRecommendations],
    [CarouselPopularEbooks, CarouselPopularComics],
    [CarouselPopularPodcasts, CarouselPopularMovies],
    [CarouselPopularSeries],
  ];

  const groupCount = groups.length;
  const [loadedGroups, setLoadedGroups] = useState(() =>
    Array(groupCount).fill(false),
  );
  const refs = useRef([]);
  const [banners, setBanners] = useState([]);
  const { userAge, isReady } = useSyncUserData();

  // Intersection observer tetap sama...
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
      { root: null, rootMargin: "0px 0px -40% 0px", threshold: 0.1 },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [groupCount]);

  const isBlurred = useCallback(
    (content) => {
      if (!isReady) return true;

      const minAge = getMinAge(content?.ageRestriction);

      // SU / R13 → tidak diblur
      if (minAge === null) return false;

      // belum login / belum isi DOB
      if (userAge == null) return true;

      return userAge < minAge;
    },
    [userAge, isReady],
  );

  // Fetch Banners
  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch("http://localhost:3000/api/banners/home", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const responseData = await res.json();

        setBanners(responseData.data || responseData);
      } catch (err) {
        console.error("Gagal ambil banner:", err);
      }
    }

    fetchBanners();
  }, []);

  return (
    <div className="flex flex-col overflow-x-hidden">
      <div className="flex flex-col">
        <SliderBannerPage banners={banners} isBlurred={isBlurred} />

        <main className="flex flex-col md:mx-5 md:px-0">
          <CategoryMenu />

          <CarouselNewest isBlurred={isBlurred} />
          <CarouselHighlight isBlurred={isBlurred} />
          <CarouselTopTen isBlurred={isBlurred} />

          {groups.map((group, idx) => {
            const CompA = group[0];
            const CompB = group[1];
            return (
              <section
                key={idx}
                data-group-index={idx}
                ref={(el) => (refs.current[idx] = el)}
                className="relative min-h-[14rem] md:min-h-[16rem]"
              >
                {loadedGroups[idx] ? (
                  <>
                    {CompA && (
                      <div className="relative">
                        <CompA isBlurred={isBlurred} />
                      </div>
                    )}
                    {CompB && (
                      <div className="relative">
                        <CompB isBlurred={isBlurred} />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="px-4">                  
                    <CarouselLoading /> 
                  </div>
                )}
              </section>
            );
          })}
        </main>
      </div>
    </div>
  );
}
