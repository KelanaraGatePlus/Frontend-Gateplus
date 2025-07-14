/* eslint-disable react/react-in-jsx-scope */
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";
import { useState } from "react";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

/*[--- ASSETS IMPORT ---]*/
import logoEComics from "@@/logo/logo-icons-comic-news.svg";
import logoEbook from "@@/logo/logo-icons-ebook-news.svg";
import logoMovie from "@@/logo/logo-icons-film-news.svg";
import logoPodcast from "@@/logo/logo-icons-podcast-news.svg";
import logoSeries from "@@/logo/logo-icons-series-news.svg";

const icons = {
    series: logoSeries,
    movie: logoMovie,
    ebook: logoEbook,
    comic: logoEComics,
    podcast: logoPodcast,
};

export default function CarouselTemplate({ label, type, contents, isLoading, isTopTen = false }) {
    const [showAll, setShowAll] = useState(false);

    return (
        <div>
            <section className="px-4 md:px-15">
                {isLoading ? (
                    <div className="my-5 flex h-[70%] flex-col items-center justify-center">
                        <svg
                            aria-hidden="true"
                            className="dark:text-white-600 mr-2 h-16 w-16 animate-spin fill-blue-600 text-gray-200"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            />
                        </svg>
                        <p className="mt-5 text-white italic">Sedang mengambil data...</p>
                    </div>
                ) : (
                    contents.length > 0 && (
                        <section className="flex flex-col my-5">
                            <section className="">
                                <Carousel className="sm:max-h-auto sm:max-w-auto">
                                    <div className="flex justify-between text-white">
                                        <p className="zeinFont mb-2 text-2xl md:text-3xl lg:text-4xl xl:text-[40px] font-extrabold">
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
                                                                                src={icons[fixedType]}
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
                                                                                src={icons[fixedType]}
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
                                                                                        src={icons[fixedType]}
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
}
