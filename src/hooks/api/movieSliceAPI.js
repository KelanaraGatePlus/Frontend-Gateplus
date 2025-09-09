import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const movieAPI = createApi({
  reducerPath: "movieAPI",
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
  tagTypes: ['movie'], // ⬅️ tambahkan 'movie'
  endpoints: (builder) => ({
    getMovie: builder.query({
      queryFn: () => {
        "movies";
      },
    }),
    createMovie: builder.mutation({
      query: (formData) => ({
        url: "/movies",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["movie"],
    }),
    getMovieById: builder.query({
      query: (id) => `/movies/${id}`,
      providesTags: (result, error, id) => [{ type: 'movie', id }],
    }),
    getMoviesHomeData: builder.query({
      query: () => "/movies/highlights",
      providesTags: ['movie'],
    }),
  }),
});

export const { useGetMovieQuery, useCreateMovieMutation, useGetMovieByIdQuery, useGetMoviesHomeDataQuery } = movieAPI;
