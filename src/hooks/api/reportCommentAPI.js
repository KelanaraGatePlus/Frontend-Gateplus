import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const reportCommentAPI = createApi({
    reducerPath: "reportCommentAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}/api/report-comment`,
        prepareHeaders: (headers) => {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem("token");
                if (token) {
                    headers.set("Authorization", `Bearer ${token}`);
                }
            }
            return headers;
        },
    }),
    tagTypes: ["ReportComment"],
    endpoints: (builder) => ({
        createCommentReport: builder.mutation({
            query: (formData) => ({
                url: "",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["ReportComment"],
        }),
    }),
});

export const { useCreateCommentReportMutation } = reportCommentAPI;