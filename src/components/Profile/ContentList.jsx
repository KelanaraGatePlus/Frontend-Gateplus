import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useGetNewestContentQuery } from "@/hooks/api/creatorSliceAPI";
import ContentItem from "./ContentItem";
import ContentLoading from "./ContentLoading";
import "react-loading-skeleton/dist/skeleton.css";

export default function ContentList({ creatorId, currentPage, itemsPerPage, setTotalItems }) {
    const skip = !creatorId;
    const { data, isLoading } = useGetNewestContentQuery(creatorId, { skip });
    const newestContent = data?.data?.data || [];

    useEffect(() => {
        if (!isLoading) {
            setTotalItems(newestContent.length);
        }
    }, [newestContent, isLoading]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedContent = newestContent.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="flex flex-start flex-wrap gap-6">
            {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                    <ContentLoading key={index} />
                ))
            ) : (
                paginatedContent.map((content) => (
                    <ContentItem
                        key={content.id}
                        item={content}
                        type={content.type}
                    />
                ))
            )}
        </div>
    )
}

ContentList.propTypes = {
    creatorId: PropTypes.string.isRequired,
    currentPage: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    setTotalItems: PropTypes.func.isRequired,
};
