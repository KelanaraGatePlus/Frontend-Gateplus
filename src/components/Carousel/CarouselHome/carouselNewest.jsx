import React from "react";
import { useGetNewestQuery } from "@/hooks/api/homeSliceAPI.js";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";

export default function CarouselNewest() {
    const { data, isLoading } = useGetNewestQuery();
    const newestData = data?.data?.data || [];

    return (
        <CarouselTemplate
            label={"Newest"}
            contents={newestData}
            isLoading={isLoading}
        />
    );
}
