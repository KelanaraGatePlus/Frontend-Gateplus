"use client";
import React from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import PropTypes from "prop-types";


export default function PreviewContentHeader({
    posterImageUrl,
    title,
    description,
    author,
    ageRestriction,
    createdAt,
    categories,
    totalLikes,
    totalDislikes,
    totalSaves,
    totalShares,
    totalRevenue,
    totalUnitsSold,
    totalViews,
    totalReports,
}) {
    return (
        <div className="flex flex-col items-center md:flex-row md:justify-between gap-6">
            <div className="relative aspect-[16/10] md:self-stretch w-auto md:w-1/2 rounded-md overflow-hidden">
                <Image
                    src={posterImageUrl}
                    alt={title}
                    fill
                    className="object-cover rounded-lg"
                />
            </div>
            {/* 3. Gunakan data dari objek `content` yang sudah terstruktur */}
            <div className="flex flex-col w-[1200px] px-4 gap-6 text-white">
                <div>
                    <div className="text-4xl font-black flex flex-col zeinFont">
                        <h1>{title}</h1>
                    </div>
                    <div className="flex flex-row gap-2 font-normal mt-2">
                        <div className="rounded-full bg-[#1FC16B] px-4 py-1 font-bold">
                            {categories}
                        </div>
                        <div className="rounded-full bg-[#1FC16B] px-4 py-1 font-bold">
                            Movie
                        </div>
                        <div className="rounded-full bg-[#1FC16B] px-4 py-1 font-bold">
                            {ageRestriction}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6 font-normal">
                    <p>{description}</p>
                    <div className="flex flex-col gap-0">
                        <p>Judul: {title}</p>
                        <p>Penulis Cerita: {author}</p>
                        <p>Genre: {categories.tittle}</p>
                        <p>Dipublikasi: {createdAt}</p>
                    </div>
                </div>

                <div className="bg-[#686868] zeinFont p-2 rounded-lg">
                    <div className="w-full grid grid-cols-4 gap-4">
                        <div>
                            <div className="flex flex-row justify-start items-center gap-2 border-b-3 border-[#10ADF0]">
                                Like <Icon icon={'solar:info-circle-line-duotone'} className="inline-block" width={16} height={16} />
                            </div>
                            <p className="text-end font-black text-2xl">{totalLikes}</p>
                        </div>
                        <div>
                            <div className="flex flex-row justify-start items-center gap-2 border-b-3 border-[#10ADF0]">
                                Save <Icon icon={'solar:info-circle-line-duotone'} className="inline-block" width={16} height={16} />
                            </div>
                            <p className="text-end font-black text-2xl">{totalSaves}</p>
                        </div>
                        <div>
                            <div className="flex flex-row justify-start items-center gap-2 border-b-3 border-[#10ADF0]">
                                Share <Icon icon={'solar:info-circle-line-duotone'} className="inline-block" width={16} height={16} />
                            </div>
                            <p className="text-end font-black text-2xl">{totalShares}</p>
                        </div>
                        <div>
                            <div className="flex flex-row justify-start items-center gap-2 border-b-3 border-[#10ADF0]">
                                Jumlah Penonton <Icon icon={'solar:info-circle-line-duotone'} className="inline-block" width={16} height={16} />
                            </div>
                            <p className="text-end font-black text-2xl">{totalViews}</p>
                        </div>
                        <div className="col-span-3">
                            <div className="flex flex-row justify-start items-center gap-2 border-b-3 border-[#10ADF0]">
                                Revenue <Icon icon={'solar:info-circle-line-duotone'} className="inline-block" width={16} height={16} />
                            </div>
                            <p className="text-end font-black text-2xl">Rp {totalRevenue}</p>
                        </div>
                        <div>
                            <div className="flex flex-row justify-start items-center gap-2 border-b-3 border-[#10ADF0]">
                                Dibeli (unit) <Icon icon={'solar:info-circle-line-duotone'} className="inline-block" width={16} height={16} />
                            </div>
                            <p className="text-end font-black text-2xl">{totalUnitsSold}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#686868] zeinFont p-2 rounded-lg">
                    <div className="w-full grid grid-cols-4 gap-4">
                        <div>
                            <div className="flex flex-row justify-start items-center gap-2 border-b-3 border-red-600">
                                Report <Icon icon={'solar:info-circle-line-duotone'} className="inline-block" width={16} height={16} />
                            </div>
                            <p className="text-end font-black text-2xl">{totalReports}</p>
                        </div>
                        <div>
                            <div className="flex flex-row justify-start items-center gap-2 border-b-3 border-red-600">
                                Dislike <Icon icon={'solar:info-circle-line-duotone'} className="inline-block" width={16} height={16} />
                            </div>
                            <p className="text-end font-black text-2xl">{totalDislikes}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

PreviewContentHeader.propTypes = {
    posterImageUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    ageRestriction: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    categories: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            tittle: PropTypes.string,
        }),
    ]).isRequired,
    totalLikes: PropTypes.number.isRequired,
    totalDislikes: PropTypes.number.isRequired,
    totalSaves: PropTypes.number.isRequired,
    totalShares: PropTypes.number.isRequired,
    totalRevenue: PropTypes.number.isRequired,
    totalUnitsSold: PropTypes.number.isRequired,
    totalViews: PropTypes.number.isRequired,
    totalReports: PropTypes.number.isRequired,
}