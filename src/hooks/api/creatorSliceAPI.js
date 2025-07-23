import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const creatorAPI = createApi({
    reducerPath: "creatorsAPI",
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: fetchBaseQuery({ baseUrl: `${BACKEND_URL}/creator` }),
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