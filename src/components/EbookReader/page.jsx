/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-types */
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

const FONT_FAMILIES = {
  sans_serif: { class: "montserratFont", value: '"Montserrat", sans-serif' },
  serif: { class: "sourceSerifFont", value: '"Source Serif 4", serif' }
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
      preventCopy = true,
      initialFontSizeFactor = 1.0,
      onFontSizeChange = null,
      fontFamily = "sans-serif",
      lineHeight = "normal",
      textAlign = "justify",
      colorTheme = "dark",
      readingMode = "scroll",
      onProgressChange = null
    },
    ref
  ) => {
    const viewerRef = useRef(null);
    const renditionRef = useRef(null);
    const bookRef = useRef(null);
    const locationsReadyRef = useRef(false);
    const [fontSizeFactor, setFontSizeFactor] = useState(initialFontSizeFactor);

    // State untuk informasi halaman (Virtual Paging)
    const [pageStats, setPageStats] = useState({ current: 1, total: 1 });

    // FITUR: Console log saat halaman (state) berubah
    useEffect(() => {
      if (pageStats.current > 0) {
        console.log("Halaman sekarang:", pageStats.current);
      }
    }, [pageStats.current]);

    const getFontFamily = useCallback(() =>
      fontFamily === "serif" ? FONT_FAMILIES.serif.value : FONT_FAMILIES.sans_serif.value,
      [fontFamily]
    );

    const injectPageNumbers = useCallback(() => {
      if (readingMode !== "scroll" || !renditionRef.current) return;

      const doc = viewerRef.current?.querySelector("iframe")?.contentDocument;
      if (!doc) return;

      doc.querySelectorAll(".virtual-page-marker").forEach(el => el.remove());

      const body = doc.body;
      const viewerWidth = viewerRef.current.offsetWidth;

      const pageHeight = viewerWidth * (297 / 210);
      const totalHeight = body.scrollHeight;
      const totalPages = Math.ceil(totalHeight / pageHeight);

      for (let i = 1; i <= totalPages; i++) {
        const marker = doc.createElement("div");
        marker.className = "virtual-page-marker";

        Object.assign(marker.style, {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "10px 0",
          margin: "20px 0",
          pointerEvents: "none",
          boxSizing: "border-box",
          borderBottom: `1px solid ${COLOR_THEMES[colorTheme].text}20`,
        });

        marker.innerHTML = `
      <span style="
        color: ${COLOR_THEMES[colorTheme].text}66;
        font-size: 12px;
        font-family: sans-serif;
        letter-spacing: 2px;
        text-transform: uppercase;
        font-weight: 500;
      ">
        Halaman ${i} dari ${totalPages}
      </span>
    `;

        const targetY = i * pageHeight;
        const elements = Array.from(body.querySelectorAll("p, div, h1, h2, h3, img, section"));

        const closestElement = elements.find(el => {
          const rect = el.getBoundingClientRect();
          const top = rect.top + doc.defaultView.pageYOffset;
          return top > targetY;
        });

        if (closestElement) {
          closestElement.parentNode.insertBefore(marker, closestElement);
        } else {
          body.appendChild(marker);
        }
      }

      body.style.position = "relative";
    }, [readingMode, colorTheme]);

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
      setPageStats({ current, total });

      const progressRatio = scrollHeight > 0 ? Math.min(1, (scrollTop + clientHeight) / scrollHeight) : 0;
      const progressPercent = Math.round(progressRatio * 100);
      onProgressChange?.({ progress: progressPercent, currentPage: current, totalPages: total });
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
          padding: "40px 60px !important",
          height: readingMode === "page" ? "auto" : "auto !important",
        },
        html: {
          height: readingMode === "page" ? "100%" : "auto !important",
        }
      });

      renditionRef.current.themes.select("custom-theme");
      injectPageNumbers();
    }, [colorTheme, lineHeight, textAlign, readingMode, getFontFamily, injectPageNumbers]);

    useEffect(() => {
      if (!epubUrl || !viewerRef.current) return;

      viewerRef.current.innerHTML = "";
      const book = ePub(epubUrl);
      bookRef.current = book;

      const isPageMode = readingMode === "page";
      const pageHeight = "calc(100vh - 176px)";
      const singlePageWidth = "((100vh - 176px) * 210 / 297)";

      const rendition = book.renderTo(viewerRef.current, {
        width: isPageMode ? `calc(${singlePageWidth})` : "100%",
        height: isPageMode ? pageHeight : "100%",
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
        rendition.display(firstRealContent?.href);
        // Set initial font size only once on init; later changes use changeFontSize()
        rendition.themes.fontSize(`${initialFontSizeFactor}rem`);

        rendition.on("rendered", () => {
          setTimeout(injectPageNumbers, 1000);
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
              setPageStats({ current, total });
            }
            const cfi = loc.start?.cfi;
            const pct = cfi ? book.locations.percentageFromCfi(cfi) : undefined;
            const currentLocal = displayed?.page ?? pageStats.current;
            const totalLocal = displayed?.total ?? pageStats.total;
            const progressPercent = typeof pct === "number"
              ? Math.round(pct * 100)
              : (totalLocal > 0 ? Math.round((currentLocal / totalLocal) * 100) : 0);
            onProgressChange?.({ progress: progressPercent, currentPage: currentLocal, totalPages: totalLocal });
          }
        }).catch(() => {
          // Fallback: emit based on displayed pages if locations fail
          const loc = rendition.currentLocation?.();
          const displayed = loc?.start?.displayed;
          if (isPageMode && displayed) {
            const current = displayed.page;
            const total = displayed.total;
            setPageStats({ current, total });
            const progressPercent = total > 0 ? Math.round((current / total) * 100) : 0;
            onProgressChange?.({ progress: progressPercent, currentPage: current, totalPages: total });
          }
        });
      });

      if (readingMode === "scroll") {
        window.addEventListener("scroll", updateScrollProgress);
        setTimeout(updateScrollProgress, 1000);
      }

      rendition.on("relocated", (location) => {
        if (isPageMode) {
          const displayed = location.start?.displayed;
          let currentLocal = pageStats.current;
          let totalLocal = pageStats.total;
          if (displayed) {
            currentLocal = displayed.page;
            totalLocal = displayed.total;
            setPageStats({ current: currentLocal, total: totalLocal });
          }

          // Prefer locations-based percentage for accuracy
          let progressPercent = 0;
          if (locationsReadyRef.current) {
            const cfi = location.start?.cfi;
            const pct = cfi ? book.locations.percentageFromCfi(cfi) : undefined;
            if (typeof pct === "number") progressPercent = Math.round(pct * 100);
          }
          if (!progressPercent) {
            progressPercent = totalLocal > 0 ? Math.round((currentLocal / totalLocal) * 100) : 0;
          }
          onProgressChange?.({ progress: progressPercent, currentPage: currentLocal, totalPages: totalLocal });
        } else {
          // In scroll mode, relocated may fire on internal anchors; re-emit last stats as payload
          onProgressChange?.({ progress: undefined, currentPage: pageStats.current, totalPages: pageStats.total });
        }
      });

      return () => {
        book.destroy();
        window.removeEventListener("scroll", updateScrollProgress);
      };
    }, [epubUrl, readingMode, updateScrollProgress, onProgressChange]);

    useEffect(() => {
      if (!renditionRef.current) return;
      applyTheme();
    }, [colorTheme, lineHeight, textAlign, fontFamily, readingMode, applyTheme]);

    const changeFontSize = (delta) => {
      const next = Math.max(0.8, Math.min(1.5, fontSizeFactor + delta));
      setFontSizeFactor(next);
      renditionRef.current?.themes.fontSize(`${next}rem`);
      onFontSizeChange?.(next);
      setTimeout(injectPageNumbers, 600);
    };

    useImperativeHandle(ref, () => ({
      changeFontSize,
      goToPreviousPage: () => renditionRef.current?.prev(),
      goToNextPage: () => renditionRef.current?.next(),
    }));

    // Handler untuk Scrollama
    const handleStepEnter = ({ data }) => {
      // Data berisi nilai pageStats.current yang dikirim lewat Step
      // Ini memastikan Scrollama mengenali posisi scroll
    };

    return (
      <Scrollama offset={0.2} debug onStepEnter={handleStepEnter}>
        <Step data={pageStats.current}>
          <div className="relative w-full flex flex-col items-center bg-transparent min-h-screen">
            <div
              ref={viewerRef}
              className="mx-auto epub-viewport shadow-2xl"
              style={{
                height: readingMode === "page" ? "calc(100vh - 176px)" : "auto",
                minHeight: readingMode === "page" ? "calc(100vh - 176px)" : "100vh",
                width: readingMode === "page"
                  ? `calc((100vh - 176px) * 210 / 297)`
                  : "100%",
                maxWidth: readingMode === "page" ? "100vw" : "800px",
                backgroundColor: COLOR_THEMES[colorTheme]?.bg,
              }}
            />
            {/* Floating Page Indicator */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
              <div
                className="px-4 py-2 rounded-full backdrop-blur-md border shadow-lg text-sm font-medium"
                style={{
                  backgroundColor: `${COLOR_THEMES[colorTheme]?.bg}CC`,
                  color: COLOR_THEMES[colorTheme]?.text,
                  borderColor: `${COLOR_THEMES[colorTheme]?.text}33`
                }}
              >
                Halaman {pageStats.current} dari {pageStats.total}
              </div>
            </div>
          </div>
        </Step>
      </Scrollama>
    );
  }
);

EpubReader.displayName = "EpubReader";
export default EpubReader;