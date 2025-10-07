import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const searchAPI = createApi({
    reducerPath: "searchAPI",
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
    tagTypes: ["searchAPI"],
    endpoints: (builder) => ({
        getSearchResults: builder.mutation({
            query: (rawParams) => {
                // ✅ Tentukan hanya param yang boleh dikirim
                const allowedKeys = ["q", "category", "genre", "relevance"];

                // ✅ Filter object rawParams berdasarkan allowedKeys
                const filteredParams = Object.keys(rawParams)
                    .filter(key => allowedKeys.includes(key))
                    .reduce((obj, key) => {
                        obj[key] = rawParams[key];
                        return obj;
                    }, {});

                return {
                    url: "search",
                    method: "GET",
                    params: filteredParams,
                };
            },
            invalidatesTags: ["searchAPI"],
        }),


        getSearchHistoryByUser: builder.query({
            query: () => ({
                url: "search/history",
                method: "GET",
            }),
            providesTags: ["searchAPI"],
        }),
        getPopularSearches: builder.query({
            query: () => ({
                url: "search/popular",
                method: "GET",
            }),
            providesTags: ["searchAPI"],
        }),
    }),
});

export const {
    useGetSearchResultsMutation,
    useGetSearchHistoryByUserQuery,
    useGetPopularSearchesQuery,
} = searchAPI;
