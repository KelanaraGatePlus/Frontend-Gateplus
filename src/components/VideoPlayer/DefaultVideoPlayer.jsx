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
  seriesData = {},
  onProgressUpdate = null,
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hasSeekedRef = useRef(false);
  const device = useDeviceType();
  const progressRef = useRef({ playedSeconds: 0, percentage: 0 });
  const logCreatedRef = useRef(false);

  const [createLog] = useCreateLogMutation();
  const [createProgressWatch] = useCreateProgressWatchMutation();
  const [showControls, setShowControls] = useState(true);
  const [duration, setDuration] = useState(0);

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

  // ufngsi mendapatkan konten
  const getBackendContentType = useCallback(() => {
    // jika episode series
    if (seriesData?.episodeId) {
      return "EPISODE_SERIES";
    }

    // jika movie
    if (contentType === "MOVIE") {
      return "FILM";
    }

    return contentType;
  }, [contentType, seriesData]);

  const handleCreateLog = useCallback(async () => {
    if (logCreatedRef.current) return;
    if (logType !== "WATCH_TRAILER") return;
    if (!contentId) return;

    try {
      const backendContentType = getBackendContentType();

      const payload = {
        logType: "WATCH_TRAILER",
        contentId: String(contentId),
        contentType: backendContentType,
        device,
      };

      console.log("📝 Creating log with payload:", payload);

      const result = await createLog(payload).unwrap();
      console.log("✅ Log created successfully:", result);

      logCreatedRef.current = true;
    } catch (error) {
      console.error("❌ Failed to create log:", error);
    }
  }, [logType, contentId, createLog, getBackendContentType, device]);

  // save progress
  const handleSaveProgress = useCallback(() => {
    if (!contentId || progressRef.current.playedSeconds === 0) return;
    if (logType !== "WATCH_CONTENT") return;

    const percentage = progressRef.current.percentage;
    const backendContentType = getBackendContentType();

    const payload = {
      contentId: String(contentId),
      contentType: backendContentType,
      progressSeconds: Math.floor(progressRef.current.playedSeconds),
      progressPercentage: percentage,
      isCompleted: percentage >= 80,
      device,
    };

    // tes ini kalo mau hapus, hapus aja bang
    console.log("===== DEBUG WATCH PROGRESS =====");
    console.log("1. Original contentType:", contentType);
    console.log("2. Backend contentType:", backendContentType);
    console.log("3. Payload:", JSON.stringify(payload, null, 2));
    console.log("================================");

    createProgressWatch(payload)
      .unwrap()
      .then((res) => console.log("Progres tontonan berhasil disimpan:", res))
      .catch((err) => {
        console.error("Gagal menyimpan progres:", err);
      });
  }, [
    contentId,
    createProgressWatch,
    device,
    logType,
    contentType,
    getBackendContentType,
  ]);

  const throttledSaveProgress = useCallback(
    throttle(handleSaveProgress, 5000, { leading: false, trailing: true }),
    [handleSaveProgress],
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

  useEffect(() => {
    logCreatedRef.current = false;
  }, [contentId]);

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
          href={`/report/${
            getBackendContentType() === "FILM" ? "movie" : "episode_series"
          }/${contentId}`}
          className="rounded-full bg-white/20 p-2 transition hover:bg-white/40"
        >
          <Image src={iconFlag} alt="icons-flag" width={32} height={32} />
        </Link>
      </div>

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
        onLoadedMetadata={(e) => {
          const video = e.target;
          if (video.duration) setDuration(video.duration);
        }}
        onPlay={() => {
          handleStartFrom();
          handleCreateLog();
        }}
        onPause={() => throttledSaveProgress.flush()}
        onTimeUpdate={(e) => {
          const video = e.target;
          if (!video.duration || isNaN(video.duration)) return;

          const played = video.currentTime / video.duration;
          progressRef.current = {
            playedSeconds: video.currentTime,
            percentage: Math.round(played * 100),
          };

          throttledSaveProgress();

          // update progress ke localstorage
          if (onProgressUpdate) {
            const updatedContent = {
              id: contentId,
              title: title,
              type: getBackendContentType() === "FILM" ? "movie" : "series",
              progress: Math.round(played * 100),
              progressSeconds: Math.floor(
                progressRef.current.playedSeconds || 0,
              ),
              updatedAt: new Date().toISOString(),
              thumbnailImageUrl: poster || null,
              // Untuk episode series
              ...(seriesData?.episodeId && {
                episodeId: seriesData.episodeId,
                isEpisode: true,
              }),
            };
            onProgressUpdate(updatedContent);
          }
        }}
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
  seriesData: PropTypes.object,
  onProgressUpdate: PropTypes.func,
};
