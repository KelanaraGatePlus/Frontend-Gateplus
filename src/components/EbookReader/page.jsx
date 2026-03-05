/* eslint-disable react/prop-types */
"use client";

import ePub from "epubjs";
import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { Scrollama, Step } from "react-scrollama";
import { useApplyReadProgressMutation } from "@/hooks/api/readProgressAPI";
import React from "react";

const FONT_FAMILIES = {
  montserrat: { class: "montserratFont", value: '"Montserrat", sans-serif' },
  openDyslexic: {
    class: "openDyslexicFont",
    value: '"OpenDyslexic", sans-serif',
  },
  merriweather: { class: "merriweatherFont", value: '"Merriweather", serif' },
  inter: { class: "interFont", value: '"Inter", sans-serif' },
};

const LINE_HEIGHTS = { compact: 1.2, normal: 1.4, relaxed: 1.6 };
const TEXT_ALIGNS = { left: "left", justify: "justify" };
const COLOR_THEMES = {
  dark: { bg: "#222222", text: "#F5F5F5" },
  sepia: { bg: "#E8DFC8", text: "#4A3F2C" },
  light: { bg: "#F5F5F5", text: "#1A1A1A" },
};

const EpubReader = forwardRef(
  (
    {
      epubUrl,
      initialFontSizeFactor = 1.0,
      onFontSizeChange = null,
      onLoadingChange = null,
      fontFamily = "inter",
      lineHeight = "normal",
      textAlign = "justify",
      colorTheme = "dark",
      readingMode = "scroll",
      onProgressChange = null,
      episodeEbookId = undefined,
      episodeComicId = undefined,
      currentPage = 1,
      cfiPosition = null,
      bottomBarHeight = 176,
      topBarHeight = 64,
    },
    ref,
  ) => {
    const viewerRef = useRef(null);
    const renditionRef = useRef(null);
    const bookRef = useRef(null);
    const locationsReadyRef = useRef(false);
    const lastCfiRef = useRef(null);
    const [fontSizeFactor, setFontSizeFactor] = useState(initialFontSizeFactor);
    const [applyReadProgress] = useApplyReadProgressMutation();
    const debounceTimerRef = useRef(null);
    const initialNavDoneRef = useRef(false);
    const readyToLogRef = useRef(false);
    const skippedInitialLogRef = useRef(false);
    const lastScrollPositionRef = useRef(0);
    const pageStatsRef = useRef({ current: 1, total: 1 });
    const pageNumbersInjectedRef = useRef(false);
    const injectPageNumbersTimeoutRef = useRef(null);
    const initialPageRef = useRef(currentPage);
    const initialCfiRef = useRef(cfiPosition);

    const getUsablePageHeight = useCallback(() => {
      if (typeof window === "undefined") return 560;
      const top = Number(topBarHeight || 0);
      const bottom = Number(bottomBarHeight || 176);
      return Math.max(0, window.innerHeight - top - bottom);
    }, [topBarHeight, bottomBarHeight]);

    const injectPageNumbers = useCallback(() => {
      // Hanya jalankan di mode scroll dan pastikan rendition sudah siap
      if (
        readingMode !== "scroll" ||
        !renditionRef.current ||
        !viewerRef.current
      )
        return;

      // Guard: Cegah multiple injections
      if (pageNumbersInjectedRef.current) return;

      const doc = viewerRef.current?.querySelector("iframe")?.contentDocument;
      if (!doc) return;

      // 1. Bersihkan marker lama agar tidak terjadi penumpukan elemen
      doc.querySelectorAll(".virtual-page-marker").forEach((el) => el.remove());

      const body = doc.body;
      const viewerWidth = viewerRef.current.offsetWidth;

      // Hitung dimensi berdasarkan rasio A4 (297/210)
      const pageHeight = viewerWidth * (297 / 210);
      const totalHeight = body.scrollHeight;
      const totalPages = Math.ceil(totalHeight / pageHeight);
      const textColor = COLOR_THEMES[colorTheme]?.text || "#000000";

      // Ambil semua elemen paragraf/div sebagai target penempatan
      const elements = Array.from(
        body.querySelectorAll("p, div, h1, h2, h3, img, section"),
      );
      const docOffset = doc.defaultView?.pageYOffset || 0;

      for (let i = 1; i <= totalPages; i++) {
        const marker = doc.createElement("div");
        marker.className = "virtual-page-marker";

        Object.assign(marker.style, {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "30px 0",
          marginTop: "50px",
          marginBottom: "50px",
          pointerEvents: "none",
          borderBottom: `1px solid ${textColor}15`,
        });

        marker.innerHTML = `
      <span style="color: ${textColor}44; font-size: 11px; font-family: sans-serif; letter-spacing: 2px; font-weight: bold;">
        --- HALAMAN ${i} / ${totalPages} ---
      </span>
    `;

        const targetY = i * pageHeight;

        // Cari elemen yang tepat untuk disisipkan marker di bawahnya
        const closestElement = elements.find((el) => {
          const rect = el.getBoundingClientRect();
          return rect.top + docOffset > targetY;
        });

        if (closestElement) {
          closestElement.parentNode.insertBefore(marker, closestElement);
        } else {
          body.appendChild(marker);
        }
      }

      // Mark as injected
      pageNumbersInjectedRef.current = true;
    }, [readingMode, colorTheme]);

    // State untuk informasi halaman (Virtual Paging)
    const [pageStats, setPageStats] = useState({ current: 1, total: 1 });

    // Kirim progress baca ke backend tiap kali halaman berubah (debounce)
    useEffect(() => {
      // Hindari mengirim progress saat inisialisasi awal
      if (!readyToLogRef.current) return;

      // Lewati satu kali emit pertama setelah siap agar tidak overwrite progress awal
      if (!skippedInitialLogRef.current) {
        skippedInitialLogRef.current = true;
        return;
      }

      const hasEbook = !!episodeEbookId;
      const hasComic = !!episodeComicId;
      // Harus pilih salah satu id agar lolos schema refine
      if (hasEbook === hasComic) return;

      const pageZeroBased = Math.max(
        0,
        (pageStatsRef.current.current || 1) - 1,
      );
      const isFinish = pageStatsRef.current.total
        ? pageStatsRef.current.current >= pageStatsRef.current.total
        : false;

      // Debounce agar tidak spam request saat user scroll cepat
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        const body = {
          page: pageZeroBased,
          totalPages: pageStatsRef.current.total || 1,
          isFinish: isFinish || undefined,
          episodeEbookId: hasEbook ? episodeEbookId : undefined,
          episodeComicId: hasComic ? episodeComicId : undefined,
          // Catat CFI hanya untuk mode halaman (paginated)
          cfiString:
            readingMode === "page"
              ? lastCfiRef.current || undefined
              : undefined,
        };
        try {
          applyReadProgress(body);
        } catch (e) {
          console.error("Gagal mengirim progress baca:", e);
        }
      }, 400);

      return () => {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      };
    }, [
      pageStats.current,
      pageStats.total,
      episodeEbookId,
      episodeComicId,
      applyReadProgress,
      readingMode,
    ]);

    const getFontFamily = useCallback(() => {
      const fam = FONT_FAMILIES[fontFamily];
      return fam ? fam.value : FONT_FAMILIES.inter.value;
    }, [fontFamily]);

    const updateScrollProgress = useCallback(() => {
      if (readingMode !== "scroll" || !viewerRef.current) return;

      const scrollTop =
        window.scrollY || document.documentElement.scrollTop || 0;
      const scrollHeight = document.documentElement.scrollHeight || 0;
      const clientHeight = window.innerHeight || 0;
      const container = viewerRef.current;

      const virtualPageHeight = container.offsetWidth * (297 / 210);

      const currentVirtualPage = Math.ceil(
        (scrollTop + clientHeight) / virtualPageHeight,
      );
      const totalVirtualPages = Math.ceil(scrollHeight / virtualPageHeight);

      const current = Math.max(1, currentVirtualPage);
      const total = Math.max(1, totalVirtualPages);

      // Only update state if page number actually changed (prevent unnecessary re-renders)
      if (
        pageStatsRef.current.current !== current ||
        pageStatsRef.current.total !== total
      ) {
        pageStatsRef.current = { current, total };
        setPageStats({ current, total });
      }

      const progressRatio =
        scrollHeight > 0
          ? Math.min(1, (scrollTop + clientHeight) / scrollHeight)
          : 0;
      const progressPercent = Math.round(progressRatio * 100);
      onProgressChange?.({
        progress: progressPercent,
        currentPage: current,
        totalPages: total,
      });

      // Store scroll position to prevent reset
      lastScrollPositionRef.current = scrollTop;
    }, [readingMode, onProgressChange]);

    const applyTheme = useCallback(
      (theme = colorTheme, lh = lineHeight, align = textAlign) => {
        if (!renditionRef.current) return;

        const themeColors = COLOR_THEMES[theme] || COLOR_THEMES.dark;

        renditionRef.current.themes.register("custom-theme", {
          body: {
            background: `${themeColors.bg} !important`,
            color: `${themeColors.text} !important`,
            "font-family": `${getFontFamily()} !important`,
            "line-height": `${LINE_HEIGHTS[lh] || LINE_HEIGHTS.normal} !important`,
            "text-align": `${TEXT_ALIGNS[align] || TEXT_ALIGNS.justify} !important`,
            "-webkit-user-select": "none !important",
            "user-select": "none !important",
            padding: "40px 30px !important",
            "box-sizing": "border-box !important",
            "max-width": "100% !important",
            "word-break": "break-word !important",
            "overflow-wrap": "anywhere !important",
            height: readingMode === "page" ? "auto" : "auto !important",
          },
          html: {
            height: readingMode === "page" ? "100%" : "auto !important",
            "-webkit-user-select": "none !important",
            "user-select": "none !important",
          },
          img: {
            width: "auto !important",
            maxWidth: "100% !important",
            height: "auto !important",
          },
        });

        renditionRef.current.themes.select("custom-theme");
      },
      [colorTheme, lineHeight, textAlign, readingMode, getFontFamily],
    );

    // Protect iframe document: block copy, right-click, and devtools keys
    const protectIframeDocument = useCallback((doc) => {
      if (!doc) return;
      // Avoid duplicate style injection
      if (!doc.getElementById("no-select-style")) {
        const style = doc.createElement("style");
        style.id = "no-select-style";
        style.textContent = `html, body { -webkit-user-select: none !important; user-select: none !important; }`;
        doc.head.appendChild(style);
      }
      const prevent = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };
      const blockKeys = (e) => {
        const key = (e.key || "").toUpperCase();
        const ctrl = e.ctrlKey || e.metaKey;
        const shift = e.shiftKey;
        if (
          key === "F12" ||
          (ctrl && shift && ["I", "J", "C"].includes(key)) ||
          (ctrl && ["U", "S", "P", "C", "A"].includes(key))
        ) {
          prevent(e);
        }
      };
      doc.addEventListener("contextmenu", prevent, true);
      doc.addEventListener("copy", prevent, true);
      doc.addEventListener("cut", prevent, true);
      doc.addEventListener("paste", prevent, true);
      doc.addEventListener("selectstart", prevent, true);
      doc.addEventListener("keydown", blockKeys, true);
    }, []);

    // Inject Google Fonts into iframe so Montserrat/Inter/Merriweather are available
    const injectGoogleFonts = useCallback((doc) => {
      if (!doc) return;
      const ensureLink = (id, href) => {
        if (doc.getElementById(id)) return;
        const link = doc.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = href;
        doc.head.appendChild(link);
      };
      ensureLink(
        "gf-montserrat",
        "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap",
      );
      ensureLink(
        "gf-inter-merri",
        "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&display=swap",
      );
    }, []);

    // Strip default Table of Contents and common "Contents" labels from rendered document
    const stripTOCAndContentLabels = useCallback((doc) => {
      if (!doc) return;

      // Remove typical TOC containers
      const tocSelectors = [
        "#toc",
        ".toc",
        'nav[role="doc-toc"]',
        'nav[epub\\:type="toc"]',
        "nav.toc",
        "section.toc",
        "div.toc",
      ];
      tocSelectors.forEach((sel) => {
        doc.querySelectorAll(sel).forEach((el) => el.remove());
      });

      // Remove headings or paragraphs that are exactly these labels (case-insensitive)
      const labels = new Set([
        "table of contents",
        "contents",
        "daftar isi",
        "content",
      ]);
      doc.querySelectorAll("h1, h2, h3, h4, p").forEach((el) => {
        const text = (el.textContent || "").trim().toLowerCase();
        if (labels.has(text)) el.remove();
      });
      const topLists = Array.from(doc.body.querySelectorAll("ol, ul")).filter(
        (lst) => {
          const rect = lst.getBoundingClientRect();
          return (
            rect.top < (doc.defaultView?.innerHeight || 800) * 0.3 &&
            lst.querySelector("a")
          );
        },
      );
      topLists.forEach((lst) => {
        // If list has many anchors and short text items, likely a TOC
        const items = Array.from(lst.querySelectorAll("li"));
        const anchorCount = Array.from(lst.querySelectorAll("a")).length;
        if (
          items.length >= 5 &&
          anchorCount >= Math.max(5, Math.floor(items.length * 0.6))
        ) {
          lst.remove();
        }
      });
    }, []);

    // Ensure OpenDyslexic font-face is available in the iframe document
    const injectOpenDyslexicFace = useCallback(
      (doc) => {
        if (!doc || fontFamily !== "openDyslexic") return;
        if (doc.getElementById("open-dyslexic-face")) return;
        const style = doc.createElement("style");
        style.id = "open-dyslexic-face";
        style.textContent = `
        @font-face { font-family: 'OpenDyslexic'; src: url('/fonts/OpenDyslexic-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
        @font-face { font-family: 'OpenDyslexic'; src: url('/fonts/OpenDyslexic-Italic.woff2') format('woff2'); font-weight: 400; font-style: italic; font-display: swap; }
        @font-face { font-family: 'OpenDyslexic'; src: url('/fonts/OpenDyslexic-Bold.woff2') format('woff2'); font-weight: 700; font-style: normal; font-display: swap; }
        @font-face { font-family: 'OpenDyslexic'; src: url('/fonts/OpenDyslexic-BoldItalic.woff2') format('woff2'); font-weight: 700; font-style: italic; font-display: swap; }
      `;
        doc.head.appendChild(style);
      },
      [fontFamily],
    );

    // validasi CFI
    const isValidCfi = useCallback((cfi, book) => {
      if (!cfi || !book || !book.locations) return false;
      try {
        book.locations.percentageFromCfi(cfi);
        return true;
      } catch (err) {
        console.warn("CFI validation failed:", cfi, err);
        return false;
      }
    }, []);

    useEffect(() => {
      if (!epubUrl || !viewerRef.current) return;

      // ✅ FIX: Reset semua ref state saat epubUrl berubah (mount baru)
      initialNavDoneRef.current = false;
      readyToLogRef.current = false;
      skippedInitialLogRef.current = false;
      pageNumbersInjectedRef.current = false;
      lastCfiRef.current = null;
      pageStatsRef.current = { current: 1, total: 1 };

      // ✅ FIX: Snapshot props saat mount (bukan saat render — ini yang kritis)
      const initialPage = initialPageRef.current;
      const initialCfi = initialCfiRef.current;

      console.log(
        "[EpubReader] Mount dengan initialPage:",
        initialPage,
        "| initialCfi:",
        initialCfi,
      );

      try {
        onLoadingChange?.(true);
      } catch {
        console.warn("onLoadingChange gagal dipanggil.");
      }

      viewerRef.current.innerHTML = "";
      const book = ePub(epubUrl);
      bookRef.current = book;

      const isPageMode = readingMode === "page";
      const vh = typeof window !== "undefined" ? window.innerHeight : 800;
      const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
      const usableHeightInit = Math.max(0, vh - (bottomBarHeight || 176));
      const widthPxInit = Math.min(
        Math.round((usableHeightInit * 210) / 297),
        vw,
      );

      const rendition = book.renderTo(viewerRef.current, {
        width: isPageMode ? widthPxInit : "100%",
        height: isPageMode ? usableHeightInit : "100%",
        flow: isPageMode ? "paginated" : "scrolled",
        manager: isPageMode ? "default" : "continuous",
        spread: "none",
        allowScriptedContent: true,
      });

      renditionRef.current = rendition;

      book.ready.then(() => {
        const firstRealContent = book.spine.items.find(
          (item) => !/toc|nav|cover|contents/i.test(item.href),
        );

        if (isPageMode && initialCfi) {
          rendition.display(initialCfi);
          console.log(
            "[EpubReader] Page mode: display langsung ke CFI:",
            initialCfi,
          );
        } else {
          rendition.display(firstRealContent?.href);
        }

        rendition.themes.fontSize(`${initialFontSizeFactor}rem`);

        rendition.on("rendered", () => {
          const doc =
            viewerRef.current?.querySelector("iframe")?.contentDocument;

          try {
            onLoadingChange?.(false);
          } catch {
            /* silent */
          }

          if (injectPageNumbersTimeoutRef.current) {
            clearTimeout(injectPageNumbersTimeoutRef.current);
          }
          injectPageNumbersTimeoutRef.current = setTimeout(() => {
            if (readingMode === "scroll") injectPageNumbers();
          }, 2000);

          protectIframeDocument(doc);
          injectGoogleFonts(doc);
          injectOpenDyslexicFace(doc);
          stripTOCAndContentLabels(doc);

          if (readingMode === "scroll" && !initialNavDoneRef.current) {
            const target = Math.max(1, Number(initialPage) || 1);
            if (target > 1) {
              setTimeout(() => {
                const container = viewerRef.current;
                if (!container) return;
                const virtualPageHeight = container.offsetWidth * (297 / 210);
                const top = (target - 1) * virtualPageHeight;
                console.log(
                  "[EpubReader] Scroll mode: restore ke posisi",
                  top,
                  "px (page",
                  target,
                  ")",
                );
                window.scrollTo({ top, behavior: "auto" });
                initialNavDoneRef.current = true;
                readyToLogRef.current = true;
              }, 600);
            } else {
              // Scroll mode without page jump - mark as ready immediately
              initialNavDoneRef.current = true;
              readyToLogRef.current = true;
            }
          }
        });

        // Generate locations untuk kalkulasi persentase yang akurat
        book.locations
          .generate(1000)
          .then(() => {
            locationsReadyRef.current = true;
            console.log("✓ Locations generated");

            // JANGAN akses currentLocation di sini - terlalu awal
            // Hanya set flag bahwa locations siap

            // Initial navigation untuk page mode - DELAY untuk beri waktu render
            if (isPageMode && !initialNavDoneRef.current) {
              const target = Math.max(1, Number(initialPage) || 1);

              setTimeout(() => {
                if (target > 1) {
                  if (initialCfi) {
                    // CFI sudah di-display dari awal, tidak perlu navigasi lagi
                    console.log(
                      "[EpubReader] Page mode: sudah di CFI, skip navigasi",
                    );
                  } else {
                    // Tidak ada CFI, gunakan percentage fallback
                    try {
                      const totalLoc =
                        book.locations.total || book.spine.length || 1;
                      const targetPct = Math.min(
                        1,
                        Math.max(0, (target - 1) / totalLoc),
                      );
                      const targetCfi =
                        book.locations.cfiFromPercentage?.(targetPct);
                      if (targetCfi) {
                        renditionRef.current?.display(targetCfi);
                        console.log(
                          "[EpubReader] Page mode: navigasi via percentage",
                          targetPct,
                        );
                      }
                    } catch (err) {
                      console.warn(
                        "[EpubReader] Percentage navigation gagal:",
                        err,
                      );
                    }
                  }
                }
                initialNavDoneRef.current = true;
                readyToLogRef.current = true;
              }, 800);
            } else if (!isPageMode) {
              // Scroll mode sudah ditangani di rendered event
              // Pastikan readyToLog aktif
              if (initialNavDoneRef.current) {
                readyToLogRef.current = true;
              }
            }
          })
          .catch((err) => {
            console.error("❌ Locations generation failed:", err);
            locationsReadyRef.current = false;

            // FALLBACK: Tetap bisa baca meski locations fail
            if (isPageMode && !initialNavDoneRef.current) {
              const target = Math.max(1, Number(initialPage) || 1);
              if (target > 1 && !initialCfi) {
                // Stepping fallback
                setTimeout(() => {
                  let count = 0;
                  const step = () => {
                    if (count >= target - 1) return;
                    renditionRef.current?.next();
                    count++;
                    setTimeout(step, 100);
                  };
                  step();
                  initialNavDoneRef.current = true;
                  readyToLogRef.current = true;
                }, 500);
              } else {
                initialNavDoneRef.current = true;
                readyToLogRef.current = true;
              }
            }
          });

        if (readingMode === "scroll") {
          window.addEventListener("scroll", updateScrollProgress);
          setTimeout(updateScrollProgress, 1000);
        }

        rendition.on("relocated", (location) => {
          if (isPageMode) {
            const displayed = location.start?.displayed;
            let currentLocal = pageStatsRef.current.current;
            let totalLocal = pageStatsRef.current.total;

            if (displayed) {
              currentLocal = displayed.page;
              totalLocal = displayed.total;
              pageStatsRef.current = {
                current: currentLocal,
                total: totalLocal,
              };
              setPageStats({ current: currentLocal, total: totalLocal });
            }

            let cfi = location.start?.cfi || location?.end?.cfi;
            if (cfi) {
              try {
                lastCfiRef.current = cfi;
              } catch (err) {
                console.warn("CFI save skipped:", err);
              }
            }

            let progressPercent = 0;
            if (locationsReadyRef.current && cfi) {
              try {
                const pct = book.locations.percentageFromCfi(cfi);
                if (typeof pct === "number")
                  progressPercent = Math.round(pct * 100);
              } catch {
                progressPercent =
                  totalLocal > 0
                    ? Math.round((currentLocal / totalLocal) * 100)
                    : 0;
              }
            } else {
              progressPercent =
                totalLocal > 0
                  ? Math.round((currentLocal / totalLocal) * 100)
                  : 0;
            }

            onProgressChange?.({
              progress: progressPercent,
              currentPage: currentLocal,
              totalPages: totalLocal,
            });

            if (!readyToLogRef.current) readyToLogRef.current = true;
          } else {
            onProgressChange?.({
              progress: undefined,
              currentPage: pageStatsRef.current.current,
              totalPages: pageStatsRef.current.total,
            });
            if (!readyToLogRef.current) readyToLogRef.current = true;
          }
        });
      });

      return () => {
        book.destroy();
        window.removeEventListener("scroll", updateScrollProgress);
        if (injectPageNumbersTimeoutRef.current) {
          clearTimeout(injectPageNumbersTimeoutRef.current);
        }
        try {
          onLoadingChange?.(false);
        } catch {
          /* silent */
        }
      };
    }, [
      epubUrl,
      readingMode,
      updateScrollProgress,
      onProgressChange,
      isValidCfi,
      getUsablePageHeight,
      bottomBarHeight,
    ]);

    // Resize rendition when bottom bar visibility/height changes
    useEffect(() => {
      if (typeof window === "undefined") return;
      const rendition = renditionRef.current;
      const container = viewerRef.current;
      if (!rendition || !container) return;

      if (readingMode === "page") {
        const usableHeight = getUsablePageHeight();
        const widthPx = Math.min(
          Math.round((usableHeight * 210) / 297),
          window.innerWidth,
        );
        container.style.height = `${usableHeight}px`;
        container.style.minHeight = `${usableHeight}px`;
        container.style.width = `${widthPx}px`;
        try {
          rendition.resize(widthPx, usableHeight);
        } catch (e) {
          console.warn("rendition.resize gagal:", e);
        }
      }
    }, [bottomBarHeight, topBarHeight, readingMode, getUsablePageHeight]);

    // ─── Apply theme saat setting berubah ────────────────────────────────────────
    useEffect(() => {
      if (!renditionRef.current) return;
      applyTheme();

      if (readingMode === "scroll" && pageNumbersInjectedRef.current) {
        pageNumbersInjectedRef.current = false;
        if (injectPageNumbersTimeoutRef.current)
          clearTimeout(injectPageNumbersTimeoutRef.current);
        injectPageNumbersTimeoutRef.current = setTimeout(() => {
          injectPageNumbers();
        }, 1000);
      }
    }, [
      colorTheme,
      lineHeight,
      textAlign,
      fontFamily,
      readingMode,
      applyTheme,
      injectPageNumbers,
    ]);

    const changeFontSize = (delta) => {
      const next = Math.max(0.8, Math.min(1.5, fontSizeFactor + delta));
      setFontSizeFactor(next);
      renditionRef.current?.themes.fontSize(`${next}rem`);
      onFontSizeChange?.(next);

      if (readingMode === "scroll") {
        pageNumbersInjectedRef.current = false;
        if (injectPageNumbersTimeoutRef.current)
          clearTimeout(injectPageNumbersTimeoutRef.current);
        injectPageNumbersTimeoutRef.current = setTimeout(() => {
          injectPageNumbers();
        }, 1500);
      }
    };

    useImperativeHandle(ref, () => ({
      changeFontSize,
      goToPreviousPage: () => renditionRef.current?.prev(),
      goToNextPage: () => renditionRef.current?.next(),
    }));

    return (
      <Scrollama offset={0.2}>
        <Step data={1}>
          <div className="relative flex min-h-screen w-full flex-col items-center bg-transparent">
            <div
              ref={viewerRef}
              className="epub-viewport mx-auto shadow-2xl"
              style={{
                height:
                  readingMode === "page"
                    ? `calc(100dvh - ${topBarHeight + bottomBarHeight}px)`
                    : "auto",
                minHeight:
                  readingMode === "page"
                    ? `calc(100dvh - ${topBarHeight + bottomBarHeight}px)`
                    : "100vh",
                width:
                  readingMode === "page"
                    ? `min(calc((100dvh - ${topBarHeight + bottomBarHeight}px) * 210 / 297), 100vw)`
                    : "100%",
                maxWidth: readingMode === "page" ? "100vw" : "800px",
                backgroundColor: COLOR_THEMES[colorTheme]?.bg,
              }}
            />
          </div>
        </Step>
      </Scrollama>
    );
  },
);

EpubReader.displayName = "EpubReader";
export default EpubReader;
