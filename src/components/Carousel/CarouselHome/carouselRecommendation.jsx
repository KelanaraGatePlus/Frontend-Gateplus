import React from "react";
import { useGetRecommendationsQuery } from "@/hooks/api/homeSliceAPI.js";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";

export default function CarouselRecommendations() {
    const { data, isLoading } = useGetRecommendationsQuery();
    const recommendationsData = data?.data?.data || [];

    return (
        <CarouselTemplate
            label={"Recommendations For You"}
            contents={recommendationsData}
            isLoading={isLoading}
        />
    );
}
