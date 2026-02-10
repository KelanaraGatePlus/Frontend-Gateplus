import React from "react";
import { useGetRecommendationsQuery } from "@/hooks/api/homeSliceAPI.js";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";
import PropTypes from "prop-types";

export default function CarouselRecommendations({ isBlurred }) {
  const { data, isLoading } = useGetRecommendationsQuery();
  const recommendationsData = data?.data || [];

  return (
    <CarouselTemplate
      label={"Recommendations For You"}
      contents={recommendationsData}
      isLoading={isLoading}
      isBlurred={isBlurred}
    />
  );
}

CarouselRecommendations.propTypes = {
  isBlurred: PropTypes.bool.isRequired,
};
