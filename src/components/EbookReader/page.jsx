/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
"use client";
import ePub from "epubjs";
import { useEffect, useRef } from "react";

export default function EpubReader({ epubUrl, isDark = true }) {
  const viewerRef = useRef(null);
  const renditionRef = useRef(null);

  useEffect(() => {
    const bookInstance = ePub(epubUrl);

    const rendition = bookInstance.renderTo(viewerRef.current, {
      width: "100%",
      height: "auto",
      flow: "scrolled-doc",
      spread: "none",
    });

    renditionRef.current = rendition;
    rendition.display();

    const themeStyles = isDark
      ? {
          body: {
            background: "#222222 !important",
            color: "#ffffff !important",
            columnCount: "1 !important",
            padding: "1em",
            fontSize: "110%",
            lineHeight: "1.6",
          },
          p: {
            color: "#ffffff !important",
          },
        }
      : {
          body: {
            background: "#ffffff !important",
            color: "#222222 !important",
            columnCount: "1 !important",
            padding: "1em",
            fontSize: "110%",
            lineHeight: "1.6",
          },
          p: {
            color: "#222222 !important",
          },
        };

    rendition.themes.default(themeStyles);

    return () => {
      bookInstance.destroy();
    };
  }, [epubUrl, isDark]);

  return (
    <div className={`${isDark ? "bg-[#222222]" : "bg-white"} h-auto min-h-fit`}>
      <div ref={viewerRef} />
    </div>
  );
}
