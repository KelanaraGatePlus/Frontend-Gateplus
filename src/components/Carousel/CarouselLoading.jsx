import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

export default function CarouselLoading() {
    return (
        <section className="my-3 flex flex-col md:my-5">
            <Carousel className="sm:max-h-auto sm:max-w-auto">
                <div className="mb-2 flex justify-between text-white">
                    <div className="h-[28px] w-[140px] md:h-[32px] md:w-[200px] lg:h-[40px] lg:w-[240px]">
                        <Skeleton
                            borderRadius={8}
                            baseColor="#2e2e2e"
                            highlightColor="#3d3d3d"
                            height="100%"
                            width="100%"
                        />
                    </div>
                </div>

                <CarouselContent className="flex gap-x-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <CarouselItem
                            key={index}
                            className={`group relative flex cursor-pointer items-center overflow-visible ${index === 0 ? "pl-4 md:pl-0" : ""} h-[160px] w-[112px] md:h-[212px] md:w-[149px]`}
                            style={{ flex: "0 0 auto" }}
                        >
                            <div className="relative h-full w-full rounded-[6px]">
                                <Skeleton
                                    height="100%"
                                    width="100%"
                                    borderRadius="0.375rem"
                                    baseColor="#2e2e2e"
                                    highlightColor="#3d3d3d"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </section>
    );
}