"use client";
import React from "react";
import PropTypes from "prop-types";

/* COMPONENTS IMPORT */
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
import getMinAge from "@/lib/helper/minAge";

export default function CarouselTemplate({
  label,
  type,
  contents,
  isLoading,
  isTopTen = false,
  isOnCreatorProfile = false,
  withTopTag = true,
  withNewestTag = false,
  isBlurred,
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-md">
      <section
        className={`px-8 ${isOnCreatorProfile ? "md:px-8" : "md:px-16"}`}
      >
        {isLoading ? (
          <CarouselLoading />
        ) : (
          contents.length > 0 && (
            <section
              className={`flex flex-col ${
                isOnCreatorProfile ? "my-3 md:my-0" : "my-3 md:my-5"
              }`}
            >
              <Carousel>
                <p className="zeinFont mb-1 text-2xl font-extrabold text-white md:mb-2 md:text-3xl lg:text-4xl xl:text-[40px]">
                  {label}
                </p>

                {/* WRAPPER RELATIVE */}
                <div className="relative">
                  <CarouselContent>
                    {contents.map((item, index) => {
                      const fixedType = item.type || type;
                      const blurred =
                        typeof isBlurred === "function"
                          ? isBlurred(item)
                          : false;

                      const minAge = item.ageRestriction
                        ? getMinAge(item.ageRestriction)
                        : null;

                      const isUniquePodcast = fixedType === "podcast" && type;

                      return (
                        <CarouselItem
                          key={index}
                          className={`group relative flex items-center overflow-hidden ${
                            isTopTen
                              ? "h-[190px] w-[240px] sm:h-[370px] sm:w-[180px] md:h-[370px] md:w-[460px]"
                              : "aspect-[2/3] w-[120px] sm:w-[140px] md:w-[230px]"
                          } cursor-pointer rounded-md`}
                        >
                          {isTopTen ? (
                            <div className="grid h-full w-full grid-cols-17 items-end">
                              <div className="relative col-span-8 flex h-full w-full items-end justify-end overflow-visible">
                                <p className="zeinFont translate-x-6 translate-y-[15%] text-[200px] leading-[0.7] font-extrabold text-[#1297DC] md:text-[310px] lg:text-[350px]">
                                  {index + 1}
                                </p>
                              </div>

                              <div className="relative col-span-9 aspect-[2/3] overflow-hidden rounded-md">
                                {fixedType === "ebook" && (
                                  <EbookCard
                                    {...item}
                                    coverUrl={item.posterImageUrl}
                                  />
                                )}
                                {fixedType === "movie" && (
                                  <MovieCard
                                    {...item}
                                    coverUrl={item.thumbnailImageUrl}
                                  />
                                )}
                                {fixedType === "series" && (
                                  <SeriesCard
                                    {...item}
                                    coverUrl={item.thumbnailImageUrl}
                                  />
                                )}
                                {fixedType === "podcast" && (
                                  <PodcastCard
                                    {...item}
                                    coverUrl={item.coverPodcastImage}
                                  />
                                )}
                                {fixedType === "comic" && (
                                  <ComicCard
                                    {...item}
                                    coverUrl={item.posterImageUrl}
                                  />
                                )}

                                {blurred && minAge && (
                                  <div className="pointer-events-none absolute inset-0 z-10">
                                    <div className="absolute inset-0 rounded-[6px] bg-black/10 backdrop-blur-sm" />
                                    <div className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                                      <span className="rounded-lg bg-red-600 px-4 py-2 text-sm font-black text-white">
                                        {minAge}+
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="relative h-full w-full">
                              {fixedType === "ebook" && (
                                <EbookCard
                                  withTopTag={withTopTag}
                                  title={item.title}
                                  rank={index + 1}
                                  id={item.id}
                                  coverUrl={item.posterImageUrl}
                                  hasNewEpisode={item.hasNewEpisodes}
                                  withNewestTag={withNewestTag}
                                />
                              )}
                              {fixedType === "comic" && (
                                <ComicCard
                                  withTopTag={withTopTag}
                                  title={item.title}
                                  rank={index + 1}
                                  id={item.id}
                                  coverUrl={item.posterImageUrl}
                                  hasNewEpisode={item.hasNewEpisodes}
                                  withNewestTag={withNewestTag}
                                />
                              )}
                              {fixedType === "movie" && (
                                <MovieCard
                                  withTopTag={withTopTag}
                                  title={item.title}
                                  rank={index + 1}
                                  id={item.id}
                                  coverUrl={item.thumbnailImageUrl}
                                  hasNewEpisode={item.hasNewEpisodes}
                                  withNewestTag={withNewestTag}
                                />
                              )}
                              {fixedType === "series" && (
                                <SeriesCard
                                  withTopTag={withTopTag}
                                  title={item.title}
                                  rank={index + 1}
                                  id={item.id}
                                  coverUrl={item.thumbnailImageUrl}
                                  hasNewEpisode={item.hasNewEpisodes}
                                  withNewestTag={withNewestTag}
                                />
                              )}
                              {fixedType === "podcast" && !type && (
                                <PodcastCard
                                  withTopTag={withTopTag}
                                  title={item.title}
                                  rank={index + 1}
                                  id={item.id}
                                  coverUrl={item.coverPodcastImage}
                                  hasNewEpisode={item.hasNewEpisodes}
                                  withNewestTag={withNewestTag}
                                />
                              )}

                              {isUniquePodcast && (
                                <PodcastUniqueCard
                                  title={item.title}
                                  id={item.id}
                                  coverUrl={item.coverPodcastImage}
                                  creatorName={item.Creator?.profileName}
                                  releaseDate={item.createdAt}
                                  hasNewEpisode={item.hasNewEpisodes}
                                  isBlurred={blurred}
                                  minAge={minAge}
                                />
                              )}

                              {fixedType === "education" && (
                                <EducationCard
                                  title={item.title}
                                  id={item.id}
                                  coverUrl={item.bannerUrl}
                                  creatorName={item.creator?.profileName}
                                  releaseDate={item.createdAt}
                                />
                              )}

                              {blurred && minAge && !isUniquePodcast && (
                                <div className="pointer-events-none absolute inset-0 z-10">
                                  <div className="absolute inset-0 rounded-[6px] bg-black/10 backdrop-blur-sm" />
                                  <div className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                                    <span className="rounded-lg bg-red-600 px-4 py-2 text-sm font-black text-white">
                                      {minAge}+
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  {type !== "podcast" && (
                    <>
                      <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-10 rounded-[6px] bg-gradient-to-r from-white/20 to-transparent backdrop-blur-[0.5px]" />
                      <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-10 rounded-[6px] bg-gradient-to-l from-white/20 to-transparent backdrop-blur-[0.5px]" />
                    </>
                  )}

                  {/* BUTTON */}
                  <CarouselPrevious />
                  <CarouselNext />
                </div>
              </Carousel>
            </section>
          )
        )}
      </section>
    </div>
  );
}

CarouselTemplate.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  contents: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isTopTen: PropTypes.bool,
  isOnCreatorProfile: PropTypes.bool,
  withTopTag: PropTypes.bool,
  withNewestTag: PropTypes.bool,
  isBlurred: PropTypes.func,
};
