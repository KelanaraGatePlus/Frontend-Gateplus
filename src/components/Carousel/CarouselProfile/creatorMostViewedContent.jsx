import React from "react";
import { useGetMostViewedContentQuery } from "@/hooks/api/creatorSliceAPI";
import PropTypes from "prop-types";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";

export default function CreatorMostViewedContent({ creatorId }) {
    const skip = !creatorId;
    const { data, isLoading } = useGetMostViewedContentQuery(creatorId, { skip });
    const mostViewedContent = data?.data?.data || [];

    return (
        <CarouselTemplate
            label={"Banyak Dilihat"}
            contents={mostViewedContent}
            isLoading={isLoading}
            isTopTen = {true}
            isOnCreatorProfile = {true}
        />
    );
}

CreatorMostViewedContent.propTypes = {
    creatorId: PropTypes.string.isRequired,
};
