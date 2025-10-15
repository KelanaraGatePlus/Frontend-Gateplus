"use client";
import React, { Suspense } from 'react';
import CarouselTemplate from '@/components/Carousel/carouselTemplate';
import { useGetSeriesHomeDataQuery } from '@/hooks/api/seriesSliceAPI';
import StaticBannerPromo from '@/components/BannerPromoSlider/StaticBannerPromo';
import BackButton from '@/components/BackButton/page';
import Filter from '@/components/FilterComponent/FIlter';
import { useSearchParams } from 'next/navigation';
import LoadingOverlay from '@/components/LoadingOverlay/page';

export default function SeriesPage() {
    return (
        <div className='w-full h-full flex flex-col gap-4 md:gap-10'>
            <div className="absolute left-2 md:left-13 top-2">
                <BackButton />
            </div>
            <div className='w-full h-max flex flex-col gap-6'>
                <StaticBannerPromo
                    title="Series"
                    subtitle="Serial TV dan series terbaik untuk binge watching"
                    bgColor="#5856D64D"
                    titleColor="#6A67FF"
                />
                <div className='px-2 md:px-24'>
                    <Suspense fallback={<LoadingOverlay />}>
                        <Filter
                            contentType="Series"
                            textColor="#6A67FF"
                            buttonColor={
                                {
                                    activeFrom: "#5856D6",
                                    activeTo: "#6A67FF"
                                }
                            }
                        />
                    </Suspense>
                </div>
            </div>
            <Suspense fallback={<LoadingOverlay />}>
                <SeriesContent />
            </Suspense>
        </div>
    )
}

function SeriesContent() {
    const searchParams = useSearchParams();
    const { data, isLoading } = useGetSeriesHomeDataQuery(searchParams.get("cat") || "");
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
            />
            <CarouselTemplate
                label={"Top 10 Series"}
                contents={topTenData}
                isLoading={isLoading}
                type={"series"}
                isTopTen={true}
            />
            <CarouselTemplate
                label={"Newest"}
                contents={newestData}
                isLoading={isLoading}
                type={"series"}
            />
        </>
    )
}
