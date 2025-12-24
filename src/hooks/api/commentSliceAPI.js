import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const commentAPI = createApi({
    reducerPath: "commentAPI",
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: fetchBaseQuery({
        baseUrl: BACKEND_URL,
        credentials: "include",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["comment"],
    endpoints: (builder) => ({
        getCommentByEpisodeEbook: builder.query({
            query: (id) => `/comment/episode-ebook/${id}`,
            providesTags: ["comment"],
        }),
        getCommentByEpisodeComic: builder.query({
            query: (id) => `/comment/episode-comic/${id}`,
            providesTags: ["comment"],
        }),
        getCommentByPodcast: builder.query({
            query: (id) => `/comment/podcast/${id}`,
            providesTags: ["comment"],
        }),
        getCommentByEpisodeSeries: builder.query({
            query: (id) => `/comment/episode-series/${id}`,
            providesTags: ["comment"],
        }),
        getCommentByMovie: builder.query({
            query: (id) => `/comment/movie/${id}`,
            providesTags: ["comment"],
        }),
        createComment: builder.mutation({
            query: (payload) => ({
                url: "/comment",
                method: "POST",
                body: payload,
                headers: {
                    "Content-Type": "application/json",
                },
            }),
            invalidatesTags: ["comment"],
        }),
        replyComment: builder.mutation({
            query: (payload) => ({
                url: "/replyComment",
                method: "POST",
                body: payload,
                headers: {
                    "Content-Type": "application/json",
                },
            }),
            invalidatesTags: ["comment"],
        }),
    }),
});

export const {
    useGetCommentByEpisodeEbookQuery,
    useGetCommentByEpisodeComicQuery,
    useGetCommentByPodcastQuery,
    useCreateCommentMutation,
    useGetCommentByEpisodeSeriesQuery,
    useGetCommentByMovieQuery,
    useReplyCommentMutation,
} = commentAPI;
