import React from "react";
import LoadingGif from "@@/logo/LoadingGateplus.gif";

// eslint-disable-next-line react/prop-types
export default function LoadingOverlay({ message = "Loading..." }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-xs"
      aria-modal="true"
      role="dialog"
      aria-labelledby="loading-message"
    >
      <img
        src={
          LoadingGif.src
        }
        alt="Loading animation"
        className="w-40 h-auto"
      />
      <p
        id="loading-message"
        className="mt-4 text-center text-lg font-medium text-white"
        dangerouslySetInnerHTML={{ __html: message }}
      />
    </div>
  );
}
