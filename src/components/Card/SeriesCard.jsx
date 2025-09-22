import React from "react";
import { contentType } from "@/lib/constants/contentType";
import Image from "next/image";
import Link from "next/link";
import logoSave from "@@/logo/logoDetailFilm/save-icons.svg";
import logoGateplusWhite from "@@/logo/logoGate+/logo-gateplus-white.svg";
import blur from "@@/poster/blur.svg";
import iconMore from "@@/icons/icon_more.svg";
import PropTypes from "prop-types";

export default function SeriesCard({ title, id, coverUrl, rank = null }) {
    return (
        <Link href={`/${contentType.series.pluralName}/detail/${id}`} className="h-full w-full">
            <div className="relative h-full w-full rounded-[6px] overflow-hidden group">
                {/* Banner Atas */}
                <div className="absolute top-0 left-0 w-full flex justify-between items-center z-20 px-2 py-1">
                    <div
                        className="flex flex-row items-start gap-1 
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                    >
                        <div className="flex flex-col rounded-sm bg-[#22222233] backdrop-blur-xs py-1 px-4 font-black items-center text-cyan-400 zeinFont">
                            <span className="text-sm">Teratas</span>
                            <span className="text-3xl">{rank || 1}</span>
                        </div>
                        <span className="text-sm text-cyan-200 font-semibold zeinFont bg-[#22222233] backdrop-blur-xs rounded-sm px-2">
                            Episode Baru
                        </span>
                    </div>

                    {/* Icon more → hanya muncul saat hover */}
                    <Image
                        priority
                        width={24}
                        height={24}
                        src={iconMore}
                        alt="more-icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                    />
                </div>

                {/* Konten Bawah */}
                <div className="absolute bottom-0 left-0 right-0 z-20 px-1 flex justify-between items-center">
                    {/* series icon → selalu tampil */}
                    <Image
                        priority
                        width={45}
                        height={45}
                        src={contentType.series.icon}
                        alt="series-icon"
                        className="drop-shadow-lg"
                    />

                    {/* Text "Original" → muncul saat hover */}
                    <div
                        className="flex items-center self-end text-white px-2 py-1 rounded-sm bg-[#22222233] backdrop-blur-xs 
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                    >
                        <Image
                            priority
                            width={18}
                            height={18}
                            src={logoGateplusWhite}
                            alt="logo-gateplus-white"
                            className="mr-1"
                        />
                        <p className="zeinFont text-xs">Original</p>
                    </div>

                    {/* Bookmark icon → hanya muncul saat hover */}
                    <Image
                        priority
                        width={28}
                        height={28}
                        src={logoSave}
                        alt="save-icon"
                        className="drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                    />
                </div>

                {/* Poster */}
                <Image
                    src={coverUrl}
                    priority
                    width={240}
                    height={353}
                    alt={title || "series-image"}
                    unoptimized
                    className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />

                {/* Blur pojok kiri bawah */}
                <Image
                    src={blur}
                    priority
                    width={14}
                    height={14}
                    alt="blur"
                    className="absolute h-16 w-16 bottom-0 left-0"
                />
            </div>
        </Link>
    );
}

SeriesCard.propTypes = {
    title: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    coverUrl: PropTypes.string.isRequired,
    rank: PropTypes.number,
};
