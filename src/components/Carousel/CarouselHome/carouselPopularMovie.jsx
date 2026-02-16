import React from "react";
import { useGetPopularMoviesQuery } from "@/hooks/api/homeSliceAPI.js";
import CarouselTemplate from "../carouselTemplate";
import PropTypes from "prop-types";

export default function CarouselPopularMovies({ isBlurred }) {
  const { data, isLoading } = useGetPopularMoviesQuery();
  const popularMovies = data?.data || [];

  return (
    <CarouselTemplate
      label={"Popular Movies"}
      contents={popularMovies}
      isLoading={isLoading}
      type="movie"
      isBlurred={isBlurred}
      isHomepage={true}
    />
  );
}

CarouselPopularMovies.propTypes = {
  isBlurred: PropTypes.bool.isRequired,
};
