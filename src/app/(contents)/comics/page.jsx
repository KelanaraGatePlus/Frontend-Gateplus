"use client";
import React, { Suspense, useCallback } from "react";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";
import { useGetComicsHomeDataQuery } from "@/hooks/api/comicSliceAPI";
import StaticBannerPromo from "@/components/BannerPromoSlider/StaticBannerPromo";
import BackButton from "@/components/BackButton/page";
import Filter from "@/components/FilterComponent/FIlter";
import { useSearchParams } from "next/navigation";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import getMinAge from "@/lib/helper/minAge";
import useSyncUserData from "@/hooks/api/useSyncUserData";
import PropTypes from "prop-types";

export default function ComicsPage() {
  const { userAge, isReady } = useSyncUserData(null);

  // logic blur
  const isBlurred = useCallback(
    (comicData) => {
      if (!isReady) return true;

      const minAge = getMinAge(comicData?.ageRestriction);

      // RU dan SU bebas
      if (minAge === null) return false;

      // blm isi dob
      if (userAge == null) return true;

      return userAge < minAge;
    },
    [userAge, isReady],
  );

  return (
    <main className="relative flex h-full w-full flex-col gap-4 md:gap-10 lg:px-4">
      <div className="absolute top-2 left-2 md:left-13">
        <BackButton />
      </div>
      <div className="flex h-full w-full flex-col gap-10">
        <div className="flex h-max w-full flex-col gap-6">
          <StaticBannerPromo
            title="Komik"
            subtitle="Baca komik favorit Anda kapan saja"
            bgColor="#00C7BE4D"
            titleColor="#00FFF3"
          />
          <div className="relative h-full w-full">
            <div className="absolute -bottom-6 w-full px-2 md:px-16">
              <Suspense fallback={<div className="h-10" />}>
                <Filter
                  contentType="Komik"
                  textColor="#00FFF3"
                  buttonColor={{
                    activeFrom: "#00C7BE",
                    activeTo: "#00615D",
                  }}
                />
              </Suspense>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-8">
          <Suspense fallback={<LoadingOverlay />}>
            <ComicContent isBlurred={isBlurred} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

function ComicContent({ isBlurred }) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("cat") || "";
  const { data, isLoading, isFetching } =
    useGetComicsHomeDataQuery(currentCategory);

  const newestData = data?.data?.newReleaseComics || [];
  const topTenData = data?.data?.topTenComics || [];
  const highlightedData = data?.data?.highlightsComics || [];

  const isDataLoading = isLoading || isFetching;

  return (
    <div className="flex flex-col gap-8 pb-20">
      <CarouselTemplate
        label={"Highlight Comics"}
        contents={highlightedData}
        isLoading={isDataLoading}
        type={"comic"}
        isBlurred={isBlurred}
      />
      <CarouselTemplate
        label={"Top 10 Comics"}
        contents={topTenData}
        isLoading={isDataLoading}
        type={"comic"}
        isTopTen={true}
        isBlurred={isBlurred}
      />
      <CarouselTemplate
        label={"Newest"}
        contents={newestData}
        isLoading={isDataLoading}
        type={"comic"}
        withTopTag={false}
        withNewestTag={true}
        isBlurred={isBlurred}
      />
    </div>
  );
}

ComicContent.propTypes = {
  isBlurred: PropTypes.func.isRequired,
};
