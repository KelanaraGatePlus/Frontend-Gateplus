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
      query: (id) => `/series/${id}`,
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
  }),
});

export const { useGetSeriesQuery, useCreateSeriesMutation, useGetSeriesByIdQuery, useCreateEpisodeSeriesMutation } = seriesAPI;
