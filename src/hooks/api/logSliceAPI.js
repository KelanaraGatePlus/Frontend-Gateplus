import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const logApi = createApi({
    reducerPath: "logApi",
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: fetchBaseQuery({
        baseUrl: BACKEND_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token"); // bisa juga pakai cookie/sessionStorage
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["ebookContent", "comicContent", "seriesContent", "logContent"],
    endpoints: (builder) => ({
        createLog: builder.mutation({
            query: (body) => ({
                url: "/logs",
                method: "POST",
                body,
            }),
            invalidatesTags: ["logContent"], // optional: biar refresh data terkait log
        }),
    }),
});

export const {
    useCreateLogMutation,
} = logApi;
