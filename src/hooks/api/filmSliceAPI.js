import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const filmAPI = createApi({
  reducerPath: "filmAPI",
  refetchOnFocus: true,
  refetchOnReconnect: true,
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
  tagTypes: ['film'], // ⬅️ tambahkan 'film'
  endpoints: (builder) => ({
    getFilm: builder.query({
      queryFn: () => {
        "films";
      },
    }),
    createFilm: builder.mutation({
      query: (formData) => ({
        url: "/films",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["film"],
    }),
    getFilmById: builder.query({
      query: (id) => `/films/${id}`,
      providesTags: (result, error, id) => [{ type: 'film', id }],
    }),
  }),
});

export const { useGetFilmQuery, useCreateFilmMutation, useGetFilmByIdQuery } = filmAPI;
