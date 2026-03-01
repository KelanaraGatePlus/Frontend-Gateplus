"use client";

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";

import LoadingOverlay from "@/components/LoadingOverlay/page";
import { useGetComicsBySlugQuery } from "@/hooks/api/comicSliceAPI";

export default function ComicSlugPage({ params }) {
  const router = useRouter();
  const { slug } = React.use(params);

  const { data, isLoading, isFetching, isError } = useGetComicsBySlugQuery(slug, {
    skip: !slug,
  });

  const comicId = data?.data?.id || data?.data?._id || data?.id || data?._id;

  useEffect(() => {
    if (comicId) {
      router.replace(`/comics/detail/${comicId}`);
    }
  }, [comicId, router]);

  useEffect(() => {
    if (!isLoading && !isFetching && (isError || (data && !comicId))) {
      router.replace("/not-found");
    }
  }, [isLoading, isFetching, isError, data, comicId, router]);

  return <LoadingOverlay />;
}

ComicSlugPage.propTypes = {
  params: PropTypes.object.isRequired,
};
