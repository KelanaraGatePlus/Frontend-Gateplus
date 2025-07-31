"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";

/*[--- UTILITY IMPORT ---]*/
import { formatFollowersCount } from "@/lib/followersCount";
import {
  subscribeCreator,
} from "./utils";
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
import iconShare from "@@/logo/logoDetailFilm/share-icons.svg";
import defaultProfileImage from "@@/logo/logoDetailFilm/subscribe-icon-kelanara.svg";

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
}) {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isLiked, setIsLiked] = useState(productIsLiked);
  const [isDisliked, setIsDisliked] = useState(productIsDisliked);
  const [idLiked, setIdLiked] = useState(idLikedProduct);
  const [idDisliked, setIdDisliked] = useState(idDislikedProduct);
  const [totalLike, setTotalLike] = useState(productTotalLikes);
  const [isSaved, setIsSaved] = useState(productIsSaved);
  const [idSaved, setIdSaved] = useState(idLikedProduct);
  const [isOwnChannel, setIsOwnChannel] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(creatorIsSubscribed);
  const [isSubscribing, setIsSubscribing] = useState(false);
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
    const creatorId = localStorage.getItem("creators_id");
    if (creatorId === creatorDetail?.id) {
      setIsOwnChannel(true);
    }
  });

  useEffect(() => {
    setIsLiked(productIsLiked);
    setIsDisliked(productIsDisliked);
    setTotalLike(productTotalLikes);
    setIdLiked(idLikedProduct);
    setIsSaved(productIsSaved);
    setIdSaved(idSavedProduct);
    setIsSubscribed(creatorIsSubscribed);
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

    console.log("DEBUG");
    console.log(fieldKey[productType]);
    console.log(productID);
  };

  const handleToggleSubscribe = () => {
    subscribeCreator(
      isSubscribed,
      creatorDetail?.profileName,
      creatorDetail?.id,
      totalSubs,
      {
        setShowToast,
        setToastMessage,
        setToastType,
        setIsSubscribed,
        setTotalSubs,
        setIsSubscribing,
      },
    );
  };

  useEffect(() => {
    setShowSkeleton(isLoading);
  }, [isLoading])

  if (showSkeleton) return <DetailPageLoading />;

  return (
    <>
      <section className="relative w-full">
        {/* banner */}
        {productType !== 'podcast' && (
          <div className="absolute -z-10 h-64 w-full overflow-hidden">
            {productBanner && (
              <Image
                src={productBanner}
                alt="Poster"
                fill
                className="object-cover bg-[#2E2E2E]"
              />
            )}
            <div className="absolute top-0 left-0 z-0 h-full w-full bg-[linear-gradient(to_bottom,_#FFFFFF00,_#FFFFFF00,_#FFFFFF00,_#FFFFFF00,_#737373A1,_#595959BF,_#3F3F3FDE,_#303030ED,_#222222FF)]" />
          </div>
        )}

        {/* Back menu */}
        <BackButton />

        {/* container content */}
        <div className="flex w-screen flex-col items-center gap-4 px-4 py-8 md:px-15 lg:flex-row">
          {/* cover buku */}
          <div className={`relative overflow-hidden rounded-lg md:rounded ${productType === 'podcast' ? 'h-[200px] w-[200px] md:h-[337px] md:w-[337px]' : 'h-[300px] w-[200px] md:h-[500px] md:w-[337px]'}`}>
            {productCover && (
              <Image
                src={productCover}
                alt="Poster"
                fill
                className="object-cover bg-[#2E2E2E]"
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
                  {
                    productType !== 'podcast' && (
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
                    )
                  }
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

            <div className={`flex  ${productType === 'podcast' ? "flex-row justify-between" : "flex-col gap-4"}`}>
              {/* action button */}
              <div className="flex w-fit justify-center gap-2 self-center md:justify-start lg:self-auto">
                <div className="flex w-fit flex-1 items-center justify-center md:flex-none montserratFont">
                  {productType === "podcast" ? (
                    <button className="w-full cursor-pointer rounded-3xl bg-[#0076E999] px-12 py-3 font-bold text-white hover:bg-[#0076E999]/80 md:w-auto">
                      Subscribe
                    </button>
                  ) : productFirstEpisode ? (
                    <Link href={`/${productType}/read/${productFirstEpisode.id}`}>
                      <button className="w-full cursor-pointer rounded-3xl bg-[#0076E999] px-12 py-3 font-bold text-white hover:bg-[#0076E999]/80 md:w-auto">
                        {productType === "podcast" ? "Dengarkan" : "Baca"}
                      </button>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full cursor-not-allowed rounded-3xl bg-gray-400 px-12 py-3 font-bold text-white md:w-auto"
                    >
                      Belum Ada
                    </button>
                  )}
                </div>
                {productType !== "podcast" && (
                  <>
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
                  </>
                )}
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
                <div
                  className="flex cursor-pointer items-center justify-center transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                  onClick={() => setShowShareModal(true)}
                >
                  <Image priority width={35} alt="logo-share" src={iconShare} />
                </div>
              </div>

              {/* uploader */}
              <div className={`flex items-center gap-2 ${productType === 'podcast' && "flex-row-reverse"}`}>
                <Link href={`/creator/${creatorDetail?.id}`}>
                  <div className="h-15 w-15 rounded-full bg-white">
                    <Image
                      priority
                      src={creatorDetail?.imageUrl || defaultProfileImage}
                      alt={`profile-image-creator-${creatorDetail?.username}`}
                      width={100}
                      height={100}
                      className="h-full w-full rounded-full object-cover object-center"
                    />
                  </div>
                </Link>

                <div className={`flex flex-row items-center gap-4 ${productType === 'podcast' && "flex-row-reverse"}`}>
                  <Link href={`/creator/${creatorDetail?.id}`}>
                    <div className="group flex max-w-36 cursor-pointer flex-col rounded-lg text-ellipsis whitespace-nowrap md:max-w-72">
                      <h3
                        className={`zeinFont truncate text-2xl font-extrabold group-hover:text-blue-400 group-hover:underline md:text-3xl ${creatorDetail?.profileName ? "" : "text-gray-600/60 italic"}`}
                      >
                        {creatorDetail?.profileName ||
                          "Nama Channel belum diatur"}
                      </h3>
                      <p className={`-mt-1 text-[10px] font-light md:text-sm ${productType === 'podcast' && "text-right"}`}>
                        {formatFollowersCount(
                          totalSubs ? totalSubs : 0,
                        )}{" "}
                        {totalSubs > 1 ? " Followers" : " Follower"}
                      </p>
                    </div>
                  </Link>
                  {productType !== 'podcast' && (
                    !isOwnChannel && (
                      <button
                        className={`zeinFont mt-1 flex cursor-pointer items-center justify-center rounded-full ${!isSubscribed ? "bg-blue-800 hover:bg-blue-900" : "bg-gray-600 hover:bg-gray-700"} px-0 md:px-5 pt-1.5 pb-1 text-xl`}
                        onClick={handleToggleSubscribe}
                      >
                        {isSubscribing ? (
                          <div className="flex">
                            <svg
                              aria-hidden="true"
                              className="dark:text-white-600 mr-2 h-6 w-6 animate-spin fill-white text-gray-200"
                              viewBox="0 0 100 101"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                              />
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                              />
                            </svg>
                            <p className="flex">Subscribing...</p>
                          </div>
                        ) : isSubscribed ? (
                          "Subscribed"
                        ) : (
                          "Subscribe Now"
                        )}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* description */}
            <div className="flex w-full max-w-full flex-col gap-6 rounded-lg bg-[#393939] p-2 text-base font-normal">
              <p>{productDescription}</p>
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
};
