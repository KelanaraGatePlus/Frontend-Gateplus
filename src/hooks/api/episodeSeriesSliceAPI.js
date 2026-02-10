import { BACKEND_URL } from "@/lib/constants/backendUrl";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const episodeSeriesSliceAPI = createApi({
    reducerPath: "episodeSeriesSliceAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: BACKEND_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    // ✅ TAMBAHKAN CONFIG INI - Prevent aggressive cache invalidation
    keepUnusedDataFor: 300, // 5 menit
    refetchOnMountOrArgChange: 30, // Hanya refetch jika data > 30 detik
    refetchOnFocus: false, // JANGAN refetch saat focus window
    refetchOnReconnect: false, // JANGAN refetch saat reconnect

    tagTypes: ["EpisodeSeries"],
    endpoints: (builder) => ({
        getEpisodesBySeriesId: builder.query({
            query: ({ seriesId, page = 1, limit = 10, paginate = true }) =>
                `/episodeSeries/series/${seriesId}?page=${page}&limit=${limit}&paginate=${paginate}`,
            providesTags: (result, error, { seriesId }) => [
                { type: "EpisodeSeries", id: seriesId },
                { type: "EpisodeSeries", id: "LIST" },
            ],
        }),

        getEpisodeSeriesById: builder.query({
            query: (id) => `/episodeSeries/${id}`,
            providesTags: (result, error, id) => [{ type: "EpisodeSeries", id }],
        }),

        createEpisodeSeries: builder.mutation({
            query: (formData) => ({
                url: "/episodeSeries",
                method: "POST",
                body: formData,
            }),
            // ✅ HANYA invalidate episode list, JANGAN tag "Series"
            invalidatesTags: (result, error, formData) => {
                const seriesId = formData.get('seriesId');
                return [
                    { type: "EpisodeSeries", id: seriesId },
                    { type: "EpisodeSeries", id: "LIST" },
                ];
            },
        }),

        updateEpisodeSeries: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/episodeSeries/${id}`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "EpisodeSeries", id },
                { type: "EpisodeSeries", id: "LIST" },
            ],
        }),

        deleteEpisodeSeries: builder.mutation({
            query: (id) => ({
                url: `/episodeSeries/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "EpisodeSeries", id },
                { type: "EpisodeSeries", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetEpisodesBySeriesIdQuery,
    useGetEpisodeSeriesByIdQuery,
    useCreateEpisodeSeriesMutation,
    useUpdateEpisodeSeriesMutation,
    useDeleteEpisodeSeriesMutation,
} = episodeSeriesSliceAPI;