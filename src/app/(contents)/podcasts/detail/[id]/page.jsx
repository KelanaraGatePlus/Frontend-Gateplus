"use client";

import React, { useState, useEffect, use, useCallback } from "react";
import PropTypes from "prop-types";

/*[--- API HOOKS ---]*/
import useSyncUserData from "@/hooks/api/useSyncUserData";
import { useGetPodcastByIdQuery } from "@/hooks/api/podcastSliceAPI";
import { useGetCommentByPodcastQuery } from "@/hooks/api/commentSliceAPI";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";
import getMinAge from "@/lib/helper/minAge";

/* COMPONENT */
import MainTemplateLayout from "@/components/MainDetailProduct/page";
import CommentComponent from "@/components/Comment/page";
import CompleteProfileModal from "@/components/Modal/CompleteProfileModal";
import UnderAgeModal from "@/components/Modal/UnderAgeModal";
import LoadingOverlay from "@/components/LoadingOverlay/page";

import { usePodcastPlayer } from "@/context/PodcastPlayerContext";

export default function DetailPodcastPage({ params }) {
  const { id } = use(params);

  const [loading, setLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false); // 🔥 hydration guard
  const [createLog] = useCreateLogMutation();

  const { playEpisode, currentlyPlaying, setIsDetailPage } = usePodcastPlayer();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsHydrated(true);
    }
  }, []);

  const skip = !id || !isHydrated;

  const { data, isLoading } = useGetPodcastByIdQuery({ id }, { skip });

  const { data: commentData, isLoading: isLoadingGetComment } =
    useGetCommentByPodcastQuery(id, { skip });

  const podcastData = data?.data || {};

  const {
    showCompleteProfileModal,
    showUnderAgeModal,
    goToProfile,
    continueDespiteUnderAge,
    userAge,
    isReady,
  } = useSyncUserData(podcastData?.ageRestriction || null);

  const isBlurred = useCallback(
    (content) => {
      if (!isReady) return true;

      const minAge = getMinAge(content?.ageRestriction);

      if (minAge === null) return false;
      if (userAge == null) return true;

      return userAge < minAge;
    },
    [userAge, isReady],
  );

  const episode_podcasts = (podcastData?.episode_podcasts?.episodes || [])
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  useEffect(() => {
    setIsDetailPage(true);
    return () => setIsDetailPage(false);
  }, [setIsDetailPage]);

  const handlePlayPodcast = (episodeData) => {
    playEpisode(episodeData, podcastData, episode_podcasts);
  };

  useEffect(() => {
    if (id && isHydrated) {
      createLog({
        contentType: "PODCAST",
        logType: "CLICK",
        contentId: id,
      });
    }
  }, [id, isHydrated, createLog]);

  if (!isHydrated || isLoading || !data || !isReady) {
    return <LoadingOverlay />;
  }

  return (
    <div>
      <MainTemplateLayout
        productType="podcast"
        productDetail={podcastData}
        productEpisode={episode_podcasts}
        isLoading={isLoading}
        currentlyPlaying={currentlyPlaying}
        handlePlayPodcast={handlePlayPodcast}
        handlePayment={() => {}}
        handleSubscribe={() => {}}
        topContentData={data?.topContent || []}
        recomendationData={data?.recommendation || []}
        isBlurred={isBlurred}
      />

      <div className="md:px-11">
        <CommentComponent
          contentType="PODCAST"
          contentId={podcastData.id}
          isLoading={isLoading}
          commentData={commentData?.data?.data || []}
          episodeId={podcastData.id}
          isLoadingGetComment={isLoadingGetComment}
        />
      </div>

      {podcastData?.id && (
        <>
          {showCompleteProfileModal && (
            <CompleteProfileModal
              onConfirm={goToProfile}
              title={podcastData?.title}
              minAge={getMinAge(podcastData?.ageRestriction)}
            />
          )}

          {showUnderAgeModal && (
            <UnderAgeModal
              open={showUnderAgeModal}
              ageRestriction={podcastData?.ageRestriction}
              title={podcastData?.title}
              onContinue={continueDespiteUnderAge}
            />
          )}
        </>
      )}

      {loading && <LoadingOverlay />}
    </div>
  );
}

DetailPodcastPage.propTypes = {
  params: PropTypes.object.isRequired,
};
