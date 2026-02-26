"use client";

import React, { useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";

import DefaultVideoPlayer from "@/components/VideoPlayer/DefaultVideoPlayer";
import { useGetEpisodeSeriesByIdQuery } from "@/hooks/api/contentSliceAPI";
import CommentComponent from "@/components/Comment/page";
import { useGetCommentByEpisodeSeriesQuery } from "@/hooks/api/commentSliceAPI";
import EpisodeController from "@/components/EpisodeController/EpisodeController";
import LoadingOverlay from "@/components/LoadingOverlay/page";

import { useAddLastSeenMutation } from "@/hooks/api/lastSeenSliceAPI";

/* ===========================
   Halaman: DetailSeriesPage (JSX)
   =========================== */
export default function DetailSeriesPage({ params }) {
  const { id } = params;
  const { data, error, isLoading, refetch } = useGetEpisodeSeriesByIdQuery(id);

  const episodeData = data?.data?.data || {};
  const seriesData = data?.data?.data?.series || {};
  const { data: commentData, isLoading: isLoadingGetComment } =
    useGetCommentByEpisodeSeriesQuery(id, { skip: !id });

  const [addLastSeen] = useAddLastSeenMutation();

  useEffect(() => {
    if (error && error.status === 403) {
      window.location.href = "/checkout/purchase/series/x/" + id;
    }
  }, [error, id]);

  // simpan detik
  const progressRef = useRef(0);

  // Push episode ke DB saat pause
  const handleProgressUpdate = useCallback(
    async (seconds) => {
      if (seconds == null) return;
      progressRef.current = seconds;

      // save progress ketika pause
      if (episodeData?.id) {
        try {
          await addLastSeen({
            contentType: "EPISODE_SERIES",
            contentId: episodeData.id,
            progressSeconds: seconds,
          }).unwrap();

          console.log("episode progress saved on pause", seconds);

          refetch();
        } catch (err) {
          console.error("save episode progress gagal", err);
        }
      }
    },
    [episodeData.id, addLastSeen, refetch],
  );

  // ===== Render Loading jika masih load =====
  if (isLoading) return <LoadingOverlay />;

  return (
    <div>
      <section className="relative flex justify-center rounded-md">
        {/* Player bergaya YouTube */}
        <div className="mx-auto my-auto flex w-screen justify-center rounded-lg object-cover">
          {episodeData && (
            <DefaultVideoPlayer
              className="rounded-lg"
              playbackId={episodeData?.muxPlaybackId}
              src={episodeData?.episodeFileUrl}
              poster={episodeData?.thumbnailUrl}
              startFrom={episodeData?.WatchProgress?.[0]?.progressSeconds || 0}
              contentType={"EPISODE_SERIES"}
              contentId={episodeData?.id}
              logType={"WATCH_CONTENT"}
              title={seriesData?.title}
              genre={episodeData?.title}
              ageRestriction={seriesData?.ageRestriction}
              seriesData={{ ...seriesData, episodeId: episodeData?.id }}
              onProgressUpdate={handleProgressUpdate}
            />
          )}
        </div>
      </section>

      <main className="mt-8 text-white md:mt-16 md:px-5">
        <div className="px-5 md:px-16">
          <EpisodeController
            nextEpisodeUrl={
              data?.data?.nextEpisode
                ? `/series/watch/${data.data.nextEpisode.id}`
                : null
            }
            prevEpisodeUrl={
              data?.data?.previousEpisode
                ? `/series/watch/${data.data.previousEpisode.id}`
                : null
            }
          />
        </div>

        {/* Comment Baru */}
        <div className="md:px-11">
          <CommentComponent
            commentData={commentData?.data?.data || []}
            isLoadingGetComment={isLoadingGetComment}
            contentType={"EPISODE_SERIES"}
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
