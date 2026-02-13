import React from "react";
import PropTypes from "prop-types";
import ContentItem from "./ContentItem";
import ContentLoading from "./ContentLoading";
import "react-loading-skeleton/dist/skeleton.css";
import EmptyContent from "@/components/EmptyContent/page";

export default function ContentList({
  data,
  isLoading,
  isOnUserProfile = false,
  currentPage,
  itemsPerPage,
  isBlurred,
}) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContent = data.slice(startIndex, startIndex + itemsPerPage);

  if (!isLoading && data.length === 0) {
    return (
      <EmptyContent
        headerMessage="Konten Masih Kosong"
        descriptionMessage="Konten kamu masih kosong, silakan cek lagi nanti!"
      />
    );
  }

  return (
    <div
      className={`flex-start flex flex-wrap ${isOnUserProfile ? "justify-center gap-4" : "justify-start gap-6"}`}
    >
      {isLoading
        ? Array.from({ length: 10 }).map((_, index) => (
            <ContentLoading key={index} />
          ))
        : paginatedContent.map((content) => (
            <ContentItem
              key={content.id}
              item={content}
              type={content.type}
              isBlurred={isBlurred}
            />
          ))}
    </div>
  );
}

ContentList.propTypes = {
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isOnUserProfile: PropTypes.bool,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  isBlurred: PropTypes.func.isRequired,
};
