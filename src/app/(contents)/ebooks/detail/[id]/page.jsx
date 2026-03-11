"use client";
import React, { useEffect, useCallback, useState } from "react";
import PropTypes from "prop-types";

/* --- COMPONENT IMPORT --- */
import MainTemplateLayout from "@/components/MainDetailProduct/page";
import CompleteProfileModal from "@/components/Modal/CompleteProfileModal";
import UnderAgeModal from "@/components/Modal/UnderAgeModal";
import LoadingOverlay from "@/components/LoadingOverlay/page";

/* --- HOOKS --- */
import useSyncUserData from "@/hooks/api/useSyncUserData";
import getMinAge from "@/lib/helper/minAge";
import { useGetEbookByIdQuery } from "@/hooks/api/ebookSliceAPI";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";
import { useAddLastSeenMutation } from "@/hooks/api/lastSeenSliceAPI";

export default function DetailEbookPage({ params }) {
  const { id } = React.use(params);

  const [loading, setLoading] = useState(false);
  const [createLog] = useCreateLogMutation();
  const [addLastSeen] = useAddLastSeenMutation();

  const { data, isLoading } = useGetEbookByIdQuery({ id }, { skip: !id });

  const ebookData = data?.data || {};

  const {
    userAge,
    isReady,
    showCompleteProfileModal,
    showUnderAgeModal,
    goToProfile,
    continueDespiteUnderAge,
  } = useSyncUserData(ebookData?.ageRestriction || null);

  const episode_ebooks = (ebookData?.episode_ebooks?.episodes || [])
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  useEffect(() => {
    if (!id) return;

    createLog({
      contentType: "EBOOK",
      logType: "CLICK",
      contentId: id,
    });

    addLastSeen({
      contentType: "EBOOK",
      contentId: id,
    });
  }, [id, createLog, addLastSeen]);

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
    window.location.href = `/checkout/purchase/ebooks/${id}/${episodeId}`;
  };

  if (isLoading || !data || !isReady) {
    return <LoadingOverlay />;
  }

  return (
    <div className="flex flex-col">
      <MainTemplateLayout
        productType="ebook"
        productDetail={ebookData}
        productEpisode={episode_ebooks}
        isLoading={isLoading}
        handlePayment={handleBuy}
        topContentData={data?.topContent || []}
        recomendationData={data?.recommendation || []}
        isBlurred={isBlurred}
      />

      {loading && <LoadingOverlay />}

      {ebookData?.id && (
        <>
          {showCompleteProfileModal && (
            <CompleteProfileModal
              onConfirm={goToProfile}
              title={ebookData?.title}
              minAge={getMinAge(ebookData?.ageRestriction)}
            />
          )}

          {showUnderAgeModal && (
            <UnderAgeModal
              open={showUnderAgeModal}
              ageRestriction={ebookData?.ageRestriction}
              title={ebookData?.title}
              onContinue={continueDespiteUnderAge}
            />
          )}
        </>
      )}
    </div>
  );
}

DetailEbookPage.propTypes = {
  params: PropTypes.object.isRequired,
};
