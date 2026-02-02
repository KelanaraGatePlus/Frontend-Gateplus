import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const quizAPI = createApi({
    reducerPath: "quizAPI",
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
    tagTypes: ["quiz"],
    endpoints: (builder) => ({
        getQuizById: builder.query({
            query: (id) => ({
                url: `/quiz/${id}`,
                method: "GET",
            }),
            providesTags: ["quiz"],
        }),
        postQuizAttempt: builder.mutation({
            query: ({ id, body }) => ({
                url: `/quiz/${id}/submit`,
                body,
                method: "POST",
            }),
            invalidatesTags: ["quiz"],
        }),
    }),
});

export const {
    useGetQuizByIdQuery,
    usePostQuizAttemptMutation,
} = quizAPI;