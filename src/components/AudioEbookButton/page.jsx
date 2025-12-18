"use client";
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";

export default function AudioEbookButton({ audioUrl, className, isDark }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize and manage audio element when audio URL changes
  useEffect(() => {
    // Cleanup any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current.removeAttribute("src");
      audioRef.current = null;
      setIsPlaying(false);
    }

    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.preload = "none";

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    audioRef.current = audio;

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, [audioUrl]);

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
    } catch (err) {
      console.error("Gagal memutar audio ebook:", err);
    }
  };

  if (!audioUrl) return null;

  return (
    <button
      className={
        className ||
            `rounded-full ${isDark ? "bg-[#f5f5f5]/30 border-white/30" : "bg-[#848484] border-black/30"} border-2 backdrop-blur-md p-3 w-16 h-16 fixed bottom-10 right-10 flex items-center justify-center`
        }
      onClick={toggleAudio}
      aria-label={isPlaying ? "Pause audiobook" : "Play audiobook"}
      title={isPlaying ? "Pause audiobook" : "Play audiobook"}
    >
      <Icon
        icon={isPlaying ? "solar:soundwave-broken" : "solar:play-outline"}
        className={"w-full h-full text-white"}
      />
    </button>
  );
}

AudioEbookButton.propTypes = {
  audioUrl: PropTypes.string,
  className: PropTypes.string,
};
