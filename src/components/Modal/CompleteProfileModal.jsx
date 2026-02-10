"use client";

import React from "react";
import PropTypes from "prop-types";

export default function CompleteProfileModal({ onConfirm, title, minAge }) {
  const handleBackHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-lg rounded-3xl shadow-2xl sm:max-w-xl"
        style={{ backgroundColor: "#3A3A3A" }}
      >
        <div className="p-8">
          <div className="mb-6">
            {/* Baris icon & badge */}
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.288 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              {/* Judul di tengah */}
              <h1 className="mt-4 text-center text-2xl font-bold text-white">
                Verifikasi Usia Diperlukan
              </h1>

              <div className="rounded-full bg-red-600 px-3 py-1">
                <span className="text-lg font-bold text-white">{minAge}+</span>
              </div>
            </div>
          </div>

          <div className="mb-8 text-center">
            <p className="mb-6 text-gray-300">
              Ups! Sepertinya Anda belum mencantumkan tanggal lahir di profil
              Anda.
            </p>

            <div className="mb-3 inline-block rounded-lg bg-gray-800 px-4 py-2">
              <span className="font-medium text-white">&quot;{title}&quot;</span>
            </div>

            <p className="text-gray-300">
              Konten &quot;{title}&quot; memerlukan verifikasi usia untuk memastikan
              pengalaman yang sesuai.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              className="flex-1 rounded-xl bg-gray-700 py-3.5 font-medium text-white transition-colors hover:bg-gray-600"
              onClick={handleBackHome}
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-blue-600 py-3.5 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Lengkapi Profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

CompleteProfileModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  minAge: PropTypes.number.isRequired,
};