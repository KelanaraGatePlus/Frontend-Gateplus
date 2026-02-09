import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const episodeEbookSliceAPI = createApi({
    reducerPath: "episodeEbookSliceAPI",
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
    tagTypes: ["EpisodeEbook"],
    endpoints: (builder) => ({
        // Get episodes by ebook ID
        getEpisodesByEbookId: builder.query({
            query: ({ ebookId, page = 1, limit = 10, paginate = true }) => 
                `/episode/ebook/${ebookId}?page=${page}&limit=${limit}&paginate=${paginate}`,
            providesTags: (result, error, { ebookId }) => [
                { type: "EpisodeEbook", id: ebookId },
                { type: "EpisodeEbook", id: "LIST" },
            ],
        }),

        // Get single episode by ID
        getEpisodeEbookById: builder.query({
            query: (id) => `/episode/${id}`,
            providesTags: (result, error, id) => [{ type: "EpisodeEbook", id }],
        }),

        // Update episode
        updateEpisodeEbook: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/episode/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "EpisodeEbook", id },
                { type: "EpisodeEbook", id: "LIST" },
            ],
        }),

        // Delete episode
        deleteEpisodeEbook: builder.mutation({
            query: (id) => ({
                url: `/episode/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "EpisodeEbook", id },
                { type: "EpisodeEbook", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetEpisodesByEbookIdQuery,
    useGetEpisodeEbookByIdQuery,
    useUpdateEpisodeEbookMutation,
    useDeleteEpisodeEbookMutation,
} = episodeEbookSliceAPI;