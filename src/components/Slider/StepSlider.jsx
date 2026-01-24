"use client";
import { useState } from "react";
import PropTypes from "prop-types";

export default function StepSlider({
    min = 0,
    max = 100,
    step = 10,
    value,
    onChange,
    label,
    description,
    showValue = true,
}) {
    const getSliderBackground = () => {
        const percentage = ((value - min) / (max - min)) * 100;
        return {
            background: `linear-gradient(
            to right,
            #1DBDF5 ${percentage}%,
            #F5F5F5 ${percentage}%
        )`,
        };
    };
    return (
        <div className="flex items-start gap-2">
            <h3 className="montserratFont flex-2 text-base font-semibold text-white md:text-base lg:text-xl">
                {label}
            </h3>

            <div className="flex w-full flex-4 text-white md:flex-10 flex-col">
                {description && (
                    <p className="text-xs text-[#979797] mb-2 montserratFont">{description}</p>
                )}


                <div className="flex items-center gap-2 mb-3">
                    <div className="flex flex-col w-full">
                        <div className="flex flex-row w-full items-center gap-4">
                            <input
                                type="range"
                                min={min}
                                max={max}
                                step={step}
                                value={value}
                                onChange={(e) => onChange(Number(e.target.value))}
                                style={getSliderBackground()}
                                className="flex-1 h-4 rounded-lg appearance-none cursor-pointer
                                [&::-webkit-slider-thumb]:appearance-none
                                [&::-webkit-slider-thumb]:h-5
                                [&::-webkit-slider-thumb]:w-5
                                [&::-webkit-slider-thumb]:rounded-full
                                [&::-webkit-slider-thumb]:bg-[#1DBDF5]
                                [&::-webkit-slider-thumb]:border-2
                                [&::-webkit-slider-thumb]:border-white"
                            />
                        </div>
                        <div className="flex flex-row justify-between">
                            <p className="text-[#979797]">Nilai minimal untuk lulus dan mendapatkan sertifikat</p>
                            {showValue && (
                                <span className="montserratFont text-sm font-semibold text-[#1DBDF5] min-w-fit">
                                    {value}%
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

StepSlider.propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    description: PropTypes.string,
    showValue: PropTypes.bool,
};
