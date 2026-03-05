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

function resolveLastSeenHref(item) {
  if (!item) return null;

  if (item.contentType === "EPISODE_SERIES") {
    return `/series/watch/${item.contentId}`;
  }
  if (item.contentType === "SERIES") {
    return `/series/detail/${item.contentId}`;
  }
  if (item.contentType === "MOVIE") {
    return `/film/watch/${item.contentId}`;
  }
  if (item.contentType === "EPISODE_MOVIE") {
    return `/film/watch/${item.contentId}`;
  }
  if (item.contentType === "EBOOK") {
    return `/ebook/detail/${item.contentId}`;
  }
  if (item.contentType === "COMIC") {
    return `/comic/detail/${item.contentId}`;
  }
  if (item.contentType === "PODCAST") {
    return `/podcast/detail/${item.contentId}`;
  }

  // fallback ke customHref dari item jika ada
  return item.customHref || null;
}

/* ===========================
   Helper: deduplikasi last seen
   Jika ada EPISODE_SERIES dan SERIES dengan seriesId yang sama,
   prioritaskan EPISODE_SERIES (lebih spesifik) dan buang SERIES-nya.
   =========================== */
export function deduplicateLastSeen(contents) {
  if (!Array.isArray(contents)) return contents;

  const episodeSeriesIds = new Set(
    contents
      .filter((item) => item.contentType === "EPISODE_SERIES")
      .map((item) => item.seriesId || item.series?.id)
      .filter(Boolean),
  );

  return contents.filter((item) => {
    // Buang entry SERIES jika seriesId-nya sudah ada di episodeSeriesIds
    if (item.contentType === "SERIES" && episodeSeriesIds.has(item.contentId)) {
      return false;
    }
    return true;
  });
}

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
  showProgress = false,
  isLastSeen = false,
  isLoggedIn = false,
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

  const resolvePodcastSize = (label, fixedType, isTen) => {
    const isPopularPodcast =
      label === "Popular Podcasts" && fixedType === "podcast";

    if (isPopularPodcast) {
      return "h-[200px] w-[120px] md:h-[250px] md:w-[150px] lg:h-[300px] lg:w-[180px]";
    }

    if (isTopTen && !isTen) {
      return "h-[200px] w-[220px] md:h-[230px] md:w-[240px] lg:w-[240px]";
    }

    if (isTopTen && isTen) {
      return "h-[200px] w-[220px] md:h-[230px] md:w-[470px] lg:w-[470px]";
    }

    return "h-[160px] w-[112px] md:h-[212px] md:w-[149px]";
  };

  // Deduplikasi jika mode last seen aktif
  const resolvedContents = isLastSeen
    ? deduplicateLastSeen(contents)
    : contents;

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
          resolvedContents.length > 0 && (
            <section
              className={`flex flex-col ${isOnCreatorProfile ? "my-3 md:my-0" : "my-3 md:my-5"}`}
            >
              <Carousel>
                <p className="zeinFont mb-1 px-4 text-2xl font-extrabold text-white md:mb-2 md:px-0 md:text-3xl lg:text-4xl xl:text-[40px]">
                  {label}
                </p>

                <div className="relative">
                  <CarouselContent
                    className={`flex ${isTopTen ? "gap-x-5" : "gap-x-2"}`}
                  >
                    {contents.map((item, index) => {
                      const rank = index + 1;
                      const fixedType = resolveType(item);
                      const minAge = resolveMinAge(item);
                      const isUniquePodcast = fixedType === "podcast" && type;
                      const podcastSize = resolvePodcastSize(
                        label,
                        fixedType,
                        rank >= 10,
                      );

                      // Resolve customHref: jika last seen, pakai helper;
                      // jika tidak, pakai customHref dari item (existing behavior)
                      const customHref = isLastSeen
                        ? resolveLastSeenHref(item)
                        : item.customHref;

                      return (
                        <CarouselItem
                          key={index}
                          className={`group relative ${index === 0 ? "pl-4 md:pl-0" : ""} flex ${label === "Terakhir Anda Lihat" ? "flex-col" : ""} cursor-pointer items-center overflow-visible ${podcastSize} origin-bottom transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105`}
                          style={{ flex: "0 0 auto" }}
                        >
                          {isTopTen ? (
                            <div
                              className={`flex h-full w-full items-end gap-y-5 overflow-y-hidden ${rank >= 10 ? "md:w-[500px] lg:w-[600px]" : "md:w-[500px] lg:w-[600px]"}`}
                            >
                              <div className="flex h-full w-1/3 items-end justify-end overflow-visible">
                                <p
                                  className={`zeinFont translate-y-[10%] leading-[0.7] font-extrabold text-[#1297DC] ${
                                    rank >= 10
                                      ? "translate-x-[12%] text-[170px] sm:text-[180px] md:translate-x-[16%] md:text-[190px] lg:text-[200px]"
                                      : "translate-x-[30%] text-[220px] sm:text-[230px] md:translate-x-[40%] md:text-[240px] lg:text-[250px]"
                                  }`}
                                  style={{
                                    filter:
                                      "drop-shadow(6px 6px 4px rgba(0,0,0,0.3))",
                                    textShadow:
                                      "1px 10px 3px #0D7AB3, 2px 2px 8px rgba(0,0,0,0.5)",
                                  }}
                                >
                                  {rank}
                                </p>
                              </div>

                              <div
                                className={`relative h-full w-full overflow-visible rounded-[6px] md:h-[220px] md:w-[149px]`}
                              >
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
                                  customHref={customHref}
                                  progress={item.progress}
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
                                  customHref={customHref}
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
                                  customHref={customHref}
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
                                  customHref={customHref}
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
                                  customHref={customHref}
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

                              {isLoggedIn &&
                                showProgress &&
                                item.progress !== undefined && (
                                  <div className="mt-2 h-2 w-full rounded bg-gray-300">
                                    <div
                                      className="h-2 rounded bg-blue-600"
                                      style={{ width: `${item.progress}%` }}
                                    />
                                  </div>
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
  showProgress: PropTypes.bool,
  isLastSeen: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
};
