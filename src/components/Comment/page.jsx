"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import PropTypes from "prop-types";

/*[--- UTILITY IMPORT ---]*/
import { formatDateTime } from "@/lib/timeFormatter";

/*[--- COMPONENT IMPORT ---]*/
import ReplyCommentForm from "@/components/ReplyCommentForm/ReplyCommentForm";
import CommentForm from "@/components/CommentForm/page";
import BottomSpacer from '@/components/BottomSpacer/page';

/*[--- ASSETS IMPORT ---]*/
import profilePictureDefault from "@@/icons/logo-users-comment.svg";
import iconMoreMenuComment from "@@/icons/icon-comment.svg";
import iconLikeComment from "@@/logo/logoDetailEbook/icon-like-comment.svg";
import iconDislikeComment from "@@/logo/logoDetailEbook/icon-dislike-comment.svg";
import { isMobile } from "react-device-detect";
import iconArrowBottom from "@@/icons/icons-arrow-bottom.svg";


// const dummyComments = [];

export default function CommentComponent({
  isExpand = false,
  isCommentVisible = false,
  handleViewComments = () => { },
  isPodcast = false,
  commentData = [],
  isLoadingGetComment,
  contentType,
  episodeId
}) {
  const [isCommentFieldHide, setIsCommentFieldHide] = useState(false);
  const [isReplyFieldHide, setIsReplyFieldHide] = useState(true);
  const [openReplies, setOpenReplies] = useState({});
  const [replyToCommentData, setReplyToCommentData] = useState(null);
  const replyInputRef = useRef(null);

  useEffect(() => {
    if (!isReplyFieldHide && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [isReplyFieldHide, replyToCommentData]);

  const handleToggleReplies = (commentId) => {
    setOpenReplies(prev => ({
      ...prev, // Salin semua state sebelumnya
      [commentId]: !prev[commentId] // Ubah state untuk commentId yang spesifik
    }));
  };

  const handleReplyToComment = (commentData) => {
    setReplyToCommentData(commentData);
    setIsReplyFieldHide(false);
    setIsCommentFieldHide(true);
  }

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
          <h3 className={`${isMobile ? "m-0 p-0" : isPodcast ? "ml-4" : "m-0"} zeinFont text-3xl font-extrabold`}>
            {isCommentFieldHide ? "Balas Komentar" : "Komentar"}
          </h3>
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
              contentType={contentType}
              episodeEbookId={contentType === "EBOOK" ? episodeId : null}
              episodeComicsId={contentType === "COMIC" ? episodeId : null}
              episode_podcastId={contentType === "PODCAST" ? episodeId : null}
              episodeSeriesId={contentType === "SERIES" ? episodeId : null}
              movieId={contentType === "MOVIE" ? episodeId : null}
            />
          }

          {!isReplyFieldHide && replyToCommentData && (
            <ReplyCommentForm
              ref={replyInputRef}
              commentId={replyToCommentData.id}
              imageUrl={replyToCommentData.user.imageUrl ? replyToCommentData.user.imageUrl : profilePictureDefault}
              profileName={replyToCommentData.user.profileName ? replyToCommentData.user.profileName : replyToCommentData.user.username}
              isAuthor={replyToCommentData.user?.creator}
            />
          )}
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
                      (contentType === "EBOOK" &&
                        comment.ebook_episode?.ebooks?.creators?.id === comment.user.creator.id) ||
                      (contentType === "PODCAST" &&
                        comment.Episode_podcast?.podcasts?.Creator?.id === comment.user.creator.id) ||
                      (contentType === "COMIC" &&
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
                          <button onClick={
                            () => handleReplyToComment(comment)
                          } className="text-sm font-medium text-[#1DBDF5] hover:cursor-pointer">
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

                        {/* Reply Comment */}
                        {openReplies[comment.id] && comment.ReplyComment.map((reply) => (
                          <div
                            className={`flex flex-col gap-4 rounded-lg bg-transparent py-4 ml-8`}
                            key={reply.id}
                          >
                            <div className="flex flex-row items-center justify-between">
                              <div className="flex flex-row items-center gap-2">
                                <figure>
                                  <Image
                                    priority
                                    className="h-10 w-10 rounded-full bg-blue-300 object-cover object-center"
                                    src={
                                      reply.user.imageUrl
                                        ? reply.user.imageUrl
                                        : profilePictureDefault
                                    }
                                    alt="logo-usercomment"
                                    width={40}
                                    height={40}
                                  />
                                </figure>

                                <div>
                                  <h5 className="text-xs font-medium">
                                    {reply.user.profileName
                                      ? reply.user.profileName
                                      : reply.user.username}{" "}
                                    {isAuthor && "(Author)"}
                                  </h5>
                                  <p className="text-[10px] font-normal text-white/50">
                                    {formatDateTime(reply.createdAt)}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <Image
                                  priority
                                  className="h-5"
                                  src={iconMoreMenuComment}
                                  alt="logo-more-menu-comment"
                                />
                              </div>
                            </div>
                            <p className="text-[#F5F5F5] text-xs">Reply <span className="text-[#1DBDF5]">
                              {comment.user.profileName
                                ? comment.user.profileName
                                : comment.user.username}
                            </span>
                            </p>

                            <div className="flex flex-col gap-2">
                              <div className="mb-2 flex">
                                <p className="text-base font-semibold text-[#979797]">
                                  {reply.message}
                                </p>
                              </div>

                              <div className="flex justify-start gap-4">
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
                        ))}

                        {/* [MODIFIKASI 3] Tombol untuk toggle reply. Hanya muncul jika ada balasan. */}
                        {comment.ReplyComment && comment.ReplyComment.length > 0 && (
                          <div
                            className="flex flex-row gap-1 items-center cursor-pointer mt-4 ml-1"
                            onClick={() => handleToggleReplies(comment.id)}
                          >
                            <Image
                              priority
                              className={`h-4 w-4 transition-transform duration-200 ${openReplies[comment.id] ? 'rotate-180' : ''}`}
                              src={iconArrowBottom}
                              alt="toggle-replies"
                            />
                            <p className="text-[#1DBDF5] text-xs font-semibold">
                              {openReplies[comment.id]
                                ? 'Sembunyikan balasan'
                                : `Lihat ${comment.ReplyComment.length} balasan`
                              }
                            </p>
                          </div>
                        )}
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
  contentType: PropTypes.string.isRequired,
  episodeId: PropTypes.string.isRequired,
};
