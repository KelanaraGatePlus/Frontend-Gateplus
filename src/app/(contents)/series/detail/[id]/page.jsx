"use client";

import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import logoDislike from "@@/logo/logoDetailFilm/dislike-icons.svg";
import logoLike from "@@/logo/logoDetailFilm/like-icons.svg";
import logoSave from "@@/logo/logoDetailFilm/save-icons.svg";
import DefaultVideoPlayer from "@/components/VideoPlayer/DefaultVideoPlayer";
import { useGetSeriesByIdQuery } from "@/hooks/api/seriesSliceAPI";
import ProductEpisodeSection from "@/components/MainDetailProduct/ProductEpisodeSection";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";
import { useLikeContent } from "@/lib/features/useLikeContent";
import { useDislikeContent } from "@/lib/features/useDislikeContent";
import DefaultShareButton from "@/components/ShareButton/DefaultShareButton";
import iconLikeSolid from "@@/logo/logoDetailFilm/liked-icons.svg";
import iconDislikeSolid from "@@/logo/logoDetailFilm/dislike-icons-solid.svg";
import iconSaveSolid from "@@/logo/logoDetailFilm/saved-icons.svg";
import { useSaveContent } from '@/lib/features/useSaveContent';
import CarouselTemplate from '@/components/Carousel/carouselTemplate';
import { DEFAULT_AVATAR } from '@/lib/defaults';
import { useGetUserId } from '@/lib/features/useGetUserId';
import LoadingOverlay from '@/components/LoadingOverlay/page';
import CompleteProfileModal from "@/components/Modal/CompleteProfileModal";
import UnderAgeModal from "@/components/Modal/UnderAgeModal";
import useSyncUserData from "@/hooks/api/useSyncUserData";
import getMinAge from "@/lib/helper/minAge";

