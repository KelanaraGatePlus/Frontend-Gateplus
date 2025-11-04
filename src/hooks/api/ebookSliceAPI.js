import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const ebookApi = createApi({
  reducerPath: "ebookApi",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token"); // atau sessionStorage atau cookie
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["ebook"],
  endpoints: (builder) => ({
    getEbook: builder.query({
      query: () => "/ebooks",
      providesTags: ["ebook"],
      keepUnusedDataFor: 5,
    }),
    getEbookById: builder.query({
      query: ({ id, withEpisodes = false }) => `/ebooks/${id}?withEpisodes=${withEpisodes}`,
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
      query: (category) => category ? `/ebooks/highlights?category=${category}` : "/ebooks/highlights",
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
