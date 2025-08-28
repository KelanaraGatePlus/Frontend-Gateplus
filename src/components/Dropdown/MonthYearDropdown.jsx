// components/MonthYearPicker.jsx
"use client";
import { useState, useRef, useEffect } from "react";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function useOutsideClose(ref, onClose) {
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onClose]);
}

function Dropdown({ label, items, value, onChange }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  useOutsideClose(boxRef, () => setOpen(false));

  return (
    <div className="relative" ref={boxRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-md bg-[#8b8b8b] px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus:outline-none"
      >
        {/* chevron icon */}
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.17l3.71-2.94a.75.75 0 1 1 .94 1.16l-4.24 3.36a.75.75 0 0 1-.94 0L5.21 8.39a.75.75 0 0 1 .02-1.18z" />
        </svg>
        <span>{value}</span>
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 max-h-64 w-40 overflow-auto rounded-md border border-[#8b8b8b] bg-[#1b1f23] p-1 shadow-xl">
          {items.map((it) => (
            <button
              key={it}
              onClick={() => {
                onChange(it);
                setOpen(false);
              }}
              className={`w-full rounded-md px-3 py-2 text-left text-sm
                ${it === value ? "bg-[#2b3238] text-white" : "text-gray-300 hover:bg-[#22272b]"}
              `}
            >
              {it}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MonthYearPicker({
  defaultYear,
  defaultMonth = 'March', // string: "March"
  years = [],   // optional: kirim daftar custom
  onChange,     // (yearStr, monthStr) => void
}) {
  const now = new Date();
  const yearList =
    years.length
      ? years
      : Array.from({ length: 11 }, (_, i) => String(now.getFullYear() - 5 + i)); // ±5 tahun

  const [year, setYear] = useState(String(defaultYear ?? now.getFullYear()));
  const [month, setMonth] = useState(defaultMonth ?? MONTHS[now.getMonth()]);

  useEffect(() => {
    onChange?.(year, month);
  }, [year, month, onChange]);

  return (
    <div className="flex items-center gap-3">
      <Dropdown
        label="Year"
        items={yearList}
        value={year}
        onChange={(val) => setYear(val)}
      />
      <Dropdown
        label="Month"
        items={MONTHS}
        value={month}
        onChange={(val) => setMonth(val)}
      />
    </div>
  );
}
