import React from "react";
import { useGetPopularPodcastsQuery } from "@/hooks/api/homeSliceAPI.js";
import CarouselTemplate from "../carouselTemplate";

export default function CarouselPopularEbooks() {
    const { data, isLoading } = useGetPopularPodcastsQuery();
    const popularPodcasts = data?.data || [];

    return (
        <CarouselTemplate
            label={"Popular Podcasts"}
            contents={popularPodcasts}
            isLoading={isLoading}
            type="podcast"
            withGradient={false}
        />
    );

}