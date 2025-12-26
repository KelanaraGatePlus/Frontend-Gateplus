"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePodcastPlayer } from "@/context/PodcastPlayerContext";
import { useSearchParams } from "next/navigation";
import PropTypes from "prop-types";
import AudioPlayer from "react-h5-audio-player";
import { isMobile as detectMobile } from "react-device-detect";
import "react-h5-audio-player/lib/styles.css";

/*[--- COMPONENT IMPORT ---]*/
import AudioControl from "./AudioControl";
import ExpandView from "./ExpandView";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";
import { useCreateProgressWatchMutation } from "@/hooks/api/progressWatchAPI";
import { useGetCommentByEpisodePodcastQuery } from "@/hooks/api/commentSliceAPI";
import CommentModalPodcast from "../CommentModalPodcast/CommentModalPodcast";

export default function PodcastPlayback({
  isOpen,
  setIsOpen,
  currentlyPlaying,
}) {
  const searchParams = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);
  const podcastId = searchParams.get("podcast_detail");
  const [isCommentVisible, setIsCommentVisible] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [blobUrl, setBlobUrl] = useState("");
  const [volume, setVolume] = useState(1);
  const { audioRef, isPlaying, togglePlay, play, seek, seekBy, setPlayerVolume, setCurrentlyPlaying, playNextEpisode, playPrevEpisode, isExpand, setIsExpand, handleExpand } = usePodcastPlayer();
  const [episodePodcastData, setEpisodePodcastData] = useState({});
  const [createLog] = useCreateLogMutation();
  const [createProgressWatch] = useCreateProgressWatchMutation();
  // keep a stable ref to the mutation fn so effects don't re-run when function identity changes
  const createLogRef = useRef(createLog);
  useEffect(() => {
    createLogRef.current = createLog;
  }, [createLog]);
  // progress watch mutation ref
  const createProgressWatchRef = useRef(createProgressWatch);
  useEffect(() => {
    createProgressWatchRef.current = createProgressWatch;
  }, [createProgressWatch]);
  const { data: commentData, isLoading: isLoadingGetComment } = useGetCommentByEpisodePodcastQuery(episodePodcastData?.id, {
    skip: !episodePodcastData?.id
  });

  // Refs untuk melacak apakah log sudah dikirim untuk episode saat ini
  const clickLogSentRef = useRef(false);
  const watchLogSentRef = useRef(false);
  // tambahan: set untuk mencatat payload yang sudah dikirim (id|type)
  const sentLogsRef = useRef(new Set());
  // ref untuk menyimpan progress terakhir yang akan dikirim
  const progressRef = useRef({ playedSeconds: 0, percentage: 0 });
  const shouldAutoPlayRef = useRef(false);

  // Efek untuk update data episode & reset status log saat episode berganti
  useEffect(() => {
    setEpisodePodcastData(currentlyPlaying || {});
    // Reset status log jika ada episode baru yang dimainkan
    if (currentlyPlaying?.id) {
      clickLogSentRef.current = false;
      watchLogSentRef.current = false;
      // clear sent log records for new episode
      sentLogsRef.current.clear();
      // mark that we should attempt to autoplay when media is ready
      shouldAutoPlayRef.current = true;
    }
    // (no-op) keep in sync via context
  }, [currentlyPlaying]);

  // Efek untuk membuka/menutup player berdasarkan URL search params
  useEffect(() => {
    setIsOpen(!!podcastId);
  }, [podcastId]);

  // Efek untuk mendeteksi perangkat mobile saat komponen dimuat
  useEffect(() => {
    setIsMobile(detectMobile);
  }, []);

  // Efek untuk mengirim log 'CLICK' saat player terbuka untuk episode baru
  useEffect(() => {
    if (isOpen && episodePodcastData.id && !clickLogSentRef.current) {
      const key = `${episodePodcastData.id}|CLICK`;
      if (!sentLogsRef.current.has(key)) {
        const payload = {
          contentType: "EPISODE_PODCAST",
          logType: "CLICK",
          contentId: episodePodcastData.id,
          deviceType: isMobile ? "MOBILE" : "DESKTOP",
        };

        // record before sending to avoid races
        sentLogsRef.current.add(key);
        clickLogSentRef.current = true;
        createLogRef.current?.(payload)
          .unwrap?.()
          .then(() => {
            // ok
          })
          .catch((err) => {
            console.error("Failed to send CLICK log:", err);
            // on failure, remove key so future attempts can retry
            sentLogsRef.current.delete(key);
            clickLogSentRef.current = false;
          });
      }
    }
  }, [isOpen, episodePodcastData.id, isMobile]);

  // Efek untuk memantau waktu putar & mengirim log 'WATCH_CONTENT' saat mencapai 50%
  useEffect(() => {
    const audio = audioRef.current?.audio?.current;
    if (!audio) return;

    const updateTime = (e) => {
      const current_Time = audio.currentTime;
      const total_Duration = audio.duration || 0;

      setCurrentTime(current_Time);
      setDuration(total_Duration);

      // update playbackProgress in context so mini player can show progress
      const playbackProgress = total_Duration > 0 ? current_Time / total_Duration : 0;
      if (episodePodcastData.id && typeof setCurrentlyPlaying === "function") {
        setCurrentlyPlaying((prev) => {
          if (!prev || prev.id !== episodePodcastData.id) return prev;
          if (prev.playbackProgress === playbackProgress) return prev;
          return { ...prev, playbackProgress };
        });
      }

      // update progress ref for periodic save
      progressRef.current = {
        playedSeconds: current_Time,
        percentage: Math.round(playbackProgress * 100),
      };

      // Cek jika durasi valid, log 'WATCH_CONTENT' belum dikirim, dan ada episode ID
      if (total_Duration > 0 && !watchLogSentRef.current && episodePodcastData.id) {
        // Jika total durasi < 20 menit -> butuh 50% durasi
        // Jika total durasi >= 20 menit -> butuh 12 menit (720 detik)
        const twentyMinutesSec = 20 * 60;
        const twelveMinutesSec = 12 * 60;
        const requiredSeconds = total_Duration < twentyMinutesSec ? total_Duration * 0.5 : twelveMinutesSec;

        // jika current time melewati ambang waktu yang dibutuhkan
        if (current_Time >= requiredSeconds) {
          const key = `${episodePodcastData.id}|WATCH_CONTENT`;
          if (!sentLogsRef.current.has(key)) {
            // mark immediately to prevent multiple calls from repeated events
            sentLogsRef.current.add(key);
            watchLogSentRef.current = true;

            const payload = {
              contentType: "EPISODE_PODCAST",
              logType: "WATCH_CONTENT",
              contentId: episodePodcastData.id,
              deviceType: isMobile ? "MOBILE" : "DESKTOP",
              // optionally include the threshold used for debugging
              // thresholdSeconds: requiredSeconds,
            };

            console.log(`Sending WATCH_CONTENT log (threshold ${Math.round(requiredSeconds)}s reached):`, payload);
            createLogRef.current?.(payload)
              .unwrap?.()
              .then(() => {
                // already marked
              })
              .catch((err) => {
                console.error("Failed to send WATCH_CONTENT log:", err);
                // allow retry on failure
                sentLogsRef.current.delete(key);
                watchLogSentRef.current = false;
              });
          }
        }
      }

      // If media just loaded metadata (or became ready), try to autoplay if requested
      if (e?.type === "loadedmetadata" && shouldAutoPlayRef.current) {
        try {
          play();
        } catch (err) {
          console.error("Autoplay failed:", err);
        }
        shouldAutoPlayRef.current = false;
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);

    const onEnded = () => {
      if (typeof playNextEpisode === "function") {
        playNextEpisode();
      }
    };

    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, [episodePodcastData.id, isMobile, playNextEpisode, play]);

  // Periodically save watch progress every 10 seconds
  useEffect(() => {
    if (!episodePodcastData.id) return;

    const sendProgress = () => {
      const { playedSeconds, percentage } = progressRef.current;
      if (!playedSeconds || playedSeconds <= 0) return;

      const payload = {
        contentId: episodePodcastData.id,
        contentType: "EPISODE_PODCAST",
        progressSeconds: Math.floor(playedSeconds),
        progressPercentage: percentage,
        isCompleted: percentage >= 20,
        device: isMobile ? "MOBILE" : "DESKTOP",
      };

      createProgressWatchRef.current?.(payload);
    };

    const interval = setInterval(sendProgress, 10000);

    const handleBeforeUnload = () => sendProgress();
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // send one last time on cleanup
      sendProgress();
    };
  }, [episodePodcastData.id, isMobile]);


  const handleClosePodcast = () => {
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.delete("podcast_detail");
    window.history.replaceState({}, "", `?${updatedParams.toString()}`);
    setIsOpen(false);
    if (isExpand) {
      handleExpand();
    }
  };

  const handleViewComments = () => {
    setIsCommentVisible(!isCommentVisible);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    localStorage.setItem("volume", newVolume);
    setPlayerVolume(newVolume);
  };

  const handleDecreaseVolume = () => {
    if (audioRef.current?.audio?.current) {
      const currentVolume = audioRef.current.audio.current.volume;
      const newVolume = Math.max(0, currentVolume - 0.05);
      setVolume(newVolume);
      audioRef.current.audio.current.volume = newVolume;
    }
  };

  const handleIncreaseVolume = () => {
    if (audioRef.current?.audio?.current) {
      const currentVolume = audioRef.current.audio.current.volume;
      const newVolume = Math.min(1, currentVolume + 0.05);
      setVolume(newVolume);
      audioRef.current.audio.current.volume = newVolume;
    }
  };

  const handlePlay = () => {
    togglePlay();
  };
  const handleSeekForward = () => {
    seekBy(10);
  };

  const handleSeekBackward = () => {
    seekBy(-10);
  };

  const keyUp = (e) => {
    if (e.key === "ArrowRight") {
      handleSeekForward();
    } else if (e.key === "ArrowLeft") {
      handleSeekBackward();
    } else if (e.key === " ") {
      handlePlay();
    } else if (e.key === "ArrowUp") {
      handleIncreaseVolume();
    } else if (e.key === "ArrowDown") {
      handleDecreaseVolume();
    }
  };

  const handleSeek = (e) => {
    const value = parseFloat(e.target.value);
    seek(value);
  };

  useEffect(() => {
    const getBlobAudio = async () => {
      // Pastikan ada URL sebelum fetch
      if (!episodePodcastData.podcastFileURL) return;
      try {
        const res = await fetch(episodePodcastData.podcastFileURL);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
      } catch (error) {
        console.error("Failed to load audio blob:", error);
      }
    };
    getBlobAudio();

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [episodePodcastData.podcastFileURL]);

  useEffect(() => {
    const onFullScreenChange = () => {
      setIsExpand(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullScreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullScreenChange);
  }, []);

  return (
    <div
      className={`fixed h-max w-screen inset-0 z-40 transition-all duration-150 ease-linear ${isOpen ? "pointer-events-auto" : "pointer-events-none"} ${isExpand ? "bg-[#786151] overflow-hidden" : ""}`}
      tabIndex={0}
      onKeyUp={keyUp}
    >
      {/* Expand View - Full Screen */}
      {isExpand && (
        <ExpandView
          episodeId={episodePodcastData.id}
          coverEpisodeUrl={episodePodcastData.coverPodcastEpisodeURL}
          title={episodePodcastData.title}
          description={episodePodcastData.description}
          duration={duration}
          currentTime={currentTime}
          isExpand={isExpand}
          isCommentVisible={isCommentVisible}
          handleViewComments={handleViewComments}
          handleExpand={handleExpand}
        />
      )}

      {/* Kontrol dan Detail (selalu muncul, termasuk saat expand) */}
      <div className="fixed bottom-0 w-full z-30 pointer-events-auto">
        <AudioControl
          coverEpisodeUrl={episodePodcastData.coverPodcastEpisodeURL}
          title={episodePodcastData.title}
          description={episodePodcastData.description}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isPlay={isPlaying}
          isExpand={isExpand}
          isOpenDetailPodcast={isOpen}
          isMobile={isMobile}
          handleSeekBackward={handleSeekBackward}
          handleSeekForward={handleSeekForward}
          handlePlay={handlePlay}
          handlePrevEpisode={playPrevEpisode}
          handleNextEpisode={playNextEpisode}
          handleExpand={handleExpand}
          handleViewComments={handleViewComments}
          handleDecreaseVolume={handleDecreaseVolume}
          handleVolumeChange={handleVolumeChange}
          handleIncreaseVolume={handleIncreaseVolume}
          handleSeek={handleSeek}
          handleClosePodcast={handleClosePodcast}
        />
      </div>

      <div className="hidden">
        <AudioPlayer
          ref={audioRef}
          src={blobUrl || undefined}
          autoPlay={false}
          showJumpControls={false}
          customAdditionalControls={[]}
          customVolumeControls={[]}
          layout="horizontal"
          className="hidden"
        />
      </div>

      <CommentModalPodcast
        episodeId={episodePodcastData.id}
        isCommentVisible={isCommentVisible}
        setIsCommentVisible={setIsCommentVisible}
        commentData={commentData?.data?.data || []}
        isLoadingGetComment={isLoadingGetComment}
      />
    </div>
  );
}

PodcastPlayback.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  currentlyPlaying: PropTypes.object,
  handlePlayPodcast: PropTypes.func,
  podcast: PropTypes.object,
  episodePodcasts: PropTypes.array,
};