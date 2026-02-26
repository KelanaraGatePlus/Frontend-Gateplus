"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import iconFilter from "@@/icons/icons-filter.svg";
import PropTypes from "prop-types";

export default function FilterDropdown({
    queryParameterName,
    options,
    label,
    multiSelect = true,
    conflictRules = {}
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    /** ✅ Ambil semua value terpilih dari query */
    const getCurrentValues = () => {
        return multiSelect
            ? searchParams.getAll(queryParameterName)
            : (searchParams.get(queryParameterName) ? [searchParams.get(queryParameterName)] : []);
    };

    const currentValues = getCurrentValues();

    /** ✅ Toggle option */
    const handleOptionClick = (optionValue) => {
        const params = new URLSearchParams(searchParams.toString());

        if (multiSelect) {
            let existingValues = params.getAll(queryParameterName);

            if (optionValue === "all") {
                // Clear semua pilihan
                params.delete(queryParameterName);
            } else {
                if (existingValues.includes(optionValue)) {
                    // Hapus nilai ini
                    existingValues = existingValues.filter(val => val !== optionValue);
                } else {
                    const conflictingValues = conflictRules[optionValue] || [];
                    if (conflictingValues.length > 0) {
                        existingValues = existingValues.filter(
                            val => !conflictingValues.includes(val)
                        );
                    }

                    // Tambahkan nilai baru
                    existingValues.push(optionValue);
                }

                // Reset key dan append ulang semua value
                params.delete(queryParameterName);
                existingValues.forEach(val => params.append(queryParameterName, val));
            }
        } else {
            // Single select
            if (optionValue && optionValue !== "all") {
                params.set(queryParameterName, optionValue);
            } else {
                params.delete(queryParameterName);
            }
            setIsOpen(false);
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    /** Tutup dropdown ketika klik di luar */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Tombol Filter */}
            <div
                className={`rounded-md border text-white border-white/20 px-4 py-2 flex flex-row items-center justify-between gap-2 cursor-pointer transition ${currentValues.length > 0
                    ? "bg-blue-500/80 hover:bg-blue-500/90"
                    : "bg-white/10 hover:bg-white/20"
                    }`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <p className={currentValues.length > 0 ? "font-semibold" : ""}>
                    {currentValues.length > 0 && multiSelect
                        ? `${label} (${currentValues.length})`
                        : label}
                </p>
                <Image src={iconFilter} alt="Filter Icon" width={24} height={24} />
                {currentValues.length > 0 && (
                    <div className="w-2 h-2 bg-white rounded-full ml-1"></div>
                )}
            </div>

            {/* Dropdown List */}
            {isOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md border border-white/20 bg-white/10 backdrop-blur-md shadow-lg text-white z-50">
                    <ul
                        className={`py-2 text-sm ${options.length > 5 ? "max-h-52 overflow-y-auto" : ""}`}
                    >
                        {options.map((option) => {
                            const isSelected = currentValues.includes(option.value);

                            return (
                                <li
                                    key={option.value}
                                    className={`px-4 py-2 hover:bg-white/20 cursor-pointer transition flex items-center gap-3 ${isSelected ? "bg-white/30 font-semibold" : ""
                                        }`}
                                    onClick={() => handleOptionClick(option.value)}
                                >
                                    {multiSelect && option.value !== "all" && (
                                        <div
                                            className={`w-4 h-4 border border-white/60 rounded flex items-center justify-center ${isSelected
                                                ? "bg-blue-500 border-blue-500"
                                                : "bg-transparent"
                                                }`}
                                        >
                                            {isSelected && (
                                                <svg
                                                    width="10"
                                                    height="8"
                                                    viewBox="0 0 10 8"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M1 4L3.5 6.5L9 1"
                                                        stroke="white"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                    )}
                                    <span>{option.label}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}

FilterDropdown.propTypes = {
    queryParameterName: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired
        })
    ).isRequired,
    label: PropTypes.string.isRequired,
    multiSelect: PropTypes.bool,
    conflictRules: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string))
};
