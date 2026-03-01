"use client";

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";

import LoadingOverlay from "@/components/LoadingOverlay/page";
import { useGetEducationBySlugQuery } from "@/hooks/api/educationSliceAPI";

export default function EducationSlugPage({ params }) {
  const router = useRouter();
  const { slug } = React.use(params);

  const { data, isLoading, isFetching, isError } = useGetEducationBySlugQuery(slug, {
    skip: !slug,
  });

  const educationId = data?.data?.id || data?.data?._id || data?.id || data?._id;

  useEffect(() => {
    if (educationId) {
      router.replace(`/education/detail/${educationId}`);
    }
  }, [educationId, router]);

  useEffect(() => {
    if (!isLoading && !isFetching && (isError || (data && !educationId))) {
      router.replace("/not-found");
    }
  }, [isLoading, isFetching, isError, data, educationId, router]);

  return <LoadingOverlay />;
}

EducationSlugPage.propTypes = {
  params: PropTypes.object.isRequired,
};
