"use client";
import React, { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { set } from "zod";

export default function PriceSelector({
    label = "Price",
    options = [],
    selected,
    onSelect,
    disabled = false,
    error,
    freeValue = "Free",           // nilai untuk GRATIS (bisa angka/string)
    freeLabel = "Gratis",    // teks tombol gratis
    canFree = true
}) {
    const [customValue, setCustomValue] = useState("");

    const isOptionSelected = useMemo(
        () => options.some((o) => String(o) === String(selected)) || String(selected) === String(freeValue),
        [options, selected, freeValue]
    );
    const [simulateValue, setSimulateValue] = useState(0);
    const [pajak, setPajak] = useState(0);

    const handleOptionClick = (option) => {
        if (disabled) return;
        onSelect(option);
        setCustomValue("");
    };

    const handleInputFocus = () => {
        if (disabled) return;
        if (isOptionSelected) onSelect(customValue);
    };

    const handleInputChange = (e) => {
        if (disabled) return;
        const onlyDigits = e.target.value.replace(/[^\d]/g, "");
        setCustomValue(onlyDigits);
        onSelect(onlyDigits);
    };

    const containerError = error ? "border-red-500 focus-within:border-red-500 border" : "";

    // === opsi normal tanpa "gratis" ===
    const optionButtons = useMemo(
        () => options.filter((o) => String(o) !== String(freeValue) && String(o) !== freeLabel),
        [options, freeValue, freeLabel]
    );

    const isFreeActive = String(selected) === String(freeValue);

    return (
        <section className="flex items-start gap-2 text-[#979797] montserratFont">
            <div className="flex flex-2 flex-col">
                <h3 className="montserratFont text-base font-semibold md:text-base lg:text-xl">
                    {label}
                </h3>
            </div>

            {/* GRID: kiri (3 kolom) untuk input+opsi, kanan (1 kolom) untuk simulasi */}
            <div className="grid grid-cols-4 h-full w-fit flex-4 flex-wrap items-stretch justify-start gap-x-3 text-white md:flex-10">
                {/* KIRI */}
                <div className={`${containerError} col-span-3 container flex w-full flex-wrap items-start gap-4 rounded-md`}>
                    {/* Input nominal */}
                    <div className={`flex items-center w-full rounded-lg border-2 border-[#F5F5F559] bg-[#F5F5F540] ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}>
                        <span className="px-3 text-lg font-bold text-white">Rp</span>
                        <input
                            type="text"
                            placeholder="Nominal"
                            value={customValue}
                            onFocus={handleInputFocus}
                            onChange={handleInputChange}
                            disabled={disabled}
                            className={`flex-1 py-2 text-lg font-bold text-white bg-transparent border-none outline-none ${disabled ? "" : "hover:opacity-80"}`}
                        />
                    </div>

                    {/* Opsi cepat (tanpa gratis) */}
                    <div className="flex w-full gap-3">
                        {optionButtons.map((option, index) => {
                            const active = String(selected) === String(option);
                            return (
                                <button
                                    type="button"
                                    key={index}
                                    onClick={() => handleOptionClick(option)}
                                    disabled={disabled}
                                    className={`flex flex-1 items-center justify-center rounded-lg border-2 py-2 text-lg font-bold text-white transition ${active ? "border-blue-700 bg-blue-500" : "border-[#F5F5F559] bg-[#F5F5F540] hover:opacity-80"
                                        } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                                >
                                    {String(option).startsWith("Rp") ? String(option) : `Rp ${Number(option).toLocaleString("id-ID")}`}
                                </button>
                            );
                        })}
                    </div>

                    {/* === TOMBOL GRATIS – BARIS SENDIRI (FULL WIDTH) === */}
                    {canFree && <button
                        type="button"
                        onClick={() => handleOptionClick(freeValue)}
                        disabled={disabled}
                        className={`w-full rounded-lg border-2 py-2 text-lg font-bold transition ${isFreeActive ? "border-blue-700 bg-blue-500 text-white" : "border-[#F5F5F559] bg-[#F5F5F540] text-white hover:opacity-80"
                            } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                        {freeLabel}
                    </button>}

                    {error && <p className="text-red-500 text-sm w-full">{error}</p>}
                </div>

                {/* KANAN – Simulasi Pendapatan */}
                <div className={`${containerError} container flex w-full flex-col items-stretch gap-3 rounded-md p-3 border-2 border-[#F5F5F559] bg-[#2a2a2a80]`}>
                    <p className="text-sm text-[#bbb] font-medium">Simulasi Pendapatan</p>
                    <p className="text-sm">
                        Anda akan menerima : <span className="font-bold">Rp{simulateValue}</span>
                    </p>
                    <p className="text-xs text-[#bbb]">
                        Biaya Layanan GatePlus(10%) : <span className="font-semibold">Rp{pajak}</span>
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            const safeValue = Number(selected) || 0;
                            setPajak(safeValue * 0.1);
                            setSimulateValue(safeValue - safeValue * 0.1);

                        }}
                        className="mt-auto rounded-lg border-2 border-[#F5F5F559] bg-[#F5F5F540] px-2 py-2 text-lg font-bold text-white transition hover:cursor-pointer"
                    >
                        Simulasikan
                    </button>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
            </div>
        </section>
    );
}

PriceSelector.propTypes = {
    label: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ).isRequired,
    selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onSelect: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    freeValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    freeLabel: PropTypes.string,
};
