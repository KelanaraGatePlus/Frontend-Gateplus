"use client";
import React from "react";
import PropTypes from "prop-types";

export default function PriceSelector({
    label = "Price",
    options = [],
    selected,
    onSelect,
    disabled = false,
    error,
}) {
    return (
        <section className="my-3 flex flex-col items-center justify-center gap-3">
            {/* Label */}
            <h3 className="montserratFont w-full flex-2 text-left text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                {label} {error && <p className="text-red-500 text-sm">{error}</p>}
            </h3>

            {/* Option Button Group */}
            <div className="flex w-full gap-3">
                {options.map((option) => (
                    <div
                        key={option}
                        onClick={() => !disabled && onSelect(option)}
                        className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 py-2 text-lg font-bold text-white transition hover:opacity-80
                            ${selected === option
                                ? "border-blue-700 bg-blue-500"
                                : "border-[#F5F5F559] bg-[#F5F5F540]"
                            }
                            ${disabled && "cursor-not-allowed opacity-60"}
            `}
                    >
                        {option}
                    </div>
                ))}
            </div>

            {/* Simulasi Pendapatan */}
            <div
                className={`flex w-full flex-1 items-center justify-center rounded-lg border-2 border-[#F5F5F559] bg-[#F5F5F40] px-2 py-2 text-lg font-bold text-white transition hover:opacity-80 cursor-not-allowed`}
            >
                Lihat Simulasi Pendapatan
            </div>
        </section>
    );
}

PriceSelector.propTypes = {
    label: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
    selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onSelect: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    error: PropTypes.string,
};
