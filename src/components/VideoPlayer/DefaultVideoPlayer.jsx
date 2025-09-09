import React from "react";
import Video from "next-video";
import PlayIcon from "@@/icons/icon-play.svg";
import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/legacy/image";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";
import PropTypes from "prop-types";

/* ===========================
   Komponen: YouTubeStyleVideo (JSX)
   =========================== */
export default function DefaultVideoPlayer({
  src,
  poster,
  className,
  contentType,
  logType,
  contentId,
}) {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [createLog] = useCreateLogMutation();

  const getVideoEl = () => {
    if (videoRef.current && typeof videoRef.current.play === "function") {
      return videoRef.current;
    }
    if (wrapperRef.current) {
      const found = wrapperRef.current.querySelector("video");
      if (found) return found;
    }
    return null;
  };

  const handlePlay = useCallback(async () => {
    // 2. Panggil backend jika logType adalah 'WATCH_TRAILER'
    if (logType === "WATCH_TRAILER" && contentId) {
      createLog({
        contentType,
        logType,
        contentId,
      });
    }

    const el = getVideoEl();
    if (!el) return;
    try {
      await el.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Error attempting to play", err);
      setIsPlaying(false);
    } finally {
      setIsBuffering(false);
    }
  }, [contentType, logType, contentId, createLog]);

  useEffect(() => {
    const el = getVideoEl();
    if (!el) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`relative w-screen max-w-full overflow-hidden ${className || ""
        }`}
    >
      {/* Video */}
      <Video
        ref={videoRef}
        className="w-screen h-auto object-cover"
        src={src}
        poster={poster}
        controls={isPlaying}
        preload="metadata"
        playsInline
      />

      {/* Overlay (muncul saat belum play) */}
      {!isPlaying && (
        <button
          type="button"
          aria-label="Play video"
          onClick={(e) => {
            e.preventDefault();
            handlePlay();
          }}
          className="absolute inset-0 flex items-center justify-center focus:outline-none"
        >
          {/* Lapis poster sebagai background agar tombol play selalu terlihat */}
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={poster ? { backgroundImage: `url(${poster})` } : {}}
          />
          <div className="absolute inset-0 bg-black/35" />

          {/* Tombol Play */}
          <Image
            src={PlayIcon}
            height={60}
            width={60}
            className="hover:cursor-pointer"
            alt="Play video"
          />

          {/* Indikator buffering (opsional) */}
          {isBuffering && (
            <div className="absolute bottom-4 right-4 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
              Loading…
            </div>
          )}
        </button>
      )}
    </div>
  );
}

DefaultVideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  poster: PropTypes.string,
  className: PropTypes.string,
  contentType: PropTypes.string,
  logType: PropTypes.string,
  contentId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};