/* eslint-disable no-undef */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const url = process.env.SERVER_BACKEND;

export const ebookApi = createApi({
  reducerPath: "ebookApi",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: url,
  }),
  endpoints: (builder) => ({
    getEbook: builder.query({
      query: () => "/ebooks",
      providesTags: "ebook",
      keepUnusedDataFor: 5,
    }),
    getEbookById: builder.query({
      query: (id) => `/ebooks/${id}`,
    }),
  }),
});

export const { useGetEbookQuery, useGetEbookByIdQuery } = ebookApi;
