"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
} from "react";
import { usePathname } from "next/navigation";
import routeWithoutPodcastMiniPlayer from "@/lib/constants/routeWithoutPodcastMiniPlayer";
import PropTypes from "prop-types";
import PodcastPlayback from "@/components/PodcastPlayer/PodcastPlayback";
import PodcastMiniPlayer from "@/components/PodcastPlayer/PodcastMiniPlayer";
import { useGetPodcastByIdQuery } from "@/hooks/api/podcastSliceAPI";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

const STORAGE_KEY = "podcast_player_state";
const SPEED_OPTIONS = [0.5, 1, 1.5, 2];

const PodcastPlayerContext = createContext(null);
const DEFAULT_SPEED = 1;

function loadState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn("Failed to parse podcast player state", err);
    return null;
  }
}

function saveState(state) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn("Failed to persist podcast player state", err);
  }
}

export function PodcastPlayerProvider({ children, disablePlayer = false }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [podcastMeta, setPodcastMeta] = useState(null);
  const [episodeList, setEpisodeList] = useState([]);
  const [fetchPodcastId, setFetchPodcastId] = useState(null);
  const [isDetailPage, setIsDetailPage] = useState(false);
  const [isExpand, setIsExpand] = useState(false);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [episodeData, setEpisodeData] = useState(null);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [speedDirection, setSpeedDirection] = useState(1);
  const [initialTime, setInitialTime] = useState(0);

  // Hydrate from storage once
  useEffect(() => {
    const stored = loadState();
    if (stored) {
      setIsOpen(stored.isOpen || false);
      setCurrentlyPlaying(stored.currentlyPlaying || null);
      setPodcastMeta(stored.podcastMeta || null);
      setEpisodeList(stored.episodeList || []);
      setEpisodeData(stored.episodeData || null);
      setSpeed(stored.speed || DEFAULT_SPEED);
    }
  }, []);

  // Persist on change
  useEffect(() => {
    saveState({
      isOpen,
      currentlyPlaying,
      podcastMeta,
      episodeList,
      episodeData,
      speed,
    });
  }, [isOpen, currentlyPlaying, podcastMeta, episodeList, episodeData, speed]);

  // keep episodeData in sync with currentlyPlaying
  useEffect(() => {
    setEpisodeData(currentlyPlaying || null);
  }, [currentlyPlaying]);

  // If we need to fetch podcast detail (to get episodes), call the RTK Query hook
  const { data: fetchedPodcastResp } = useGetPodcastByIdQuery(
    { id: fetchPodcastId, withEpisodes: true },
    { skip: !fetchPodcastId },
  );

  // When fetched podcast data arrives, derive episode array and set into context
  React.useEffect(() => {
    if (!fetchedPodcastResp) return;
    const podcastData = fetchedPodcastResp.data || fetchedPodcastResp;
    const derived =
      podcastData?.episode_podcasts?.episodes ||
      podcastData?.episodePodcasts ||
      podcastData?.episodes ||
      [];
    if (derived && derived.length) {
      setEpisodeList(derived);
    }
    // clear fetch id after populated
    setFetchPodcastId(null);
  }, [fetchedPodcastResp]);

  const playEpisode = async (episode, podcast, episodes) => {
    // if caller provides episodes, use them; otherwise attempt to derive or fetch

    if (episodes && episodes.length) {
      setEpisodeList(episodes);
    } else if (podcast) {
      const derived =
        podcast?.episode_podcasts?.episodes ||
        podcast?.episodePodcasts ||
        podcast?.episodes;
      if (derived && derived.length) setEpisodeList(derived);
      else if (podcast.id) setFetchPodcastId(podcast.id);
    } else if (episode && !episodeList?.length) {
      // if we only have an episode object, try to fetch its parent podcast by id if available
      const pid = episode.podcastId || episode.podcast_id || null;
      if (pid) setFetchPodcastId(pid);
    }

    setCurrentlyPlaying(episode);
    setPodcastMeta(podcast || null);
    setIsOpen(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${BACKEND_URL}/watchProgress?contentId=${episode.Id}&contentType=EPISODE_PODCAST`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        },
      );
      const json = await res.json();
      const seconds = json?.data?.isCompleted
        ? 0
        : (json?.data?.progressSeconds ?? 0);
      setInitialTime(seconds);
    } catch (err) {
      console.warn("Failed to fetch watch progress", err);
      setInitialTime(0);
    }

    // attempt to auto-play after switching episode (skip if player disabled)
    if (!disablePlayer && !disablePlayerOnRoute) {
      setTimeout(() => {
        try {
          play();
        } catch (err) {
          console.error("Autoplay failed:", err);
        }
      }, 200);
    }
  };

  useEffect(() => {
    if (!initialTime || !currentlyPlaying) return;

    // Tunggu audio ter-load dulu baru seek
    const trySeek = () => {
      const audio = audioRef.current?.audio?.current;
      if (audio && audio.readyState >= 1) {
        audio.currentTime = initialTime;
        setInitialTime(0); // reset supaya tidak seek ulang
      } else {
        // Kalau belum ready, coba lagi setelah canplay event
        const onCanPlay = () => {
          audio.currentTime = initialTime;
          setInitialTime(0);
          audio.removeEventListener("canplay", onCanPlay);
        };
        audio?.addEventListener("canplay", onCanPlay);
      }
    };

    const timer = setTimeout(trySeek, 300);
    return () => clearTimeout(timer);
  }, [initialTime, currentlyPlaying]);

  const playPrevEpisode = () => {
    if (!episodeList || !currentlyPlaying) return;
    const idx = episodeList.findIndex((e) => e.id === currentlyPlaying.id);
    if (idx >= 0 && idx < episodeList.length - 1) {
      const next = episodeList[idx + 1];
      if (next.isPurchased || podcastMeta.isOwner || podcastMeta.isSubscribed) {
        playEpisode(next, podcastMeta, episodeList);
      } else {
        window.location.href = `/checkout/purchase/podcasts/${podcastMeta.id}/${next.id}`;
      }
    }
  };

  const playNextEpisode = () => {
    if (!episodeList || !currentlyPlaying) return;
    const idx = episodeList.findIndex((e) => e.id === currentlyPlaying.id);
    if (idx > 0) {
      const prev = episodeList[idx - 1];
      if (prev.isPurchased || podcastMeta.isOwner || podcastMeta.isSubscribed) {
        playEpisode(prev, podcastMeta, episodeList);
      } else {
        window.location.href = `/checkout/purchase/podcasts/${podcastMeta.id}/${prev.id}`;
      }
    }
  };

  const play = () => {
    try {
      const audio = audioRef.current?.audio?.current;
      if (audio) {
        audio.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.warn("Failed to play audio", err);
    }
  };

  const pause = () => {
    try {
      const audio = audioRef.current?.audio?.current;
      if (audio) {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      console.warn("Failed to pause audio", err);
    }
  };

  const stopPlayback = () => {
    try {
      const audio = audioRef.current?.audio?.current;
      if (audio) {
        audio.pause();
        // Clear the audio source to prevent background playback
        audio.src = "";
        // Reset playback position
        audio.currentTime = 0;
      }
    } catch (err) {
      console.warn("Failed to stop audio", err);
    }
    setIsPlaying(false);
    setIsOpen(false);
    setCurrentlyPlaying(null);
  };

  const togglePlay = () => {
    if (isPlaying) pause();
    else play();
  };

  const seek = (time) => {
    const audio = audioRef.current?.audio?.current;
    if (audio) audio.currentTime = time;
  };

  const seekBy = (delta) => {
    const audio = audioRef.current?.audio?.current;
    if (audio) audio.currentTime = Math.max(0, audio.currentTime + delta);
  };

  const setPlayerVolume = (v) => {
    const audio = audioRef.current?.audio?.current;
    if (audio) audio.volume = v;
    setVolume(v);
  };

  const handleExpand = () => {
    console.log("Toggling expand");
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

  const setPlaybackSpeed = (newSpeed) => {
    const audio = audioRef.current?.audio?.current;
    if (audio) audio.playbackRate = newSpeed;
    setSpeed(newSpeed);
  };

  const bounceSpeed = () => {
    const currentIdx = SPEED_OPTIONS.indexOf(speed);
    const safeIdx =
      currentIdx === -1 ? SPEED_OPTIONS.indexOf(DEFAULT_SPEED) : currentIdx;
    const nextIdx = safeIdx + speedDirection;

    if (nextIdx >= SPEED_OPTIONS.length) {
      // bounce back from upper bound
      setSpeedDirection(-1);
      setPlaybackSpeed(
        SPEED_OPTIONS[SPEED_OPTIONS.length - 2] || SPEED_OPTIONS[0],
      );
      return;
    }

    if (nextIdx < 0) {
      // bounce forward from lower bound
      setSpeedDirection(1);
      setPlaybackSpeed(SPEED_OPTIONS[1] || SPEED_OPTIONS[0]);
      return;
    }

    setPlaybackSpeed(SPEED_OPTIONS[nextIdx]);
  };

  // keep playback rate synced with selected speed
  useEffect(() => {
    const audio = audioRef.current?.audio?.current;
    if (audio) audio.playbackRate = speed;
  }, [speed]);

  // Decide whether mini player should be hidden on current route
  const hideMiniPlayerOnRoute = useMemo(() => {
    const patterns = routeWithoutPodcastMiniPlayer || [];
    return (
      Array.isArray(patterns) && patterns.some((re) => re.test(pathname || ""))
    );
  }, [pathname]);

  // Fully disable player (and pause audio) on the same routes
  const disablePlayerOnRoute = hideMiniPlayerOnRoute;

  useEffect(() => {
    if (disablePlayerOnRoute) {
      try {
        pause();
      } catch {
        console.error("Failed to pause playback properly");
      }
      setIsOpen(false);
    }
  }, [disablePlayerOnRoute]);

  const value = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      currentlyPlaying,
      episodeData,
      setCurrentlyPlaying,
      podcastMeta,
      episodeList,
      isExpand,
      setIsExpand,
      playEpisode,
      playNextEpisode,
      playPrevEpisode,
      isDetailPage,
      setIsDetailPage,
      audioRef,
      isPlaying,
      setIsPlaying,
      play,
      pause,
      togglePlay,
      seek,
      seekBy,
      volume,
      setPlayerVolume,
      handleExpand,
      speed,
      bounceSpeed,
      setPlaybackSpeed,
      stopPlayback,
      speedOptions: SPEED_OPTIONS,
      initialTime,
    }),
    [
      isOpen,
      currentlyPlaying,
      episodeData,
      podcastMeta,
      episodeList,
      isDetailPage,
      isPlaying,
      volume,
      isExpand,
      setIsExpand,
      handleExpand,
      speed,
      bounceSpeed,
      setPlaybackSpeed,
    ],
  );

  return (
    <PodcastPlayerContext.Provider value={value}>
      {children}
      {/* Mount playback UI only when player is not disabled */}
      {!disablePlayer && !disablePlayerOnRoute && (
        <>
          <div className={`${isDetailPage || isExpand ? "" : "hidden"}`}>
            <Suspense fallback={null}>
              <PodcastPlayback
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                currentlyPlaying={currentlyPlaying}
                handlePlayPodcast={(episode) =>
                  playEpisode(episode, podcastMeta, episodeList)
                }
                podcast={podcastMeta}
                episodePodcasts={episodeList}
              />
            </Suspense>
          </div>

          {/* Render mini player on non-detail pages */}
          {!isDetailPage && !isExpand && !hideMiniPlayerOnRoute && (
            <PodcastMiniPlayer
              currentlyPlaying={currentlyPlaying}
              podcastMeta={podcastMeta}
              coverImage={episodeData?.coverPodcastEpisodeURL || null}
              onClick={() => setIsOpen(true)}
              subtitle={episodeData?.title}
            />
          )}
        </>
      )}
    </PodcastPlayerContext.Provider>
  );
}

PodcastPlayerProvider.propTypes = {
  children: PropTypes.node.isRequired,
  disablePlayer: PropTypes.bool,
};

export function usePodcastPlayer() {
  const ctx = useContext(PodcastPlayerContext);
  if (!ctx)
    throw new Error(
      "usePodcastPlayer must be used within PodcastPlayerProvider",
    );
  return ctx;
}
