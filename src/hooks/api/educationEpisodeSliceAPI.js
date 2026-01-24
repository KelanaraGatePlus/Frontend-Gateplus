import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const educationEpisodeAPI = createApi({
    reducerPath: "educationEpisodeAPI",
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
    tagTypes: ["educationEpisode"],
    endpoints: (builder) => ({
        createNewEducationEpisode: builder.mutation({
            query: (formData) => ({
                url: "/educationEpisode",
                method: "POST",
                body: formData,
                formData: true,
            }),
            invalidatesTags: ["educationEpisode"],
        }),
        getEducationEpisodeByEducationId: builder.query({
            query: (educationId) => ({
                url: `/educationEpisode/${educationId}`,
                method: "GET",
            }),
            providesTags: ["educationEpisode"],
        }),
        getEducationEpisodeById: builder.query({
            query: (educationEpisodeId) => ({
                url: `/educationEpisode/detail/${educationEpisodeId}`,
                method: "GET",
            }),
            providesTags: ["educationEpisode"],
        }),
        deleteEducationEpisodeById: builder.mutation({
            query: (episodeId) => ({
                url: `/educationEpisode/${episodeId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["educationEpisode"],
        }),
        updateEducationEpisodeById: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/educationEpisode/${id}`,
                method: "PATCH",
                body: formData,
                formData: true,
            }),
            invalidatesTags: ["educationEpisode"],
        }),
    }),
});

export const {
    useCreateNewEducationEpisodeMutation,
    useGetEducationEpisodeByEducationIdQuery,
    useDeleteEducationEpisodeByIdMutation,
    useGetEducationEpisodeByIdQuery,
    useUpdateEducationEpisodeByIdMutation,
} = educationEpisodeAPI;