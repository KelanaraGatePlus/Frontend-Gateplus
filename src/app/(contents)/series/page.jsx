"use client";
import React from 'react';
import CarouselTemplate from '@/components/Carousel/carouselTemplate';
import { useGetSeriesHomeDataQuery } from '@/hooks/api/seriesSliceAPI';

export default function SeriesPage() {
    const { data, isLoading } = useGetSeriesHomeDataQuery();
    const newestData = data?.data?.newReleaseSeries || [];
    const topTenData = data?.data?.topTenSeries || [];
    const highlightedData = data?.data?.highlightsSeries || [];

    return (
        <div className='w-full h-full my-40 flex flex-col gap-10'>
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
        </div>
    )
}
