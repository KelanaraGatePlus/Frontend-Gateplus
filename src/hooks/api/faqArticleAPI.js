import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const faqArticleAPI = createApi({
    reducerPath: "faqArticle",
    refetchOnFocus: true,
    refetchOnReconnect: true,
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
    tagTypes: ["faqArticle"],
    endpoints: (builder) => ({
        getAllFaqArticles: builder.query({
            query: () => "/faqArticles",
            providesTags: ["faqArticle"],
            keepUnusedDataFor: 600,
        }),
        getFaqArticlesById: builder.query({
            query: (id) => "/faqArticles/" + id,
            providesTags: ["faqArticle"],
            keepUnusedDataFor: 600,
        }),
        getFaqArticlesByCategory: builder.query({
            query: ({ category, id }) => `/faqArticles/category/${category}?excludeId=${id}`,
            providesTags: ["faqArticle"],
            keepUnusedDataFor: 600,
        }),
    }),
})

export const {
    useGetAllFaqArticlesQuery,
    useGetFaqArticlesByIdQuery,
    useGetFaqArticlesByCategoryQuery,
} = faqArticleAPI;