"use client";
import { useEffect, useState } from "react";
import { usePodcastPlayer } from "@/context/PodcastPlayerContext";

export default function usePodcastController() {
  const { audioRef, isPlaying, togglePlay, seek } = usePodcastPlayer();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef?.current?.audio?.current;
    if (!audio) return;

    const onTime = () => {
      setCurrentTime(audio.currentTime || 0);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onTime);

    // initial sync
    onTime();

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onTime);
    };
  }, [audioRef]);

  const handleSeekEvent = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      seek(value);
      setCurrentTime(value);
    }
  };

  return {
    currentTime,
    duration,
    handleSeekEvent,
    isPlaying,
    togglePlay,
  };
}
