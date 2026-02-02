"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";
import RichTextDisplay from '@/components/RichTextDisplay/page';

/*[--- UTILITY IMPORT ---]*/
import { useLikeContent } from "@/lib/features/useLikeContent";
import { useDislikeContent } from "@/lib/features/useDislikeContent";
import { useSaveContent } from "@/lib/features/useSaveContent";

/*[--- COMPONENT IMPORT ---]*/
import BackButton from "@/components/BackButton/page";
import ShareModal from "@/components/ShareModal/page";
import Toast from "@/components/Toast/page";
import DetailPageLoading from "@/components/MainDetailProduct/Loading/ProductDetailLoading";

/*[--- ASSETS IMPORT ---]*/
import iconViews from "@@/icons/views-icon.svg";
import iconLikeOutline from "@@/logo/logoDetailFilm/like-icons.svg";
import iconLikeSolid from "@@/logo/logoDetailFilm/liked-icons.svg";
import iconDislike from "@@/logo/logoDetailFilm/dislike-icons.svg";
import iconDislikeSolid from "@@/logo/logoDetailFilm/dislike-icons-solid.svg";
import iconSaveOutline from "@@/logo/logoDetailFilm/save-icons.svg";
import iconSaveSolid from "@@/logo/logoDetailFilm/saved-icons.svg";
import DefaultShareButton from "../ShareButton/DefaultShareButton";
import CreatorCard from "./CreatorCard";

