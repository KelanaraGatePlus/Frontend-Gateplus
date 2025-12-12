import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const seriesAPI = createApi({
  reducerPath: "seriesAPI",
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
  tagTypes: ['series'], // ⬅️ tambahkan 'series'
  endpoints: (builder) => ({
    getSeries: builder.query({
      queryFn: () => {
        "series";
      },
    }),
    createSeries: builder.mutation({
      query: (formData) => ({
        url: "/series",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["series"],
    }),
    getSeriesById: builder.query({
      query: ({ id, withEpisodes = false }) => `/series/${id}?withEpisodes=${withEpisodes}`,
      providesTags: (result, error, id) => [{ type: 'series', id }],
    }),
    createEpisodeSeries: builder.mutation({
      query: (formData) => ({
        url: "/episodeSeries",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["series"],
    }),
    getSeriesHomeData: builder.query({
      query: (category) => category ? `/series/highlights?category=${category}` : "/series/highlights",
      providesTags: ['series'],
    }),
    getSeriesPerContentAnalytics: builder.query({
      query: (id) => `/series/analytics/${id}`,
      providesTags: ['series'],
    }),
    deleteSeries: builder.mutation({
      query: (id) => ({
        url: `/series/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["series"],
    }),
    editSeries: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/series/${id}`,
        method: "PATCH",
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'series', id }],
    }),
  }),
});

export const { useGetSeriesQuery, useCreateSeriesMutation, useGetSeriesByIdQuery, useCreateEpisodeSeriesMutation,
  useGetSeriesHomeDataQuery, useDeleteSeriesMutation, useEditSeriesMutation, useGetSeriesPerContentAnalyticsQuery
} = seriesAPI;
