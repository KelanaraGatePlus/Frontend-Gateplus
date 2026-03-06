import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const coinPackageAPI = createApi({
    reducerPath: "coinPackageAPI",
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
    tagTypes: ["coinPackageAPI"],
    endpoints: (builder) => ({
        getCoinPackages: builder.query({
            query: () => ({
                url: `/coinPackage`,
                method: "GET",
            }),
            providesTags: ["coinPackageAPI"],
        }),
    }),
});

export const {
    useGetCoinPackagesQuery,
} = coinPackageAPI;;