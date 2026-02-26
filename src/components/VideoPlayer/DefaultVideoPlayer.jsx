import React, { useRef, useState, useCallback, useEffect } from "react";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";
import { useCreateProgressWatchMutation } from "@/hooks/api/progressWatchAPI";
import PropTypes from "prop-types";
import MuxPlayer from "@mux/mux-player-react";
import throttle from "lodash.throttle";
import { useDeviceType } from "@/hooks/helper/deviceType";
import Link from "next/link";
import Image from "next/image";

import IconsArrowLeft from "@@/icons/icons-dashboard/icons-arrow-left.svg";
import iconFlag from "@@/icons/icon-flag.svg";

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
  playbackId,
  onProgressUpdate,
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

  const handleSaveProgress = useCallback(() => {
    console.log("TRY SAVE", progressRef.current);

    if (!contentId) {
      console.log("SKIP: no contentId");
      return;
    }

    if (progressRef.current.playedSeconds === 0) {
      console.log("SKIP: progress 0");
      return;
    }

    if (logType !== "WATCH_CONTENT") {
      console.log("SKIP: not watch content");
      return;
    }

    const payload = {
      contentId,
      contentType: contentType === "FILM" ? "MOVIE" : contentType,
      progressSeconds: progressRef.current.playedSeconds,
      progressPercentage: progressRef.current.percentage,
      isCompleted: progressRef.current.percentage >= 80,
      device,
    };

    console.log("SEND PAYLOAD", payload);

    createProgressWatch(payload);
  }, [contentId, contentType, createProgressWatch, logType, device]);

  const throttledSaveProgress = useCallback(
    throttle(handleSaveProgress, 5000, { leading: false, trailing: true }),
    [handleSaveProgress],
  );

  useEffect(() => {
    const handleBeforeUnload = () => {
      handleSaveProgress();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      handleBeforeUnload();
      window.removeEventListener("beforeunload", handleBeforeUnload);
      throttledSaveProgress.cancel();
    };
  }, [handleSaveProgress, throttledSaveProgress]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!startFrom || startFrom <= 0) return;

    console.log("FORCE SEEK TO", startFrom);

    const seekToProgress = () => {
      if (!video.duration || isNaN(video.duration)) return;

      video.currentTime = startFrom;
      hasSeekedRef.current = true;
    };

    // reset flag supaya bisa seek ulang
    hasSeekedRef.current = false;

    if (video.readyState >= 1) {
      seekToProgress();
    } else {
      video.addEventListener("loadedmetadata", seekToProgress, { once: true });
    }

    return () => {
      video.removeEventListener("loadedmetadata", seekToProgress);
    };
  }, [startFrom]);

  return (
    <div
      ref={containerRef} // Pasang ref untuk menangkap event interaksi
      className={`relative h-[500px] w-screen max-w-full overflow-hidden bg-black 2xl:h-[800px] ${className || ""}`}
    >
      <div
        // Gunakan z-50 agar pasti muncul di atas kontrol MuxPlayer dalam fullscreen
        onClick={(e) => e.stopPropagation()}
        className={`absolute top-0 right-0 left-0 z-50 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "pointer-events-none opacity-0"
        } flex items-center justify-between gap-4 bg-gradient-to-b from-black/70 to-transparent px-4 py-4 sm:px-16`}
      >
        <div className="flex flex-row items-center justify-center gap-4">
          <Link href="/">
            <Image
              src={IconsArrowLeft}
              alt="icons-arrow-left"
              width={32}
              height={32}
            />
          </Link>
          <div className="flex flex-col gap-1">
            <span className="text-md font-black text-white">{title}</span>
            <span className="text-xs text-gray-400">
              {formatDuration(duration)} | {ageRestriction} | {genre}
            </span>
          </div>
        </div>

        <Link
          href={`/report/${contentType === "FILM" ? "movie" : "episode_series"}/${contentId}`}
          className="rounded-full bg-white/20 p-2 transition hover:bg-white/40"
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
        className="z-10 h-full w-full"
        accent-color="#175ba6"
        playsInline
        preload="metadata"
        metadata={{
          video_title: title || "Video Player",
        }}
        onLoadedMetadata={() => {
          const video = videoRef.current;
          if (!video) return;

          if (video.duration && !isNaN(video.duration)) {
            setDuration(video.duration);
          }

          if (startFrom > 0 && !hasSeekedRef.current) {
            console.log("RESUME FROM", startFrom);
            video.currentTime = startFrom;
            hasSeekedRef.current = true;
          }
        }}
        onPlay={() => {
          if (logType === "WATCH_TRAILER") {
            createLog({ logType, contentId, contentType });
          }
        }}
        onPause={() => {
          throttledSaveProgress.flush();
          handleSaveProgress();

          // Notify parent about progress for state update
          onProgressUpdate?.(progressRef.current.playedSeconds);
        }}
        onTimeUpdate={() => {
          const video = videoRef.current;
          if (!video) return;

          const current = video.currentTime;
          const duration = video.duration;

          if (!duration || isNaN(duration)) return;

          const played = current / duration;

          progressRef.current = {
            playedSeconds: current,
            percentage: Math.round(played * 100),
          };

          console.log("Progress", progressRef.current);
          throttledSaveProgress();
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
  onProgressUpdate: PropTypes.func,
};
