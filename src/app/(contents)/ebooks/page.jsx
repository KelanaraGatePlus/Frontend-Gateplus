"use client";
import React, { Suspense, useCallback } from "react";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";
import { useGetEbooksHomeDataQuery } from "@/hooks/api/ebookSliceAPI";
import StaticBannerPromo from "@/components/BannerPromoSlider/StaticBannerPromo";
import BackButton from "@/components/BackButton/page";
import Filter from "@/components/FilterComponent/FIlter";
import { useSearchParams } from "next/navigation";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import getMinAge from "@/lib/helper/minAge";
import useSyncUserData from "@/hooks/api/useSyncUserData";
import PropTypes from "prop-types";

export default function EbooksPage() {
  const { userAge, isReady } = useSyncUserData();

  // blur
  const isBlurred = useCallback(
    (ebookData) => {
      if (!isReady) return true;

      const minAge = getMinAge(ebookData?.ageRestriction);

      // SU dan 13 bebas
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
            title="eBook"
            subtitle="Koleksi buku digital untuk pembelajaran dan hiburan"
            bgColor="#F4A2614D"
            titleColor="#F07F26"
          />
          <div className="relative h-full w-full">
            <div className="absolute -bottom-6 w-full px-2 md:px-16">
              <Suspense fallback={<LoadingOverlay />}>
                <Filter
                  contentType="eBook"
                  textColor="#F07F26"
                  buttonColor={{
                    activeFrom: "#F07F26",
                    activeTo: "#FFB479",
                  }}
                />
              </Suspense>
            </div>
          </div>
        </div>
        <Suspense fallback={<LoadingOverlay />}>
          <EbookContent isBlurred={isBlurred} />
        </Suspense>
      </div>
    </main>
  );
}

function EbookContent({ isBlurred }) {
  const searchParams = useSearchParams();
  const { data, isLoading } = useGetEbooksHomeDataQuery(
    searchParams.get("cat") || "",
  );
  const newestData = data?.data?.newReleaseEbooks || [];
  const topTenData = data?.data?.topTenEbooks || [];
  const highlightedData = data?.data?.highlightsEbooks || [];

  return (
    <div className="flex h-full w-full flex-col">
      <CarouselTemplate
        label="Highlight Ebooks"
        contents={highlightedData}
        isLoading={isLoading}
        type="ebook"
        isBlurred={isBlurred}
      />
      <CarouselTemplate
        label="Top 10 Ebooks"
        contents={topTenData}
        isLoading={isLoading}
        type="ebook"
        isTopTen={true}
        withTopTag={true}
        isBlurred={isBlurred}
      />
      <CarouselTemplate
        label="Newest"
        contents={newestData}
        isLoading={isLoading}
        type="ebook"
        withNewestTag={true}
        withTopTag={false}
        isBlurred={isBlurred}
      />
    </div>
  );
}

EbookContent.propTypes = {
  isBlurred: PropTypes.func.isRequired,
};
