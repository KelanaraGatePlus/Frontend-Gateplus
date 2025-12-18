/* eslint-disable no-unused-vars */
"use client";
import BackButton from "@/components/BackButton/page";
import Link from "next/link";
import iconCommentComic from "@@/icons/icon-comment-comic.svg";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useGetEpisodeComicsByIdQuery } from "@/hooks/api/contentSliceAPI";
import { useGetCommentByEpisodeComicQuery } from "@/hooks/api/commentSliceAPI";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";
import PropTypes from "prop-types";
import { useDeviceType } from "@/hooks/helper/deviceType";
import iconFlag from "@@/icons/icon-flag.svg";
import CommentModalComic from "@/components/CommentModalComic/page";
import EpisodeController from "@/components/EpisodeController/EpisodeController";

export default function ReadComicPage({ params }) {
  const { id } = params;
  const [currentPage, setCurrentPage] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [viewMode, setViewMode] = useState("auto");
  const device = useDeviceType();
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [createLog] = useCreateLogMutation();

  const { data, isLoading } = useGetEpisodeComicsByIdQuery(id);
  const comicSingleData = data?.data?.data;
  const comicData = comicSingleData?.fileImageComics || [];
  const title = comicSingleData?.comics?.title || "";
  const episodeComicNextId = data?.data?.nextEpisode?.id || null;
  const episodeComicPrevId = data?.data?.previousEpisode?.id || null;

  const { data: commentData, isLoading: isLoadingGetComment } =
    useGetCommentByEpisodeComicQuery(id, { skip: !id });

  const itemsPerPage = viewMode === "2" ? 2 : 1;
  const totalPages =
    itemsPerPage > 0 ? Math.ceil(comicData.length / itemsPerPage) : 0;
  const logicalCurrentPage = Math.floor(currentPage / itemsPerPage) + 1;
  const maxCurrentPageIndex = Math.max(0, comicData.length - itemsPerPage);

  useEffect(() => {
    if (!id) return;
    const timer = setTimeout(async () => {
      try {
        await createLog({
          contentId: id,
          logType: "WATCH_CONTENT",
          contentType: "EPISODE_COMIC",
          deviceType: device,
        }).unwrap();
      } catch (err) {
        console.error("❌ Log error:", err);
      }
    }, 2 * 60 * 1000);
    return () => clearTimeout(timer);
  }, [id, createLog, device]);

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

  useEffect(() => {
    const newItemsPerPage = viewMode === "2" ? 2 : 1;
    const newCurrentPage =
      Math.floor(currentPage / newItemsPerPage) * newItemsPerPage;
    if (newCurrentPage !== currentPage) {
      setCurrentPage(newCurrentPage);
    }
  }, [viewMode, currentPage]);

  useEffect(() => {
    if (comicSingleData?.comics) {
      const existing =
        JSON.parse(localStorage.getItem("last_seen_content")) || [];
      const already = existing.find(
        (item) => item.id === comicSingleData.comics.id
      );
      let updated = existing;
      if (!already) {
        updated = [
          { ...comicSingleData.comics, type: "comic" },
          ...existing,
        ].slice(0, 10);
      }
      localStorage.setItem("last_seen_content", JSON.stringify(updated));
    }
  }, [comicSingleData]);

  const imageAreaRef = useRef(null);

  const handleClickArea = (e) => {
    if (!imageAreaRef.current) return;
    // Calculate click position relative to the image area
    const rect = imageAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeft = x < rect.width / 2;

    if (isLeft) {
      if (currentPage === 0) return;
      handlePrev();
    } else {
      if (logicalCurrentPage === totalPages) return;
      handleNext();
    }
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + itemsPerPage, maxCurrentPageIndex));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - itemsPerPage, 0));
  };

  const visiblePages = comicData.slice(
    currentPage,
    currentPage + itemsPerPage
  );

  const progressPercentage =
    totalPages > 0 ? (logicalCurrentPage / totalPages) * 100 : 0;

  const [visibleImages, setVisibleImages] = useState({});
  const observer = useRef(null);

  useEffect(() => {
    const observerInstance = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.getAttribute("data-index");
            setVisibleImages((prev) => ({ ...prev, [index]: true }));
            observerInstance.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "100px", threshold: 0.1 }
    );
    observer.current = observerInstance;
    return () => observerInstance.disconnect();
  }, []);

  useEffect(() => {
    const lazyElements = document.querySelectorAll(".lazy-image");
    lazyElements.forEach((el) => observer.current.observe(el));
  }, [comicData, currentPage]);

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#222] text-white">
        Loading...
      </div>
    );

  return (
    <div className="relative flex min-h-screen flex-col bg-[#222222]">
      {/* Header */}
      <div className="fixed top-0 right-0 left-0 z-10 flex h-[60px] items-center gap-2 bg-[#222]/80 px-4 py-2 text-2xl font-semibold text-white backdrop-blur">
        <BackButton />
        <h4 className="zeinFont w-full text-left text-xl font-extrabold md:text-2xl line-clamp-1">
          <Link href="/">{title}</Link>
        </h4>

        <Link
          href={`/report/episode_comic/${comicSingleData.id}`}
          className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition"
        >
          <Image src={iconFlag} alt="flag" width={32} height={32} />
        </Link>
      </div>

      {/* MAIN WRAPPER */}
      <div className="flex flex-col min-h-screen pt-[60px]">

        {/* 🔵 AREA GAMBAR + OVERLAY KIRI/KANAN */}
        <div
          className="relative flex-1 min-h-0 flex items-center justify-center overflow-auto"
          onClick={handleClickArea}
          ref={imageAreaRef}
        >
          {/* Overlay areas for left/right hit zones (50% each) */}
          <div
            role="button"
            aria-label="previous-page-area"
            onClick={(e) => {
              e.stopPropagation();
              if (currentPage === 0) return;
              handlePrev();
            }}
            className="absolute left-0 top-0 h-full w-1/2"
            style={{ cursor: "url('/cursor/leftArrow.svg') 12 12, w-resize", background: "transparent" }}
          />

          <div
            role="button"
            aria-label="next-page-area"
            onClick={(e) => {
              e.stopPropagation();
              if (logicalCurrentPage === totalPages) return;
              handleNext();
            }}
            className="absolute right-0 top-0 h-full w-1/2"
            style={{ cursor: "url('/cursor/rightArrow.svg') 12 12, e-resize", background: "transparent" }}
          />

          {/* === GAMBAR KOMIK === */}
          <div
            className={`flex ${viewMode === "2" ? "flex-row" : "flex-col"} items-center justify-center`}
          >
            {visiblePages.map((page, idx) => {
              const globalIndex = currentPage + idx;
              const isPriority = globalIndex === 0;

              return (
                <div
                  key={globalIndex}
                  data-index={globalIndex}
                  className={`lazy-image flex items-center justify-center ${viewMode === "2" ? (idx % 2 === 0 ? "pr-1" : "pl-1") : "mb-2"} transition-all`}
                  style={{
                    maxHeight: "100%",
                    height: "89vh",
                    overflow: "hidden",
                  }}
                >
                  {visibleImages[globalIndex] ? (
                    <Image
                      src={page}
                      alt={`Page ${globalIndex + 1}`}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="h-full w-auto object-contain rounded-md"
                      priority={isPriority}
                      loading={isPriority ? undefined : "lazy"}
                      style={{ transition: "transform 0.3s ease" }}
                    />
                  ) : (
                    <div className="flex h-full w-auto items-center justify-center bg-[#111]/30 text-white rounded-md animate-pulse">
                      Loading image...
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* NAVIGASI BAWAH */}
        <div className="h-[5vh] flex flex-wrap items-center justify-center gap-4 bg-white/60 px-4 py-2 shadow-lg backdrop-blur-md w-full">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="text-gray-700 hover:text-blue-600 disabled:text-gray-300"
          >
            ◀
          </button>

          <p className="text-sm font-semibold text-gray-700">
            {logicalCurrentPage}/{totalPages}
          </p>

          <div className="relative h-2 w-[160px] md:w-[300px] rounded-full bg-[#013544] overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-[#0395BC] transition-all"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <button
            onClick={handleNext}
            disabled={logicalCurrentPage === totalPages}
            className="text-gray-700 hover:text-blue-600 disabled:text-gray-300"
          >
            ▶
          </button>

          <div className="hidden md:flex items-center gap-2">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="rounded bg-white/80 px-2 py-1 text-sm"
            >
              <option value="auto">Auto</option>
              <option value="1">1 Page</option>
              <option value="2">2 Page</option>
            </select>

            {/* Zoom control removed */}
          </div>

          <button
            className="relative w-6 h-6 rounded-full hover:bg-black/30 p-1"
            onClick={() => setIsCommentVisible(!isCommentVisible)}
          >
            <Image src={iconCommentComic} fill alt="comment" />
          </button>
        </div>
      </div>

      <EpisodeController
        prevEpisodeUrl={episodeComicPrevId ? `/comics/read/${episodeComicPrevId}` : null}
        nextEpisodeUrl={episodeComicNextId ? `/comics/read/${episodeComicNextId}` : null}
      />

      <CommentModalComic
        commentData={commentData?.data?.data || []}
        isLoadingGetComment={isLoadingGetComment}
        episodeId={id}
        isCommentVisible={isCommentVisible}
        setIsCommentVisible={setIsCommentVisible}
      />
    </div>
  );
}

ReadComicPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
