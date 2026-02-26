"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import PropTypes from "prop-types";

/*[--- UTILITY IMPORT ---]*/
import ProductEpisodeSkeleton from "./Loading/ProductEpisodeLoading";

/*[--- UTILITY IMPORT ---]*/
import { formatDateTime } from "@/lib/timeFormatter";

/*[--- ASSETS IMPORT ---]*/
import iconArrowDown from "@@/logo/logoDetailEbook/icon-arrow-down.svg";
import iconMore from "@@/icons/icons-more.svg";
import Link from "next/link";
import useGetLazyEpisodeByType from "@/hooks/helper/getEpisodeByType";
import { Icon } from "@iconify/react";
import usePodcastController from "@/hooks/usePodcastController";
import { usePodcastPlayer } from "@/context/PodcastPlayerContext";
import { DEFAULT_AVATAR } from "@/lib/defaults";
import ExpandView from "../PodcastPlayer/ExpandView";
import RichTextDisplay from "@/components/RichTextDisplay/page";

export default function ProductEpisodeSection({
  productType,
  isLoading,
  handlePlayPodcast,
  handlePayment,
  isSubscribe = false,
  productId = false,
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
  const {
    isExpand,
    handleExpand,
    currentlyPlaying,
    isPlaying,
    bounceSpeed,
    speed,
  } = usePodcastPlayer();
  const [isCommentVisible, setIsCommentVisible] = useState(false);

  // audio controller integration (moved to hook)
  const { currentTime, duration, handleSeekEvent, togglePlay } =
    usePodcastController();

  // Hanya eksekusi sekali saja saat komponen dimount
  useEffect(() => {
    handleLoadAllEpisodes();
  }, [productId, productType]);

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
  };

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
        lastEpisodeRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }

    if (lastEpisodeRef.current) {
      lastEpisodeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  useEffect(() => {
    setShowSkeleton(isLoading);
  }, [isLoading]);

  // progress podcast
  const handlePlayWithPodcast = (item) => {
    if (!handlePlayPodcast) return;

    const progressKey = `podcast_progress_${item.id}`;
    const savedProgress = localStorage.getItem(progressKey);

    const progressValue = savedProgress ? Number(savedProgress) : 0;

    handlePlayPodcast({
      ...item,
      savedProgress: progressValue,
    });
  };

  if (showSkeleton) return <ProductEpisodeSkeleton />;

  /*[--- EBOOK and COMIC ---]*/
  if (
    productType === "ebook" ||
    productType === "comic" ||
    productType === "series"
  ) {
    const parentPath =
      productType === "ebook"
        ? "/ebooks/read"
        : productType == "comic"
          ? "/comics/read"
          : "/series/watch";
    return (
      <>
        {episodes?.length > 0 ? (
          <section
            className={`relative flex w-full flex-col gap-3 py-5 text-white ${containerClassname}`}
          >
            {/* Lihat episode pertama */}
            {totalEpisodes > 5 && (
              <button
                className={`flex hover:cursor-pointer ${itemClassname}`}
                onClick={() => {
                  handleScroll();
                }}
              >
                <div
                  className={`mb-1 flex w-full items-center justify-center gap-2 rounded-md bg-[#393939] py-4`}
                >
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
              </button>
            )}

            {/* List episode */}
            {episodes.map((item, index) => {
              const coverUrl =
                productType === "ebook"
                  ? item.coverEpisodeUrl
                  : productType === "comic"
                    ? item.coverImageUrl
                    : item.thumbnailUrl;
              const isLoaded = imageStatus[item.id] === "loaded";
              const hasError = imageStatus[item.id] === "error";
              const episodeNumber = totalEpisodes - index;

              // Adjust font size based on digit count
              const getFontSizeClass = (episodeNumber) => {
                const digitCount = episodeNumber.toString().length;
                if (digitCount === 1)
                  return "text-[116px] 2xl:text-[135px] -bottom-12.5 -left-13 2xl:-bottom-12.5 2xl:-left-15";
                if (digitCount === 2)
                  return "text-[64px] 2xl:text-[80px] -bottom-7 -left-7 2xl:-bottom-8 2xl:-left-8";
                if (digitCount === 3)
                  return "text-[40px] 2xl:text-[45px] -bottom-4 -left-4 2xl:-bottom-4 2xl:-left-3";
                return "text-[55px] 2xl:text-[65px] -bottom-6 -left-5 2xl:-bottom-7 2xl:-left-6";
              };

              return (
                <button
                  ref={index + 1 == totalEpisodes ? lastEpisodeRef : null}
                  key={index}
                  onClick={
                    isOwner ||
                    item.isPurchased ||
                    item.price == "Free" ||
                    isSubscribe
                      ? () => {
                          window.location.href = `${parentPath}/${item.id}`;
                        }
                      : () => {
                          handlePayment(item.id, item.price, "EBOOK");
                        }
                  }
                >
                  <div
                    className={`group flex cursor-pointer items-stretch gap-2 py-2 hover:bg-[#1F6E8A] md:gap-4 ${itemClassname}`}
                  >
                    {/* Book Container */}
                    <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-[#979797] 2xl:h-25 2xl:w-25">
                      {/* Show episode number as fallback or while loading */}
                      {(!coverUrl || !isLoaded || hasError) && (
                        <div className="relative h-full w-full bg-[#979797]">
                          <p
                            className={`${getFontSizeClass(episodeNumber)} montserratFont absolute font-bold text-white`}
                          >
                            #{episodeNumber}
                          </p>
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
                          onLoadingComplete={() =>
                            setImageStatus((prev) => ({
                              ...prev,
                              [item.id]: "loaded",
                            }))
                          }
                          onError={() =>
                            setImageStatus((prev) => ({
                              ...prev,
                              [item.id]: "error",
                            }))
                          }
                        />
                      )}

                      {!isOwner &&
                        !item.isPurchased &&
                        !(item.price == "Free") || !isSubscribe && (
                          <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-[#F5F5F533] backdrop-blur-xs transition-all duration-300 ease-in-out">
                            <Icon
                              icon={"solar:lock-keyhole-minimalistic-linear"}
                              className="h-4 w-4 text-red-600 md:h-8 md:w-8"
                            />
                          </div>
                        )}
                    </div>

                    {/* Book Info */}
                    <div className="flex w-full items-center justify-between">
                      <div className="montserratFont flex h-full flex-col items-start justify-between py-2 text-[#AFAFAF] md:justify-center md:py-0">
                        <h1 className="zeinFont text-[16px] font-bold text-white md:text-2xl">
                          {item.title}
                        </h1>
                        <div className="hidden text-start md:block">
                          <RichTextDisplay
                            content={
                              item.description?.substring(0, 265) +
                              (item.description?.length > 265 ? "..." : "")
                            }
                          />
                        </div>
                        <p className="block text-sm md:hidden md:text-[16px]">
                          {formatDateTime(item.createdAt, "short")}
                        </p>
                        <p className="hidden text-sm md:block md:text-[16px]">
                          {formatDateTime(item.createdAt, "long")}
                        </p>
                      </div>

                      {/* Lock */}
                      {!isOwner &&
                        !item.isPurchased &&
                        !(item.price == "Free") || !isSubscribe && (
                          <div className="zeinFont flex h-full w-max flex-col items-end justify-between">
                            <div className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#967074] bg-[#63282e] p-1 md:p-2">
                              <Icon
                                icon={"solar:lock-keyhole-minimalistic-linear"}
                                className="h-4 w-4"
                              />
                              <p className="zeinFont font-bold">Terkunci</p>
                            </div>
                            <p className="font-bold">
                              Rp{" "}
                              {item.price == "Free"
                                ? "0"
                                : item.price.toLocaleString("id-ID")}
                            </p>
                          </div>
                        )}

                      {/* Open */}
                      {(isOwner || item.isPurchased || item.price == "Free") &&
                        !item.isWatched && (
                          <div className="flex w-max items-center justify-center gap-2 rounded-lg border-2 border-[#F5F5F559] bg-[#1FC16B4D] p-1 md:p-2">
                            <Icon
                              icon={"solar:notebook-minimalistic-linear"}
                              className="h-4 w-4 rounded-md"
                            />
                            <p className="zeinFont font-bold">Baca</p>
                          </div>
                        )}

                      {/* Already Read */}
                      {item.isWatched &&
                        (isOwner ||
                          item.isPurchased ||
                          item.price == "Free") || isSubscribe && (
                          <Link
                            href={`/report/${productType == "ebook" ? "episode_ebook" : productType == "comic" ? "episode_comic" : productType == "movie" ? "episode_movie" : "episode_series"}/${item.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="z-20 h-6 w-6 cursor-pointer p-1 transition-transform duration-150 active:scale-90 md:p-2"
                          >
                            <Icon
                              className="h-8 w-8 rotate-90"
                              icon={"solar:menu-dots-line-duotone"}
                            />
                          </Link>
                        )}
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
          <section
            className={`relative flex w-full flex-col gap-3 py-5 text-white ${containerClassname}`}
          >
            {episodes.map((item) => {
              const canAccess =
                isOwner ||
                item.isPurchased ||
                item.price === "Free" ||
                isSubscribe;

              return (
                <button
                  key={item.id}
                  onClick={
                    canAccess
                      ? () => handlePlayWithPodcast(item)
                      : () => handlePayment(item.id, item.price)
                  }
                  className="flex flex-col justify-between"
                >
                  <div
                    className={`group flex cursor-pointer items-stretch gap-2 py-2 hover:bg-[#1F6E8A] md:gap-4 ${itemClassname}`}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-28 w-28 overflow-hidden rounded-lg bg-[#979797] 2xl:h-30 2xl:w-30">
                      <Image
                        priority
                        src={item.coverPodcastEpisodeURL}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        width={144}
                        height={144}
                      />

                      {/* Overlay lock */}
                      {!canAccess && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                          <Icon
                            icon="solar:lock-keyhole-minimalistic-linear"
                            className="h-6 w-6 text-red-500"
                          />
                        </div>
                      )}

                      {/* Overlay play */}
                      {canAccess && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                          <Icon
                            icon="solar:play-circle-bold"
                            className="h-10 w-10 text-white"
                          />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex w-full flex-col gap-2">
                      <div className="flex h-full w-full items-start justify-between">
                        <div className="montserratFont flex h-full flex-col items-start justify-between py-1 text-[#AFAFAF]">
                          <div>
                            <h1 className="zeinFont text-start text-[16px] font-bold text-white md:text-2xl">
                              {item.title}
                            </h1>
                            <div className="hidden text-start md:block">
                              <RichTextDisplay
                                content={item.description?.substring(0, 30) + (item.description?.length > 30 ? '...' : '')}
                              />
                            </div>
                          </div>
                          <p className="text-sm font-bold md:text-[16px]">
                            {formatDateTime(item.createdAt, "short")}
                          </p>
                        </div>
                        {/* Right Action */}
                        <div className="flex items-center gap-3">
                          {!canAccess && (
                            <div className="zeinFont flex h-full flex-col items-end justify-between gap-4">
                              <div className="flex items-center gap-2 rounded-lg border-2 border-[#967074] bg-[#63282e] px-2 py-1">
                                <Icon icon="solar:lock-keyhole-minimalistic-linear" />
                                <p className="font-bold">Terkunci</p>
                              </div>
                              <p className="font-bold">
                                Rp{" "}
                                {item.price === "Free"
                                  ? "0"
                                  : item.price.toLocaleString("id-ID")}
                              </p>
                            </div>
                          )}
                          {canAccess && !item.isWatched && (
                            <div className="flex flex-row items-center justify-center gap-2 rounded-lg border-2 border-[#F5F5F559] bg-[#1FC16B4D] px-3 py-1">
                              <Icon
                                icon={"solar:notebook-minimalistic-linear"}
                                className="h-4 w-4 rounded-md"
                              />
                              <p className="zeinFont font-bold">Putar</p>
                            </div>
                          )}
                          {/* More */}
                          <button
                            className="relative h-6 w-6"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSelectedPodcast(item);
                            }}
                          >
                            <Image
                              priority
                              src={iconMore}
                              alt="more"
                              fill
                              className="rotate-90"
                            />
                          </button>
                        </div>
                      </div>
                      {currentlyPlaying?.id == item.id && (
                        <div className="flex flex-row items-center justify-between gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePlay();
                            }}
                          >
                            {isPlaying ? (
                              <Icon icon={"solar:pause-bold"} />
                            ) : (
                              <Icon icon={"solar:play-bold"} />
                            )}
                          </button>
                          <input
                            type="range"
                            name="track"
                            id="track"
                            className="h-1.5 w-full cursor-pointer appearance-none rounded-full accent-[#1297DC]"
                            min={0}
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeekEvent}
                            style={{
                              background: `linear-gradient(to right, #1297DC ${(currentTime / (duration || 1)) * 100}%, #616161 ${(currentTime / (duration || 1)) * 100}%)`,
                            }}
                          />
                          <button
                            onClick={() => {
                              bounceSpeed();
                            }}
                          >
                            <p>{speed}x</p>
                          </button>
                          <button
                            onClick={() => {
                              handleExpand();
                            }}
                          >
                            <Icon
                              icon={"solar:maximize-square-2-outline"}
                              className="h-5 w-5"
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}

            {episodes.length < totalEpisodes && (
              <SeeAnotherEpisodes
                showAll={false}
                handleShowAll={() => handleLoadAllEpisodes(false)}
                itemClassname={itemClassname}
              />
            )}

            {isPodcastModalVisible &&
              (console.log(selectedPodcast),
              (
                <PodcastMoreDetail
                  id={selectedPodcast.id}
                  coverEpisodeUrl={selectedPodcast.coverPodcastEpisodeURL}
                  title={selectedPodcast.title}
                  description={selectedPodcast.description}
                  collaborators={selectedPodcast.collaborators}
                  createdAt={formatDateTime(selectedPodcast.createdAt, "short")}
                  handlePodcastModal={handlePodcastModal}
                />
              ))}

            {isExpand && (
              <div className="fixed top-0 z-40 w-full">
                <ExpandView
                  episodeId={selectedPodcast?.id}
                  coverEpisodeUrl={selectedPodcast?.coverPodcastEpisodeURL}
                  title={selectedPodcast?.title}
                  description={selectedPodcast?.description}
                  duration={duration}
                  currentTime={currentTime}
                  isExpand={isExpand}
                  isCommentVisible={isCommentVisible}
                  handleViewComments={() => setIsCommentVisible((s) => !s)}
                  handleExpand={() => {
                    handleExpand();
                  }}
                />
              </div>
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
            className={`zeinFont text-2xl font-extrabold hover:text-blue-500 ${showAll ? "text-white/50" : "text-white"}`}
          >
            {showAll ? "Lihat Lebih Sedikit" : "Lihat Lainnya"}
          </p>
        </div>
      </div>
    )
  );
}

export function PodcastMoreDetail({
  id,
  coverEpisodeUrl,
  title,
  description,
  createdAt,
  handlePodcastModal,
  collaborators = [],
}) {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      onClick={handlePodcastModal}
    >
      <div
        className="flex w-md flex-col rounded-lg border-1 border-[#F5F5F580] bg-[#333333] px-4 pt-2 drop-shadow-2xl backdrop-blur-sm md:w-3xl lg:w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex w-full items-center justify-between">
          <Link
            href={"/report/episode_podcast/" + id}
            className="relative h-6 w-6"
          >
            <Icon
              icon={"solar:flag-2-outline"}
              className="h-6 w-6 text-white"
            />
          </Link>
          <p className="zeinFont py-2 text-xl font-semibold">Detail</p>
          <button
            className="flex h-6 w-6 items-center justify-center rounded-full bg-[#97979766] text-xl font-bold text-white"
            onClick={handlePodcastModal}
          >
            <span className="lg:-mt-1">&times;</span>
          </button>
        </div>

        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full items-center gap-2">
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
            <div className="flex flex-col gap-2">
              <h2 className="zeinFont font-bold">Kreator</h2>
              <div className="flex flex-row gap-2">
                {collaborators.map((item, index) => (
                  <div
                    key={index}
                    className="montserratFont flex flex-col items-center"
                  >
                    <Image
                      size="sm"
                      variant="circle"
                      className="h-16 w-16 rounded-full"
                      src={item.imageUrl || DEFAULT_AVATAR}
                    />
                    <p className="font-bold">{item.profileName}</p>
                    <p className="text-[#AFAFAF]">@{item.username}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="zeinFont text-2xl font-bold">{title}</h1>
            <div className="montserratFont text-[#AFAFAF]">
              <RichTextDisplay content={description} />
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
  id: PropTypes.string.isRequired,
  coverEpisodeUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  creator: PropTypes.array.isRequired,
  createdAt: PropTypes.string.isRequired,
  handlePodcastModal: PropTypes.func.isRequired,
  withEpisodes: PropTypes.bool.isRequired,
  collaborators: PropTypes.array,
};
