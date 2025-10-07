"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PropTypes from "prop-types";
import AudioPlayer from "react-h5-audio-player";
import { isMobile as detectMobile } from "react-device-detect";
import "react-h5-audio-player/lib/styles.css";

/*[--- COMPONENT IMPORT ---]*/
import AudioControl from "./AudioControl";
import ExpandPodcast from "./ExpandView";
import CollapsePodcast from "./CollapseView";
import BottomSheet from "@/components/BottomSheet/page";
import SwipeableBottomSheet from "@/components/SwipeableBottomSheet/page";
import CloseCircleButton from "@/components/CloseCircleButton/page";
import { formatDateTime } from "@/lib/timeFormatter";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";

export default function PodcastPlayback({
  isOpen,
  setIsOpen,
  currentlyPlaying,
  handlePlayPodcast,
  podcast,
  episodePodcasts,
}) {
  const searchParams = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);
  const podcastId = searchParams.get("podcast_detail");
  const [isExpand, setIsExpand] = useState(false);
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [isPlay, setIsPlay] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [blobUrl, setBlobUrl] = useState("");
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);
  const [episodePodcastData, setEpisodePodcastData] = useState({});
  const [createLog] = useCreateLogMutation();

  // Refs untuk melacak apakah log sudah dikirim untuk episode saat ini
  const clickLogSentRef = useRef(false);
  const watchLogSentRef = useRef(false);

  // Efek untuk update data episode & reset status log saat episode berganti
  useEffect(() => {
    setEpisodePodcastData(currentlyPlaying || {});
    // Reset status log jika ada episode baru yang dimainkan
    if (currentlyPlaying?.id) {
      clickLogSentRef.current = false;
      watchLogSentRef.current = false;
    }
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
      const payload = {
        contentType: "EPISODE_PODCAST",
        logType: "CLICK",
        contentId: episodePodcastData.id,
        deviceType: isMobile ? "MOBILE" : "DESKTOP",
      };

      console.log("Sending CLICK log:", payload);
      createLog(payload)
        .unwrap()
        .then(() => {
          clickLogSentRef.current = true; // Tandai log CLICK sudah terkirim
        })
        .catch((err) => {
          console.error("Failed to send CLICK log:", err);
        });
    }
  }, [isOpen, episodePodcastData.id, isMobile, createLog]);

  // Efek untuk memantau waktu putar & mengirim log 'WATCH_CONTENT' saat mencapai 70%
  useEffect(() => {
    const audio = audioRef.current?.audio?.current;
    if (!audio) return;

    const updateTime = () => {
      const current_Time = audio.currentTime;
      const total_Duration = audio.duration || 0;

      setCurrentTime(current_Time);
      setDuration(total_Duration);

      // Cek jika durasi valid, log 'WATCH_CONTENT' belum dikirim, dan ada episode ID
      if (total_Duration > 0 && !watchLogSentRef.current && episodePodcastData.id) {
        const playbackPercent = (current_Time / total_Duration) * 100;

        // Jika persentase mencapai 70% atau lebih
        if (playbackPercent >= 70) {
          const payload = {
            contentType: "EPISODE_PODCAST",
            logType: "WATCH_CONTENT",
            contentId: episodePodcastData.id,
            deviceType: isMobile ? "MOBILE" : "DESKTOP",
          };

          console.log("Sending WATCH_CONTENT log (70% reached):", payload);
          createLog(payload)
            .unwrap()
            .then(() => {
              watchLogSentRef.current = true; // Tandai log WATCH_CONTENT sudah terkirim
            })
            .catch((err) => {
              console.error("Failed to send WATCH_CONTENT log:", err);
            });
        }
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateTime);
    };
  }, [episodePodcastData.id, isMobile, createLog]);


  const handleClosePodcast = () => {
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.delete("podcast_detail");
    window.history.replaceState({}, "", `?${updatedParams.toString()}`);
    setIsOpen(false);
    if (isExpand) {
      handleExpand();
    }
  };

  const handleExpand = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
      setIsExpand(true);
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Exit fullscreen error:", err);
      });
      setIsExpand(false);
    }
  };

  const handleViewComments = () => {
    setIsCommentVisible(!isCommentVisible);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    localStorage.setItem("volume", newVolume);
    if (audioRef.current?.audio?.current) {
      audioRef.current.audio.current.volume = newVolume;
    }
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
    if (audioRef.current) {
      if (isPlay) {
        setIsPlay(false);
        audioRef.current.audio.current.pause();
      } else {
        setIsPlay(true);
        audioRef.current.audio.current.play();
      }
    }
  };
  const handleSeekForward = () => {
    if (audioRef.current) {
      audioRef.current.audio.current.currentTime += 10;
    }
  };

  const handleSeekBackward = () => {
    if (audioRef.current) {
      audioRef.current.audio.current.currentTime -= 10;
    }
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
    if (audioRef.current?.audio?.current) {
      audioRef.current.audio.current.currentTime = value;
    }
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
      className={`fixed inset-0 z-10 transition-all duration-150 ease-linear ${isOpen ? "pointer-events-auto bg-black/70 backdrop-blur-xs" : "pointer-events-none"} ${isExpand && isCommentVisible ? "bg-neutral-900" : ""}`}
      tabIndex={0}
      onKeyUp={keyUp}
    >
      <div className="flex h-screen w-screen flex-col relative">
        {isOpen && (
          <SwipeableBottomSheet isOpen={isOpen} isMobile={isMobile} onClose={handleClosePodcast}>
            <div className="relative z-30 bg-neutral-900">
              <BottomSheet />
              <CloseCircleButton onClose={handleClosePodcast} />

              {isExpand ? (
                <ExpandPodcast
                  episodeId={episodePodcastData.id}
                  coverEpisodeUrl={episodePodcastData.coverPodcastEpisodeURL}
                  title={episodePodcastData.title}
                  description={episodePodcastData.description}
                  duration={duration}
                  currentTime={currentTime}
                  isExpand={isExpand}
                  isCommentVisible={isCommentVisible}
                  handleViewComments={handleViewComments}
                />
              ) : (
                <CollapsePodcast
                  episodeId={episodePodcastData.id}
                  coverEpisodeUrl={episodePodcastData.coverPodcastEpisodeURL}
                  podcastTitle={podcast?.title || ""}
                  title={episodePodcastData.title}
                  description={episodePodcastData.description}
                  createdAt={formatDateTime(episodePodcastData.createdAt, "short")}
                  collaborators={episodePodcastData.collaborators || []}
                  episodePodcasts={episodePodcasts || []}
                  isExpand={isExpand}
                  isCommentVisible={isCommentVisible}
                  isMobile={isMobile}
                  handleViewComments={handleViewComments}
                  currentlyPlaying={currentlyPlaying}
                  handlePlayPodcast={handlePlayPodcast}
                />
              )}
            </div>
          </SwipeableBottomSheet>
        )}

        {/* Kontrol dan Detail */}
        <div className="absolute bottom-0 w-full z-30 pointer-events-auto">
          <AudioControl
            coverEpisodeUrl={episodePodcastData.coverPodcastEpisodeURL}
            title={episodePodcastData.title}
            description={episodePodcastData.description}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isPlay={isPlay}
            isExpand={isExpand}
            isCommentVisible={isCommentVisible}
            isOpenDetailPodcast={isOpen}
            isMobile={isMobile}
            handleSeekBackward={handleSeekBackward}
            handleSeekForward={handleSeekForward}
            handlePlay={handlePlay}
            handleExpand={handleExpand}
            handleViewComments={handleViewComments}
            handleDecreaseVolume={handleDecreaseVolume}
            handleVolumeChange={handleVolumeChange}
            handleIncreaseVolume={handleIncreaseVolume}
            handleSeek={handleSeek}
            handleClosePodcast={handleClosePodcast}
          />
        </div>
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