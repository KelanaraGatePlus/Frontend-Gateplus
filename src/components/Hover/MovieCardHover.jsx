"use client";
import React from "react";
import { createPortal } from "react-dom";
import { Play, Info, Plus } from "lucide-react";
import PropTypes from "prop-types";
import MuxPlayer from "@mux/mux-player-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function MovieCardHover({
  anchorRef,
  isOpen,
  onPlayHref,
  onMouseEnter,
  onMouseLeave,
  trailerUrl,
  title,
  year = "2024",
  rating = "8.9",
  genre = "Action",
}) {
  const [mounted, setMounted] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

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

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="hover-card"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          initial={{ opacity: 0, y: 20, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 22,
          }}
          className="fixed z-120 w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 pointer-events-auto"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          <div className="bg-[#141414] rounded-md outline-gray-500 outline shadow-2xl overflow-hidden">

            {/* Video */}
            <div className="relative w-90">
              <MuxPlayer
                src={trailerUrl}
                autoPlay
                loop
                muted
                className="object-cover h-auto w-full"
                style={{ pointerEvents: "none" }}
              />
            </div>

            {/* Detail */}
            <div className="p-4 text-white">
              <div className="flex items-center gap-2">
                <Link href={onPlayHref} className="bg-white hover:bg-gray-200 active:scale-95 transition text-black px-4 py-1 rounded text-sm font-semibold flex items-center gap-1">
                  <Play size={16} /> Play
                </Link>

                <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition">
                  <Plus size={16} />
                </button>

                <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition">
                  <Info size={16} />
                </button>
              </div>

              <div className="flex gap-3 text-sm text-gray-300 mt-3">
                <span className="text-green-400 font-semibold">{rating}</span>
                <span>{year}</span>
                <span>{genre}</span>
              </div>

              <h3 className="mt-2 font-semibold text-base">{title}</h3>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
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