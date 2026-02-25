import React from 'react';
import PropTypes from 'prop-types';
import CommentComponent from "@/components/Comment/page";

export default function CommentModalEbook({
    episodeId,
    isCommentVisible,
    setIsCommentVisible,
    commentData,
    isLoadingGetComment
}) {
    return (
        <div
            className={`
                fixed inset-x-0 bottom-0 bg-[#121212]
                transition-all duration-500 ease-in-out
                overflow-hidden
                top-16
                
                ${isCommentVisible
                    ? "translate-y-0 opacity-100 z-70 pointer-events-auto"
                    : "translate-y-full opacity-0 -z-10 pointer-events-none" /* Sembunyikan ke bawah */
                }
            `}
        >
            <div className="relative flex h-full w-full flex-col overflow-y-auto overscroll-contain touch-pan-y">
                <button
                    className='text-white/60 z-20 cursor-pointer montserratFont text-xs absolute top-7 right-0 mx-8 px-2 flex items-center justify-center gap-1 bg-white/20 hover:bg-white/40 rounded-2xl'
                    onClick={() => setIsCommentVisible(false)}
                >
                    <span className='text-2xl font-light'>
                        &times;
                    </span>
                    <span>
                        Tutup komentar
                    </span>
                </button>

                <CommentComponent
                    commentData={commentData}
                    isLoadingGetComment={isLoadingGetComment}
                    contentType={"EBOOK"}
                    episodeId={episodeId}
                />
            </div>
        </div>
    )
}

CommentModalEbook.propTypes = {
    episodeId: PropTypes.string.isRequired,
    isCommentVisible: PropTypes.bool.isRequired,
    setIsCommentVisible: PropTypes.func.isRequired,
    commentData: PropTypes.array,
    isLoadingGetComment: PropTypes.bool,
}