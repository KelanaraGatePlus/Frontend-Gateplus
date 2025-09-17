import React, { useRef, useState, useCallback, useEffect } from "react";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";
import { useCreateProgressWatchMutation } from "@/hooks/api/progressWatchAPI";
import PropTypes from "prop-types";
import ReactPlayer from "react-player";
import throttle from "lodash.throttle";
import { Play, Pause, Volume2, Maximize } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import IconsArrowLeft from "@@/icons/icons-dashboard/icons-arrow-left.svg";
import formatDuration from "@/lib/helper/formatDurationHelper";
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
}) {
  const playerWrapperRef = useRef(null);
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [showPoster, setShowPoster] = useState(!!poster);
  const [showControls, setShowControls] = useState(true);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverPos, setHoverPos] = useState(0);
  const hideTimeout = useRef(null);
  const hasSeekedRef = useRef(false);

  const progressRef = useRef({ playedSeconds: 0, percentage: 0 });

  const [createLog] = useCreateLogMutation();
  const [createProgressWatch] = useCreateProgressWatchMutation();

  // ====== FORMAT TIME ======
  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return "00:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStartFrom = () => {
    if (startFrom > 0 && !hasSeekedRef.current && videoRef.current) {
      videoRef.current.seekTo(startFrom, "seconds");
      hasSeekedRef.current = true; // Supaya cuma sekali
    }
  };

  // ====== PROGRESS SAVE ======
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
    };

    createProgressWatch(payload);
  }, [contentId, contentType, createProgressWatch, logType]);

  const throttledSaveProgress = useCallback(
    throttle(handleSaveProgress, 60000, { leading: false, trailing: true }),
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

  // ====== PLAY/PAUSE & SEEK ======
  const handlePause = () => {
    setIsPlaying(false);
    throttledSaveProgress.flush();
  };

  const handlePlayPause = () => {
    if (showPoster) {
      setShowPoster(false);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const handleSeek = (e) => {
    const percent = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.seekTo(percent / 100, "fraction");
    }
  };

  // ====== FULLSCREEN ======
  const handleFullscreen = () => {
    const element = playerWrapperRef.current;
    if (!element) return;
    if (!document.fullscreenElement) {
      element.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  // ====== AUTO-HIDE CONTROLS ======
  const resetHideControls = () => {
    setShowControls(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    resetHideControls();
    const wrapper = playerWrapperRef.current;
    if (!wrapper) return;

    wrapper.addEventListener("mousemove", resetHideControls);
    wrapper.addEventListener("click", resetHideControls);

    return () => {
      wrapper.removeEventListener("mousemove", resetHideControls);
      wrapper.removeEventListener("click", resetHideControls);
    };
  }, []);

  // ====== PREVIEW WAKTU ======
  const handleMouseMoveProgress = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = e.clientX - rect.left;
    const percent = Math.min(Math.max(pos / rect.width, 0), 1);
    setHoverPos(percent * 100);
    setHoverTime(percent * duration);
  };

  const handleMouseLeaveProgress = () => {
    setHoverTime(null);
  };

  return (
    <div
      ref={playerWrapperRef}
      className={`relative w-screen max-w-full md:h-[500px] 2xl:h-[800px] overflow-hidden bg-black ${className || ""}`}
    >
      <ReactPlayer
        ref={videoRef}
        url={src}
        width="100%"
        height="100%"
        playing={isPlaying}
        light={poster}
        controls={false}
        config={{
          file: {
            attributes: {
              controlsList: "nodownload",
              onContextMenu: (e) => e.preventDefault(),
            },
          },
        }}
        onStart={() => {
          handleStartFrom();
          if (logType == "WATCH_TRAILER") {
            createLog({ logType, contentId, contentType });
          }

        }}
        onProgress={({ played, playedSeconds }) => {
          const dur = videoRef.current.getDuration();
          setProgress(played * 100);
          setCurrentTime(playedSeconds);
          setDuration(dur);

          // buffered range
          if (videoRef.current.getInternalPlayer) {
            const internal = videoRef.current.getInternalPlayer();
            if (internal && internal.buffered && internal.buffered.length) {
              const end = internal.buffered.end(internal.buffered.length - 1);
              setBuffered((end / dur) * 100);
            }
          }

          progressRef.current = {
            playedSeconds,
            percentage: Math.round(played * 100),
          };
          throttledSaveProgress();
        }}
        onPause={handlePause}
      />

      {/* Custom Header */}
      <div
        className={`absolute top-0 left-0 right-0 transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          } bg-gradient-to-b from-black to-transparent py-4 px-16 flex items-center gap-4 justify-between`}
      >

        <div className="flex flex-row gap-4 items-center justify-center">
          <Link href="/">
            <Image src={IconsArrowLeft} alt="icons-arrow-left" width={32} height={32} />
          </Link>
          <div className="flex flex-col gap-1">
            <span className="text-md text-white font-black">{title}</span>
            <span className="text-xs text-gray-400">{formatDuration(duration)} | {ageRestriction} | {genre} </span>
          </div>
        </div>
        <Link href="/">
          <Image src={iconFlag} alt="icons-flag" width={32} height={32} />
        </Link>
      </div>

      {/* Custom Controller */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          } bg-gradient-to-t from-black to-transparent py-4 px-16 flex items-center gap-4`}
      >
        {/* Play / Pause */}
        <button
          onClick={handlePlayPause}
          className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Progress Bar */}
        <div
          className="relative flex-1 h-3 cursor-pointer group"
          onMouseMove={handleMouseMoveProgress}
          onMouseLeave={handleMouseLeaveProgress}
        >
          {/* Track dasar */}
          <div className="absolute top-1/2 left-0 w-full h-1 rounded-full bg-gray-700 -translate-y-1/2" />
          {/* Buffered */}
          <div
            className="absolute top-1/2 left-0 h-1 rounded-full bg-gray-400 -translate-y-1/2"
            style={{ width: `${buffered}%` }}
          />
          {/* Progress */}
          <div
            className="absolute top-1/2 left-0 h-1 rounded-full bg-[#1297DC] -translate-y-1/2"
            style={{ width: `${progress}%` }}
          />
          {/* Knob */}
          <div
            className="absolute top-1/2 w-4 h-4 rounded-full bg-[#1297DC] border-[#1297DC] -translate-y-1/2 -translate-x-1/2 pointer-events-none transition"
            style={{ left: `${progress}%` }}
          />
          {/* Input range transparan */}
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="absolute top-0 left-0 w-full h-3 opacity-0 cursor-pointer"
          />
          {/* Hover Preview */}
          {hoverTime !== null && (
            <div
              className="absolute -top-10 px-2 py-1 bg-black/80 text-white text-xs rounded"
              style={{ left: `${hoverPos}%`, transform: "translateX(-50%)" }}
            >
              {formatTime(hoverTime)}
            </div>
          )}
        </div>

        {/* Time Display */}
        <span className="text-xs text-white">{formatTime(currentTime)} / {formatTime(duration)}</span>

        {/* Volume (dummy) */}
        <button className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition">
          <Volume2 className="w-6 h-6 text-white" />
        </button>

        {/* Fullscreen */}
        <button
          onClick={handleFullscreen}
          className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition"
        >
          <Maximize className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}

DefaultVideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  poster: PropTypes.string,
  className: PropTypes.string,
  contentType: PropTypes.oneOf(["MOVIE", "SERIES_EPISODE"]).isRequired,
  logType: PropTypes.string,
  contentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  startFrom: PropTypes.number,
  title: PropTypes.string,
  genre: PropTypes.string,
  ageRestriction: PropTypes.string,
};
