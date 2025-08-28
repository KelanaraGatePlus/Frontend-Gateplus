import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const creatorAPI = createApi({
    reducerPath: "creatorsAPI",
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: fetchBaseQuery({
        baseUrl: `${BACKEND_URL}/creator`,
        prepareHeaders: (headers) => {
            const creators_id = localStorage.getItem("creators_id"); // atau sessionStorage atau cookie
            if (creators_id) {
                headers.set("Authorization", `Bearer ${creators_id}`);
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
    }),
})

export const {
    useGetMostViewedContentQuery,
    useGetNewestContentQuery,
    useGetCreatorDetailQuery,
    useRegisterCreatorMutation,
    useCheckCreatorAvailabilityQuery,
    useSearchCreatorQuery,
    useGetDashboardDataQuery
} = creatorAPI;