"use client";

import React, { useEffect } from "react";
import PropTypes from "prop-types";

import DefaultVideoPlayer from "@/components/VideoPlayer/DefaultVideoPlayer";
import { useGetEpisodeSeriesByIdQuery } from "@/hooks/api/contentSliceAPI";
import CommentComponent from "@/components/Comment/page";
import { useGetCommentByEpisodeSeriesQuery } from "@/hooks/api/commentSliceAPI";
import EpisodeController from "@/components/EpisodeController/EpisodeController";
import LoadingOverlay from "@/components/LoadingOverlay/page";

/* ===========================
   Halaman: DetailSeriesPage (JSX)
   =========================== */
export default function DetailSeriesPage({ params }) {
  const { id } = params;
  const { data, error, isLoading } = useGetEpisodeSeriesByIdQuery(id);

  const episodeData = data?.data?.data || {};
  const seriesData = data?.data?.data?.series || {};
  const { data: commentData, isLoading: isLoadingGetComment } =
    useGetCommentByEpisodeSeriesQuery(id, {
      skip: !id,
    });

  useEffect(() => {
    if (error && error.status === 403) {
      window.location.href = "/checkout/purchase/series/x/" + id;
    }
  }, [error, id]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!seriesData?.id) return;

    try {
      const raw = localStorage.getItem("last_seen_content");
      let existing = raw ? JSON.parse(raw) : [];

      const updatedContent = {
        ...seriesData,
        type: "series",
        progress: 0,
        progressSeconds: 0,
        updatedAt: new Date().toISOString(),
        episodeId: null,
        thumbnailImageUrl:
          seriesData.thumbnailImageUrl || seriesData.posterImageUrl || null,
      };

      const exists = existing.some((item) => item.id === seriesData.id);
      if (!exists) {
        existing = [updatedContent, ...existing].slice(0, 10);
        localStorage.setItem("last_seen_content", JSON.stringify(existing));
      }
    } catch (err) {
      console.error("Failed push series:", err);
    }
  }, [seriesData]);

  // simpan progress ke localstorage
  const handleProgressUpdate = (updatedContent) => {
    try {
      const raw = localStorage.getItem("last_seen_content");
      let existing = raw ? JSON.parse(raw) : [];

      // memastikan episode
      if (!updatedContent.episodeId) {
        console.warn("Not an episode, skipping progress save");
        return;
      }

      const key = `${updatedContent.id}-${updatedContent.episodeId}`;

      const contentToSave = {
        id: updatedContent.id,
        episodeId: updatedContent.episodeId,
        title: updatedContent.title,
        type: "series",
        isEpisode: true,
        progress: updatedContent.progress,
        progressSeconds: updatedContent.progressSeconds,
        updatedAt: new Date().toISOString(),
        thumbnailImageUrl: updatedContent.thumbnailImageUrl,
        posterImageUrl: updatedContent.posterImageUrl,
        coverUrl: updatedContent.coverUrl,
      };

      const index = existing.findIndex(
        (item) => `${item.id}-${item.episodeId || 0}` === key,
      );

      if (index >= 0) {
        existing[index] = contentToSave;
      } else {
        existing = [contentToSave, ...existing].slice(0, 10);
      }

      localStorage.setItem("last_seen_content", JSON.stringify(existing));
      console.log("✅ Progress saved for episode:", key);
    } catch (err) {
      console.error("Failed save series progress:", err);
    }
  };

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
              contentType={"SERIES"}
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
