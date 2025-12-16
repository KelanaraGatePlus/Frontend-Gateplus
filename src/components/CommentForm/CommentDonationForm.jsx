import { donationPriceAvailable } from "@/lib/constants/donationPriceAvailable";
import { useEffect, useMemo, useState } from "react";

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
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5">
            {donationPriceAvailable.map((price) => {
                const isSelected = selected === price;
                return (
                    <div key={price} className="flex justify-center montserratFont">
                        <div
                            className={`flex items-center rounded-md text-white py-2 w-full transition-colors ${isSelected ? "bg-[#175BA6]" : "bg-[#707070] border-2 border-[#9e9e9e]"
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
                                className={`text-sm font-bold text-white w-full cursor-pointer text-center`}
                            >
                                Rp {price.toLocaleString("id-ID")}
                            </label>
                        </div>
                    </div>
                );
            })}
            {/* Custom amount input spanning grid 5 and 6 */}
            <div className="col-span-2">
                <div className={`flex items-center rounded-md py-2 w-full ${customAmount ? "border-2 border-[#175BA6]" : ""} bg-[#707070] border-2 border-[#9e9e9e]`}>
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
    );
}