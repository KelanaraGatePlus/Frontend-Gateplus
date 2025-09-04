"use client";
import React from 'react';
import BlankPage from "@/components/WorkInProgress/page";
import CarouselTemplate from '@/components/Carousel/carouselTemplate';
import { useGetComicsHomeDataQuery } from '@/hooks/api/comicSliceAPI';

export default function ComicsPage() {
    const { data, isLoading } = useGetComicsHomeDataQuery();
    const newestData = data?.data?.newReleaseComics || [];
    const topTenData = data?.data?.topTenComics || [];
    const highlightedData = data?.data?.highlightsComics || [];

    return (
        <div className='w-full h-full my-40 flex flex-col gap-10'>
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
        </div>
    )
}
