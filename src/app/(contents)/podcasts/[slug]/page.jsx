"use client";

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";

import LoadingOverlay from "@/components/LoadingOverlay/page";
import { useGetPodcastsBySlugQuery } from "@/hooks/api/podcastSliceAPI";

export default function PodcastSlugPage({ params }) {
  const router = useRouter();
  const { slug } = React.use(params);

  const { data, isLoading, isFetching, isError } = useGetPodcastsBySlugQuery(slug, {
    skip: !slug,
  });

  const podcastId = data?.data?.id || data?.data?._id || data?.id || data?._id;

  useEffect(() => {
    if (podcastId) {
      router.replace(`/podcasts/detail/${podcastId}`);
    }
  }, [podcastId, router]);

  useEffect(() => {
    if (!isLoading && !isFetching && (isError || (data && !podcastId))) {
      router.replace("/not-found");
    }
  }, [isLoading, isFetching, isError, data, podcastId, router]);

  return <LoadingOverlay />;
}

PodcastSlugPage.propTypes = {
  params: PropTypes.object.isRequired,
};
