import React from "react";

// eslint-disable-next-line react/prop-types
export default function LoadingOverlay({ message = "Loading..." }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-labelledby="loading-message"
    >
      <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 border-blue-500 text-center"></div>
      <p
        id="loading-message"
        className="mt-4 text-center text-lg font-medium text-white"
        dangerouslySetInnerHTML={{ __html: message }}
      />
    </div>
  );
}
