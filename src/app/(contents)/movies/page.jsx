"use client";
import React, { Suspense } from "react";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";
import { useGetMoviesHomeDataQuery } from "@/hooks/api/movieSliceAPI";
import StaticBannerPromo from "@/components/BannerPromoSlider/StaticBannerPromo";
import BackButton from "@/components/BackButton/page";
import Filter from "@/components/FilterComponent/FIlter";
import { useSearchParams } from "next/navigation";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import getMinAge from "@/lib/helper/minAge";
import useSyncUserData from "@/hooks/api/useSyncUserData";
import { useCallback } from "react";

export default function MoviesPage() {
  const { userAge, isReady } = useSyncUserData();

  const isBlurred = useCallback(
    (content) => {
      if (!isReady) return true;

      const minAge = getMinAge(content?.ageRestriction);

      // SU / R13 → bebas
      if (minAge === null) return false;

      // belum isi DOB
      if (userAge == null) return true;

      return userAge < minAge;
    },
    [userAge, isReady],
  );

  return (
    <div className="flex h-full w-full flex-col gap-4 md:gap-10">
      <div className="absolute top-2 left-2 md:left-13">
        <BackButton />
      </div>
      <div className="flex h-max w-full flex-col gap-6">
        <StaticBannerPromo
          title="Movies"
          subtitle="Koleksi film terbaik untuk hiburan Anda"
          bgColor="#156EB74D"
          titleColor="#219BFF"
        />
        <div className="relative h-full w-full">
          <div className="absolute -bottom-6 w-full px-2 md:px-16">
            <Suspense fallback={<LoadingOverlay />}>
              <Filter contentType="Movie" textColor="#219BFF" />
            </Suspense>
          </div>
        </div>
      </div>
      <Suspense fallback={<LoadingOverlay />}>
        <MovieContent isBlurred={isBlurred} />
      </Suspense>
    </div>
  );
}

function MovieContent({ isBlurred }) {
  const searchParams = useSearchParams();
  const { data, isLoading } = useGetMoviesHomeDataQuery(
    searchParams.get("cat") || "",
  );
  const newestData = data?.data?.newReleaseMovies || [];
  const topTenData = data?.data?.topTenMovies || [];
  const highlightedData = data?.data?.highlightsMovies || [];

  return (
    <>
      <CarouselTemplate
        label={"Best Seller"}
        contents={highlightedData}
        isLoading={isLoading}
        type={"movie"}
        isBlurred={isBlurred}
      />
      <CarouselTemplate
        label={"Top Rated Movie"}
        contents={topTenData}
        isLoading={isLoading}
        type={"movie"}
        isTopTen={true}
        withTopTag={false}
        isBlurred={isBlurred}
      />
      <CarouselTemplate
        label={"Newest"}
        contents={newestData}
        isLoading={isLoading}
        type={"movie"}
        withNewestTag={true}
        withTopTag={false}
        isBlurred={isBlurred}
      />
    </>
  );
}
