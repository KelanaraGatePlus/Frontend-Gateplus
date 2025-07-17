import React from "react";
import { useGetPopularEbooksQuery } from "@/hooks/api/homeSliceAPI.js";
import CarouselTemplate from "../carouselTemplate";

export default function CarouselPopularEbooks() {
    const { data, isLoading } = useGetPopularEbooksQuery();
    const popularEbooks = data?.data?.data || [];

    return (
        <CarouselTemplate
            label={"Popular Ebooks"}
            contents={popularEbooks}
            isLoading={isLoading}
            type="ebook"
        />
    );

}