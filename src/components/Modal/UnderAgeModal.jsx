"use client";

import React, { useState, useEffect } from "react";
import getMinAge from "@/lib/helper/minAge";
import PropTypes from "prop-types";

export default function UnderAgeModal({ open, ageRestriction, title }) {
  const [isVisible, setIsVisible] = useState(open);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setIsExiting(false);
      document.body.style.overflow = "hidden";
    } else {
      handleClose();
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "unset";
    }, 300);
  };

  const handleBackHome = () => {
    window.location.href = "/";
  };

  if (!isVisible || !title) return null;

  const minAge = getMinAge(ageRestriction);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${isExiting ? "opacity-0" : "opacity-100"
          }`}
        style={{
          backdropFilter: "blur(8px)",
          background: "rgba(0,0,0,0.85)",
        }}
        onClick={handleBackHome}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg rounded-3xl transition-all duration-300 ${isExiting ? "scale-95 opacity-0" : "scale-100 opacity-100"
          }`}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#3A3A3A",
          boxShadow: "0 30px 80px rgba(0,0,0,0.9)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.288 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white">Akses Terbatas</h2>

          {/* Age badge */}
          <div className="rounded-full bg-red-600 px-4 py-1.5">
            <span className="text-lg font-bold text-white">{minAge}+</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pt-6 pb-8 text-center">
          <p className="mb-6 text-lg text-gray-200">
            Berdasarkan data profil Anda, Anda belum memenuhi syarat usia
            minimum untuk melihat
          </p>

          <p className="mb-8 text-xl font-semibold text-white">&quot;{title}&quot;</p>

          <button
            onClick={handleBackHome}
            className="w-full rounded-xl py-4 text-lg font-semibold text-gray-900 transition"
            style={{
              background: "#BDBDBD",
            }}
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}

UnderAgeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  ageRestriction: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};
