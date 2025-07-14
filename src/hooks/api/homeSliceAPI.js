import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const url = "https://backend-gateplus-api.my.id";

export const homeAPI = createApi({
    reducerPath: "homeAPI",
    baseQuery: fetchBaseQuery({ baseUrl: url }),
    endpoints: (builder) => ({
        getNewest: builder.query({
            query: () => "/home/newest",
        }),
        getHighlight: builder.query({
            query: () => "/home/highlights",
        }),
        getTopTen: builder.query({
            query: () => "/home/top-10",
        }),
    }),
})

export const {
    useGetNewestQuery,
    useGetHighlightQuery,
    useGetTopTenQuery
} = homeAPI;