/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";

const Toast = ({ message, onClose, type, duration = 3000 }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-28 right-4 z-50">
      <div
        className={`relative flex items-start gap-3 rounded-lg border-l-4 px-5 py-4 text-sm shadow-xl transition-all duration-300 ${type === "success" ? "border-green-600 bg-green-50 text-green-900" : "border-red-600 bg-red-50 text-red-900"} `}
      >
        <div className="flex-shrink-0 pt-0.5">
          {type === "success" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>

        <div className="flex-1">
          <p className="font-semibold">
            {type === "success" ? "Success" : "Error"}
          </p>
          <p className="text-sm opacity-90">{message}</p>
        </div>

        <button
          className="absolute top-2 right-2 text-gray-400 transition-colors hover:text-gray-600"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;
