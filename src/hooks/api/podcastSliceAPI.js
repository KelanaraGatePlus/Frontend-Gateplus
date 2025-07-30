import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const podcastApi = createApi({
    reducerPath: "podcastApi",
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
    tagTypes: ["podcast"],
    endpoints: (builder) => ({
        getPodcast: builder.query({
            query: () => "/podcast",
            providesTags: ["podcast"],
            keepUnusedDataFor: 3600,
        }),
        getPodcastById: builder.query({
            query: ({ id, userId }) => `/podcast/${id}?userId=${userId}`,
            providesTags: ["podcast"],
            keepUnusedDataFor: 3600,
        }),
        createPodcast: builder.mutation({
            query: (formData) => ({
                url: "/podcast",
                method: "POST",
                body: formData,
                formData: true,
            }),
            invalidatesTags: ["podcast"],
        })
    }),
});

export const {
    useGetPodcastQuery,
    useGetPodcastByIdQuery,
    useCreatePodcastMutation,
} = podcastApi;
