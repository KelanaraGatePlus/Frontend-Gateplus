import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const categoryAPI = createApi({
    reducerPath: "categoryApi",
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: fetchBaseQuery({
        baseUrl: BACKEND_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token"); // atau sessionStorage atau cookie
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["categoryContent"],
    endpoints: (builder) => ({
        getAllCategories: builder.query({
            query: () => `/category`,
            providesTags: ["categoryContent"],
        }),
    }),
});

export const {
    useGetAllCategoriesQuery,
} = categoryAPI;
