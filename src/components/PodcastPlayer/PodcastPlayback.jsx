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

  useEffect(() => {
    setEpisodePodcastData(currentlyPlaying || {});
  }, [currentlyPlaying]);
  console.log("Currently Playing:", currentlyPlaying);

  useEffect(() => {
    setIsOpen(!!podcastId);
  }, [podcastId]);

  useEffect(() => {
    setIsMobile(detectMobile);
  }, []);

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

  useEffect(() => {
    const audio = audioRef.current?.audio?.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateTime);
    };
  }, []);

  const handleSeek = (e) => {
    const value = parseFloat(e.target.value);
    if (audioRef.current?.audio?.current) {
      audioRef.current.audio.current.currentTime = value;
    }
  };

  useEffect(() => {
    const getBlobAudio = async () => {
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
        <div className="absolute bottom-0 w-full z-30  pointer-events-auto">
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
}