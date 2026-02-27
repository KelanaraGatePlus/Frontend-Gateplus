"use client";

import React, { useState } from "react";

export default function BackToTop() {
  const [hovered, setHovered] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="relative flex h-[120px] w-full items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, transparent 0%, #0d2144 60%, #0f2a58 100%)",
      }}
    >
      {/* Glow line bawah */}
      <div
        className="absolute bottom-0 left-1/2 h-px -translate-x-1/2 opacity-60"
        style={{
          width: "60%",
          background:
            "linear-gradient(to right, transparent, #1e6fa8 30%, #2a8fd4 50%, #1e6fa8 70%, transparent)",
        }}
      />

      {/* Button full width responsive */}
      <button
        onClick={scrollToTop}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex w-full max-w-screen-sm cursor-pointer flex-col items-center gap-2 border-none bg-transparent px-4 transition-colors duration-200 outline-none md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl"
        style={{ color: hovered ? "#ffffff" : "#c8d8e8" }}
        aria-label="Kembali ke atas"
      >
        {/* Ikon panah — bergerak ke atas saat hover */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 12 12"
          style={{
            transition: "transform 0.3s ease",
            transform: hovered ? "translateY(-6px)" : "translateY(0)",
          }}
        >
          <path
            fill="currentColor"
            d="M6 10.5a.75.75 0 0 0 .75-.75V3.81l1.97 1.97a.75.75 0 0 0 1.06-1.06L6.53 1.47a.75.75 0 0 0-1.06 0L2.22 4.72a.75.75 0 1 0 1.06 1.06l1.97-1.97v5.94c0 .414.336.75.75.75"
          />
        </svg>

        {/* Teks */}
        <span
          className="text-center text-sm tracking-wider"
          style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif" }}
        >
          Kembali ke atas
        </span>
      </button>
    </div>
  );
}
