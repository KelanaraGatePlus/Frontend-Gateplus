import React from "react";
import { useGetPopularSeriesQuery } from "@/hooks/api/homeSliceAPI.js";
import CarouselTemplate from "../carouselTemplate";
import PropTypes from "prop-types";

export default function CarouselPopularSeries({ isBlurred }) {
  const { data, isLoading } = useGetPopularSeriesQuery();
  const popularSeries = data?.data || [];

  return (
    <CarouselTemplate
      label={"Popular Series"}
      contents={popularSeries}
      isLoading={isLoading}
      type="series"
      isBlurred={isBlurred}
    />
  );
}

CarouselPopularSeries.propTypes = {
  isBlurred: PropTypes.bool.isRequired,
};