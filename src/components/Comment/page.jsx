"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import PropTypes from "prop-types";

/*[--- COMPONENT IMPORT ---]*/
import ReplyCommentForm from "@/components/ReplyCommentForm/ReplyCommentForm";
import CommentForm from "@/components/CommentForm/page";
import BottomSpacer from '@/components/BottomSpacer/page';

/*[--- ASSETS IMPORT ---]*/
import profilePictureDefault from "@@/icons/logo-users-comment.svg";
import { isMobile } from "react-device-detect";
import iconArrowBottom from "@@/icons/icons-arrow-bottom.svg";
import { CommentItem } from "./CommentItem";

export default function CommentComponent({
    isExpand = false,
    isCommentVisible = false,
    handleViewComments = () => { },
    isPodcast = false,
    commentData = [],
    isLoadingGetComment,
    contentType,
    episodeId,
    isDark = true,
    withReward = true,
}) {
    // ⬇️ DECODE TOKEN DARI LOCALSTORAGE
    const getCurrentUserId = () => {
        if (typeof window === 'undefined') return null;

        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );

            const decoded = JSON.parse(jsonPayload);
            return decoded.id || decoded.userId || decoded.sub || null;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    const currentUserId = getCurrentUserId();

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
            ...prev,
            [commentId]: !prev[commentId]
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
            className={`flex pb-10 flex-col montserratFont text-white transition-all duration-200 ease-in-out ${isCommentVisible ? "my-4 w-1/2 pr-5" : isMobile ? "w-full p-0" : "w-full px-5 py-6"} ${isExpand ? "h-screen" : "h-full"}`}
        >
            <div
                className={`${isMobile ? "" : "sticky top-0"} ${isPodcast ? "bg-[#171717]" : "bg-transparent"} flex w-full flex-col`}
            >
                <div className={`relative flex w-full justify-start py-2 ${isMobile ? "px-0" : isPodcast ? "" : "p-0"}`}>
                    <h3 className={`${isMobile ? "m-0 p-0" : isPodcast ? "ml-4" : "m-0"} zeinFont text-xl md:text-2xl lg:text-3xl font-extrabold ${isDark ? "text-white" : "text-[#1A1A1A]"}`}>
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
                    <CommentForm
                        contentType={contentType}
                        episodeEbookId={contentType === "EBOOK" ? episodeId : null}
                        episodeComicsId={contentType === "COMIC" ? episodeId : null}
                        podcastId={contentType === "PODCAST" ? episodeId : null}
                        episodeSeriesId={contentType === "SERIES" ? episodeId : null}
                        movieId={contentType === "MOVIE" ? episodeId : null}
                        episodePodcastId={contentType === "EPISODE_PODCAST" ? episodeId : null}
                        educationId={contentType === "EDUCATION" ? episodeId : null}
                        withReward={withReward}
                    />
                </div>
            </div>

            <div className={`mb-10 flex flex-col gap-2  ${isMobile ? "" : "custom-scrollbar overflow-x-hidden"}`}>
                {isLoadingGetComment ? (
                    <p className="text-center text-gray-400 italic">Sedang memuat data...</p>
                ) : (
                    commentData.length > 0 ? (
                        <>
                            {[...commentData]
                                .map((comment) => {
                                    const isAuthor =
                                        comment.user?.creator &&
                                        (
                                            (contentType === "EBOOK" &&
                                                comment.ebook_episode?.ebooks?.creators?.id === comment.user.creator.id) ||
                                            (contentType === "PODCAST" &&
                                                comment.Episode_podcast?.podcasts?.Creator?.id === comment.user.creator.id) ||
                                            (contentType === "COMIC" &&
                                                comment.comics_episode?.comics?.creators?.id === comment.user.creator.id) ||
                                            (contentType === "EDUCATION" &&
                                                comment.Education?.creator?.id === comment.user.creator.id)
                                        );

                                    return (
                                        <div key={comment.id} className="flex flex-col rounded-lg bg-[#393939]">
                                            <CommentItem
                                                commentId={comment.id}
                                                user={comment.user}
                                                isAuthor={isAuthor}
                                                createdAt={comment.createdAt}
                                                donationAmount={comment?.tip?.amount}
                                                isDark={isDark}
                                                message={comment.message}
                                                onReply={() => handleReplyToComment(comment)}
                                                currentUserId={currentUserId}
                                            />

                                            {!isReplyFieldHide && replyToCommentData?.id === comment.id && (
                                                <div className="mt-2 px-4">
                                                    <ReplyCommentForm
                                                        isDark={isDark}
                                                        ref={replyInputRef}
                                                        commentId={comment.id}
                                                        onCloseModal={() => {
                                                            setIsReplyFieldHide(true)
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            {/* Reply Comment */}
                                            <div className="flex flex-col gap-2 px-4">
                                                {openReplies[comment.id] && comment.ReplyComment.map((reply) => (
                                                    <div className="bg-[#515151] border border-[#F5F5F51A] rounded-md">
                                                        <CommentItem
                                                            key={reply.id}
                                                            commentId={reply.id}
                                                            user={reply.user}
                                                            isAuthor={isAuthor}
                                                            createdAt={reply.createdAt}
                                                            isDark={isDark}
                                                            message={reply.message}
                                                            repliedToName={comment.user.profileName
                                                                ? comment.user.profileName
                                                                : comment.user.username}
                                                            isIndented
                                                            currentUserId={currentUserId}
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Tombol untuk toggle reply. Hanya muncul jika ada balasan. */}
                                            {comment.ReplyComment && comment.ReplyComment.length > 0 && (
                                                <div
                                                    className="flex flex-row gap-1 px-4 items-center cursor-pointer mb-4"
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
    isDark: PropTypes.bool,
    withReward: PropTypes.bool,
};