export default function ProductDetailSection({
  productType,
  productID,
  productBanner,
  productCover,
  productTitle,
  productDescription,
  productAgeRestriction,
  productGenre,
  productLanguage,
  productFirstEpisode,
  productIsLiked,
  productIsDisliked,
  productIsSaved,
  productTotalViews,
  productTotalLikes,
  creatorDetail,
  creatorTotalSubscriber,
  creatorIsSubscribed,
  idLikedProduct,
  idDislikedProduct,
  idSavedProduct,
  isLoading,
  handleSubscribe,
  canSubscribe,
  subscriptionPrice,
  isSubscribe = false,
  isOwner = false,
}) {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isLiked, setIsLiked] = useState(productIsLiked);
  const [isDisliked, setIsDisliked] = useState(productIsDisliked);
  const [idLiked, setIdLiked] = useState(idLikedProduct);
  const [idDisliked, setIdDisliked] = useState(idDislikedProduct);
  const [totalLike, setTotalLike] = useState(productTotalLikes);
  const [isSaved, setIsSaved] = useState(productIsSaved);
  const [idSaved, setIdSaved] = useState(idLikedProduct);
  const [showShareModal, setShowShareModal] = useState(false);
  const [totalSubs, setTotalSubs] = useState(creatorTotalSubscriber);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const fieldKey = {
    ebook: "ebookId",
    comic: "comicsId",
    podcast: "podcastId",
  }
  const { toggleLike } = useLikeContent();
  const { toggleDislike } = useDislikeContent();
  const { toggleSave } = useSaveContent();



  useEffect(() => {
    setIsLiked(productIsLiked);
    setIsDisliked(productIsDisliked);
    setTotalLike(productTotalLikes);
    setIdLiked(idLikedProduct);
    setIdDisliked(idDislikedProduct);
    setIsSaved(productIsSaved);
    setIdSaved(idSavedProduct);
    setTotalSubs(creatorTotalSubscriber);
    console.log("tes id like", idLiked)
  }, [productIsLiked, productTotalLikes]);


  const handleToggleDislike = () => {
    if (isLiked) {
      toggleLike({
        isLiked,
        title: productTitle,
        id: productID,
        fieldKey: fieldKey[productType],
        idLiked,
        totalLike,
        setIsLiked,
        setTotalLike,
        setIdLiked,
      });
    }
    toggleDislike({
      isDisliked,
      id: productID,
      fieldKey: fieldKey[productType],
      idDisliked,
      setIsDisliked,
      setIdDisliked,
    });
  };
  const handleToggleLike = () => {
    if (isDisliked) {
      toggleDislike({
        isDisliked,
        id: productID,
        fieldKey: fieldKey[productType],
        idDisliked,
        setIsDisliked,
        setIdDisliked,
      });
    }
    toggleLike({
      isLiked,
      title: productTitle,
      id: productID,
      fieldKey: fieldKey[productType],
      idLiked,
      totalLike,
      setIsLiked,
      setTotalLike,
      setIdLiked,
    });
  };
  const handleToggleSave = () => {
    toggleSave({
      isSaved,
      title: productTitle,
      id: productID,
      fieldKey: fieldKey[productType],
      idSaved,
      setShowToast,
      setToastMessage,
      setToastType,
      setIsSaved,
      setIdSaved,
    });
  };



  useEffect(() => {
    setShowSkeleton(isLoading);
  }, [isLoading])

  if (showSkeleton) return <DetailPageLoading />;

  return (
    <>
      <section className="relative w-full">
        {/* banner */}
        <div className="absolute -z-10 h-64 w-full overflow-hidden">
          {productBanner && (
            <img
              src={productBanner}
              alt="Poster"
              className="h-full w-full object-cover bg-[#2E2E2E]"
            />
          )}
          <div className="absolute top-0 left-0 z-0 h-full w-full bg-gradient-to-t from-[#222222] to-transparent" />
        </div>

        {/* Back menu */}
        <BackButton />

        {/* container content */}
        <div className="flex w-screen flex-col items-center gap-4 px-4 py-8 md:px-15 lg:flex-row">
          {/* cover buku */}
          <div className={`relative overflow-hidden rounded-lg md:rounded h-[300px] w-[200px] md:h-[500px] md:w-[337px]`}>
            {productCover && (
              <img
                src={productCover}
                alt="Poster"
                className="object-cover bg-[#2E2E2E] h-full w-full"
              />
            )}
          </div>

          {/* judl genre */}
          <div className="flex w-full max-w-full flex-1 flex-col justify-end gap-4 self-end text-white">
            {/* judul dan durasi */}
            <div>
              <h1
                className={`zeinFont text-center text-3xl font-extrabold md:text-4xl lg:text-left`}
              >
                {productTitle}
              </h1>
              <div className="flex items-center justify-center gap-1 text-sm font-light lg:justify-start">
                <div className="flex h-4 items-center justify-start gap-1">
                  <>
                    <Image
                      src={iconViews}
                      alt="icon-view"
                      width={20}
                      height={20}
                      className="object-cover opacity-70"
                      priority
                    />
                    <p>{productTotalViews}</p>
                  </>
                </div>
                <p>|</p>
                <div className="flex h-4 items-center justify-start gap-1">
                  {productAgeRestriction}
                </div>
                <p>|</p>
                <div className="flex h-4 items-center justify-start gap-1">
                  {productGenre}
                </div>
              </div>
            </div>

            <div className={`flex flex-col gap-4`}>
              {/* action button */}
              <div className="flex w-fit justify-center gap-2 self-center md:justify-start lg:self-auto">
                <div className="flex w-fit flex-1 gap-3 items-center justify-center md:flex-none montserratFont">
                  {(productType === 'ebook' || productType === 'comic') && canSubscribe && (
                    <button
                      onClick={() => handleSubscribe(productID, subscriptionPrice)}
                      disabled={isSubscribe || isOwner}
                      className={`w-full cursor-pointer rounded-3xl px-8 md:px-10 py-3 text-sm md:text-[16px] font-bold text-white md:w-auto 
                      ${isSubscribe || isOwner ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0076E999] hover:bg-[#0076E999]/80'}`}
                    >
                      {isOwner ? 'Ini adalah konten milikmu' : isSubscribe ? 'Subscribed' : 'Subscribe'}
                    </button>
                  )}

                  {productType === "podcast" && canSubscribe ? (
                    <button
                      onClick={() => handleSubscribe(creatorDetail.id, productID, subscriptionPrice)}
                      disabled={isSubscribe || isOwner}
                      className={`w-full cursor-pointer rounded-3xl px-8 md:px-10 py-3 font-bold text-white text-xs md:w-auto 
                      ${isSubscribe || isOwner ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0076E999] hover:bg-[#0076E999]/80'}`}
                    >
                      {isOwner ? 'Ini adalah konten milikmu' : isSubscribe ? 'Subscribed' : 'Subscribe'}
                    </button>
                  ) : productFirstEpisode ? (
                    <Link href={`/${productType}/read/${productFirstEpisode.id}`}>
                      <button className="w-full cursor-pointer rounded-3xl bg-[#0076E999] px-12 py-3 font-bold text-white hover:bg-[#0076E999]/80 md:w-auto">
                        {productType === "podcast" ? "Dengarkan" : "Baca"}
                      </button>
                    </Link>
                  ) : null}
                </div>
                <div
                  className={`flex cursor-pointer items-center justify-center gap-1 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 ${isLiked ? "animate-like" : ""}`}
                  onClick={handleToggleLike}
                >
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
                      src={iconLikeOutline}
                    />
                  )}
                  <p className="montserratFont mt-1 text-base font-bold">
                    {totalLike}
                  </p>
                </div>
                <div
                  className={`flex cursor-pointer items-center justify-center gap-1 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 ${isDisliked ? "animate-like" : ""}`}
                  onClick={handleToggleDislike}
                >{isDisliked ? (
                  <Image
                    priority
                    className="focus-within:bg-purple-300"
                    width={45}
                    alt="icon-dislike-solid"
                    src={iconDislikeSolid}
                  />
                ) : (
                  <Image
                    priority
                    className="focus-within:bg-purple-300"
                    width={35}
                    alt="icon-like-outline"
                    src={iconDislike}
                  />
                )}
                </div>
                <div
                  className={`flex cursor-pointer items-center justify-center transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 ${isSaved ? "animate-like" : ""}`}
                  onClick={handleToggleSave}
                >
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
                      src={iconSaveOutline}
                    />
                  )}
                </div>
                <DefaultShareButton contentType={productType.toUpperCase()} />
              </div>

              {/* uploader */}
              <CreatorCard
                productType={productType}
                creatorDetail={creatorDetail}
                initialIsSubscribed={creatorIsSubscribed}
                initialTotalSubs={totalSubs}
                onSubscriptionChange={({ totalSubs: newTotalSubs }) => {
                  setTotalSubs(newTotalSubs);
                }}
              />
            </div>

            {/* description */}
            <div className="flex w-full max-w-full flex-col gap-6 rounded-lg bg-[#393939] p-2 text-base font-normal">
              <RichTextDisplay content={productDescription} />
              <p>
                Judul : {productTitle} <br />
                Penulis Cerita : {creatorDetail?.profileName} <br />
                Genre : {productGenre} <br />
                Bahasa : {productLanguage} <br />
              </p>
            </div>
          </div>
        </div>
      </section>

      <ShareModal
        isOpen={showShareModal}
        contentType={productType.toUpperCase()}
        onClose={() => setShowShareModal(false)}
      />

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}

