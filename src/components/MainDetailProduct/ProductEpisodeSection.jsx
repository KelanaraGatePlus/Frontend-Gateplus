"use client";
import React, { useState, useEffect } from "react";
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
// import iconPause from "@@/icons/icons-pause.svg";

export default function ProductEpisodeSection({
  productType,
  productEpisodes,
  isLoading,
  currentlyPlaying,
  handlePlayPodcast,
  handlePayment,
  isSubscribe = false
}) {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState({});
  const [isPodcastModalVisible, setIsPodcastModalVisible] = useState(false);

  const handleShowAll = () => {
    setShowAll(!showAll);
  };

  const handlePodcastModal = () => {
    setIsPodcastModalVisible(!isPodcastModalVisible);
  };

  const handleSelectedPodcast = (item) => {
    setSelectedPodcast(item);
    handlePodcastModal();
  };

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
        {productEpisodes?.length > 0 ? (
          <section className="relative flex w-full flex-col py-5 text-white">
            {/* Lihat episode pertama */}
            <div className="flex">
              <div className="mb-1 flex w-full items-center justify-center gap-2 rounded-lg bg-[#393939] py-2">
                <h4 className={`zeinFont text-2xl font-bold`}>
                  Lihat Episode Pertama
                </h4>
                <div className="flex h-8 w-8 items-center justify-center">
                  <Image
                    priority
                    width={35}
                    alt="logo-arrow-down"
                    src={iconArrowDown}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* List episode */}
            {(showAll ? productEpisodes : productEpisodes.slice(0, 5))
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((item, index) => (
                <button key={index} onClick={item.isPurchased || item.price == 'Free' || isSubscribe ? () => { window.location.href = `${parentPath}/${item.id}` } : () => { handlePayment(item.id, item.price, 'EBOOK') }}>
                  <div className="group flex cursor-pointer items-stretch gap-2 px-4 py-2 hover:bg-[#1F6E8A] md:gap-4">
                    {/* Book Container */}
                    <div className="h-24 w-24 overflow-hidden rounded-lg md:h-36 md:w-36">
                      <Image
                        priority
                        src={productType === "ebook" ? item.coverEpisodeUrl : productType === "comic" ? item.coverImageUrl : item.thumbnailUrl}
                        alt={`poster-${item.title}`}
                        className="h-full w-full rounded object-cover object-center"
                        width={144}
                        height={144}
                      />
                    </div>

                    {/* Description */}
                    <div className="flex flex-1 flex-col items-stretch justify-between rounded-lg bg-[#393939] p-2 group-hover:bg-[#21414C]">
                      <div className="flex flex-col">
                        <div className="flex flex-col-reverse items-start justify-start sm:flex-row sm:justify-between">
                          <h4
                            className={`zeinFont my-2 [display:-webkit-box] w-fit overflow-hidden text-xl leading-5 font-extrabold text-ellipsis [-webkit-box-orient:vertical] [-webkit-line-clamp:2] md:text-2xl`}
                          >
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xl font-extrabold md:mr-2">
                            <div className="rounded border-2 border-[#F5F5F524] bg-[#F5F5F524] p-1">
                              <Image
                                priority
                                src={item.isPurchased || item.price == 'Free' || isSubscribe ? iconUnlocked : iconLocked}
                                alt={`poster-${item.title}`}
                                className="h-full w-full rounded object-cover object-center"
                                width={16}
                                height={16}
                              />
                            </div>
                            <div className="rounded border-2 border-[#F5F5F524] bg-[#F5F5F524] p-1 text-xs font-semibold">
                              Rp. {item.price}
                            </div>
                            <h4
                              className={`zeinFont mt-1 [display:-webkit-box] w-fit overflow-hidden text-xl font-extrabold text-ellipsis [-webkit-box-orient:vertical] [-webkit-line-clamp:2] md:text-2xl`}
                            >
                              {`# ${String(index + 1).padStart(2, "0")}`}
                            </h4>
                          </div>
                        </div>
                        <p className="hidden text-sm font-normal md:block">
                          {item.description}
                        </p>
                      </div>
                      <p className="text-[10px] font-normal md:text-sm">
                        {formatDateTime(item.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}

            {/* Lihat Lainnya */}
            <SeeAnotherEpisodes
              productEpisodes={productEpisodes}
              showAll={showAll}
              handleShowAll={handleShowAll}
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
        {productEpisodes?.length > 0 ? (
          <section className="relative mb-10 flex w-full flex-col py-0 text-white">
            {(showAll ? productEpisodes : productEpisodes.slice(0, 5))
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((item, index) => (
                <div
                  key={index}
                  className={`group flex cursor-pointer w-full gap-2 px-4 py-4 ${item.isPurchased || item.price == 'Free' || isSubscribe ? "hover:bg-[#105CAC]" : "hover:bg-gray-900"} md:gap-4 md:rounded-lg transition-all duration-300 ease-in-out justify-between ${currentlyPlaying?.id === item.id ? "" : ""} `}
                  onClick={item.isPurchased || item.price == 'Free' || isSubscribe ? () => handlePlayPodcast(item) : () => { handlePayment(item.id, item.price) }}
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
                      {item.isPurchased || item.price == 'Free' || isSubscribe ? (
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
                        src={item.isPurchased || item.price == 'Free' || isSubscribe ? iconUnlocked : iconLocked}
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

            {/* Lihat Lainnya */}
            <SeeAnotherEpisodes
              productEpisodes={productEpisodes}
              showAll={showAll}
              handleShowAll={handleShowAll}
            />

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

function SeeAnotherEpisodes({ productEpisodes, showAll, handleShowAll }) {
  return (
    productEpisodes.length > 5 && (
      <div
        className={`absolute left-0 flex w-screen items-end py-2 transition-all duration-300 ease-in-out ${showAll ? "bottom-[-45px] h-fit" : "bottom-0 h-45 bg-gradient-to-b from-[#39393900] via-[#393939CC] to-[#393939FF]"}`}
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
  // eslint-disable-next-line no-unused-vars
  creator,
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
  productEpisodes: PropTypes.array.isRequired,
  showAll: PropTypes.bool.isRequired,
  handleShowAll: PropTypes.func.isRequired,

};

PodcastMoreDetail.propTypes = {
  coverEpisodeUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  creator: PropTypes.array.isRequired,
  createdAt: PropTypes.string.isRequired,
  handlePodcastModal: PropTypes.func.isRequired,
};
