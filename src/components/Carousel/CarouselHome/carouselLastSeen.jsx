"use client";

import React, { useEffect, useState } from "react";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";
import { useGetLastSeenQuery } from "@/hooks/api/lastSeenSliceAPI";

export default function CarouselLastSeen() {
  const [lastSeenData, setLastSeenData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /*[--- API HOOKS ---]*/
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // FIX 1: useGetLastSeenQuery tanpa () → tidak pernah dipanggil, skip jika belum login
  const { data, isLoading } = useGetLastSeenQuery(undefined, {
    skip: !token,
  });

  /*[--- EFFECT: map data & cek login ---]*/
  // FIX 2: useEffect harus di atas early return, bukan di bawah
  useEffect(() => {
    setIsLoggedIn(!!token);

    if (!data) return;

    const items = data || [];

    const mapped = items.map((item) => {
      const normalizedType =
        item.type?.toLowerCase() === "film"
          ? "movie"
          : item.type?.toLowerCase();

      const coverUrl =
        normalizedType === "movie" || normalizedType === "series"
          ? item.thumbnailImageUrl || item.posterImageUrl
          : normalizedType === "podcast"
            ? item.coverPodcastImage ||
              item.posterImageUrl ||
              item.thumbnailImageUrl
            : normalizedType === "education"
              ? item.bannerUrl
              : item.posterImageUrl || item.thumbnailImageUrl;

      return {
        ...item,
        type: normalizedType,
        coverUrl,
        posterImageUrl: item.posterImageUrl || coverUrl,
        thumbnailImageUrl: item.thumbnailImageUrl || coverUrl,
        coverPodcastImage: item.coverPodcastImage || coverUrl,
        progress: item.progress ?? 0,
      };
    });

    setLastSeenData(mapped);
  }, [data, token]);

  /*[--- EARLY RETURN setelah semua hooks ---]*/
  if (isLoading || lastSeenData.length === 0) return null;

  return (
    <div className="mb-10">
      <CarouselTemplate
        label="Terakhir Anda Lihat"
        contents={lastSeenData}
        isLoading={isLoading}
        isHomepage={true}
        withTopTag={false}
        isLoggedIn={isLoggedIn}
        showProgress={true}
      />
    </div>
  );
}
