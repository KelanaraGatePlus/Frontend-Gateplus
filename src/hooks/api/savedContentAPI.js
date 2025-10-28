import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const savedContentAPI = createApi({
    reducerPath: "savedContentAPI",
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
    tagTypes: ["savedContentAPI"],
    endpoints: (builder) => ({
        deleteSavedContent: builder.mutation({
            query: (id) => ({
                url: `/save/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["savedContentAPI"],
        }),
        createSavedContent: builder.mutation({
            query: (payload) => ({
                url: "/save/",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["savedContentAPI"],
        }),
    }),
});

// ✅ export hook yang benar
export const { useDeleteSavedContentMutation, useCreateSavedContentMutation } = savedContentAPI;
