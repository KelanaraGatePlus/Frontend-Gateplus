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
    }),
});

export const {
    useCreateNewEducationMutation,
    useGetEducationByCreatorIdQuery,
    useGetEducationByIdQuery,
    usePublishEducationByIdMutation,
    useUpdateEducationByIdMutation
} = educationAPI;