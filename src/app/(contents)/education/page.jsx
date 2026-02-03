"use client";
import React, { Suspense } from 'react';
import CarouselTemplate from '@/components/Carousel/carouselTemplate';
import StaticBannerPromo from '@/components/BannerPromoSlider/StaticBannerPromo';
import BackButton from '@/components/BackButton/page';
import LoadingOverlay from '@/components/LoadingOverlay/page';
import { useGetEducationBySearchQuery, useGetEducationHomeDataQuery } from '@/hooks/api/educationSliceAPI';
import EducationCard from '@/components/Card/EducationCard';
import { useSearchParams } from 'next/navigation';

export default function EducationPage() {
    return (
        <div className='w-full h-full flex flex-col gap-4 md:gap-10'>
            <div className="absolute left-2 md:left-13 top-2">
                <BackButton />
            </div>
            <div className='w-full h-max flex flex-col gap-6'>
                <StaticBannerPromo
                    title="Education"
                    subtitle="Expand your knowledge with our curated educational content."
                    bgColor="#5856D64D"
                    titleColor="#6A67FF"
                />
            </div>
            <Suspense fallback={<LoadingOverlay />}>
                <EducationContent />
            </Suspense>
        </div>
    )
}

function EducationContent() {
    const searchParams = useSearchParams();
    const query = (searchParams.get("search") || "").trim();

    const { data, isLoading } = useGetEducationHomeDataQuery(undefined, { skip: !!query });
    const { data: searchData, isLoading: isSearchLoading } = useGetEducationBySearchQuery(searchParams.toString(), { skip: !query });

    const popular = data?.popular || [];
    const featured = data?.featured || [];

    const searchResults = Array.isArray(searchData?.data)
        ? searchData.data
        : Array.isArray(searchData?.educations)
            ? searchData.educations
            : Array.isArray(searchData?.results)
                ? searchData.results
                : Array.isArray(searchData)
                    ? searchData
                    : [];

    if (query) {
        return (
            <div className='px-4 md:px-15'>
                <h2 className="zeinFont text-white md:mb-4 mb-2 text-2xl md:text-3xl lg:text-4xl xl:text-[40px] font-extrabold">
                    Hasil Pencarian &quot;{query}&quot;
                </h2>

                {isSearchLoading ? (
                    <LoadingOverlay />
                ) : searchResults.length > 0 ? (
                    <div className='grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-12 '>
                        {searchResults.map((item, index) => (
                            <EducationCard
                                key={index}
                                title={item.title}
                                id={item.id}
                                coverUrl={item.bannerUrl}
                                creatorName={item.creator?.profileName}
                                releaseDate={item.createdAt}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-white/70">Tidak ada hasil untuk pencarian ini.</p>
                )}
            </div>
        );
    }

    return (
        <>
            <CarouselTemplate
                label={"Top 10 Education"}
                contents={popular}
                isLoading={isLoading}
                type={"education"}
            />

            <div className='px-4 md:px-15'>
                <h2 className="zeinFont text-white md:mb-4 mb-2 text-2xl md:text-3xl lg:text-4xl xl:text-[40px] font-extrabold">
                    Featured Education
                </h2>
                <div className='grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-12 '>
                    {
                        featured.map((item, index) => (
                            <EducationCard
                                key={index}
                                title={item.title}
                                id={item.id}
                                coverUrl={item.bannerUrl}
                                creatorName={item.creator.profileName}
                                releaseDate={item.createdAt}
                            />
                        ))
                    }
                </div>
            </div>
        </>
    )
}
