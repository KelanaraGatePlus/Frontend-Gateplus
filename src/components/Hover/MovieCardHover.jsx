"use client";
import React from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { Play, Info, Plus } from "lucide-react";
import PropTypes from "prop-types";
import MuxPlayer from "@mux/mux-player-react";

export default function MovieCardHover({
  anchorRef,
  isOpen,
  onMouseEnter,
  onMouseLeave,
  trailerUrl = 'https://minio.gateplus.id:9000/media-gateplus/movie/trailer/1766849186046-OFFICIAL%20TRAILER-%20SEBELUM%20MELANGKAH%20JAUH_1080p_24f_20250921_173752%20%281%29.mp4',
  title,
  year = "2024",
  rating = "8.9",
  genre = "Action",
}) {
  const [mounted, setMounted] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isOpen || !anchorRef?.current) return;

    const updatePosition = () => {
      const rect = anchorRef.current.getBoundingClientRect();

      setPosition({
        top: rect.top - 40,
        left: rect.left + rect.width / 2,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, anchorRef]);

  React.useEffect(() => {
    if (!isOpen) {
      setIsVisible(false);
      return;
    }

    setIsVisible(false);
    const frame = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        fixed z-120 w-max max-w-[calc(100vw-2rem)] -translate-x-1/2
        pointer-events-auto
        transform-gpu will-change-transform
        transition-all duration-220 ease-out
        ${isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0"}
      `}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <div className="bg-[#141414] rounded-md outline-gray-500 outline shadow-lg overflow-hidden">

        {/* Poster */}
        <div className="relative h-auto w-[360px]">
          <MuxPlayer
            src={trailerUrl}
            autoplay
            loop
            className="object-cover h-full w-full"
            style={{ pointerEvents: "none" }}
          />
        </div>

        {/* Detail */}
        <div className="p-4 text-white">
          <div className="flex items-center gap-2">
            <button className="bg-white hover:bg-gray-200 active:scale-90 text-black px-4 py-1 rounded text-sm font-semibold flex items-center gap-1">
              <Play size={16} /> Play
            </button>

            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition">
              <Plus size={16} />
            </button>

            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition">
              <Info size={16} />
            </button>
          </div>

          <div className="flex gap-3 text-sm text-gray-300 mt-3">
            <span className="text-green-400 font-semibold">
              {rating}
            </span>
            <span>{year}</span>
            <span>{genre}</span>
          </div>

          <h3 className="mt-2 font-semibold text-base">
            {title}
          </h3>
        </div>
      </div>
    </div>
    ,
    document.body,
  );
}

MovieCardHover.propTypes = {
  anchorRef: PropTypes.shape({ current: PropTypes.any }),
  isOpen: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  coverUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  year: PropTypes.string,
  rating: PropTypes.string,
  genre: PropTypes.string,
};