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
                fixed w-screen bg-[#121212]
                transition-all duration-500 ease-in-out
                
                top-[100px] /* Mulai TEPAT DI BAWAH header 100px */
                h-[calc(100vh-100px)] /* Isi sisa layar */
                
                ${isCommentVisible
                    ? "translate-y-0 opacity-100 z-50 pointer-events-auto"
                    : "translate-y-full opacity-0 -z-10 pointer-events-none" /* Sembunyikan ke bawah */
                }
            `}
        >
            <div className="flex flex-col h-full w-full relative">
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