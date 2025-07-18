"use client";
import React, { useState, useEffect, Suspense, use } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import MainTemplateLayout from "@/components/MainDetailProduct/page";
import ListenPodcast from "@/components/PodcastPlayingComponent/listenPodcast";
import BottomSpacer from "@/components/BottomSpacer/page";

export default function DetailPodcast({ params }) {
  const { id } = use(params);
  const [podcastData, setPodcastData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("users_id");
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/podcast/${id}?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const ebookSingleData = response.data.data.data;
      console.log("ini das", ebookSingleData);
      setPodcastData(ebookSingleData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    podcastData && (
      <div className="relative">
        <MainTemplateLayout
          productType="podcast"
          productDetail={podcastData}
          productEpisode={podcastData.episode_podcasts}
          isLoading={isLoading}
        />

        <BottomSpacer height="h-42" />

        <div className={`fixed bottom-0 ${isOpen ? "z-20" : "z-10"}`}>
          <Suspense fallback="Loading...">
            <ListenPodcast isOpen={isOpen} setIsOpen={setIsOpen} />
          </Suspense>
        </div>

      </div>
    )
  );
}

DetailPodcast.propTypes = {
  params: PropTypes.string,
}
