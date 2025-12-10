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
            query: ({ id, withEpisodes = false }) => `/comics/${id}?withEpisodes=${withEpisodes}`,
            providesTags: ["comic"],
            keepUnusedDataFor: 3600,
        }),
        createComic: builder.mutation({
            query: (formData) => ({
                url: "/comics",
                method: "POST",
                body: formData,
                formData: true,
            }),
            invalidatesTags: ["comic"],
        }),
        createEpisode: builder.mutation({
            query: (formData) => ({
                url: "/episodeComics",
                method: "POST",
                body: formData,
                formData: true,
            }),
            invalidatesTags: ["comic"],
        }),
        getComicsHomeData: builder.query({
            query: (category) => category ? `/comics/highlights?category=${category}` : `/comics/highlights`,
            providesTags: ["comic"],
        }),
        deleteComic: builder.mutation({
            query: (id) => ({
                url: `/comics/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["comic"],
        }),
    }),
});

export const {
    useGetComicQuery,
    useGetComicByIdQuery,
    useCreateComicMutation,
    useCreateEpisodeMutation,
    useGetComicsHomeDataQuery,
    useDeleteComicMutation,
} = comicApi;
