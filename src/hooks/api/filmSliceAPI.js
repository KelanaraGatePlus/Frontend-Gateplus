import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const filmAPI = createApi({
  reducerPath: "filmAPI",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({ baseUrl: BACKEND_URL }),
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
  }),
});

export const { useGetFilmQuery, useCreateFilmMutation } = filmAPI;
