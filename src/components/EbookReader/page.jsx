/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
"use client";

import ePub from "epubjs";
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";

/**
 * Komponen React untuk menampilkan file EPUB menggunakan Epub.js
 * dengan kontrol kustom untuk styling dan keamanan.
 * * @param {string} epubUrl - URL atau path ke file EPUB.
 * @param {boolean} isDark - Mengaktifkan mode gelap.
 * @param {number} initialFontSizeFactor - Faktor pengali font awal (cth: 1.0 = 16px).
 * @param {function} onFontSizeChange - Callback ketika font size berubah
 */
const EpubReader = forwardRef(({
  epubUrl,
  isDark = true,
  preventCopy = true,
  preventScreenshot = true,
  preventRecord = true,
  preventDevtools = true,
  initialFontSizeFactor = 1.0, // Default 1.0 (setara 16px)
  onFontSizeChange = null,
}, ref) => {
  const viewerRef = useRef(null);
  const renditionRef = useRef(null);
  // State sekarang menyimpan faktor pengali rem (1.0, 1.1, 1.2, dst.)
  const [fontSizeFactor, setFontSizeFactor] = useState(initialFontSizeFactor);
  // Definisikan unit pertambahan/pengurangan
  const MIN_FACTOR = 0.8; // Batas minimal (sekitar 12.8px)
  const MAX_FACTOR = 1.5; // Batas maksimal (sekitar 24px)

  // =====================================
  // 🔒 GLOBAL PROTECT (Copy, Screenshot, DevTools)
  // ... (Bagian ini tidak berubah)
  // =====================================
  useEffect(() => {
    // Fungsi untuk memblokir aksi copy, cut, paste, contextmenu
    const block = (e) => preventCopy && e.preventDefault();
    document.addEventListener("copy", block);
    document.addEventListener("cut", block);
    document.addEventListener("paste", block);
    document.addEventListener("contextmenu", block);

    // Fungsi untuk memblokir PrintScreen (PrtSc)
    const handlePrintScreen = (e) => {
      if (preventScreenshot && (e.key === "PrintScreen" || e.keyCode === 44)) {
        navigator.clipboard.writeText("");
        alert("Screenshot disabled on this EPUB.");
      }
    };
    document.addEventListener("keydown", handlePrintScreen);

    // Fungsi untuk memburamkan konten jika tab tidak aktif (mencegah perekaman)
    const handleVisibility = () => {
      const viewer = viewerRef.current;
      if (!viewer) return;
      if (preventRecord) {
        viewer.style.filter = document.hidden ? "blur(12px)" : "none";
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Fungsi untuk mendeteksi dan memburamkan saat DevTools dibuka
    let devtoolsInterval;
    if (preventDevtools) {
      devtoolsInterval = setInterval(() => {
        const start = performance.now();
        // eslint-disable-next-line no-unused-vars
        const dummy = () => { };
        // Periksa apakah waktu eksekusi dummy function melambat (indikasi DevTools terbuka)
        if (performance.now() - start > 200) {
          const viewer = viewerRef.current;
          if (viewer) viewer.style.filter = "blur(12px)";
        } else {
          const viewer = viewerRef.current;
          if (viewer) viewer.style.filter = "none";
        }
      }, 1000);
    }

    return () => {
      document.removeEventListener("copy", block);
      document.removeEventListener("cut", block);
      document.removeEventListener("paste", block);
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("keydown", handlePrintScreen);
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(devtoolsInterval);
    };
  }, [preventCopy, preventScreenshot, preventRecord, preventDevtools]);

  // =====================================
  // 📚 Load EPUB, Styling, & In-Iframe Protection
  // =====================================
  useEffect(() => {
    const bookInstance = ePub(epubUrl);
    const rendition = bookInstance.renderTo(viewerRef.current, {
      width: "100%",
      height: "auto",
      flow: "scrolled",
      spread: "none",
    });

    renditionRef.current = rendition;

    // Tampilkan konten pertama yang bukan TOC/nav/cover
    bookInstance.ready.then(() => {
      const spineItems = bookInstance.spine.items;
      const firstRealContent = spineItems.find(
        (item) =>
          !item.href.includes("toc") &&
          !item.href.includes("nav") &&
          !item.href.includes("cover")
      );
      rendition.display(firstRealContent ? firstRealContent.href : undefined);
      
      // 🔑 Mengaplikasikan faktor font size awal
      rendition.themes.fontSize(`${fontSizeFactor}rem`); 
    });

    // 🔒 PROTECT INSIDE IFRAME
    rendition.on("rendered", () => {
      const iframe = viewerRef.current.querySelector("iframe");
      if (!iframe) return;
      const doc = iframe.contentDocument;
      if (!doc || !doc.body) return;

      if (preventCopy) {
        const block = (e) => e.preventDefault();
        ["copy", "cut", "paste", "contextmenu"].forEach((evt) =>
          doc.addEventListener(evt, block)
        );
        doc.body.style.userSelect = "none";
      }

      if (preventScreenshot) {
        doc.addEventListener("keydown", (e) => {
          if (e.key === "PrintScreen" || e.keyCode === 44) {
            doc.body.style.filter = "blur(12px)";
            setTimeout(() => {
              doc.body.style.filter = "none";
            }, 1500);
          }
        });
      }

      if (preventRecord) {
        doc.addEventListener("visibilitychange", () => {
          doc.body.style.filter = document.hidden ? "blur(12px)" : "none";
        });
      }
    });

    // 🎨 THEMES: Menerapkan styling kustom (Font Montserrat, Line Height 1.8)
    const baseStyles = {
      // Styling dasar pada body iframe
      body: {
        "font-family": "Montserrat, sans-serif !important",
        padding: "32px !important", 
        lineHeight: "1.8 !important", 
        userSelect: "none",
        margin: "0 !important",
        // Hapus fontSize di sini, karena kita menggunakan themes.fontSize() untuk mengontrolnya
      },
      // Styling untuk elemen teks spesifik
      "p, div, span, h1, h2, h3, h4, section, article": {
        "font-family": "Montserrat, sans-serif !important",
        lineHeight: "1.8 !important", 
        // Mengatur margin bawah untuk pemisah antar paragraf
        margin: "0 0 1em 0 !important", 
        padding: "0 !important",
      },
      ".epub-view-title": { display: "none !important" },
    };

    const themeStyles = isDark
      ? {
          body: {
            ...baseStyles.body,
            background: "#1A1A1A !important",
            color: "#fff !important",
          },
          "p, div, span, h1, h2, h3, h4, section, article": baseStyles["p, div, span, h1, h2, h3, h4, section, article"],
          ".epub-view-title": baseStyles[".epub-view-title"],
        }
      : {
          body: {
            ...baseStyles.body,
            background: "#fff !important",
            color: "#000 !important",
          },
          "p, div, span, h1, h2, h3, h4, section, article": baseStyles["p, div, span, h1, h2, h3, h4, section, article"],
          ".epub-view-title": baseStyles[".epub-view-title"],
        };

    rendition.themes.default(themeStyles);

    return () => {
      bookInstance.destroy();
    };
  // Hapus 'fontSizeFactor' dari dependency array karena themes.default hanya mengatur style lain
  }, [epubUrl, isDark, preventCopy, preventScreenshot, preventRecord, preventDevtools]); 

  // 🆕 FUNGSI UNTUK MENGUBAH UKURAN FONT
  const changeFontSize = (delta) => {
    const rendition = renditionRef.current;
    if (!rendition) return;

    // Menghitung faktor baru dan membatasi nilainya
    const newFactor = parseFloat((fontSizeFactor + delta).toFixed(2));
    const finalFactor = Math.max(MIN_FACTOR, Math.min(MAX_FACTOR, newFactor));

    if (finalFactor === fontSizeFactor) return;

    setFontSizeFactor(finalFactor);

    // ✅ Menggunakan API bawaan Epub.js untuk mengubah ukuran font menggunakan REM
    rendition.themes.fontSize(`${finalFactor}rem`);

    // 📢 Panggil callback ke parent jika ada
    if (onFontSizeChange) {
      onFontSizeChange(finalFactor);
    }
  };

  // Expose changeFontSize function untuk diakses dari parent component
  useImperativeHandle(ref, () => ({
    changeFontSize,
    getCurrentFontSize: () => fontSizeFactor,
  }));

  // =====================================
  // RENDER (UI Control)
  // =====================================
  return (
    <div className="w-full">
      {/* Kontainer EPUB */}
      <div className={`bg-transparent h-auto min-h-fit w-full`}>
        <div 
          ref={viewerRef} 
          className="w-full" 
          style={{ minHeight: '70vh' }}
        />
      </div>
    </div>
  );
});

EpubReader.displayName = "EpubReader";
export default EpubReader;