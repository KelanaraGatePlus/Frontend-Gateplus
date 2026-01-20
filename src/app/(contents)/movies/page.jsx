"use client";
import React, { Suspense } from 'react';
import CarouselTemplate from '@/components/Carousel/carouselTemplate';
import { useGetMoviesHomeDataQuery } from '@/hooks/api/movieSliceAPI';
import StaticBannerPromo from '@/components/BannerPromoSlider/StaticBannerPromo';
import BackButton from '@/components/BackButton/page';
import Filter from '@/components/FilterComponent/FIlter';
import { useSearchParams } from 'next/navigation';
import LoadingOverlay from '@/components/LoadingOverlay/page';

export default function MoviesPage() {
    return (
        <div className='w-full h-full flex flex-col gap-4 md:gap-10'>
            <div className="absolute left-2 md:left-13 top-2">
                <BackButton />
            </div>
            <div className='w-full h-max flex flex-col gap-6'>
                <StaticBannerPromo
                    title="Movies"
                    subtitle="Koleksi film terbaik untuk hiburan Anda"
                    bgColor="#156EB74D"
                    titleColor="#219BFF"
                />
                <div className='relative w-full h-full'>
                    <div className='px-2 md:px-16 absolute -bottom-6 w-full'>
                        <Suspense fallback={<LoadingOverlay />}>
                            <Filter
                                contentType="Movie"
                                textColor="#219BFF"
                            />
                        </Suspense>
                    </div>
                </div>
            </div>
            <Suspense fallback={<LoadingOverlay />}>
                <MovieContent />
            </Suspense>
        </div>
    )
}

function MovieContent() {
    const searchParams = useSearchParams();
    const { data, isLoading } = useGetMoviesHomeDataQuery(searchParams.get("cat") || "");
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
            />
            <CarouselTemplate
                label={"Top Rated Movie"}
                contents={topTenData}
                isLoading={isLoading}
                type={"movie"}
                isTopTen={true}
                withTopTag={false}
            />
            <CarouselTemplate
                label={"Newest"}
                contents={newestData}
                isLoading={isLoading}
                type={"movie"}
                withNewestTag={true}
                withTopTag={false}
            />
        </>
    )
}
