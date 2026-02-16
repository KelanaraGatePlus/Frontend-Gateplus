import { BACKEND_URL } from "@/lib/constants/backendUrl";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reportCommentAPI = createApi({
    reducerPath: "reportCommentAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BACKEND_URL}/api/report-comment`,
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