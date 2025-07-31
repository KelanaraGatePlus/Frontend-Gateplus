import React from 'react';
import PropTypes from 'prop-types';
import { useGetCommentByEpisodeComicQuery } from "@/hooks/api/commentSliceAPI"
import CommentComponent from "@/components/Comment/page";

export default function CommentModalComic({ episodeId, isCommentVisible, setIsCommentVisible }) {
    const { data: commentData, isLoading: isLoadingGetComment } = useGetCommentByEpisodeComicQuery(episodeId);
    return (
        <div className={`fixed h-screen w-screen overflow-hidden mt-12 bg-[#121212] transition-all duration-700 ease-in-out ${isCommentVisible ? "translate-y-0 opacity-100" : "translate-y-96 opacity-0"}`}>
            <div className="flex flex-col h-full w-full relative" onClick={() => setIsCommentVisible(false)}>
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
                    commentData={commentData?.data?.data || []}
                    isLoadingGetComment={isLoadingGetComment}
                    typeContent={"comic"}
                    episodeId={episodeId}
                />
            </div>
        </div>
    )
}

CommentModalComic.propTypes = {
    episodeId: PropTypes.string.isRequired,
    isCommentVisible: PropTypes.bool.isRequired,
    setIsCommentVisible: PropTypes.func.isRequired,
}
