import React from "react";
import { useGetPopularPodcastsQuery } from "@/hooks/api/homeSliceAPI.js";
import CarouselTemplate from "../carouselTemplate";
import PropTypes from "prop-types";

export default function CarouselPopularEbooks({ isBlurred }) {
  const { data, isLoading } = useGetPopularPodcastsQuery();
  const popularPodcasts = data?.data || [];

  return (
    <CarouselTemplate
      label={"Popular Podcasts"}
      contents={popularPodcasts}
      isLoading={isLoading}
      type="podcast"
      withGradient={false}
      isBlurred={isBlurred}
      isHomepage={true}
    />
  );
}

CarouselPopularEbooks.propTypes = {
  isBlurred: PropTypes.bool.isRequired,
};
