import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const genreAPI = createApi({
    reducerPath: "genreAPI",
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
    tagTypes: ["genreAPI"],
    endpoints: (builder) => ({
        getAllGenres: builder.query({
            query: () => "/category",
            providesTags: ["genreAPI"],
            keepUnusedDataFor: 600,
        }),
    }),
})

export const {
    useGetAllGenresQuery,
} = genreAPI;