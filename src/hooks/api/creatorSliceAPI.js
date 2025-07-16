import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const url = "http://localhost:3000/creator";

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
            query: ({ creatorId, userId }) => `/${creatorId}?userId=${userId}`,
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