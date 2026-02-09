"use client";
import React, { useState, useEffect, use } from "react";
import PropTypes from "prop-types";

/*[--- API HOOKS ---]*/
import CompleteProfileModal from "@/components/Modal/CompleteProfileModal";
import UnderAgeModal from "@/components/Modal/UnderAgeModal";
import useSyncUserData from "@/hooks/api/useSyncUserData";
import { useGetPodcastByIdQuery } from "@/hooks/api/podcastSliceAPI";
import getMinAge from "@/lib/helper/minAge";

/*[--- UI COMPONENTS ---]*/
import MainTemplateLayout from "@/components/MainDetailProduct/page";
import SimpleModal from "@/components/Modal/SimpleModal";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";
import CommentComponent from "@/components/Comment/page";
import { useGetCommentByPodcastQuery } from "@/hooks/api/commentSliceAPI";
import { usePodcastPlayer } from "@/context/PodcastPlayerContext";

export default function DetailPodcastPage({ params }) {
  const { id } = use(params);
  const [userId, setUserId] = useState(null);
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [isModalSubscribeOpen, setIsModalSubscribeOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [createLog] = useCreateLogMutation();
  const { playEpisode, currentlyPlaying, setIsDetailPage } = usePodcastPlayer();

  useEffect(() => {
    setIsDetailPage(true);
    return () => setIsDetailPage(false);
  }, [setIsDetailPage]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("users_id"));
    }
  }, []);

  const skip = !id || !userId;
  const { data, isLoading } = useGetPodcastByIdQuery({ id, userId }, { skip });
  const { data: commentData, isLoading: isLoadingGetComment } =
    useGetCommentByPodcastQuery(id, { skip });
  const podcastData = data?.data || {};
  const {
    showCompleteProfileModal,
    showUnderAgeModal,
    goToProfile,
    continueDespiteUnderAge,
  } = useSyncUserData(podcastData?.ageRestriction);
  const episode_podcasts = (podcastData?.episode_podcasts?.episodes || [])
    .slice()
    .sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  const handlePlayPodcast = (episodeData) => {
    playEpisode(episodeData, podcastData, episode_podcasts);
  };

  const handleBuy = async (episodeId, selectedPrice) => {
    setSelectedPrice(selectedPrice);
    setLoading(true);
    window.location.href = `/checkout/purchase/podcasts/${id}/${episodeId}`;
    setIsModalOpen(false);
    setLoading(false);
  };

  const handleSubscribe = async () => {
    setLoading(true);
    window.location.href = `/checkout/subscribe/podcasts/${selectedContentId}`;
    setIsModalSubscribeOpen(false);
    setLoading(false);
  };

  useEffect(() => {
    createLog({
      contentType: "PODCAST",
      logType: "CLICK", // atau WATCH_TRAILER / WATCH_CONTENT sesuai kebutuhan
      contentId: id,
    });
  }, [id, createLog]);

  useEffect(() => {
    if (podcastData && podcastData.id) {
      setSelectedContentId(podcastData.id);
    }
  }, [podcastData]);

  return (
    podcastData && (
      <div className="relative">
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

        {/* Playback is handled globally by PodcastPlayerProvider */}

        <SimpleModal
          title={
            "Konten ini masih terkunci, apakah kamu bersedia membeli nya dengan harga Rp. " +
            (selectedPrice?.toLocaleString() ?? 0) +
            ",- ?"
          }
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleBuy}
        />

        <SimpleModal
          title={
            "Konten ini masih terkunci, apakah kamu bersedia membeli nya dengan harga Rp. " +
            (selectedPrice?.toLocaleString() ?? 0) +
            ",- ?"
          }
          isOpen={isModalSubscribeOpen}
          onClose={() => setIsModalSubscribeOpen(false)}
          onConfirm={handleSubscribe}
        />

        {loading && <LoadingOverlay />}
        {showCompleteProfileModal && (
          <CompleteProfileModal
            onConfirm={goToProfile}
            title={podcastData?.title}
          />
        )}
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
      </div>
    )
  );
}

DetailPodcastPage.propTypes = {
  params: PropTypes.string,
};
