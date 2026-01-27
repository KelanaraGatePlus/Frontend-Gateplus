import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const certificateEducation = createApi({
    reducerPath: "certificateEducation",
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
    tagTypes: ["certificateEducation"],
    endpoints: (builder) => ({
        getEducationCertificateById: builder.query({
            query: (id) => ({
                url: `/certificateEducation/${id}`,
                method: "GET",
            }),
            providesTags: ["certificateEducation"],
        }),
    }),
});

export const {
    useGetEducationCertificateByIdQuery,
} = certificateEducation;