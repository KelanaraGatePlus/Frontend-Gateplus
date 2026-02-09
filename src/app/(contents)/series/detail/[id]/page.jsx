"use client";

import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
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
import DefaultShareButton from "@/components/ShareButton/DefaultShareButton";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";
import CompleteProfileModal from "@/components/Modal/CompleteProfileModal";
import UnderAgeModal from "@/components/Modal/UnderAgeModal";
import getMinAge from "@/lib/helper/minAge";
import useSyncUserData from "@/hooks/api/useSyncUserData";

import { useGetSeriesByIdQuery } from "@/hooks/api/seriesSliceAPI";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";
import { useLikeContent } from "@/lib/features/useLikeContent";
import { useDislikeContent } from "@/lib/features/useDislikeContent";
import { useSaveContent } from "@/lib/features/useSaveContent";

import { DEFAULT_AVATAR } from "@/lib/defaults";

function DetailSeriesPage({ params }) {
  const { id } = params;

  // State
  const [loading, setLoading] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [idLiked, setIdLiked] = useState(null);
  const [totalLike, setTotalLike] = useState(0);
  const [isDisliked, setIsDisliked] = useState(false);
  const [idDisliked, setIdDisliked] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [idSaved, setIdSaved] = useState(null);

  // API Series
  const { data } = useGetSeriesByIdQuery({ id, withEpisodes: false });
  const seriesData = data?.data?.data || {};
  const episode_series = (seriesData?.episodes?.episodes || [])
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  // Sync user data backend

  const {
    showCompleteProfileModal,
    showUnderAgeModal,
    goToProfile,
    continueDespiteUnderAge,
  } = useSyncUserData(seriesData?.ageRestriction);

  // Log
  const [createLog] = useCreateLogMutation();

  useEffect(() => {
    createLog({
      contentType: "SERIES",
      logType: "CLICK",
      contentId: id,
    });
  }, [id, createLog]);

  // Like/Dislike/Save
  const { toggleLike } = useLikeContent();
  const { toggleDislike } = useDislikeContent();
  const { toggleSave } = useSaveContent();

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

  // Tombol Like / Dislike / Save
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
      setShowToast: () => {},
      setToastMessage: () => {},
      setToastType: () => {},
      setIsSaved,
      setIdSaved,
    });
  };

  // Buy / Subscribe
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

  return (
    <div>
      {/* Video Player */}
      <section className="relative flex justify-center rounded-md">
        <div className="mx-auto my-auto flex w-screen justify-center rounded-lg object-cover">
          <DefaultVideoPlayer
            className="rounded-lg"
            src={seriesData?.trailerFileUrl}
            poster={seriesData?.posterImageUrl}
            logType={"WATCH_TRAILER"}
            contentType={"SERIES"}
            contentId={seriesData?.id}
            ageRestriction={seriesData?.ageRestriction}
            title={"Trailer " + seriesData?.title}
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
        {/* Header & Like/Dislike/Save */}
        <section className="flex w-full flex-col justify-between gap-4 px-4 pb-4 md:flex-row md:items-center md:gap-0 md:px-15">
          <div className="flex w-full flex-col gap-4 md:w-1/2">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-black">
                {seriesData?.title || "Judul Series Tidak Tersedia"}
              </h1>
              <p className="text-sm/normal">
                {seriesData?.ageRestriction} | {seriesData?.categories?.tittle}
              </p>
            </div>
            <div className="flex flex-row gap-6">
              <div className="flex w-max items-center justify-center">
                <button
                  disabled={seriesData?.isOwner || seriesData?.isSubscribed}
                  onClick={
                    seriesData?.isOwner
                      ? null
                      : !seriesData?.isSubscribed && seriesData?.canSubscribe
                        ? () => handleSubscribe(seriesData?.id)
                        : null
                  }
                  className="w-full rounded-3xl bg-[#0076E999] px-12 py-3 font-bold text-white hover:cursor-pointer disabled:bg-[#9CA3AF]"
                >
                  {seriesData?.isOwner
                    ? "Series ini adalah karya mu"
                    : !seriesData?.canSubscribe
                      ? "Buy Episode To Watch"
                      : seriesData?.isSubscribed
                        ? "Watch"
                        : "Subscribe"}
                </button>
              </div>
              {/* Like */}
              <div
                onClick={handleToggleLike}
                className="flex cursor-pointer items-center justify-center"
              >
                <Image
                  width={35}
                  alt="like"
                  src={isLiked ? iconLikeSolid : logoLike}
                />
                <p className="pl-2">{totalLike}</p>
              </div>
              {/* Dislike */}
              <div
                onClick={handleToggleDislike}
                className="flex cursor-pointer items-center justify-center"
              >
                <Image
                  width={35}
                  alt="dislike"
                  src={isDisliked ? iconDislikeSolid : logoDislike}
                />
              </div>
              {/* Save */}
              <div
                onClick={handleToggleSave}
                className="flex cursor-pointer items-center justify-center"
              >
                <Image
                  width={35}
                  alt="save"
                  src={isSaved ? iconSaveSolid : logoSave}
                />
              </div>
              <DefaultShareButton contentType={"SERIES"} />
            </div>
          </div>

          {/* Creator */}
          <div className="flex w-full flex-row items-center gap-3 md:w-1/2 md:justify-end">
            <img
              width={60}
              alt="creator-avatar"
              src={seriesData?.creator?.imageUrl || DEFAULT_AVATAR.src}
            />
            <Link href={`/creator/${seriesData?.creator?.id}`}>
              <div>{seriesData?.creator?.profileName}</div>
              <div>{seriesData?.creator?.totalSubscribers} followers</div>
            </Link>
          </div>
        </section>

        {/* Poster & Deskripsi */}
        <section className="mt-5 flex flex-row items-stretch gap-3 px-4 md:px-15">
          <div className="relative aspect-[2/3] w-[220px] flex-shrink-0 sm:w-[160px] lg:w-[250px]">
            {seriesData.thumbnailImageUrl && (
              <img
                src={seriesData.thumbnailImageUrl}
                alt="poster"
                className="h-full w-full rounded-md object-cover"
              />
            )}
          </div>
          <div className="flex-1 rounded-md bg-[#393939]">
            <div className="mx-4 my-4 flex flex-col text-white">
              <p>{seriesData?.description}</p>
              <div className="mt-10">
                <p>Judul: {seriesData.title}</p>
                <p>Sutradara : {seriesData.director}</p>
                <p>Rumah Produksi : {seriesData.productionHouse}</p>
                <p>Produser : {seriesData.producer}</p>
                <p>Penulis Cerita : {seriesData.writer}</p>
                <p>Pemeran : {seriesData.talent}</p>
                <p>Durasi : {seriesData.duration}</p>
                <p>
                  Genre :{" "}
                  {Array.isArray(seriesData?.categories)
                    ? seriesData.categories
                        .map((cat) => cat.category.tittle || cat.category.title)
                        .join(", ")
                    : seriesData?.categories?.tittle ||
                      seriesData?.categories?.title}
                </p>
                <p>Tahun Rilis : {seriesData.releaseYear}</p>
                <p>Bahasa : {seriesData.language}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Episodes */}
        <ProductEpisodeSection
          productType={"series"}
          productEpisodes={episode_series}
          isLoading={loading}
          isSubscribe={seriesData?.isSubscribed}
          handlePayment={handleBuy}
          productId={seriesData?.id}
          isOwner={seriesData?.isOwner}
          itemClassname="px-4 md:px-15"
        />

        {/* Carousel */}
        <section className="mt-5">
          <CarouselTemplate
            label="Banyak Dilihat"
            type="series"
            contents={data?.data?.topContent || []}
            isLoading={!data}
            withTopTag={false}
            withNewestTag={false}
          />
          <CarouselTemplate
            label="Rekomendasi Serupa"
            type="seriess"
            contents={data?.data?.recommendation || []}
            isLoading={!data}
            withTopTag={false}
            withNewestTag={false}
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
      </main>
    </div>
  );
}

DetailSeriesPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default DetailSeriesPage;
