/* eslint-disable react/react-in-jsx-scope */
"use client";

import PropTypes from "prop-types";
import { useEffect } from "react";

import DefaultVideoPlayer from "@/components/VideoPlayer/DefaultVideoPlayer";
import { useGetEpisodeSeriesByIdQuery } from "@/hooks/api/contentSliceAPI";
import CommentComponent from "@/components/Comment/page";
import { useGetCommentByEpisodeSeriesQuery } from "@/hooks/api/commentSliceAPI";
import EpisodeController from "@/components/EpisodeController/EpisodeController";

/* ===========================
   Halaman: DetailSeriesPage (JSX)
   =========================== */
export default function DetailSeriesPage({ params }) {
    const { id } = params;
    const { data, error } = useGetEpisodeSeriesByIdQuery(id);

    const episodeData = data?.data?.data || {};
    const seriesData = data?.data?.data?.series || {};
    const { data: commentData, isLoading: isLoadingGetComment } = useGetCommentByEpisodeSeriesQuery(id, {
        skip: !id,
    });

    useEffect(() => {
        if (error && error.status === 403) {
            window.location.href = "/";
        }
    }, [error]);

    return (
        <div>
            <section className="flex justify-center rounded-md relative">
                {/* Player bergaya YouTube */}
                <div className="mx-auto my-auto flex w-screen justify-center rounded-lg object-cover">
                    {episodeData && <DefaultVideoPlayer
                        className="rounded-lg"
                        src={episodeData?.episodeFileUrl}
                        poster={episodeData?.thumbnailUrl}
                        startFrom={episodeData?.WatchProgress?.[0]?.progressSeconds || 0}
                        contentType={"SERIES"}
                        contentId={episodeData?.id}
                        logType={"WATCH_CONTENT"}
                        title={seriesData?.title}
                        genre={episodeData?.title}
                        ageRestriction={seriesData?.ageRestriction}
                    />}
                </div>
            </section>

            <main className="md:px-5 text-white mt-8 md:mt-16">
                <div className="px-5 md:px-16">
                    <EpisodeController
                        nextEpisodeUrl={data?.data?.nextEpisode ? `/series/watch/${data.data.nextEpisode.id}` : null}
                        prevEpisodeUrl={data?.data?.previousEpisode ? `/series/watch/${data.data.previousEpisode.id}` : null}
                    />
                </div>

                {/* Comment Baru */}
                <div className="md:px-11">
                    <CommentComponent
                        commentData={commentData?.data?.data || []}
                        isLoadingGetComment={isLoadingGetComment}
                        contentType={"SERIES"}
                        episodeId={id}
                    />
                </div>
            </main>
        </div>
    );
}

DetailSeriesPage.propTypes = {
    params: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired,
};
