import React from "react";
import { useGetHighlightQuery } from "@/hooks/api/homeSliceAPI.js";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";

export default function CarouselHighlight() {
        const { data, isLoading } = useGetHighlightQuery();
        const hightlightData = data?.data || [];

    return (
        <CarouselTemplate
            label={"Highlight"}
            contents={hightlightData}
            isLoading={isLoading}
        />
    );
}
