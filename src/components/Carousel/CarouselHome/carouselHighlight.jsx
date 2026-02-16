import React from "react";
import { useGetHighlightQuery } from "@/hooks/api/homeSliceAPI.js";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";
import PropTypes from "prop-types";

export default function CarouselHighlight({ isBlurred }) {
  const { data, isLoading } = useGetHighlightQuery();
  const hightlightData = data?.data || [];

  return (
    <CarouselTemplate
      label={"Highlight"}
      contents={hightlightData}
      isLoading={isLoading}
      isBlurred={isBlurred}
      isHomepage={true}
    />
  );
}

CarouselHighlight.propTypes = {
  isBlurred: PropTypes.func.isRequired,
};
