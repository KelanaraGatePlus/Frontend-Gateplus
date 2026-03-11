"use client";
import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";

/* --- API HOOKS --- */
import { useGetComicByIdQuery } from "@/hooks/api/comicSliceAPI";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";
import { useAddLastSeenMutation } from "@/hooks/api/lastSeenSliceAPI"; // <-- baru
import useSyncUserData from "@/hooks/api/useSyncUserData";

/* --- UI COMPONENTS --- */
import MainTemplateLayout from "@/components/MainDetailProduct/page";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import CompleteProfileModal from "@/components/Modal/CompleteProfileModal";
import UnderAgeModal from "@/components/Modal/UnderAgeModal";

/* --- HELPERS --- */
import getMinAge from "@/lib/helper/minAge";

export default function DetailComicPage({ params }) {
  const { id } = params;

  const [loading, setLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false); // 🔥 hydration guard

  const [createLog] = useCreateLogMutation();
  const [addLastSeen] = useAddLastSeenMutation(); // <-- baru

  const { data, isLoading } = useGetComicByIdQuery(
    { id },
    { skip: !id || !isHydrated },
  );

  const comicData = data?.data || {};

  const {
    userAge,
    isReady,
    showCompleteProfileModal,
    showUnderAgeModal,
    goToProfile,
    continueDespiteUnderAge,
  } = useSyncUserData(comicData?.ageRestriction || null);

  const episode_comics = (comicData?.episode_comics?.episodes || [])
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const topContent = data?.topContent || [];
  const recommendedContent = data?.recommendation || [];

  useEffect(() => {
    if (id && isHydrated) {
      // log klik
      createLog({
        contentType: "COMIC",
        logType: "CLICK",
        contentId: id,
      });

      // simpan ke DB lastSeen
      addLastSeen({
        contentType: "COMIC",
        contentId: id,
      });
    }
  }, [id, isHydrated, createLog, addLastSeen]);

  const isBlurred = useCallback(
    (content) => {
      if (!isReady) return true;
      const minAge = getMinAge(content?.ageRestriction);
      if (minAge === null) return false;
      if (userAge == null) return true;
      return userAge < minAge;
    },
    [userAge, isReady],
  );

  const handleBuy = async (episodeId) => {
    setLoading(true);
    window.location.href = `/checkout/purchase/comics/${id}/${episodeId}`;
  };

  useEffect(() => {
    setIsHydrated(true); 
  }, []);

  if (!isHydrated || isLoading || !data || !isReady) {
    return <LoadingOverlay />;
  }

  return (
    <div>
      <MainTemplateLayout
        productType="comic"
        productDetail={comicData}
        productEpisode={episode_comics}
        isLoading={isLoading}
        handlePayment={handleBuy}
        topContentData={topContent}
        recomendationData={recommendedContent}
        isBlurred={isBlurred}
      />

      {loading && <LoadingOverlay />}

      {comicData?.id && (
        <>
          {showCompleteProfileModal && (
            <CompleteProfileModal
              onConfirm={goToProfile}
              title={comicData?.title}
              minAge={getMinAge(comicData?.ageRestriction)}
            />
          )}

          {showUnderAgeModal && (
            <UnderAgeModal
              open={showUnderAgeModal}
              ageRestriction={comicData?.ageRestriction}
              title={comicData?.title}
              onContinue={continueDespiteUnderAge}
            />
          )}
        </>
      )}
    </div>
  );
}

DetailComicPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
};
