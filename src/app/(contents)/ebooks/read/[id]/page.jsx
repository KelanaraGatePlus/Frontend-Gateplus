"use client";
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import Link from "next/link";
import PropTypes from "prop-types";

/*[--- HOOKS IMPORT ---]*/
import { BACKEND_URL } from "@/lib/constants/backendUrl";
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
import { useApplyReadProgressMutation } from "@/hooks/api/readProgressAPI";

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
  const [readingMode, setReadingMode] = useState("scroll");
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [cfiString, setCfiString] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [baseFontSize, setBaseFontSize] = useState(14);
  const { data, isLoading, error } = useGetEpisodeEbookByIdQuery(id);
  const { data: commentData, isLoading: isLoadingGetComment } =
    useGetCommentByEpisodeEbookQuery(id);
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [createLog] = useCreateLogMutation();
  const [applyReadProgress] = useApplyReadProgressMutation();
  const [fontSizeFactor, setFontSizeFactor] = useState(1.0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioEbookUrl, setAudioEbookUrl] = useState(null);
  const [isBottomBarOpen, setIsBottomBarOpen] = useState(true);
  const [isReaderLoading, setIsReaderLoading] = useState(false);
  const [isModalTutorialOpen, setIsModalTutorialOpen] = useState(false);
  const hasUpdatedViewsRef = useRef(false);
  const readingModeBeforeChangeRef = useRef("page");
  const scrollPositionRef = useRef(0);
  const isReadingModeChangeRef = useRef(false);
  const lastCfiRef = useRef(null);
  const lastSavedPageRef = useRef(0);
  const progressRestoredRef = useRef(false);

  const LAST_SEEN_CONTENT_KEY = "last_seen_content";

  // Memoize computed values to prevent stale closure issues
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

  // Detect device type based on window width
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
    if (width < 768) return 12; // mobile
    if (width < 1024) return 13; // tablet
    return 14; // laptop
  };

  // save progress
  const saveProgress = useCallback(
    (page) => {
      const pageZeroBased = Math.max(0, page - 1);
      applyReadProgress({
        page: pageZeroBased,
        episodeEbookId: id,
        cfiString: lastCfiRef.current || undefined,
      });
    },
    [id, applyReadProgress],
  );

  const mapLogTypeForBackend = (action) => {
    switch (action) {
      case "RESUME_READING":
      case "NEXT_PAGE":
      case "PREVIOUS_PAGE":
      case "PROGRESS_UPDATE":
        return "CLICK"; // backend hanya menerima CLICK/WATCH_CONTENT/WATCH_TRAILER
      case "VIEW_CONTENT":
      case "WATCH_CONTENT_2MIN":
        return "WATCH_CONTENT"; // log membaca/menonton
      case "WATCH_TRAILER":
        return "WATCH_TRAILER"; // jika ada trailer
      default:
        return "CLICK"; // klik lainnya
    }
  };

  const sendLogToServer = useCallback(
    async (action) => {
      try {
        const payload = {
          contentId: id,
          logType: mapLogTypeForBackend(action),
          contentType: "EPISODE_EBOOK",
          deviceType: getDeviceType(),
        };
        await createLog(payload).unwrap();
        console.log(`✅ Log sent: ${action} (${payload.logType})`);
      } catch (err) {
        console.warn("Failed to send log:", err?.data || err);
      }
    },
    [id, createLog],
  );
  // load progress
  useEffect(() => {
    if (!id || isLoading || !data) return;
    if (progressRestoredRef.current) return;

    const rp = episodeEbookData?.readProgress;

    if (!rp || rp.page === 0) {
      setIsModalTutorialOpen(true);
    }

    if (rp && typeof rp.page === "number") {
      setCurrentPage(rp.page + 1);
      setCfiString(rp.cfiString || null);
      console.log(`📖 Restored progress from API: page ${rp.page + 1}`);
    }

    // set progress untuk progress bar
    const restoredProgress =
      rp.progress ?? (rp.page + 1) / (episodeEbookData.totalPages || 1);
    setProgress(restoredProgress);

    progressRestoredRef.current = true;
    sendLogToServer("RESUME_READING");
  }, [id, isLoading, data]);

  useEffect(() => {
    if (!id) return;

    const timer = setTimeout(
      async () => {
        try {
          await sendLogToServer("WATCH_CONTENT_2MIN");
        } catch (err) {
          console.error("❌ Gagal membuat log:", err);
        }
      },
      2 * 60 * 1000,
    );

    return () => clearTimeout(timer);
  }, [id, sendLogToServer]);

  const getData = useCallback(async () => {
    try {
      // Update views only once
      if (!hasUpdatedViewsRef.current && id) {
        try {
          await axios.patch(`${BACKEND_URL}/episode/${id}/views`);
          hasUpdatedViewsRef.current = true;

          await sendLogToServer("VIEW_CONTENT");
        } catch (viewErr) {
          console.warn("Warning: View count update failed", viewErr);
        }
      }

      // Preserve current page/CFI if switching reading mode
      if (isReadingModeChangeRef.current) {
        isReadingModeChangeRef.current = false;
        return;
      }

      setEbookTitle(ebookData.title);
      setEbookId(ebookData.id);
      setCreatorNotes(episodeEbookData.notedEpisode);
      setEbookUrl(episodeEbookData.ebookUrl);
      setAudioEbookUrl(episodeEbookData.audioUrl);

      // Buka modal tutorial jika belum ada progress membaca
      if (episodeEbookData?.readProgress == null) {
        setIsModalTutorialOpen(true);
        sendLogToServer("TUTORIAL_SHOWN");
      }

      // Update last_seen_content untuk history bukan progress
      let existing = [];
      try {
        const raw = localStorage.getItem(LAST_SEEN_CONTENT_KEY);
        existing = raw ? JSON.parse(raw) : [];
      } catch {
        existing = [];
      }
      const isAlreadyExist = existing.find((item) => item.id === ebookData.id);
      if (!isAlreadyExist) {
        const newContent = {
          id: ebookData?.id,
          title: ebookData?.title,
          type: "ebook",
          progress: episodeEbookData?.readProgress?.progress || 0,
          currentPage: episodeEbookData?.readProgress?.page || 0,
          totalPages: episodeEbookData?.totalPages || 0,
          updatedAt: new Date().toISOString(),

          // render gambar card
          posterImageUrl:
            ebookData?.posterImageUrl ||
            ebookData?.coverImageUrl ||
            episodeEbookData?.posterImageUrl ||
            episodeEbookData?.coverImageUrl ||
            null,
        };

        existing = [newContent, ...existing].slice(0, 10);
        localStorage.setItem(LAST_SEEN_CONTENT_KEY, JSON.stringify(existing));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [id, ebookData, episodeEbookData, sendLogToServer]);

  // Fungsi untuk mengubah ukuran font
  const handleFontSizeChange = (delta) => {
    if (epubReaderRef.current) {
      epubReaderRef.current.changeFontSize(delta);
      sendLogToServer("FONT_SIZE_CHANGE", currentPage, {
        fontSizeDelta: delta,
      });
    }
  };

  // Handler untuk mengubah tema (Memoized - tidak re-create setiap render)
  const handleThemeChange = useCallback(
    (theme) => {
      setColorTheme(theme);
      sendLogToServer("THEME_CHANGE", currentPage, { newTheme: theme });
    },
    [currentPage, sendLogToServer],
  );

  // Handler untuk mengubah line height (Memoized - tidak re-create setiap render)
  const handleLineHeightChange = useCallback(
    (height) => {
      setLineHeight(height);
      sendLogToServer("LINE_HEIGHT_CHANGE", currentPage, {
        newLineHeight: height,
      });
    },
    [currentPage, sendLogToServer],
  );

  // Handler untuk mengubah alignment (Memoized - tidak re-create setiap render)
  const handleAlignmentChange = useCallback(
    (align) => {
      setTextAlign(align);
      sendLogToServer("ALIGNMENT_CHANGE", currentPage, { newAlignment: align });
    },
    [currentPage, sendLogToServer],
  );

  // Handler untuk mengubah font family (Memoized - tidak re-create setiap render)
  const handleFontFamilyChange = useCallback(
    (family) => {
      setFontFamily(family);
      sendLogToServer("FONT_FAMILY_CHANGE", currentPage, {
        newFontFamily: family,
      });
    },
    [currentPage, sendLogToServer],
  );

  // Handler untuk mengubah reading mode (Memoized - tidak re-create setiap render)
  const handleReadingModeChange = useCallback(
    (mode) => {
      setReadingMode(mode);
      sendLogToServer("READING_MODE_CHANGE", currentPage, { newMode: mode });
    },
    [currentPage, sendLogToServer],
  );

  // update prev
  const handlePreviousPage = useCallback(() => {
    if (epubReaderRef.current) {
      epubReaderRef.current.goToPreviousPage();
      sendLogToServer("PREVIOUS_PAGE", currentPage - 1);
      saveProgress(currentPage - 1);
    }
  }, [currentPage, sendLogToServer, saveProgress]);

  // Update update next
  const handleNextPage = useCallback(() => {
    if (epubReaderRef.current) {
      epubReaderRef.current.goToNextPage();
      sendLogToServer("NEXT_PAGE", currentPage + 1);
      saveProgress(currentPage + 1);
    }
  }, [currentPage, sendLogToServer, saveProgress]);

  const handleToggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => {
      const next = !prev;
      if (next) {
        setIsCommentVisible(false);
      }
      return next;
    });
  }, []);

  const handleOpenCommentModal = useCallback(() => {
    setMobileMenuOpen(false);
    setIsCommentVisible(true);
  }, []);

  const handleProgressChange = useCallback(
    (progressData) => {
      // memastikan progress 0-1
      const progress =
        progressData.progress ??
        (progressData.totalPages
          ? progressData.currentPage / progressData.totalPages
          : 0);
      setProgress(progress); // untuk progress bar
      setCurrentPage(progressData.currentPage);
      setTotalPages(progressData.totalPages);

      // CFI is only valid in page mode, clear it for scroll mode
      if (progressData.cfi && readingMode === "page") {
        lastCfiRef.current = progressData.cfi;
      } else if (readingMode === "scroll") {
        lastCfiRef.current = null; // CFI not valid in scroll mode
      }

      // Track scroll position in scroll mode for restoration
      if (readingMode === "scroll" && typeof window !== "undefined") {
        scrollPositionRef.current = window.scrollY;
      }

      // kirim log ketika pindah halaman
      if (lastSavedPageRef.current !== progressData.currentPage) {
        lastSavedPageRef.current = progressData.currentPage;

        // simpan ke db
        saveProgress(progressData.currentPage);

        // send progress update
        sendLogToServer("PROGRESS_UPDATE", progressData.currentPage, {
          progress: progressData.progress,
          totalPages: progressData.totalPages,
          cfi: progressData.cfi,
        });

        // Update local storage
        try {
          const raw = localStorage.getItem(LAST_SEEN_CONTENT_KEY);
          let existing = raw ? JSON.parse(raw) : [];

          const index = existing.findIndex((item) => item.id === ebookId);
          // ambil poster
          const posterFromBackend =
            ebookData?.posterImageUrl ||
            ebookData?.coverImageUrl ||
            episodeEbookData?.posterImageUrl ||
            episodeEbookData?.coverImageUrl ||
            null;

          const posterFromStorage =
            index >= 0 ? existing[index]?.posterImageUrl : null;

          const updatedContent = {
            id: ebookId,
            title: ebookTitle,
            type: "ebook",
            progress: progressData.progress,
            currentPage: progressData.currentPage,
            totalPages: progressData.totalPages,
            cfiString: progressData.cfi || null,
            updatedAt: new Date().toISOString(),
            posterImageUrl: posterFromBackend || posterFromStorage || null,
          };

          if (index >= 0) {
            existing[index] = {
              ...existing[index],
              ...updatedContent,
            };
          } else {
            existing = [updatedContent, ...existing].slice(0, 10);
          }

          localStorage.setItem(LAST_SEEN_CONTENT_KEY, JSON.stringify(existing));
        } catch (err) {
          console.error("Failed to update last_seen_content:", err);
        }
      }
    },
    [
      readingMode,
      ebookId,
      ebookTitle,
      ebookData,
      episodeEbookData,
      sendLogToServer,
    ],
  );

  // Fungsi helper untuk mendapatkan kelas button aktif
  const getActiveButtonClass = (isActive) => {
    return isActive
      ? colorTheme == "dark"
        ? "bg-[#515151]"
        : "bg-[#333333] text-white"
      : "bg-[#626262]/50";
  };

  useEffect(() => {
    if (data && !isLoading) {
      getData();
    }

    if (error && error.status === 403) {
      window.location.href = "/checkout/purchase/ebooks/x/" + id;
    }
  }, [data, isLoading, error, id, getData]);

  // Handle reading mode change - preserve reading position
  useEffect(() => {
    if (!id || readingMode === readingModeBeforeChangeRef.current) return;

    // Save scroll position before switching modes
    if (typeof window !== "undefined") {
      scrollPositionRef.current = window.scrollY;
      try {
        sessionStorage.setItem(
          `ebook_scroll_${id}_${readingModeBeforeChangeRef.current}`,
          scrollPositionRef.current.toString(),
        );
      } catch {
        // Silent fail for sessionStorage
      }
    }

    readingModeBeforeChangeRef.current = readingMode;
    isReadingModeChangeRef.current = true;

    // Restore scroll position after mode change
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
    if (mobileMenuOpen && isCommentVisible) {
      setMobileMenuOpen(false);
    }
  }, [mobileMenuOpen, isCommentVisible]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const previousOverflow = document.body.style.overflow;

    if (isCommentVisible) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isCommentVisible]);

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

      const blockedCombos =
        key === "F12" ||
        (ctrl && shift && ["I", "J", "C"].includes(key)) || // DevTools shortcuts
        (ctrl && ["U", "S", "P", "C", "A"].includes(key)); // View source/Save/Print/Copy/Select All

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

  // save progress ketika keluar halaman
  useEffect(() => {
    const handleBeforeUnload = () => {
      sendLogToServer("PAGE_EXIT", currentPage);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      sendLogToServer("COMPONENT_UNMOUNT", currentPage);
    };
  }, [currentPage, sendLogToServer]);

  if (showSkeleton) {
    return <DetailPageLoadingSkeleton />;
  }

  return (
    <div
      className={`flex flex-col overflow-hidden select-none ${colorTheme === "dark" ? "bg-[#121212]" : colorTheme == "sepia" ? "bg-[#F4ECD8]" : "bg-[#FFFFFF]"}`}
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
        <div
          className={`${colorTheme == "dark" ? "text-white" : "text-[#222222]"} fixed z-40 mt-0 flex w-full flex-row items-center justify-start gap-2 px-4 py-2 text-2xl font-semibold backdrop-blur md:px-20`}
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
            icon={"solar:menu-dots-bold-duotone"}
            className={`z-10 h-10 w-10 text-3xl ${colorTheme === "dark" ? "text-white" : "text-black"}`}
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              sendLogToServer("OPEN_MENU", currentPage);
              handleToggleMobileMenu();
            }}
          />
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="fixed top-2 right-4 z-50">
            <div
              className={`flex min-w-[200px] flex-col gap-1 rounded-2xl border-1 p-6 shadow-2xl backdrop-blur-sm md:gap-3 ${colorTheme === "dark" ? "border-gray-600 bg-[#222222] text-white" : "border-gray-400 bg-white/20 text-black"} `}
            >
              {/* Dot */}
              <Icon
                icon={"solar:close-circle-bold-duotone"}
                className={`h-8 w-8 self-end text-3xl ${colorTheme === "dark" ? "text-white" : "text-black"}`}
                onClick={() => {
                  setMobileMenuOpen(!mobileMenuOpen);
                  sendLogToServer("CLOSE_MENU", currentPage);
                  handleToggleMobileMenu();
                }}
              />

              {/* Font Size Controller */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-2">
                  <Icon icon={"solar:text-bold"} className="h-5 w-5" />
                  <p className="montserratFont text-sm font-semibold">
                    Ukuran Font
                  </p>
                </div>
                <div className="flex flex-row items-center justify-between gap-2">
                  <button
                    onClick={() => handleFontSizeChange(-0.1)}
                    className={`${colorTheme == "dark" ? "bg-[#333333]" : "bg-[#878787]"} rounded-lg p-3 transition-opacity hover:opacity-70`}
                    aria-label="Decrease font size"
                  >
                    <Icon icon={"mynaui:minus"} className="h-6 w-6" />
                  </button>
                  <div
                    className={`${colorTheme == "dark" ? "bg-[#333333]" : "bg-[#878787]"} montserratFont flex flex-row items-center gap-2 rounded-lg px-8 py-3 font-medium`}
                  >
                    <Icon icon={"solar:text-bold"} className="h-5 w-5" />
                    <p>{Math.round(baseFontSize * fontSizeFactor)}px</p>
                  </div>
                  <button
                    onClick={() => handleFontSizeChange(0.1)}
                    className={`${colorTheme == "dark" ? "bg-[#333333]" : "bg-[#878787]"} rounded-lg p-3 transition-opacity hover:opacity-70`}
                    aria-label="Increase font size"
                  >
                    <Icon icon={"mynaui:plus"} className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Theme Toggle */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-2">
                  <Icon icon={"solar:sun-bold"} className="h-5 w-5" />
                  <p className="montserratFont text-sm font-semibold">Tema</p>
                </div>
                <div className="montserratFont grid grid-cols-3 items-center justify-between gap-2 text-sm">
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`${getActiveButtonClass(colorTheme === "dark")} rounded-lg py-2 transition-opacity hover:opacity-70`}
                    aria-label="Dark theme"
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => handleThemeChange("sepia")}
                    className={`${getActiveButtonClass(colorTheme === "sepia")} rounded-lg py-2 transition-opacity hover:opacity-70`}
                    aria-label="Sepia theme"
                  >
                    Sepia
                  </button>
                  <button
                    onClick={() => handleThemeChange("light")}
                    className={`${getActiveButtonClass(colorTheme === "light")} rounded-lg py-2 transition-opacity hover:opacity-70`}
                    aria-label="Light theme"
                  >
                    Light
                  </button>
                </div>
              </div>

              {/* Line Height Toggle */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-2">
                  <Icon icon={"solar:list-outline"} className="h-5 w-5" />
                  <p className="montserratFont text-sm font-semibold">
                    Line Height
                  </p>
                </div>
                <div className="montserratFont grid grid-cols-3 items-center justify-between gap-2 text-sm">
                  <button
                    onClick={() => handleLineHeightChange("compact")}
                    className={`${getActiveButtonClass(lineHeight === "compact")} rounded-lg py-2 transition-opacity hover:opacity-70`}
                    aria-label="Compact line height"
                  >
                    Compact
                  </button>
                  <button
                    onClick={() => handleLineHeightChange("normal")}
                    className={`${getActiveButtonClass(lineHeight === "normal")} rounded-lg py-2 transition-opacity hover:opacity-70`}
                    aria-label="Normal line height"
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => handleLineHeightChange("relaxed")}
                    className={`${getActiveButtonClass(lineHeight === "relaxed")} rounded-lg py-2 transition-opacity hover:opacity-70`}
                    aria-label="Relaxed line height"
                  >
                    Relaxed
                  </button>
                </div>
              </div>

              {/* Alignment Toggle */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-2">
                  <Icon
                    icon={"solar:hamburger-menu-outline"}
                    className="h-5 w-5"
                  />
                  <p className="montserratFont text-sm font-semibold">
                    Alignment
                  </p>
                </div>
                <div className="montserratFont grid grid-cols-2 items-center justify-between gap-2 text-sm">
                  <button
                    onClick={() => handleAlignmentChange("left")}
                    className={`${getActiveButtonClass(textAlign === "left")} flex items-center justify-center gap-2 rounded-lg py-2 transition-opacity hover:opacity-70`}
                    aria-label="Left alignment"
                  >
                    <Icon icon={"solar:list-outline"} className="h-5 w-5" />
                    Left
                  </button>
                  <button
                    onClick={() => handleAlignmentChange("justify")}
                    className={`${getActiveButtonClass(textAlign === "justify")} flex items-center justify-center gap-2 rounded-lg py-2 transition-opacity hover:opacity-70`}
                    aria-label="Justified alignment"
                  >
                    <Icon
                      icon={"solar:hamburger-menu-outline"}
                      className="h-5 w-5"
                    />
                    Justified
                  </button>
                </div>
              </div>

              {/* Tipe Font */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-2">
                  <Icon icon={"solar:text-bold"} className="h-5 w-5" />
                  <p className="montserratFont text-sm font-semibold">
                    Tipe Font
                  </p>
                </div>
                <div className="montserratFont grid grid-cols-2 items-center justify-between gap-2 text-sm">
                  <button
                    onClick={() => handleFontFamilyChange("inter")}
                    className={`${getActiveButtonClass(fontFamily === "inter")} interFont rounded-lg py-2 transition-opacity hover:opacity-70`}
                    aria-label="Inter font"
                  >
                    Teks 1
                  </button>
                  <button
                    onClick={() => handleFontFamilyChange("merriweather")}
                    className={`${getActiveButtonClass(fontFamily === "merriweather")} merriweatherFont rounded-lg py-2 transition-opacity hover:opacity-70`}
                    aria-label="Merriweather font"
                  >
                    Teks 2
                  </button>
                  <button
                    onClick={() => handleFontFamilyChange("montserrat")}
                    className={`${getActiveButtonClass(fontFamily === "montserrat")} montserratFont rounded-lg py-2 transition-opacity hover:opacity-70`}
                    aria-label="Montserrat font"
                  >
                    Teks 3
                  </button>
                  <button
                    onClick={() => handleFontFamilyChange("openDyslexic")}
                    className={`${getActiveButtonClass(fontFamily === "openDyslexic")} openDyslexicFont openDyslexicFont rounded-lg py-2 transition-opacity hover:opacity-70`}
                    aria-label="Open Dyslexic font"
                  >
                    Teks 4
                  </button>
                </div>
              </div>

              {/* Mode Baca */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-2">
                  <Icon
                    icon={"solar:notebook-minimalistic-linear"}
                    className="h-5 w-5"
                  />
                  <p className="montserratFont text-sm font-semibold">
                    Mode Baca
                  </p>
                </div>
                <div className="montserratFont grid grid-cols-2 items-center justify-between gap-2 text-sm">
                  <button
                    onClick={() => handleReadingModeChange("scroll")}
                    className={`${getActiveButtonClass(readingMode === "scroll")} flex items-center justify-center gap-2 rounded-lg py-2 transition-opacity hover:opacity-70`}
                    aria-label="Scroll reading mode"
                  >
                    <Icon icon={"lucide:scroll"} className="h-5 w-5" />
                    Scroll
                  </button>
                  <button
                    onClick={() => handleReadingModeChange("page")}
                    className={`${getActiveButtonClass(readingMode === "page")} flex items-center justify-center gap-2 rounded-lg py-2 transition-opacity hover:opacity-70`}
                    aria-label="Page reading mode"
                  >
                    <Icon
                      icon={"solar:notebook-minimalistic-linear"}
                      className="h-5 w-5"
                    />
                    Page
                  </button>
                </div>
              </div>

              {/* Report Button */}
              <Link
                href={`/report/episode_ebook/${id}`}
                className={`flex flex-row items-center gap-2 transition-opacity hover:opacity-70 ${colorTheme === "dark" ? "text-white" : "text-black"}`}
                onClick={() => {
                  setMobileMenuOpen(false);
                  sendLogToServer("REPORT_CLICK", currentPage);
                }}
              >
                <Icon icon={"solar:flag-2-linear"} className="h-6 w-6" />
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
        <div
          className={`relative mt-16 flex shadow-md shadow-black ${readingMode === "scroll" ? "w-full" : "w-max"} mx-auto max-w-[210mm] flex-col ${colorTheme === "dark" ? "text-white" : "text-[#222222]"}`}
        >
          <div className="flex flex-col justify-center">
            {/* Pembungkus EpubReader */}
            <div
              className={`relative z-20 flex h-fit w-full touch-pan-y flex-col select-none ${colorTheme === "dark" ? "text-white" : "text-[#222222]"}`}
              style={{ isolation: "isolate" }}
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
                  topBarHeight={64}
                  bottomBarHeight={isBottomBarOpen ? 176 : 56}
                  onLoadingChange={setIsReaderLoading}
                />
              )}
            </div>
          </div>
        </div>

        {isReaderLoading && <LoadingOverlay message="Rendering reader…" />}

        {/* Catatan Kreator */}
        <section
          className={`relative flex w-screen flex-col px-4 pt-5 pb-40 ${colorTheme === "dark" ? "text-white" : "text-[#222222]"} md:mt-4 md:px-15`}
        >
          <div
            className={`w-full rounded-xl p-4 ${colorTheme === "dark" ? "bg-[#2f2f2f] text-white" : "bg-[#DEDEDE] text-[#222222]"}`}
          >
            <h4
              className={`${colorTheme === "dark" ? "text-white/70" : "text-black/60"} font-bold`}
            >
              Catatan Kreator
            </h4>
            <p
              className={`${colorTheme === "dark" ? "text-white" : "text-[#222222]"}`}
            >
              {creatorNotes}
            </p>
          </div>
        </section>

        {/* Audio Book */}
        {audioEbookUrl && (
          <AudioEbookButton
            audioUrl={audioEbookUrl}
            isDark={colorTheme === "dark"}
          />
        )}

        <div>
          {readingMode === "page" && (
            <div className="pointer-events-none fixed inset-0 z-30 flex h-screen w-screen">
              {/* Left Half - Previous Page */}
              <div
                className="pointer-events-auto h-full w-1/2 cursor-pointer"
                onClick={handlePreviousPage}
              />
              {/* Right Half - Next Page */}
              <div
                className="pointer-events-auto h-full w-1/2 cursor-pointer"
                onClick={handleNextPage}
              />
            </div>
          )}

          {/* Navigation Bar with Progress (collapsible) */}
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
                      onClick={() => {
                        setIsBottomBarOpen(false);
                        sendLogToServer("COLLAPSE_BAR", currentPage);
                      }}
                      aria-label="Tutup panel navigasi"
                      aria-expanded={isBottomBarOpen}
                    >
                      <Icon
                        icon={"solar:alt-arrow-down-line-duotone"}
                        className="h-6 w-6 md:h-8 md:w-8"
                      />
                    </button>
                    <p className="text-sm md:text-base">
                      Halaman {currentPage} dari {totalPages}
                    </p>
                    <img
                      src={iconCommentComic.src}
                      className={`h-6 w-6 cursor-pointer transition-opacity hover:opacity-70 md:h-8 md:w-8`}
                      onClick={() => {
                        setIsCommentVisible(true);
                        sendLogToServer("OPEN_COMMENT", currentPage);
                        handleOpenCommentModal();
                      }}
                    />
                  </div>
                  <div className="grid w-full grid-cols-2 gap-2 pb-2 md:gap-4">
                    <Link
                      href={
                        episodeEbookPrevId
                          ? `/ebooks/read/${episodeEbookPrevId}`
                          : "#"
                      }
                      onClick={() => {
                        if (episodeEbookPrevId) {
                          sendLogToServer("PREV_EPISODE_CLICK", currentPage);
                        }
                      }}
                      className={`flex h-10 w-full items-center justify-center rounded-lg bg-black/50 text-white shadow-xl backdrop-blur-sm transition-all md:h-12 ${episodeEbookPrevId ? "cursor-pointer hover:bg-black/80" : "pointer-events-none cursor-not-allowed opacity-50"}`}
                      aria-disabled={!episodeEbookPrevId}
                      tabIndex={episodeEbookPrevId ? 0 : -1}
                    >
                      <Icon
                        icon={"solar:alt-arrow-left-linear"}
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
                      onClick={() => {
                        if (episodeEbookNextId) {
                          sendLogToServer("NEXT_EPISODE_CLICK", currentPage);
                        }
                      }}
                      className={`flex h-10 w-full items-center justify-center rounded-lg bg-black/50 text-white shadow-xl backdrop-blur-sm transition-all md:h-12 ${episodeEbookNextId ? "cursor-pointer hover:bg-black/80" : "pointer-events-none cursor-not-allowed opacity-50"}`}
                      aria-disabled={!episodeEbookNextId}
                      tabIndex={episodeEbookNextId ? 0 : -1}
                    >
                      <p className="text-sm md:text-base">Bagian Selanjutnya</p>
                      <Icon
                        icon={"solar:alt-arrow-right-linear"}
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
                  onClick={() => {
                    setIsBottomBarOpen(true);
                    sendLogToServer("EXPAND_BAR", currentPage);
                  }}
                  aria-label="Buka panel navigasi"
                  aria-expanded={isBottomBarOpen}
                >
                  <Icon
                    icon={"solar:alt-arrow-up-line-duotone"}
                    className="h-6 w-6 md:h-8 md:w-8"
                  />
                </button>
                <p className="text-sm md:text-base">
                  Halaman {currentPage} dari {totalPages}
                </p>
                <img
                  src={iconCommentComic.src}
                  className={`h-6 w-6 cursor-pointer transition-opacity hover:opacity-70 md:h-8 md:w-8`}
                  onClick={() => {
                    setIsCommentVisible(true);
                    sendLogToServer("OPEN_COMMENT", currentPage);
                    handleOpenCommentModal();
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <EbookModal
          isOpen={isModalTutorialOpen}
          onClose={() => {
            setIsModalTutorialOpen(false);
            sendLogToServer("CLOSE_TUTORIAL", currentPage);
          }}
        >
          <div className="flex w-[290px] flex-col gap-4 px-4 md:w-[500px] md:px-8">
            <h2 className="zeinFont text-xl font-bold text-white md:text-3xl">
              Welcome to Your Reader
            </h2>
            <div className="flex flex-row gap-3">
              <div className="h-max w-max rounded-lg bg-[#515151] p-2">
                <Icon
                  icon={"solar:cursor-outline"}
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
                  icon={"solar:menu-dots-bold"}
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
                  icon={"solar:arrow-to-down-left-outline"}
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
                onClick={() => {
                  setIsModalTutorialOpen(false);
                  sendLogToServer("START_READING", currentPage);
                }}
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