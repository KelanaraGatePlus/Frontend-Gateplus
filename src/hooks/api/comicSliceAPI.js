import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const comicApi = createApi({
    reducerPath: "comicApi",
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
    tagTypes: ["comic"],
    endpoints: (builder) => ({
        getComic: builder.query({
            query: () => "/comics",
            providesTags: ["comic"],
            keepUnusedDataFor: 3600,
        }),
        getComicById: builder.query({
            query: ({ id, userId }) => `/comics/${id}?userId=${userId}`,
            providesTags: ["comic"],
            keepUnusedDataFor: 3600,
        }),
    }),
});

export const {
    useGetComicQuery,
    useGetComicByIdQuery,
} = comicApi;
