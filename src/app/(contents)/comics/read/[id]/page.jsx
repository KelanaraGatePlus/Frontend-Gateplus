/* eslint-disable no-unused-vars */
"use client";
import BackButton from "@/components/BackButton/page";
import Link from "next/link";
import iconCommentComic from "@@/icons/icon-comment-comic.svg";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { formatDateTime } from "@/lib/timeFormatter";
import { useGetEpisodeComicsByIdQuery } from "@/hooks/api/contentSliceAPI";
import { useGetCommentByEpisodeComicQuery } from "@/hooks/api/commentSliceAPI";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";
import PropTypes from "prop-types";
import CommentComponent from "@/components/Comment/page";
import { useDeviceType } from "@/hooks/helper/deviceType";

export default function ReadComicPage({ params }) {
  const { id } = params;
  const [currentPage, setCurrentPage] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [viewMode, setViewMode] = useState("auto");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const device = useDeviceType();
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [createLog] = useCreateLogMutation();

  // ✅ Fetch episode pakai RTK Query
  const { data, isLoading, error } = useGetEpisodeComicsByIdQuery(id);
  const comicSingleData = data?.data?.data; // sesuai struktur JSON
  const comicData = comicSingleData?.fileImageComics || [];
  const title = comicSingleData?.comics?.title || "";
  const updatedAt = comicSingleData
    ? formatDateTime(comicSingleData.updatedAt, "short")
    : "";

  // ✅ Comment
  const { data: commentData, isLoading: isLoadingGetComment } =
    useGetCommentByEpisodeComicQuery(id, { skip: !id });

  // ✅ Log setelah 1 menit
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
        console.log("✅ Log berhasil dibuat setelah 1 menit");
      } catch (err) {
        console.error("❌ Gagal membuat log:", err);
      }
    }, 5 * 1000);
    return () => clearTimeout(timer);
  }, [id, createLog]);

  // ✅ Responsif: auto set view mode
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

  // ✅ Last seen content simpan ke localStorage
  useEffect(() => {
    if (comicSingleData?.comics) {
      const existing =
        JSON.parse(localStorage.getItem("last_seen_content")) || [];
      const isAlreadyExist = existing.find(
        (item) => item.id === comicSingleData.comics.id
      );
      let updated = existing;
      if (!isAlreadyExist) {
        const newContent = { ...comicSingleData.comics, type: "comic" };
        updated = [newContent, ...existing].slice(0, 10);
      }
      localStorage.setItem("last_seen_content", JSON.stringify(updated));
    }
  }, [comicSingleData]);

  // ✅ Navigasi
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
    <div>
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
        {/* ✅ Navigasi bawah */}
        <div className="absolute bottom-12 left-1/2 z-20 flex w-[calc(100%-24px)] -translate-x-1/2 flex-wrap items-center justify-center gap-4 rounded-full bg-white/60 px-4 py-2 shadow-lg backdrop-blur-md sm:bottom-5 lg:w-2/3">
          {/* Panah kiri */}
          <button
            onClick={handlePrev}
            className="text-gray-700 transition hover:text-blue-600"
            aria-label="Previous"
          >
            ◀
          </button>
          {/* Progress */}
          <p className="block text-sm font-semibold text-gray-700">
            {Math.min(currentPage + 1, comicData.length)}/{comicData.length}
          </p>
          <div className="relative h-2 w-[160px] overflow-hidden rounded-full bg-[#013544] md:w-[300px]">
            <div
              className="absolute top-0 left-0 h-full bg-[#0395BC] transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          {/* Panah kanan */}
          <button
            onClick={handleNext}
            className="text-gray-700 transition hover:text-blue-600"
            aria-label="Next"
          >
            ▶
          </button>
          {/* View Mode + Zoom */}
          <div className="hidden items-center gap-2 md:flex">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="rounded bg-white/80 px-2 py-1 text-sm"
            >
              <option value="auto">Auto</option>
              <option value="1">1 Page</option>
              <option value="2">2 Page</option>
            </select>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Zoom</label>
              <select
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                className="rounded bg-white/80 px-2 py-1 text-sm"
              >
                <option value={0.5}>50%</option>
                <option value={0.75}>75%</option>
                <option value={1}>100%</option>
                <option value={1.25}>125%</option>
                <option value={1.5}>150%</option>
                <option value={2}>200%</option>
              </select>
            </div>
          </div>
          {/* Comment Button */}
          <div className="items-center gap-2 md:flex p-1 hover:bg-black/30 rounded-full">
            <button
              className="relative w-6 h-6 cursor-pointer rounded-full"
              onClick={() => setIsCommentVisible(!isCommentVisible)}
            >
              <Image src={iconCommentComic} fill alt="icon-comment" />
            </button>
          </div>
        </div>
      </div>
      <CommentComponent
          commentData={commentData?.data?.data || []}
          isLoadingGetComment={isLoadingGetComment}
          typeContent={"comic"}
          episodeId={id}
        />
    </div>
  );
}

ReadComicPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
