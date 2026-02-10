"use client";
import React, { Suspense } from "react";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";
import { useGetComicsHomeDataQuery } from "@/hooks/api/comicSliceAPI";
import StaticBannerPromo from "@/components/BannerPromoSlider/StaticBannerPromo";
import BackButton from "@/components/BackButton/page";
import Filter from "@/components/FilterComponent/FIlter";
import { useSearchParams } from "next/navigation";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import getMinAge from "@/lib/helper/minAge";
import useSyncUserData from "@/hooks/api/useSyncUserData";
import { useCallback } from "react";
import PropTypes from "prop-types";

export default function ComicsPage() {
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
              <Suspense fallback={<LoadingOverlay />}>
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
        <Suspense fallback={<LoadingOverlay />}>
          <ComicContent isBlurred={isBlurred} />
        </Suspense>
      </div>
    </main>
  );
}

function ComicContent({ isBlurred }) {
  const searchParams = useSearchParams();
  const { data, isLoading } = useGetComicsHomeDataQuery(
    searchParams.get("cat") || "",
  );
  const newestData = data?.data?.newReleaseComics || [];
  const topTenData = data?.data?.topTenComics || [];
  const highlightedData = data?.data?.highlightsComics || [];

  return (
    <>
      <CarouselTemplate
        label={"Highlight Comics"}
        contents={highlightedData}
        isLoading={isLoading}
        type={"comic"}
        isBlurred={isBlurred}
      />
      <CarouselTemplate
        label={"Top 10 Comics"}
        contents={topTenData}
        isLoading={isLoading}
        type={"comic"}
        isTopTen={true}
        isBlurred={isBlurred}
      />
      <CarouselTemplate
        label={"Newest"}
        contents={newestData}
        isLoading={isLoading}
        type={"comic"}
        withTopTag={false}
        withNewestTag={true}
        isBlurred={isBlurred}
      />
    </>
  );
}

ComicContent.propTypes = {
  isBlurred: PropTypes.func.isRequired,
};
