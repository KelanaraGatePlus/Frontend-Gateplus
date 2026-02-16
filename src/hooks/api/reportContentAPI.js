import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const reportContentAPI = createApi({
    reducerPath: "reportContentAPI",
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
    tagTypes: ["reportContentAPI"],
    endpoints: (builder) => ({
        createReportContent: builder.mutation({
            query: (payload) => ({
                url: "/api/report-content", // ✅ UBAH INI (dari "reportContent")
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["reportContentAPI"],
        }),
    }),
});

export const {
    useCreateReportContentMutation,
} = reportContentAPI;