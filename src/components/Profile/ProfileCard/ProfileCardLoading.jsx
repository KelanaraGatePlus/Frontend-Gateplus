import Skeleton from "react-loading-skeleton";
import PropTypes from "prop-types";
import "react-loading-skeleton/dist/skeleton.css";
import React from "react";

export default function ProfileCardLoading({ profileFor = "user" }) {
    return (
        <div className="relative mt-1 flex h-fit w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-[#FFFFFF1A] backdrop-blur-lg p-4 transition-all duration-300 ease-out md:max-w-[300px] md:min-w-[300px]">
            {profileFor === "creator" && (
                <section className="absolute top-0 mb-2 h-36 w-full overflow-hidden md:hidden md:h-32 lg:w-full">
                    <Skeleton height="100%" width="100%" baseColor="#2e2e2e" highlightColor="#3d3d3d" />
                </section>
            )}

            <div className="z-0 mt-8 mb-2 h-32 w-32 shrink-0 rounded-full shadow-2xl transition-all duration-300 ease-out md:mt-2 md:h-36 md:w-36">
                <Skeleton circle height="100%" width="100%" baseColor="#2e2e2e" highlightColor="#3d3d3d" />
            </div>

            <div className="flex w-full flex-col gap-3">
                <div className="text-white flex flex-col gap-1">
                    <h1 className="zeinFont mt-2 text-[28px] leading-6 font-semibold lg:text-3xl">
                        <Skeleton width={180} height={30} baseColor="#2e2e2e" highlightColor="#3d3d3d" />
                    </h1>
                    <div className="flex items-center gap-1 text-sm text-[12px] leading-4 text-gray-300 lg:text-base">
                        <Skeleton width={100} height={16} baseColor="#2e2e2e" highlightColor="#3d3d3d" />
                    </div>
                </div>

                {profileFor === "creator" && (
                    <div className="grid grid-cols-2 text-white gap-4">
                        <Skeleton
                            height={24}
                            width="100%"
                            baseColor="#2e2e2e"
                            highlightColor="#3d3d3d"
                        />
                        <Skeleton
                            height={24}
                            width="100%"
                            baseColor="#2e2e2e"
                            highlightColor="#3d3d3d"
                        />
                    </div>
                )}

                <Skeleton
                    borderRadius={8}
                    baseColor="#2e2e2e"
                    highlightColor="#3d3d3d"
                    height={100}
                    width="100%"
                />

                {profileFor === "creator" && (
                    <div className="flex justify-between rounded-md px-2">
                        {Array.from({ length: 4 }).map((_, idx) => (
                            <Skeleton
                                key={idx}
                                circle
                                height={40}
                                width={40}
                                baseColor="#2e2e2e"
                                highlightColor="#3d3d3d"
                            />
                        ))}
                    </div>
                )}

                <Skeleton
                    borderRadius={8}
                    height={40}
                    width="100%"
                    baseColor="#2e2e2e"
                    highlightColor="#3d3d3d"
                />
            </div>
        </div>
    );
}

ProfileCardLoading.propTypes = {
    profileFor: PropTypes.oneOf(["creator", "user"]).isRequired,
};
