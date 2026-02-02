"use client";
import React from "react";
import PropTypes from "prop-types";

export default function Switch({
  value = false,
  onChange,
  disabled = false,
  label,
}) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(!value)}
        className={`
          relative w-12 h-6 rounded-full transition-colors duration-300
          ${value ? "bg-black" : "bg-gray-300"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <span
          className={`
            absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full
            transition-transform duration-300
            ${value ? "translate-x-6" : "translate-x-0"}
          `}
        />
      </button>
    </label>
  );
}

Switch.propTypes = {
  value: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  label: PropTypes.string,
};
