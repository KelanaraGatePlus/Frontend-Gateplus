import React from 'react';
import PropTypes from 'prop-types';
import ContentItem from "./ContentItem";
import ContentLoading from "./ContentLoading";
import "react-loading-skeleton/dist/skeleton.css";

export default function ContentList({
    data,
    isLoading,
    currentPage,
    itemsPerPage,
}) {

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedContent = data.slice(startIndex, startIndex + itemsPerPage);

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
    data: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    currentPage: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    setTotalItems: PropTypes.func.isRequired,
};
