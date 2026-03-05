"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export default function CarouselLastSeen() {
  const [lastSeenData, setLastSeenData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const fetchLastSeen = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/last-seen`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const items = res.data || [];

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
            // progress sudah dihitung di backend (0-100)
            progress: item.progress ?? 0,
          };
        });

        setLastSeenData(mapped);
      } catch (err) {
        console.error("Failed to fetch last seen:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLastSeen();
  }, []);

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
