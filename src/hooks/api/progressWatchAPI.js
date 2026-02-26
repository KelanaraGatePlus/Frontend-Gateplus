import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const progressWatchAPI = createApi({
  reducerPath: "progressWatchAPI",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["progressWatchAPI"],
  endpoints: (builder) => ({
    createProgressWatch: builder.mutation({
      query: (payload) => ({
        url: "watchProgress",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["progressWatchAPI"],
    }),

    getProgressWatch: builder.query({
      query: ({ contentId, contentType }) => ({
        url: "watchProgress",
        method: "GET",
        params: {
          contentId,
          contentType,
        },
      }),
      providesTags: ["progressWatchAPI"],
    }),
  }),
});

export const { useCreateProgressWatchMutation, useGetProgressWatchQuery } =
  progressWatchAPI;
