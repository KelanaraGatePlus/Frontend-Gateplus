"use client";
import React from "react";
import { contentType } from "@/lib/constants/contentType";
import Image from "next/image";
import Link from "next/link";
// import logoSave from "@@/logo/logoDetailFilm/save-icons.svg";
import logoGateplusWhite from "@@/logo/logoGate+/logo-gateplus-white.svg";
import blur from "@@/poster/blur.svg";
// import iconMore from "@@/icons/icon_more.svg";
import PropTypes from "prop-types";
import MovieCardHover from "../Hover/MovieCardHover";

export default function MovieCard({
  title,
  id,
  coverUrl,
  rank = null,
  isOriginal = false,
  withTopTag = true,
  withNewestTag = false,
  hasNewEpisode = false,
}) {
  const anchorRef = React.useRef(null);
  const openTimerRef = React.useRef(null);
  const closeTimerRef = React.useRef(null);
  const [isHoverOpen, setIsHoverOpen] = React.useState(false);

  const clearOpenTimer = () => {
    if (!openTimerRef.current) return;
    window.clearTimeout(openTimerRef.current);
    openTimerRef.current = null;
  };

  const clearCloseTimer = () => {
    if (!closeTimerRef.current) return;
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  };

  const handleHoverStart = () => {
    clearCloseTimer();
    if (isHoverOpen || openTimerRef.current) return;

    openTimerRef.current = window.setTimeout(() => {
      setIsHoverOpen(true);
      openTimerRef.current = null;
    }, 1000);
  };

  const handleHoverEnd = () => {
    clearOpenTimer();
    clearCloseTimer();

    closeTimerRef.current = window.setTimeout(() => {
      setIsHoverOpen(false);
      closeTimerRef.current = null;
    }, 120);
  };

  React.useEffect(() => {
    return () => {
      clearOpenTimer();
      clearCloseTimer();
    };
  }, []);

  return (
    <div
      ref={anchorRef}
      className="relative h-full w-full"
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      <Link
        href={`/${contentType.movie.pluralName}/detail/${id}`}
        className="group block h-full w-full"
      >
        <div className="relative h-full w-full overflow-hidden rounded-[6px]">
          {/* Banner Atas */}
          <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between rounded-t-[6px] px-2 py-1">
            <div className="flex flex-row items-start gap-1 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
              {withTopTag && rank && (
                <div className="zeinFont flex flex-col items-center rounded-sm bg-[#22222233] px-4 py-1 font-black text-cyan-400 backdrop-blur-xs">
                  <span className="text-sm">Teratas</span>
                  <span className="text-3xl">{rank || 1}</span>
                </div>
              )}
              {withNewestTag && (
                <span className="zeinFont rounded-sm bg-[#22222233] px-2 text-sm font-semibold text-cyan-200 backdrop-blur-xs">
                  Baru
                </span>
              )}
              {hasNewEpisode && (
                <span className="zeinFont rounded-sm bg-[#22222233] px-1.5 py-[3px] text-[12px] font-medium text-cyan-200 backdrop-blur-xs">
                  Episode Baru
                </span>
              )}
            </div>
          </div>

          {/* Konten Bawah */}
          <div className="absolute right-0 bottom-0 left-0 z-20 flex items-center justify-between px-1">
            {/* movie icon → selalu tampil */}
            <Image
              priority
              width={45}
              height={45}
              src={contentType.movie.icon}
              alt="movie-icon"
              className="drop-shadow-lg"
            />

            {/* Text "Original" → muncul saat hover */}
            {isOriginal && (
              <div className="flex items-center self-end rounded-sm bg-[#22222233] px-2 py-1 text-white backdrop-blur-xs">
                <Image
                  priority
                  width={18}
                  height={18}
                  src={logoGateplusWhite}
                  alt="logo-gateplus-white"
                  className="mr-1"
                />
                <p className="zeinFont text-xs">Original</p>
              </div>
            )}

            {/* Bookmark icon → hanya muncul saat hover
                    <Image
                        priority
                        width={28}
                        height={28}
                        src={logoSave}
                        alt="save-icon"
                        className="drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                    /> */}
          </div>

          {/* Poster */}
          <Image
            src={coverUrl}
            priority
            width={240}
            height={353}
            alt={title || "movie-image"}
            unoptimized
            className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />

          {/* Blur pojok kiri bawah */}
          <Image
            src={blur}
            priority
            width={14}
            height={14}
            alt="blur"
            className="absolute bottom-0 left-0 h-16 w-16"
          />
        </div>
      </Link>

      <MovieCardHover
        anchorRef={anchorRef}
        isOpen={isHoverOpen}
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
        coverUrl={coverUrl}
        title={title}
        year={"2023"}
        rating={"8.5"}
        genre={"Action, Adventure"}
      />
    </div>
  );
}

MovieCard.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  coverUrl: PropTypes.string.isRequired,
  rank: PropTypes.number,
  isOriginal: PropTypes.bool,
  withTopTag: PropTypes.bool,
  withNewestTag: PropTypes.bool,
  hasNewEpisode: PropTypes.bool,
};