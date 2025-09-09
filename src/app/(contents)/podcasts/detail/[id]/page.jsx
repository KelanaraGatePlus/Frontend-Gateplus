"use client";
import React, { useState, useEffect, Suspense, use } from "react";
import PropTypes from "prop-types";

/*[--- API HOOKS ---]*/
import { useGetPodcastByIdQuery } from "@/hooks/api/podcastSliceAPI";

/*[--- UI COMPONENTS ---]*/
import MainTemplateLayout from "@/components/MainDetailProduct/page";
import PodcastPlayback from "@/components/PodcastPlayer/PodcastPlayback";
import BottomSpacer from "@/components/BottomSpacer/page";
import SimpleModal from "@/components/Modal/SimpleModal";
import { useMidtransPayment } from "@/hooks/api/midtransAPI";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";

export default function DetailPodcastPage({ params }) {
  const { id } = use(params);
  const [userId, setUserId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [selectedCreatorId, setSelectedCreatorId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
    const { pay } = useMidtransPayment();
  const [createLog] = useCreateLogMutation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("users_id"));
      setCurrentlyPlaying(JSON.parse(null));
    }
  }, []);

  const skip = !id || !userId;
  const { data, isLoading } = useGetPodcastByIdQuery({ id, userId }, { skip });
  const podcastData = data?.data?.data || {};
  const episode_podcasts = (podcastData.episode_podcasts || []).slice().sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  const handlePlayPodcast = (episodeData) => {
    setCurrentlyPlaying(episodeData);
    localStorage.setItem("currentlyPlaying", JSON.stringify(episodeData));
  };

  const handleModalOpen = (creatorId, episodeId, price) => {
    setSelectedCreatorId(creatorId);
    setSelectedEpisode(episodeId);
    setSelectedPrice(price);
    setIsModalOpen(true);
  }

  const handleBuy = async () => {
    setLoading(true);
    await pay({
      creatorId: selectedCreatorId,
      episodeId: selectedEpisode,
      price: selectedPrice,
      contentType: "PODCAST",
    });
    setIsModalOpen(false);
    setLoading(false);
  };

  useEffect(() => {
    createLog({
      contentType: "PODCAST",
      logType: "CLICK",        // atau WATCH_TRAILER / WATCH_CONTENT sesuai kebutuhan
      contentId: id,
    });
  }, [id, createLog]);

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
          handlePayment={handleModalOpen}
        />

        <BottomSpacer height="h-42" />

        <div className={`fixed bottom-0 ${isOpen ? "z-20" : "z-10"}`}>
          <Suspense fallback="Loading...">
            <PodcastPlayback
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              currentlyPlaying={currentlyPlaying}
              handlePlayPodcast={handlePlayPodcast}
              podcast={podcastData}
              episodePodcasts={episode_podcasts}
            />
          </Suspense>
        </div>

        <SimpleModal
          title={"Konten ini masih terkunci, apakah kamu bersedia membeli nya dengan harga Rp. " + (selectedPrice?.toLocaleString() ?? 0) + ",- ?"}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleBuy}
        />

        {loading && <LoadingOverlay />}
      </div>
    )
  );
}

DetailPodcastPage.propTypes = {
  params: PropTypes.string,
}
