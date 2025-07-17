import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ContentLoading() {
    return (
        <div className="overflow-hidden group relative h-[180px] w-[120px] cursor-pointer rounded-lg sm:h-[200px] sm:w-[140px] md:h-[320px] md:w-[230px] flex flex-col">
            <div className="relative h-full w-full rounded-lg">
                <Skeleton
                    height="100%"
                    width="100%"
                    borderRadius="0.75rem"
                    baseColor="#2e2e2e"
                    highlightColor="#3d3d3d"
                />
            </div>
            <div className="mt-2">
                <Skeleton
                    height={12}
                    width="80%"
                    baseColor="#2e2e2e"
                    highlightColor="#3d3d3d"
                />
                <Skeleton
                    height={10}
                    width="60%"
                    baseColor="#2e2e2e"
                    highlightColor="#3d3d3d"
                    className="mt-1"
                />
            </div>
        </div>
    )
}
