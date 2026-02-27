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
                // Buat URLSearchParams untuk handle array
                const params = new URLSearchParams();

                // Tambahkan query search
                if (rawParams.q) {
                    params.append('q', rawParams.q);
                }

                // Tambahkan category (bisa multiple)
                if (rawParams.category) {
                    if (Array.isArray(rawParams.category)) {
                        const categoryString = rawParams.category.filter(c => c).join(',');
                        if (categoryString) {
                            params.append('category', categoryString);
                        }
                    } else if (rawParams.category) {
                        params.append('category', rawParams.category);
                    }
                }

                // Tambahkan genre (bisa multiple)
                if (rawParams.genre) {
                    if (Array.isArray(rawParams.genre)) {
                        const genreString = rawParams.genre.filter(g => g).join(',');
                        if (genreString) {
                            params.append('genre', genreString);
                        }
                    } else if (rawParams.genre) {
                        params.append('genre', rawParams.genre);
                    }
                }

                // Tambahkan relevance (bisa multiple)
                if (rawParams.relevance) {
                    if (Array.isArray(rawParams.relevance)) {
                        const relevanceString = rawParams.relevance.filter(r => r).join(',');
                        if (relevanceString) {
                            params.append('relevance', relevanceString);
                        }
                    } else if (rawParams.relevance) {
                        params.append('relevance', rawParams.relevance);
                    }
                }

                return {
                    url: `search?${params.toString()}`,
                    method: "GET",
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

        getSearchSuggestions: builder.query({
            query: (query) => ({
                url: `search/suggestions?q=${encodeURIComponent(query)}`,
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
    useGetSearchSuggestionsQuery,
} = searchAPI;