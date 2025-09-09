"use client";
import React from 'react';
import CarouselTemplate from '@/components/Carousel/carouselTemplate';
import { useGetMoviesHomeDataQuery } from '@/hooks/api/movieSliceAPI';

export default function MoviesPage() {
    const { data, isLoading } = useGetMoviesHomeDataQuery();
    const newestData = data?.data?.newReleaseMovies || [];
    const topTenData = data?.data?.topTenMovies || [];
    const highlightedData = data?.data?.highlightsMovies || [];

    return (
        <div className='w-full h-full my-40 flex flex-col gap-10'>
            <CarouselTemplate
                label={"Highlight Movie"}
                contents={highlightedData}
                isLoading={isLoading}
                type={"movie"}
            />
            <CarouselTemplate
                label={"Top 10 Movie"}
                contents={topTenData}
                isLoading={isLoading}
                type={"movie"}
                isTopTen={true}
            />
            <CarouselTemplate
                label={"Newest"}
                contents={newestData}
                isLoading={isLoading}
                type={"movie"}
            />
        </div>
    )
}
