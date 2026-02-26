import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const readProgressAPI = createApi({
  reducerPath: "readProgressAPI",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token"); // bisa juga pakai cookie/sessionStorage
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["readProgress"],
  endpoints: (builder) => ({
    applyReadProgress: builder.mutation({
      query: (body) => ({
        url: "/readProgress",
        method: "POST",
        body,
      }),
      invalidatesTags: ["readProgress"], // optional: biar refresh data terkait log
    }),
  }),
});

export const { useApplyReadProgressMutation } = readProgressAPI;
