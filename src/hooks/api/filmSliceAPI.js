import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const filmAPI = createApi({
  reducerPath: "filmAPI",
  baseQuery: fetchBaseQuery({ baseUrl: BACKEND_URL }),
  endpoints: (builder) => ({
    getFilm: builder.query({
      queryFn: () => {
        "films";
      },
    }),
  }),
});

export const { useGetFilmQuery } = filmAPI;
