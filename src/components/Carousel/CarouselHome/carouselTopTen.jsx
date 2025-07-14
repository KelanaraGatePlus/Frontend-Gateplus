import React from "react";
import { useGetTopTenQuery } from "@/hooks/api/homeSliceAPI.js";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";

export default function CarouselTopTen() {
            const { data, isLoading } = useGetTopTenQuery();
            const topTenData = data?.data?.data || [];

    return (
        <CarouselTemplate
            label={"Top 10 GATE"}
            contents={topTenData}
            isLoading={isLoading}
            isTopTen={true}
        />
    );
}
