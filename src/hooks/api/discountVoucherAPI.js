import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const discountVoucherAPI = createApi({
    reducerPath: "discountVoucherAPI",
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
    tagTypes: ["discountVoucher"],
    endpoints: (builder) => ({
        getDiscountByVoucherDiscountCode: builder.mutation({
            query: ({ code, amount, contentType = null, contentId = null }) => ({
                url: `/discountVoucher/count-discount/${code}/${amount}${contentType ? `?contentType=${contentType}` : ''}${contentId ? `&contentId=${contentId}` : ''}`,
                method: "GET",
            }),
            invalidatesTags: ["discountVoucher"],
        }),
    }),
});

export const {
    useGetDiscountByVoucherDiscountCodeMutation,
} = discountVoucherAPI;
