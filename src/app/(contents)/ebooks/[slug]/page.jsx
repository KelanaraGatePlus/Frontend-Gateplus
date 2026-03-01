"use client";

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";

import LoadingOverlay from "@/components/LoadingOverlay/page";
import { useGetEbooksBySlugQuery } from "@/hooks/api/ebookSliceAPI";

export default function EbookSlugPage({ params }) {
	const router = useRouter();
	const { slug } = React.use(params);

	const { data, isLoading, isFetching, isError } = useGetEbooksBySlugQuery(slug, {
		skip: !slug,
	});

	const ebookId = data?.data?.id || data?.data?._id || data?.id || data?._id;

	useEffect(() => {
		if (ebookId) {
			router.replace(`/ebooks/detail/${ebookId}`);
		}
	}, [ebookId, router]);

	useEffect(() => {
		if (!isLoading && !isFetching && (isError || (data && !ebookId))) {
			router.replace("/not-found");
		}
	}, [isLoading, isFetching, isError, data, ebookId, router]);

	return <LoadingOverlay />;
}

EbookSlugPage.propTypes = {
	params: PropTypes.object.isRequired,
};
