import React, { useRef, useState, useCallback, useEffect } from "react";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";
import { useCreateProgressWatchMutation } from "@/hooks/api/progressWatchAPI";
import PropTypes from "prop-types";
import MuxPlayer from "@mux/mux-player-react";
import throttle from "lodash.throttle";
import { useDeviceType } from "@/hooks/helper/deviceType";
import Link from "next/link";
import Image from "next/image";

import iconFlag from "@@/icons/icon-flag.svg";
import BackButton from "../BackButton/page";

export default function DefaultVideoPlayer({
  src,
  poster,
  className,
  contentType,
  logType,
  contentId,
  startFrom = 0,
  title,
  genre,
  ageRestriction,
  playbackId
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null); // Ref baru untuk container utama
  const hasSeekedRef = useRef(false);
  const device = useDeviceType();
  const progressRef = useRef({ playedSeconds: 0, percentage: 0 });

  const [createLog] = useCreateLogMutation();
  const [createProgressWatch] = useCreateProgressWatchMutation();
  const [showControls, setShowControls] = useState(true);
  const [duration, setDuration] = useState(0);

  // Format duration H:MM:SS (Didefinisikan secara lokal agar kode mandiri jika import gagal)
  const formatDuration = (d) => {
    if (!d || isNaN(d)) return "0:00";
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor(d % 60);
    return h > 0
      ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      : `${m}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    let timeout;
    const headerShow = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    const attachEvents = (el) => {
      if (!el) return;
      el.addEventListener("mousemove", headerShow);
      el.addEventListener("touchstart", headerShow);
    };

    const detachEvents = (el) => {
      if (!el) return;
      el.removeEventListener("mousemove", headerShow);
      el.removeEventListener("touchstart", headerShow);
    };

    // normal mode → pakai containerRef
    attachEvents(containerRef.current);

    // ketika user masuk or keluar fullscreen
    const handleFullscreen = () => {
      const fsEl = document.fullscreenElement;

      if (fsEl) {
        // fullscreen → event listener pindah ke elemen fullscreen
        detachEvents(containerRef.current);
        attachEvents(fsEl);
        headerShow(); // show overlay sebentar untuk transisi
      } else {
        // keluar fullscreen → event listener kembali ke container
        detachEvents(document.fullscreenElement);
        attachEvents(containerRef.current);
        headerShow();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreen);

    return () => {
      detachEvents(containerRef.current);
      detachEvents(document.fullscreenElement);
      document.removeEventListener("fullscreenchange", handleFullscreen);
      clearTimeout(timeout);
    };
  }, []);

  const handleStartFrom = () => {
    if (startFrom > 0 && !hasSeekedRef.current && videoRef.current) {
      videoRef.current.currentTime = startFrom;
      hasSeekedRef.current = true;
    }
  };

  const handleSaveProgress = useCallback(() => {
    if (!contentId || progressRef.current.playedSeconds === 0) return;
    if (logType !== "WATCH_CONTENT") return;

    const percentage = progressRef.current.percentage;

    const payload = {
      contentId,
      contentType: contentType === "FILM" ? "MOVIE" : contentType,
      progressSeconds: progressRef.current.playedSeconds,
      progressPercentage: percentage,
      isCompleted: percentage >= 80,
      device,
    };

    createProgressWatch(payload);
  }, [contentId, contentType, createProgressWatch, logType, device]);

  const throttledSaveProgress = useCallback(
    throttle(handleSaveProgress, 5000, { leading: false, trailing: true }),
    [handleSaveProgress]
  );

  useEffect(() => {
    const handleBeforeUnload = () => handleSaveProgress();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      handleSaveProgress();
      window.removeEventListener("beforeunload", handleBeforeUnload);
      throttledSaveProgress.cancel();
    };
  }, [handleSaveProgress, throttledSaveProgress]);

  return (
    <div
      ref={containerRef} // Pasang ref untuk menangkap event interaksi
      className={`relative w-screen max-w-full h-[500px] 2xl:h-[800px] overflow-hidden bg-black ${className || ""}`}
    >
      <div
        // Gunakan z-50 agar pasti muncul di atas kontrol MuxPlayer dalam fullscreen
        onClick={(e) => e.stopPropagation()}
        className={`absolute top-0 left-0 right-0 transition-opacity duration-300 z-20 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          } bg-gradient-to-b from-black/70 to-transparent py-4 px-4 sm:px-16 flex items-center gap-4 justify-between`}
      >
        <div className="flex flex-row gap-4 items-center justify-center">
          <BackButton />
          <div className="flex flex-col gap-1">
            <span className="text-md text-white font-black">{title}</span>
            <span className="text-xs text-gray-400">
              {formatDuration(duration)} | {ageRestriction} | {genre}
            </span>
          </div>
        </div>

        <Link
          href={`/report/${contentType === "FILM" ? "movie" : "episode_series"}/${contentId}`}
          className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition"
        >
          <Image src={iconFlag} alt="icons-flag" width={32} height={32} />
        </Link>
      </div>
      {console.log(playbackId, src)}
      <MuxPlayer
        ref={videoRef}
        {...(playbackId ? { playbackId } : src ? { src } : {})}
        poster={poster}
        streamType="on-demand"
        // Atur z-index MuxPlayer agar lebih rendah dari header overlay
        className="w-full h-full z-10"
        accent-color="#175ba6"
        playsInline
        preload="metadata"
        metadata={{
          video_title: title || "Video Player",
        }}
        onLoadedMetadata={(e) => {
          const video = e.target;
          if (video.duration) setDuration(video.duration);
        }}
        onPlay={() => {
          handleStartFrom();
          if (logType === "WATCH_TRAILER") {
            createLog({ logType, contentId, contentType });
          }
        }}
        onPause={() => {
          throttledSaveProgress.flush();
        }}
        onTimeUpdate={(e) => {
          const video = e.target;
          if (video.duration && !isNaN(video.duration)) {
            const played = video.currentTime / video.duration;

            progressRef.current = {
              playedSeconds: video.currentTime,
              percentage: Math.round(played * 100),
            };

            throttledSaveProgress();
          }
        }}
        // MuxPlayer akan memiliki kontrol bawaan di bawah, Header kita di atas
        controls
      />
    </div>
  );
}

DefaultVideoPlayer.propTypes = {
  src: PropTypes.string,
  poster: PropTypes.string,
  className: PropTypes.string,
  contentType: PropTypes.oneOf(["MOVIE", "SERIES_EPISODE"]).isRequired,
  logType: PropTypes.string,
  contentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  startFrom: PropTypes.number,
  title: PropTypes.string,
  genre: PropTypes.string,
  ageRestriction: PropTypes.string,
  playbackId: PropTypes.string,
};