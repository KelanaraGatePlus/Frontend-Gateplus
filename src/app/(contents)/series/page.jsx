"use client";
import React, { Suspense } from "react";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";
import { useGetSeriesHomeDataQuery } from "@/hooks/api/seriesSliceAPI";
import StaticBannerPromo from "@/components/BannerPromoSlider/StaticBannerPromo";
import BackButton from "@/components/BackButton/page";
import Filter from "@/components/FilterComponent/FIlter";
import { useSearchParams } from "next/navigation";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import getMinAge from "@/lib/helper/minAge";
import useSyncUserData from "@/hooks/api/useSyncUserData";
import { useCallback } from "react";
import PropTypes from "prop-types";

export default function SeriesPage() {
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
          title="Series"
          subtitle="Serial TV dan series terbaik untuk binge watching"
          bgColor="#5856D64D"
          titleColor="#6A67FF"
        />
        <div className="relative h-full w-full">
          <div className="absolute -bottom-6 w-full px-2 md:px-16">
            <Suspense fallback={<LoadingOverlay />}>
              <Filter
                contentType="Series"
                textColor="#6A67FF"
                buttonColor={{
                  activeFrom: "#5856D6",
                  activeTo: "#6A67FF",
                }}
              />
            </Suspense>
          </div>
        </div>
      </div>
      <Suspense fallback={<LoadingOverlay />}>
        <SeriesContent isBlurred={isBlurred} />
      </Suspense>
    </div>
  );
}

function SeriesContent({ isBlurred }) {
  const searchParams = useSearchParams();
  const { data, isLoading } = useGetSeriesHomeDataQuery(
    searchParams.get("cat") || "",
  );
  const newestData = data?.data?.newReleaseSeries || [];
  const topTenData = data?.data?.topTenSeries || [];
  const highlightedData = data?.data?.highlightsSeries || [];

  return (
    <>
      <CarouselTemplate
        label={"Highlight Series"}
        contents={highlightedData}
        isLoading={isLoading}
        type={"series"}
        isBlurred={isBlurred}
      />
      <CarouselTemplate
        label={"Top 10 Series"}
        contents={topTenData}
        isLoading={isLoading}
        type={"series"}
        isTopTen={true}
        isBlurred={isBlurred}
      />
      <CarouselTemplate
        label={"Newest"}
        contents={newestData}
        isLoading={isLoading}
        type={"series"}
        withNewestTag={true}
        withTopTag={false}
        isBlurred={isBlurred}
      />
    </>
  );
}

SeriesContent.propTypes = {
  isBlurred: PropTypes.func.isRequired,
};
