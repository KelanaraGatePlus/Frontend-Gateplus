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
  const { isPlaying, togglePlay, playEpisode, episodeList, playNextEpisode, isExpand, handleExpand, hasNextEpisodeAvailable, stopPlayback } = usePodcastPlayer();
  const { currentTime, duration } = usePodcastController();
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const handleViewComments = () => setIsCommentVisible((s) => !s);

  const truncateText = (text, maxLength = 20) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  if (!currentlyPlaying) return null;

  return (
    <>
      <div
        onClick={() => {
          setIsMobileExpanded((prev) => !prev);
        }}
        className={`fixed bottom-4 left-4 z-40 rounded-full border border-white/60 bg-[#156eb78a] backdrop-blur-md transition-all duration-300 ease-out lg:hidden ${isMobileExpanded ? "w-[92%] max-w-sm px-3 py-2" : "w-20 px-2 py-2"}`}
      >
        <div className="top-0 h-2 w-full overflow-hidden rounded-full bg-[#F5F5F54D] transition-all duration-300">
          <div
            className="h-full rounded-full bg-[#1299dc] transition-all duration-300"
            style={{ width: `${(currentlyPlaying.playbackProgress || 0) * 100}%` }}
          />
        </div>
        <div className={`mt-2 flex items-center ${isMobileExpanded ? "justify-between gap-2" : "justify-center"}`}>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              if (!currentlyPlaying) {
                if (episodeList && episodeList.length) {
                  playEpisode(episodeList[0], podcastMeta, episodeList);
                }
              } else {
                togglePlay();
              }
            }}
            className="relative h-9 w-9 shrink-0"
            aria-label={isPlaying ? "Pause podcast" : "Play podcast"}
          >
            <Image
              key={coverImage}
              className="h-9 w-9 rounded-sm object-cover"
              src={coverImage}
              alt="Podcast"
              width={36}
              height={36}
              unoptimized
              style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}
            />
            <Icon
              icon={isPlaying ? "solar:pause-bold" : "solar:play-bold"}
              className={`pointer-events-none absolute inset-0 m-auto h-5 w-5 text-white ${isMobileExpanded ? "opacity-100" : "opacity-0"}`}
            />
          </button>

          {isMobileExpanded && (
            <>
              <div className="min-w-0 flex-1">
                <p className="zeinFont truncate whitespace-nowrap text-sm font-bold text-white">
                  {truncateText(podcastMeta?.title || "Unknown Podcast")}
                </p>
                <p className="zeinFont truncate whitespace-nowrap text-xs font-bold text-[#889fb1]">
                  {truncateText(subtitle)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    if (playNextEpisode) playNextEpisode();
                  }}
                  aria-label="Play next episode"
                >
                  <Icon icon="solar:skip-next-outline" className="h-5 w-5 text-white hover:text-gray-300" />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleExpand();
                  }}
                  aria-label="Open podcast detail"
                >
                  <Icon
                    icon={"solar:maximize-square-2-broken"}
                    className="h-6 w-6 text-white hover:text-gray-300"
                  />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    stopPlayback();
                  }}
                  aria-label="Close mini player"
                  title="Close"
                >
                  <Icon
                    icon={"solar:close-circle-bold-duotone"}
                    className="h-6 w-6 text-white hover:text-gray-300"
                  />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div
        className="group fixed bottom-15 left-11 z-40 hidden h-max w-27 rounded-full border border-white/60 bg-[#156eb78a] px-7 backdrop-blur-md transition-all duration-300 ease-out hover:w-10/11 md:bottom-14 md:left-14 md:hover:w-2/5 2xl:hover:w-1/5 lg:block"
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
                  {truncateText(podcastMeta?.title || "Unknown Podcast")}
                </Link>
                <p className="zeinFont text-start font-bold text-[#889fb1] text-sm group-hover:block hidden truncate whitespace-nowrap">
                  {truncateText(subtitle)}
                </p>
              </div>
            </div>

            <div className="flex-row gap-2 items-center group-hover:flex hidden">
              {hasNextEpisodeAvailable() && <button onClick={() => { if (playNextEpisode) playNextEpisode(); }}>
                <Icon
                  icon={"solar:skip-next-outline"}
                  className="w-6 h-6 text-white hover:text-gray-300"
                />
              </button>}
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
