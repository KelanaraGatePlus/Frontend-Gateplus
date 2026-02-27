"use client";

import React, { useState, useEffect, use, useCallback } from "react";
import PropTypes from "prop-types";

/*[--- API HOOKS ---]*/
import useSyncUserData from "@/hooks/api/useSyncUserData";
import { useGetPodcastByIdQuery } from "@/hooks/api/podcastSliceAPI";
import { useGetCommentByPodcastQuery } from "@/hooks/api/commentSliceAPI";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";
import getMinAge from "@/lib/helper/minAge";
import { useAddLastSeenMutation } from "@/hooks/api/lastSeenSliceAPI";

/* COMPONENT */
import MainTemplateLayout from "@/components/MainDetailProduct/page";
import CommentComponent from "@/components/Comment/page";
import CompleteProfileModal from "@/components/Modal/CompleteProfileModal";
import UnderAgeModal from "@/components/Modal/UnderAgeModal";
import LoadingOverlay from "@/components/LoadingOverlay/page";

import { usePodcastPlayer } from "@/context/PodcastPlayerContext";
import usePodcastController from "@/hooks/usePodcastController";

export default function DetailPodcastPage({ params }) {
  const { id } = use(params);

  const [isHydrated, setIsHydrated] = useState(false); // 🔥 hydration guard
  const [createLog] = useCreateLogMutation();
  const [createLastSeen] = useAddLastSeenMutation();

  const { currentTime, duration } = usePodcastController();
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

  // muncul di last seen
  const pushPodcastToLastSeen = useCallback(() => {
    if (!podcastData?.id) return;

    try {
      const raw = localStorage.getItem("last_seen_content");
      let existing = raw ? JSON.parse(raw) : [];

      const index = existing.findIndex((item) => item.id === podcastData.id);

      const updatedContent = {
        ...podcastData,
        type: "podcast",
        progress: 0,
        progressSeconds: 0,
        updatedAt: new Date().toISOString(),
        thumbnailImageUrl:
          podcastData.coverPodcastImage || podcastData.posterImageUrl || null,
      };

      if (index >= 0) {
        existing[index] = {
          ...existing[index],
          updatedAt: new Date().toISOString(),
        };
      } else {
        existing = [updatedContent, ...existing].slice(0, 10);
      }

      localStorage.setItem("last_seen_content", JSON.stringify(existing));
    } catch (err) {
      console.error("Failed push podcast:", err);
    }
  }, [podcastData]);

  useEffect(() => {
    if (!podcastData || !podcastData.id) return;
    pushPodcastToLastSeen();
  }, [podcastData]);

  useEffect(() => {
    if (!podcastData?.id) return;

    createLastSeen({
      contentType: "PODCAST",
      contentId: podcastData.id,
    });
  }, [podcastData?.id]);

  // save progress bar
  useEffect(() => {
    if (!podcastData?.id) return;

    const interval = setInterval(() => {
      if (!currentTime || currentTime <= 0) return;

      const progress =
        duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

      try {
        const raw = localStorage.getItem("last_seen_content");
        let existing = raw ? JSON.parse(raw) : [];

        const index = existing.findIndex((item) => item.id === podcastData.id);

        const updatedContent = {
          ...podcastData,
          type: "podcast",
          progress,
          progressSeconds: currentTime,
          updatedAt: new Date().toISOString(),
          thumbnailImageUrl:
            podcastData.coverPodcastImage || podcastData.posterImageUrl || null,
        };

        if (index >= 0) {
          existing[index] = updatedContent;
        } else {
          existing = [updatedContent, ...existing].slice(0, 10);
        }

        localStorage.setItem("last_seen_content", JSON.stringify(existing));
      } catch (err) {
        console.error("Failed save podcast progress:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [podcastData?.id, currentTime, duration]);

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

  const handleBuy = async (episodeId) => {
    window.location.href = `/checkout/purchase/podcasts/${id}/${episodeId}`;
  };

  const handleSubscribe = async () => {
    window.location.href = `/checkout/subscribe/podcasts/${id}`;
  };

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
        handlePayment={handleBuy}
        handleSubscribe={handleSubscribe}
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
    </div>
  );
}

DetailPodcastPage.propTypes = {
  params: PropTypes.object.isRequired,
};
