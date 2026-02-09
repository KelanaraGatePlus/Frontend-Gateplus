import React from "react";
import { useGetPopularMoviesQuery } from "@/hooks/api/homeSliceAPI.js";
import CarouselTemplate from "../carouselTemplate";

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
    />
  );
}
