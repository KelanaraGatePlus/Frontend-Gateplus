"use client";
import React, { Suspense } from 'react';
import CarouselTemplate from '@/components/Carousel/carouselTemplate';
import { useGetPodcastHomeDataQuery } from '@/hooks/api/podcastSliceAPI';
import BackButton from '@/components/BackButton/page';
import StaticBannerPromo from '@/components/BannerPromoSlider/StaticBannerPromo';
import Filter from '@/components/FilterComponent/FIlter';
import { useSearchParams } from 'next/navigation';
import LoadingOverlay from '@/components/LoadingOverlay/page';

export default function PodcastsPage() {
    return (
        <main className="relative mt-16 flex flex-col md:mt-[100px] lg:px-4 w-full h-full gap-4 md:gap-10">
            <div className="absolute left-2 md:left-13 top-2">
                <BackButton />
            </div>
            <div className='w-full h-full flex flex-col gap-10'>
                <div className='w-full h-max flex flex-col gap-6'>
                    <StaticBannerPromo
                        title="Podcast"
                        subtitle="Dengarkan podcast menarik dari berbagai kategori"
                        bgColor="#AF52DE4D"
                        titleColor="#CB65FF"
                    />
                    <div className="px-2 md:px-24">
                        <Suspense fallback={<LoadingOverlay />}>
                            <Filter
                                contentType="Podcast"
                                textColor="#CB65FF"
                                buttonColor={
                                    {
                                        activeFrom: "#AF52DE",
                                        activeTo: "#5F2C78"
                                    }
                                }
                            />
                        </Suspense>
                    </div>
                </div>
                <Suspense fallback={<LoadingOverlay />}>
                    <PodcastContent />
                </Suspense>
            </div>
        </main>
    )
}

function PodcastContent() {
    const searchParams = useSearchParams();
    const { data, isLoading } = useGetPodcastHomeDataQuery(searchParams.get("cat") || "");
    const newestData = data?.data?.newReleasePodcast || [];
    const topTenData = data?.data?.topTenPodcast || [];
    const highlightedData = data?.data?.highlightsPodcast || [];

    return (
        <>
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
        </>
    );
}
