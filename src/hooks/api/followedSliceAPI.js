import { BACKEND_URL } from "@/lib/constants/backendUrl";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const followedEpisodeSliceAPI = createApi({
  reducerPath: "followedEpisodeSliceAPI",
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
  keepUnusedDataFor: 30,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  tagTypes: ["FollowedEpisode", "FollowedContent"],

  endpoints: (builder) => ({
    getFollowedEpisodes: builder.query({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/subscribers/followed-episodes?page=${page}&limit=${limit}`,
      providesTags: ["FollowedEpisode"],
      transformResponse: (response) => response.data ?? [],
    }),
    getFollowedLatestContent: builder.query({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/subscribers/followed-latest-content?page=${page}&limit=${limit}`,
      providesTags: ["FollowedContent"],
      transformResponse: (response) => response.data ?? [],
    }),
  }),
});

export const { useGetFollowedEpisodesQuery, useGetFollowedLatestContentQuery } =
  followedEpisodeSliceAPI;
