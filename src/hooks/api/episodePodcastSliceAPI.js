import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const episodePodcastSliceAPI = createApi({
    reducerPath: "episodePodcastSliceAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["EpisodePodcast"],
    endpoints: (builder) => ({
        // Get episodes by podcast ID
        getEpisodesByPodcastId: builder.query({
            query: ({ podcastId, page = 1, limit = 10, paginate = true }) => 
                `/episodePodcast/podcast/${podcastId}?page=${page}&limit=${limit}&paginate=${paginate}`,
            providesTags: (result, error, { podcastId }) => [
                { type: "EpisodePodcast", id: podcastId },
                { type: "EpisodePodcast", id: "LIST" },
            ],
        }),

        // Get single episode by ID
        getEpisodePodcastById: builder.query({
            query: (id) => `/episodePodcast/${id}`,
            providesTags: (result, error, id) => [{ type: "EpisodePodcast", id }],
        }),

        // Create new episode
        createEpisodePodcast: builder.mutation({
            query: (formData) => ({
                url: "/episodePodcast",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: (result, error, { podcastId }) => [
                { type: "EpisodePodcast", id: podcastId },
                { type: "EpisodePodcast", id: "LIST" },
            ],
        }),

        // Update episode
        updateEpisodePodcast: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/episodePodcast/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "EpisodePodcast", id },
                { type: "EpisodePodcast", id: "LIST" },
            ],
        }),

        // Delete episode
        deleteEpisodePodcast: builder.mutation({
            query: (id) => ({
                url: `/episodePodcast/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "EpisodePodcast", id },
                { type: "EpisodePodcast", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetEpisodesByPodcastIdQuery,
    useGetEpisodePodcastByIdQuery,
    useCreateEpisodePodcastMutation,
    useUpdateEpisodePodcastMutation,
    useDeleteEpisodePodcastMutation,
} = episodePodcastSliceAPI;