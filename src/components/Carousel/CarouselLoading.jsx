import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel";

export default function CarouselLoading() {
    return (
        <section className="flex flex-col md:my-5 my-3">
            <Carousel className="sm:max-h-auto sm:max-w-auto">
                <div className="flex justify-between text-white mb-2">
                    <div className="w-[140px] h-[28px] md:w-[200px] md:h-[32px] lg:w-[240px] lg:h-[40px]">
                        <Skeleton
                            borderRadius={8}
                            baseColor="#2e2e2e"
                            highlightColor="#3d3d3d"
                            height="100%"
                            width="100%"
                        />
                    </div>
                </div>

                <CarouselContent>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <CarouselItem
                            key={index}
                            className="overflow-hidden group relative h-[180px] w-[120px] cursor-pointer rounded-lg sm:h-[200px] sm:w-[140px] md:h-[320px] md:w-[230px] flex flex-col"
                        >
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
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </section>
    );
}