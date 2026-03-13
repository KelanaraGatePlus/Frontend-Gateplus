"use client";

import React from "react";
import { useState } from "react";
import { Lock, BookOpen } from "lucide-react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";

import { useGetLastSeenQuery } from "@/hooks/api/lastSeenSliceAPI";
import { useGetMeQuery } from "@/hooks/api/userSliceAPI";

function getContentUrl(item) {
  const type = item.contentType || item.type;

  if (type === "ebook") {
    return `/ebooks/read/${item.id}`;
  }
  if (type === "comic") {
    return `/comics/read/${item.id}`;
  }

  const contentId = item.contentId || item.id;
  if (type === "podcast") return `/podcasts/detail/${contentId}`;
  if (type === "series") return `/series/detail/${contentId}`;
  if (type === "movie") return `/movies/detail/${contentId}`;
  return `/`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function EpisodeCard({ item, isOwner }) {
  const [hovered, setHovered] = useState(false);
  const isFree = item.price === "Free" || item.price === 0;
  const canAccess = isOwner || item.isPurchased || isFree;
  const router = useRouter();

  const { data: me } = useGetMeQuery();
  const isLoggedIn = !!me?.Session?.id;

  // ambi dari lastseen biar tanda baca berubah
  const { data: lastSeenRaw = [] } = useGetLastSeenQuery(undefined, {
    skip: !isLoggedIn,
  });

  const isInLastSeen = lastSeenRaw.some(
    (s) => String(s.id) === String(item.contentId || item.id),
  );

  const handleClick = () => {
    if (!canAccess) {
      const type = item.contentType || item.type;

      if (type === "ebook") {
        router.push(`/checkout/purchase/ebooks/${item.contentId}/${item.id}`);
      } else if (type === "comic") {
        router.push(`/checkout/purchase/comics/${item.contentId}/${item.id}`);
      } else if (type === "movie") {
        router.push(`/checkout/subscribe/movie/${item.id}`);
      } else if (type === "podcast") {
        router.push(`/checkout/purchase/podcasts/${item.contentId}/${item.id}`);
      } else if (type === "series") {
        router.push(`/checkout/purchase/series/${item.contentId}/${item.id}`);
      }
      return;
    }

    router.push(getContentUrl(item));
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      className={`relative box-border flex w-full cursor-pointer gap-[10px] rounded-[10px] p-[10px] transition-all duration-300 ease-in-out ${
        hovered
          ? "-translate-y-0.5 border border-[rgba(18,151,220,0.3)] bg-[rgba(18,151,220,0.08)] shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
          : "translate-y-0 border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.04)] shadow-none"
      } `}
    >
      <div className="relative h-[72px] w-[52px] min-w-[52px] overflow-hidden rounded-[6px] bg-[#1a1a2e]">
        <img
          src={item.coverUrl || item.thumbnailImageUrl}
          alt={item.episodeTitle}
          className={`h-full w-full object-cover transition-transform duration-300 ease-in-out ${hovered ? "scale-[1.08]" : "scale-100"}`}
        />

        {!canAccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.55)]">
            <Lock size={14} color="white" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-[2px]">
        <p className="m-0 truncate text-[12px] leading-[1.3] font-bold text-[rgba(255,255,255,0.92)]">
          {item.parentTitle || item.episodeTitle}
        </p>

        {item.episodeTitle && (
          <p className="m-0 truncate text-[11px] leading-[1.3] text-[rgba(255,255,255,0.5)]">
            {item.episodeTitle}
          </p>
        )}

        <p className="m-0 truncate text-[10px] leading-[1.3] text-[rgba(255,255,255,0.35)]">
          {item.creatorName}
        </p>

        <div className="mt-[2px] flex items-center justify-between gap-1">
          <span className="shrink-0 text-[10px] text-[rgba(255,255,255,0.3)]">
            {item.uploadedAt ? formatDate(item.uploadedAt) : ""}
          </span>
        </div>
      </div>

      {!canAccess && (
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 rounded-[6px] border-2 border-[#967074] bg-[#63282e] px-[6px] py-[2px]">
            <Lock size={10} color="white" />
            <span className="text-[10px] font-bold text-white">Terkunci</span>
          </div>
          <span className="absolute right-[8px] bottom-[8px] text-[10px] font-bold text-white">
            Rp {item.price != null ? item.price.toLocaleString("id-ID") : "0"}
          </span>
        </div>
      )}

      {canAccess && !isInLastSeen && (
        <div className="absolute top-[8px] right-[8px] flex items-center gap-1 rounded-[6px] border border-[rgba(245,245,245,0.35)] bg-[rgba(31,193,107,0.35)] px-[6px] py-[2px]">
          <BookOpen size={10} color="white" />
          <span className="text-[10px] font-bold text-white">
            {["podcast", "movie", "series"].includes(item.contentType)
              ? "Putar"
              : "Baca"}
          </span>
        </div>
      )}
    </div>
  );
}

EpisodeCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    contentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    episodeTitle: PropTypes.string,
    parentTitle: PropTypes.string,
    coverUrl: PropTypes.string,
    thumbnailImageUrl: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    creatorName: PropTypes.string,
    uploadedAt: PropTypes.string,
    isPurchased: PropTypes.bool,
    contentType: PropTypes.oneOf([
      "ebook",
      "series",
      "podcast",
      "comic",
      "movie",
    ]),
    type: PropTypes.oneOf(["ebook", "series", "podcast", "comic", "movie"]),
  }).isRequired,
  isOwner: PropTypes.bool,
};