ProductDetailSection.propTypes = {
  productType: PropTypes.string.isRequired,
  productID: PropTypes.string.isRequired,
  productBanner: PropTypes.string.isRequired,
  productCover: PropTypes.string.isRequired,
  productTitle: PropTypes.string.isRequired,
  productDescription: PropTypes.string.isRequired,
  productAgeRestriction: PropTypes.string.isRequired,
  productGenre: PropTypes.string.isRequired,
  productLanguage: PropTypes.string.isRequired,
  productFirstEpisode: PropTypes.object.isRequired,
  productIsLiked: PropTypes.bool.isRequired,
  productIsDisliked: PropTypes.bool.isRequired,
  productIsSaved: PropTypes.bool.isRequired,
  productTotalViews: PropTypes.number.isRequired,
  productTotalLikes: PropTypes.number.isRequired,
  creatorDetail: PropTypes.object.isRequired,
  creatorTotalSubscriber: PropTypes.number.isRequired,
  creatorIsSubscribed: PropTypes.bool.isRequired,
  idLikedProduct: PropTypes.any,
  idDislikedProduct: PropTypes.any,
  idSavedProduct: PropTypes.any,
  isLoading: PropTypes.bool,
  handleSubscribe: PropTypes.func,
  canSubscribe: PropTypes.bool,
  subscriptionPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isSubscribe: PropTypes.bool,
  isOwner: PropTypes.bool,
};
