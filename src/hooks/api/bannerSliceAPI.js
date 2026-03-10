import { BACKEND_URL } from "@/lib/constants/backendUrl";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bannerSliceAPI = createApi({
  reducerPath: "bannerSliceAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URL,
  }),
  tagTypes: ["Banner"],
  endpoints: (builder) => ({
    getHomeBanners: builder.query({
      query: () => "/api/banners/home",
      providesTags: ["Banner"],
    }),
  }),
});

export const { useGetHomeBannersQuery } = bannerSliceAPI;
