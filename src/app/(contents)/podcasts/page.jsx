"use client";
import React from 'react';
import CarouselTemplate from '@/components/Carousel/carouselTemplate';
import { useGetPodcastHomeDataQuery } from '@/hooks/api/podcastSliceAPI';

export default function PodcastsPage() {
    const { data, isLoading } = useGetPodcastHomeDataQuery();
    const newestData = data?.data?.newReleasePodcast || [];
    const topTenData = data?.data?.topTenPodcast || [];
    const highlightedData = data?.data?.highlightsPodcast || [];

    return (
        <div className='w-full h-full my-40 flex flex-col gap-10'>
            <CarouselTemplate
                label={"Highlight Podcast"}
                contents={highlightedData}
                isLoading={isLoading}
                type={"podcast"}
            />
            <CarouselTemplate
                label={"Top 10 Podcast"}
                contents={topTenData}
                isLoading={isLoading}
                type={"podcast"}
                isTopTen={true}
            />
            <CarouselTemplate
                label={"Newest"}
                contents={newestData}
                isLoading={isLoading}
                type={"podcast"}
            />
        </div>
    )
}
