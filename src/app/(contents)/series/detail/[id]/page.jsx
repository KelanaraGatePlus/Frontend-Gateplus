"use client";

import PropTypes from 'prop-types';
import React from "react";

import logoDislike from "@@/logo/logoDetailFilm/dislike-icons.svg";
import logoLike from "@@/logo/logoDetailFilm/like-icons.svg";
import logoSave from "@@/logo/logoDetailFilm/save-icons.svg";
import logoSubscribe from "@@/logo/logoDetailFilm/subscribe-icon-kelanara.svg";
import { useEffect, useState } from "react";

import Image from "next/image";
import DefaultVideoPlayer from "@/components/VideoPlayer/DefaultVideoPlayer";
import { useGetSeriesByIdQuery } from "@/hooks/api/seriesSliceAPI";
import ProductEpisodeSection from "@/components/MainDetailProduct/ProductEpisodeSection";
import SimpleModal from "@/components/Modal/SimpleModal";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";
import { useLikeContent } from "@/lib/features/useLikeContent";
import { useDislikeContent } from "@/lib/features/useDislikeContent";
import DefaultShareButton from "@/components/ShareButton/DefaultShareButton";
import iconLikeSolid from "@@/logo/logoDetailFilm/liked-icons.svg";
import iconDislikeSolid from "@@/logo/logoDetailFilm/dislike-icons-solid.svg";
import iconSaveSolid from "@@/logo/logoDetailFilm/saved-icons.svg";
import { useSaveContent } from '@/lib/features/useSaveContent';
import CarouselTemplate from '@/components/Carousel/carouselTemplate';
import Link from 'next/link';

function DetailSeriesPage({ params }) {
    const { id } = params;
    const { data } = useGetSeriesByIdQuery({ id, withEpisodes: false });
    const [loading, setLoading] = useState(false);
    const [selectedContentId, setSelectedContentId] = useState(null);
    const [isModalSubscribeOpen, setIsModalSubscribeOpen] = useState(false);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEpisode, setSelectedEpisode] = useState(null);
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

    const seriesData = data?.data?.data || {};
    const episode_series = (seriesData?.episodes?.episodes || []).slice().sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
    });

    const handleModalSubscribeOpen = (contentId, price) => {
        setSelectedContentId(contentId);
        setSelectedPrice(price);
        setIsModalSubscribeOpen(true);
    };

    const handleModalOpen = (episodeId, price) => {
        setSelectedEpisode(episodeId);
        setSelectedPrice(price);
        setIsModalOpen(true);
    };

    const handleBuy = async (episodeId, price) => {
        setLoading(true);
        setSelectedEpisode(episodeId);
        setSelectedPrice(price);
        window.location.href = `/checkout/purchase/series/${id}/${episodeId}`;
        setIsModalOpen(false);
        setLoading(false);
    };

    const handleSubscribe = async (contentId, price) => {
        setLoading(true);
        setSelectedContentId(contentId);
        setSelectedPrice(price);
        window.location.href = `/checkout/subscribe/series/${contentId}`;
        setIsModalSubscribeOpen(false);
        setLoading(false);
    };

    useEffect(() => {
        createLog({
            contentType: "SERIES",
            logType: "CLICK",
            contentId: id,
        });
    }, [id, createLog]);

    useEffect(() => {
        // Mengisi state dari data API saat pertama kali dimuat
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
        if (!seriesData.id) return; // Mencegah aksi jika data belum siap
        // Jika konten sedang di-like, batalkan like terlebih dahulu
        if (isLiked) {
            // Panggil toggleLike untuk unlike
            toggleLike({
                isLiked: true, // Paksa jadi true untuk proses unlike
                id: seriesData.id,
                fieldKey: "seriesId",
                idLiked,
                setIsLiked,
                setTotalLike,
                setIdLiked,
            });
        }
        // Lanjutkan dengan proses dislike
        toggleDislike({
            isDisliked,
            id: seriesData.id,
            fieldKey: "seriesId", // Pastikan key ini sesuai dengan backend
            idDisliked,
            setIsDisliked,
            setIdDisliked,
        });
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
                                {seriesData?.ageRestriction} | {seriesData?.categories?.tittle}
                            </p>
                        </div>
                        <div className="flex flex-row gap-6">
                            <div className="flex items-center justify-center w-max">
                                <button disabled={seriesData?.isOwner || seriesData?.isSubscribed} onClick={seriesData?.isOwner ? null : !seriesData?.isSubscribed && seriesData?.canSubscribe ? () => { handleSubscribe(seriesData?.id, seriesData?.subscriptionPrice) } : null} className="rounded-3xl bg-[#0076E999] disabled:bg-[#9CA3AF] px-12 py-3 font-bold text-white w-full hover:cursor-pointer">
                                    {seriesData?.isOwner ? "Series ini adalah karya mu" : !seriesData?.canSubscribe ? 'Buy Episode To Watch' : seriesData?.isSubscribed ? "Watch" : "Subscribe"}
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
                            <DefaultShareButton contentType={'SERIES'} />
                        </div>
                    </div>
                    <div className="flex flex-row items-center md:justify-end w-full md:w-1/2 gap-3">
                        <div className="flex items-center justify-center">
                            <Image
                                width={60}
                                alt="logo-subscribers"
                                src={logoSubscribe}
                                priority
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
                        {seriesData.thumbnailImageUrl && <Image
                            src={seriesData.thumbnailImageUrl}
                            alt="logo-racunsangga-movie"
                            layout="fill"
                            className="rounded-md object-cover"
                            priority
                        />}
                    </div>

                    {/* Deskripsi */}
                    <div className="rounded-md bg-[#393939] flex-1">
                        <div className="mx-4 my-4 text-white h-full flex flex-col">
                            <p>{seriesData?.description}</p>

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
                            />
                        </section>

                        <section className="mt-10">
                            <CarouselTemplate
                                label="Rekomendasi Serupa"
                                type="seriess"
                                contents={data?.data?.recommendation || []}
                                isLoading={!data}
                            />
                        </section>
                    </section>
                </section>

                <SimpleModal
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
                />
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
