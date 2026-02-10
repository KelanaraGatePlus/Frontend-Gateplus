"use client";
import React, { Suspense, useEffect, useState } from 'react';
import CarouselTemplate from '@/components/Carousel/carouselTemplate';
import BackButton from '@/components/BackButton/page';
import { useSearchParams } from 'next/navigation';
import LoadingOverlay from '@/components/LoadingOverlay/page';
import { useGetSearchResultsMutation } from '@/hooks/api/searchAPI';
import DynamicBannerPromo from '@/components/BannerPromoSlider/DynamicBannerPromo';
import FilterDropdown from '@/components/Dropdown/FilterDropdown';
import { XIcon } from 'lucide-react';
import { useGetAllGenresQuery } from '@/hooks/api/genreSliceAPI';
import { contentType } from '@/lib/constants/contentType';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';

export default function SearchPage() {
    return (
        <div className='overflow-hidden'>
            <Suspense fallback={<LoadingOverlay />}>
                <SearchPageComponent />
            </Suspense>
        </div>
    );
}

function SearchPageComponent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("search") || "";
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState({
        creators: [],
        movies: [],
        series: [],
        ebooks: [],
        comics: [],
        podcasts: [],
        totalReturned: 0
    });
    const [getSearchResults] = useGetSearchResultsMutation();
    const { data: categoryData } = useGetAllGenresQuery();

    const relevanceOptions = [
        { label: "Terbaru", value: "latest" },
        { label: "Terlama", value: "oldest" },
        { label: "A-Z", value: "a-z" },
        { label: "Z-A", value: "z-a" },
    ];

    const genreOptions = categoryData?.data?.data?.map((category) => ({
        label: category.tittle,
        value: category.id
    }));

    const contentCategories = [
        { label: "Kreator", value: "creator" },
        ...Object.keys(contentType).map(key => ({
            label: contentType[key].capitalizedLabel,
            value: contentType[key].singleName,
        }))
    ];

    const getLabelFromValue = (options, value) => {
        const found = options?.find(opt => opt.value === value);
        return found ? found.label : value;
    };

    const fetchSearchResults = async (searchQuery) => {
        setLoading(true);
        try {
            const params = new URLSearchParams(window.location.search);
            
            // Ambil semua nilai dari query params
            const categories = params.getAll("category");
            const genres = params.getAll("genre");
            const relevances = params.getAll("relevance");
            
            const response = await getSearchResults({
                q: searchQuery,
                category: categories.length > 0 ? categories : null,
                genre: genres.length > 0 ? genres : null,
                relevance: relevances.length > 0 ? relevances : null,
            }).unwrap();
            
            setSearchResults(response);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setSearchResults({
                creators: [],
                movies: [],
                series: [],
                ebooks: [],
                comics: [],
                podcasts: [],
                totalReturned: 0
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (query) {
            fetchSearchResults(query);
        }
    }, [query, searchParams.toString()]);

    return (
        <main className="relative flex flex-col lg:px-4">
            <div className="absolute left-2 md:left-13 top-2 z-50">
                <BackButton />
            </div>
            <div className='w-full h-full flex flex-col gap-10'>
                <div className='w-full h-max flex flex-col gap-6'>
                    <div>
                        <Suspense fallback={<LoadingOverlay />}>
                            <DynamicBannerPromo
                                title="Hasil Pencarian"
                                subtitle={`${searchResults.totalReturned} hasil untuk "${query}"`}
                                bgColor="#F4A2614D"
                                titleColor="#FFFFFF"
                                filter={
                                    <>
                                        <FilterDropdown
                                            queryParameterName="category"
                                            options={contentCategories || []}
                                            label="Semua Kategori"
                                        />
                                        <FilterDropdown
                                            queryParameterName="genre"
                                            options={genreOptions || []}
                                            label="Semua Genre"
                                        />
                                        <FilterDropdown
                                            queryParameterName="relevance"
                                            options={relevanceOptions || []}
                                            label="Relevansi"
                                        />
                                    </>
                                }
                            />
                        </Suspense>
                    </div>
                </div>

                {/* Filter Aktif */}
                {(searchParams.get("category") || searchParams.get("genre") || searchParams.get("relevance")) && (
                    <div className='flex flex-col md:flex-row gap-4 md:items-center md:justify-between mx-2 md:mx-[60px] p-8 border text-white border-white/20 bg-[#DEDEDE1A] rounded-md mb-4'>
                        <h2>Filter Aktif:</h2>

                        <div className='grid grid-cols-4 lg:grid-cols-6 gap-2'>
                            {searchParams.getAll("category").map((val, index) => (
                                <FilterCard
                                    key={`cat-${index}`}
                                    label={getLabelFromValue(contentCategories, val)}
                                    onRemove={() => removeParam("category", val, query, fetchSearchResults)}
                                />
                            ))}
                            {searchParams.getAll("genre").map((val, index) => (
                                <FilterCard
                                    key={`gen-${index}`}
                                    label={getLabelFromValue(genreOptions, val)}
                                    onRemove={() => removeParam("genre", val, query, fetchSearchResults)}
                                />
                            ))}
                            {searchParams.getAll("relevance").map((val, index) => (
                                <FilterCard
                                    key={`rel-${index}`}
                                    label={getLabelFromValue(relevanceOptions, val)}
                                    onRemove={() => removeParam("relevance", val, query, fetchSearchResults)}
                                />
                            ))}
                        </div>

                        <button
                            className='text-white text-end md:text-center underline'
                            onClick={() => {
                                const params = new URLSearchParams(window.location.search);
                                params.delete("category");
                                params.delete("genre");
                                params.delete("relevance");
                                window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
                                fetchSearchResults(query);
                            }}
                        >
                            Hapus Filter
                        </button>
                    </div>
                )}

                <div>
                    {/* Hasil Pencarian */}
                    <div className="px-2 md:px-[60px] flex flex-row justify-between text-white font-bold">
                        <h2 className='text-2xl zeinFont'>
                            Hasil Search Untuk <b>{query}</b>
                        </h2>
                        <p className='text-[#808080] font-bold text-sm'>
                            {searchResults.totalReturned} Hasil
                        </p>
                    </div>
                    <Suspense fallback={<LoadingOverlay />}>
                        <SearchResultsContent searchResults={searchResults} loading={loading} />
                    </Suspense>
                </div>
            </div>
        </main>
    );
}

function removeParam(key, value, query, fetchSearchResults) {
    const params = new URLSearchParams(window.location.search);
    const updated = params.getAll(key).filter(v => v !== value);
    params.delete(key);
    updated.forEach(v => params.append(key, v));
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    
    // Trigger search ulang
    if (fetchSearchResults && query) {
        fetchSearchResults(query);
    }
}

function SearchResultsContent({ searchResults, loading }) {
    return (
        <div className="flex flex-col gap-6">
            {/* Hasil Kreator */}
            {searchResults.creators && searchResults.creators.length > 0 && (
                <div className="px-2 md:px-[60px] my-6">
                    <h2 className="text-white text-2xl md:text-3xl lg:text-4xl xl:text-[40px] font-extrabold mb-4 zeinFont">
                        Kreator ({searchResults.creators.length})
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {searchResults.creators.map((creator, index) => (
                            <Link href={`/creator/${creator.id}`} key={index}>
                                <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-blue-500">
                                    <div className="relative w-20 h-20 rounded-full overflow-hidden">
                                        <Image
                                            src={creator.imageUrl || '/default-avatar.png'}
                                            alt={creator.profileName || creator.username}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <h3 className="text-white text-center text-sm font-semibold line-clamp-2">
                                        {creator.profileName || creator.username}
                                    </h3>
                                    <p className="text-gray-400 text-xs">
                                        {creator._count?.subscriptions || 0} Followers
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Hasil Konten */}
            <CarouselTemplate 
                label="Hasil Movie" 
                contents={searchResults.movies || []} 
                isLoading={loading} 
                type="movie" 
            />
            <CarouselTemplate 
                label="Hasil Series" 
                contents={searchResults.series || []} 
                isLoading={loading} 
                type="series" 
            />
            <CarouselTemplate 
                label="Hasil eBook" 
                contents={searchResults.ebooks || []} 
                isLoading={loading} 
                type="ebook" 
            />
            <CarouselTemplate 
                label="Hasil Komik" 
                contents={searchResults.comics || []} 
                isLoading={loading} 
                type="comic" 
            />
            <CarouselTemplate 
                label="Hasil Podcast" 
                contents={searchResults.podcasts || []} 
                isLoading={loading} 
                type="podcast" 
            />
        </div>
    );
}

function FilterCard({ label, onRemove }) {
    return (
        <div className="flex items-center justify-center gap-1 md:gap-2.5 bg-[#0395BC59] text-white px-1 md:px-2 py-1 rounded-full w-full">
            <span className='font-medium text-xs md:text-[16px]'>{label}</span>
            <button onClick={onRemove} className="text-white hover:cursor-pointer hover:text-gray-200 p-0.5 md:p-1.5 rounded-full bg-[#F5F5F5]/50">
                <XIcon size={10} />
            </button>
        </div>
    );
}

SearchResultsContent.propTypes = {
    searchResults: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
};

FilterCard.propTypes = {
    label: PropTypes.string.isRequired,
    onRemove: PropTypes.func.isRequired,
};