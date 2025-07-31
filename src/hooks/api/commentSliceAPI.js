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
            keepUnusedDataFor: 6000,
        }),
        getCommentByEpisodeComic: builder.query({
            query: (id) => `/comment/episode-comic/${id}`,
            providesTags: ["comment"],
            keepUnusedDataFor: 6000,
        }),
        getCommentByEpisodePodcast: builder.query({
            query: (id) => `/comment/episode-podcast/${id}`,
            providesTags: ["comment"],
            keepUnusedDataFor: 6000,
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
    }),
});

export const {
    useGetCommentByEpisodeEbookQuery,
    useGetCommentByEpisodeComicQuery,
    useGetCommentByEpisodePodcastQuery,
    useCreateCommentMutation,
} = commentAPI;
