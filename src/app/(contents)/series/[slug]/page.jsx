"use client";

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";

import LoadingOverlay from "@/components/LoadingOverlay/page";
import { useGetSeriesBySlugQuery } from "@/hooks/api/seriesSliceAPI";

export default function SeriesSlugPage({ params }) {
  const router = useRouter();
  const { slug } = React.use(params);

  const { data, isLoading, isFetching, isError } = useGetSeriesBySlugQuery(slug, {
    skip: !slug,
  });

  const seriesId = data?.data?.id || data?.data?._id || data?.id || data?._id;

  useEffect(() => {
    if (seriesId) {
      router.replace(`/series/detail/${seriesId}`);
    }
  }, [seriesId, router]);

  useEffect(() => {
    if (!isLoading && !isFetching && (isError || (data && !seriesId))) {
      router.replace("/not-found");
    }
  }, [isLoading, isFetching, isError, data, seriesId, router]);

  return <LoadingOverlay />;
}

SeriesSlugPage.propTypes = {
  params: PropTypes.object.isRequired,
};
