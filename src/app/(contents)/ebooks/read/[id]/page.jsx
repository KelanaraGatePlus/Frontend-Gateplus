"use client";
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";

/*[--- HOOKS IMPORT ---]*/
import { useGetEpisodeEbookByIdQuery } from "@/hooks/api/contentSliceAPI";
import { useGetCommentByEpisodeEbookQuery } from "@/hooks/api/commentSliceAPI";

/*[--- COMPONENT IMPORT ---]*/
import BackButton from "@/components/BackButton/page";
import EpubReader from "@/components/EbookReader/page";
import DetailPageLoadingSkeleton from "@/components/MainDetailProduct/Loading/ProductReadLoading";
import DefaultProgressBar from "@/components/ProgressBar/DefaultProgressBar";
import LoadingOverlay from "@/components/LoadingOverlay/page";

/*[--- ASSETS IMPORT ---]*/
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";
import { Icon } from "@iconify/react";
import AudioEbookButton from "@/components/AudioEbookButton/page";
import EbookModal from "@/components/Modal/EbookModal";
import CommentModalEbook from "@/components/CommentModalEbook/CommentModalEbook";
import iconCommentComic from "@@/icons/icon-comment-comic.svg";
import {
  useUpdateEpisodeViewsMutation,
  useGetReadProgressQuery,
} from "@/hooks/api/episodeEbookSliceAPI";

const HEADER_HEIGHT = 64;
const BOTTOM_BAR_OPEN = 176;
const BOTTOM_BAR_COLLAPSED = 56;

