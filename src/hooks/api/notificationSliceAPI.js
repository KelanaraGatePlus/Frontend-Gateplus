import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const notificationAPI = createApi({
    reducerPath: "notificationAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: BACKEND_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['notification'], // ⬅️ tambahkan 'notification'
    endpoints: (builder) => ({
        getAllNotifications: builder.query({
            query: () => "/notifications",
            providesTags: ['notification'],
        }),
    }),
});

export const { useGetAllNotificationsQuery } = notificationAPI;