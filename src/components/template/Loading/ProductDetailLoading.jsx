import React from 'react';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function DetailPageLoading() {
    return (
        <section className="relative w-full">

            <div className="absolute -z-10 h-72 w-full overflow-hidden">
                <Skeleton
                    height="100%"
                    width="100%"
                    borderRadius="0.75rem"
                    baseColor="#2e2e2e"
                    highlightColor="#3d3d3d"
                />
                <div className="absolute top-0 left-0 z-0 h-full w-full bg-gradient-to-b from-transparent to-black opacity-50" />
            </div>


            <div className="flex w-screen flex-col items-end gap-4 px-4 py-8 md:px-15 lg:flex-row">
                {/* Cover */}
                <div
                    className={`relative overflow-hidden rounded-lg md:rounded h-[300px] w-[200px] md:h-[500px] md:w-[337px]`}
                >
                    <Skeleton
                        height="100%"
                        width="100%"
                        baseColor="#2e2e2e"
                        highlightColor="#3d3d3d"
                    />
                </div>

                {/* Detail */}
                <div className="flex w-full flex-1 flex-col justify-end gap-2">
                    <div>
                        <Skeleton
                            height={50}
                            width="80%"
                            borderRadius="5px"
                            baseColor="#2e2e2e"
                            highlightColor="#3d3d3d"
                        />
                        <div className="flex gap-2 text-sm font-light">
                            <Skeleton
                                height={20}
                                width={200}
                                borderRadius="5px"
                                baseColor="#2e2e2e"
                                highlightColor="#3d3d3d"
                            />
                        </div>
                    </div>

                    {/* Action buttons & Creator Info */}
                    <div
                        className={`flex flex-col gap-2`}
                    >
                        <div className="flex gap-2 items-center">
                            <Skeleton
                                width={170}
                                height={50}
                                borderRadius="100px"
                                baseColor="#2e2e2e"
                                highlightColor="#3d3d3d"
                            />
                            <Skeleton
                                circle
                                width={50}
                                height={50}
                                baseColor="#2e2e2e"
                                highlightColor="#3d3d3d"
                            />
                            <Skeleton
                                circle
                                width={50}
                                height={50}
                                baseColor="#2e2e2e"
                                highlightColor="#3d3d3d"
                            />
                            <Skeleton
                                circle
                                width={50}
                                height={50}
                                baseColor="#2e2e2e"
                                highlightColor="#3d3d3d"
                            />
                            <Skeleton
                                circle
                                width={50}
                                height={50}
                                baseColor="#2e2e2e"
                                highlightColor="#3d3d3d"
                            />
                        </div>

                        {/* Creator Info */}
                        <div
                            className={`flex items-center gap-4`}
                        >
                            <Skeleton
                                circle
                                width={70}
                                height={70}
                                baseColor="#2e2e2e"
                                highlightColor="#3d3d3d"
                            />
                            <div>
                                <Skeleton
                                    width={200}
                                    height={40}
                                    borderRadius={5}
                                    baseColor="#2e2e2e"
                                    highlightColor="#3d3d3d"
                                />
                                <Skeleton
                                    width={100}
                                    height={15}
                                    baseColor="#2e2e2e"
                                    highlightColor="#3d3d3d"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-4 rounded-lg bg-[#393939] h-42 p-4">
                        <Skeleton
                            count={4}
                            height={20}
                            baseColor="#2e2e2e"
                            highlightColor="#3d3d3d"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}