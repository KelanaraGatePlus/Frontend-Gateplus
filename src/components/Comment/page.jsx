"use client";
import React, { useState } from "react";
import Image from "next/image";
import PropTypes from "prop-types";

/*[--- UTILITY IMPORT ---]*/
import { formatDateTime } from "@/lib/timeFormatter";

/*[--- COMPONENT IMPORT ---]*/
import CommentForm from "@/components/CommentForm/page";
import BottomSpacer from '@/components/BottomSpacer/page';

/*[--- ASSETS IMPORT ---]*/
import profilePictureDefault from "@@/icons/logo-users-comment.svg";
import iconMoreMenuComment from "@@/icons/icon-comment.svg";
import iconLikeComment from "@@/logo/logoDetailEbook/icon-like-comment.svg";
import iconDislikeComment from "@@/logo/logoDetailEbook/icon-dislike-comment.svg";
import { isMobile } from "react-device-detect";

// const dummyComments = [];

export default function CommentComponent({
  isExpand = false,
  isCommentVisible = false,
  handleViewComments = () => { },
  isPodcast = false,
  commentData = [],
  isLoadingGetComment,
  typeContent = "ebook",
  episodeId
}) {
  const [isCommentFieldHide, setIsCommentFieldHide] = useState(false);

  const handleToggleCommentField = () => {
    setIsCommentFieldHide(!isCommentFieldHide);
  };

  return (
    <section
      className={`flex pb-10 flex-col text-white transition-all duration-200 ease-in-out ${isCommentVisible ? "my-4 w-1/2 pr-5" : isMobile ? "w-full p-0" : "w-full px-5 py-6"} ${isExpand ? "h-screen" : "h-full"}`}
    >
      <div
        className={`${isMobile ? "" : "sticky top-0 px-4"} ${isPodcast ? "bg-[#171717]" : "bg-transparent"} z-10 flex w-full flex-col`}
      >
        <div className={`relative flex w-full justify-start py-2 ${isMobile ? "px-0" : isPodcast ? "px-4" : "p-0"}`}>
          <h3 className={`${isMobile ? "m-0 p-0" : isPodcast ? "ml-4" : "m-0"} zeinFont text-3xl font-extrabold`}>Komentar</h3>
          {isPodcast && (
            <>
              <button
                className={`${isMobile ? "hidden" : "absolute top-1/2 left-0 -mt-2 flex -translate-y-1/2 cursor-pointer text-4xl"}`}
                onClick={handleViewComments}
              >
                &times;
              </button>
              <button
                className={`${isMobile ? "hidden" : "montserratFont absolute top-1/2 right-0 -mt-2 flex cursor-pointer text-xs text-white/50"}`}
                onClick={handleToggleCommentField}
              >
                {isCommentFieldHide ? "Tampilkan Field" : "Sembunyikan Field"}
              </button>
            </>
          )}
        </div>

        <div className="flex">
          {!isCommentFieldHide &&
            <CommentForm
              episodeEbookId={typeContent === "ebook" ? episodeId : null}
              episodeComicsId={typeContent === "comic" ? episodeId : null}
              episode_podcastId={typeContent === "podcast" ? episodeId : null}
            />
          }
        </div>
      </div>

      <div className={`mb-10 flex flex-col gap-4  ${isMobile ? "" : "custom-scrollbar overflow-x-hidden"}`}>
        {isLoadingGetComment ? (
          <p className="text-center text-gray-400 italic">Sedang memuat data...</p>
        ) : (
          commentData.length > 0 ? (
            <>
              {[...commentData]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((comment) => {
                  const isAuthor =
                    comment.user?.creator &&
                    (
                      (typeContent === "ebook" &&
                        comment.ebook_episode?.ebooks?.creators?.id === comment.user.creator.id) ||
                      (typeContent === "podcast" &&
                        comment.Episode_podcast?.podcasts?.Creator?.id === comment.user.creator.id) ||
                      (typeContent === "comic" &&
                        comment.comics_episode?.comics?.creators?.id === comment.user.creator.id)
                    );

                  return (
                    <div
                      className={`flex flex-col gap-4 rounded-lg bg-transparent py-4`}
                      key={comment.id}
                    >
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center gap-2 px-4">
                          <figure>
                            <Image
                              priority
                              className="h-10 w-10 rounded-full bg-blue-300 object-cover object-center"
                              src={
                                comment.user.imageUrl
                                  ? comment.user.imageUrl
                                  : profilePictureDefault
                              }
                              alt="logo-usercomment"
                              width={40}
                              height={40}
                            />
                          </figure>

                          <div>
                            <h5 className="text-xs font-medium">
                              {comment.user.profileName
                                ? comment.user.profileName
                                : comment.user.username}{" "}
                              {isAuthor && "(Author)"}
                            </h5>
                            <p className="text-[10px] font-normal text-white/50">
                              {formatDateTime(comment.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="px-4">
                          <Image
                            priority
                            className="h-5"
                            src={iconMoreMenuComment}
                            alt="logo-more-menu-comment"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 px-4">
                        <div className="mb-2 flex">
                          <p className="text-base font-semibold text-[#979797]">
                            {comment.message}
                          </p>
                        </div>

                        <div className="flex justify-start gap-4">
                          <button className="text-sm font-medium text-[#1DBDF5]">
                            Balas
                          </button>

                          <div className="flex gap-4">
                            <div className="flex items-center gap-1">
                              <Image
                                priority
                                className="h-5 w-5 focus-within:bg-purple-300"
                                width={35}
                                alt="logo-like"
                                src={iconLikeComment}
                              />
                              <p className="text-[#1DBDF5]">Ya</p>
                            </div>

                            <div className="flex items-center gap-1">
                              <Image
                                priority
                                className="h-5 w-5 focus-within:bg-purple-300"
                                width={35}
                                alt="logo-like"
                                src={iconDislikeComment}
                              />
                              <p className="text-[#1DBDF5]">Tidak</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

              <p className="text-center text-gray-400 italic">Tidak ada komentar lain</p>
              <BottomSpacer />
              <BottomSpacer />
              <BottomSpacer />
              <BottomSpacer />
            </>
          ) : (
            <p className="text-center text-gray-400 italic">Belum ada Komentar</p>
          )
        )}
      </div>


    </section>
  );
}

CommentComponent.propTypes = {
  isExpand: PropTypes.bool,
  isCommentVisible: PropTypes.bool,
  handleViewComments: PropTypes.func,
  isPodcast: PropTypes.bool,
  commentData: PropTypes.array.isRequired,
  isLoadingGetComment: PropTypes.bool,
  typeContent: PropTypes.string.isRequired,
  episodeId: PropTypes.string.isRequired,
};
