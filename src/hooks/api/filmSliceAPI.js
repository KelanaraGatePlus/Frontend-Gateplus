/* eslint-disable no-undef */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const url = process.env.SERVER_BACKEND;

export const filmAPI = createApi({
  reducerPath: "filmAPI",
  baseQuery: fetchBaseQuery({ baseUrl: url }),
  endpoints: (builder) => ({
    getFilm: builder.query({
      queryFn: () => {
        "films";
      },
    }),
  }),
});

export const { useGetFilmQuery } = filmAPI;
