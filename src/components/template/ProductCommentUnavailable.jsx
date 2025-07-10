import React from "react";

export default function ProductCommentUnavailable() {
  return (
    <div className="mx-auto my-4 flex max-w-md items-center gap-2 rounded-lg border border-yellow-300 bg-yellow-100 px-4 py-3 text-sm text-yellow-800 shadow-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 flex-shrink-0 text-yellow-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
        />
      </svg>
      <span>
        Komentar untuk series belum tersedia. Silakan komentar di episode yang
        ingin kamu beri tanggapan.
      </span>
    </div>
  );
}
