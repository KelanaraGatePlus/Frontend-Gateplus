"use client";
import React, { Suspense } from "react";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";
import { useGetPodcastHomeDataQuery } from "@/hooks/api/podcastSliceAPI";
import BackButton from "@/components/BackButton/page";
import StaticBannerPromo from "@/components/BannerPromoSlider/StaticBannerPromo";
import Filter from "@/components/FilterComponent/FIlter";
import { useSearchParams } from "next/navigation";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import getMinAge from "@/lib/helper/minAge";
import useSyncUserData from "@/hooks/api/useSyncUserData";
import { useCallback } from "react";
import PropTypes from "prop-types";
import BackToTop from "@/components/ui/buttonBackToTop";

export default function PodcastsPage() {
  const { userAge, isReady } = useSyncUserData();

  const isBlurred = useCallback(
    (content) => {
      if (!isReady) return true;

      const minAge = getMinAge(content?.ageRestriction);

      // SU dan 13 bebas akses
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
            title="Podcast"
            subtitle="Dengarkan podcast menarik dari berbagai kategori"
            bgColor="#AF52DE4D"
            titleColor="#CB65FF"
          />
          <div className="relative h-full w-full">
            <div className="absolute -bottom-6 w-full px-2 md:px-16">
              <Suspense fallback={<LoadingOverlay />}>
                <Filter
                  contentType="Podcast"
                  textColor="#CB65FF"
                  buttonColor={{
                    activeFrom: "#AF52DE",
                    activeTo: "#5F2C78",
                  }}
                />
              </Suspense>
            </div>
          </div>
        </div>
        <Suspense fallback={<LoadingOverlay />}>
          <PodcastContent isBlurred={isBlurred} />
        </Suspense>
      </div>
      <BackToTop />
    </main>
  );
}

function PodcastContent({ isBlurred }) {
  const searchParams = useSearchParams();
  const { data, isLoading } = useGetPodcastHomeDataQuery(
    searchParams.get("cat") || "",
  );
  const newestData = data?.data?.newReleasePodcast || [];
  const topTenData = data?.data?.topTenPodcast || [];
  const highlightedData = data?.data?.highlightsPodcast || [];

  return (
    <div className="flex flex-col">
      <CarouselTemplate
        label={"Highlight Podcast"}
        contents={highlightedData}
        isLoading={isLoading}
        type={"podcast"}
        withGradient={false}
        isBlurred={isBlurred}
      />
      <CarouselTemplate
        label={"Top 10 Podcast"}
        contents={topTenData}
        isLoading={isLoading}
        type={"podcast"}
        isTopTen={true}
        isBlurred={isBlurred}
      />
      <CarouselTemplate
        label={"Newest"}
        contents={newestData}
        isLoading={isLoading}
        type={"podcast"}
        withGradient={false}
        isBlurred={isBlurred}
      />
    </div>
  );
}

PodcastContent.propTypes = {
  isBlurred: PropTypes.func.isRequired,
};
