import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const url = "https://backend-gateplus-api.my.id/creator";

export const creatorAPI = createApi({
    reducerPath: "creatorsAPI",
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: fetchBaseQuery({ baseUrl: url }),
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
    }),
})

export const {
    useGetMostViewedContentQuery,
    useGetNewestContentQuery,
    useGetCreatorDetailQuery,
} = creatorAPI;