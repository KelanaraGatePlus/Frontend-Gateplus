import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const url = "http://localhost:3000";

export const ebookApi = createApi({
  reducerPath: "ebookApi",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: url,
  }),
  tagTypes: ["ebook"],
  endpoints: (builder) => ({
    getEbook: builder.query({
      query: () => "/ebooks",
      providesTags: ["ebook"],
      keepUnusedDataFor: 5,
    }),
    getEbookById: builder.query({
      query: (id) => `/ebooks/${id}`,
      providesTags: ["ebook"],
    }),
    createEbook: builder.mutation({
      query: (formData) => ({
        url: "/ebooks",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["ebook"],
    }),
  }),
});

export const {
  useGetEbookQuery,
  useGetEbookByIdQuery,
  useCreateEbookMutation,
} = ebookApi;
