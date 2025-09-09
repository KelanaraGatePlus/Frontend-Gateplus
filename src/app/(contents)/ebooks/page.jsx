"use client";
import React from 'react';
import CarouselTemplate from '@/components/Carousel/carouselTemplate';
import { useGetEbooksHomeDataQuery } from '@/hooks/api/ebookSliceAPI';

export default function EbooksPage() {
    const { data, isLoading } = useGetEbooksHomeDataQuery();
    const newestData = data?.data?.newReleaseEbooks || [];
    const topTenData = data?.data?.topTenEbooks || [];
    const highlightedData = data?.data?.highlightsEbooks || [];

    return (
        <div className='w-full h-full my-40 flex flex-col gap-10'>
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
            />
            <CarouselTemplate
                label={"Newest"}
                contents={newestData}
                isLoading={isLoading}
                type={"ebook"}
            />
        </div>
    )
}
