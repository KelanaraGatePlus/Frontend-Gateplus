/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
"use client";

import ePub from "epubjs";
import { useEffect, useRef } from "react";

export default function EpubReader({
  epubUrl,
  isDark = true,
  preventCopy = true,
  preventScreenshot = true,
  preventRecord = true,
  preventDevtools = true,
}) {

  const viewerRef = useRef(null);
  const renditionRef = useRef(null);

  // =====================================
  // 🔒 GLOBAL PROTECT: outside the EPUB iframe
  // =====================================
  useEffect(() => {
    // 🛑 Prevent Copy, Cut, Paste
    if (preventCopy) {
      const block = (e) => e.preventDefault();
      document.addEventListener("copy", block);
      document.addEventListener("cut", block);
      document.addEventListener("paste", block);
      document.addEventListener("contextmenu", block);
    }

    // 🛑 Prevent Screenshot: detect PrintScreen key
    const handlePrintScreen = (e) => {
      if (preventScreenshot && e.key === "PrintScreen") {
        navigator.clipboard.writeText("");
        alert("Screenshot disabled on this EPUB.");
      }
    };
    document.addEventListener("keydown", handlePrintScreen);

    // 🛑 Basic Anti Screen Recording: blur when tab inactive
    const handleVisibility = () => {
      const viewer = viewerRef.current;
      if (!viewer) return;

      if (preventRecord) {
        viewer.style.filter = document.hidden ? "blur(12px)" : "none";
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // 🛑 Detect DevTools: time-based debugger detection
    let devtoolsInterval;
    if (preventDevtools) {
      devtoolsInterval = setInterval(() => {
        const start = performance.now();
        if (performance.now() - start > 200) {
          const viewer = viewerRef.current;
          if (viewer) viewer.style.filter = "blur(12px)";
        }
      }, 1000);
    }

    return () => {
      document.oncopy = null;
      document.oncut = null;
      document.onpaste = null;
      clearInterval(devtoolsInterval);
    };
  }, [preventCopy, preventScreenshot, preventRecord, preventDevtools]);

  // =====================================
  // 📚 Load EPUB & apply in-iframe protection
  // =====================================
  useEffect(() => {
    const bookInstance = ePub(epubUrl);
    const rendition = bookInstance.renderTo(viewerRef.current, {
      width: "100%",
      height: "auto",
      flow: "scrolled-doc",
      spread: "none",
    });

    renditionRef.current = rendition;

    // Load non-TOC content first
    bookInstance.ready.then(() => {
      const spineItems = bookInstance.spine.items;
      const firstRealContent = spineItems.find(
        (item) =>
          !item.href.includes("toc") &&
          !item.href.includes("nav") &&
          !item.href.includes("cover")
      );
      rendition.display(firstRealContent ? firstRealContent.href : undefined);
    });

    // =====================================
    // 🔒 PROTECT INSIDE IFRAME
    // =====================================
    rendition.on("rendered", () => {
      const iframe = viewerRef.current.querySelector("iframe");
      if (!iframe) return;
      const doc = iframe.contentDocument;

      // 🛑 Prevent copy/cut/paste inside EPUB iframe
      if (preventCopy) {
        const block = (e) => e.preventDefault();
        ["copy", "cut", "paste", "contextmenu"].forEach((evt) =>
          doc.addEventListener(evt, block)
        );
        doc.body.style.userSelect = "none";
      }

      // 🛑 Anti screenshot: blur on PrintScreen
      if (preventScreenshot) {
        document.addEventListener("keydown", (e) => {
          if (e.key === "PrintScreen") {
            navigator.clipboard.writeText("");
            doc.body.style.filter = "blur(12px)";
            setTimeout(() => {
              doc.body.style.filter = "none";
            }, 1500);
          }
        });
      }

      // 🛑 Anti Screen Recording (basic)
      if (preventRecord) {
        document.addEventListener("visibilitychange", () => {
          doc.body.style.filter = document.hidden ? "blur(12px)" : "none";
        });
      }
    });

    // =====================================
    // 🎨 THEMES
    // =====================================
    const themeStyles = isDark
      ? {
          body: {
            background: "#222 !important",
            color: "#fff !important",
            padding: "1em",
            fontSize: "110%",
            lineHeight: "1.6",
            userSelect: "none",
          },
        }
      : {
          body: {
            background: "#fff !important",
            color: "#000 !important",
            padding: "1em",
            fontSize: "110%",
            lineHeight: "1.6",
            userSelect: "none",
          },
        };

    rendition.themes.default(themeStyles);

    return () => {
      bookInstance.destroy();
    };
  }, [epubUrl, isDark, preventCopy, preventScreenshot, preventRecord, preventDevtools]);

  // =====================================
  // RENDER
  // =====================================
  return (
    <div className={`${isDark ? "bg-[#222]" : "bg-white"} h-auto min-h-fit`}>
      <div ref={viewerRef} />
    </div>
  );
}
