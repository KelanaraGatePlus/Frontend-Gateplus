/* eslint-disable react/react-in-jsx-scope */
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import SliderBannerPage from "@/components/BannerPromoSlider/page";
import CategoryMenu from "@/components/CategoryMenu/page";
import CarouselNewest from "@/components/Carousel/CarouselHome/carouselNewest";
import CarouselHighlight from "@/components/Carousel/CarouselHome/carouselHighlight";
import CarouselTopTen from "@/components/Carousel/CarouselHome/carouselTopTen";
import "@splidejs/react-splide/css";
import CarouselLoading from "@/components/Carousel/CarouselLoading";
import BackToTop from "@/components/ui/buttonBackToTop";
import EpisodeGridCarousel from "@/components/Carousel/EpisodeGridCarousel";
import { useGetMeQuery } from "@/hooks/api/userSliceAPI";
import {
  useGetFollowedEpisodesQuery,
  useGetFollowedLatestContentQuery,
} from "@/hooks/api/followedSliceAPI";

// Dynamic imports
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

function normalizeContent(item) {
  if (item.contentType === "movie") {
    return {
      ...item,
      episodeTitle: null,
      thumbnailImageUrl: item.coverUrl,
      contentId: item.contentId || item.id,
    };
  }
  return item;
}

export default function HomePage() {
  // selalu reload
  useEffect(() => {
    const isReloaded = sessionStorage.getItem("home-reloaded");
    if (!isReloaded) {
      sessionStorage.setItem("home-reloaded", "true");
      window.location.reload();
    } else {
      sessionStorage.removeItem("home-reloaded");
    }
  }, []);

  const { data: me } = useGetMeQuery();
  const isLoggedIn = !!me?.Session?.id;

  // Tidak ada limit — ambil semua
  const { data: followedEpisodesRaw = [], isLoading: isLoadingEpisodes } =
    useGetFollowedEpisodesQuery({}, { skip: !isLoggedIn });

  const { data: latestContentRaw = [], isLoading: isLoadingContent } =
    useGetFollowedLatestContentQuery({}, { skip: !isLoggedIn });

  // RTK Query bisa return { data: [...] } atau langsung array tergantung transformResponse
  const followedEpisodes = Array.isArray(followedEpisodesRaw)
    ? followedEpisodesRaw
    : (followedEpisodesRaw.data ?? []);

  const latestContent = Array.isArray(latestContentRaw)
    ? latestContentRaw
    : (latestContentRaw.data ?? []);

  const normalizedLatestContent = useMemo(
    () => latestContent.map(normalizeContent),
    [latestContent],
  );

  const purchasedIds = useMemo(() => {
    const ids = new Set();
    [...followedEpisodes, ...normalizedLatestContent].forEach((item) => {
      if (item.isPurchased) {
        if (item.contentId) ids.add(String(item.contentId));
        if (item.id) ids.add(String(item.id));
      }
    });
    return ids;
  }, [followedEpisodes, normalizedLatestContent]);

  function mergeWithPurchased(items) {
    return items.map((item) => ({
      ...item,
      isPurchased:
        item.isPurchased ||
        purchasedIds.has(String(item.contentId)) ||
        purchasedIds.has(String(item.id)),
    }));
  }

  const mergedFollowedEpisodes = useMemo(
    () => mergeWithPurchased(followedEpisodes),
    [followedEpisodes, purchasedIds],
  );

  const mergedLatestContent = useMemo(
    () => mergeWithPurchased(normalizedLatestContent),
    [normalizedLatestContent, purchasedIds],
  );

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

  return (
    <div className="flex flex-col overflow-x-hidden">
      <div className="flex flex-col">
        <SliderBannerPage isBlurred={false} />

        <main className="flex flex-col pb-0 md:mx-5 md:px-0">
          <CategoryMenu />
          <CarouselNewest isBlurred={false} />
          <CarouselHighlight isBlurred={false} />
          <CarouselTopTen isBlurred={false} />
          {groups.map((group, idx) => {
            const CompA = group[0];
            const CompB = group[1];
            return (
              <section
                key={idx}
                data-group-index={idx}
                ref={(el) => (refs.current[idx] = el)}
                className={`relative ${!loadedGroups[idx] ? "min-h-[14rem] md:min-h-[16rem]" : ""}`}
              >
                {loadedGroups[idx] ? (
                  <>
                    {CompA && (
                      <div className="relative">
                        <CompA isBlurred={false} />
                      </div>
                    )}
                    {CompB && (
                      <div className="relative">
                        <CompB isBlurred={false} />
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

          {isLoggedIn && (
            <>
              {(isLoadingEpisodes || followedEpisodes.length > 0) && (
                <EpisodeGridCarousel
                  label="Episode Baru Karya Yang Kamu Ikuti"
                  contents={mergedFollowedEpisodes}
                  isLoading={isLoadingEpisodes}
                  isHomepage={true}
                  seeAllHref="/followed/episodes"
                />
              )}

              {(isLoadingContent || latestContent.length > 0) && (
                <EpisodeGridCarousel
                  label="Karya Terbaru Kreator Yang Kamu Suka"
                  contents={mergedLatestContent}
                  isLoading={isLoadingContent}
                  isHomepage={true}
                  seeAllHref="/followed/creators"
                />
              )}
            </>
          )}
        </main>

        <BackToTop />
      </div>
    </div>
  );
}
