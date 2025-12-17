"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import PropTypes from "prop-types";

/*[--- UTILITY IMPORT ---]*/
import ProductEpisodeSkeleton from "./Loading/ProductEpisodeLoading"

/*[--- UTILITY IMPORT ---]*/
import { formatDateTime } from "@/lib/timeFormatter";

/*[--- ASSETS IMPORT ---]*/
import iconArrowDown from "@@/logo/logoDetailEbook/icon-arrow-down.svg";
import iconUnlocked from "@@/icons/icons-unlocked.svg";
import iconLocked from "@@/icons/icons-locked.svg";
import iconSaveOutline from "@@/logo/logoDetailFilm/save-icons.svg";
import iconMore from "@@/icons/icons-more.svg";
import iconPlay from "@@/icons/icons-play.svg";
import iconFlag from "@@/icons/icons-flag.svg";
import Link from "next/link";
import useGetLazyEpisodeByType from "@/hooks/helper/getEpisodeByType";
import { Icon } from "@iconify/react";
// import iconPause from "@@/icons/icons-pause.svg";

export default function ProductEpisodeSection({
  productType,
  isLoading,
  currentlyPlaying,
  handlePlayPodcast,
  handlePayment,
  isSubscribe = false,
  productId = 'cmhiwnwlu0009f8z8rskzp22e',
  isOwner = false,
  itemClassname = "",
  containerClassname = "",
}) {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [selectedPodcast, setSelectedPodcast] = useState({});
  const [isPodcastModalVisible, setIsPodcastModalVisible] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [imageStatus, setImageStatus] = useState({});
  const lastEpisodeRef = useRef(null);

  // Hanya eksekusi sekali saja saat komponen dimount
  useEffect(() => {
    handleLoadAllEpisodes();
  }, [
    productId, productType
  ]);

  const [trigger] = useGetLazyEpisodeByType(productType);

  const handleLoadAllEpisodes = async (paginate = true) => {
    const data = await trigger({
      id: productId,
      page: 1,
      limit: 5,
      withPurchased: true,
      paginate: paginate,
    }).unwrap();

    if (data && data.data.episodes) {
      setEpisodes([...data.data.episodes]);
      if (paginate) {
        setTotalEpisodes(data.data.pagination.totalCount);
      }
    }
  }

  const handlePodcastModal = () => {
    setIsPodcastModalVisible(!isPodcastModalVisible);
  };

  const handleSelectedPodcast = (item) => {
    setSelectedPodcast(item);
    handlePodcastModal();
  };

  const handleScroll = () => {
    if (episodes.length < totalEpisodes) {
      handleLoadAllEpisodes(false);
    } else {
      if (lastEpisodeRef.current) {
        lastEpisodeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    if (lastEpisodeRef.current) {
      lastEpisodeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  useEffect(() => {
    setShowSkeleton(isLoading);
  }, [isLoading])

  if (showSkeleton) return <ProductEpisodeSkeleton />;

  /*[--- EBOOK and COMIC ---]*/
  if (productType === "ebook" || productType === "comic" || productType === "series") {
    const parentPath =
      productType === "ebook" ? "/ebooks/read" : productType == "comic" ? "/comics/read" : "/series/watch";
    return (
      <>
        {episodes?.length > 0 ? (
          <section className={`relative flex w-full flex-col gap-3 py-5 text-white ${containerClassname}`}>
            {/* Lihat episode pertama */}
            {totalEpisodes > 5 && <button className={`flex hover:cursor-pointer ${itemClassname}`} onClick={() => { handleScroll() }}>
              <div className={`mb-1 flex w-full items-center justify-center gap-2 rounded-md bg-[#393939] py-4`}>
                <h4 className={`zeinFont text-2xl font-bold`}>
                  Lihat Episode Pertama
                </h4>
                <div className="flex h-8 w-8 items-center justify-center">
                  <Image
                    priority
                    width={30}
                    alt="logo-arrow-down"
                    src={iconArrowDown}
                    className="object-cover"
                  />
                </div>
              </div>
            </button>}

            {/* List episode */}
            {episodes
              .map((item, index) => {
                const coverUrl = productType === "ebook" ? item.coverEpisodeUrl : productType === "comic" ? item.coverImageUrl : item.thumbnailUrl;
                const isLoaded = imageStatus[item.id] === "loaded";
                const hasError = imageStatus[item.id] === "error";
                const episodeNumber = totalEpisodes - index;

                // Adjust font size based on digit count
                const getFontSizeClass = (episodeNumber) => {
                  const digitCount = episodeNumber.toString().length;
                  if (digitCount === 1) return "text-[116px] 2xl:text-[135px] -bottom-12.5 -left-13 2xl:-bottom-12.5 2xl:-left-15";
                  if (digitCount === 2) return "text-[64px] 2xl:text-[80px] -bottom-7 -left-7 2xl:-bottom-8 2xl:-left-8";
                  if (digitCount === 3) return "text-[40px] 2xl:text-[45px] -bottom-4 -left-4 2xl:-bottom-4 2xl:-left-3";
                  return "text-[55px] 2xl:text-[65px] -bottom-6 -left-5 2xl:-bottom-7 2xl:-left-6";
                };

                return (
                  <button ref={index + 1 == totalEpisodes ? lastEpisodeRef : null} key={index} onClick={isOwner || item.isPurchased || item.price == 'Free' || isSubscribe ? () => { window.location.href = `${parentPath}/${item.id}` } : () => { handlePayment(item.id, item.price, 'EBOOK') }}>
                    <div className={`group flex cursor-pointer items-stretch gap-2 py-2 hover:bg-[#1F6E8A] md:gap-4 ${itemClassname}`}>
                      {/* Book Container */}
                      <div className="h-20 w-20 overflow-hidden relative rounded-lg 2xl:h-25 2xl:w-25 bg-[#979797]">
                        {/* Show episode number as fallback or while loading */}
                        {(!coverUrl || !isLoaded || hasError) && (
                          <div className="h-full w-full bg-[#979797] relative">
                            <p className={`${getFontSizeClass(episodeNumber)} montserratFont font-bold absolute text-white`}>#{episodeNumber}</p>
                          </div>
                        )}

                        {/* Show image if URL exists */}
                        {coverUrl && !hasError && (
                          <Image
                            priority
                            src={coverUrl}
                            alt={`poster-${item.title}`}
                            className={`h-full w-full rounded object-cover object-center transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
                            width={144}
                            height={144}
                            onLoadingComplete={() => setImageStatus((prev) => ({ ...prev, [item.id]: "loaded" }))}
                            onError={() => setImageStatus((prev) => ({ ...prev, [item.id]: "error" }))}
                          />
                        )}

                        {(!isOwner && !item.isPurchased && !(item.price == 'Free')) && <div className="bg-[#F5F5F533] backdrop-blur-xs absolute top-0 left-0 flex h-full w-full items-center justify-center transition-all duration-300 ease-in-out">
                          <Icon
                            icon={'solar:lock-keyhole-minimalistic-linear'}
                            className="w-4 h-4 md:w-8 md:h-8 text-red-600"
                          />
                        </div>}
                      </div>

                      {/* Book Info */}
                      <div className="flex w-full justify-between items-center">
                        <div className="flex flex-col justify-between md:justify-center h-full py-2 md:py-0 items-start montserratFont text-[#AFAFAF]">
                          <h1 className="text-white zeinFont font-bold text-[16px] md:text-2xl">{item.title}</h1>
                          <p className="hidden text-start md:block" title={item.description}>{item.description?.substring(0, 265)}{item.description?.length > 265 ? '...' : ''}</p>
                          <p className="text-sm md:text-[16px] block md:hidden">{formatDateTime(item.createdAt, 'short')}</p>
                          <p className="text-sm md:text-[16px] hidden md:block">{formatDateTime(item.createdAt, 'long')}</p>
                        </div>

                        {/* Lock */}
                        {(!isOwner && !item.isPurchased && !(item.price == 'Free')) && <div className="w-max h-full flex flex-col justify-between items-end zeinFont">
                          <div className="bg-[#63282e] w-full flex items-center gap-2 rounded-lg justify-center p-1 md:p-2 border-2 border-[#967074]">
                            <Icon
                              icon={'solar:lock-keyhole-minimalistic-linear'}
                              className="w-4 h-4"
                            />
                            <p className="font-bold zeinFont">Terkunci</p>
                          </div>
                          <p className="font-bold">
                            Rp {item.price == 'Free' ? '0' : item.price.toLocaleString('id-ID')}
                          </p>
                        </div>}

                        {/* Open */}
                        {(isOwner || item.isPurchased || item.price == 'Free') && !item.isWatched && <div className="bg-[#1FC16B4D] p-1 md:p-2 w-max flex items-center gap-2 rounded-lg justify-center border-2 border-[#F5F5F559]">
                          <Icon
                            icon={'solar:notebook-minimalistic-linear'}
                            className="w-4 h-4 rounded-md"
                          />
                          <p className="font-bold zeinFont">Baca</p>
                        </div>}

                        {/* Already Read */}
                        {(item.isWatched) && (isOwner || item.isPurchased || (item.price == 'Free')) && <Link
                          href={`/report/${productType == 'ebook' ? 'episode_ebook' : productType == 'comic' ? 'episode_comic' : productType == 'movie' ? 'episode_movie' : 'episode_series'}/${item.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="w-6 z-20 h-6 cursor-pointer p-1 md:p-2 transition-transform duration-150 active:scale-90"
                        >
                          <Icon
                            className="w-8 h-8 rotate-90"
                            icon={'solar:menu-dots-line-duotone'}
                          />
                        </Link>}
                      </div>
                    </div>
                  </button>
                );
              })}

            <SeeAnotherEpisodes
              showAll={episodes.length === totalEpisodes}
              handleShowAll={() => handleLoadAllEpisodes(false)}
              itemClassname={itemClassname}
            />
          </section>
        ) : (
          <EpisodeUnAvailable />
        )}
      </>
    );
    /*[--- PODCAST ---]*/
  } else if (productType === "podcast") {
    return (
      <>
        {episodes.length > 0 ? (
          <section className="relative mb-10 flex w-full flex-col py-0 text-white">
            {episodes
              .map((item, index) => (
                <div
                  key={index}
                  className={`group flex cursor-pointer w-full gap-2 px-4 py-4 ${isOwner || item.isPurchased || item.price == 'Free' || isSubscribe ? "hover:bg-[#105CAC]" : "hover:bg-gray-900"} md:gap-4 md:rounded-lg transition-all duration-300 ease-in-out justify-between ${currentlyPlaying?.id === item.id ? "" : ""} `}
                  onClick={isOwner || item.isPurchased || item.price == 'Free' || isSubscribe ? () => handlePlayPodcast(item) : () => { handlePayment(item.id, item.price) }}
                >
                  <div className="flex gap-2 w-[200px] md:w-2xl">
                    <div className="h-24 w-24 overflow-hidden rounded-lg bg-[#DEDEDE] md:h-36 md:w-36 relative group">
                      <Image
                        priority
                        src={item.coverPodcastEpisodeURL}
                        alt={`poster-${item.title}`}
                        className="h-full w-full rounded object-cover object-center"
                        width={144}
                        height={144}
                      />
                      {isOwner || item.isPurchased || item.price == 'Free' || isSubscribe ? (
                        <div className="group-hover:opacity-100 opacity-0 transition-all duration-300 ease-in-out absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center h-full w-full">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-[radial-gradient(circle,_#193B89BF_0%,_transparent_80%)] h-20 w-20" />
                          <div className="relative h-32 w-32">
                            <Image
                              priority
                              src={iconPlay}
                              alt="icon-play"
                              className="h-full w-full rounded object-cover object-center"
                              fill
                            />
                          </div>
                        </div>) : (
                        <div className="group-hover:opacity-100 opacity-0 transition-all duration-300 ease-in-out absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center h-full w-full">
                          {/* Buat dia ditengah */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-[radial-gradient(circle,_#193B89BF_0%,_transparent_80%)] h-20 w-20" />
                          <div className="relative h-16 w-16">
                            <Image
                              priority
                              src={iconLocked}
                              alt="icon-locked"
                              className="h-full w-full rounded object-cover object-center"
                              fill
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between sm:w-3/5">
                      <div className="flex flex-col">
                        <h4
                          className={`zeinFont mb-1 [display:-webkit-box] w-fit overflow-hidden text-xl leading-5 font-extrabold text-ellipsis [-webkit-box-orient:vertical] [-webkit-line-clamp:2] md:text-2xl`}
                        >
                          {item.title}
                        </h4>
                        <p className="text-xs font-normal text-white/50 lg:text-sm">
                          <span className="md:hidden line-clamp-3">
                            {item.description
                              .split(" ")
                              .slice(0, 5)
                              .join(" ")}
                            ...
                          </span>
                          <span className="hidden md:inline">
                            {item.description}
                          </span>
                        </p>
                      </div>
                      <p className="text-[10px] font-normal text-white/70 md:text-sm">
                        {formatDateTime(item.createdAt, "short")}
                      </p>
                    </div>
                  </div>

                  <div className="w-1.2/5 montserratFont flex items-center justify-center text-xs font-semibold text-white/50 sm:w-1/5 lg:text-base line-clamp-1">
                    17m
                  </div>

                  <div className="w-1.8/5 flex items-center justify-end gap-2 sm:w-1/5">
                    <div className="rounded border-2 border-[#F5F5F524] bg-[#F5F5F524] p-1">
                      <Image
                        priority
                        src={isOwner || item.isPurchased || item.price == 'Free' || isSubscribe ? iconUnlocked : iconLocked}
                        alt="icon-locked"
                        className="h-full w-full rounded object-cover object-center"
                        width={16}
                        height={16}
                      />
                    </div>
                    <Link href={'/report/episode_podcast/' + item.id} className="relative h-6 w-6 cursor-pointer transition-transform duration-150 active:scale-90">
                      <Image
                        priority
                        src={iconFlag}
                        alt="icon-save-outline"
                        className="rounded object-cover object-center"
                        fill
                      />
                    </Link>
                    <div className="relative h-6 w-6 cursor-pointer transition-transform duration-150 active:scale-90">
                      <Image
                        priority
                        src={iconSaveOutline}
                        alt="icon-save-outline"
                        className="rounded object-cover object-center"
                        fill
                      />
                    </div>
                    <button
                      className="relative z-0 h-6 w-6 cursor-pointer transition-transform duration-150 active:scale-90"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelectedPodcast(item);
                      }}
                    >
                      <Image
                        priority
                        src={iconMore}
                        alt="icon-more"
                        className="rounded object-cover object-center"
                        fill
                      />
                    </button>
                  </div>

                </div>

              ))}

            {episodes.length < totalEpisodes && (
              <div className="flex w-full justify-center mt-4">
                <button
                  className="zeinFont rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  onClick={() => handleLoadAllEpisodes(false)}
                >
                  Load More Episodes
                </button>
              </div>
            )}

            {isPodcastModalVisible && (
              <PodcastMoreDetail
                coverEpisodeUrl={selectedPodcast.coverPodcastEpisodeURL}
                title={selectedPodcast.title}
                description={selectedPodcast.description}
                creator={selectedPodcast.creator}
                createdAt={formatDateTime(selectedPodcast.createdAt, "short")}
                handlePodcastModal={handlePodcastModal}
              />
            )}
          </section>
        ) : (
          <EpisodeUnAvailable />
        )}
      </>
    );
  }
}

ProductEpisodeSection.propTypes = {
  productType: PropTypes.string.isRequired,
  productEpisodes: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  currentlyPlaying: PropTypes.object,
  handlePlayPodcast: PropTypes.func,
  handlePayment: PropTypes.func,
  isSubscribe: PropTypes.bool,
  productId: PropTypes.string,
  itemClassname: PropTypes.string,
  containerClassname: PropTypes.string,
  isOwner: PropTypes.bool,
};

function EpisodeUnAvailable() {
  return (
    <div className="px-14 py-6">
      <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#393939] py-4">
        <h4 className={`zeinFont text-xl font-semibold text-white md:text-2xl`}>
          Belum Ada Episode Tersedia
        </h4>
      </div>
    </div>
  );
}

function SeeAnotherEpisodes({ showAll, handleShowAll, itemClassname }) {
  return (
    !showAll && (
      <div
        className={`absolute flex w-screen items-end py-2 transition-all duration-300 ${itemClassname} ease-in-out ${showAll ? "bottom-[-45px] h-fit" : "bottom-0 h-45 bg-gradient-to-b from-[#39393900] via-[#393939CC] to-[#393939FF]"}`}
      >
        <div
          className="group flex w-screen cursor-pointer justify-center hover:text-blue-500"
          onClick={handleShowAll}
        >
          <p
            className={`zeinFont text-2xl font-extrabold hover:text-blue-500 ${showAll ? "text-white/50 " : "text-white"}`}
          >
            {showAll ? "Lihat Lebih Sedikit" : "Lihat Lainnya"}
          </p>
        </div>
      </div>
    )
  );
}

export function PodcastMoreDetail({
  coverEpisodeUrl,
  title,
  description,
  createdAt,
  handlePodcastModal,
}) {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5"
      onClick={handlePodcastModal}
    >
      <div
        className="flex w-md flex-col rounded-2xl border-1 border-[#F5F5F580] bg-transparent px-4 pt-2 drop-shadow-2xl backdrop-blur-sm md:w-lg lg:w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex w-full items-center justify-center">
          <p className="zeinFont py-2 text-xl font-semibold">Detail</p>
          <button
            className="absolute top-1/2 right-0 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-[#97979766] text-xl font-bold text-white"
            onClick={handlePodcastModal}
          >
            <span className="lg:-mt-1">&times;</span>
          </button>
        </div>

        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full items-center justify-center">
            <figure className="relative h-36 w-36 rounded-lg">
              {coverEpisodeUrl && (
                <Image
                  src={coverEpisodeUrl}
                  alt="cover-episode"
                  className="h-full w-full rounded-lg object-cover object-center"
                  fill
                  priority
                />
              )}
            </figure>
          </div>

          <div className="mt-2">
            <h1 className="zeinFont text-2xl font-bold text-white">{title}</h1>
            <p className="montserratFont line-clamp-3 text-justify text-sm text-[#F1F1F1] lg:line-clamp-5">
              {description}
            </p>
          </div>

          <div className="mt-2 flex flex-col gap-3">
            <h2 className="zeinFont w-full text-center text-2xl font-bold text-white">
              Kreator
            </h2>

            <div className="flex w-full flex-wrap justify-center gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center"
                >
                  <figure className="relative mb-3 h-15 w-15 rounded-full">
                    <Image
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=687&q=80"
                      alt="creator"
                      className="h-full w-full rounded-full object-cover object-center"
                      fill
                      priority
                    />
                  </figure>
                  <h4 className="zeinFont text-xl leading-3 font-bold">
                    John Doe
                  </h4>
                  <p className="montserratFont text-[10px] leading-5 font-thin">
                    @gustisan
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="montserratFont mb-2 flex w-full items-center justify-center py-1 text-center text-xs text-white/50 italic">
            {createdAt}
          </p>
        </div>
      </div>
    </div>
  );
}

SeeAnotherEpisodes.propTypes = {
  showAll: PropTypes.bool.isRequired,
  handleShowAll: PropTypes.func.isRequired,
  itemClassname: PropTypes.string,
};

PodcastMoreDetail.propTypes = {
  coverEpisodeUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  creator: PropTypes.array.isRequired,
  createdAt: PropTypes.string.isRequired,
  handlePodcastModal: PropTypes.func.isRequired,
  withEpisodes: PropTypes.bool.isRequired,
};
