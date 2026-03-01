"use client";

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";

import LoadingOverlay from "@/components/LoadingOverlay/page";
import { useGetMoviesBySlugQuery } from "@/hooks/api/movieSliceAPI";

export default function MovieSlugPage({ params }) {
  const router = useRouter();
  const { slug } = React.use(params);

  const { data, isLoading, isFetching, isError } = useGetMoviesBySlugQuery(slug, {
    skip: !slug,
  });

  const movieId = data?.data?.id || data?.data?._id || data?.id || data?._id;

  useEffect(() => {
    if (movieId) {
      router.replace(`/movies/detail/${movieId}`);
    }
  }, [movieId, router]);

  useEffect(() => {
    if (!isLoading && !isFetching && (isError || (data && !movieId))) {
      router.replace("/not-found");
    }
  }, [isLoading, isFetching, isError, data, movieId, router]);

  return <LoadingOverlay />;
}

MovieSlugPage.propTypes = {
  params: PropTypes.object.isRequired,
};
