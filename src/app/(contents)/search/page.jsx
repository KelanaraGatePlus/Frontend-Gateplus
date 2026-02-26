"use client";
import React, { Suspense, useEffect, useState } from "react";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";
import BackButton from "@/components/BackButton/page";
import { useSearchParams } from "next/navigation";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import { useGetSearchResultsMutation } from "@/hooks/api/searchAPI";
import DynamicBannerPromo from "@/components/BannerPromoSlider/DynamicBannerPromo";
import FilterDropdown from "@/components/Dropdown/FilterDropdown";
import { XIcon } from "lucide-react";
import { useGetAllGenresQuery } from "@/hooks/api/genreSliceAPI";
import { contentType } from "@/lib/constants/contentType";
import PropTypes from "prop-types";
import Image from "next/image";
import Link from "next/link";
import getMinAge from "@/lib/helper/minAge";
import useSyncUserData from "@/hooks/api/useSyncUserData";
import { useCallback } from "react";
import BackToTop from "@/components/ui/buttonBackToTop";

export default function SearchPage() {
  const { userAge, isReady } = useSyncUserData();

  const isBlurred = useCallback(
    (content) => {
      if (!isReady) return true;

      const minAge = getMinAge(content?.ageRestriction);

      // SU / R13 → bebas
      if (minAge === null) return false;

      // belum isi DOB
      if (userAge == null) return true;

      return userAge < minAge;
    },
    [userAge, isReady],
  );

  return (
    <div className="overflow-hidden">
      <Suspense fallback={<LoadingOverlay />}>
        <SearchPageComponent isBlurred={isBlurred} />
      </Suspense>
    </div>
  );
}

function SearchPageComponent({ isBlurred }) {
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
    totalReturned: 0,
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
    value: category.id,
  }));

  const contentCategories = [
    { label: "Kreator", value: "creator" },
    ...Object.keys(contentType).map((key) => ({
      label: contentType[key].capitalizedLabel,
      value: contentType[key].singleName,
    })),
  ];

  const getLabelFromValue = (options, value) => {
    const found = options?.find((opt) => opt.value === value);
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
        totalReturned: 0,
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
      <div className="absolute top-2 left-2 z-50 md:left-13">
        <BackButton />
      </div>
      <div className="flex h-full w-full flex-col gap-10">
        <div className="flex h-max w-full flex-col gap-6">
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
        {(searchParams.get("category") ||
          searchParams.get("genre") ||
          searchParams.get("relevance")) && (
          <div className="mx-2 mb-4 flex flex-col gap-4 rounded-md border border-white/20 bg-[#DEDEDE1A] p-8 text-white md:mx-[60px] md:flex-row md:items-center md:justify-between">
            <h2>Filter Aktif:</h2>

            <div className="grid grid-cols-4 gap-2 lg:grid-cols-6">
              {searchParams.getAll("category").map((val, index) => (
                <FilterCard
                  key={`cat-${index}`}
                  label={getLabelFromValue(contentCategories, val)}
                  onRemove={() =>
                    removeParam("category", val, query, fetchSearchResults)
                  }
                />
              ))}
              {searchParams.getAll("genre").map((val, index) => (
                <FilterCard
                  key={`gen-${index}`}
                  label={getLabelFromValue(genreOptions, val)}
                  onRemove={() =>
                    removeParam("genre", val, query, fetchSearchResults)
                  }
                />
              ))}
              {searchParams.getAll("relevance").map((val, index) => (
                <FilterCard
                  key={`rel-${index}`}
                  label={getLabelFromValue(relevanceOptions, val)}
                  onRemove={() =>
                    removeParam("relevance", val, query, fetchSearchResults)
                  }
                />
              ))}
            </div>

            <button
              className="text-end text-white underline md:text-center"
              onClick={() => {
                const params = new URLSearchParams(window.location.search);
                params.delete("category");
                params.delete("genre");
                params.delete("relevance");
                window.history.replaceState(
                  {},
                  "",
                  `${window.location.pathname}?${params.toString()}`,
                );
                fetchSearchResults(query);
              }}
            >
              Hapus Filter
            </button>
          </div>
        )}

        <div>
          {/* Hasil Pencarian */}
          <div className="flex flex-row justify-between px-2 font-bold text-white md:px-[60px]">
            <h2 className="zeinFont text-2xl">
              Hasil Search Untuk <b>{query}</b>
            </h2>
            <p className="text-sm font-bold text-[#808080]">
              {searchResults.totalReturned} Hasil
            </p>
          </div>
          <Suspense fallback={<LoadingOverlay />}>
            <SearchResultsContent
              searchResults={searchResults}
              loading={loading}
              isBlurred={isBlurred}
            />
          </Suspense>
        </div>
      </div>
      <BackToTop />
    </main>
  );
}

