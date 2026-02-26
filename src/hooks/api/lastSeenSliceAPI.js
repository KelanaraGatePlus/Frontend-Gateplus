import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const lastSeenSliceAPI = createApi({
  reducerPath: "lastSeenApi",

  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URL,

    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token"); // token login
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    addLastSeen: builder.mutation({
      query: (body) => ({
        url: "/api/last-seen",
        method: "POST",
        body,
      }),
    }),

    getLastSeen: builder.query({
      query: () => ({
        url: "/api/last-seen",
        method: "GET",
      }),
    }),
  }),
});

export const { useAddLastSeenMutation, useGetLastSeenQuery } = lastSeenSliceAPI;
