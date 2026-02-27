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
  openDyslexic: { class: "openDyslexicFont", value: '"OpenDyslexic", sans-serif' },
  merriweather: { class: "merriweatherFont", value: '"Merriweather", serif' },
  inter: { class: "interFont", value: '"Inter", sans-serif' },
};

const LINE_HEIGHTS = { compact: 1.2, normal: 1.4, relaxed: 1.6 };
const TEXT_ALIGNS = { left: "left", justify: "justify" };
const COLOR_THEMES = {
  dark: { bg: "#222222", text: "#F5F5F5" },
  sepia: { bg: "#E8DFC8", text: "#4A3F2C" },
  light: { bg: "#F5F5F5", text: "#1A1A1A" }
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
    },
    ref
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

    const injectPageNumbers = useCallback(() => {
      // Hanya jalankan di mode scroll dan pastikan rendition sudah siap
      if (readingMode !== "scroll" || !renditionRef.current || !viewerRef.current) return;

      // Guard: Cegah multiple injections
      if (pageNumbersInjectedRef.current) return;

      const doc = viewerRef.current?.querySelector("iframe")?.contentDocument;
      if (!doc) return;

      // 1. Bersihkan marker lama agar tidak terjadi penumpukan elemen
      doc.querySelectorAll(".virtual-page-marker").forEach(el => el.remove());

      const body = doc.body;
      const viewerWidth = viewerRef.current.offsetWidth;

      // Hitung dimensi berdasarkan rasio A4 (297/210)
      const pageHeight = viewerWidth * (297 / 210);
      const totalHeight = body.scrollHeight;
      const totalPages = Math.ceil(totalHeight / pageHeight);
      const textColor = COLOR_THEMES[colorTheme]?.text || "#000000";

      // Ambil semua elemen paragraf/div sebagai target penempatan
      const elements = Array.from(body.querySelectorAll("p, div, h1, h2, h3, img, section"));
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
        const closestElement = elements.find(el => {
          const rect = el.getBoundingClientRect();
          return (rect.top + docOffset) > targetY;
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

      const pageZeroBased = Math.max(0, (pageStatsRef.current.current || 1) - 1);
      const isFinish = pageStatsRef.current.total ? pageStatsRef.current.current >= pageStatsRef.current.total : false;

      // Debounce agar tidak spam request saat user scroll cepat
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        const body = {
          page: pageZeroBased,
          isFinish: isFinish || undefined,
          episodeEbookId: hasEbook ? episodeEbookId : undefined,
          episodeComicId: hasComic ? episodeComicId : undefined,
          // Catat CFI hanya untuk mode halaman (paginated)
          cfiString: readingMode === "page" ? (lastCfiRef.current || undefined) : undefined,
        };
        try {
          // Trigger RTK Query mutation; ignore result for fire-and-forget
          applyReadProgress(body);
        } catch (e) {
          console.error("Gagal mengirim progress baca:", e);
        }
      }, 400);

      return () => {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      };
    }, [pageStats.current, pageStats.total, episodeEbookId, episodeComicId, applyReadProgress, readingMode]);

    const getFontFamily = useCallback(() => {
      const fam = FONT_FAMILIES[fontFamily];
      return fam ? fam.value : FONT_FAMILIES.inter.value;
    }, [fontFamily]);

    const updateScrollProgress = useCallback(() => {
      if (readingMode !== "scroll" || !viewerRef.current) return;

      const container = viewerRef.current;
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const scrollHeight = document.documentElement.scrollHeight || 0;
      const clientHeight = window.innerHeight || 0;

      const virtualPageHeight = container.offsetWidth * (297 / 210);

      const currentVirtualPage = Math.ceil((scrollTop + clientHeight) / virtualPageHeight);
      const totalVirtualPages = Math.ceil(scrollHeight / virtualPageHeight);

      const current = Math.max(1, currentVirtualPage);
      const total = Math.max(1, totalVirtualPages);

      // Only update state if page number actually changed (prevent unnecessary re-renders)
      if (pageStatsRef.current.current !== current || pageStatsRef.current.total !== total) {
        pageStatsRef.current = { current, total };
        setPageStats({ current, total });
      }

      const progressRatio = scrollHeight > 0 ? Math.min(1, (scrollTop + clientHeight) / scrollHeight) : 0;
      const progressPercent = Math.round(progressRatio * 100);
      onProgressChange?.({ progress: progressPercent, currentPage: current, totalPages: total });

      // Store scroll position to prevent reset
      lastScrollPositionRef.current = scrollTop;
    }, [readingMode, onProgressChange]);

    const applyTheme = useCallback((theme = colorTheme, lh = lineHeight, align = textAlign) => {
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
        }
      });

      renditionRef.current.themes.select("custom-theme");
    }, [colorTheme, lineHeight, textAlign, readingMode, getFontFamily]);

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
      const prevent = (e) => { e.preventDefault(); e.stopPropagation(); };
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
        "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
      );
      ensureLink(
        "gf-inter-merri",
        "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&display=swap"
      );
    }, []);

    // Strip default Table of Contents and common "Contents" labels from rendered document
    const stripTOCAndContentLabels = useCallback((doc) => {
      if (!doc) return;

      // Remove typical TOC containers
      const tocSelectors = [
        '#toc',
        '.toc',
        'nav[role="doc-toc"]',
        'nav[epub\\:type="toc"]',
        'nav.toc',
        'section.toc',
        'div.toc',
      ];
      tocSelectors.forEach((sel) => {
        doc.querySelectorAll(sel).forEach((el) => el.remove());
      });

      // Remove headings or paragraphs that are exactly these labels (case-insensitive)
      const labels = new Set([
        'table of contents',
        'contents',
        'daftar isi', // Indonesian common label
        'content',
      ]);
      const textNodesSelectors = ['h1', 'h2', 'h3', 'h4', 'p'];
      doc.querySelectorAll(textNodesSelectors.join(',')).forEach((el) => {
        const text = (el.textContent || '').trim().toLowerCase();
        if (labels.has(text)) {
          el.remove();
        }
      });

      // Some EPUBs place TOC lists without explicit toc classes; try heuristic
      // If a list immediately follows a removed heading, it will be left orphaned; prune large nav-like lists near top
      const body = doc.body;
      const topLists = Array.from(body.querySelectorAll('ol, ul')).filter((lst) => {
        const rect = lst.getBoundingClientRect();
        return rect.top < (doc.defaultView?.innerHeight || 800) * 0.3 && lst.querySelector('a');
      });
      topLists.forEach((lst) => {
        // If list has many anchors and short text items, likely a TOC
        const items = Array.from(lst.querySelectorAll('li'));
        const anchorCount = Array.from(lst.querySelectorAll('a')).length;
        if (items.length >= 5 && anchorCount >= Math.max(5, Math.floor(items.length * 0.6))) {
          lst.remove();
        }
      });
    }, []);

    // Ensure OpenDyslexic font-face is available in the iframe document
    const injectOpenDyslexicFace = useCallback((doc) => {
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
    }, [fontFamily]);

    useEffect(() => {
      if (!epubUrl || !viewerRef.current) return;

      // Notify parent that rendering is starting
      try { onLoadingChange?.(true); } catch {
        console.warn("onLoadingChange gagal dipanggil.");
      }

      viewerRef.current.innerHTML = "";
      const book = ePub(epubUrl);
      bookRef.current = book;

      const isPageMode = readingMode === "page";
      const vh = typeof window !== "undefined" ? window.innerHeight : 800;
      const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
      const usableHeightInit = Math.max(0, vh - (bottomBarHeight || 176));
      const widthPxInit = Math.min(Math.round(usableHeightInit * 210 / 297), vw);

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
          (item) => !/toc|nav|cover|contents/i.test(item.href)
        );
        rendition.display(cfiPosition || firstRealContent?.href);
        // Set initial font size only once on init; later changes use changeFontSize()
        rendition.themes.fontSize(`${initialFontSizeFactor}rem`);

        rendition.on("rendered", () => {
          const doc = viewerRef.current?.querySelector("iframe")?.contentDocument;

          onLoadingChange?.(false);

          // Berikan jeda 2 detik agar posisi scroll awal (restoration) stabil dulu
          if (injectPageNumbersTimeoutRef.current) {
            clearTimeout(injectPageNumbersTimeoutRef.current);
          }
          injectPageNumbersTimeoutRef.current = setTimeout(() => {
            if (readingMode === "scroll") {
              injectPageNumbers();
            }
          }, 2000);

          protectIframeDocument(doc);
          injectGoogleFonts(doc);
          injectOpenDyslexicFace(doc);
          // Remove default TOC and common content labels
          stripTOCAndContentLabels(doc);

          // Notify parent that initial render is complete
          try { onLoadingChange?.(false); } catch {
            console.warn("onLoadingChange gagal dipanggil.");
          }
          // Initial navigation for scroll mode: jump to provided currentPage
          if (readingMode === "scroll") {
            const target = Math.max(1, Number(currentPage) || 1);
            if (!initialNavDoneRef.current && target > 1) {
              setTimeout(() => {
                const container = viewerRef.current;
                if (!container) return;
                const virtualPageHeight = container.offsetWidth * (297 / 210);
                const top = (target - 1) * virtualPageHeight;
                window.scrollTo({ top, behavior: "auto" });
                initialNavDoneRef.current = true;
                readyToLogRef.current = true;
              }, 400);
            } else {
              // Scroll mode without page jump - mark as ready immediately
              initialNavDoneRef.current = true;
              readyToLogRef.current = true;
            }
          }
        });

        // Generate locations to enable accurate percentage calculation
        book.locations.generate(1000).then(() => {
          locationsReadyRef.current = true;
          const loc = rendition.currentLocation?.();
          if (isPageMode && loc) {
            const displayed = loc.start?.displayed;
            if (displayed) {
              const current = displayed.page;
              const total = displayed.total;
              pageStatsRef.current = { current, total };
              setPageStats({ current, total });
            }
            const cfi = loc.start?.cfi;
            const pct = cfi ? book.locations.percentageFromCfi(cfi) : undefined;
            const currentLocal = displayed?.page ?? pageStatsRef.current.current;
            const totalLocal = displayed?.total ?? pageStatsRef.current.total;
            const progressPercent = typeof pct === "number"
              ? Math.round(pct * 100)
              : (totalLocal > 0 ? Math.round((currentLocal / totalLocal) * 100) : 0);
            onProgressChange?.({ progress: progressPercent, currentPage: currentLocal, totalPages: totalLocal });

            // Initial navigation for paginated mode using percentage -> CFI when available
            const target = Math.max(1, Number(currentPage) || 1);
            if (isPageMode && !initialNavDoneRef.current && target > 1) {
              const totalPagesLocal = totalLocal || pageStatsRef.current.total || 0;
              if (totalPagesLocal > 0) {
                const targetPct = Math.min(1, Math.max(0, (target - 1) / totalPagesLocal));
                const locs = book.locations;
                let targetCfi;
                if (locs && typeof locs.cfiFromPercentage === "function") {
                  try {
                    targetCfi = locs.cfiFromPercentage(targetPct);
                  } catch {
                    // Silent fail; fallback to stepping
                    console.warn("Gagal mendapatkan CFI dari persentase, menggunakan fallback stepping.");
                  }
                }
                if (targetCfi) {
                  renditionRef.current?.display(targetCfi);
                  initialNavDoneRef.current = true;
                  readyToLogRef.current = true;
                } else {
                  // Fallback: step next multiple times to approximate target page
                  const hops = Math.max(0, target - (displayed?.page || 1));
                  if (hops > 0) {
                    let count = 0;
                    const step = () => {
                      if (count >= hops) { initialNavDoneRef.current = true; readyToLogRef.current = true; return; }
                      renditionRef.current?.next();
                      count += 1;
                      setTimeout(step, 60);
                    };
                    setTimeout(step, 100);
                  }
                }
              }
            } else if (!readyToLogRef.current) {
              // No special nav; mark ready after first locations calc
              setTimeout(() => { readyToLogRef.current = true; }, 400);
            }
          }
        }).catch(() => {
          // Fallback: emit based on displayed pages if locations fail
          const loc = rendition.currentLocation?.();
          const displayed = loc?.start?.displayed;
          if (isPageMode && displayed) {
            const current = displayed.page;
            const total = displayed.total;
            pageStatsRef.current = { current, total };
            setPageStats({ current, total });
            const progressPercent = total > 0 ? Math.round((current / total) * 100) : 0;
            onProgressChange?.({ progress: progressPercent, currentPage: current, totalPages: total });

            // Fallback initial navigation in paginated mode if needed
            const target = Math.max(1, Number(currentPage) || 1);
            if (isPageMode && !initialNavDoneRef.current && target > 1) {
              const hops = Math.max(0, target - (displayed?.page || 1));
              if (hops > 0) {
                let count = 0;
                const step = () => {
                  if (count >= hops) { initialNavDoneRef.current = true; readyToLogRef.current = true; return; }
                  renditionRef.current?.next();
                  count += 1;
                  setTimeout(step, 60);
                };
                setTimeout(step, 100);
              }
            } else if (!readyToLogRef.current) {
              setTimeout(() => { readyToLogRef.current = true; }, 400);
            }
          }
        });
      });

      if (readingMode === "scroll") {
        window.addEventListener("scroll", updateScrollProgress);
        setTimeout(updateScrollProgress, 1000);
        // Restore scroll position if component re-renders
        if (lastScrollPositionRef.current > 0) {
          setTimeout(() => {
            window.scrollTo({ top: lastScrollPositionRef.current, behavior: "auto" });
          }, 500);
        }
      }

      rendition.on("relocated", (location) => {
        if (isPageMode) {
          const displayed = location.start?.displayed;
          let currentLocal = pageStatsRef.current.current;
          let totalLocal = pageStatsRef.current.total;
          if (displayed) {
            currentLocal = displayed.page;
            totalLocal = displayed.total;
            pageStatsRef.current = { current: currentLocal, total: totalLocal };
            setPageStats({ current: currentLocal, total: totalLocal });
          }

          // Catat CFI saat pindah halaman (paginated mode)
          const cfi = location.start?.cfi || location?.end?.cfi;
          if (cfi) {
            lastCfiRef.current = cfi;
            // Optional logging sesuai permintaan: cfiString dan page
            console.log("CFI String:", cfi, "Halaman:", currentLocal);
          }

          // Prefer locations-based percentage for accuracy
          let progressPercent = 0;
          if (locationsReadyRef.current) {
            const pct = (cfi ? book.locations.percentageFromCfi(cfi) : undefined);
            if (typeof pct === "number") progressPercent = Math.round(pct * 100);
          }
          if (!progressPercent) {
            progressPercent = totalLocal > 0 ? Math.round((currentLocal / totalLocal) * 100) : 0;
          }
          onProgressChange?.({ progress: progressPercent, currentPage: currentLocal, totalPages: totalLocal });
          if (!readyToLogRef.current) {
            readyToLogRef.current = true;
          }
        } else {
          // In scroll mode, relocated may fire on internal anchors; re-emit last stats as payload
          onProgressChange?.({ progress: undefined, currentPage: pageStatsRef.current.current, totalPages: pageStatsRef.current.total });
          if (!readyToLogRef.current) {
            readyToLogRef.current = true;
          }
        }
      });

      return () => {
        book.destroy();
        window.removeEventListener("scroll", updateScrollProgress);
        if (injectPageNumbersTimeoutRef.current) {
          clearTimeout(injectPageNumbersTimeoutRef.current);
        }
        try { onLoadingChange?.(false); } catch {
          console.warn("onLoadingChange gagal dipanggil.");
        }
      };
    }, [epubUrl, readingMode, updateScrollProgress, onProgressChange]);

    // Resize rendition when bottom bar visibility/height changes
    useEffect(() => {
      if (typeof window === "undefined") return;
      const rendition = renditionRef.current;
      const container = viewerRef.current;
      if (!rendition || !container) return;

      if (readingMode === "page") {
        const usableHeight = Math.max(0, window.innerHeight - (bottomBarHeight || 176));
        const widthPx = Math.min(Math.round(usableHeight * 210 / 297), window.innerWidth);
        // Sync container style to avoid width mismatch
        container.style.height = `${usableHeight}px`;
        container.style.minHeight = `${usableHeight}px`;
        container.style.width = `${widthPx}px`;
        // Resize the rendition to match new viewport (reflow pages without re-display)
        try {
          rendition.resize(widthPx, usableHeight);
        } catch (e) {
          console.warn("rendition.resize gagal dipanggil:", e);
        }
      }
    }, [bottomBarHeight, readingMode]);

    useEffect(() => {
      if (!renditionRef.current) return;
      applyTheme();
      
      // Reset dan inject ulang page numbers jika theme berubah di scroll mode
      if (readingMode === "scroll" && pageNumbersInjectedRef.current) {
        pageNumbersInjectedRef.current = false;
        if (injectPageNumbersTimeoutRef.current) clearTimeout(injectPageNumbersTimeoutRef.current);
        injectPageNumbersTimeoutRef.current = setTimeout(() => {
          injectPageNumbers();
        }, 1000);
      }
    }, [colorTheme, lineHeight, textAlign, fontFamily, readingMode, applyTheme, injectPageNumbers]);

    const changeFontSize = (delta) => {
      const next = Math.max(0.8, Math.min(1.5, fontSizeFactor + delta));
      setFontSizeFactor(next);
      renditionRef.current?.themes.fontSize(`${next}rem`);
      onFontSizeChange?.(next);

      // PENTING: Berikan jeda cukup lama (1.5 detik) 
      // agar rendition.resize internal epubjs selesai menghitung ulang layout
      if (readingMode === "scroll") {
        // Reset flag agar bisa inject ulang dengan layout baru
        pageNumbersInjectedRef.current = false;
        
        if (injectPageNumbersTimeoutRef.current) clearTimeout(injectPageNumbersTimeoutRef.current);
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
          <div className="relative w-full flex flex-col items-center bg-transparent min-h-screen">
            <div
              ref={viewerRef}
              className="mx-auto epub-viewport shadow-2xl"
              style={{
                height: readingMode === "page" ? `calc(100vh - ${bottomBarHeight}px)` : "auto",
                minHeight: readingMode === "page" ? `calc(100vh - ${bottomBarHeight}px)` : "100vh",
                width: readingMode === "page"
                  ? `min(calc((100vh - ${bottomBarHeight}px) * 210 / 297), 100vw)`
                  : "100%",
                maxWidth: readingMode === "page" ? "100vw" : "800px",
                backgroundColor: COLOR_THEMES[colorTheme]?.bg,
              }}
            />
          </div>
        </Step>
      </Scrollama>
    );
  }
);

EpubReader.displayName = "EpubReader";
export default EpubReader;