SearchPageComponent.propTypes = {
  isBlurred: PropTypes.bool.isRequired,
};

function removeParam(key, value, query, fetchSearchResults) {
  const params = new URLSearchParams(window.location.search);
  const updated = params.getAll(key).filter((v) => v !== value);
  params.delete(key);
  updated.forEach((v) => params.append(key, v));
  window.history.replaceState(
    {},
    "",
    `${window.location.pathname}?${params.toString()}`,
  );

  // Trigger search ulang
  if (fetchSearchResults && query) {
    fetchSearchResults(query);
  }
}

function SearchResultsContent({ searchResults, loading, isBlurred }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Hasil Kreator */}
      {searchResults.creators && searchResults.creators.length > 0 && (
        <div className="my-6 px-2 md:px-[60px]">
          <h2 className="zeinFont mb-4 text-2xl font-extrabold text-white md:text-3xl lg:text-4xl xl:text-[40px]">
            Kreator ({searchResults.creators.length})
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {searchResults.creators.map((creator, index) => (
              <Link href={`/creator/${creator.id}`} key={index}>
                <div className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-transparent bg-white/5 p-4 transition-all hover:border-blue-500 hover:bg-white/10">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full">
                    <Image
                      src={creator.imageUrl || "/default-avatar.png"}
                      alt={creator.profileName || creator.username}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="line-clamp-2 text-center text-sm font-semibold text-white">
                    {creator.profileName || creator.username}
                  </h3>
                  <p className="text-xs text-gray-400">
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
        isBlurred={isBlurred}
      />
      <CarouselTemplate
        label="Hasil Series"
        contents={searchResults.series || []}
        isLoading={loading}
        type="series"
        isBlurred={isBlurred}
      />
      <CarouselTemplate
        label="Hasil eBook"
        contents={searchResults.ebooks || []}
        isLoading={loading}
        type="ebook"
        isBlurred={isBlurred}
      />
      <CarouselTemplate
        label="Hasil Komik"
        contents={searchResults.comics || []}
        isLoading={loading}
        type="comic"
        isBlurred={isBlurred}
      />
      <CarouselTemplate
        label="Hasil Podcast"
        contents={searchResults.podcasts || []}
        isLoading={loading}
        type="podcast"
        isBlurred={isBlurred}
      />
    </div>
  );
}

SearchResultsContent.propTypes = {
  searchResults: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  isBlurred: PropTypes.bool.isRequired,
};

function FilterCard({ label, onRemove }) {
  return (
    <div className="flex w-full items-center justify-center gap-1 rounded-full bg-[#0395BC59] px-1 py-1 text-white md:gap-2.5 md:px-2">
      <span className="text-xs font-medium md:text-[16px]">{label}</span>
      <button
        onClick={onRemove}
        className="rounded-full bg-[#F5F5F5]/50 p-0.5 text-white hover:cursor-pointer hover:text-gray-200 md:p-1.5"
      >
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

SearchPageComponent.propTypes = {
  isBlurred: PropTypes.func.isRequired,
};
