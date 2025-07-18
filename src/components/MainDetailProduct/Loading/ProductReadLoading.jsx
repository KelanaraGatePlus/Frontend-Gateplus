import React from "react";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function DetailPageLoadingSkeleton({ isDark = true }) {
    const baseColor = isDark ? "#2e2e2e" : "#e0e0e0";
    const highlightColor = isDark ? "#3a3a3a" : "#f5f5f5";

    return (
        <div className={`flex flex-col overflow-y-hidden overflow-x-hidden ${isDark ? "bg-[#222222]" : "bg-white"}`}>
            <main className="flex flex-col">
                {/* Header */}
                <div className="fixed z-10 mt-0 flex w-full flex-row items-center justify-between gap-2 px-10 py-2 backdrop-blur">
                    <Skeleton circle width={50} height={50} baseColor={baseColor} highlightColor={highlightColor} />
                    <Skeleton width={"60%"} height={24} baseColor={baseColor} highlightColor={highlightColor} />
                    <Skeleton width={60} height={30} borderRadius={"100px"} baseColor={baseColor} highlightColor={highlightColor} />
                </div>

                {/* Banner */}
                <section className="relative mt-[75px] w-full">
                    <Skeleton height={256} baseColor={baseColor} highlightColor={highlightColor} />
                </section>

                {/* Isi Ebook */}
                <div className={`relative flex w-screen flex-col px-4 py-5 ${!isDark ? "text-white" : "text-[#222222]"} md:px-15`}>
                    {/* Judul */}
                    <div className="mx-auto mb-3">
                        <Skeleton
                            width={200}
                            height={50}
                            baseColor={baseColor}
                            highlightColor={highlightColor}
                        />
                    </div>

                    {/* Last updated */}
                    <div className="mx-auto mb-6">
                        <Skeleton
                            width={100}
                            height={16}
                            baseColor={baseColor}
                            highlightColor={highlightColor}
                        />
                    </div>

                    {/* Konten EPUB (Placeholder) */}
                    <div className="flex flex-col justify-center gap-1 mb-10">
                        {[...Array(7)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-full ${`px-${i+1 * 4}`}`}
                            >
                                <Skeleton
                                    height={12}
                                    width={"100%"}
                                    baseColor={baseColor}
                                    highlightColor={highlightColor}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

DetailPageLoadingSkeleton.propTypes = {
    isDark: PropTypes.bool,
}
