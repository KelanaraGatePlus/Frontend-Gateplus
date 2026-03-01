"use client";

import PropTypes from "prop-types";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

import logoDislike from "@@/logo/logoDetailFilm/dislike-icons.svg";
import logoLike from "@@/logo/logoDetailFilm/like-icons.svg";
import logoSave from "@@/logo/logoDetailFilm/save-icons.svg";
import iconLikeSolid from "@@/logo/logoDetailFilm/liked-icons.svg";
import iconDislikeSolid from "@@/logo/logoDetailFilm/dislike-icons-solid.svg";
import iconSaveSolid from "@@/logo/logoDetailFilm/saved-icons.svg";

import DefaultVideoPlayer from "@/components/VideoPlayer/DefaultVideoPlayer";
import ProductEpisodeSection from "@/components/MainDetailProduct/ProductEpisodeSection";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import CompleteProfileModal from "@/components/Modal/CompleteProfileModal";
import UnderAgeModal from "@/components/Modal/UnderAgeModal";
import DefaultShareButton from "@/components/ShareButton/DefaultShareButton";

import { useGetSeriesByIdQuery } from "@/hooks/api/seriesSliceAPI";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";
import { useLikeContent } from "@/lib/features/useLikeContent";
import { useDislikeContent } from "@/lib/features/useDislikeContent";
import { useSaveContent } from "@/lib/features/useSaveContent";
import { useGetUserId } from "@/lib/features/useGetUserId";
import useSyncUserData from "@/hooks/api/useSyncUserData";
import getMinAge from "@/lib/helper/minAge";
import { DEFAULT_AVATAR } from "@/lib/defaults";
import slugifyTitle from "@/lib/helper/slugifyTitle";

import Toast from "@/components/Toast/page";

