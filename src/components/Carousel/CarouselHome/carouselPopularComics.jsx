import React from "react";
import { useGetPopularComicsQuery } from "@/hooks/api/homeSliceAPI.js";
import CarouselTemplate from "../carouselTemplate";
import PropTypes from "prop-types";

export default function CarouselPopularComics({ isBlurred }) {
  const { data, isLoading } = useGetPopularComicsQuery();
  const popularComics = data?.data || [];

  return (
    <CarouselTemplate
      label={"Popular Comics"}
      contents={popularComics}
      isLoading={isLoading}
      type="comic"
      isBlurred={isBlurred}
    />
  );
}

CarouselPopularComics.propTypes = {
  isBlurred: PropTypes.func,
};
