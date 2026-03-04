"use client";
import React, { Suspense } from 'react';
import CarouselTemplate from '@/components/Carousel/carouselTemplate';
import { useGetEbooksHomeDataQuery } from '@/hooks/api/ebookSliceAPI';
import StaticBannerPromo from '@/components/BannerPromoSlider/StaticBannerPromo';
import BackButton from '@/components/BackButton/page';
import Filter from '@/components/FilterComponent/FIlter';
import { useSearchParams } from 'next/navigation';
import LoadingOverlay from '@/components/LoadingOverlay/page';

export default function EbooksPage() {
  return (
    <main className="relative flex flex-col lg:px-4 w-full h-full gap-4 md:gap-10">
      <div className="absolute left-2 md:left-13 top-2">
        <BackButton />
      </div>
      <div className='w-full h-full flex flex-col gap-10'>
        <div className='w-full h-max flex flex-col gap-6'>
          <StaticBannerPromo
            title="eBook"
            subtitle="Koleksi buku digital untuk pembelajaran dan hiburan"
            bgColor="#F4A2614D"
            titleColor="#F07F26"
          />
          <div className='relative w-full h-full'>
            <div className='px-2 md:px-16 absolute -bottom-6 w-full'>
              <Suspense fallback={<LoadingOverlay />}>
                <Filter
                  contentType="eBook"
                  textColor="#F07F26"
                  buttonColor={
                    {
                      activeFrom: "#F07F26",
                      activeTo: "#FFB479"
                    }
                  }
                />
              </Suspense>
            </div>
          </div>
        </div>
        <Suspense fallback={<LoadingOverlay />}>
          <EbookContent />
        </Suspense>
      </div>
    </main>
  )
}


function EbookContent() {
  const searchParams = useSearchParams();
  const { data, isLoading } = useGetEbooksHomeDataQuery(searchParams.get("cat") || "");
  const newestData = data?.data?.newReleaseEbooks || [];
  const topTenData = data?.data?.topTenEbooks || [];
  const highlightedData = data?.data?.highlightsEbooks || [];

  return (
    <>
      <CarouselTemplate
        label={"Highlight Ebooks"}
        contents={highlightedData}
        isLoading={isLoading}
        type={"ebook"}
      />
      <CarouselTemplate
        label={"Top 10 Ebooks"}
        contents={topTenData}
        isLoading={isLoading}
        type={"ebook"}
        isTopTen={true}
        withTopTag={true}

      />
      <CarouselTemplate
        label={"Newest"}
        contents={newestData}
        isLoading={isLoading}
        type={"ebook"}
        withNewestTag={true}
        withTopTag={false}
      />
    </>
  );
}