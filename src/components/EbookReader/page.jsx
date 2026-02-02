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

const FONT_FAMILIES = {
  sans_serif: { class: "montserratFont", value: '"Montserrat", sans-serif' },
  serif: { class: "sourceSerifFont", value: '"Source Serif 4", serif' }
};

const LINE_HEIGHTS = { compact: 1.2, normal: 1.4, relaxed: 1.6 };
const TEXT_ALIGNS = { left: "left", justify: "justify" };
const COLOR_THEMES = {
  dark: { bg: "#222222", text: "#EDEDED" },
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
    const [fontSizeFactor, setFontSizeFactor] = useState(initialFontSizeFactor);

    const getFontFamily = useCallback(() =>
      fontFamily === "serif" ? FONT_FAMILIES.serif.value : FONT_FAMILIES.sans_serif.value,
      [fontFamily]
    );

    // Function untuk apply theme tanpa rebuild rendition
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
    }, [colorTheme, lineHeight, textAlign, readingMode, getFontFamily]);

    useEffect(() => {
      if (!epubUrl || !viewerRef.current) return;

      // Hapus konten sebelumnya untuk menghindari duplikasi saat re-render
      viewerRef.current.innerHTML = "";

      const book = ePub(epubUrl);
      bookRef.current = book;

      const isPageMode = readingMode === "page";

      // Kalkulasi dimensi:
      // Page Mode: Selalu 1 halaman (rasio A4)
      const pageHeight = "calc(100vh - 176px)";
      const singlePageWidth = "((100vh - 176px) * 210 / 297)";

      const rendition = book.renderTo(viewerRef.current, {
        width: isPageMode ? `calc(${singlePageWidth})` : "100%",
        height: isPageMode ? pageHeight : "100%", // Mode scroll butuh height 100% agar muncul
        flow: isPageMode ? "paginated" : "scrolled",
        manager: isPageMode ? "default" : "continuous", // Continuous lebih stabil untuk scroll
        spread: "none", // Selalu single page, tidak ada spread
        allowScriptedContent: true,
      });

      renditionRef.current = rendition;

      book.ready.then(() => {
        const firstRealContent = book.spine.items.find(
          (item) => !/toc|nav|cover|contents/i.test(item.href)
        );
        rendition.display(firstRealContent?.href);
        rendition.themes.fontSize(`${fontSizeFactor}rem`);
        
        // Apply theme saat pertama kali load
        applyTheme(colorTheme, lineHeight, textAlign);
      });

      rendition.on("rendered", () => {
        const doc = viewerRef.current?.querySelector("iframe")?.contentDocument;
        if (doc && preventCopy) {
          const style = doc.createElement("style");
          style.textContent = `* { -webkit-user-select: none !important; user-select: none !important; }`;
          doc.head?.appendChild(style);
        }
      });

      rendition.on("relocated", (location) => {
        if (location.start.displayed) {
          const current = location.start.displayed.page;
          const total = location.start.displayed.total;
          const progressPercent = (current / total) * 100;
          onProgressChange?.({
            progress: progressPercent,
            currentPage: current,
            totalPages: total
          });
        }
      });

      return () => {
        if (bookRef.current) {
          bookRef.current.destroy();
        }
      };
    }, [epubUrl, readingMode]);

    // ✨ OPTIMASI: Perubahan styling tanpa rebuild rendition
    useEffect(() => {
      if (!renditionRef.current) return;
      
      const themeColors = COLOR_THEMES[colorTheme] || COLOR_THEMES.dark;
      
      renditionRef.current.themes.register("dynamic-theme", {
        body: {
          background: `${themeColors.bg} !important`,
          color: `${themeColors.text} !important`,
          "font-family": `${getFontFamily()} !important`,
          "line-height": `${LINE_HEIGHTS[lineHeight] || LINE_HEIGHTS.normal} !important`,
          "text-align": `${TEXT_ALIGNS[textAlign] || TEXT_ALIGNS.justify} !important`,
          padding: "40px 60px !important",
          height: readingMode === "page" ? "auto" : "auto !important",
        },
        html: {
          height: readingMode === "page" ? "100%" : "auto !important",
        }
      });
      
      renditionRef.current.themes.select("dynamic-theme");
    }, [colorTheme, lineHeight, textAlign, fontFamily, readingMode, getFontFamily]);

    const changeFontSize = (delta) => {
      const next = Math.max(0.8, Math.min(1.5, fontSizeFactor + delta));
      setFontSizeFactor(next);
      renditionRef.current?.themes.fontSize(`${next}rem`);
      onFontSizeChange?.(next);
    };

    useImperativeHandle(ref, () => ({
      changeFontSize,
      goToPreviousPage: () => renditionRef.current?.prev(),
      goToNextPage: () => renditionRef.current?.next(),
    }));

    return (
      <div className="w-full flex justify-center bg-transparent min-h-screen">
        <div
          key={readingMode} // Memaksa re-mount saat ganti mode agar kalkulasi lebar ulang
          ref={viewerRef}
          className="mx-auto epub-viewport shadow-2xl"
          style={{
            height: readingMode === "page" ? "calc(100vh - 176px)" : "auto",
            minHeight: readingMode === "page" ? "calc(100vh - 176px)" : "100vh",
            overflow: "hidden", // Sembunyikan scrollbar sistem
            width: readingMode === "page" 
              ? `calc((100vh - 176px) * 210 / 297)` 
              : "100%",
            maxWidth: readingMode === "page" ? "100vw" : "900px", 
            backgroundColor: COLOR_THEMES[colorTheme]?.bg,
          }}
        />
      </div>
    );
  }
);

EpubReader.displayName = "EpubReader";
export default EpubReader;