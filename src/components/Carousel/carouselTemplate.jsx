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
  const resolveBlur = (item) => {
    if (typeof isBlurred !== "function") return false;
    return isBlurred(item);
  };

  const resolveMinAge = (item) => {
    if (!item?.ageRestriction) return null;
    return getMinAge(item.ageRestriction);
  };

  const resolveType = (item) => {
    return item.type || type;
  };

  const resolvePodcastSize = (label, fixedType) => {
    const isPopularPodcast =
      label === "Popular Podcasts" && fixedType === "podcast";

    if (isPopularPodcast) {
      return "h-[200px] w-[120px] md:h-[250px] md:w-[150px] lg:h-[300px] lg:w-[180px]";
    }

    if (isTopTen) {
      return "h-[220px] w-[250px] md:h-[230px] md:w-[250px] lg:w-[290px]";
    }

    return "h-[212px] w-[149px]";
  };

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

                <div className="relative">
                  <CarouselContent
                    className={isTopTen ? "flex gap-x-5" : "flex gap-x-4"}
                  >
                    {contents.map((item, index) => {
                      const fixedType = resolveType(item);
                      const blurred = resolveBlur(item);
                      const minAge = resolveMinAge(item);

                      const isUniquePodcast = fixedType === "podcast" && type;

                      const podcastSize = resolvePodcastSize(label, fixedType);

                      return (
                        <CarouselItem
                          key={index}
                          className={`group relative flex cursor-pointer items-center overflow-visible ${podcastSize}`}
                          style={{ flex: "0 0 auto" }}
                        >
                          {isTopTen ? (
                            <div className="flex h-full w-full items-end gap-y-5 md:w-[600px] lg:w-[700px]">
                              <div className="flex h-full w-1/3 items-end justify-end overflow-visible">
                                <p
                                  className="zeinFont translate-x-[40%] translate-y-[10%] text-[280px] leading-[0.7] font-extrabold text-[#1297DC] sm:text-[290px] md:text-[290px] lg:text-[290px]"
                                  style={{
                                    filter:
                                      "drop-shadow(6px 6px 4px rgba(0,0,0,0.3))",
                                    textShadow:
                                      "1px 10px 3px #0D7AB3, 2px 2px 8px rgba(0,0,0,0.5)",
                                  }}
                                >
                                  {index + 1}
                                </p>
                              </div>

                              <div className="relative h-[220px] w-[149px] overflow-hidden rounded-[6px]">
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
                                    className="h-full w-full"
                                  />
                                )}
                                {fixedType === "comic" && (
                                  <ComicCard
                                    {...item}
                                    coverUrl={item.posterImageUrl}
                                  />
                                )}

                                {blurred && minAge && (
                                  <div className="pointer-events-none absolute inset-0 z-10 rounded-[6px]">
                                    <div className="absolute inset-0 rounded-[6px] bg-black/20 backdrop-blur-sm" />
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
                                  <div className="absolute inset-0 rounded-[6px] bg-black/20 backdrop-blur-sm" />
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
