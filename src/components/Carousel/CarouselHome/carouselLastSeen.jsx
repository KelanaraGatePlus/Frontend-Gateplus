import React, { useEffect, useState } from "react";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";

export default function CarouselLastSeen() {
  const [lastSeenData, setLastSeenData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const local = localStorage.getItem("last_seen_content");
      const parsed = local ? JSON.parse(local) : [];

      // ambil semua kontent, series yang halaman watch doang
      const withProgress = parsed
        .filter((item) => {
          // series ambil watch atau isEpisode
          if (item.type === "series" || item.isSeries) {
            return item.isEpisode === true;
          }
          // non series? langsung saja
          return true;
        })
        .map((item) => {
          // tanpa customHref
          let customHref = undefined;

          //series kasih customHref ke halaman watch
          if (item.isEpisode === true && item.episodeId) {
            customHref = `/series/watch/${item.episodeId}`;
          }

          return {
            ...item,
            posterImageUrl:
              item.posterImageUrl ||
              item.coverUrl ||
              item.thumbnailImageUrl ||
              null,
            progress: item.progress || 0,
            customHref,
          };
        });

      setLastSeenData(withProgress);
      setIsLoading(false);
    }, 500);
  }, []);

  const updateProgress = (id, newProgress) => {
    setLastSeenData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, progress: newProgress } : item,
      ),
    );
  };

  if (!isLoading && lastSeenData.length === 0) return null;

  return (
    <CarouselTemplate
      label={"Terakhir Anda Lihat"}
      contents={lastSeenData}
      isLoading={isLoading}
      isHomepage={true}
      updateProgress={updateProgress}
    />
  );
}
