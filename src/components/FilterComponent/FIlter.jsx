import React from "react";
import { useGetAllCategoriesQuery } from "@/hooks/api/categorySliceAPI";
import IconFilter from "@@/icons/icon_filter.svg";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import PropTypes from "prop-types";

export default function Filter({ contentType, textColor, buttonColor }) {
    const { data, isLoading } = useGetAllCategoriesQuery();

    // Ambil list kategori dari response
    const categories = data?.data?.data || [];

    // Ambil query param "cat"
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentGenre = searchParams.get("cat") || "Semua";

    const handleClick = (genre) => {
        const params = new URLSearchParams(searchParams.toString());

        if (genre === "Semua") {
            params.delete("cat"); // kalau Semua, hapus query param
        } else {
            params.set("cat", genre); // set sesuai genre
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // Skeleton Loader
    if (isLoading) {
        return (
            <div className="w-full h-max flex flex-row justify-between items-center gap-10 px-10 py-8 bg-[#DEDEDE1A] rounded-[6px] border-white border-[1px]">
                <div className="flex flex-row gap-1 items-center">
                    <Image
                        src={IconFilter}
                        alt="icon-filter"
                        width={32}
                        height={32}
                    />
                    <p className="font-bold text-[16px] text-white">
                        Filter <span style={{ color: textColor }} className="text-lg">{contentType}</span>
                    </p>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    {[...Array(4)].map((_, idx) => (
                        <div
                            key={idx}
                            className="w-20 h-9 rounded-full bg-gray-700 animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    // Genres dari API + "Semua" di depan
    const genres = ["Semua", ...categories.map((c) => c.tittle)];

    return (
        <div className="w-full h-max flex flex-col md:flex-row justify-between md:items-center gap-6 md:gap-10 px-2 py-4 md:px-10 md:py-8 bg-[#DEDEDE1A] rounded-[6px] border-gray-600 border-[1px]">
            <div className="flex flex-row gap-1 items-center w-max">
                <Image
                    src={IconFilter}
                    alt="icon-filter"
                    width={32}
                    height={32}
                />
                <p className="font-bold text-[16px] text-white flex items-center gap-1">
                    Filter <span style={{ color: textColor }} className="text-lg">{contentType}</span>
                </p>
            </div>
            <div className="w-full flex flex-row gap-2 items-center" style={{ direction: 'rtl' }}
            >
                {genres.map((genre) => (
                    <button
                        key={genre}
                        onClick={() => handleClick(genre)}
                        style={{
                            background: currentGenre === genre
                                ? `linear-gradient(to bottom, ${buttonColor?.activeFrom || "#219BFF"}, ${buttonColor?.activeTo || "#156EB7"})`
                                : "#686868", // default color
                            color: "white",
                        }}
                        className={"rounded-full w-max text-center px-4 py-1 md:py-2 font-semibold text-[14px] transition hover:cursor-pointer"}
                    >
                        {genre}
                    </button>
                ))}
            </div>
        </div>
    );
}

Filter.propTypes = {
    contentType: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired,
    buttonColor: PropTypes.shape({
        activeFrom: PropTypes.string,
        activeTo: PropTypes.string,
    }),
};