function DetailSeriesPage({ params }) {
  const { id } = params;
  const userId = useGetUserId();
  const { data, isLoading } = useGetSeriesByIdQuery({ id, withEpisodes: false });
  const [loading, setLoading] = useState(false);
  // // const [selectedContentId, setSelectedContentId] = useState(null);
  // const [isModalSubscribeOpen, setIsModalSubscribeOpen] = useState(false);
  // // const [selectedPrice, setSelectedPrice] = useState(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [createLog] = useCreateLogMutation();
  const { toggleLike } = useLikeContent();
  const { toggleDislike } = useDislikeContent();
  const { toggleSave } = useSaveContent();

  const [isLiked, setIsLiked] = useState(false);
  const [idLiked, setIdLiked] = useState(null);
  const [totalLike, setTotalLike] = useState(0);
  const [isDisliked, setIsDisliked] = useState(false);
  const [idDisliked, setIdDisliked] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [idSaved, setIdSaved] = useState(null);

  // API Series
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

  useEffect(() => {
    createLog({
      contentType: "SERIES",
      logType: "CLICK",
      contentId: id,
    });
  }, [id, createLog]);

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

  const handleToggleLike = () => {
    if (!seriesData.id) return; // Mencegah aksi jika data belum siap
    // Jika konten sedang di-dislike, batalkan dislike terlebih dahulu
    if (isDisliked) {
      toggleDislike({
        isDisliked: true, // Paksa jadi true untuk proses un-dislike
        id: seriesData.id,
        fieldKey: "seriesId",
        idDisliked,
        setIsDisliked,
        setIdDisliked,
      });
    }
    // Lanjutkan dengan proses like
    toggleLike({
      isLiked,
      id: seriesData.id,
      fieldKey: "seriesId", // Pastikan key ini sesuai dengan backend
      idLiked,
      setIsLiked,
      setTotalLike,
      setIdLiked,
    });
  };

  const handleToggleSave = () => {
    toggleSave({
      isSaved,
      title: seriesData.title,
      id: seriesData.id,
      fieldKey: "seriesId",
      idSaved,
      setShowToast: () => { },
      setToastMessage: () => { },
      setToastType: () => { },
      setIsSaved,
      setIdSaved,
    });
  };

  if (isLoading) {
    return (
      <LoadingOverlay />
    )
  }

  return (
    <div>
      <section className="flex justify-center rounded-md relative">
        {/* Player bergaya YouTube */}
        <div className="mx-auto my-auto flex w-screen justify-center rounded-lg object-cover">
          <DefaultVideoPlayer
            className="rounded-lg"
            src={seriesData?.trailerFileUrl}
            poster={seriesData?.posterImageUrl}
            logType={"WATCH_TRAILER"}
            contentType={"SERIES"}
            contentId={seriesData?.id}
            ageRestriction={seriesData?.ageRestriction}
            title={'Trailer ' + seriesData?.title}
            genre={Array.isArray(seriesData?.categories) ? seriesData.categories.map(cat => cat.category.tittle || cat.category.title).join(', ') : seriesData?.categories?.tittle || seriesData?.categories?.title}
          />
        </div>
      </section>

      <main className="text-white mt-10">
        <section className="w-full px-4 md:px-15 flex flex-col gap-4 md:gap-0 md:flex-row md:items-center justify-between pb-4">
          <div className="flex flex-col gap-4 md:w-1/2 w-full">
            <div className="flex flex-col gap-2">
              <h1 className="font-black text-4xl">
                {seriesData?.title || "Judul Series Tidak Tersedia"}
              </h1>
              <p className=" text-sm/normal">
                {seriesData?.ageRestriction} | {seriesData?.categories?.map(cat => cat.category.tittle || cat.category.title).join(', ') || seriesData?.categories?.tittle || seriesData?.categories?.title}
              </p>
            </div>
            <div className="flex flex-row gap-6">
              <div className="flex items-center justify-center w-max">
                <button disabled={seriesData?.isOwner || seriesData?.isSubscribed} onClick={seriesData?.isOwner ? null : !seriesData?.isSubscribed && seriesData?.canSubscribe ? () => { handleSubscribe(seriesData?.id, seriesData?.subscriptionPrice) } : null} className="rounded-3xl bg-[#0076E999] disabled:bg-[#9CA3AF] px-12 py-3 font-bold text-white w-full hover:cursor-pointer">
                  {seriesData?.isOwner ? "Series ini adalah karya mu" : !seriesData?.canSubscribe ? 'Buy Episode To Watch' : seriesData?.isSubscribed ? "Watch" : "Subscribe"}
                </button>
              </div>
              <div className="flex items-center justify-center w-max gap-2">
                {userId && <div onClick={handleToggleLike} className="flex items-center justify-center transition delay-150 duration-400 ease-linear hover:-translate-y-1 hover:scale-x-110 hover:scale-y-110 cursor-pointer">
                  {isLiked ? (
                    <Image
                      priority
                      className="focus-within:bg-purple-300"
                      width={35}
                      alt="icon-like-solid"
                      src={iconLikeSolid}
                    />
                  ) : (
                    <Image
                      priority
                      className="focus-within:bg-purple-300"
                      width={35}
                      alt="icon-like-outline"
                      src={logoLike}
                    />
                  )}
                  <p className="montserratFont mt-1 text-base font-bold pl-2">
                    {totalLike}
                  </p>
                </div>}
                {/* Tombol Dislike */}
                {userId && <div onClick={handleToggleDislike} className="flex items-center justify-center cursor-pointer">
                  {isDisliked ? (
                    <Image
                      priority
                      className="focus-within:bg-purple-300"
                      width={35}
                      alt="icon-like-solid"
                      src={iconDislikeSolid}
                    />
                  ) : (
                    <Image
                      priority
                      className="focus-within:bg-purple-300"
                      width={35}
                      alt="icon-like-outline"
                      src={logoDislike}
                    />
                  )}
                </div>}
                {userId && <div onClick={handleToggleSave} className="flex items-center justify-center cursor-pointer">
                  {isSaved ? (
                    <Image
                      priority
                      width={35}
                      alt="icon-saved-solid"
                      src={iconSaveSolid}
                    />
                  ) : (
                    <Image
                      priority
                      width={35}
                      alt="logo-save"
                      src={logoSave}
                    />
                  )}
                </div>}
                <DefaultShareButton contentType={'SERIES'} />
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center md:justify-end w-full md:w-1/2 gap-3">
            <div className="flex items-center justify-center">
              <img
                width={60}
                alt="logo-subscribers"
                src={seriesData?.creator?.imageUrl || DEFAULT_AVATAR.src}
              />
            </div>
            <Link href={`/creator/${seriesData?.creator?.id}`} className="grid grid-rows-2">
              <div className="flex place-content-center justify-center text-2xl font-bold text-white hover:underline">
                {seriesData?.creator?.profileName}
              </div>
              <div className="text-sm text-white">{seriesData?.creator?.totalSubscribers} followers</div>
            </Link>
          </div>
        </section>

        <section className="flex flex-row gap-3 items-stretch px-4 md:px-15 mt-5">
          {/* Poster 3:2 */}
          <div className="relative aspect-[2/3] w-[220px] sm:w-[160px] lg:w-[250px] flex-shrink-0">
            {seriesData.thumbnailImageUrl && <img
              src={seriesData.thumbnailImageUrl}
              alt="logo-racunsangga-movie"
              className="rounded-md object-cover h-full w-full"
            />}
          </div>

          {/* Deskripsi */}
          <div className="rounded-md bg-[#393939] flex-1">
            <div className="mx-4 my-4 text-white h-full flex flex-col">
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: seriesData?.description || "" }}
              />

              <div className="mt-10">
                <p>Judul: {seriesData.title}</p>
                <p>Sutradara : {seriesData.director}</p>
                <p>Rumah Produksi : {seriesData.productionHouse}</p>
                <p>Produser : {seriesData.producer}</p>
                <p>Penulis Cerita : {seriesData.writer}</p>
                <p>Pemeran : {seriesData.talent}</p>
                <p>Durasi : {seriesData.duration}</p>
                <p>Genre : {Array.isArray(seriesData?.categories) ? seriesData.categories.map(cat => cat.category.tittle || cat.category.title).join(', ') : seriesData?.categories?.tittle || seriesData?.categories?.title}</p>
                <p>Tahun Rilis : {seriesData.releaseYear}</p>
                <p>Bahasa : {seriesData.language}</p>
              </div>
            </div>
          </div>
        </section>

        <ProductEpisodeSection
          productType={'series'}
          productEpisodes={episode_series}
          isLoading={loading}
          isSubscribe={seriesData?.isSubscribed}
          handlePayment={handleBuy}
          productId={
            seriesData?.id
          }
          isOwner={seriesData?.isOwner}
          itemClassname='px-4 md:px-15'
        />

        <section className="mt-5">
          <section className="my-10 flex flex-col">
            <section className="mt-10">
              <CarouselTemplate
                label="Banyak Dilihat"
                type="series"
                contents={data?.data?.topContent || []}
                isLoading={!data}
                withTopTag={false}
                withNewestTag={false}
              />
            </section>

            <section className="mt-10">
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
          </section>
        </section>

        {/* <SimpleModal
                    title={"Subscribe untuk menikmati seluruh episode dari konten ini selama sebulan seharga Rp. " + (selectedPrice?.toLocaleString() ?? 0) + ",- ?"}
                    isOpen={isModalSubscribeOpen}
                    onClose={() => setIsModalSubscribeOpen(false)}
                    onConfirm={handleSubscribe}
                />

                <SimpleModal
                    title={"Konten ini masih terkunci, apakah kamu bersedia membeli nya dengan harga Rp. " + (selectedPrice?.toLocaleString() ?? 0) + ",- ?"}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleBuy}
                /> */}
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
