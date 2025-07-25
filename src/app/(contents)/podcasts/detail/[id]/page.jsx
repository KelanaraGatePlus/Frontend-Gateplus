"use client";
import React, { useState, useEffect, Suspense, use } from "react";
import PropTypes from "prop-types";

/*[--- API HOOKS ---]*/
import { useGetPodcastByIdQuery } from "@/hooks/api/podcastSliceAPI";

/*[--- UI COMPONENTS ---]*/
import MainTemplateLayout from "@/components/MainDetailProduct/page";
import PodcastPlayback from "@/components/PodcastPlayer/PodcastPlayback";
import BottomSpacer from "@/components/BottomSpacer/page";

export default function DetailPodcastPage({ params }) {
  const { id } = use(params);
  const [userId, setUserId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("users_id");
      setUserId(storedUserId);
      console.log(storedUserId);
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
  };

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

      </div>
    )
  );
}

DetailPodcastPage.propTypes = {
  params: PropTypes.string,
}
