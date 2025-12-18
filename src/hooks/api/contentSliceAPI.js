import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const contentAPI = createApi({
    reducerPath: "contentApi",
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: fetchBaseQuery({
        baseUrl: BACKEND_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token"); // atau sessionStorage atau cookie
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["ebookContent", "comicContent", "seriesContent", "podcastContent"],
    endpoints: (builder) => ({
        getEpisodeEbookById: builder.query({
            query: (id) => `/episode/${id}`,
            providesTags: ["ebookContent"],
        }),
        getEpisodeComicsById: builder.query({
            query: (id) => `/episodeComics/${id}`,
            providesTags: ["comicContent"],
        }),
        getEpisodeSeriesById: builder.query({
            query: (id) => `/episodeSeries/${id}`,
            providesTags: ["seriesContent"],
        }),
        getEpisodePodcastById: builder.query({
            query: (id) => `/episodePodcast/${id}`,
            providesTags: ["podcastContent"],
        }),
        getAllEpisodeByEbookId: builder.query({
            // Accept a single object parameter: { ebookId, page, limit, withPurchased }
            query: ({ id, page = 1, limit = 5, withPurchased = false, paginate = true }) =>
                `/episode/ebook/${id}?page=${page}&limit=${limit}&withPurchased=${withPurchased}&paginate=${paginate}`,
            providesTags: ["ebookContent"],
        }),
        getAllEpisodeByComicId: builder.query({
            query: ({ id, page = 1, limit = 5, withPurchased = false, paginate = true }) =>
                `/episodeComics/comic/${id}?page=${page}&limit=${limit}&withPurchased=${withPurchased}&paginate=${paginate}`,
            providesTags: ["comicContent"],
        }),
        getAllEpisodeBySeriesId: builder.query({
            query: ({ id, page = 1, limit = 5, withPurchased = false, paginate = true }) =>
                `/episodeSeries/series/${id}?page=${page}&limit=${limit}&withPurchased=${withPurchased}&paginate=${paginate}`,
            providesTags: ["seriesContent"],
        }),
        getAllEpisodeByPodcastId: builder.query({
            query: ({ id, page = 1, limit = 5, withPurchased = false, paginate = true }) =>
                `/episodePodcast/podcast/${id}?page=${page}&limit=${limit}&withPurchased=${withPurchased}&paginate=${paginate}`,
            providesTags: ["podcastContent"],
        }),
        getPublicEpisodeEbookById: builder.query({
            query: ({ id }) => `/episode/public/${id}`,
            providesTags: ["ebookContent", "comicContent", "seriesContent", "podcastContent"],
        }),
        getPublicEpisodeComicsById: builder.query({
            query: ({ id }) => `/episodeComics/public/${id}`,
            providedTags: []
        }),
        getPublicEpisodeSeriesById: builder.query({
            query: ({ id }) => `/episodeSeries/public/${id}`,
            providedTags: []
        }),
        getPublicEpisodePodcastById: builder.query({
            query: ({ id }) => `/episodePodcast/public/${id}`,
            providedTags: []
        }),
    }),
});

export const {
    useGetEpisodeEbookByIdQuery,
    useGetEpisodeComicsByIdQuery,
    useGetEpisodeSeriesByIdQuery,
    useGetAllEpisodeByEbookIdQuery,
    useGetAllEpisodeByComicIdQuery,
    useGetAllEpisodeBySeriesIdQuery,
    useGetAllEpisodeByPodcastIdQuery,
    useGetEpisodePodcastByIdQuery,

    // Lazy Queries
    useLazyGetAllEpisodeByComicIdQuery,
    useLazyGetAllEpisodeBySeriesIdQuery,
    useLazyGetAllEpisodeByPodcastIdQuery,
    useLazyGetAllEpisodeByEbookIdQuery,

    // Public Queries
    useGetPublicEpisodeEbookByIdQuery,
    useGetPublicEpisodeComicsByIdQuery,
    useGetPublicEpisodeSeriesByIdQuery,
    useGetPublicEpisodePodcastByIdQuery,
} = contentAPI;
