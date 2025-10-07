import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const creatorAPI = createApi({
    reducerPath: "creatorsAPI",
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: fetchBaseQuery({
        baseUrl: `${BACKEND_URL}/creator`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token"); // atau sessionStorage atau cookie
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["creatorsAPI"],
    endpoints: (builder) => ({
        getMostViewedContent: builder.query({
            query: (id) => `/${id}/most-viewed`,
            providesTags: ["creatorsAPI"],
            keepUnusedDataFor: 60,
        }),
        getNewestContent: builder.query({
            query: (id) => `/${id}/newest`,
            providesTags: ["creatorsAPI"],
            keepUnusedDataFor: 60,
        }),
        getCreatorDetail: builder.query({
            query: ({ id, userId }) => `/${id}?userId=${userId}`,
            providesTags: ["creatorsAPI"],
            keepUnusedDataFor: 60,
        }),
        registerCreator: builder.mutation({
            query: (payload) => ({
                url: `/`,
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["creatorsAPI"],
        }),
        updateCreator: builder.mutation({
            query: (payload) => ({
                url: `/`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["creatorsAPI"],
        }),
        checkCreatorAvailability: builder.query({
            query: ({ type, value }) => `/check?type=${type}&value=${value}`,
            keepUnusedDataFor: 0,
        }),
        searchCreator: builder.query({
            query: (q) => `/search?q=${q}`,
            providesTags: ["creatorsAPI"],
            keepUnusedDataFor: 30,
        }),
        getDashboardData: builder.query({
            query: () => ({
                url: `/creator-dashboard`,
                method: "GET",
            }),
            providesTags: ["creatorsAPI"],
            keepUnusedDataFor: 60,
        }),
        getCreatorEarned: builder.query({
            query: () => ({
                url: `/earned`,
                method: "GET",
            }),
            providesTags: ["creatorsAPI"],
            keepUnusedDataFor: 300,
        }),

    }),
})

export const {
    useGetMostViewedContentQuery,
    useGetNewestContentQuery,
    useGetCreatorDetailQuery,
    useRegisterCreatorMutation,
    useCheckCreatorAvailabilityQuery,
    useSearchCreatorQuery,
    useGetDashboardDataQuery,
    useUpdateCreatorMutation,
    useGetCreatorEarnedQuery,
} = creatorAPI;