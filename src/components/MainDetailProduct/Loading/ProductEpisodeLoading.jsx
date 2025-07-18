"use client";
import React from 'react';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ProductEpisodeSkeleton() {
    const episodeCount = 5;

    return (
        <section className="relative flex w-screen flex-col py-5 text-white animate-pulse">
            {/* Header */}
            <div className="flex px-4 md:px-15">
                <div className="mb-1 flex w-full items-center justify-center gap-2 rounded-lg bg-[#393939] py-2 animate-pulse h-12" />
            </div>

            {/* Episode List */}
            {[...Array(episodeCount)].map((_, index) => (
                <div
                    key={index}
                    className="group flex cursor-pointer items-stretch gap-2 px-4 py-2 md:gap-4 md:px-15"
                >
                    {/* Cover */}
                    <div className="h-24 w-24 md:h-36 md:w-36 overflow-hidden rounded-lg">
                        <Skeleton
                            height="100%"
                            width="100%"
                            borderRadius="0.75rem"
                            baseColor="#2e2e2e"
                            highlightColor="#3d3d3d"
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-1 flex-col justify-between rounded-lg bg-[#393939] p-2">
                        <div className="flex flex-col gap-2">
                            <Skeleton
                                height={25}
                                width="70%"
                                baseColor="#2e2e2e"
                                highlightColor="#3d3d3d"
                            />
                            <Skeleton
                                height={20}
                                width="30%"
                                baseColor="#2e2e2e"
                                highlightColor="#3d3d3d"
                            />
                            <Skeleton
                                height={15}
                                width="90%"
                                baseColor="#2e2e2e"
                                highlightColor="#3d3d3d"
                            />
                        </div>
                        <Skeleton width={100} height={12} borderRadius="0.75rem"
                            baseColor="#2e2e2e"
                            highlightColor="#3d3d3d" />
                    </div>
                </div>
            ))}
        </section>
    );
}