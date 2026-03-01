import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const educationAPI = createApi({
    reducerPath: "educationAPI",
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
    tagTypes: ["education"],
    endpoints: (builder) => ({
        createNewEducation: builder.mutation({
            query: (formData) => ({
                url: "/education",
                method: "POST",
                body: formData,
                formData: true,
            }),
            invalidatesTags: ["education"],
        }),
        getEducationByCreatorId: builder.query({
            query: () => ({
                url: `/education/creator`,
                method: "GET",
            }),
            providesTags: ["education"],
        }),
        getEducationById: builder.query({
            query: (id) => ({
                url: `/education/${id}`,
                method: "GET",
            }),
            providesTags: ["education"],
        }),
        publishEducationById: builder.mutation({
            query: (body) => ({
                url: `/education/publish`,
                body,
                method: "PATCH",
            }),
            invalidatesTags: ["education"],
        }),
        updateEducationById: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/education/${id}`,
                method: "PATCH",
                body: formData,
                formData: true,
            }),
            invalidatesTags: ["education"],
        }),
        getEducationHomeData: builder.query({
            query: () => ({
                url: `/education/home`,
                method: "GET",
            }),
            providesTags: ["education"],
        }),
        getEducationProgressById: builder.query({
            query: (id) => ({
                url: `/education/progress/${id}`,
                method: "GET",
            }),
            providesTags: ["education"],
        }),
        generateEducationCertificate: builder.mutation({
            query: (body) => ({
                url: `education/generate-certificate`,
                method: "POST",
                body: body,
            }),
        }),
        getRecomendationEducation: builder.query({
            query: (categoriesId) => ({
                url: `/education/recommendation/${categoriesId}`,
                method: "GET",
            }),
            providesTags: ["education"],
        }),
        getEducationBySearch: builder.query({
            query: (searchParams) => ({
                url: `/education/search?query=${searchParams}`,
                method: "GET",
            }),
            providesTags: ["education"],
        }),
        getEducationBySlug: builder.query({
            query: (slug) => ({
                url: `/education/slug/${slug}/id`,
                method: "GET",
            }),
            providesTags: ["education"],
        }),
    }),
});

export const {
    useCreateNewEducationMutation,
    useGetEducationByCreatorIdQuery,
    useGetEducationByIdQuery,
    usePublishEducationByIdMutation,
    useUpdateEducationByIdMutation,
    useGetEducationHomeDataQuery,
    useGetEducationProgressByIdQuery,
    useGenerateEducationCertificateMutation,
    useGetRecomendationEducationQuery,
    useGetEducationBySearchQuery,
    useGetEducationBySlugQuery,
} = educationAPI;