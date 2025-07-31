import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const contentAPI = createApi({
    reducerPath: "contentApi",
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: fetchBaseQuery({
        baseUrl: BACKEND_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token"); // atau sessionStorage atau cookie
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["ebookContent", "comicContent"],
    endpoints: (builder) => ({
        getEpisodeEbookById: builder.query({
            query: (id) => `/episode/${id}`,
            providesTags: ["ebookContent"],
        }),
        getEpisodeComicsById: builder.query({
            query: (id) => `/episodeComics/${id}`,
            providesTags: ["comicContent"],
        }),
    }),
});

export const {
    useGetEpisodeEbookByIdQuery,
    useGetEpisodeComicsByIdQuery,
} = contentAPI;
