import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const episodeComicSliceAPI = createApi({
    reducerPath: "episodeComicSliceAPI",
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
    tagTypes: ["EpisodeComic"],
    endpoints: (builder) => ({
        // Get episodes by comic ID
        getEpisodesByComicId: builder.query({
            query: ({ comicId, page = 1, limit = 10, paginate = true }) => 
                `/episodeComics/comic/${comicId}?page=${page}&limit=${limit}&paginate=${paginate}`,
            providesTags: (result, error, { comicId }) => [
                { type: "EpisodeComic", id: comicId },
                { type: "EpisodeComic", id: "LIST" },
            ],
        }),

        // Get single episode by ID
        getEpisodeComicById: builder.query({
            query: (id) => `/episodeComics/${id}`,
            providesTags: (result, error, id) => [{ type: "EpisodeComic", id }],
        }),

        // Update episode
        updateEpisodeComic: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/episodeComics/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "EpisodeComic", id },
                { type: "EpisodeComic", id: "LIST" },
            ],
        }),

        // Delete episode
        deleteEpisodeComic: builder.mutation({
            query: (id) => ({
                url: `/episodeComics/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "EpisodeComic", id },
                { type: "EpisodeComic", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetEpisodesByComicIdQuery,
    useGetEpisodeComicByIdQuery,
    useUpdateEpisodeComicMutation,
    useDeleteEpisodeComicMutation,
} = episodeComicSliceAPI;