"use client";

import logoDislike from "@@/logo/logoDetailFilm/dislike-icons.svg";
import logoLike from "@@/logo/logoDetailFilm/like-icons.svg";
import logoSave from "@@/logo/logoDetailFilm/save-icons.svg";
import Image from "next/image";
import { useGetMovieByIdQuery } from "@/hooks/api/movieSliceAPI";
import DefaultVideoPlayer from "@/components/VideoPlayer/DefaultVideoPlayer";
import React, { useEffect, useState } from "react";
import SimpleModal from "@/components/Modal/SimpleModal";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";
import { useLikeContent } from "@/lib/features/useLikeContent";
import { useDislikeContent } from "@/lib/features/useDislikeContent";
import DefaultShareButton from "@/components/ShareButton/DefaultShareButton";
import PropTypes from 'prop-types';
import iconLikeSolid from "@@/logo/logoDetailFilm/liked-icons.svg";
import iconDislikeSolid from "@@/logo/logoDetailFilm/dislike-icons-solid.svg";
import iconSaveSolid from "@@/logo/logoDetailFilm/saved-icons.svg";
import { useSaveContent } from '@/lib/features/useSaveContent';
import CommentComponent from "@/components/Comment/page";
import { useGetCommentByMovieQuery } from "@/hooks/api/commentSliceAPI";
import formatDuration from "@/lib/helper/formatDurationHelper";
import CarouselTemplate from "@/components/Carousel/carouselTemplate";
import Link from "next/link";
import { DEFAULT_AVATAR } from "@/lib/defaults";

/* ===========================
   Halaman: PlayingMoviePage (JSX)
   =========================== */
