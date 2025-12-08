"use client";
import React, { Suspense } from 'react';
import CarouselTemplate from '@/components/Carousel/carouselTemplate';
import { useGetComicsHomeDataQuery } from '@/hooks/api/comicSliceAPI';
import StaticBannerPromo from '@/components/BannerPromoSlider/StaticBannerPromo';
import BackButton from '@/components/BackButton/page';
import Filter from '@/components/FilterComponent/FIlter';
import { useSearchParams } from 'next/navigation';
import LoadingOverlay from '@/components/LoadingOverlay/page';

export default function ComicsPage() {
    return (
        <main className="relative flex flex-col lg:px-4 w-full h-full gap-4 md:gap-10">
            <div className="absolute left-2 md:left-13 top-2">
                <BackButton />
            </div>
            <div className='w-full h-full flex flex-col gap-10'>
                <div className='w-full h-max flex flex-col gap-6'>
                    <StaticBannerPromo
                        title="Komik"
                        subtitle="Baca komik favorit Anda kapan saja"
                        bgColor="#00C7BE4D"
                        titleColor="#00FFF3"
                    />
                    <div className='relative w-full h-full'>
                        <div className='px-2 md:px-16 absolute -bottom-6 w-full'>
                            <Suspense fallback={<LoadingOverlay />}>
                                <Filter
                                    contentType="Komik"
                                    textColor="#00FFF3"
                                    buttonColor={
                                        {
                                            activeFrom: "#00C7BE",
                                            activeTo: "#00615D"
                                        }
                                    }
                                />
                            </Suspense>
                        </div>
                    </div>
                </div>
                <Suspense fallback={<LoadingOverlay />}>
                    <ComicContent />
                </Suspense>
            </div>
        </main>
    )
}

function ComicContent() {
    const searchParams = useSearchParams();
    const { data, isLoading } = useGetComicsHomeDataQuery(searchParams.get("cat") || "");
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
            />
            <CarouselTemplate
                label={"Top 10 Comics"}
                contents={topTenData}
                isLoading={isLoading}
                type={"comic"}
                isTopTen={true}
            />
            <CarouselTemplate
                label={"Newest"}
                contents={newestData}
                isLoading={isLoading}
                type={"comic"}
            />
        </>
    );
}
