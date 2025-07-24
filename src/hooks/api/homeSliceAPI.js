import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const homeAPI = createApi({
    reducerPath: "homeAPI",
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: fetchBaseQuery({ baseUrl: BACKEND_URL }),
    tagTypes: ["homeAPI"],
    endpoints: (builder) => ({
        getNewest: builder.query({
            query: () => "/home/newest",
            providesTags: ["homeAPI"],
            keepUnusedDataFor: 120,
        }),
        getHighlight: builder.query({
            query: () => "/home/highlights",
            providesTags: ["homeAPI"],
            keepUnusedDataFor: 86400,
        }),
        getTopTen: builder.query({
            query: () => "/home/top-10",
            providesTags: ["homeAPI"],
            keepUnusedDataFor: 259200,
        }),
        getRecommendations: builder.query({
            query: () => "/home/recommendations",
            providesTags: ["homeAPI"],
            keepUnusedDataFor: 259200,
        }),
        getPopularEbooks: builder.query({
            query: () => "/home/popular-ebooks",
            providesTags: ["homeAPI"],
            keepUnusedDataFor: 86400,
        }),
        getPopularComics: builder.query({
            query: () => "/home/popular-comics",
            providesTags: ["homeAPI"],
            keepUnusedDataFor: 86400,
        }),
        getPopularPodcasts: builder.query({
            query: () => "/home/popular-podcasts",
            providesTags: ["homeAPI"],
            keepUnusedDataFor: 86400,
        }),
    }),
})

export const {
    useGetNewestQuery,
    useGetHighlightQuery,
    useGetTopTenQuery,
    useGetRecommendationsQuery,
    useGetPopularEbooksQuery,
    useGetPopularComicsQuery,
    useGetPopularPodcastsQuery,
} = homeAPI;