export default function ReadEbookPage({ params }) {
  const { id } = params;
  const epubReaderRef = useRef(null);

  /*[--- UI STATE ---]*/
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBottomBarOpen, setIsBottomBarOpen] = useState(true);
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [isReaderLoading, setIsReaderLoading] = useState(false);
  const [isModalTutorialOpen, setIsModalTutorialOpen] = useState(false);

  /*[--- EBOOK METADATA ---]*/
  const [ebookTitle, setEbookTitle] = useState("");
  const [ebookId, setEbookId] = useState("");
  const [creatorNotes, setCreatorNotes] = useState("");
  const [ebookUrl, setEbookUrl] = useState(null);
  const [audioEbookUrl, setAudioEbookUrl] = useState(null);

  /*[--- READER SETTINGS ---]*/
  const [colorTheme, setColorTheme] = useState("dark");
  const [lineHeight, setLineHeight] = useState("normal");
  const [textAlign, setTextAlign] = useState("justify");
  const [fontFamily, setFontFamily] = useState("inter");
  const [readingMode, setReadingMode] = useState("page");
  const [baseFontSize, setBaseFontSize] = useState(14);
  const [fontSizeFactor, setFontSizeFactor] = useState(1.0);

  /*[--- PROGRESS STATE ---]*/
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [savedPage, setSavedPage] = useState(1);
  const [savedCfi, setSavedCfi] = useState(null);

  /*[--- READER KEY (force remount) ---]*/
  const [readerKey, setReaderKey] = useState(0);

  const hasUpdatedViewsRef = useRef(false);
  const readingModeBeforeChangeRef = useRef("page");
  const scrollPositionRef = useRef(0);
  const isReadingModeChangeRef = useRef(false);
  const progressLoadedFirstTimeRef = useRef(false);

  const { data, isLoading, error } = useGetEpisodeEbookByIdQuery(id);

  const { data: progressData, isLoading: isLoadingProgress } =
    useGetReadProgressQuery(id, {
      skip: !id || !ebookUrl,
    });

  const { data: commentData, isLoading: isLoadingGetComment } =
    useGetCommentByEpisodeEbookQuery(id);

  const [createLog] = useCreateLogMutation();
  const [updateViews] = useUpdateEpisodeViewsMutation();

  /*[--- MEMOIZED DATA ---]*/
  const episodeEbookData = useMemo(() => data?.data?.data || {}, [data]);
  const episodeEbookNextId = useMemo(
    () => data?.data?.nextEpisode?.id || null,
    [data],
  );
  const episodeEbookPrevId = useMemo(
    () => data?.data?.previousEpisode?.id || null,
    [data],
  );
  const ebookData = useMemo(
    () => episodeEbookData.ebooks || {},
    [episodeEbookData],
  );

  const displayTitle = ebookTitle || ebookData?.title || "";
  const displayId = ebookId || ebookData?.id || "";
  const bottomBarHeight = isBottomBarOpen
    ? BOTTOM_BAR_OPEN
    : BOTTOM_BAR_COLLAPSED;

  const getDeviceType = () => {
    if (typeof window === "undefined") return "DESKTOP";
    const width = window.innerWidth;
    if (width < 768) return "MOBILE";
    if (width < 1024) return "TABLET";
    return "DESKTOP";
  };

  const getBaseFontSize = () => {
    if (typeof window === "undefined") return 14;
    const width = window.innerWidth;
    if (width < 768) return 12;
    if (width < 1024) return 13;
    return 14;
  };

  const getActiveButtonClass = (isActive) =>
    isActive
      ? colorTheme === "dark"
        ? "bg-[#515151]"
        : "bg-[#333333] text-white"
      : "bg-[#626262]/50";

  useEffect(() => {
    if (progressLoaded && !progressLoadedFirstTimeRef.current) {
      progressLoadedFirstTimeRef.current = true;
      setReaderKey((prev) => prev + 1);
    }
  }, [progressLoaded]);

  useEffect(() => {
    if (ebookUrl && progressLoaded) {
      requestAnimationFrame(() => {
        if (
          epubReaderRef.current &&
          typeof epubReaderRef.current.refresh === "function"
        ) {
          epubReaderRef.current.refresh();
        }
        window.dispatchEvent(new Event("resize"));
      });
    }
  }, [ebookUrl, progressLoaded]);

  useEffect(() => {
    if (!id) return;
    const timer = setTimeout(
      async () => {
        try {
          await createLog({
            contentId: id,
            logType: "WATCH_CONTENT",
            contentType: "EPISODE_EBOOK",
            deviceType: getDeviceType(),
          }).unwrap();
        } catch (err) {
          console.error("❌ Gagal membuat log:", err);
        }
      },
      2 * 60 * 1000,
    );
    return () => clearTimeout(timer);
  }, [id, createLog]);

  const getData = useCallback(async () => {
    try {
      if (!hasUpdatedViewsRef.current && id) {
        try {
          await updateViews(id);
          hasUpdatedViewsRef.current = true;
        } catch (viewErr) {
          console.warn("Warning: View count update failed", viewErr);
        }
      }

      if (isReadingModeChangeRef.current) {
        isReadingModeChangeRef.current = false;
        return;
      }

      setEbookTitle(ebookData.title);
      setEbookId(ebookData.id);
      setCreatorNotes(episodeEbookData.notedEpisode);
      setEbookUrl(episodeEbookData.ebookUrl);
      setAudioEbookUrl(episodeEbookData.audioUrl);

      try {
        let existing = [];
        const raw = localStorage.getItem("last_seen_content");
        existing = raw ? JSON.parse(raw) : [];
        const isAlreadyExist = existing.find(
          (item) => item.id === ebookData.id,
        );
        if (!isAlreadyExist) {
          const newContent = { ...episodeEbookData.ebooks, type: "ebook" };
          const updated = [newContent, ...existing].slice(0, 10);
          localStorage.setItem("last_seen_content", JSON.stringify(updated));
        }
      } catch {
        // Silent fail for localStorage
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }, [id, ebookData, episodeEbookData, updateViews]);

  useEffect(() => {
    if (data && !isLoading) getData();
    if (error && error.status === 403) {
      window.location.href = "/checkout/purchase/ebooks/x/" + id;
    }
  }, [data, isLoading, error, id, getData]);

  /*[--- EFFECT: restore read progress from RTK Query ---]*/
  useEffect(() => {
    if (!id || !ebookUrl || isLoadingProgress) return;

    setProgressLoaded(false);
    progressLoadedFirstTimeRef.current = false;

    const items = progressData?.items ?? [];

    if (items.length > 0) {
      const dbPage = items[0].page ?? 0;
      const dbCfi = items[0].cfiString || null;
      const restoredPage = dbPage + 1;

      console.log(
        "[EBOOK] Restore progress → page:",
        restoredPage,
        "| cfi:",
        dbCfi,
      );

      setSavedPage(restoredPage);
      setSavedCfi(dbCfi);
      setCurrentPage(restoredPage);
    } else {
      console.log("[EBOOK] Belum ada progress, mulai dari halaman 1");
      setSavedPage(1);
      setSavedCfi(null);

      if (episodeEbookData?.readProgress == null) {
        setIsModalTutorialOpen(true);
      }
    }

    requestAnimationFrame(() => setProgressLoaded(true));
  }, [id, ebookUrl, progressData, isLoadingProgress, episodeEbookData]);

  useEffect(() => {
    if (!id || readingMode === readingModeBeforeChangeRef.current) return;
    if (typeof window !== "undefined") {
      scrollPositionRef.current = window.scrollY;
      try {
        sessionStorage.setItem(
          `ebook_scroll_${id}_${readingModeBeforeChangeRef.current}`,
          scrollPositionRef.current.toString(),
        );
      } catch {
        // Silent fail
      }
    }

    readingModeBeforeChangeRef.current = readingMode;
    isReadingModeChangeRef.current = true;

    setTimeout(() => {
      try {
        const savedScroll = sessionStorage.getItem(
          `ebook_scroll_${id}_${readingMode}`,
        );
        if (savedScroll && readingMode === "scroll") {
          window.scrollTo({ top: parseInt(savedScroll), behavior: "auto" });
        }
      } catch {
        // Silent fail
      }
    }, 300);
  }, [readingMode, id]);

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

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        progressLoaded &&
        ebookUrl
      ) {
        if (
          epubReaderRef.current &&
          typeof epubReaderRef.current.refresh === "function"
        ) {
          epubReaderRef.current.refresh();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [progressLoaded, ebookUrl]);

  /*[--- EFFECT: trigger resize on window focus ---]*/
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleFocus = () => window.dispatchEvent(new Event("resize"));
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  /*[--- EFFECT: block copy / devtools ---]*/
  useEffect(() => {
    const preventDefault = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const blockKeys = (e) => {
      const key = (e.key || "").toUpperCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      const blockedCombos =
        key === "F12" ||
        (ctrl && shift && ["I", "J", "C"].includes(key)) ||
        (ctrl && ["U", "S", "P", "C", "A"].includes(key));
      if (blockedCombos) preventDefault(e);
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

  /*[--- READER SETTING HANDLERS ---]*/
  const handleFontSizeChange = (delta) => {
    if (epubReaderRef.current) epubReaderRef.current.changeFontSize(delta);
  };
  const handleThemeChange = useCallback((theme) => setColorTheme(theme), []);
  const handleLineHeightChange = useCallback(
    (height) => setLineHeight(height),
    [],
  );
  const handleAlignmentChange = useCallback((align) => setTextAlign(align), []);
  const handleFontFamilyChange = useCallback(
    (family) => setFontFamily(family),
    [],
  );
  const handleReadingModeChange = useCallback(
    (mode) => setReadingMode(mode),
    [],
  );

  const handleProgressChange = useCallback(
    (progressData) => {
      setProgress(progressData.progress);
      setCurrentPage(progressData.currentPage);
      setTotalPages(progressData.totalPages);
      if (readingMode === "scroll" && typeof window !== "undefined") {
        scrollPositionRef.current = window.scrollY;
      }
    },
    [readingMode],
  );

  if (showSkeleton) return <DetailPageLoadingSkeleton />;

  return (
    <div
      className={`flex flex-col overflow-hidden select-none ${
        colorTheme === "dark"
          ? "bg-[#121212]"
          : colorTheme === "sepia"
            ? "bg-[#F4ECD8]"
            : "bg-[#FFFFFF]"
      }`}
      onCopy={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onCut={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onPaste={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
    >
      <main className="flex flex-col">
        {/* ===== HEADER ===== */}
        <div
          className={`${
            colorTheme === "dark" ? "text-white" : "text-[#222222]"
          } fixed z-40 mt-0 flex w-full flex-row items-center justify-start gap-2 px-4 py-2 text-2xl font-semibold backdrop-blur md:px-20`}
        >
          <BackButton isDark={colorTheme === "dark"} />
          <h4 className="zeinFont [display:-webkit-box] w-full overflow-hidden text-center text-xl font-extrabold text-ellipsis [-webkit-box-orient:vertical] [-webkit-line-clamp:1] md:text-2xl">
            <Link
              href={`/ebooks/detail/${displayId}`}
              className="hover:underline"
            >
              {displayTitle || "Loading..."}
            </Link>
          </h4>
          <Icon
            icon="solar:menu-dots-bold-duotone"
            className={`z-50 h-10 w-10 cursor-pointer text-3xl ${
              colorTheme === "dark" ? "text-white" : "text-black"
            }`}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          />
        </div>

        {/* ===== MOBILE DROPDOWN MENU ===== */}
        {mobileMenuOpen && (
          <div className="fixed top-2 right-4 z-50">
            <div
              className={`flex min-w-[200px] flex-col gap-1 rounded-2xl border-1 p-6 shadow-2xl backdrop-blur-sm md:gap-3 ${
                colorTheme === "dark"
                  ? "border-gray-600 bg-[#222222] text-white"
                  : "border-gray-400 bg-white/20 text-black"
              }`}
            >
              <Icon
                icon="solar:close-circle-bold-duotone"
                className={`h-8 w-8 cursor-pointer self-end text-3xl ${
                  colorTheme === "dark" ? "text-white" : "text-black"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              />

              {/* Font Size */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-2">
                  <Icon icon="solar:text-bold" className="h-5 w-5" />
                  <p className="montserratFont text-sm font-semibold">
                    Ukuran Font
                  </p>
                </div>
                <div className="flex flex-row items-center justify-between gap-2">
                  <button
                    onClick={() => handleFontSizeChange(-0.1)}
                    className={`${
                      colorTheme === "dark" ? "bg-[#333333]" : "bg-[#878787]"
                    } rounded-lg p-3 transition-opacity hover:opacity-70`}
                  >
                    <Icon icon="mynaui:minus" className="h-6 w-6" />
                  </button>
                  <div
                    className={`${
                      colorTheme === "dark" ? "bg-[#333333]" : "bg-[#878787]"
                    } montserratFont flex flex-row items-center gap-2 rounded-lg px-8 py-3 font-medium`}
                  >
                    <Icon icon="solar:text-bold" className="h-5 w-5" />
                    <p>{Math.round(baseFontSize * fontSizeFactor)}px</p>
                  </div>
                  <button
                    onClick={() => handleFontSizeChange(0.1)}
                    className={`${
                      colorTheme === "dark" ? "bg-[#333333]" : "bg-[#878787]"
                    } rounded-lg p-3 transition-opacity hover:opacity-70`}
                  >
                    <Icon icon="mynaui:plus" className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Theme */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-2">
                  <Icon icon="solar:sun-bold" className="h-5 w-5" />
                  <p className="montserratFont text-sm font-semibold">Tema</p>
                </div>
                <div className="montserratFont grid grid-cols-3 items-center justify-between gap-2 text-sm">
                  {["dark", "sepia", "light"].map((t) => (
                    <button
                      key={t}
                      onClick={() => handleThemeChange(t)}
                      className={`${getActiveButtonClass(
                        colorTheme === t,
                      )} rounded-lg py-2 transition-opacity hover:opacity-70`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Height */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-2">
                  <Icon icon="solar:list-outline" className="h-5 w-5" />
                  <p className="montserratFont text-sm font-semibold">
                    Line Height
                  </p>
                </div>
                <div className="montserratFont grid grid-cols-3 items-center justify-between gap-2 text-sm">
                  {["compact", "normal", "relaxed"].map((h) => (
                    <button
                      key={h}
                      onClick={() => handleLineHeightChange(h)}
                      className={`${getActiveButtonClass(
                        lineHeight === h,
                      )} rounded-lg py-2 transition-opacity hover:opacity-70`}
                    >
                      {h.charAt(0).toUpperCase() + h.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alignment */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-2">
                  <Icon
                    icon="solar:hamburger-menu-outline"
                    className="h-5 w-5"
                  />
                  <p className="montserratFont text-sm font-semibold">
                    Alignment
                  </p>
                </div>
                <div className="montserratFont grid grid-cols-2 items-center justify-between gap-2 text-sm">
                  <button
                    onClick={() => handleAlignmentChange("left")}
                    className={`${getActiveButtonClass(
                      textAlign === "left",
                    )} flex items-center justify-center gap-2 rounded-lg py-2 transition-opacity hover:opacity-70`}
                  >
                    <Icon icon="solar:list-outline" className="h-5 w-5" /> Left
                  </button>
                  <button
                    onClick={() => handleAlignmentChange("justify")}
                    className={`${getActiveButtonClass(
                      textAlign === "justify",
                    )} flex items-center justify-center gap-2 rounded-lg py-2 transition-opacity hover:opacity-70`}
                  >
                    <Icon
                      icon="solar:hamburger-menu-outline"
                      className="h-5 w-5"
                    />{" "}
                    Justified
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-2">
                  <Icon icon="solar:text-bold" className="h-5 w-5" />
                  <p className="montserratFont text-sm font-semibold">
                    Tipe Font
                  </p>
                </div>
                <div className="montserratFont grid grid-cols-2 items-center justify-between gap-2 text-sm">
                  {[
                    { key: "inter", label: "Teks 1", cls: "interFont" },
                    {
                      key: "merriweather",
                      label: "Teks 2",
                      cls: "merriweatherFont",
                    },
                    {
                      key: "montserrat",
                      label: "Teks 3",
                      cls: "montserratFont",
                    },
                    {
                      key: "openDyslexic",
                      label: "Teks 4",
                      cls: "openDyslexicFont",
                    },
                  ].map(({ key, label, cls }) => (
                    <button
                      key={key}
                      onClick={() => handleFontFamilyChange(key)}
                      className={`${getActiveButtonClass(
                        fontFamily === key,
                      )} ${cls} rounded-lg py-2 transition-opacity hover:opacity-70`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-2">
                  <Icon
                    icon="solar:notebook-minimalistic-linear"
                    className="h-5 w-5"
                  />
                  <p className="montserratFont text-sm font-semibold">
                    Mode Baca
                  </p>
                </div>
                <div className="montserratFont grid grid-cols-2 items-center justify-between gap-2 text-sm">
                  <button
                    onClick={() => handleReadingModeChange("scroll")}
                    className={`${getActiveButtonClass(
                      readingMode === "scroll",
                    )} flex items-center justify-center gap-2 rounded-lg py-2 transition-opacity hover:opacity-70`}
                  >
                    <Icon icon="lucide:scroll" className="h-5 w-5" /> Scroll
                  </button>
                  <button
                    onClick={() => handleReadingModeChange("page")}
                    className={`${getActiveButtonClass(
                      readingMode === "page",
                    )} flex items-center justify-center gap-2 rounded-lg py-2 transition-opacity hover:opacity-70`}
                  >
                    <Icon
                      icon="solar:notebook-minimalistic-linear"
                      className="h-5 w-5"
                    />{" "}
                    Page
                  </button>
                </div>
              </div>

              <Link
                href={`/report/episode_ebook/${id}`}
                className={`flex flex-row items-center gap-2 transition-opacity hover:opacity-70 ${
                  colorTheme === "dark" ? "text-white" : "text-black"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon icon="solar:flag-2-linear" className="h-6 w-6" />
                <p className="text-sm font-medium">Laporkan Konten</p>
              </Link>
            </div>
          </div>
        )}

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-10 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <div
          className={`relative mt-16 flex shadow-md shadow-black ${
            readingMode === "scroll" ? "w-full" : "w-max"
          } mx-auto max-w-[210mm] flex-col ${
            colorTheme === "dark" ? "text-white" : "text-[#222222]"
          }`}
        >
          <div className="flex flex-col justify-center">
            <div
              className={`relative z-20 flex h-fit w-full touch-pan-y flex-col select-none ${
                colorTheme === "dark" ? "text-white" : "text-[#222222]"
              }`}
              style={{ isolation: "isolate" }}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            >
              {ebookUrl && !progressLoaded && (
                <LoadingOverlay message="Memuat posisi baca…" />
              )}

              {ebookUrl && (
                <EpubReader
                  key={readerKey}
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
                  currentPage={progressLoaded ? savedPage : 1}
                  cfiPosition={progressLoaded ? savedCfi : null}
                  bottomBarHeight={bottomBarHeight}
                  onLoadingChange={setIsReaderLoading}
                />
              )}
            </div>
          </div>
        </div>

        {isReaderLoading && <LoadingOverlay message="Rendering reader…" />}

        <section
          className={`relative flex w-screen flex-col px-4 pt-5 pb-40 ${
            colorTheme === "dark" ? "text-white" : "text-[#222222]"
          } md:mt-4 md:px-15`}
        >
          <div
            className={`w-full rounded-xl p-4 ${
              colorTheme === "dark"
                ? "bg-[#2f2f2f] text-white"
                : "bg-[#DEDEDE] text-[#222222]"
            }`}
          >
            <h4
              className={`${
                colorTheme === "dark" ? "text-white/70" : "text-black/60"
              } font-bold`}
            >
              Catatan Kreator
            </h4>
            <div
              className={`prose max-w-none ${
                colorTheme === "dark"
                  ? "prose-invert text-white"
                  : "text-[#222222]"
              }`}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(creatorNotes || ""),
              }}
            />
          </div>
        </section>

        {audioEbookUrl && (
          <AudioEbookButton
            audioUrl={audioEbookUrl}
            isDark={colorTheme === "dark"}
          />
        )}

        <div>
          {readingMode === "page" && (
            <div
              className="pointer-events-none fixed right-0 left-0 z-30 flex"
              style={{ top: HEADER_HEIGHT, bottom: bottomBarHeight }}
            >
              <div
                className="pointer-events-auto h-full w-1/2 cursor-pointer"
                onClick={() => epubReaderRef.current?.goToPreviousPage()}
              />
              <div
                className="pointer-events-auto h-full w-1/2 cursor-pointer"
                onClick={() => epubReaderRef.current?.goToNextPage()}
              />
            </div>
          )}

          <div className="pointer-events-auto fixed right-0 bottom-0 left-0 z-40 flex flex-col items-center justify-center gap-2 bg-[#393939] transition-all">
            {isBottomBarOpen ? (
              <>
                <div className="w-full">
                  <DefaultProgressBar progress={progress} barColor="#FFFFFF" />
                </div>
                <div className="flex w-full flex-col gap-1 px-2 md:px-16">
                  <div className="mb-2 flex items-center justify-between font-medium text-white">
                    <button
                      className="h-6 w-6 hover:opacity-80"
                      onClick={() => setIsBottomBarOpen(false)}
                      aria-label="Tutup panel navigasi"
                    >
                      <Icon
                        icon="solar:alt-arrow-down-line-duotone"
                        className="h-6 w-6 md:h-8 md:w-8"
                      />
                    </button>
                    <p className="text-sm md:text-base">
                      Halaman {currentPage} dari {totalPages}
                    </p>
                    <img
                      src={iconCommentComic.src}
                      className="h-6 w-6 cursor-pointer transition-opacity hover:opacity-70 md:h-8 md:w-8"
                      onClick={() => setIsCommentVisible(true)}
                    />
                  </div>
                  <div className="grid w-full grid-cols-2 gap-2 pb-2 md:gap-4">
                    <Link
                      href={
                        episodeEbookPrevId
                          ? `/ebooks/read/${episodeEbookPrevId}`
                          : "#"
                      }
                      className={`flex h-10 w-full items-center justify-center rounded-lg bg-black/50 text-white shadow-xl backdrop-blur-sm transition-all md:h-12 ${
                        episodeEbookPrevId
                          ? "cursor-pointer hover:bg-black/80"
                          : "pointer-events-none cursor-not-allowed opacity-50"
                      }`}
                      aria-disabled={!episodeEbookPrevId}
                      tabIndex={episodeEbookPrevId ? 0 : -1}
                    >
                      <Icon
                        icon="solar:alt-arrow-left-linear"
                        className="h-5 w-5 md:h-6 md:w-6"
                      />
                      <p className="text-sm md:text-base">Bagian Sebelumnya</p>
                    </Link>
                    <Link
                      href={
                        episodeEbookNextId
                          ? `/ebooks/read/${episodeEbookNextId}`
                          : "#"
                      }
                      className={`flex h-10 w-full items-center justify-center rounded-lg bg-black/50 text-white shadow-xl backdrop-blur-sm transition-all md:h-12 ${
                        episodeEbookNextId
                          ? "cursor-pointer hover:bg-black/80"
                          : "pointer-events-none cursor-not-allowed opacity-50"
                      }`}
                      aria-disabled={!episodeEbookNextId}
                      tabIndex={episodeEbookNextId ? 0 : -1}
                    >
                      <p className="text-sm md:text-base">Bagian Selanjutnya</p>
                      <Icon
                        icon="solar:alt-arrow-right-linear"
                        className="h-5 w-5 md:h-6 md:w-6"
                      />
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex w-full flex-row items-center justify-between px-4 py-2 text-white">
                <button
                  className="h-6 w-6 hover:opacity-80"
                  onClick={() => setIsBottomBarOpen(true)}
                  aria-label="Buka panel navigasi"
                >
                  <Icon
                    icon="solar:alt-arrow-up-line-duotone"
                    className="h-6 w-6 md:h-8 md:w-8"
                  />
                </button>
                <p className="text-sm md:text-base">
                  Halaman {currentPage} dari {totalPages}
                </p>
                <img
                  src={iconCommentComic.src}
                  className="h-6 w-6 cursor-pointer transition-opacity hover:opacity-70 md:h-8 md:w-8"
                  onClick={() => setIsCommentVisible(true)}
                />
              </div>
            )}
          </div>
        </div>

        <EbookModal
          isOpen={isModalTutorialOpen}
          onClose={() => setIsModalTutorialOpen(false)}
        >
          <div className="flex w-[290px] flex-col gap-4 px-4 md:w-[500px] md:px-8">
            <h2 className="zeinFont text-xl font-bold text-white md:text-3xl">
              Welcome to Your Reader
            </h2>
            <div className="flex flex-row gap-3">
              <div className="h-max w-max rounded-lg bg-[#515151] p-2">
                <Icon
                  icon="solar:cursor-outline"
                  className="h-5 w-5 text-white"
                />
              </div>
              <div className="montserratFont flex flex-col gap-1 text-white">
                <p className="text-lg md:text-2xl">Navigation</p>
                <p className="text-xs text-[#979797]">
                  Tap left or right edges to navigate pages.
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-3">
              <div className="h-max w-max rounded-lg bg-[#515151] p-2">
                <Icon
                  icon="solar:menu-dots-bold"
                  className="h-5 w-5 text-white"
                />
              </div>
              <div className="montserratFont flex flex-col gap-1 text-white">
                <p className="text-lg md:text-2xl">Change Style</p>
                <p className="text-xs text-[#979797]">
                  Tap three dot on the top right corner to change style.
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-3">
              <div className="h-max w-max rounded-lg bg-[#515151] p-2">
                <Icon
                  icon="solar:arrow-to-down-left-outline"
                  className="h-5 w-5 text-white"
                />
              </div>
              <div className="montserratFont flex flex-col gap-1 text-white">
                <p className="text-lg md:text-2xl">Scroll</p>
                <p className="text-xs text-[#979797]">
                  Swipe up or down to scroll through the content.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <button
                onClick={() => setIsModalTutorialOpen(false)}
                className="montserratFont w-full rounded-xl bg-[#1297DC] px-4 py-2 font-bold text-white"
              >
                Start Reading
              </button>
              <p className="text-xs text-[#979797] md:text-base">
                This hint won&apos;t show again
              </p>
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
};
