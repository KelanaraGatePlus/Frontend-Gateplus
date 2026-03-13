"use client";

import React from "react";
import { donationPriceAvailable } from "@/lib/constants/donationPriceAvailable";
import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import GateplusCoin from "@@/GateplusCoin/coinLogo.svg"

export default function CommentDonationForm({ setValue, initialValue = null, name = "donation" }) {
    const [selected, setSelected] = useState(initialValue);
    const [customAmount, setCustomAmount] = useState("");

    // When selected changes, propagate to parent via setValue if provided
    useEffect(() => {
        if (typeof setValue === "function") {
            setValue(selected ?? null);
        }
    }, [selected, setValue]);

    // Determine if initial value is a custom amount
    const isInitialCustom = useMemo(() => {
        return initialValue != null && !donationPriceAvailable.includes(initialValue);
    }, [initialValue]);

    useEffect(() => {
        if (isInitialCustom && typeof initialValue === "number") {
            setCustomAmount(String(initialValue));
        }
    }, [isInitialCustom, initialValue]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center" >
                <img src={GateplusCoin.src}
                    alt="Gateplus Coin"
                    className="w-5 h-5"
                />
                <p>
                    Berikan Komentar dengan Reward kepada Content Creator
                </p>
            </div>
            <p>Saldo Koin Anda: <span className="font-bold text-[#F07F26]">55,060</span> Koin</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5">
                {donationPriceAvailable.map((price) => {
                    const isSelected = selected === price;
                    return (
                        <div key={price} className="flex justify-center montserratFont">
                            <div
                                className={`flex items-center rounded-md text-white py-4 w-full transition-colors ${isSelected ? "bg-linear-to-br from-[#D0870033] to-[#A65F001A] border border-[#F07F2680]" : "bg-[#F5F5F526] border-2 border-[#979797]"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    id={`${name}-${price}`}
                                    name={name}
                                    value={price}
                                    onChange={() => setSelected(price)}
                                    className="sr-only"
                                />
                                <label
                                    htmlFor={`${name}-${price}`}
                                    className={`text-sm font-bold text-white w-full cursor-pointer text-center flex flex-row items-center justify-center gap-1 ${isSelected ? "text-[#F07F26]" : "text-white"}`}
                                >
                                    <img src={GateplusCoin.src} alt="Gateplus Coin" className="w-5 h-5" /> {price.toLocaleString("id-ID")}
                                </label>
                            </div>
                        </div>
                    );
                })}
                {/* Custom amount input spanning grid 5 and 6 */}
                <div className="col-span-2">
                    <div className={`flex items-center rounded-md py-4 w-full ${customAmount ? "border-2 border-[#175BA6]" : ""} bg-[#F5F5F526] border-2 border-[#979797]`}>
                        <label htmlFor={`${name}-custom`} className="px-3 text-white font-bold">Rp</label>
                        <input
                            id={`${name}-custom`}
                            type="number"
                            min={0}
                            placeholder="Nominal"
                            className="w-full bg-transparent font-bold text-white placeholder-[#D0D0D0] outline-none px-2"
                            value={customAmount}
                            onChange={(e) => {
                                const val = e.target.value;
                                setCustomAmount(val);
                                if (val) {
                                    const num = Number(val);
                                    if (!Number.isNaN(num)) setSelected(num);
                                } else {
                                    setSelected(null);
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

CommentDonationForm.propTypes = {
    setValue: PropTypes.func,
    initialValue: PropTypes.number,
    name: PropTypes.string
};