function DetailSeriesPage({ params }) {
  const { id } = params;
  const userId = useGetUserId();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsHydrated(true);
    }
  }, []);

  const { data, isLoading } = useGetSeriesByIdQuery(
    {
      id,
      withEpisodes: false,
    },
    {
      skip: !id || !isHydrated,
    },
  );

  const [loading, setLoading] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [idLiked, setIdLiked] = useState(null);
  const [totalLike, setTotalLike] = useState(0);
  const [isDisliked, setIsDisliked] = useState(false);
  const [idDisliked, setIdDisliked] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [idSaved, setIdSaved] = useState(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success"); // success / failed

  const seriesData = data?.data?.data || {};
  const seriesSlug = slugifyTitle(seriesData?.title);
  const seriesSharePath = seriesSlug ? `/series/${seriesSlug}` : undefined;
  const episode_series = (seriesData?.episodes?.episodes || [])
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const {
    showCompleteProfileModal,
    showUnderAgeModal,
    goToProfile,
    continueDespiteUnderAge,
    userAge,
    isReady,
  } = useSyncUserData(seriesData?.ageRestriction);

  const { toggleSave } = useSaveContent({
    userAge,
    isReady,
    ageRestriction: seriesData?.ageRestriction,
  });

  const [createLog] = useCreateLogMutation();
  const { toggleLike } = useLikeContent();
  const { toggleDislike } = useDislikeContent();

  // Set initial state Like/Dislike/Save
  useEffect(() => {
    if (seriesData && seriesData.id) {
      setIsLiked(seriesData.isLiked || false);
      setIdLiked(seriesData?.isLiked?.id || null);
      setTotalLike(seriesData.likes || 0);
      setIsDisliked(seriesData.isDisliked || false);
      setIdDisliked(seriesData?.isDisliked?.id || null);
      setIsSaved(seriesData.isSaved || false);
      setIdSaved(seriesData?.isSaved?.id || null);
    }
  }, [seriesData]);

  useEffect(() => {
    if (id) {
      createLog({ contentType: "SERIES", logType: "CLICK", contentId: id });
    }
  }, [id, createLog]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // blur jika umur belum memenuhi
  const isBlurred = useCallback(
    (seriesData) => {
      if (!isReady) return true;
      const minAge = getMinAge(seriesData?.ageRestriction);
      if (minAge === null) return false;
      if (userAge == null) return true;
      return userAge < minAge;
    },
    [userAge, isReady],
  );

  const handleToggleLike = () => {
    if (!seriesData.id) return;
    if (isDisliked) {
      toggleDislike({
        isDisliked: true,
        id: seriesData.id,
        fieldKey: "seriesId",
        idDisliked,
        setIsDisliked,
        setIdDisliked,
      });
    }
    toggleLike({
      isLiked,
      id: seriesData.id,
      fieldKey: "seriesId",
      idLiked,
      setIsLiked,
      setTotalLike,
      setIdLiked,
    });
  };

  const handleToggleDislike = () => {
    if (!seriesData.id) return;
    if (isLiked) {
      toggleLike({
        isLiked: true,
        id: seriesData.id,
        fieldKey: "seriesId",
        idLiked,
        setIsLiked,
        setTotalLike,
        setIdLiked,
      });
    }
    toggleDislike({
      isDisliked,
      id: seriesData.id,
      fieldKey: "seriesId",
      idDisliked,
      setIsDisliked,
      setIdDisliked,
    });
  };

  const handleToggleSave = () => {
    toggleSave({
      isSaved,
      title: seriesData.title,
      id: seriesData.id,
      fieldKey: "seriesId",
      idSaved,
      setShowToast,
      setToastMessage,
      setToastType,
      setIsSaved,
      setIdSaved,
      onUnderAge: () => showUnderAgeModal(true),
      onIncompleteDOB: goToProfile,
    });
  };

  const handleBuy = async (episodeId) => {
    setLoading(true);
    window.location.href = `/checkout/purchase/series/${id}/${episodeId}`;
    setLoading(false);
  };

  const handleSubscribe = async (contentId) => {
    setLoading(true);
    window.location.href = `/checkout/subscribe/series/${contentId}`;
    setLoading(false);
  };

  if (!isHydrated || isLoading || !data || !isReady) {
    return <LoadingOverlay />;
  }

  return (
    <div>
      <section className="relative flex justify-center rounded-md">
        <div className="mx-auto my-auto flex w-screen justify-center rounded-lg object-cover">
          <DefaultVideoPlayer
            className="rounded-lg"
            src={seriesData?.trailerFileUrl}
            poster={seriesData?.posterImageUrl}
            logType="WATCH_TRAILER"
            contentType="SERIES"
            contentId={seriesData?.id}
            ageRestriction={seriesData?.ageRestriction}
            title={`Trailer ${seriesData?.title}`}
            genre={
              Array.isArray(seriesData?.categories)
                ? seriesData.categories
                  .map((cat) => cat.category.tittle || cat.category.title)
                  .join(", ")
                : seriesData?.categories?.tittle ||
                seriesData?.categories?.title
            }
          />
        </div>
      </section>

      <main className="mt-10 text-white">
        <section className="flex flex-col gap-4 px-4 md:flex-row md:items-center md:px-15">
          <div className="flex flex-col gap-4 md:w-1/2">
            <h1 className="text-4xl font-black">{seriesData?.title}</h1>
            <p className="text-sm/normal">
              {seriesData?.ageRestriction} |{" "}
              {Array.isArray(seriesData?.categories)
                ? seriesData.categories
                  .map((cat) => cat.category.tittle || cat.category.title)
                  .join(", ")
                : seriesData?.categories?.tittle ||
                seriesData?.categories?.title}
            </p>

            <div className="flex gap-6">
              <button
                disabled={seriesData?.isOwner || seriesData?.isSubscribed}
                onClick={
                  seriesData?.isOwner
                    ? null
                    : !seriesData?.isSubscribed && seriesData?.canSubscribe
                      ? () => handleSubscribe(seriesData?.id)
                      : null
                }
                className="w-max rounded-3xl bg-[#0076E999] px-12 py-3 font-bold text-white hover:cursor-pointer disabled:bg-[#9CA3AF]"
              >
                {seriesData?.isOwner
                  ? "Series ini adalah karya mu"
                  : !seriesData?.canSubscribe
                    ? "Buy Episode To Watch"
                    : seriesData?.isSubscribed
                      ? "Watch"
                      : "Subscribe"}
              </button>
              <div className="flex gap-2">
                {userId && (

                  <>
                    <div
                      onClick={handleToggleLike}
                      className="flex cursor-pointer items-center"
                    >
                      <Image
                        width={35}
                        src={isLiked ? iconLikeSolid : logoLike}
                        alt="like"
                      />
                      <p className="pl-2 font-bold">{totalLike}</p>
                    </div>
                    <div
                      onClick={handleToggleDislike}
                      className="flex cursor-pointer items-center"
                    >
                      <Image
                        width={35}
                        src={isDisliked ? iconDislikeSolid : logoDislike}
                        alt="dislike"
                      />
                    </div>
                    <div
                      onClick={handleToggleSave}
                      className="flex cursor-pointer items-center"
                    >
                      <Image
                        width={35}
                        src={isSaved ? iconSaveSolid : logoSave}
                        alt="save"
                      />
                    </div>
                  </>
                )}
                <DefaultShareButton
                  contentType="SERIES"
                  sharePath={seriesSharePath}
                />
              </div>
            </div>
          </div>

          <div className="flex w-full items-center gap-3 md:w-1/2 md:justify-end">
            <div className="rounded-full overflow-hidden h-15 w-15">
              <img
                width={60}
                height={60}
                alt="creator-avatar"
                src={seriesData?.creator?.imageUrl || DEFAULT_AVATAR.src}
              />
            </div>
            <Link
              href={`/creator/${seriesData?.creator?.id}`}
              className="grid grid-rows-2"
            >
              <span className="text-2xl font-bold hover:underline">
                {seriesData?.creator?.profileName}
              </span>
              <span className="text-sm">
                {seriesData?.creator?.totalSubscribers} followers
              </span>
            </Link>
          </div>
        </section>

        <section className="mt-5 flex gap-3 px-4 md:px-15">
          <div className="relative aspect-[2/3] w-[220px] flex-shrink-0 sm:w-[160px] lg:w-[250px]">
            {seriesData.thumbnailImageUrl && (
              <img
                src={seriesData.thumbnailImageUrl}
                alt="poster"
                className="h-full w-full rounded-md object-cover"
              />
            )}
          </div>

          <div className="flex-1 rounded-md bg-[#393939] text-white">
            <div className="mx-4 my-4">
              <div
                dangerouslySetInnerHTML={{
                  __html: seriesData?.description || "",
                }}
              />
              <div className="mt-10 space-y-1">
                <p>Judul: {seriesData.title}</p>
                <p>Sutradara: {seriesData.director}</p>
                <p>Rumah Produksi: {seriesData.productionHouse}</p>
                <p>Produser: {seriesData.producer}</p>
                <p>Penulis Cerita: {seriesData.writer}</p>
                <p>Pemeran: {seriesData.talent}</p>
                <p>Durasi: {seriesData.duration}</p>
                <p>
                  Genre:{" "}
                  {Array.isArray(seriesData?.categories)
                    ? seriesData.categories
                      .map((cat) => cat.category.tittle || cat.category.title)
                      .join(", ")
                    : seriesData?.categories?.tittle ||
                    seriesData?.categories?.title}
                </p>
                <p>Tahun Rilis: {seriesData.releaseYear}</p>
                <p>Bahasa: {seriesData.language}</p>
              </div>
            </div>
          </div>
        </section>

        <ProductEpisodeSection
          productType="series"
          productEpisodes={episode_series}
          isLoading={loading}
          isSubscribe={seriesData?.isSubscribed}
          handlePayment={handleBuy}
          productId={seriesData?.id}
          isOwner={seriesData?.isOwner}
          itemClassname="px-4 md:px-15"
        />

        <section className="my-10 flex flex-col gap-5">
          <CarouselTemplate
            label="Banyak Dilihat"
            type="series"
            contents={data?.data?.topContent || []}
            isLoading={!data}
            isBlurred={isBlurred}
          />
          <CarouselTemplate
            label="Rekomendasi Serupa"
            type="series"
            contents={data?.data?.recommendation || []}
            isLoading={!data}
            isBlurred={isBlurred}
          />
        </section>

        {showCompleteProfileModal && (
          <CompleteProfileModal
            onConfirm={goToProfile}
            title={seriesData?.title}
            minAge={getMinAge(seriesData?.ageRestriction)}
          />
        )}
        {showUnderAgeModal && (
          <UnderAgeModal
            open={showUnderAgeModal}
            ageRestriction={seriesData?.ageRestriction}
            title={seriesData?.title}
            onContinue={continueDespiteUnderAge}
          />
        )}

        {showToast && (
          <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setShowToast(false)}
          />
        )}
      </main>
    </div>
  );
}

DetailSeriesPage.propTypes = {
  params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
};

export default DetailSeriesPage;
