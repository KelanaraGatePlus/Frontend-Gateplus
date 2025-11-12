/* eslint-disable no-unused-vars */
"use client";
import BackButton from "@/components/BackButton/page";
import Link from "next/link";
import iconCommentComic from "@@/icons/icon-comment-comic.svg";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { formatDateTime } from "@/lib/timeFormatter";
import { useGetEpisodeComicsByIdQuery } from "@/hooks/api/contentSliceAPI";
import { useGetCommentByEpisodeComicQuery } from "@/hooks/api/commentSliceAPI";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";
import PropTypes from "prop-types";
import CommentComponent from "@/components/Comment/page";
import { useDeviceType } from "@/hooks/helper/deviceType";

export default function ReadComicPage({ params }) {
  const { id } = params;
  const [currentPage, setCurrentPage] = useState(0); // Ini tetap index (0, 1, 2, 3...)
  const [isDesktop, setIsDesktop] = useState(false);
  const [viewMode, setViewMode] = useState("auto");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const device = useDeviceType();
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [createLog] = useCreateLogMutation();

  // ✅ Fetch episode pakai RTK Query
  const { data, isLoading, error } = useGetEpisodeComicsByIdQuery(id);
  const comicSingleData = data?.data?.data;
  const comicData = comicSingleData?.fileImageComics || [];
  const title = comicSingleData?.comics?.title || "";
  const updatedAt = comicSingleData
    ? formatDateTime(comicSingleData.updatedAt, "short")
    : "";

  // ✅ Comment
  const { data: commentData, isLoading: isLoadingGetComment } =
    useGetCommentByEpisodeComicQuery(id, { skip: !id });

  // ======================================================================
  // PERUBAHAN LOGIKA HALAMAN DIMULAI DI SINI
  // ======================================================================

  // Tentukan berapa item per halaman logis berdasarkan viewMode
  const itemsPerPage = viewMode === "2" ? 2 : 1;

  // Hitung total halaman logis
  const totalPages =
    itemsPerPage > 0 ? Math.ceil(comicData.length / itemsPerPage) : 0;

  // Tentukan halaman logis saat ini (yang ditampilkan ke user)
  // Ini adalah "Halaman 1", "Halaman 2", dst.
  const logicalCurrentPage = Math.floor(currentPage / itemsPerPage) + 1;

  // Hitung batas maksimum untuk index `currentPage`
  // Ini mencegah navigasi "next" melebihi gambar terakhir
  const maxCurrentPageIndex = Math.max(0, comicData.length - itemsPerPage);

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
    }, 2 * 60 * 1000); // Tetap 2 menit untuk testing, atau ubah ke 60 * 1000 untuk 1 menit
    return () => clearTimeout(timer);
  }, [id, createLog, device]);

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

  // ✅ Efek untuk menyesuaikan currentPage saat viewMode berubah
  // Ini memastikan jika user di gambar ganjil (cth: 9) dan pindah ke 2-page,
  // dia akan pindah ke index genap terdekat (cth: 8) agar spread-nya benar.
  useEffect(() => {
    const newItemsPerPage = viewMode === "2" ? 2 : 1;
    // Bulatkan ke bawah ke kelipatan itemsPerPage terdekat
    const newCurrentPage =
      Math.floor(currentPage / newItemsPerPage) * newItemsPerPage;
    if (newCurrentPage !== currentPage) {
      setCurrentPage(newCurrentPage);
    }
    // Dependency [viewMode] saja sudah cukup untuk me-trigger ini
  }, [viewMode, currentPage]);

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

  // ✅ Navigasi (diperbarui)
  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + itemsPerPage, maxCurrentPageIndex));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - itemsPerPage, 0));
  };

  // ✅ visiblePages (diperbarui)
  const visiblePages = comicData.slice(
    currentPage,
    currentPage + itemsPerPage
  );

  // ✅ progressPercentage (diperbarui)
  const progressPercentage =
    totalPages > 0 ? (logicalCurrentPage / totalPages) * 100 : 0;

  // ======================================================================
  // PERUBAHAN LOGIKA HALAMAN SELESAI
  // ======================================================================

  // ✅ Lazy load setup
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
  }, [comicData, currentPage]); // Tetap bergantung pada currentPage (index)

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

        {/* Wrapper baru untuk Komik (85vh) dan Navigasi (15vh) */}
        <div className="flex flex-col min-h-screen pt-[60px]">
          {" "}
          {/* pt-[60px] untuk offset header fixed */}
          {/* Komik View (80% height) */}
          <div className="h-[80vh] flex items-center justify-center overflow-auto">
            <div
              className={`flex ${viewMode === "2" ? "flex-row" : "flex-col"
                } items-center justify-center`}
            >
              {visiblePages.map((page, idx) => {
                // globalIndex kini dihitung dari currentPage (index awal) + idx
                const globalIndex = currentPage + idx;
                const isPriority = globalIndex === 0;

                return (
                  <div
                    key={globalIndex}
                    data-index={globalIndex}
                    className={`relative lazy-image flex items-center justify-center transition-all ${viewMode === "2"
                        ? idx % 2 === 0
                          ? "pr-1"
                          : "pl-1"
                        : "mb-2"
                      }`}
                    style={{
                      maxHeight: "80vh", // Sesuaikan dengan parent
                      height: "80vh", // Sesuaikan dengan parent
                      overflow: "hidden",
                    }}
                  >
                    {visibleImages[globalIndex] ? (
                      <div className="relative w-auto max-h-[80vh] h-full flex items-center justify-center">
                        <Image
                          src={page}
                          alt={`Page ${globalIndex + 1}`}
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="w-auto max-h-[80vh] object-contain rounded-md"
                          priority={isPriority}
                          loading={isPriority ? undefined : "lazy"}
                          style={{
                            transform: `scale(${zoomLevel})`,
                            transition: "transform 0.3s ease",
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex h-[80vh] w-auto items-center justify-center bg-[#111]/30 text-white rounded-md animate-pulse">
                        Loading image...
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* ✅ Navigasi bawah (10% height) */}
          <div className="h-[10vh] flex flex-wrap items-center justify-center gap-4 bg-white/60 px-4 py-2 shadow-lg backdrop-blur-md w-full">
            {/* Panah kiri */}
            <button
              onClick={handlePrev}
              className="text-gray-700 transition hover:text-blue-600 disabled:text-gray-300"
              aria-label="Previous"
              disabled={currentPage === 0} // Nonaktifkan jika di halaman pertama
            >
              ◀
            </button>
            {/* Progress (DIPERBARUI) */}
            <p className="block text-sm font-semibold text-gray-700">
              {/* Tampilkan halaman logis dan total halaman logis */}
              {logicalCurrentPage}/{totalPages}
            </p>
            <div className="relative h-2 w-[160px] overflow-hidden rounded-full bg-[#013544] md:w-[300px]">
              <div
                className="absolute top-0 left-0 h-full bg-[#0395BC] transition-all duration-300"
                style={{ width: `${progressPercentage}%` }} // Persentase sudah diperbarui
              ></div>
            </div>
            {/* Panah kanan (DIPERBARUI) */}
            <button
              onClick={handleNext}
              className="text-gray-700 transition hover:text-blue-600 disabled:text-gray-300"
              aria-label="Next"
              disabled={logicalCurrentPage === totalPages} // Nonaktifkan jika di halaman terakhir
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
                <label className="text-sm font-medium text-gray-700">
                  Zoom
                </label>
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
      </div>

      {/* Komponen Comment */}
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