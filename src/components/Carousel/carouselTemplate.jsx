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
import Image from "next/image";
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
  // Default icon map untuk path lokal
  const defaultIcons = {
    comic: "/images/IconsContent/icons-comic.svg",
    ebook: "/images/IconsContent/icons-ebook.svg",
    movie: "/images/IconsContent/icons-movie.svg",
    series: "/images/IconsContent/icons-series.svg",
    podcast: "/images/IconsContent/icons-podcast.svg",
    education: "/images/IconsContent/icons-education.svg",
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
              className={`my-3 flex flex-col ${isOnCreatorProfile ? "my-3 md:my-0" : "my-3 md:my-5"}`}
            >
              <Carousel className="sm:max-h-auto sm:max-w-auto">
                <p className="zeinFont mb-1 text-2xl font-extrabold text-white md:mb-2 md:text-3xl lg:text-4xl xl:text-[40px]">
                  {label}
                </p>
                <div className="relative">
                  <CarouselContent>
                    {contents.map((item, index) => {
                      const fixedType = item.type || type;
                      const blurred =
                        typeof isBlurred === "function"
                          ? isBlurred(item)
                          : false;

                      // Hitung minAge per item
                      const minAge = item.ageRestriction
                        ? getMinAge(item.ageRestriction)
                        : null;

                      return (
                        <CarouselItem
                          key={index}
                          className={`group relative flex items-center overflow-hidden ${
                            isTopTen
                              ? "w-[240px] sm:w-[180px] md:w-[460px]"
                              : "aspect-[2/3] w-[120px] sm:w-[140px] md:w-[230px]"
                          } cursor-pointer rounded-md`}
                        >
                          {/* CARD */}
                          <div className="relative z-0">
                            {fixedType === "ebook" && !isTopTen && (
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

                            {fixedType === "comic" && !isTopTen && (
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

                            {fixedType === "movie" && !isTopTen && (
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

                            {fixedType === "series" && !isTopTen && (
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

                            {fixedType === "podcast" &&
                              type == null &&
                              !isTopTen && (
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

                            {fixedType === "podcast" && type && !isTopTen && (
                              <PodcastUniqueCard
                                title={item.title}
                                id={item.id}
                                coverUrl={item.coverPodcastImage}
                                creatorName={item.Creator?.profileName}
                                releaseDate={item.createdAt}
                                hasNewEpisode={item.hasNewEpisodes}
                              />
                            )}

                            {fixedType === "education" && !isTopTen && (
                              <EducationCard
                                title={item.title}
                                id={item.id}
                                coverUrl={item.bannerUrl}
                                creatorName={item.creator?.profileName}
                                releaseDate={item.createdAt}
                              />
                            )}

                            {/* TOP 10 */}
                            {isTopTen && (
                              <div className="grid grid-cols-17">
                                <div className="relative col-span-8 h-full w-full">
                                  <p className="zeinFont absolute -right-4 -bottom-10 -mb-4 flex text-[230px] leading-none font-extrabold text-[#1297DC] md:-right-6 md:bottom-5 md:-mb-8 md:text-[350px]">
                                    {index + 1}
                                  </p>
                                </div>
                                <div className="col-span-9 aspect-[2/3] overflow-hidden rounded-md">
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
                                </div>
                              </div>
                            )}
                          </div>

                          {/* BLUR OVERLAY */}
                          {blurred && minAge && (
                            <div className="pointer-events-none absolute inset-0 z-10">
                              {/* overlay blur */}
                              <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
                              {/* age restriction tag */}
                              <div className="pointer-events-auto absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                                <span className="rounded-lg bg-red-600 px-4 py-2 text-sm font-black text-white shadow-sm">
                                  {minAge}+
                                </span>
                              </div>
                              S{/* icon kecil */}
                              {(item.iconUrl || defaultIcons[fixedType]) && (
                                <div className="pointer-events-auto absolute bottom-2 left-2 z-30 h-9 w-15">
                                  <Image
                                    src={
                                      item.iconUrl || defaultIcons[fixedType]
                                    }
                                    alt={`${fixedType} Icon`}
                                    width={45}
                                    height={45}
                                    className="object-contain"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
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
  withGradient: PropTypes.bool,
  withTopTag: PropTypes.bool,
  withNewestTag: PropTypes.bool,
  isBlurred: PropTypes.func,
};
