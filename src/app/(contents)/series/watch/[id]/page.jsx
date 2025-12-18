/* eslint-disable react/react-in-jsx-scope */
"use client";

import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import DefaultVideoPlayer from "@/components/VideoPlayer/DefaultVideoPlayer";
import ProductEpisodeSection from "@/components/MainDetailProduct/ProductEpisodeSection";
import { useGetEpisodeSeriesByIdQuery } from "@/hooks/api/contentSliceAPI";
import CommentComponent from "@/components/Comment/page";
import { useGetCommentByEpisodeSeriesQuery } from "@/hooks/api/commentSliceAPI";

/* ===========================
   Halaman: DetailSeriesPage (JSX)
   =========================== */
export default function DetailSeriesPage({ params }) {
    const { id } = params;
    const { data, error } = useGetEpisodeSeriesByIdQuery(id);
    const [loading] = useState(false);

    const episodeData = data?.data?.data || {};
    const seriesData = data?.data?.data?.series || {};
    const episode_series = (seriesData.episodes || []).slice().sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
    });
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

            <main className="px-5 text-white">
                <ProductEpisodeSection
                    productType={'series'}
                    productEpisodes={episode_series}
                    isLoading={loading}
                    handlePayment={() => {
                        console.log('Payment initiated for series:');
                    }}
                />

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
