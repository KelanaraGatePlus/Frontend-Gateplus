import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const podcastApi = createApi({
    reducerPath: "podcastApi",
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
    tagTypes: ["podcast"],
    endpoints: (builder) => ({
        getPodcast: builder.query({
            query: () => "/podcast",
            providesTags: ["podcast"],
            keepUnusedDataFor: 3600,
        }),
        getPodcastById: builder.query({
            query: ({ id, withEpisodes = false }) => `/podcast/${id}?withEpisodes=${withEpisodes}`,
            providesTags: ["podcast"],
            keepUnusedDataFor: 3600,
        }),
        createPodcast: builder.mutation({
            query: (formData) => ({
                url: "/podcast",
                method: "POST",
                body: formData,
                formData: true,
            }),
            invalidatesTags: ["podcast"],
        }),
        createEpisode: builder.mutation({
            query: (formData) => ({
                url: "/episodePodcast",
                method: "POST",
                body: formData,
                formData: true,
            }),
            invalidatesTags: ["podcast"],
        }),
        getPodcastHomeData: builder.query({
            query: (category) => category ? `/podcast/highlights?category=${category}` : `/podcast/highlights`,
            providesTags: ["podcast"],
        }),
        getPodcastPerContentAnalytics: builder.query({
            query: (id) => `/podcast/analytics/${id}`,
            providesTags: ["podcast"],
        }),
        deletePodcast: builder.mutation({
            query: (id) => ({
                url: `/podcast/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["podcast"],
        }),
        editPodcast: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/podcast/${id}`,
                method: "PATCH",
                body: formData,
                formData: true,
            }),
            invalidatesTags: ["podcast"],
        }),
    }),
});

export const {
    useGetPodcastQuery,
    useGetPodcastByIdQuery,
    useCreatePodcastMutation,
    useCreateEpisodeMutation,
    useGetPodcastHomeDataQuery,
    useDeletePodcastMutation,
    useEditPodcastMutation,
    useGetPodcastPerContentAnalyticsQuery,
} = podcastApi;