function PlayingMoviePage({ params }) {
    const { id } = params;
    const { data } = useGetMovieByIdQuery(id);
    const movieData = data?.data?.data || {}; // Pindahkan ke atas agar bisa dipakai di useEffect

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedContentId, setSelectedContentId] = useState(null);
    const [selectedPrice, setSelectedPrice] = useState(null);
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
    const { data: commentData, isLoading: isLoadingGetComment } = useGetCommentByMovieQuery(id, {
        skip: !id,
    });

    useEffect(() => {
        // Mengisi state dari data API saat pertama kali dimuat
        console.log("Movie Data:", movieData); // Debugging line
        if (movieData && movieData.id) {
            setIsLiked(movieData.isLiked || false);
            setIdLiked(movieData?.isLiked?.id || null);
            setTotalLike(movieData.likes || 0);
            setIsDisliked(movieData.isDisliked || false);
            setIdDisliked(movieData?.isDisliked?.id || null);
            setIsSaved(movieData.isSaved || false);
            setIdSaved(movieData?.isSaved?.id || null);
        }
    }, [movieData]);

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
        // Lanjutkan dengan proses dislike
        toggleDislike({
            isDisliked,
            id: movieData.id,
            fieldKey: "movieId", // Pastikan key ini sesuai dengan backend
            idDisliked,
            setIsDisliked,
            setIdDisliked,
        });
    };

    const handleToggleLike = () => {
        if (!movieData.id) return; // Mencegah aksi jika data belum siap
        // Jika konten sedang di-dislike, batalkan dislike terlebih dahulu
        if (isDisliked) {
            toggleDislike({
                isDisliked: true, // Paksa jadi true untuk proses un-dislike
                id: movieData.id,
                fieldKey: "movieId",
                idDisliked,
                setIsDisliked,
                setIdDisliked,
            });
        }
        // Lanjutkan dengan proses like
        toggleLike({
            isLiked,
            id: movieData.id,
            fieldKey: "movieId", // Pastikan key ini sesuai dengan backend
            idLiked,
            setIsLiked,
            setTotalLike,
            setIdLiked,
        });
    };

    const handleSubscribe = async () => {
        window.location.href = `/checkout/subscribe/movie/${selectedContentId}`;
    };

    const handleModalOpen = (contentId, price) => {
        setSelectedContentId(contentId);
        setSelectedPrice(price);
        setIsModalOpen(true);
    };

    const handleToggleSave = () => {
        toggleSave({
            isSaved,
            title: movieData.title,
            id: movieData.id,
            fieldKey: "movieId",
            idSaved,
            setShowToast: () => { },
            setToastMessage: () => { },
            setToastType: () => { },
            setIsSaved,
            setIdSaved,
        });
    };

    useEffect(() => {
        createLog({
            contentType: "FILM",
            logType: "CLICK",
            contentId: id,
        });
    }, [id, createLog]);

    return (
        <div>
            <section className="flex justify-center rounded-md relative">
                {/* Player bergaya YouTube */}
                <div className="mx-auto my-auto flex w-screen justify-center rounded-lg object-cover">
                    {movieData?.id && <DefaultVideoPlayer
                        contentId={movieData.id}
                        contentType="FILM"
                        logType={movieData?.isOwner || movieData?.isSubscribed || movieData?.price == 'Free' ? 'WATCH_CONTENT' : 'WATCH_TRAILER'}
                        className="rounded-lg"
                        playbackId={movieData?.isOwner || movieData?.isSubscribed || movieData?.price == 'Free' ? movieData?.muxPlaybackId : null}
                        src={movieData?.isOwner || movieData?.isSubscribed || movieData?.price == 'Free' ? movieData?.movieFileUrl : movieData?.trailerFileUrl}
                        poster={movieData?.thumbnailImageUrl}
                        startFrom={movieData?.WatchProgress?.[0]?.progressSeconds || 0}
                        title={movieData?.title}
                        genre={movieData?.categories?.tittle}
                        ageRestriction={movieData?.ageRestriction}
                    />}
                </div>
            </section>

            <main className="text-white mt-10">
                <section className="w-full flex flex-col gap-4 md:gap-0 md:flex-row md:items-center justify-between pt-2 pb-4 px-4 md:px-15">
                    <div className="flex flex-col gap-4 md:w-1/2 w-full">
                        <div className="flex flex-col gap-0">
                            <h1 className="font-black text-4xl">
                                {movieData?.title || "Judul Movie Tidak Tersedia"}
                            </h1>
                            <p className=" text-sm/normal">
                                {formatDuration(movieData?.duration)} | {movieData?.ageRestriction} | {movieData?.categories?.tittle}
                            </p>
                        </div>
                        <div className="flex flex-row gap-6">
                            <div className="flex items-center justify-center w-48">
                                <button onClick={movieData?.isOwner || movieData?.isSubscribed || movieData?.price == 'Free' ? null : () => { handleModalOpen(movieData?.id, movieData?.price) }} className="rounded-3xl bg-[#0076E999] px-12 py-3 font-bold text-white w-full hover:cursor-pointer">
                                    {movieData?.isOwner || movieData?.isSubscribed || movieData?.price == 'Free' ? "Watch" : "Buy"}
                                </button>
                            </div>
                            <div onClick={handleToggleLike} className="flex items-center justify-center transition delay-150 duration-400 ease-linear hover:-translate-y-1 hover:scale-x-110 hover:scale-y-110 cursor-pointer">
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
                            </div>
                            {/* Tombol Dislike */}
                            <div onClick={handleToggleDislike} className="flex items-center justify-center cursor-pointer">
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
                            </div>
                            <div onClick={handleToggleSave} className="flex items-center justify-center cursor-pointer">
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
                            </div>
                            <DefaultShareButton contentType={'MOVIE'} />
                        </div>
                    </div>
                    <div className="flex flex-row items-center md:justify-end w-full md:w-1/2 gap-3">
                        <div className="flex items-center justify-center">
                            <Image
                                width={60}
                                height={60}
                                alt="logo-subscribers"
                                className="rounded-full"
                                src={movieData?.creator?.imageUrl !== 'null' && movieData?.creator?.imageUrl !== null ? movieData?.creator?.imageUrl : DEFAULT_AVATAR}
                                priority
                            />
                        </div>
                        <Link href={`/creator/${movieData?.creator?.id}`} className="grid grid-rows-2">
                            <div className="flex place-content-center justify-center text-2xl font-bold text-white hover:underline">
                                {movieData?.creator?.profileName}
                            </div>
                            <div className="text-sm text-white">{movieData?.totalSubscribers} followers</div>
                        </Link>
                    </div>
                </section>

                <section className="flex flex-row gap-3 items-stretch mt-5 px-4 md:px-15">
                    {/* Poster 3:2 */}
                    <div className="relative aspect-[2/3] w-[220px] sm:w-[160px] lg:w-[250px] flex-shrink-0">
                        {movieData.posterImageUrl && <Image
                            src={movieData.posterImageUrl}
                            alt="logo-racunsangga-movie"
                            layout="fill"
                            className="rounded-md object-cover"
                            priority
                        />}
                    </div>

                    {/* Deskripsi */}
                    <div className="rounded-md bg-[#393939] flex-1">
                        <div className="mx-4 my-4 text-white h-full flex flex-col">
                            <p>{movieData?.description}</p>

                            <div className="mt-10">
                                <p>Judul: {movieData.title}</p>
                                <p>Sutradara : {movieData.director}</p>
                                <p>Rumah Produksi : {movieData.productionHouse}</p>
                                <p>Produser : {movieData.producer}</p>
                                <p>Penulis Cerita : {movieData.writer}</p>
                                <p>Pemeran : {movieData.talent}</p>
                                <p>Durasi : {formatDuration(movieData.duration)}</p>
                                <p>Genre : {movieData?.categories?.tittle}</p>
                                <p>Tahun Rilis : {movieData.releaseYear}</p>
                                <p>Bahasa : {movieData.language}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-5">
                    <section className="my-10 flex flex-col">
                        <section className="mt-10">
                            <CarouselTemplate
                                label="Banyak Dilihat"
                                type="movie"
                                contents={data?.data?.topContent || []}
                                isLoading={!data}
                            />
                        </section>

                        <section className="mt-10">
                            <CarouselTemplate
                                label="Rekomendasi Serupa"
                                type="movie"
                                contents={data?.data?.recommendation || []}
                                isLoading={!data}
                            />
                        </section>
                    </section>
                </section>

                {/* Comment Baru */}
                {commentData && <div className="md:px-11">
                    <CommentComponent
                        commentData={commentData?.data?.data || []}
                        isLoadingGetComment={isLoadingGetComment}
                        contentType={"MOVIE"}
                        episodeId={id}
                    />
                </div>}

                <SimpleModal
                    title={"Subscribe untuk menikmati seluruh episode dari konten ini selama sebulan seharga Rp. " + (selectedPrice?.toLocaleString() ?? 0) + ",- ?"}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={() => handleSubscribe()}
                />
            </main>
        </div>
    );
}

PlayingMoviePage.propTypes = {
    params: PropTypes.shape({
        id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
    }).isRequired,
};

export default PlayingMoviePage;