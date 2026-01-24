import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const educationCategoryAPI = createApi({
    reducerPath: "educationCategoryAPI",
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
    tagTypes: ["bankAccount"],
    endpoints: (builder) => ({
        getAllEducationCategories: builder.query({
            query: () => ({
                url: "/educationCategory",
                method: "GET",
            }),
            providesTags: ["bankAccount"],
        }),
    }),
});

export const {
    useGetAllEducationCategoriesQuery,
} = educationCategoryAPI;