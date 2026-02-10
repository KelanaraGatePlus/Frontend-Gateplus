import React from "react";
import { useGetPopularEbooksQuery } from "@/hooks/api/homeSliceAPI.js";
import CarouselTemplate from "../carouselTemplate";
import PropTypes from "prop-types";

export default function CarouselPopularEbooks({ isBlurred }) {
  const { data, isLoading } = useGetPopularEbooksQuery();
  const popularEbooks = data?.data || [];

  return (
    <CarouselTemplate
      label={"Popular Ebooks"}
      contents={popularEbooks}
      isLoading={isLoading}
      type="ebook"
      isBlurred={isBlurred}
    />
  );
}

CarouselPopularEbooks.propTypes = {
  isBlurred: PropTypes.bool.isRequired,
};
