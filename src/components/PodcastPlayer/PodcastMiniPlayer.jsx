"use client";
import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { usePodcastPlayer } from "@/context/PodcastPlayerContext";
import usePodcastController from "@/hooks/usePodcastController";
import { useState } from "react";
import Link from "next/link";
import ExpandView from "./ExpandView";

export default function PodcastMiniPlayer({ currentlyPlaying, podcastMeta, coverImage, subtitle }) {
  const { isPlaying, togglePlay, playEpisode, episodeList, playNextEpisode, isExpand, handleExpand, stopPlayback } = usePodcastPlayer();
  const { currentTime, duration } = usePodcastController();
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const handleViewComments = () => setIsCommentVisible((s) => !s);

  if (!currentlyPlaying) return null;

  return (
    <>
      <div
        className="group fixed bottom-15 left-11 hover:w-10/11 md:bottom-21 md:left-21 rounded-full bg-[#156eb78a] border border-white/60 backdrop-blur-md w-27 md:hover:w-2/5 2xl:hover:w-1/5 h-max px-7 z-40 transition-all duration-300 ease-out"
      >
        <div className="relative w-full">
          <div className="h-2 w-full bg-[#F5F5F54D] rounded-full hidden md:block top-0 overflow-hidden transition-all duration-300">
            <div
              className="h-full bg-[#1299dc] hidden md:block rounded-full transition-all duration-300"
              style={{ width: `${(currentlyPlaying.playbackProgress || 0) * 100}%` }}
            />
          </div>
          <div className="flex group-hover:flex-row justify-between items-center">
            <div className="flex flex-row group-hover:gap-2 items-center justify-center">
              <button onClick={() => {
                if (!currentlyPlaying) {
                  // fallback: play first episode if none playing
                  if (episodeList && episodeList.length) {
                    playEpisode(episodeList[0], podcastMeta, episodeList);
                  }
                } else {
                  togglePlay();
                }
              }} className="relative w-[48px] h-[48px] mb-2 mt-2 md:mt-1 group/podcast flex-shrink-0">
                <Image
                  key={coverImage}
                  className="w-[48px] h-[48px] object-cover rounded-sm"
                  src={coverImage}
                  alt="Podcast"
                  width={48}
                  height={48}
                  unoptimized
                  style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}
                />
                <Icon
                  icon={
                    isPlaying
                      ? "solar:pause-bold"
                      : "solar:play-bold"
                  }
                  className={
                    "absolute inset-0 m-auto w-6 h-6 text-white pointer-events-none transition-opacity duration-150 opacity-0 group-hover/podcast:opacity-100"
                  }
                />
              </button>
              <div>
                <Link href={'/podcasts/detail/' + podcastMeta.id} className="zeinFont hover:underline text-start font-bold text-white text-2xl group-hover:block hidden truncate whitespace-nowrap">
                  {podcastMeta?.title || "Unknown Podcast"}
                </Link>
                <p className="zeinFont text-start font-bold text-[#889fb1] text-sm group-hover:block hidden truncate whitespace-nowrap">
                  {subtitle}
                </p>
              </div>
            </div>

            <div className="flex-row gap-2 items-center group-hover:flex hidden">
              <button onClick={() => { if (playNextEpisode) playNextEpisode(); }}>
                <Icon
                  icon={"solar:skip-next-outline"}
                  className="w-6 h-6 text-white hover:text-gray-300"
                />
              </button>
              {/* Close mini player and stop audio */}
              <button onClick={() => { handleExpand() }} href={'/podcasts/detail/' + podcastMeta.id}>
                <Icon
                  icon={"solar:maximize-square-2-broken"}
                  className="w-8 h-8 text-white hover:text-gray-300"
                />
              </button>
              <button
                onClick={() => {
                  stopPlayback();
                }}
                aria-label="Close mini player"
                title="Close"
              >
                <Icon
                  icon={"solar:close-circle-bold-duotone"}
                  className="w-7 h-7 text-white hover:text-gray-300"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      {isExpand && (
        <div className="fixed top-0 left-0 w-screen z-30 h-screen">
          <ExpandView
            episodeId={currentlyPlaying.id}
            coverEpisodeUrl={currentlyPlaying.coverPodcastEpisodeURL}
            title={currentlyPlaying.title}
            description={currentlyPlaying.description}
            duration={duration || 0}
            currentTime={currentTime || 0}
            isExpand={isExpand}
            isCommentVisible={isCommentVisible}
            handleViewComments={handleViewComments}
            handleExpand={handleExpand}
          />
        </div>
      )}
    </>

  );
}

PodcastMiniPlayer.propTypes = {
  currentlyPlaying: PropTypes.object,
  podcastMeta: PropTypes.object,
  onClick: PropTypes.func,
  coverImage: PropTypes.string,
  subtitle: PropTypes.string,
};
