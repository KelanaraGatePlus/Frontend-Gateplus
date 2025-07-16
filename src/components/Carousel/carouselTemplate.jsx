"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";

/*[--- CONSTANT IMPORT ---]*/
import { iconsProduct } from "@/lib/constants/IconsProduct";

/*[--- COMPONENTS IMPORT ---]*/
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import CarouselLoading from "@/components/Carousel/CarouselLoading";

export default function CarouselTemplate({ label, type, contents, isLoading, isTopTen = false, isOnCreatorProfile = false }) {
    const [showAll, setShowAll] = useState(false);

    return (
        <div>
            <section className={`px-2 ${isOnCreatorProfile ? "md:px-8" : "md:px-15"}`}>
                {isLoading ? (
                    <CarouselLoading />
                ) : (
                    contents.length > 0 && (
                        <section className={`flex flex-col my-3 ${isOnCreatorProfile ? "md:my-0 my-3" : "md:my-5 my-3"}`}>
                            <section className="">
                                <Carousel className="sm:max-h-auto sm:max-w-auto ">
                                    <div className="flex justify-between text-white">
                                        <p className="zeinFont md:mb-2 mb-1 text-2xl md:text-3xl lg:text-4xl xl:text-[40px] font-extrabold">
                                            {label}
                                        </p>
                                        {
                                            !isTopTen && (
                                                <p className="cursor-pointer text-xs lg:text-base font-semibold text-[#14CAFB] montserratFont flex">
                                                    <button
                                                        onClick={() => setShowAll(!showAll)}
                                                        className="cursor-pointer"
                                                    >
                                                        {!showAll ? "Lainnya" : "Lebih sedikit"}
                                                    </button>
                                                </p>
                                            )
                                        }
                                    </div>
                                    <CarouselContent className="">
                                        {contents.map((item, index) => {
                                            const fixedType = item.type || type;
                                            return (
                                                <CarouselItem
                                                    key={index}
                                                    className="overflow-hidden group relative h-[180px] w-[120px] cursor-pointer rounded-lg sm:h-[200px] sm:w-[140px] md:h-[320px] md:w-[230px] group"
                                                >
                                                    <Link href={`/${fixedType.charAt(0).toUpperCase() + fixedType.slice(1)}/Detail${fixedType.charAt(0).toUpperCase() + fixedType.slice(1)}/${item.id}`}>
                                                        <div className="relative h-full w-full">
                                                            {isTopTen ? (
                                                                <div className="bottom-0 left-0 rounded-tr-2xl bg-opacity-60 absolute z-10 bg-[#02536e] px-2 py-1 text-xs text-white h-fit w-fit drop-shadow-[0_0_2px_rgba(255,255,255,0.3)] flex items-center justify-center flex-col max-w-[65%] transition-all duration-300 ease-in-out">
                                                                    <div className="relative w-full h-full flex items-center justify-start gap-2 md:pr-2">
                                                                        <div className="relative w-[18px] h-[18px] md:w-[25px] md:h-[25px] shrink-0">
                                                                            <Image
                                                                                priority
                                                                                src={iconsProduct[fixedType]}
                                                                                alt={fixedType}
                                                                                fill
                                                                                className="bg-[#222222] p-1 rounded-full object-contain"
                                                                            />
                                                                        </div>
                                                                        <div className="font-semibold montserratFont text-[8px] md:text-base flex flex-col relative">
                                                                            <p className="mt-0.5 group-hover:mt-0">{fixedType.toUpperCase()}</p>
                                                                            <p className="montserratFont px-1 text-xs font-light line-clamp-1 max-h-0 overflow-hidden opacity-0 group-hover:max-h-6 group-hover:opacity-100 transition-all duration-300">
                                                                                {item.title}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <div className="bottom-0 right-0 rounded-tl-full bg-opacity-60 absolute z-10 bg-[#02536e] px-2 py-1 text-xs text-white h-[18%] md:h-[20%] w-[30%] drop-shadow-[0_0_2px_rgba(255,255,255,0.3)] flex items-center justify-center">
                                                                        <div className="relative w-full h-full">
                                                                            <Image
                                                                                priority
                                                                                width={45}
                                                                                height={45}
                                                                                src={iconsProduct[fixedType]}
                                                                                alt={fixedType}
                                                                                className="bg-[#222222] rounded-full p-1 absolute bottom-0 md:right-0 -right-0.5"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="absolute  flex left-0  items-center justify-center h-fit w-full -bottom-12 group-hover:bottom-2 transition-all duration-300 ease-in-out">
                                                                        <div className="rounded-2xl py-2 bg-opacity-60 w-[95%] z-10 bg-[#02536e]/30 backdrop-blur-2xl px-2 text-xs text-white h-fit drop-shadow-[0_0_2px_rgba(255,255,255,0.3)] flex items-center justify-center">
                                                                            <div className="relative w-full h-full flex items-center justify-start gap-2 md:pr-2">
                                                                                <div className="relative w-[18px] h-[18px] md:w-[25px] md:h-[25px] shrink-0">
                                                                                    <Image
                                                                                        priority
                                                                                        src={iconsProduct[fixedType]}
                                                                                        alt={fixedType}
                                                                                        fill
                                                                                        className="bg-[#222222] p-1 rounded-full object-contain"
                                                                                    />
                                                                                </div>
                                                                                <p className="font-semibold montserratFont text-[8px] md:text-base line-clamp-1">
                                                                                    {item.title}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}

                                                            <Image
                                                                src={fixedType === "podcast" ? item.coverPodcastImage : item.coverImageUrl}
                                                                priority
                                                                width={240}
                                                                height={353}
                                                                alt={item.title || "podcast-image"}
                                                                unoptimized
                                                                className={`h-full w-full rounded-lg bg-[#222222] object-cover group-hover:opacity-50 transition-all duration-300 ease-in-out ${isTopTen ? "opacity-50" : "opacity-100"}`}
                                                            />

                                                            {
                                                                isTopTen && (
                                                                    <p className="absolute bottom-1 right-1 z-10 text-6xl md:text-9xl font-extrabold zeinFont text-[#8EDEFA] flex leading-none -mb-4 md:-mb-8 drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]">
                                                                        {index + 1}
                                                                    </p>
                                                                )
                                                            }
                                                        </div>
                                                    </Link>
                                                </CarouselItem>
                                            );
                                        }
                                        )}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </section>
                        </section>
                    )
                )
                }
            </section >
        </div >
    );
}

CarouselTemplate.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    contents: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isTopTen: PropTypes.bool,
    isOnCreatorProfile: PropTypes.bool,
}
