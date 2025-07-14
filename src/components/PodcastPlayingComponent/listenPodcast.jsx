"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PropTypes from "prop-types";
import AudioPlayer from "react-h5-audio-player";
import { isMobile as detectMobile } from "react-device-detect";
import "react-h5-audio-player/lib/styles.css";

/*[--- COMPONENT IMPORT ---]*/
import AudioControl from "./audioControl";
import ExpandPodcast from "./expandPodcast";
import CollapsePodcast from "./collapsePodcast";
import BottomSheet from "@/components/BottomSheet/page";
import SwipeableBottomSheet from "@/components/SwipeableBottomSheet/page";
import CloseCircleButton from "@/components/CloseCircleButton/page";
import { formatDateTime } from "@/lib/timeFormatter";

export default function ListenPodcast({ isOpen, setIsOpen }) {
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
  const [episodePodcastData] = useState({
    id: "dummy",
    podcastId: "cmbhdggt00005jwzkz3znfaj9",
    creatorId: "4d88a00f-23da-4856-8f01-c6aefb882d76",
    podcastTitle: "Ngopi Tengah Malam",
    title: "Episode 6",
    description:
      "Obrolan tentang rasa cukup di tengah dunia yang selalu minta lebih.",
    price: "10000",
    views: 7,
    audiofile: "/dummyAssets/podcast/audio1.mp3",
    coverEpisodeUrl: "https://picsum.photos/seed/eps6/800/450",
    notedEpisode: "Kunci tenang itu syukur",
    createdAt: "2025-06-09T18:27:51.823Z",
    updatedAt: "2025-06-17T12:34:03.908Z",
    creators: [
      {
        id: "creator1",
        profileName: "Jane Doe",
        username: "@janedoe",
        imageUrl: "https://picsum.photos/seed/profile1/200/200",
      },
      {
        id: "creator2",
        profileName: "John Smith",
        username: "@johnsmith",
        imageUrl: "https://picsum.photos/seed/profile2/200/200",
      },
      {
        id: "creator3",
        profileName: "Alice Blue",
        username: "@aliceblue",
        imageUrl: "https://picsum.photos/seed/profile3/200/200",
      },
    ],
    episode_podcasts: [
      {
        id: "dummy",
        podcastId: "cmbhdggt00005jwzkz3znfaj9",
        creatorId: "4d88a00f-23da-4856-8f01-c6aefb882d76",
        title: "Episode 1",
        description:
          "Ngobrol santai tentang hal-hal kecil yang ternyata punya dampak besar di hidup.",
        price: "10000",
        views: 5,
        coverEpisodeUrl: "https://picsum.photos/800/450?grayscale&blur=2",
        notedEpisode: "Justru Itu",
        createdAt: "2025-06-04T03:13:22.004Z",
        updatedAt: "2025-06-17T12:34:03.908Z",
      },
      {
        id: "dummy",
        podcastId: "cmbhdggt00005jwzkz3znfaj9",
        creatorId: "4d88a00f-23da-4856-8f01-c6aefb882d76",
        title: "Episode 2",
        description:
          "Kita bahas kenapa overthinking bisa muncul bahkan dari chat 'oke'.",
        price: "10000",
        views: 8,
        coverEpisodeUrl: "https://picsum.photos/seed/eps2/800/450",
        notedEpisode: "Relatable banget",
        createdAt: "2025-06-05T08:21:12.431Z",
        updatedAt: "2025-06-17T12:34:03.908Z",
      },
      {
        id: "dummy",
        podcastId: "cmbhdggt00005jwzkz3znfaj9",
        creatorId: "4d88a00f-23da-4856-8f01-c6aefb882d76",
        title: "Episode 3",
        description:
          "Kisah gagal move on yang akhirnya jadi pelajaran berharga. Siap-siap baper.",
        price: "10000",
        views: 12,
        coverEpisodeUrl: "https://picsum.photos/seed/eps3/800/450",
        notedEpisode: "Mantan siapa nih?",
        createdAt: "2025-06-06T10:09:45.100Z",
        updatedAt: "2025-06-17T12:34:03.908Z",
      },
      {
        id: "dummy",
        podcastId: "cmbhdggt00005jwzkz3znfaj9",
        creatorId: "4d88a00f-23da-4856-8f01-c6aefb882d76",
        title: "Episode 4",
        description:
          "Tentang mimpi masa kecil yang ternyata masih relevan banget buat hari ini.",
        price: "10000",
        views: 3,
        coverEpisodeUrl: "https://picsum.photos/seed/eps4/800/450",
        notedEpisode: "Throwback vibes",
        createdAt: "2025-06-07T12:15:33.900Z",
        updatedAt: "2025-06-17T12:34:03.908Z",
      },
      {
        id: "dummy",
        podcastId: "cmbhdggt00005jwzkz3znfaj9",
        creatorId: "4d88a00f-23da-4856-8f01-c6aefb882d76",
        title: "Episode 5",
        description:
          "Dari burnout jadi break, dari break jadi bangkit. Cerita soal self-reset.",
        price: "10000",
        views: 9,
        coverEpisodeUrl: "https://picsum.photos/seed/eps5/800/450",
        notedEpisode: "Capek tapi nggak nyerah",
        createdAt: "2025-06-08T15:48:20.532Z",
        updatedAt: "2025-06-17T12:34:03.908Z",
      },
      {
        id: "dummy",
        podcastId: "cmbhdggt00005jwzkz3znfaj9",
        creatorId: "4d88a00f-23da-4856-8f01-c6aefb882d76",
        title: "Episode 6",
        description:
          "Obrolan tentang rasa cukup di tengah dunia yang selalu minta lebih.",
        price: "10000",
        views: 7,
        coverEpisodeUrl: "https://picsum.photos/seed/eps6/800/450",
        notedEpisode: "Kunci tenang itu syukur",
        createdAt: "2025-06-09T18:27:51.823Z",
        updatedAt: "2025-06-17T12:34:03.908Z",
      },
    ],
  });

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
        const res = await fetch(episodePodcastData.audiofile);
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
  }, [episodePodcastData.audiofile]);

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
                  coverEpisodeUrl={episodePodcastData.coverEpisodeUrl}
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
                  coverEpisodeUrl={episodePodcastData.coverEpisodeUrl}
                  podcastTitle={episodePodcastData.podcastTitle}
                  title={episodePodcastData.title}
                  description={episodePodcastData.description}
                  createdAt={formatDateTime(episodePodcastData.createdAt, "short")}
                  creators={episodePodcastData.creators}
                  episodePodcasts={episodePodcastData.episode_podcasts}
                  isExpand={isExpand}
                  isCommentVisible={isCommentVisible}
                  isMobile={isMobile}
                  handleViewComments={handleViewComments}
                />
              )}
            </div>
          </SwipeableBottomSheet>
        )}

        {/* Kontrol dan Detail */}
        <div className="absolute bottom-0 w-full z-30  pointer-events-auto">
          <AudioControl
            coverEpisodeUrl={episodePodcastData.coverEpisodeUrl}
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

ListenPodcast.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
}