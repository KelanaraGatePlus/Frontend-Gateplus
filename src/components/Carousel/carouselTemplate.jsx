"use client";
import React, { useState } from "react";
import PropTypes from "prop-types";

/*[--- COMPONENTS IMPORT ---]*/
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import CarouselLoading from "@/components/Carousel/CarouselLoading";
import EbookCard from "../Card/EbookCard";
import ComicCard from "../Card/ComicCard";
import MovieCard from "../Card/MovieCard";
import SeriesCard from "../Card/SeriesCard";
import PodcastCard from "../Card/PodcastCard";
import PodcastUniqueCard from "../Card/PodcastUniqueCard";

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
                                    <CarouselContent>
                                        {contents.map((item, index) => {
                                            const fixedType = item.type || type;
                                            return (
                                                <CarouselItem
                                                    key={index}
                                                    className={`overflow-hidden group relative flex items-center ${isTopTen ? "w-[240px] sm:w-[180px] md:w-[460px]" : "w-[120px] sm:w-[140px] md:w-[230px] aspect-[2/3]"} cursor-pointer rounded-lg group`}
                                                >
                                                    {fixedType == 'ebook' && !isTopTen && (
                                                        <EbookCard title={item.title} id={item.id} coverUrl={item.posterImageUrl} />
                                                    )}

                                                    {fixedType == 'comic' && !isTopTen && (
                                                        <ComicCard title={item.title} id={item.id} coverUrl={item.posterImageUrl} />
                                                    )}

                                                    {fixedType == 'movie' && !isTopTen && (
                                                        <MovieCard title={item.title} id={item.id} coverUrl={item.posterImageUrl} />
                                                    )}

                                                    {fixedType == 'series' && !isTopTen && (
                                                        <SeriesCard title={item.title} id={item.id} coverUrl={item.posterImageUrl} />
                                                    )}

                                                    {fixedType == 'podcast' && type == null && !isTopTen && (
                                                        <PodcastCard title={item.title} id={item.id} coverUrl={item.coverPodcastImage} />
                                                    )}

                                                    {fixedType == 'podcast' && type && !isTopTen && (
                                                        <PodcastUniqueCard title={item.title} id={item.id} coverUrl={item.coverPodcastImage} creatorName={item.Creator.profileName} releaseDate={item.createdAt} />
                                                    )}

                                                    <div className={`${isTopTen ? "grid grid-cols-17" : ""}`}>
                                                        {isTopTen && (
                                                            <div className="relative w-full h-full col-span-8">
                                                                <p className="absolute -bottom-10 md:bottom-5 md:-right-6 -right-4 text-[230px] md:text-[350px]/46.5 font-extrabold zeinFont flex leading-none -mb-4 md:-mb-8 text-[#1297DC] [text-shadow:2px_2px_5px_rgba(0,0,0,0.4)]">
                                                                    {index + 1}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {fixedType == 'ebook' && isTopTen && (
                                                            <div className="aspect-[2/3] rounded-lg overflow-hidden col-span-9">
                                                                <EbookCard title={item.title} id={item.id} coverUrl={item.posterImageUrl} />
                                                            </div>
                                                        )}

                                                        {fixedType == 'comic' && isTopTen && (
                                                            <div className="aspect-[2/3] rounded-lg overflow-hidden col-span-9">
                                                                <ComicCard title={item.title} id={item.id} coverUrl={item.posterImageUrl} />
                                                            </div>
                                                        )}

                                                        {fixedType == 'movie' && isTopTen && (
                                                            <div className="aspect-[2/3] rounded-lg overflow-hidden col-span-9">
                                                                <MovieCard title={item.title} id={item.id} coverUrl={item.posterImageUrl} />
                                                            </div>
                                                        )}

                                                        {fixedType == 'series' && isTopTen && (
                                                            <div className="aspect-[2/3] rounded-lg overflow-hidden col-span-9">
                                                                <SeriesCard title={item.title} id={item.id} coverUrl={item.posterImageUrl} />
                                                            </div>
                                                        )}

                                                        {fixedType == 'podcast' && isTopTen && (
                                                            <div className="aspect-[2/3] rounded-lg overflow-hidden col-span-9">
                                                                <PodcastCard title={item.title} id={item.id} coverUrl={item.coverPodcastImage} />
                                                            </div>
                                                        )}
                                                    </div>
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
