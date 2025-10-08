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


export default function SearchPage() {
    return (
        <Suspense fallback={<LoadingOverlay />}>
            <SearchPageComponent />
        </Suspense>
    );
}

function SearchPageComponent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("search") || "";
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
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

    const contentCategories = Object.keys(contentType).map(key => ({
        label: contentType[key].capitalizedLabel,
        value: contentType[key].singleName,
    }));

    const getLabelFromValue = (options, value) => {
        const found = options?.find(opt => opt.value === value);
        return found ? found.label : value;
    };

    const fetchSearchResults = async (searchQuery) => {
        setLoading(true);
        try {
            const params = new URLSearchParams(window.location.search);
            const response = await getSearchResults({
                q: searchQuery,
                category: params.getAll("category") || null,
                genre: params.getAll("genre") || null,
                relevance: params.getAll("relevance") || null,
            }).unwrap();
            setSearchResults(response);
        } catch (error) {
            console.error("Error fetching search results:", error);
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
        <main className="relative mt-16 flex flex-col md:mt-[100px] lg:px-4">
            <div className="absolute left-13 top-2">
                <BackButton />
            </div>
            <div className='w-full h-full flex flex-col gap-10'>
                <div className='w-full h-max flex flex-col gap-6'>
                    <div>
                        <Suspense fallback={<LoadingOverlay />}>
                            <DynamicBannerPromo
                                title="Hasil Pencarian"
                                subtitle={`100 hasil untuk "${query}"`}
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

                {/* 🔸 Filter Aktif */}
                {(searchParams.get("category") || searchParams.get("genre") || searchParams.get("relevance")) && (
                    <div className='flex flex-row gap-4 items-center mx-[60px] p-8 border text-white border-white/20 bg-[#DEDEDE1A] rounded-md mb-4'>
                        <h2>Filter Aktif:</h2>

                        {searchParams.getAll("category").map((val, index) => (
                            <FilterCard
                                key={`cat-${index}`}
                                label={getLabelFromValue(contentCategories, val)}
                                onRemove={() => removeParam("category", val, query)}
                            />
                        ))}

                        {searchParams.getAll("genre").map((val, index) => (
                            <FilterCard
                                key={`gen-${index}`}
                                label={getLabelFromValue(genreOptions, val)}
                                onRemove={() => removeParam("genre", val, query)}
                            />
                        ))}

                        {searchParams.getAll("relevance").map((val, index) => (
                            <FilterCard
                                key={`rel-${index}`}
                                label={getLabelFromValue(relevanceOptions, val)}
                                onRemove={() => removeParam("relevance", val, query)}
                            />
                        ))}

                        <button
                            className='text-white underline'
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
                    {/* 🔸 Hasil Pencarian */}
                    <div className="px-[60px] flex flex-row justify-between text-white font-bold">
                        <h2 className='text-2xl zeinFont'>
                            Hasil Search Untuk <b>{query}</b>
                        </h2>
                        <p className='text-[#808080] font-bold text-sm'>
                            {searchResults.totalReturned} Hasil
                        </p>
                    </div>
                    <Suspense fallback={<LoadingOverlay />}>
                        <PodcastContent searchResults={searchResults} loading={loading} />
                    </Suspense>
                </div>
            </div>
        </main>
    );
}

function removeParam(key, value) {
    const params = new URLSearchParams(window.location.search);
    const updated = params.getAll(key).filter(v => v !== value);
    params.delete(key);
    updated.forEach(v => params.append(key, v));
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    // trigger search ulang
    const event = new Event('popstate');
    window.dispatchEvent(event);
}

function PodcastContent({ searchResults, loading }) {
    return (
        <>
            <CarouselTemplate label="Hasil Movie" contents={searchResults.movies || []} isLoading={loading} type="movie" />
            <CarouselTemplate label="Hasil Series" contents={searchResults.series || []} isLoading={loading} type="series" />
            <CarouselTemplate label="Hasil eBook" contents={searchResults.ebooks || []} isLoading={loading} type="ebook" />
            <CarouselTemplate label="Hasil Komik" contents={searchResults.comics || []} isLoading={loading} type="comic" />
            <CarouselTemplate label="Hasil Podcast" contents={searchResults.podcasts || []} isLoading={loading} type="podcast" />
        </>
    );
}

function FilterCard({ label, onRemove }) {
    return (
        <div className="flex items-center gap-2.5 bg-[#0395BC59] text-white px-2 py-1 rounded-full">
            <span className='font-medium'>{label}</span>
            <button onClick={onRemove} className="text-white hover:cursor-pointer hover:text-gray-200 p-1.5 rounded-full bg-[#F5F5F5]/50">
                <XIcon size={10} />
            </button>
        </div>
    );
}

PodcastContent.propTypes = {
    searchResults: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
};

FilterCard.propTypes = {
    label: PropTypes.string.isRequired,
    onRemove: PropTypes.func.isRequired,
};
