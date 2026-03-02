"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import DOMPurify from "dompurify";

import logoDislike from "@@/logo/logoDetailFilm/dislike-icons.svg";
import logoLike from "@@/logo/logoDetailFilm/like-icons.svg";
import logoSave from "@@/logo/logoDetailFilm/save-icons.svg";
import iconLikeSolid from "@@/logo/logoDetailFilm/liked-icons.svg";
import iconDislikeSolid from "@@/logo/logoDetailFilm/dislike-icons-solid.svg";
import iconSaveSolid from "@@/logo/logoDetailFilm/saved-icons.svg";

import DefaultVideoPlayer from "@/components/VideoPlayer/DefaultVideoPlayer";
import DefaultShareButton from "@/components/ShareButton/DefaultShareButton";
import CommentComponent from "@/components/Comment/page";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import CompleteProfileModal from "@/components/Modal/CompleteProfileModal";
import UnderAgeModal from "@/components/Modal/UnderAgeModal";

import { useGetMovieByIdQuery } from "@/hooks/api/movieSliceAPI";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";
import { useAddLastSeenMutation } from "@/hooks/api/lastSeenSliceAPI";
import { useGetCommentByMovieQuery } from "@/hooks/api/commentSliceAPI";
import { useLikeContent } from "@/lib/features/useLikeContent";
import { useDislikeContent } from "@/lib/features/useDislikeContent";
import { useSaveContent } from "@/lib/features/useSaveContent";
import useSyncUserData from "@/hooks/api/useSyncUserData";
import { useGetUserId } from "@/lib/features/useGetUserId";
import getMinAge from "@/lib/helper/minAge";
import formatDuration from "@/lib/helper/formatDurationHelper";
import slugifyTitle from "@/lib/helper/slugifyTitle";

import Toast from "@/components/Toast/page";
import CreatorCard from "@/components/MainDetailProduct/CreatorCard";

