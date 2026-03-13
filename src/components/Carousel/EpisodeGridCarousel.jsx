"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import PropTypes from "prop-types";
import EpisodeCard from "@/components/Card/EpisodeCard";
import CarouselLoading from "@/components/Carousel/CarouselLoading";

export default function EpisodeGridCarousel({
  label,
  contents = [],
  isLoading = false,
  isHomepage = false,
  isOwner = false,
  isSubscribe = false,
}) {
  const safeContents = [...contents];
  if (safeContents.length % 2 !== 0) {
    safeContents.push({ id: "filler", isFiller: true });
  }

  const columns = [];
  for (let i = 0; i < safeContents.length; i += 2) {
    columns.push(safeContents.slice(i, i + 2));
  }

  return (
    <div className={`relative h-full w-full overflow-visible rounded-md`}>
      <section
        className={`overflow-visible px-0 ${isHomepage ? "md:px-6" : "md:px-16"}`}
      >
        {isLoading ? (
          <div className="px-4">
            <CarouselLoading />
          </div>
        ) : (
          contents.length > 0 && (
            <section className="my-3 flex flex-col overflow-visible md:my-5">
              <div className="mb-3 flex items-center px-4 md:px-0">
                <p className="zeinFont text-2xl font-extrabold text-white md:text-3xl lg:text-4xl xl:text-[40px]">
                  {label}
                </p>
              </div>

              <div className="relative overflow-visible py-2">
                <Carousel
                  className="w-full overflow-visible"
                  opts={{
                    align: "start",
                    containScroll: "trimSnaps",
                    breakpoints: {
                      "(max-width: 768px)": {
                        containScroll: "keepSnaps",
                        dragFree: false,
                      },
                    },
                  }}
                >
                  <CarouselPrevious className="z-10" />
                  <CarouselNext className="z-10" />

                  <CarouselContent
                    className="overflow-visible"
                    style={{ overflow: "visible" }}
                  >
                    {columns.map((pair, colIdx) => (
                      <CarouselItem
                        key={colIdx}
                        className={`flex shrink-0 basis-[50%] flex-col gap-[10px] sm:basis-[50%] md:basis-[300px] ${
                          colIdx === 0 ? "pl-4 md:pl-0" : ""
                        }`}
                      >
                        {pair.map((item) =>
                          item.isFiller ? (
                            <div
                              key="filler"
                              className="pointer-events-none h-[92px] opacity-0"
                            />
                          ) : (
                            <EpisodeCard
                              key={item.id}
                              item={item}
                              isOwner={isOwner}
                              isSubscribe={isSubscribe}
                            />
                          ),
                        )}
                        {pair.length === 1 && (
                          <div style={{ height: "92px" }} />
                        )}
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </section>
          )
        )}
      </section>
    </div>
  );
}

EpisodeGridCarousel.propTypes = {
  label: PropTypes.string.isRequired,
  contents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      episodeTitle: PropTypes.string,
      parentTitle: PropTypes.string,
      coverUrl: PropTypes.string,
      price: PropTypes.number,
      isLocked: PropTypes.bool,
      creatorName: PropTypes.string,
      uploadedAt: PropTypes.string,
      contentType: PropTypes.oneOf(["ebook", "series", "podcast", "comic"]),
    }),
  ).isRequired,
  isLoading: PropTypes.bool,
  isHomepage: PropTypes.bool,
  seeAllHref: PropTypes.string,
  onSeeAll: PropTypes.func,
  isOwner: PropTypes.bool,
  isSubscribe: PropTypes.bool,
};
