import React from "react";
import { useGetPopularComicsQuery } from "@/hooks/api/homeSliceAPI.js";
import CarouselTemplate from "../carouselTemplate";

export default function CarouselPopularEbooks() {
    const { data, isLoading } = useGetPopularComicsQuery();
    const popularComics = data?.data || [];

    return (
        <CarouselTemplate
            label={"Popular Comics"}
            contents={popularComics}
            isLoading={isLoading}
            type="ebook"
        />
    );

}