"use client";
import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { usePodcastPlayer } from "@/context/PodcastPlayerContext";

export default function PodcastMiniPlayer({ currentlyPlaying, podcastMeta, onClick }) {
  const { isPlaying, togglePlay, playEpisode, episodeList, playNextEpisode, playPrevEpisode } = usePodcastPlayer();

  if (!currentlyPlaying) return null;

  const coverSrc =
    currentlyPlaying?.coverPodcastImage || podcastMeta?.coverPodcastImage || "/default-podcast-thumbnail.jpg";

  return (
    <div
      className="group fixed bottom-6 left-21 rounded-full bg-[#156eb78a] backdrop-blur-md w-28 hover:w-1/5 h-max px-7 z-40 transition-all duration-500 ease-in"
    >
      <div className="relative w-full">
        <div className="h-2 w-full bg-[#F5F5F54D] rounded-full top-0 overflow-hidden transition-all duration-300">
          <div
            className="h-full bg-[#1299dc] rounded-full transition-all duration-300"
            style={{ width: `${(currentlyPlaying.playbackProgress || 0) * 100}%` }}
          />
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-2 items-center justify-center">
            <button onClick={() => {
              if (!currentlyPlaying) {
                // fallback: play first episode if none playing
                if (episodeList && episodeList.length) {
                  playEpisode(episodeList[0], podcastMeta, episodeList);
                }
              } else {
                togglePlay();
              }
            }} className="relative mb-2 mt-1 group/podcast">
              <Image
                key={coverSrc}
                className="w-12 h-12 object-cover rounded-sm flex-shrink-0"
                src={coverSrc}
                alt="Podcast"
                width={48}
                height={48}
                unoptimized
              />
              <Icon
                icon={
                  isPlaying
                    ? "solar:pause-bold"
                    : "solar:play-bold"
                }
                className="
                    absolute inset-0
                    m-auto
                    w-6 h-6
                    text-white
                    hidden group-hover/podcast:block
                  "
              />
            </button>
            <div>
              <h1 className="zeinFont text-start font-bold text-white text-2xl group-hover:block hidden truncate whitespace-nowrap">
                {currentlyPlaying?.title}
              </h1>
              <p className="zeinFont text-start font-bold text-[#889fb1] text-sm group-hover:block hidden truncate whitespace-nowrap">
                {currentlyPlaying?.title}
              </p>
            </div>
          </div>

            <div className="flex-row gap-2 items-center group-hover:flex hidden">
            <button onClick={() => { if (playPrevEpisode) playPrevEpisode(); }}>
              <Icon
                icon={"solar:skip-previous-outline"}
                className="w-6 h-6 text-white hover:text-gray-300"
              />
            </button>
            <button onClick={() => { if (playNextEpisode) playNextEpisode(); }}>
              <Icon
                icon={"solar:skip-next-outline"}
                className="w-6 h-6 text-white hover:text-gray-300"
              />
            </button>
            <button onClick={onClick}>
              <Icon
                icon={"solar:maximize-square-2-broken"}
                className="w-8 h-8 text-white hover:text-gray-300"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

PodcastMiniPlayer.propTypes = {
  currentlyPlaying: PropTypes.object,
  podcastMeta: PropTypes.object,
  onClick: PropTypes.func,
};
