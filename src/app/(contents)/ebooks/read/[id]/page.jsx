"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";

/*[--- UTILS IMPORT ---]*/
import { formatDateTime } from "@/lib/timeFormatter";

/*[--- HOOKS IMPORT ---]*/
import { BACKEND_URL } from "@/lib/constants/backendUrl";
import { useGetEpisodeEbookByIdQuery } from "@/hooks/api/contentSliceAPI";
import { useGetCommentByEpisodeEbookQuery } from "@/hooks/api/commentSliceAPI"

/*[--- COMPONENT IMPORT ---]*/
import BackButton from "@/components/BackButton/page";
import EpubReader from "@/components/EbookReader/page";
import DetailPageLoadingSkeleton from "@/components/MainDetailProduct/Loading/ProductReadLoading"
import CommentComponent from "@/components/Comment/page";
import FontSizeController from "./Component/FontSizeController";

/*[--- ASSETS IMPORT ---]*/
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";
import { Icon } from "@iconify/react";
import AudioEbookButton from "@/components/AudioEbookButton/page";
import EpisodeController from "@/components/EpisodeController/EpisodeController";

export default function ReadEbookPage({ params }) {
  const { id } = React.use(params);
  const epubReaderRef = useRef(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [ebookTitle, setEbookTitle] = useState("");
  const [ebookId, setEbookId] = useState("");
  const [title, setTitle] = useState("");
  const [creatorNotes, setCreatorNotes] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [bannerStartEpisodeUrl, setBannerStartEpisodeUrl] = useState(null);
  const [bannerEndEpisodeUrl, setBannerEndEpisodeUrl] = useState(null);
  const [ebookUrl, setEbookUrl] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const { data, isLoading, error } = useGetEpisodeEbookByIdQuery(id);
  const { data: commentData, isLoading: isLoadingGetComment } = useGetCommentByEpisodeEbookQuery(id);
  const [createLog] = useCreateLogMutation();
  const [fontSizeFactor, setFontSizeFactor] = useState(1.0);
  const [fontSizeModalOpen, setFontSizeModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioEbookUrl, setAudioEbookUrl] = useState(null);
  const episodeEbookData = data?.data?.data || {};
  const episodeEbookNextId = data?.data?.nextEpisode?.id || null;
  const episodeEbookPrevId = data?.data?.previousEpisode?.id || null;
  const ebookData = episodeEbookData.ebooks || {}
  let hasUpdatedViews = false;

  // Detect device type based on window width
  const getDeviceType = () => {
    if (typeof window === 'undefined') return 'DESKTOP';
    const width = window.innerWidth;
    if (width < 768) return 'MOBILE';
    if (width < 1024) return 'TABLET';
    return 'DESKTOP';
  };

  useEffect(() => {
    if (!id) return;

    const timer = setTimeout(async () => {
      try {
        await createLog({
          contentId: id,
          logType: "WATCH_CONTENT", // misalnya tipe konten
          contentType: "EPISODE_EBOOK", // misalnya log aksi
          deviceType: getDeviceType(),
        }).unwrap();

        console.log("✅ Log berhasil dibuat setelah 2 menit");
      } catch (err) {
        console.error("❌ Gagal membuat log:", err);
      }
    }, 2 * 60 * 1000);

    return () => clearTimeout(timer); // clear kalau user keluar sebelum 1 menit
  }, [id, createLog]);

  const getData = async () => {
    try {
      if (!hasUpdatedViews) {
        await axios.patch(
          `${BACKEND_URL}/episode/${id}/views`,
        );
        hasUpdatedViews = true;
      }

      setTitle(episodeEbookData.title);
      setEbookTitle(ebookData.title);
      setEbookId(ebookData.id);
      setCreatorNotes(episodeEbookData.notedEpisode);
      setEbookUrl(episodeEbookData.ebookUrl);
      setBannerStartEpisodeUrl(episodeEbookData.bannerStartEpisodeUrl);
      setBannerEndEpisodeUrl(episodeEbookData.bannerEndEpisodeUrl);
      setUpdatedAt(formatDateTime(episodeEbookData.updatedAt, "short"));
      setAudioEbookUrl(episodeEbookData.audioUrl);

      const existing = JSON.parse(localStorage.getItem("last_seen_content")) || [];
      const isAlreadyExist = existing.find(item => item.id === ebookData.id);
      let updated = existing;
      if (!isAlreadyExist) {
        const newContent = {
          ...episodeEbookData.ebooks,
          type: "ebook",
        };
        updated = [newContent, ...existing].slice(0, 10);
      }
      localStorage.setItem("last_seen_content", JSON.stringify(updated));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // Fungsi untuk mengubah ukuran font
  const handleFontSizeChange = (delta) => {
    if (epubReaderRef.current) {
      epubReaderRef.current.changeFontSize(delta);
    }
  };

  useEffect(() => {
    if (data && !isLoading) {
      getData();
    }

    if (error && error.status === 403) {
      window.location.href = "/checkout/purchase/ebooks/x/" + id;
    }
  }, [ebookData, data, isLoading]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const darkMode = localStorage.getItem("theme") === "dark";
      setIsDark(darkMode);
    }
  }, []);

  useEffect(() => {
    setShowSkeleton(isLoading);
  }, [isLoading]);

  if (showSkeleton) {
    return (
      <DetailPageLoadingSkeleton />
    );
  }

  return (
    <div
      className={`flex flex-col overflow-x-hidden ${isDark ? "bg-[#1A1A1A]" : "bg-[#fff]"}`}
    >
      <main className="flex flex-col">
        <FontSizeController
          isOpen={fontSizeModalOpen}
          fontSizeFactor={fontSizeFactor}
          onFontSizeChange={handleFontSizeChange}
          containerClassName="fixed right-20 top-12"
          isDarkMode={isDark}
        />
        <div
          className={`${isDark ? "text-white" : "text-[#222222]"} fixed z-10 mt-0 w-full flex-row items-center justify-start gap-2 px-4 md:px-20 py-2 text-2xl font-semibold backdrop-blur flex`}
        >
          <BackButton isDark={isDark} />
          <h4
            className={`zeinFont [display:-webkit-box] w-full overflow-hidden text-center text-xl font-extrabold text-ellipsis [-webkit-box-orient:vertical] [-webkit-line-clamp:1] md:text-2xl`}
          >
            <Link
              href={`/ebooks/detail/${ebookId}`}
              className="hover:underline"
            >
              {ebookTitle || "Loading..."}
            </Link>
          </h4>
          <div className="hidden md:flex flex-row items-center justify-end gap-2 relative">
            <button className="w-8 h-8" onClick={() => setFontSizeModalOpen(!fontSizeModalOpen)}>
              <Icon icon="material-symbols:text-fields-rounded" className="text-2xl w-full h-full" />
            </button>
            <Link href={'/report/episode_ebook/' + id}>
              <Icon icon="solar:flag-2-linear" className="w-8 h-8" />
            </Link>
            {/* toggle dark and light */}
            <label className="inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={isDark}
                onChange={toggleTheme}
                className="peer sr-only"
              />
              <div
                className={`relative h-7 w-14 rounded-full transition-colors duration-300 ${isDark
                  ? "bg-indigo-900 peer-focus:ring-2 peer-focus:ring-violet-800"
                  : "bg-amber-200 peer-focus:ring-2 peer-focus:ring-amber-400"
                  } `}
              >
                <div
                  className={`absolute top-1/2 left-[2px] flex h-5 w-5 -translate-y-1/2 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ${isDark ? "translate-x-7" : "translate-x-1"}`}
                >
                  {isDark ? (
                    <svg
                      className="h-4 w-4 text-violet-700"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  ) : (
                    <svg
                      className="h-4 w-4 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </label>
          </div>
          <Icon
            icon={'solar:menu-dots-bold-duotone'}
            className={`w-10 h-10 z-10 text-3xl md:hidden ${isDark ? "text-white" : "text-black"}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="fixed top-2 right-4 z-20 md:hidden">
            <div
              className={`flex flex-col gap-3 rounded-2xl backdrop-blur-sm p-4 shadow-2xl border-1 min-w-[200px] ${isDark ? 'bg-black/20 text-white border-gray-600' : 'bg-white/20 text-black border-gray-400'} `}
            >
              {/* Dot */}
              <Icon
                icon={'solar:close-circle-bold-duotone'}
                className={`h-8 w-8 text-3xl self-end md:hidden ${isDark ? "text-white" : "text-black"}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              />
              {/* Font Size Controller */}
              <div className="flex flex-col gap-2 pb-3 border-b border-white/10">
                <p className="text-xs font-semibold">Ukuran Font</p>
                <div className="flex flex-row items-center justify-between gap-2">
                  <button
                    onClick={() => handleFontSizeChange(-0.1)}
                    className="hover:opacity-70 transition-opacity p-2"
                    aria-label="Decrease font size"
                  >
                    <Icon icon={'solar:rounded-magnifer-zoom-out-outline'} className="w-6 h-6" />
                  </button>
                  <div className="bg-[#515151] px-4 py-2 rounded-full text-sm font-medium text-white">
                    <p>{Math.round(fontSizeFactor * 16)}px</p>
                  </div>
                  <button
                    onClick={() => handleFontSizeChange(0.1)}
                    className="hover:opacity-70 transition-opacity p-2"
                    aria-label="Increase font size"
                  >
                    <Icon icon={'solar:rounded-magnifer-zoom-in-outline'} className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <div className="flex flex-row items-center justify-between pb-3 border-b border-white/10">
                <p className="text-xs font-semibold">Mode {isDark ? "Gelap" : "Terang"}</p>
                <label className="inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={isDark}
                    onChange={toggleTheme}
                    className="peer sr-only"
                  />
                  <div
                    className={`relative h-7 w-14 rounded-full transition-colors duration-300 ${isDark
                      ? "bg-indigo-900 peer-focus:ring-2 peer-focus:ring-violet-800"
                      : "bg-amber-200 peer-focus:ring-2 peer-focus:ring-amber-400"
                      }`}
                  >
                    <div
                      className={`absolute top-1/2 left-[2px] flex h-5 w-5 -translate-y-1/2 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ${isDark ? "translate-x-7" : "translate-x-1"
                        }`}
                    >
                      {isDark ? (
                        <svg
                          className="h-4 w-4 text-violet-700"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                      ) : (
                        <svg
                          className="h-4 w-4 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </label>
              </div>

              {/* Report Button */}
              <Link
                href={`/report/episode_ebook/${id}`}
                className={`flex flex-row items-center gap-2 hover:opacity-70 transition-opacity ${isDark ? "text-white" : "text-black"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon icon={'solar:flag-2-linear'} className="w-6 h-6" />
                <p className="text-sm font-medium">Laporkan Konten</p>
              </Link>
            </div>
          </div>
        )}

        {/* Overlay to close mobile menu */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-10 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        {/* Bagian Header */}
        <section className="relative mt-16 w-full">
          {/* banner */}
          <div className="h-64 w-full overflow-hidden">
            {bannerStartEpisodeUrl && (
              <Image
                priority
                src={bannerStartEpisodeUrl}
                fill
                alt="poster-ebook-laut-bercerita"
                className="h-full w-full object-cover object-center"
              />
            )}
            <div
              className={`absolute top-0 left-0 z-0 h-full w-full bg-gradient-to-b`}
            ></div>
          </div>
        </section>
        {/* Isi Ebook */}
        <div
          className={`relative flex w-screen flex-col py-5 ${isDark ? "text-white" : "text-[#222222]"}`}
        >
          {/* Judul Chapter */}
          <h1 className="w-full text-center text-2xl font-bold lg:text-3xl">
            {title}
          </h1>

          {/* Cerita */}
          <div className="flex flex-col justify-center">
            {/* Update Message */}
            <p
              className={`mt-1 w-full text-center text-sm ${isDark ? "text-white/70" : "text-[#222222]/70"} italic`}
            >
              Terakhir Diperbarui: {updatedAt}
            </p>

            {/* Isi Buku */}
            <div
              className={`mt-8 mb-10 flex h-fit flex-col ${isDark ? "text-white" : "text-[#222222]"}`}
            >
              {ebookUrl && (
                <EpubReader
                  ref={epubReaderRef}
                  epubUrl={ebookUrl}
                  isDark={isDark}
                  initialFontSizeFactor={fontSizeFactor}
                  onFontSizeChange={setFontSizeFactor}
                />
              )}
            </div>
          </div>
        </div>
        {/* Banner 2 */}
        <div className="relative h-64 w-full overflow-hidden">
          {bannerEndEpisodeUrl && (
            <Image
              src={bannerEndEpisodeUrl}
              fill
              alt="poster-ebook-laut-bercerita"
              className="h-full w-full object-cover object-center"
            />
          )}
          <div
            className={`absolute top-0 left-0 z-0 h-full w-full ${isDark
              ? "bg-[linear-gradient(to_top,#FFFFFF00,#FFFFFF00,#737373A1,#595959BF,#3F3F3FDE,#303030ED,#222222FF)]"
              : "bg-[linear-gradient(to_top,#00000000,#00000000,#E5E5E5A1,#E0E0E0BF,#D4D4D4DE,#CCCCCCED,#FFFFFF)]"
              }`}
          />
        </div>
        {/* Catatan Kreator */}
        <section
          className={`relative flex w-screen flex-col px-4 pt-5 ${isDark ? "text-white" : "text-[#222222]"} md:mt-4 md:px-15`}
        >
          <div
            className={`w-full rounded-xl p-4 ${isDark ? "bg-[#2f2f2f] text-white" : "bg-[#DEDEDE] text-[#222222]"}`}
          >
            <h4
              className={`${isDark ? "text-white/70" : "text-black/60"} font-bold`}
            >
              Catatan Kreator
            </h4>
            <p className={`${isDark ? "text-white" : "text-[#222222]"}`}>
              {creatorNotes}
            </p>
          </div>
        </section>

        {/* Episode Controller */}
        <div className="px-10 md:px-15 mt-5">
          <EpisodeController
            prevEpisodeUrl={episodeEbookPrevId ? `/ebooks/read/${episodeEbookPrevId}` : null}
            nextEpisodeUrl={episodeEbookNextId ? `/ebooks/read/${episodeEbookNextId}` : null}
            isDark={isDark}
          />
        </div>

        {/* Comment Baru */}
        <div className="px-5 md:px-11">
          <CommentComponent
            commentData={commentData?.data?.data || []}
            isLoadingGetComment={isLoadingGetComment}
            contentType={"EBOOK"}
            episodeId={id}
            isDark={isDark}
          />
        </div>

        {/* Audio Book */}
        {audioEbookUrl && (
          <AudioEbookButton audioUrl={audioEbookUrl} isDark={isDark} />
        )}
      </main>
    </div>
  );
}

ReadEbookPage.propTypes = {
  params: PropTypes.string,
}