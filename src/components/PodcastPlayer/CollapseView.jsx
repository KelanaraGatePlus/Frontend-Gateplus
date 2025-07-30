"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import PropTypes from "prop-types";

import { formatDateTime } from "@/lib/timeFormatter";

/*[--- COMPONENT IMPORT ---]*/
import CommentComponent from "@/components/Comment/page";
import BottomSpacer from '@/components/BottomSpacer/page';

/*[--- ASSETS IMPORT ---]*/
import iconUnlocked from "@@/icons/icons-unlocked.svg";
import iconLocked from "@@/icons/icons-locked.svg";
import iconSaveOutline from "@@/logo/logoDetailFilm/save-icons.svg";
import iconMore from "@@/icons/icons-more.svg";

export default function CollapseView({
  coverEpisodeUrl,
  podcastTitle,
  title,
  description,
  createdAt,
  collaborators,
  episodePodcasts,
  isExpand,
  isCommentVisible,
  isMobile,
  handleViewComments,
  currentlyPlaying,
  handlePlayPodcast,
}) {
  const isLocked = useState(false);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div className={`flex w-full h-screen text-white ${isMobile ? "flex-col" : "flex-row"}`}>
      <div
        className={`custom-scrollbar h-screen overflow-y-auto scroll-container relative pt-2 mt-2 flex flex-col transition-all duration-200 ease-in-out gap-8 ${isCommentVisible ? "w-1/2 overflow-x-hidden lg:pr-5 lg:pl-10" : "w-full overflow-x-hidden px-4 sm:px-6 lg:px-12"}`}
      >
        <section
          className={`flex w-full flex-col gap-4 transition-all duration-200 ease-in-out ${!isCommentVisible ? "lg:flex-row" : "gap-4 lg:flex-col"}`}
        >
          <div
            className={`flex ${!isCommentVisible ? "gap-4 lg:w-1/3" : "w-full gap-2"}`}
          >
            <div className="relative h-32 w-32 md:h-52 md:w-52">
              {coverEpisodeUrl && (
                <Image
                  src={coverEpisodeUrl}
                  alt="cover-podcast"
                  className="rounded-lg object-cover object-center"
                  fill
                  priority
                />
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex h-fit flex-col">
                <h1 className="zeinFont text-2xl font-bold">{title}</h1>
                <h4 className="montserratFont text-sm font-medium text-white/50">
                  {podcastTitle}
                </h4>
              </div>

              <div className="montserratFont flex text-xs font-light text-white/50">
                {createdAt}
              </div>
            </div>
          </div>

          <div
            className={`flex flex-1 flex-col gap-4 ${!isCommentVisible && "lg:custom-scrollbar lg:max-h-52 lg:overflow-y-scroll lg:rounded-lg lg:bg-white/20 lg:px-4 lg:py-2"}`}
          >
            <div>
              <strong className="zeinFont text-2xl font-bold">
                Deskripsi Konten
              </strong>
              <p className="montserratFont text-sm font-medium text-white/50">
                {description}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="zeinFont w-full text-left text-2xl font-bold text-white/70">
                Kreator
              </h2>

              <div className="custom-scroll flex w-full justify-start gap-3 overflow-x-scroll lg:flex-wrap lg:gap-6">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex min-w-20 flex-col items-center justify-center lg:w-fit"
                  >
                    <figure className="relative mb-3 h-16 w-16 rounded-full">
                      <Image
                        src={
                          collaborator.ImageUrl ||
                          "https://picsum.photos/seed/eps6/800/450"
                        }
                        alt="collaborator-profile"
                        className="h-full w-full rounded-full object-cover object-center"
                        fill
                        priority
                      />
                    </figure>
                    <h4 className="zeinFont line-clamp-1 text-xl leading-3 font-bold">
                      {collaborator.profileName}
                    </h4>
                    <p className="montserratFont text-[10px] leading-5 font-thin">
                      {collaborator.username}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex w-full flex-col gap-2 ">
          <h2 className="zeinFont text-2xl font-bold">Episode Selanjutnya</h2>
          <div className="flex flex-col gap-4">
            {episodePodcasts.map((episode, index) => (
              <div key={index} className={`flex gap-4 w-full justify-between rounded-lg hover:bg-blue-600/30 hover:p-3 transition-all duration-300 ease-in-out cursor-pointer ${currentlyPlaying?.id === episode.id ? "p-0" : "p-0"}`} onClick={() => handlePlayPodcast(episode)}>
                <div className="flex gap-2 max-w-4xl">
                  <div className="relative h-28 w-28">
                    <Image
                      src={
                        episode.coverPodcastEpisodeURL ||
                        "https://picsum.photos/seed/eps6/800/450"
                      }
                      alt="cover-podcast"
                      className="rounded-lg object-cover object-center"
                      fill
                      priority
                    />
                  </div>
                  <div className="flex h-full w-full max-w-full flex-1 flex-col justify-between overflow-hidden">
                    <div className="flex w-full flex-col">
                      <h4 className="zeinFont text-2xl font-bold">
                        {episode.title}
                      </h4>
                      <p className="montserratFont line-clamp-3 text-justify text-sm font-medium text-white/50">
                        {episode.description}
                      </p>
                    </div>
                    <p className="montserratFont flex text-xs font-light text-white/50">
                      {formatDateTime(episode.createdAt, "short")}
                    </p>
                  </div>
                </div>
                <div className="w-1.8/5 flex items-center justify-end gap-2 sm:w-1/5">
                  <div className="rounded border-2 border-[#F5F5F524] bg-[#F5F5F524] p-1">
                    <Image
                      priority
                      src={isLocked ? iconLocked : iconUnlocked}
                      alt="icon-locked"
                      className="h-full w-full rounded object-cover object-center"
                      width={16}
                      height={16}
                    />
                  </div>
                  <div className="relative h-6 w-6 cursor-pointer transition-transform duration-150 active:scale-90">
                    <Image
                      priority
                      src={iconSaveOutline}
                      alt="icon-save-outline"
                      className="rounded object-cover object-center"
                      fill
                    />
                  </div>
                  <button className={`relative z-20 h-6 w-6 cursor-pointer transition-transform duration-150 active:scale-90 ${isMobile ? "rotate-90" : "rotate-0"}`}>
                    <Image
                      priority
                      src={iconMore}
                      alt="icon-more"
                      className="rounded object-cover object-center"
                      fill
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <BottomSpacer height="h-56" isMobileHidden={isMobile} />
        </section>

        {(isMobile) && (
          <CommentComponent
            isExpand={isExpand}
            isCommentVisible={isCommentVisible}
            handleViewComments={handleViewComments}
          />
        )}
      </div>

      {(!isMobile && isCommentVisible) && (
        <CommentComponent
          isExpand={isExpand}
          isCommentVisible={isCommentVisible}
          handleViewComments={handleViewComments}
        />
      )}
    </div>
  );
}

CollapseView.propTypes = {
  coverEpisodeUrl: PropTypes.string.isRequired,
  podcastTitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  collaborators: PropTypes.array.isRequired,
  episodePodcasts: PropTypes.array.isRequired,
  isExpand: PropTypes.bool.isRequired,
  isCommentVisible: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  handleViewComments: PropTypes.func.isRequired,
  currentlyPlaying: PropTypes.object.isRequired,
  handlePlayPodcast: PropTypes.func.isRequired,
};
