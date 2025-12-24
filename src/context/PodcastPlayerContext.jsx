"use client";
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import PodcastPlayback from "@/components/PodcastPlayer/PodcastPlayback";
import PodcastMiniPlayer from "@/components/PodcastPlayer/PodcastMiniPlayer";
import { useGetPodcastByIdQuery } from "@/hooks/api/podcastSliceAPI";
import Image from "next/legacy/image";

const STORAGE_KEY = "podcast_player_state";

const PodcastPlayerContext = createContext(null);

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
    const [isOpen, setIsOpen] = useState(false);
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
    const [podcastMeta, setPodcastMeta] = useState(null);
    const [episodeList, setEpisodeList] = useState([]);
    const [fetchPodcastId, setFetchPodcastId] = useState(null);
    const [isDetailPage, setIsDetailPage] = useState(false);
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);

    // Hydrate from storage once
    useEffect(() => {
        const stored = loadState();
        if (stored) {
            setIsOpen(stored.isOpen || false);
            setCurrentlyPlaying(stored.currentlyPlaying || null);
            setPodcastMeta(stored.podcastMeta || null);
            setEpisodeList(stored.episodeList || []);
        }
    }, []);

    // Persist on change
    useEffect(() => {
        saveState({ isOpen, currentlyPlaying, podcastMeta, episodeList });
    }, [isOpen, currentlyPlaying, podcastMeta, episodeList]);

    // If we need to fetch podcast detail (to get episodes), call the RTK Query hook
    const { data: fetchedPodcastResp } = useGetPodcastByIdQuery(
        { id: fetchPodcastId, withEpisodes: true },
        { skip: !fetchPodcastId }
    );

    // When fetched podcast data arrives, derive episode array and set into context
    React.useEffect(() => {
        if (!fetchedPodcastResp) return;
        const podcastData = fetchedPodcastResp.data || fetchedPodcastResp;
        const derived =
            podcastData?.episode_podcasts?.episodes || podcastData?.episodePodcasts || podcastData?.episodes || [];
        if (derived && derived.length) {
            setEpisodeList(derived);
        }
        // clear fetch id after populated
        setFetchPodcastId(null);
    }, [fetchedPodcastResp]);

    const playEpisode = (episode, podcast, episodes) => {
        // if caller provides episodes, use them; otherwise attempt to derive or fetch
        if (episodes && episodes.length) {
            setEpisodeList(episodes);
        } else if (podcast) {
            const derived =
                podcast?.episode_podcasts?.episodes || podcast?.episodePodcasts || podcast?.episodes;
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

        // attempt to auto-play after switching episode (skip if player disabled)
        if (!disablePlayer) {
            setTimeout(() => {
                try {
                    play();
                } catch (err) {
                    // swallow; play may fail if audio not ready yet
                }
            }, 200);
        }
    };

    const playNextEpisode = () => {
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

    const playPrevEpisode = () => {
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

    // When player is disabled (route like /login), ensure audio is paused and UI closed
    React.useEffect(() => {
        if (disablePlayer) {
            try {
                const audio = audioRef.current?.audio?.current;
                if (audio) audio.pause();
            } catch (err) {
                // ignore
            }
            setIsPlaying(false);
            setIsOpen(false);
        }
    }, [disablePlayer]);

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

    const value = useMemo(
        () => ({
            isOpen,
            setIsOpen,
            currentlyPlaying,
            setCurrentlyPlaying,
            podcastMeta,
            episodeList,
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
        }),
        [isOpen, currentlyPlaying, podcastMeta, episodeList, isDetailPage, isPlaying, volume]
    );

    return (
        <PodcastPlayerContext.Provider value={value}>
            {children}
            {/* Mount playback UI only when player is not disabled */}
            {!disablePlayer && (
                <>
                    <div className={`${!isDetailPage ? "hidden" : ""}`}>
                        <PodcastPlayback
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            currentlyPlaying={currentlyPlaying}
                            handlePlayPodcast={(episode) => playEpisode(episode, podcastMeta, episodeList)}
                            podcast={podcastMeta}
                            episodePodcasts={episodeList}
                        />
                    </div>

                    {/* Render mini player on non-detail pages */}
                    {!isDetailPage && (
                        <PodcastMiniPlayer
                            currentlyPlaying={currentlyPlaying}
                            podcastMeta={podcastMeta}
                            onClick={() => setIsOpen(true)}
                        />
                    )}
                </>
            )}
        </PodcastPlayerContext.Provider>
    );
}

PodcastPlayerProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export function usePodcastPlayer() {
    const ctx = useContext(PodcastPlayerContext);
    if (!ctx) throw new Error("usePodcastPlayer must be used within PodcastPlayerProvider");
    return ctx;
}
