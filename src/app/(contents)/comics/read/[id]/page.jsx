/* eslint-disable no-unused-vars */
"use client";
import BackButton from "@/components/BackButton/page";
import Link from "next/link";
import iconCommentComic from "@@/icons/icon-comment-comic.svg";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { formatDateTime } from "@/lib/timeFormatter";
import { useGetEpisodeComicsByIdQuery } from "@/hooks/api/contentSliceAPI";
import CommentModalComic from "@/components/CommentModalComic/page";
import PropTypes from "prop-types";
import CommentComponent from "@/components/Comment/page";
import { useGetCommentByEpisodeComicQuery } from "@/hooks/api/commentSliceAPI";

export default function ReadComicPage({ params }) {
  const { id } = params;
  const [currentPage, setCurrentPage] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [viewMode, setViewMode] = useState("auto");
  const [zoomLevel, setZoomLevel] = useState(0.5);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const { data, isLoading, error } = useGetEpisodeComicsByIdQuery(id);
  const { data: commentData, isLoading: isLoadingGetComment } = useGetCommentByEpisodeComicQuery(id, {
    skip: !id,
  });

  const comicSingleData = data?.data;
  const comicData = comicSingleData?.fileImageComics || [];
  const title = comicSingleData?.title || "";
  const creatorNotes = comicSingleData?.notedEpisode || "";
  const updatedAt = comicSingleData
    ? formatDateTime(comicSingleData.updatedAt, "short")
    : "";
  const [isCommentVisible, setIsCommentVisible] = useState(false);

  useEffect(() => {
    const updateScreenSize = () => {
      const isWide = window.innerWidth >= 768;
      setIsDesktop(isWide);
      if (viewMode === "auto") setViewMode(isWide ? "2" : "1");
    };
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, [viewMode]);

  // Simpan ke localStorage (last seen content)
  useEffect(() => {
    if (comicSingleData?.comics) {
      const existing =
        JSON.parse(localStorage.getItem("last_seen_content")) || [];
      const isAlreadyExist = existing.find(
        (item) => item.id === comicSingleData.comics.id
      );
      let updated = existing;
      if (!isAlreadyExist) {
        const newContent = {
          ...comicSingleData.comics,
          type: "comic",
        };
        updated = [newContent, ...existing].slice(0, 10);
      }
      localStorage.setItem("last_seen_content", JSON.stringify(updated));
    }
  }, [comicSingleData]);

  const handleNext = () => {
    setCurrentPage((prev) =>
      Math.min(prev + (viewMode === "2" ? 2 : 1), comicData.length - 1)
    );
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - (viewMode === "2" ? 2 : 1), 0));
  };

  const visiblePages =
    viewMode === "2"
      ? comicData.slice(currentPage, currentPage + 2)
      : [comicData[currentPage]];

  const progressPercentage =
    comicData.length > 0
      ? ((currentPage + 1) / comicData.length) * 100
      : 0;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#222222] text-white">
        Loading...
      </div>
    );
  }

  if (error || !comicSingleData) {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
    return null;
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#222222]">
      {/* Header */}
      <div className="fixed top-0 right-0 left-0 z-10 flex h-[60px] w-full items-center gap-2 bg-[#222222]/80 px-4 py-2 text-2xl font-semibold text-[#FAFAFA] backdrop-blur">
        <BackButton />
        <h4 className="zeinFont line-clamp-1 w-full overflow-hidden text-left text-xl font-extrabold text-ellipsis md:text-2xl">
          <Link href="/" className="hover:underline">
            {title}
          </Link>
        </h4>
      </div>

      {/* Komik View */}
      <div className="-mt-3 flex h-full flex-1 items-center justify-center overflow-auto">
        <div
          className={`flex ${viewMode === "2" ? "flex-row" : "flex-col"
            } items-center justify-center`}
        >
          {visiblePages.map((page, idx) => (
            <div
              key={idx}
              className={`relative max-h-[calc(100vh-140px)] w-auto ${viewMode === "2" ? (idx % 2 === 0 ? "pr-1" : "pl-1") : "mb-2"
                } transition-all`}
            >
              {page ? (
                <Image
                  src={page}
                  alt={`Page ${idx + 1}`}
                  width={800 * zoomLevel}
                  height={1000 * zoomLevel}
                  className="object-contain"
                  priority
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Comment Baru */}
      <CommentComponent
        commentData={commentData?.data?.data || []}
        isLoadingGetComment={isLoadingGetComment}
        typeContent={"comic"}
        episodeId={id}
      />
    </div>
  );
}

// ✅ Tambahkan prop-types agar ESLint tidak komplain
ReadComicPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
