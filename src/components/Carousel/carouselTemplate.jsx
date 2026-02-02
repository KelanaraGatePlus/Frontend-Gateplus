"use client";
import React from "react";
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
import EducationCard from "../Card/EducationCard";

export default function CarouselTemplate({ label, type, contents, isLoading, isTopTen = false, isOnCreatorProfile = false, withGradient = true, withTopTag = true, withNewestTag = false }) {
    return (
        <div>
            <section className={`px-8 ${isOnCreatorProfile ? "md:px-8" : "md:px-16"}`}>
                {isLoading ? (
                    <CarouselLoading />
                ) : (
                    contents.length > 0 && (
                        <section className={`flex flex-col my-3 ${isOnCreatorProfile ? "md:my-0 my-3" : "md:my-5 my-3"}`}>
                            <section className="">
                                <Carousel className="sm:max-h-auto sm:max-w-auto ">
                                    <p className="zeinFont text-white md:mb-2 mb-1 text-2xl md:text-3xl lg:text-4xl xl:text-[40px] font-extrabold">
                                        {label}
                                    </p>
                                    <div className="relative">
                                        <CarouselContent>
                                            {contents.map((item, index) => {
                                                const fixedType = item.type || type;
                                                return (
                                                    <CarouselItem
                                                        key={index}
                                                        className={`overflow-hidden group relative flex items-center ${isTopTen ? "w-[240px] sm:w-[180px] md:w-[460px]" : "w-[120px] sm:w-[140px] md:w-[230px] aspect-[2/3]"} cursor-pointer rounded-md group`}
                                                    >
                                                        {fixedType == 'ebook' && !isTopTen && (
                                                            <EbookCard withTopTag={withTopTag} title={item.title} rank={index + 1} id={item.id} coverUrl={item.posterImageUrl} hasNewEpisode={item.hasNewEpisodes} withNewestTag={withNewestTag} />
                                                        )}

                                                        {fixedType == 'comic' && !isTopTen && (
                                                            <ComicCard withTopTag={withTopTag} title={item.title} rank={index + 1} id={item.id} coverUrl={item.posterImageUrl} hasNewEpisode={item.hasNewEpisodes} withNewestTag={withNewestTag} />
                                                        )}

                                                        {fixedType == 'movie' && !isTopTen && (
                                                            <MovieCard withTopTag={withTopTag} title={item.title} rank={index + 1} id={item.id} coverUrl={item.thumbnailImageUrl} hasNewEpisode={item.hasNewEpisodes} withNewestTag={withNewestTag} />
                                                        )}

                                                        {fixedType == 'series' && !isTopTen && (
                                                            <SeriesCard withTopTag={withTopTag} title={item.title} rank={index + 1} id={item.id} coverUrl={item.thumbnailImageUrl} hasNewEpisode={item.hasNewEpisodes} withNewestTag={withNewestTag} />
                                                        )}

                                                        {fixedType == 'podcast' && type == null && !isTopTen && (
                                                            <PodcastCard withTopTag={withTopTag} title={item.title} rank={index + 1} id={item.id} coverUrl={item.coverPodcastImage} hasNewEpisode={item.hasNewEpisodes} withNewestTag={withNewestTag} />
                                                        )}

                                                        {fixedType == 'podcast' && type && !isTopTen && (
                                                            <PodcastUniqueCard title={item.title} id={item.id} coverUrl={item.coverPodcastImage} creatorName={item.Creator.profileName} releaseDate={item.createdAt} hasNewEpisode={item.hasNewEpisodes} />
                                                        )}

                                                        {fixedType == 'education' && !isTopTen && (
                                                            <EducationCard title={item.title} id={item.id} coverUrl={item.bannerUrl} creatorName={item.creator.profileName} releaseDate={item.createdAt} />
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
                                                                <div className="aspect-[2/3] rounded-md overflow-hidden col-span-9">
                                                                    <EbookCard withTopTag={withTopTag} title={item.title} id={item.id} coverUrl={item.posterImageUrl} hasNewEpisode={item.hasNewEpisodes} withNewestTag={withNewestTag} />
                                                                </div>
                                                            )}

                                                            {fixedType == 'comic' && isTopTen && (
                                                                <div className="aspect-[2/3] rounded-md overflow-hidden col-span-9">
                                                                    <ComicCard withTopTag={withTopTag} title={item.title} id={item.id} coverUrl={item.posterImageUrl} hasNewEpisode={item.hasNewEpisodes} withNewestTag={withNewestTag} />
                                                                </div>
                                                            )}

                                                            {fixedType == 'movie' && isTopTen && (
                                                                <div className="aspect-[2/3] rounded-md overflow-hidden col-span-9">
                                                                    <MovieCard withTopTag={withTopTag} title={item.title} id={item.id} coverUrl={item.thumbnailImageUrl} hasNewEpisode={item.hasNewEpisodes} withNewestTag={withNewestTag} />
                                                                </div>
                                                            )}

                                                            {fixedType == 'series' && isTopTen && (
                                                                <div className="aspect-[2/3] rounded-md overflow-hidden col-span-9">
                                                                    <SeriesCard withTopTag={withTopTag} title={item.title} id={item.id} coverUrl={item.thumbnailImageUrl} hasNewEpisode={item.hasNewEpisodes} withNewestTag={withNewestTag} />
                                                                </div>
                                                            )}

                                                            {fixedType == 'podcast' && isTopTen && (
                                                                <div className="aspect-[2/3] rounded-md overflow-hidden col-span-9">
                                                                    <PodcastCard withTopTag={withTopTag} title={item.title} id={item.id} coverUrl={item.coverPodcastImage} hasNewEpisode={item.hasNewEpisodes} withNewestTag={withNewestTag} />
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
                                        {
                                            withGradient && (
                                                <>
                                                    {/* Left shadow gradient */}
                                                    <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-14 z-14 opacity-14 bg-gradient-to-r from-neutral-100 to-neutral-100/0 rounded-l-md" />

                                                    {/* Right shadow gradient */}
                                                    <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-14 z-14 opacity-14 bg-gradient-to-l from-neutral-100 to-neutral-100/0 rounded-r-md" />
                                                </>
                                            )
                                        }
                                    </div>
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
    withGradient: PropTypes.bool,
    withTopTag: PropTypes.bool,
    withNewestTag: PropTypes.bool,
}
