"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";
import BackButton from "@/components/BackButton/page";
import CommentModalComic from "@/components/CommentModalComic/page";
import EpisodeController from "@/components/EpisodeController/EpisodeController";
import iconFlag from "@@/icons/icon-flag.svg";
import iconCommentComic from "@@/icons/icon-comment-comic.svg";
import { useDeviceType } from "@/hooks/helper/deviceType";
import { useGetEpisodeComicsByIdQuery } from "@/hooks/api/contentSliceAPI";
import { useGetCommentByEpisodeComicQuery } from "@/hooks/api/commentSliceAPI";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";
import { useApplyReadProgressMutation } from "@/hooks/api/readProgressAPI";
import { BACKEND_URL } from "@/lib/constants/backendUrl";
import { useRouter } from "next/navigation";

export default function ReadComicPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const device = useDeviceType();

  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState("auto");
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [visibleImages, setVisibleImages] = useState({});
  const imageAreaRef = useRef(null);
  const observer = useRef(null);

  const [progressLoaded, setProgressLoaded] = useState(false);
  const [lastProgress, setLastProgress] = useState(0); // 1-based logical page
  const skipNextSave = useRef(false);

  const [createLog] = useCreateLogMutation();
  const [applyReadProgress] = useApplyReadProgressMutation();

  // --- FETCH COMIC DATA ---
  const { data, isLoading, error } = useGetEpisodeComicsByIdQuery(id);
  const comicSingleData = data?.data?.data;
  const comicData = comicSingleData?.fileImageComics || [];
  const title = comicSingleData?.comics?.title || "";
  const episodeComicNextId = data?.data?.nextEpisode?.id || null;
  const episodeComicPrevId = data?.data?.previousEpisode?.id || null;

  // --- FETCH COMMENTS ---
  const { data: commentData, isLoading: isLoadingGetComment } =
    useGetCommentByEpisodeComicQuery(id, { skip: !id });

  const itemsPerPage = viewMode === "2" ? 2 : 1;
  const totalPages =
    itemsPerPage > 0 ? Math.ceil(comicData.length / itemsPerPage) : 0;
  const logicalCurrentPage = Math.floor(currentPage / itemsPerPage) + 1;
  const maxCurrentPageIndex = Math.max(0, comicData.length - itemsPerPage);

  const progressPercent =
    totalPages > 0
      ? Math.min(100, Math.round((lastProgress / totalPages) * 100))
      : 0;

  console.log(
    "[RENDER] currentPage:",
    currentPage,
    "| logicalCurrentPage:",
    logicalCurrentPage,
    "| totalPages:",
    totalPages,
    "| lastProgress:",
    lastProgress,
    "| progressPercent:",
    progressPercent,
  );

  // Redirect to purchase if 403
  useEffect(() => {
    if (error && error.status === 403 && comicSingleData?.comics?.id) {
      window.location.href =
        "/payment/purchase/comics/x/" + comicSingleData.comics.id;
    }
  }, [error, comicSingleData]);

  useEffect(() => {
    if (!id) return;
    const timer = setTimeout(
      async () => {
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
      },
      2 * 60 * 1000,
    );
    return () => clearTimeout(timer);
  }, [id, createLog, device]);

  useEffect(() => {
    const updateScreenSize = () => {
      const isWide = window.innerWidth >= 768;
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
    if (newCurrentPage !== currentPage) setCurrentPage(newCurrentPage);
  }, [viewMode]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries, obsInst) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = entry.target.getAttribute("data-index");
            setVisibleImages((p) => ({ ...p, [idx]: true }));
            obsInst.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "100px", threshold: 0.1 },
    );
    observer.current = obs;
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const lazyElements = document.querySelectorAll(".lazy-image");
    lazyElements.forEach((el) => observer.current?.observe(el));
  }, [comicData, currentPage]);

  const visiblePages = comicData.slice(currentPage, currentPage + itemsPerPage);

  const saveProgressToDB = useCallback(
    async (logicalPage, pages) => {
      if (!id || pages <= 0) {
        console.warn("[SAVE] Skipped - id:", id, "totalPages:", pages);
        return;
      }

      const pageZeroBased = Math.min(Math.max(0, logicalPage - 1), pages - 1);
      const isFinish = logicalPage >= pages;

      const payload = {
        page: pageZeroBased,
        totalPages: pages,
        isFinish,
        episodeComicId: id,
      };

      console.log("[SAVE] Sending payload:", payload);

      try {
        const result = await applyReadProgress(payload).unwrap();
        console.log("[SAVE] Success:", result);
        setLastProgress(logicalPage);
      } catch (err) {
        console.error("[SAVE] Failed:", err);
      }
    },
    [id, applyReadProgress],
  );

  // fetch data last progress
  useEffect(() => {
    if (!id || comicData.length === 0) return;

    const fetchProgress = async () => {
      const url = `${BACKEND_URL}/readProgress?episodeComicId=${id}`;
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();

        if (json.items?.length) {
          const savedPage = json.items[0].page;
          const rawIndex = savedPage * itemsPerPage;
          const clampedIndex = Math.min(rawIndex, maxCurrentPageIndex);

          skipNextSave.current = true;
          setCurrentPage(clampedIndex);
          setLastProgress(savedPage + 1);
        } else {
          setLastProgress(0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setProgressLoaded(true);
      }
    };

    fetchProgress();
  }, [id, comicData.length, itemsPerPage, maxCurrentPageIndex]);

  // save progress pindah halaman
  useEffect(() => {
    console.log(
      "[SAVE EFFECT] Triggered | logicalCurrentPage:",
      logicalCurrentPage,
      "| totalPages:",
      totalPages,
      "| progressLoaded:",
      progressLoaded,
      "| skipNextSave:",
      skipNextSave.current,
    );

    if (!id || totalPages <= 0 || !progressLoaded) {
      console.log("[SAVE EFFECT] Skipped - conditions not met");
      return;
    }

    if (skipNextSave.current) {
      console.log("[SAVE EFFECT] Skipped - skipNextSave flag active");
      skipNextSave.current = false;
      return;
    }

    const t = setTimeout(() => {
      console.log(
        "[SAVE EFFECT] Debounce fired, saving logicalPage:",
        logicalCurrentPage,
        "totalPages:",
        totalPages,
      );
      saveProgressToDB(logicalCurrentPage, totalPages);
    }, 700);

    return () => clearTimeout(t);
  }, [logicalCurrentPage, totalPages, progressLoaded, id, saveProgressToDB]);

  useEffect(() => {
    return () => {
      if (!id || totalPages <= 0) return;
      const pageZeroBased = Math.min(
        Math.max(0, logicalCurrentPage - 1),
        totalPages - 1,
      );
      console.log(
        "[UNMOUNT] Saving final progress, pageZeroBased:",
        pageZeroBased,
      );
      applyReadProgress?.({
        page: pageZeroBased,
        totalPages,
        isFinish: logicalCurrentPage >= totalPages,
        episodeComicId: id,
      });
    };
  }, [id, logicalCurrentPage, totalPages]);

  // next & prev
  const handleNext = () => {
    const next = Math.min(currentPage + itemsPerPage, maxCurrentPageIndex);
    console.log("[NAV] Next -> currentPage:", currentPage, "->", next);
    setCurrentPage(next);
  };
  const handlePrev = () => {
    const prev = Math.max(currentPage - itemsPerPage, 0);
    console.log("[NAV] Prev -> currentPage:", currentPage, "->", prev);
    setCurrentPage(prev);
  };

  const handleClickArea = (e) => {
    if (!imageAreaRef.current) return;
    const rect = imageAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) handlePrev();
    else handleNext();
  };

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
        <BackButton
          onClick={() =>
            router.push(`/comics/detail/${comicSingleData?.comics?.id}`)
          }
        />
        <h4 className="zeinFont line-clamp-1 w-full text-left text-xl font-extrabold md:text-2xl">
          <Link href="/">{title}</Link>
        </h4>

        <Link
          href={`/report/episode_comic/${comicSingleData?.id}`}
          className="rounded-full bg-white/20 p-2 transition hover:bg-white/40"
        >
          <Image src={iconFlag} alt="flag" width={32} height={32} />
        </Link>
      </div>

      {/* MAIN WRAPPER */}
      <div className="flex min-h-screen flex-col pt-[60px]">
        <div
          className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto"
          onClick={handleClickArea}
          ref={imageAreaRef}
        >
          {/* Overlay areas for left/right hit zones (50% each) */}
          <div
            role="button"
            aria-label="previous-page-area"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute top-0 left-0 h-full w-1/2"
            style={{
              cursor: "url('/cursor/leftArrow.svg') 12 12, w-resize",
              background: "transparent",
            }}
          />

          <div
            role="button"
            aria-label="next-page-area"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute top-0 right-0 h-full w-1/2"
            style={{
              cursor: "url('/cursor/rightArrow.svg') 12 12, e-resize",
              background: "transparent",
            }}
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
                  className={`lazy-image flex items-center justify-center ${
                    viewMode === "2"
                      ? idx % 2 === 0
                        ? "pr-1"
                        : "pl-1"
                      : "mb-2"
                  } transition-all`}
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
                      className="h-full w-auto rounded-md object-contain"
                      priority={isPriority}
                      loading={isPriority ? undefined : "lazy"}
                      style={{ transition: "transform 0.3s ease" }}
                    />
                  ) : (
                    <div className="flex h-full w-auto animate-pulse items-center justify-center rounded-md bg-[#111]/30 text-white">
                      Loading image...
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* NAVIGASI BAWAH */}
        <div className="flex h-[5vh] w-full flex-wrap items-center justify-center gap-4 bg-white/60 px-4 py-2 shadow-lg backdrop-blur-md">
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

          <div className="relative h-2 w-[160px] overflow-hidden rounded-full bg-[#013544] md:w-[300px]">
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-[#0395BC] transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <button
            onClick={handleNext}
            disabled={logicalCurrentPage === totalPages}
            className="text-gray-700 hover:text-blue-600 disabled:text-gray-300"
          >
            ▶
          </button>

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

            {/* Zoom control removed */}
          </div>

          <button
            className="relative h-6 w-6 rounded-full p-1 hover:bg-black/30"
            onClick={() => setIsCommentVisible(!isCommentVisible)}
          >
            <Image src={iconCommentComic} fill alt="comment" />
          </button>
        </div>
      </div>

      <EpisodeController
        prevEpisodeUrl={
          episodeComicPrevId ? `/comics/read/${episodeComicPrevId}` : null
        }
        nextEpisodeUrl={
          episodeComicNextId ? `/comics/read/${episodeComicNextId}` : null
        }
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
