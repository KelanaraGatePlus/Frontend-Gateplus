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
  // isBlurred,
  isHomepage = false,
}) {
  // const resolveBlur = (item) => {
  //   if (typeof isBlurred !== "function") return false;
  //   return isBlurred(item);
  // };

  const resolveMinAge = (item) => {
    if (!item?.ageRestriction) return null;
    return getMinAge(item.ageRestriction);
  };

  const resolveType = (item) => item.type || type;

  const resolvePodcastSize = (label, fixedType) => {
    const isPopularPodcast =
      label === "Popular Podcasts" && fixedType === "podcast";
    if (isPopularPodcast)
      return "h-[200px] w-[120px] md:h-[250px] md:w-[150px] lg:h-[300px] lg:w-[180px]";
    if (isTopTen)
      return "h-[200px] w-[220px] md:h-[230px] md:w-[240px] lg:w-[240px]";
    return "h-[200px] w-[112px] md:h-[240px] md:w-[149px]";
  };

  return (
    <div className="relative h-full w-full overflow-visible rounded-md">
      <section
        className={`px-0 ${isOnCreatorProfile ? "md:px-4" : isHomepage ? "md:px-6" : "md:px-16"}`}
      >
        {isLoading ? (
          <div className="px-4">
            <CarouselLoading />
          </div>
        ) : (
          contents.length > 0 && (
            <section
              className={`flex flex-col ${isOnCreatorProfile ? "my-3 md:my-0" : "my-3 md:my-5"}`}
            >
              <Carousel>
                <p className="zeinFont mb-1 px-4 text-2xl font-extrabold text-white md:mb-2 md:px-0 md:text-3xl lg:text-4xl xl:text-[40px]">
                  {label}
                </p>

                <div className="relative">
                  <CarouselContent
                    className={`flex ${
                      isTopTen ? "gap-x-5" : "gap-x-2"
                    } ${label === "Terakhir Anda Lihat" ? "pr-4 pl-4 md:pr-6 md:pl-6" : ""}`}
                  >
                    {contents.map((item, index) => {
                      const fixedType = resolveType(item);
                      const minAge = resolveMinAge(item);
                      const isUniquePodcast = fixedType === "podcast" && type;
                      const podcastSize = resolvePodcastSize(label, fixedType);

                      return (
                        <CarouselItem
                          key={index}
                          className={`
                            group relative
                            ${index === 0 ? "pl-4 md:pl-0" : ""}
                            flex cursor-pointer items-center overflow-visible
                            ${podcastSize}
                            transition-all duration-300 ease-out
                            hover:scale-105
                            hover:-translate-y-1
                            origin-bottom
                          `}
                          style={{ flex: "0 0 auto" }}
                        >
                          {isTopTen ? (
                            <div className="flex h-full w-full overflow-y-hidden items-end gap-y-5 md:w-[500px] lg:w-[600px]">
                              <div className="flex h-full w-1/3 items-end justify-end overflow-visible">
                                <p
                                  className="zeinFont translate-x-[30%] translate-y-[10%] text-[220px] leading-[0.7] font-extrabold text-[#1297DC] sm:text-[230px] md:translate-x-[40%] md:text-[240px] lg:text-[250px]"
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

                              <div className={`relative h-full w-full md:h-[220px] md:w-[149px] overflow-visible rounded-[6px]`}>
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
                                  progress={item.progress}
                                  customHref={item.customHref}
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
                                  progress={item.progress}
                                  customHref={item.customHref}
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
                                  progress={item.progress}
                                  customHref={item.customHref}
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
                                  progress={item.progress}
                                  customHref={item.customHref}
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
                                  progress={item.progress}
                                  customHref={item.customHref}
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
                            </div>
                          )}
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>

                  {/* BUTTON */}
                  <div className="hidden md:block">
                    <CarouselPrevious />
                    <CarouselNext />
                  </div>
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
  isHomepage: PropTypes.bool,
};