function PlayingMoviePage({ params }) {
  const { id } = params;
  const userId = useGetUserId();
  const [isHydrated, setIsHydrated] = useState(false);

  const [createLog] = useCreateLogMutation();
  const [addLastSeen] = useAddLastSeenMutation();

  const { data, isLoading, refetch } = useGetMovieByIdQuery(id, {
    skip: !id || !isHydrated,
  });

  const movieData = data?.data?.data || {};
  const movieSlug = slugifyTitle(movieData?.title);
  const movieSharePath = movieSlug ? `/movies/${movieSlug}` : undefined;

  const {
    showCompleteProfileModal,
    showUnderAgeModal,
    goToProfile,
    continueDespiteUnderAge,
    userAge,
    isReady,
  } = useSyncUserData(movieData?.ageRestriction);

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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const progressRef = useRef(0);
  const [resumeSeconds, setResumeSeconds] = useState(0);

  const { data: commentData, isLoading: isLoadingGetComment } =
    useGetCommentByMovieQuery(id, { skip: !id });

  useEffect(() => {
    if (typeof window !== "undefined") setIsHydrated(true);
  }, []);

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

  const isBlurredMovie = useCallback(() => {
    if (!isReady) return true;

    const minAge = getMinAge(movieData?.ageRestriction);
    if (minAge === null) return false;
    if (userAge == null) return true;

    return userAge < minAge;
  }, [movieData?.ageRestriction, userAge, isReady]);

  useEffect(() => {
    if (id) {
      createLog({
        contentType: "film",
        logType: "CLICK",
        contentId: id,
      });

      addLastSeen({
        contentType: "FILM",
        contentId: id,
      });
    }
  }, [id, createLog, addLastSeen]);

  useEffect(() => {
    if (movieData?.id) {
      setIsLiked(movieData.isLiked || false);
      setIdLiked(movieData?.isLiked?.id || null);
      setTotalLike(movieData.likes || 0);
      setIsDisliked(movieData.isDisliked || false);
      setIdDisliked(movieData?.isDisliked?.id || null);
      setIsSaved(movieData.isSaved || false);
      setIdSaved(movieData?.isSaved?.id || null);
    }
  }, [movieData]);

  const handleProgressUpdate = useCallback(
    async (seconds) => {
      if (seconds == null) return;
      progressRef.current = seconds;
      // Update UI state immediately when progress changes
      setResumeSeconds(seconds);

      // save ke db ketika pause
      if (!movieData?.id) return;
      if (seconds <= 0) return;

      try {
        await addLastSeen({
          contentType: "FILM",
          contentId: movieData.id,
          progressSeconds: seconds,
        }).unwrap();

        console.log("progress saved on pause", seconds);

        refetch();
      } catch (err) {
        console.error("save progress on pause gagal", err);
      }
    },
    [movieData?.id, addLastSeen, refetch],
  );

  const saveMovieProgress = useCallback(async () => {
    if (!movieData?.id) return;
    if (!progressRef.current || progressRef.current <= 0) return;

    const seconds = progressRef.current;

    try {
      await addLastSeen({
        contentType: "FILM",
        contentId: movieData.id,
        progressSeconds: seconds,
      }).unwrap();

      console.log("progress saved", seconds);
    } catch (err) {
      console.error("save progress gagal", err);
    }
  }, [movieData?.id, addLastSeen]);

  useEffect(() => {
    if (!movieData?.id) return;

    const interval = setInterval(saveMovieProgress, 10000);

    return () => clearInterval(interval);
  }, [movieData?.id, saveMovieProgress]);

  useEffect(() => {
    const handleLeave = () => saveMovieProgress();
    window.addEventListener("beforeunload", handleLeave);
    return () => window.removeEventListener("beforeunload", handleLeave);
  }, [saveMovieProgress]);

  const { data: progressData } = useGetMovieByIdQuery(
    {
      contentId: movieData?.id,
      contentType: "FILM",
    },
    { skip: !movieData?.id },
  );

  const lastProgress = progressData?.data?.progressSeconds || 0;
  console.log("START FROM API", lastProgress);

  useEffect(() => {
    const seconds = movieData?.WatchProgress?.[0]?.progressSeconds;
    if (seconds != null) {
      setResumeSeconds(seconds);
    }
  }, [movieData?.WatchProgress]);

  const handleToggleLike = () => {
    if (!movieData.id) return;

    if (isDisliked) {
      toggleDislike({
        isDisliked: true,
        id: movieData.id,
        fieldKey: "movieId",
        idDisliked,
        setIsDisliked,
        setIdDisliked,
      });
    }

    toggleLike({
      isLiked,
      id: movieData.id,
      fieldKey: "movieId",
      idLiked,
      setIsLiked,
      setTotalLike,
      setIdLiked,
    });
  };

  const handleToggleDislike = () => {
    if (!movieData.id) return;

    if (isLiked) {
      toggleLike({
        isLiked: true,
        id: movieData.id,
        fieldKey: "movieId",
        idLiked,
        setIsLiked,
        setTotalLike,
        setIdLiked,
      });
    }

    toggleDislike({
      isDisliked,
      id: movieData.id,
      fieldKey: "movieId",
      idDisliked,
      setIsDisliked,
      setIdDisliked,
    });
  };

  const handleToggleSave = () => {
    toggleSave({
      isSaved,
      title: movieData.title,
      id: movieData.id,
      fieldKey: "movieId",
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
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleSubscribe = () => {
    window.location.href = `/checkout/subscribe/movie/${movieData.id}`;
  };

  if (!isHydrated || isLoading || !data || !isReady) return <LoadingOverlay />;

  const hasAccess =
    movieData?.isOwner ||
    movieData?.isSubscribed ||
    movieData?.price === "Free";

  const isAgeAllowed = !isBlurredMovie();
  const canPlay = hasAccess && isAgeAllowed;

  return (
    <div>
      <section className="relative flex justify-center rounded-md">
        <div className="relative mx-auto flex w-screen justify-center rounded-lg">
          {movieData?.id && (
            <>
              {isBlurredMovie() && (
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/70 text-xl font-bold text-white backdrop-blur-md">
                  Konten ini terkunci karena batas usia
                </div>
              )}

              <DefaultVideoPlayer
                contentId={movieData.id}
                contentType="FILM"
                logType={canPlay ? "WATCH_CONTENT" : "WATCH_TRAILER"}
                playbackId={canPlay ? movieData?.muxPlaybackId : null}
                src={
                  canPlay ? movieData?.movieFileUrl : movieData?.trailerFileUrl
                }
                poster={movieData?.posterImageUrl}
                startFrom={resumeSeconds}
                title={movieData?.title}
                ageRestriction={movieData?.ageRestriction}
                onProgressUpdate={handleProgressUpdate}
              />
            </>
          )}
        </div>
      </section>

      <main className="mt-10 px-4 text-white md:px-15">
        {/* TITLE */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex w-full flex-col gap-4 md:w-1/2">
            <h1 className="text-4xl font-black">{movieData?.title}</h1>
            <p>
              {formatDuration(movieData?.duration)} |{" "}
              {movieData?.ageRestriction}
            </p>
            <div className="mt-2 flex gap-6">
              <button
                onClick={() => {
                  if (!hasAccess) handleSubscribe();
                  else window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-48 rounded-3xl bg-[#0076E999] px-12 py-3 font-bold"
              >
                {hasAccess ? "Watch" : "Buy"}
              </button>

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
                contentType="MOVIE"
                sharePath={movieSharePath}
              />
            </div>
          </div>

          <div className="flex md:self-end">
            <CreatorCard
              creatorDetail={movieData?.creator}
              totalSubs={movieData?.creator?.totalSubscribers || 0}
              initialIsSubscribed={movieData?.isSubscribed || false}
            />
          </div>
        </div>

        <section className="mt-5 flex flex-row items-stretch gap-3">
          {/* Poster 3:2 */}
          <div className="relative aspect-[2/3] w-[220px] flex-shrink-0 sm:w-[160px] lg:w-[250px]">
            {movieData.thumbnailImageUrl && (
              <img
                src={movieData.thumbnailImageUrl}
                alt={movieData.title}
                className="rounded-md object-cover"
              />
            )}
          </div>
          {/* Deskripsi */}
          <div className="flex-1 rounded-md bg-[#393939]">
            <div className="mx-4 my-4 flex h-full flex-col text-white">
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(movieData?.description || ""),
                }}
              />

              <div className="mt-10">
                <p>Judul: {movieData.title}</p>
                <p>Sutradara : {movieData.director}</p>
                <p>Rumah Produksi : {movieData.productionHouse}</p>
                <p>Produser : {movieData.producer}</p>
                <p>Penulis Cerita : {movieData.writer}</p>
                <p>Pemeran : {movieData.talent}</p>
                <p>Durasi : {formatDuration(movieData.duration)}</p>
                <p>
                  Genre :{" "}
                  {Array.isArray(movieData?.categories)
                    ? movieData.categories
                        .map(
                          (cat) => cat.category?.tittle || cat.category?.title,
                        )
                        .filter(Boolean)
                        .join(", ")
                    : movieData?.categories?.tittle ||
                      movieData?.categories?.title}
                </p>
                <p>Tahun Rilis : {movieData.releaseYear}</p>
                <p>Bahasa : {movieData.language}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className="mt-10">
        <CarouselTemplate
          label="Banyak Dilihat"
          type="movie"
          contents={data?.data?.topContent || []}
          isLoading={!data}
          isBlurred={isBlurred}
        />

        <CarouselTemplate
          label="Rekomendasi Serupa"
          type="movie"
          contents={data?.data?.recommendation || []}
          isLoading={!data}
          isBlurred={isBlurred}
        />
      </section>

      {commentData && (
        <div className="mt-5 md:px-11">
          <CommentComponent
            commentData={commentData?.data?.data || []}
            isLoadingGetComment={isLoadingGetComment}
            contentType="MOVIE"
            episodeId={id}
          />
        </div>
      )}
      {showCompleteProfileModal && (
        <CompleteProfileModal
          onConfirm={goToProfile}
          title={movieData?.title}
          minAge={getMinAge(movieData?.ageRestriction)}
        />
      )}

      {showUnderAgeModal && (
        <UnderAgeModal
          open={showUnderAgeModal}
          ageRestriction={movieData?.ageRestriction}
          title={movieData?.title}
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
    </div>
  );
}

PlayingMoviePage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
};

export default PlayingMoviePage;
