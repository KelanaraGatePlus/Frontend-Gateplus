import React from "react";
import { useGetMostViewedContentQuery } from "@/hooks/api/creatorSliceAPI";
import PropTypes from "prop-types";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";
import { useState, useEffect, useCallback } from "react";
import getMinAge from "@/lib/helper/minAge";
import useSyncUserData from "@/hooks/api/useSyncUserData";

export default function CreatorMostViewedContent({ creatorId }) {
  const skip = !creatorId;
  const { data, isLoading } = useGetMostViewedContentQuery(creatorId, { skip });
  const mostViewedContent = data?.data?.data || [];
  const [isReady, setIsReady] = useState(false);
  const [userId, setUserId] = useState(null);

  //ambil user id
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("users_id");
      setUserId(storedUserId);
      setIsReady(true);
    }
  }, []);

  const { userAge, isReady: isUserReady } = useSyncUserData();

  const isBlurred = useCallback(
    (content) => {
      if (!isUserReady) return true;

      const minAge = getMinAge(content?.ageRestriction);
      if (minAge === null) return false;

      if (userAge == null) return true;

      return userAge < minAge;
    },
    [userAge, isUserReady],
  );

  return (
    <CarouselTemplate
      label={"Banyak Dilihat"}
      contents={mostViewedContent}
      isLoading={isLoading}
      isTopTen={true}
      isOnCreatorProfile={true}
      isBlurred={isBlurred}
    />
  );
}

CreatorMostViewedContent.propTypes = {
  creatorId: PropTypes.string.isRequired,
};
