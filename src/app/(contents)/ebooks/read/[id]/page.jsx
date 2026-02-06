"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import PropTypes from "prop-types";

/*[--- HOOKS IMPORT ---]*/
import { BACKEND_URL } from "@/lib/constants/backendUrl";
import { useGetEpisodeEbookByIdQuery } from "@/hooks/api/contentSliceAPI";
import { useGetCommentByEpisodeEbookQuery } from "@/hooks/api/commentSliceAPI"

/*[--- COMPONENT IMPORT ---]*/
import BackButton from "@/components/BackButton/page";
import EpubReader from "@/components/EbookReader/page";
import DetailPageLoadingSkeleton from "@/components/MainDetailProduct/Loading/ProductReadLoading"
import DefaultProgressBar from "@/components/ProgressBar/DefaultProgressBar";

/*[--- ASSETS IMPORT ---]*/
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";
import { Icon } from "@iconify/react";
import AudioEbookButton from "@/components/AudioEbookButton/page";
import EbookModal from "@/components/Modal/EbookModal";
import CommentModalEbook from "@/components/CommentModalEbook/CommentModalEbook";
import iconCommentComic from "@@/icons/icon-comment-comic.svg";

export default function ReadEbookPage({ params }) {
  const { id } = params;
  const epubReaderRef = useRef(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [ebookTitle, setEbookTitle] = useState("");
  const [ebookId, setEbookId] = useState("");
  const [creatorNotes, setCreatorNotes] = useState("");
  const [ebookUrl, setEbookUrl] = useState(null);
  const [colorTheme, setColorTheme] = useState("dark");
  const [lineHeight, setLineHeight] = useState("normal");
  const [textAlign, setTextAlign] = useState("justify");
  const [fontFamily, setFontFamily] = useState("inter");
  const [readingMode, setReadingMode] = useState("page");
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [cfiString, setCfiString] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [baseFontSize, setBaseFontSize] = useState(14);
  const { data, isLoading, error, refetch } = useGetEpisodeEbookByIdQuery(id);
  const { data: commentData, isLoading: isLoadingGetComment } = useGetCommentByEpisodeEbookQuery(id);
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [createLog] = useCreateLogMutation();
  const [fontSizeFactor, setFontSizeFactor] = useState(1.0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioEbookUrl, setAudioEbookUrl] = useState(null);
  const episodeEbookData = data?.data?.data || {};
  const episodeEbookNextId = data?.data?.nextEpisode?.id || null;
  const episodeEbookPrevId = data?.data?.previousEpisode?.id || null;
  const ebookData = episodeEbookData.ebooks || {}
  const [isModalTutorialOpen, setIsModalTutorialOpen] = useState(false);
  const hasUpdatedViewsRef = useRef(false);

  // Detect device type based on window width
  const getDeviceType = () => {
    if (typeof window === 'undefined') return 'DESKTOP';
    const width = window.innerWidth;
    if (width < 768) return 'MOBILE';
    if (width < 1024) return 'TABLET';
    return 'DESKTOP';
  };

  const getBaseFontSize = () => {
    if (typeof window === "undefined") return 14;
    const width = window.innerWidth;
    if (width < 768) return 12; // mobile
    if (width < 1024) return 13; // tablet
    return 14; // laptop
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
      if (!hasUpdatedViewsRef.current) {
        await axios.patch(
          `${BACKEND_URL}/episode/${id}/views`,
        );
        hasUpdatedViewsRef.current = true;
      }
      setEbookTitle(ebookData.title);
      setEbookId(ebookData.id);
      setCreatorNotes(episodeEbookData.notedEpisode);
      setEbookUrl(episodeEbookData.ebookUrl);
      setAudioEbookUrl(episodeEbookData.audioUrl);

      // Buka modal tutorial jika belum ada progress membaca
      if (episodeEbookData?.readProgress == null) {
        setIsModalTutorialOpen(true);
      }

      // Inisialisasi currentPage dari readProgress (zero-based -> 1-based)
      const rpPage = episodeEbookData?.readProgress?.page;
      if (typeof rpPage === "number" && rpPage >= 0) {
        setCurrentPage(rpPage + 1);
        setCfiString(episodeEbookData.readProgress.cfiString || null);
      }

      let existing = [];
      try {
        const raw = localStorage.getItem("last_seen_content");
        existing = raw ? JSON.parse(raw) : [];
      } catch {
        existing = [];
      }
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

  // Fungsi untuk mengubah ukuran font
  const handleFontSizeChange = (delta) => {
    if (epubReaderRef.current) {
      epubReaderRef.current.changeFontSize(delta);
    }
  };

  // Handler untuk mengubah tema (Memoized - tidak re-create setiap render)
  const handleThemeChange = useCallback((theme) => {
    setColorTheme(theme);
  }, []);

  // Handler untuk mengubah line height (Memoized - tidak re-create setiap render)
  const handleLineHeightChange = useCallback((height) => {
    setLineHeight(height);
  }, []);

  // Handler untuk mengubah alignment (Memoized - tidak re-create setiap render)
  const handleAlignmentChange = useCallback((align) => {
    setTextAlign(align);
  }, []);

  // Handler untuk mengubah font family (Memoized - tidak re-create setiap render)
  const handleFontFamilyChange = useCallback((family) => {
    setFontFamily(family);
  }, []);

  // Handler untuk mengubah reading mode (Memoized - tidak re-create setiap render)
  const handleReadingModeChange = useCallback((mode) => {
    setReadingMode(mode);
  }, []);

  // Tambahkan ref di bagian atas ReadEbookPage
  const lastCfiRef = useRef(null);

  const handleProgressChange = useCallback((progressData) => {
    setProgress(progressData.progress);
    setCurrentPage(progressData.currentPage);
    setTotalPages(progressData.totalPages);

    // SIMPAN CFI TERBARU DI PARENT
    if (progressData.cfi) {
      lastCfiRef.current = progressData.cfi;
    }
  }, []);

  // Fungsi helper untuk mendapatkan kelas button aktif
  const getActiveButtonClass = (isActive) => {
    return isActive ? (colorTheme == 'dark' ? "bg-[#515151]" : "bg-[#333333] text-white") : "bg-[#626262]/50";
  };

  useEffect(() => {
    if (data && !isLoading) {
      getData();
    }

    if (error && error.status === 403) {
      window.location.href = "/checkout/purchase/ebooks/x/" + id;
    }
  }, [data, isLoading, error, id]);

  // Refetch episode data when reading mode changes to refresh progress/CFI
  useEffect(() => {
    if (!id) return;
    try {
      refetch?.();
    } catch {
      console.error("Gagal memuat ulang data episode ebook.");
    }
  }, [readingMode, id, refetch]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateBaseFontSize = () => setBaseFontSize(getBaseFontSize());
    updateBaseFontSize();
    window.addEventListener("resize", updateBaseFontSize);
    return () => window.removeEventListener("resize", updateBaseFontSize);
  }, []);

  useEffect(() => {
    setShowSkeleton(isLoading);
  }, [isLoading]);

  // Global protection: block copy, right-click, and common inspect shortcuts
  useEffect(() => {
    const preventDefault = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const blockKeys = (e) => {
      const key = (e.key || "").toUpperCase();
      const ctrl = e.ctrlKey || e.metaKey; // meta for mac
      const shift = e.shiftKey;

      const blockedCombos = (
        key === "F12" ||
        (ctrl && shift && ["I", "J", "C"].includes(key)) || // DevTools shortcuts
        (ctrl && ["U", "S", "P", "C", "A"].includes(key)) // View source/Save/Print/Copy/Select All
      );

      if (blockedCombos) {
        preventDefault(e);
      }
    };

    document.addEventListener("contextmenu", preventDefault, true);
    document.addEventListener("copy", preventDefault, true);
    document.addEventListener("cut", preventDefault, true);
    document.addEventListener("paste", preventDefault, true);
    document.addEventListener("keydown", blockKeys, true);

    return () => {
      document.removeEventListener("contextmenu", preventDefault, true);
      document.removeEventListener("copy", preventDefault, true);
      document.removeEventListener("cut", preventDefault, true);
      document.removeEventListener("paste", preventDefault, true);
      document.removeEventListener("keydown", blockKeys, true);
    };
  }, []);

  if (showSkeleton) {
    return (
      <DetailPageLoadingSkeleton />
    );
  }

  return (
    <div
      className={`flex flex-col overflow-hidden select-none ${colorTheme === "dark" ? "bg-[#121212]" : colorTheme == 'sepia' ? "bg-[#F4ECD8]" : "bg-[#FFFFFF]"}`}
      onCopy={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onCut={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onPaste={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      <main className="flex flex-col">
        <div
          className={`${colorTheme == 'dark' ? "text-white" : "text-[#222222]"} fixed z-40 mt-0 w-full flex-row items-center justify-start gap-2 px-4 md:px-20 py-2 text-2xl font-semibold backdrop-blur flex`}
        >
          <BackButton isDark={colorTheme === "dark"} />
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
          <Icon
            icon={'solar:menu-dots-bold-duotone'}
            className={`w-10 h-10 z-10 text-3xl ${colorTheme === "dark" ? "text-white" : "text-black"}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="fixed top-2 right-4 z-50">
            <div
              className={`flex flex-col gap-1 md:gap-3 rounded-2xl backdrop-blur-sm p-6 shadow-2xl border-1 min-w-[200px] ${colorTheme === "dark" ? 'bg-[#222222] text-white border-gray-600' : 'bg-white/20 text-black border-gray-400'} `}
            >
              {/* Dot */}
              <Icon
                icon={'solar:close-circle-bold-duotone'}
                className={`h-8 w-8 text-3xl self-end ${colorTheme === "dark" ? "text-white" : "text-black"}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              />

              {/* Font Size Controller */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-2">
                  <Icon
                    icon={'solar:text-bold'}
                    className="w-5 h-5"
                  />
                  <p className="text-sm montserratFont font-semibold">Ukuran Font</p>
                </div>
                <div className="flex flex-row items-center justify-between gap-2">
                  <button
                    onClick={() => handleFontSizeChange(-0.1)}
                    className={`${colorTheme == 'dark' ? "bg-[#333333]" : "bg-[#878787]"} rounded-lg hover:opacity-70 transition-opacity p-3`}
                    aria-label="Decrease font size"
                  >
                    <Icon icon={'mynaui:minus'} className="w-6 h-6" />
                  </button>
                  <div className={`${colorTheme == 'dark' ? "bg-[#333333]" : "bg-[#878787]"} flex flex-row gap-2 items-center montserratFont px-8 py-3 rounded-lg font-medium `}>
                    <Icon
                      icon={'solar:text-bold'}
                      className="w-5 h-5"
                    />
                    <p>{Math.round(baseFontSize * fontSizeFactor)}px</p>
                  </div>
                  <button
                    onClick={() => handleFontSizeChange(0.1)}
                    className={`${colorTheme == 'dark' ? "bg-[#333333]" : "bg-[#878787]"} rounded-lg hover:opacity-70 transition-opacity p-3`}
                    aria-label="Increase font size"
                  >
                    <Icon icon={'mynaui:plus'} className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Theme Toggle */}
              <div className="flex flex-col gap-4 ">
                <div className="flex flex-row gap-2">
                  <Icon
                    icon={'solar:sun-bold'}
                    className="w-5 h-5"
                  />
                  <p className="text-sm montserratFont font-semibold">Tema</p>
                </div>
                <div className="grid grid-cols-3 items-center justify-between gap-2 montserratFont text-sm">
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`${getActiveButtonClass(colorTheme === 'dark')} rounded-lg hover:opacity-70 transition-opacity py-2`}
                    aria-label="Dark theme"
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => handleThemeChange('sepia')}
                    className={`${getActiveButtonClass(colorTheme === 'sepia')} rounded-lg hover:opacity-70 transition-opacity py-2`}
                    aria-label="Sepia theme"
                  >
                    Sepia
                  </button>
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`${getActiveButtonClass(colorTheme === 'light')} rounded-lg hover:opacity-70 transition-opacity py-2`}
                    aria-label="Light theme"
                  >
                    Light
                  </button>
                </div>
              </div>

              {/* Line Height Toggle */}
              <div className="flex flex-col gap-4 ">
                <div className="flex flex-row gap-2">
                  <Icon
                    icon={'solar:list-outline'}
                    className="w-5 h-5"
                  />
                  <p className="text-sm montserratFont font-semibold">Line Height</p>
                </div>
                <div className="grid grid-cols-3 items-center justify-between gap-2 montserratFont text-sm">
                  <button
                    onClick={() => handleLineHeightChange('compact')}
                    className={`${getActiveButtonClass(lineHeight === 'compact')} rounded-lg hover:opacity-70 transition-opacity py-2`}
                    aria-label="Compact line height"
                  >
                    Compact
                  </button>
                  <button
                    onClick={() => handleLineHeightChange('normal')}
                    className={`${getActiveButtonClass(lineHeight === 'normal')} rounded-lg hover:opacity-70 transition-opacity py-2`}
                    aria-label="Normal line height"
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => handleLineHeightChange('relaxed')}
                    className={`${getActiveButtonClass(lineHeight === 'relaxed')} rounded-lg hover:opacity-70 transition-opacity py-2`}
                    aria-label="Relaxed line height"
                  >
                    Relaxed
                  </button>
                </div>
              </div>

              {/* Alignment Toggle */}
              <div className="flex flex-col gap-4 ">
                <div className="flex flex-row gap-2">
                  <Icon
                    icon={'solar:hamburger-menu-outline'}
                    className="w-5 h-5"
                  />
                  <p className="text-sm montserratFont font-semibold">Alignment</p>
                </div>
                <div className="grid grid-cols-2 items-center justify-between gap-2 montserratFont text-sm">
                  <button
                    onClick={() => handleAlignmentChange('left')}
                    className={`${getActiveButtonClass(textAlign === 'left')} rounded-lg hover:opacity-70 transition-opacity py-2 flex items-center justify-center gap-2`}
                    aria-label="Left alignment"
                  >
                    <Icon
                      icon={'solar:list-outline'}
                      className="w-5 h-5"
                    />
                    Left
                  </button>
                  <button
                    onClick={() => handleAlignmentChange('justify')}
                    className={`${getActiveButtonClass(textAlign === 'justify')} rounded-lg hover:opacity-70 transition-opacity py-2 flex items-center justify-center gap-2`}
                    aria-label="Justified alignment"
                  >
                    <Icon
                      icon={'solar:hamburger-menu-outline'}
                      className="w-5 h-5"
                    />
                    Justified
                  </button>
                </div>
              </div>

              {/* Tipe Font */}
              <div className="flex flex-col gap-4 ">
                <div className="flex flex-row gap-2">
                  <Icon
                    icon={'solar:text-bold'}
                    className="w-5 h-5"
                  />
                  <p className="text-sm montserratFont font-semibold">Tipe Font</p>
                </div>
                <div className="grid grid-cols-2 items-center justify-between gap-2 montserratFont text-sm">
                  <button
                    onClick={() => handleFontFamilyChange('inter')}
                    className={`${getActiveButtonClass(fontFamily === 'inter')} rounded-lg interFont hover:opacity-70 transition-opacity py-2`}
                    aria-label="Inter font"
                  >
                    Teks 1
                  </button>
                  <button
                    onClick={() => handleFontFamilyChange('merriweather')}
                    className={`${getActiveButtonClass(fontFamily === 'merriweather')} rounded-lg merriweatherFont hover:opacity-70 transition-opacity py-2`}
                    aria-label="Merriweather font"
                  >
                    Teks 2
                  </button>
                  <button
                    onClick={() => handleFontFamilyChange('montserrat')}
                    className={`${getActiveButtonClass(fontFamily === 'montserrat')} rounded-lg montserratFont hover:opacity-70 transition-opacity py-2`}
                    aria-label="Montserrat font"
                  >
                    Teks 3
                  </button>
                  <button
                    onClick={() => handleFontFamilyChange('openDyslexic')}
                    className={`${getActiveButtonClass(fontFamily === 'openDyslexic')} openDyslexicFont rounded-lg hover:opacity-70 transition-opacity py-2 openDyslexicFont`}
                    aria-label="Open Dyslexic font"
                  >
                    Teks 4
                  </button>
                </div>
              </div>

              {/* Mode Baca */}
              <div className="flex flex-col gap-4 ">
                <div className="flex flex-row gap-2">
                  <Icon
                    icon={'solar:notebook-minimalistic-linear'}
                    className="w-5 h-5"
                  />
                  <p className="text-sm montserratFont font-semibold">Mode Baca</p>
                </div>
                <div className="grid grid-cols-2 items-center justify-between gap-2 montserratFont text-sm">
                  <button
                    onClick={() => handleReadingModeChange('scroll')}
                    className={`${getActiveButtonClass(readingMode === 'scroll')} rounded-lg hover:opacity-70 transition-opacity py-2 flex items-center justify-center gap-2`}
                    aria-label="Scroll reading mode"
                  >
                    <Icon
                      icon={'lucide:scroll'}
                      className="w-5 h-5"
                    />
                    Scroll
                  </button>
                  <button
                    onClick={() => handleReadingModeChange('page')}
                    className={`${getActiveButtonClass(readingMode === 'page')} rounded-lg hover:opacity-70 transition-opacity py-2 flex items-center justify-center gap-2`}
                    aria-label="Page reading mode"
                  >
                    <Icon
                      icon={'solar:notebook-minimalistic-linear'}
                      className="w-5 h-5"
                    />
                    Page
                  </button>
                </div>
              </div>

              {/* Report Button */}
              <Link
                href={`/report/episode_ebook/${id}`}
                className={`flex flex-row items-center gap-2 hover:opacity-70 transition-opacity ${colorTheme === "dark" ? "text-white" : "text-black"}`}
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

        {/* Pembungkus Utama EpubReader */}
        <div className={`relative mt-16 shadow-md shadow-black flex w-full max-w-[210mm] mx-auto flex-col ${colorTheme === "dark" ? "text-white" : "text-[#222222]"}`}>
          <div className="flex flex-col justify-center">
            {/* Pembungkus EpubReader */}
            <div
              className={`flex h-fit w-full flex-col select-none touch-pan-y relative z-20 ${colorTheme === "dark" ? "text-white" : "text-[#222222]"}`}
              style={{ isolation: 'isolate' }}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            >
              {ebookUrl && (
                <EpubReader
                  ref={epubReaderRef}
                  epubUrl={ebookUrl}
                  isDark={colorTheme === "dark"}
                  colorTheme={colorTheme}
                  lineHeight={lineHeight}
                  textAlign={textAlign}
                  fontFamily={fontFamily}
                  initialFontSizeFactor={fontSizeFactor}
                  onFontSizeChange={setFontSizeFactor}
                  onBaseFontSizeChange={setBaseFontSize}
                  readingMode={readingMode}
                  onProgressChange={handleProgressChange}
                  episodeEbookId={id}
                  currentPage={currentPage}
                  cfiPosition={cfiString}
                />
              )}
            </div>
          </div>
        </div>

        {/* Catatan Kreator */}
        <section
          className={`relative flex w-screen flex-col px-4 pb-40 pt-5 ${colorTheme === "dark" ? "text-white" : "text-[#222222]"} md:mt-4 md:px-15`}
        >
          <div
            className={`w-full rounded-xl p-4 ${colorTheme === "dark" ? "bg-[#2f2f2f] text-white" : "bg-[#DEDEDE] text-[#222222]"}`}
          >
            <h4
              className={`${colorTheme === "dark" ? "text-white/70" : "text-black/60"} font-bold`}
            >
              Catatan Kreator
            </h4>
            <p className={`${colorTheme === "dark" ? "text-white" : "text-[#222222]"}`}>
              {creatorNotes}
            </p>
          </div>
        </section>

        {/* Audio Book */}
        {audioEbookUrl && (
          <AudioEbookButton audioUrl={audioEbookUrl} isDark={colorTheme === "dark"} />
        )}

        <div>
          {readingMode === 'page' && (
            <div className="fixed inset-0 w-screen h-screen flex z-30 pointer-events-none">
              {/* Left Half - Previous Page */}
              <div
                className="w-1/2 h-full pointer-events-auto cursor-pointer"
                onClick={() => epubReaderRef.current?.goToPreviousPage()}
              />
              {/* Right Half - Next Page */}
              <div
                className="w-1/2 h-full pointer-events-auto cursor-pointer"
                onClick={() => epubReaderRef.current?.goToNextPage()}
              />
            </div>
          )}

          {/* Navigation Bar with Progress */}
          <div className="fixed bg-[#393939] bottom-0 left-0 right-0 flex flex-col items-center justify-center gap-4 z-40 pointer-events-auto">
            <div className="w-full">
              <DefaultProgressBar
                progress={progress}
                barColor="#FFFFFF"
              />
            </div>
            <div className="flex flex-col px-2 md:px-16 w-full gap-1">
              <div className="flex justify-between items-center text-white font-medium mb-2">
                <div className="w-6 h-6 opacity-0" aria-hidden="true" />
                <p className="text-sm md:text-base">Halaman {currentPage} dari {totalPages}</p>
                <img
                  src={iconCommentComic.src}
                  className={`h-6 w-6 md:h-8 md:w-8 cursor-pointer hover:opacity-70 transition-opacity`}
                  onClick={() => setIsCommentVisible(true)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 md:gap-4 w-full pb-2">
                <Link
                  href={episodeEbookPrevId ? `/ebooks/read/${episodeEbookPrevId}` : '#'}
                  className={`flex rounded-lg items-center justify-center w-full h-10 md:h-12 bg-black/50 transition-all text-white shadow-xl backdrop-blur-sm ${episodeEbookPrevId ? 'hover:bg-black/80 cursor-pointer' : 'opacity-50 cursor-not-allowed pointer-events-none'
                    }`}
                  aria-disabled={!episodeEbookPrevId}
                  tabIndex={episodeEbookPrevId ? 0 : -1}
                >
                  <Icon
                    icon={'solar:alt-arrow-left-linear'}
                    className="h-5 w-5 md:h-6 md:w-6"
                  />
                  <p className="text-sm md:text-base">Bagian Sebelumnya</p>
                </Link>
                <Link
                  href={episodeEbookNextId ? `/ebooks/read/${episodeEbookNextId}` : '#'}
                  className={`flex rounded-lg items-center justify-center w-full h-10 md:h-12 bg-black/50 transition-all text-white shadow-xl backdrop-blur-sm ${episodeEbookNextId ? 'hover:bg-black/80 cursor-pointer' : 'opacity-50 cursor-not-allowed pointer-events-none'
                    }`}
                  aria-disabled={!episodeEbookNextId}
                  tabIndex={episodeEbookNextId ? 0 : -1}
                >
                  <p className="text-sm md:text-base">Bagian Selanjutnya</p>
                  <Icon
                    icon={'solar:alt-arrow-right-linear'}
                    className="h-5 w-5 md:h-6 md:w-6"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <EbookModal isOpen={isModalTutorialOpen} onClose={() => setIsModalTutorialOpen(false)}>
          <div className="flex flex-col px-4 md:px-8 gap-4 w-[290px] md:w-[500px]">
            <h2 className="text-white zeinFont font-bold text-xl md:text-3xl">Welcome to Your Reader</h2>
            <div className="flex flex-row gap-3">
              <div className="bg-[#515151] p-2 rounded-lg w-max h-max">
                <Icon
                  icon={'solar:cursor-outline'}
                  className="w-5 h-5 text-white"
                />
              </div>
              <div className="flex flex-col gap-1 text-white montserratFont">
                <p className="text-lg md:text-2xl">Navigation</p>
                <p className="text-xs text-[#979797]">Tap left or right edges to navigate pages.</p>
              </div>
            </div>
            <div className="flex flex-row gap-3">
              <div className="bg-[#515151] p-2 rounded-lg w-max h-max">
                <Icon
                  icon={'solar:menu-dots-bold'}
                  className="w-5 h-5 text-white"
                />
              </div>
              <div className="flex flex-col gap-1 text-white montserratFont">
                <p className="text-lg md:text-2xl">Change Style</p>
                <p className="text-xs text-[#979797]">Tap three dot on the top right corner to change style.</p>
              </div>
            </div>
            <div className="flex flex-row gap-3">
              <div className="bg-[#515151] p-2 rounded-lg w-max h-max">
                <Icon
                  icon={'solar:arrow-to-down-left-outline'}
                  className="w-5 h-5 text-white"
                />
              </div>
              <div className="flex flex-col gap-1 text-white montserratFont">
                <p className="text-lg md:text-2xl">Scroll</p>
                <p className="text-xs text-[#979797]">Swipe up or down to scroll through the content.</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-1">
              <button onClick={() => setIsModalTutorialOpen(false)} className="bg-[#1297DC] rounded-xl w-full px-4 py-2 text-white montserratFont font-bold">
                Start Reading
              </button>
              <p className="text-[#979797] text-xs md:text-base">This hint won&apos;t show again</p>
            </div>
          </div>
        </EbookModal>
        <CommentModalEbook
          episodeId={id}
          isCommentVisible={isCommentVisible}
          setIsCommentVisible={setIsCommentVisible}
          commentData={commentData?.data?.data || []}
          isLoadingGetComment={isLoadingGetComment}
        />
      </main>
    </div>
  );
}

ReadEbookPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
}