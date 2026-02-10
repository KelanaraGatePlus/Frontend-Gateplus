import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { normalizeOptions } from "@/lib/normalizeOption";

export default function GenreMultiSelect({
    label,
    name,
    options = [],
    placeholder = "Pilih satu atau lebih genre",
    value = [],
    onChange,
    onBlur,
    error,
}) {
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const normalizedOptions = useMemo(
        () =>
            normalizeOptions(options)
                .map((item) => ({ ...item, id: String(item.id ?? "") }))
                .filter((item) => item.id)
                .sort((a, b) => a.title.localeCompare(b.title)),
        [options]
    );

    const selectedIds = Array.isArray(value) ? value.map((item) => String(item)) : [];
    const selectedOptions = normalizedOptions.filter((item) => selectedIds.includes(item.id));

    const filteredOptions = useMemo(
        () =>
            normalizedOptions.filter((item) =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        [normalizedOptions, searchQuery]
    );

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
        if (!isOpen) {
            setSearchQuery("");
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (optionId) => {
        const id = String(optionId);
        const exists = selectedIds.includes(id);
        const nextValue = exists
            ? selectedIds.filter((item) => item !== id)
            : [...selectedIds, id];
        onChange(nextValue);
    };

    const removeSelected = (optionId) => {
        const id = String(optionId);
        onChange(selectedIds.filter((item) => item !== id));
    };

    return (
        <div className="flex items-start gap-2" ref={dropdownRef}>
            {label && (
                <h3 className="montserratFont flex-2 text-base font-semibold text-white md:text-base lg:text-xl">
                    {label}
                </h3>
            )}
            <div className="relative flex w-full flex-4 flex-col text-white md:flex-10 montserratFont">
                <button
                    type="button"
                    name={name}
                    onClick={() => setIsOpen((prev) => !prev)}
                    onBlur={onBlur}
                    className={`${
                        error ? "border-red-500" : "border-white/20"
                    } flex w-full min-h-[44px] flex-wrap items-center gap-2 rounded-md border bg-[#2a2a2a] px-2 py-2 text-left text-sm transition-colors duration-200 hover:border-blue-500/60`}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                >
                    {selectedOptions.length === 0 ? (
                        <span className="text-white/60">{placeholder}</span>
                    ) : (
                        selectedOptions.map((item) => (
                            <span
                                key={item.id}
                                className="flex items-center gap-2 rounded-full border border-blue-500/60 bg-blue-900/40 px-3 py-1 text-xs"
                            >
                                <span className="truncate">{item.title}</span>
                                <button
                                    type="button"
                                    className="text-white/70 transition hover:text-white"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeSelected(item.id);
                                    }}
                                    aria-label={`Hapus genre ${item.title}`}
                                >
                                    x
                                </button>
                            </span>
                        ))
                    )}
                    <span className="ml-auto text-white/60">{isOpen ? "Close" : "Open"}</span>
                </button>

                {isOpen && (
                    <div
                        className="absolute z-10 mt-1 w-full rounded-md overflow-hidden border border-white/20 bg-[#1f1f1f] shadow-lg top-full"
                        role="listbox"
                    >
                        <div className="sticky top-0 bg-[#1f1f1f] p-2 border-b border-white/20">
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari genre..."
                                className="w-full rounded-md border border-white/20 bg-[#2a2a2a] px-3 py-2 text-sm text-white placeholder-white/60 focus:border-blue-500 focus:outline-none"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                        <div className="max-h-52 overflow-auto">
                            {normalizedOptions.length === 0 ? (
                                <p className="px-3 py-2 text-sm text-white/60">Genre belum tersedia</p>
                            ) : filteredOptions.length === 0 ? (
                                <p className="px-3 py-2 text-sm text-white/60">Tidak ada genre yang cocok</p>
                            ) : (
                                filteredOptions.map((item) => {
                                const isSelected = selectedIds.includes(item.id);
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors duration-150 ${
                                            isSelected
                                                ? "bg-blue-600/30 text-white"
                                                : "hover:bg-white/10 text-white"
                                        }`}
                                        onClick={() => toggleOption(item.id)}
                                        aria-pressed={isSelected}
                                    >
                                        <span className="truncate">{item.title}</span>
                                        {isSelected && <span className="text-blue-200">Selected</span>}
                                    </button>
                                );
                            })
                        )}
                        </div>
                    </div>
                )}

                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        </div>
    );
}

GenreMultiSelect.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            title: PropTypes.string.isRequired,
        })
    ),
    placeholder: PropTypes.string,
    value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    error: PropTypes.string,
};
