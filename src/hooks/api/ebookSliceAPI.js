import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const ebookApi = createApi({
  reducerPath: "ebookApi",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URL,
  }),
  tagTypes: ["ebook"],
  endpoints: (builder) => ({
    getEbook: builder.query({
      query: () => "/ebooks",
      providesTags: ["ebook"],
      keepUnusedDataFor: 5,
    }),
    getEbookById: builder.query({
      query: ({ id, userId }) => `/ebooks/${id}?userId=${userId}`,
      providesTags: ["ebook"],
    }),
    getEpisodeEbookById: builder.query({
      query: (id) => `/episode/${id}`,
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
    createEpisode: builder.mutation({
      query: (formData) => ({
        url: "/episode",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["ebook"],
    }),
    getEbooksHomeData: builder.query({
      query: () => `/ebooks/highlights`,
      providesTags: ["ebook"],
    }),
  }),
});

export const {
  useGetEbookQuery,
  useGetEbookByIdQuery,
  useGetEpisodeEbookByIdQuery,
  useCreateEbookMutation,
  useCreateEpisodeMutation,
  useGetEbooksHomeDataQuery,
} = ebookApi;
