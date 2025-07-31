/* eslint-disable no-unused-vars */
"use client";
import BackButton from "@/components/BackButton/page";
import Link from "next/link";
// import ComicDummyImage from "@@/poster/komik-dummy-content.svg";
import iconCommentComic from "@@/icons/icon-comment-comic.svg"
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import { formatDateTime } from "@/lib/timeFormatter";
import axios from "axios";
import CommentModalComic from "@/components/CommentModalComic/page"

// eslint-disable-next-line react/prop-types
export default function ReadComicPage({ params }) {
  const { id } = use(params);
  const [currentPage, setCurrentPage] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [viewMode, setViewMode] = useState("auto");
  const [zoomLevel, setZoomLevel] = useState(0.5);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [title, setTitle] = useState("");
  const [creatorNotes, setCreatorNotes] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [comicData, setComicData] = useState([]);
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

  const handleNext = () => {
    setCurrentPage((prev) =>
      Math.min(prev + (viewMode === "2" ? 2 : 1), comicData.length - 1),
    );
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - (viewMode === "2" ? 2 : 1), 0));
  };

  const visiblePages =
    viewMode === "2"
      ? comicData.slice(currentPage, currentPage + 2)
      : [comicData[currentPage]];

  const progressPercentage = ((currentPage + 1) / comicData.length) * 100;

  const getData = async () => {
    try {
      const response = await axios.get(
        `https://backend-gateplus-api.my.id/episodeComics/${id}`,
      );

      const comicSingleData = response.data.data.data;

      setTitle(comicSingleData.title);
      setCreatorNotes(comicSingleData.notedEpisode);
      setComicData(comicSingleData.fileImageComics);
      setUpdatedAt(formatDateTime(comicSingleData.updatedAt, "short"));
      console.log(comicSingleData);

      const existing = JSON.parse(localStorage.getItem("last_seen_content")) || [];
      const isAlreadyExist = existing.find(item => item.id === comicSingleData.comics.id);
      let updated = existing;
      if (!isAlreadyExist) {
        const newContent = {
          ...comicSingleData.comics,
          type: "comic",
        };
        updated = [newContent, ...existing].slice(0, 10);
      }
      localStorage.setItem("last_seen_content", JSON.stringify(updated));

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
                  alt={page}
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

      {/* Navigasi bawah */}
      <div className="absolute bottom-12 left-1/2 z-20 flex w-[calc(100%-24px)] -translate-x-1/2 flex-wrap items-center justify-center gap-4 rounded-full bg-white/60 px-4 py-2 shadow-lg backdrop-blur-md sm:bottom-5 lg:w-2/3">
        {/* Panah kiri */}
        <button
          onClick={handlePrev}
          className="text-gray-700 transition hover:text-blue-600"
          aria-label="Previous"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Desktop: full controls */}
        <div className="hidden items-center gap-2 md:flex">
          {/* View Mode */}
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="rounded bg-white/80 px-2 py-1 text-sm"
          >
            <option value="auto">Auto</option>
            <option value="1">1 Page</option>
            <option value="2">2 Page</option>
          </select>

          {/* Zoom Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="zoom" className="text-sm font-medium text-gray-700">
              Zoom
            </label>
            <select
              id="zoom"
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

        <div className="items-center gap-2 md:flex p-1 hover:bg-black/30 rounded-full">
          <button
            className="relative w-6 h-6 cursor-pointer rounded-full"
            onClick={() => {
              setIsCommentVisible(!isCommentVisible)
            }}
          >
            <Image
              src={iconCommentComic}
              fill
              alt="icon-comment"
            />
          </button>
        </div>

        <div className="relative md:hidden">
          <button
            onClick={() => setShowMoreOptions(!showMoreOptions)}
            className="text-xl text-gray-700 transition hover:text-blue-600"
          >
            ⋯
          </button>
          {showMoreOptions && (
            <div className="absolute right-0 bottom-full z-50 mb-2 w-44 rounded-lg bg-white p-3 shadow-lg">
              <p className="mb-2 text-sm font-semibold text-gray-700">
                {Math.min(currentPage + 1, comicData.length)}/{comicData.length}
              </p>
              <div className="mb-2">
                <label className="mb-1 block text-xs text-gray-500">View</label>
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  className="w-full rounded border bg-white px-2 py-1 text-sm"
                >
                  <option value="auto">Auto</option>
                  <option value="1">1 Page</option>
                  <option value="2">2 Page</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Zoom</label>
                <select
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                  className="w-full rounded border bg-white px-2 py-1 text-sm"
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
          )}
        </div>
      </div>

      <CommentModalComic
        episodeId={id}
        isCommentVisible={isCommentVisible}
        setIsCommentVisible={setIsCommentVisible}
      />

    </div>
  );
}
