/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
"use client";

import ePub from "epubjs";
import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

const EpubReader = forwardRef(
  (
    {
      epubUrl,
      isDark = true,
      preventCopy = true,
      initialFontSizeFactor = 1.0,
      onFontSizeChange = null,
    },
    ref
  ) => {
    const viewerRef = useRef(null);
    const renditionRef = useRef(null);
    const [fontSizeFactor, setFontSizeFactor] = useState(initialFontSizeFactor);

    const MIN_FACTOR = 0.8;
    const MAX_FACTOR = 1.5;

    /* =====================================
       🔒 GLOBAL PROTECTION
    ===================================== */
    useEffect(() => {
      const block = (e) => preventCopy && e.preventDefault();
      ["copy", "cut", "paste", "contextmenu"].forEach((evt) =>
        document.addEventListener(evt, block)
      );

      return () => {
        ["copy", "cut", "paste", "contextmenu"].forEach((evt) =>
          document.removeEventListener(evt, block)
        );
      };
    }, [preventCopy]);

    /* =====================================
       📚 LOAD EPUB
    ===================================== */
    useEffect(() => {
      const book = ePub(epubUrl);
      const rendition = book.renderTo(viewerRef.current, {
        width: "100%",
        height: "auto",
        flow: "scrolled",
        spread: "none",
      });

      renditionRef.current = rendition;

      book.ready.then(() => {
        const firstRealContent = book.spine.items.find(
          (item) => !/toc|nav|cover|contents/i.test(item.href)
        );
        rendition.display(firstRealContent?.href);
        rendition.themes.fontSize(`${fontSizeFactor}rem`);
      });

      /* =====================================
         🔥 REMOVE "CONTENT"
      ===================================== */
      rendition.on("rendered", () => {
        const iframe = viewerRef.current?.querySelector("iframe");
        if (!iframe) return;

        const doc = iframe.contentDocument;
        if (!doc || !doc.body) return;

        // Remove heading "Content / Contents"
        doc
          .querySelectorAll("h1, h2, header, nav, .epub-view-title")
          .forEach((el) => {
            const text = el.textContent?.trim().toLowerCase();
            if (text === "content" || text === "contents") el.remove();
          });

        if (preventCopy) {
          doc.body.style.userSelect = "none";
        }
      });

      /* =====================================
         🎨 THEME (FIXED DARK MODE)
      ===================================== */
      const textColor = isDark ? "#ffffff" : "#000000";
      const bgColor = isDark ? "#1A1A1A" : "#ffffff";

      rendition.themes.default({
        body: {
          background: `${bgColor} !important`,
          color: `${textColor} !important`,
          "font-family": "Montserrat, sans-serif !important",
          padding: "32px !important",
          lineHeight: "1.8 !important",
          margin: "0 !important",
        },

        /* 🔥 FORCE COLOR ON ALL TEXT ELEMENTS */
        "p, span, div, li, a, h1, h2, h3, h4, h5, h6, blockquote": {
          color: `${textColor} !important`,
          "font-family": "Montserrat, sans-serif !important",
          lineHeight: "1.8 !important",
          margin: "0 0 1em 0 !important",
        },

        /* HIDE NAV / TITLE */
        "nav, header, .epub-view-title, h1:first-of-type": {
          display: "none !important",
        },
      });

      return () => book.destroy();
    }, [epubUrl, isDark]);

    /* =====================================
       🔠 FONT SIZE CONTROL
    ===================================== */
    const changeFontSize = (delta) => {
      const rendition = renditionRef.current;
      if (!rendition) return;

      const next = Math.max(
        MIN_FACTOR,
        Math.min(MAX_FACTOR, fontSizeFactor + delta)
      );

      if (next === fontSizeFactor) return;

      setFontSizeFactor(next);
      rendition.themes.fontSize(`${next}rem`);
      onFontSizeChange?.(next);
    };

    useImperativeHandle(ref, () => ({
      changeFontSize,
      getCurrentFontSize: () => fontSizeFactor,
    }));

    return (
      <div className="w-full">
        <div ref={viewerRef} style={{ minHeight: "70vh" }} />
      </div>
    );
  }
);

EpubReader.displayName = "EpubReader";
export default EpubReader;
