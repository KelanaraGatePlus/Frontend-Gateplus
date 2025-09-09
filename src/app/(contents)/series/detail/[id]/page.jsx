"use client";

import PropTypes from 'prop-types';
import React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import logoPinComment from "@@/icons/icon-comment.svg";
import IconsArrowLeft from "@@/icons/icons-dashboard/icons-arrow-left.svg";
import logoUsersComment from "@@/icons/logo-users-comment.svg";
import logoDislike from "@@/logo/logoDetailFilm/dislike-icons.svg";
import logoLike from "@@/logo/logoDetailFilm/like-icons.svg";
import logoSave from "@@/logo/logoDetailFilm/save-icons.svg";
import logoSubscribe from "@@/logo/logoDetailFilm/subscribe-icon-kelanara.svg";
import movie1 from "@@/logo/logoFilm/film_1.svg";
import movie2 from "@@/logo/logoFilm/film_2.svg";
import movie3 from "@@/logo/logoFilm/film_3.svg";
import { useEffect, useState } from "react";

import Image from "next/legacy/image";
import Link from "next/link";
import DefaultVideoPlayer from "@/components/VideoPlayer/DefaultVideoPlayer";
import { useGetSeriesByIdQuery } from "@/hooks/api/seriesSliceAPI";
import ProductEpisodeSection from "@/components/MainDetailProduct/ProductEpisodeSection";
import { useMidtransPayment } from "@/hooks/api/midtransAPI";
import SimpleModal from "@/components/Modal/SimpleModal";
import { useCreateLogMutation } from "@/hooks/api/logSliceAPI";
import { useLikeContent } from "@/lib/features/useLikeContent";
import { useDislikeContent } from "@/lib/features/useDislikeContent";
import DefaultShareButton from "@/components/ShareButton/DefaultShareButton";

/* ===========================
   Halaman: DetailSeriesPage (JSX)
   =========================== */
function DetailSeriesPage({ params }) {
    const { id } = params;
    const { data } = useGetSeriesByIdQuery(id);
    const [loading, setLoading] = useState(false);
    const [selectedContentId, setSelectedContentId] = useState(null);
    const [selectedCreatorId, setSelectedCreatorId] = useState(null);
    const [isModalSubscribeOpen, setIsModalSubscribeOpen] = useState(false);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEpisode, setSelectedEpisode] = useState(null);
    const [createLog] = useCreateLogMutation();
    const { toggleLike } = useLikeContent();
    const { toggleDislike } = useDislikeContent();

    const [isLiked, setIsLiked] = useState(false);
    const [idLiked, setIdLiked] = useState(null);
    const [totalLike, setTotalLike] = useState(0);
    const [isDisliked, setIsDisliked] = useState(false);
    const [idDisliked, setIdDisliked] = useState(null);

    const seriesData = data?.data?.data || {};
    const episode_series = (seriesData.episodes || []).slice().sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
    });

    const { pay } = useMidtransPayment();
    const { pay: subscribePay } = useMidtransPayment("SUBSCRIBE");

    const handleModalSubscribeOpen = (creatorId, contentId, price) => {
        setSelectedCreatorId(creatorId);
        setSelectedContentId(contentId);
        setSelectedPrice(price);
        setIsModalSubscribeOpen(true);
    };

    const handleModalOpen = (creatorId, episodeId, price) => {
        setSelectedCreatorId(creatorId);
        setSelectedEpisode(episodeId);
        setSelectedPrice(price);
        setIsModalOpen(true);
    };

    const handleBuy = async () => {
        setLoading(true);
        await pay({
            creatorId: selectedCreatorId,
            episodeId: selectedEpisode,
            price: selectedPrice,
            contentType: "SERIES",
        });
        setIsModalOpen(false);
        setLoading(false);
    };

    const handleSubscribe = async () => {
        setLoading(true);
        await subscribePay({
            creatorId: selectedCreatorId,
            contentId: selectedContentId,
            price: selectedPrice,
            contentType: "SERIES",
        });
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

    return (
        <div>
            <section className="flex justify-center rounded-md relative">
                <p className="absolute top-0 left-0 z-10 mx-2.5 flex flex-row items-center justify-start gap-2 text-2xl font-semibold text-white">
                    <Link href="/">
                        <Image src={IconsArrowLeft} alt="icons-arrow-left" />
                    </Link>
                </p>

                {/* Player bergaya YouTube */}
                <div className="mx-auto my-auto flex w-screen justify-center rounded-lg object-cover">
                    <DefaultVideoPlayer
                        className="rounded-lg"
                        src={seriesData?.trailerFileUrl}
                        poster={seriesData?.thumbnailImageUrl}
                        logType={"WATCH_TRAILER"}
                        contentType={"SERIES"}
                        contentId={seriesData?.id}
                    />
                </div>
            </section>

            <main className="px-5 text-white">
                <section className="w-full flex flex-row items-center justify-between pt-2 pb-4">
                    <div className="flex flex-col gap-4 w-1/2">
                        <div className="flex flex-col gap-2">
                            <h1 className="font-black text-4xl">
                                {seriesData?.title || "Judul Series Tidak Tersedia"}
                            </h1>
                            <p className=" text-sm/normal">
                                {seriesData?.ageRestriction} | {seriesData?.categories?.tittle}
                            </p>
                        </div>
                        <div className="flex flex-row gap-6">
                            <div className="flex items-center justify-center w-48">
                                <button onClick={!seriesData?.isSubscribed && seriesData?.canSubscribe ? () => { handleModalSubscribeOpen(seriesData?.creator?.id, seriesData?.id, seriesData?.subscriptionPrice) } : null} className="rounded-3xl bg-[#0076E999] px-12 py-3 font-bold text-white w-full hover:cursor-pointer">
                                    {!seriesData?.canSubscribe ? 'Buy Episode To Watch' : seriesData?.isSubscribed ? "Watch" : "Buy"}
                                </button>
                            </div>
                            <div onClick={handleToggleLike} className="flex items-center justify-center transition delay-150 duration-400 ease-linear hover:-translate-y-1 hover:scale-x-110 hover:scale-y-110 cursor-pointer">
                                <Image
                                    width={35}
                                    alt="logo-like"
                                    src={logoLike}
                                    priority
                                    className={isLiked ? 'filter brightness-150 drop-shadow-[0_0_3px_#4ade80]' : ''}
                                />
                                <p className="montserratFont mt-1 text-base font-bold pl-2">
                                    {totalLike}
                                </p>
                            </div>
                            {/* Tombol Dislike */}
                            <div onClick={handleToggleDislike} className="flex items-center justify-center cursor-pointer">
                                <Image
                                    width={35}
                                    alt="logo-dislike"
                                    src={logoDislike} // Selalu gunakan ikon standar
                                    priority
                                    // Tambahkan className dinamis ini:
                                    className={isDisliked ? 'filter brightness-150 drop-shadow-[0_0_3px_#f87171]' : ''}
                                />
                            </div>
                            <div className="flex items-center justify-center">
                                <Image width={35} alt="logo-save" src={logoSave} priority />
                            </div>
                            <DefaultShareButton contentType={'SERIES'} />
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-end w-1/2 gap-3">
                        <div className="flex items-center justify-center">
                            <Image
                                width={60}
                                alt="logo-subscribers"
                                src={logoSubscribe}
                                priority
                            />
                        </div>
                        <div className="grid grid-rows-2">
                            <div className="flex place-content-center justify-center text-2xl font-bold text-white">
                                {seriesData?.creator?.username}
                            </div>
                            <div className="text-sm text-white">{seriesData?.creator?._count.subscriptions} followers</div>
                        </div>
                    </div>
                </section>

                <section className="flex flex-row gap-3 items-stretch">
                    {/* Poster 3:2 */}
                    <div className="relative aspect-[2/3] w-[220px] sm:w-[160px] lg:w-[250px] flex-shrink-0">
                        <Image
                            src={seriesData.posterImageUrl}
                            alt="logo-racunsangga-movie"
                            layout="fill"
                            className="rounded-xl object-cover"
                            priority
                        />
                    </div>

                    {/* Deskripsi */}
                    <div className="rounded-xl bg-[#393939] flex-1">
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
                                <p>Genre : {seriesData?.categories?.tittle}</p>
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
                    handlePayment={handleModalOpen}
                />

                <section className="mt-5">
                    <section className="my-10 flex flex-col">
                        <section className="mt-10">
                            <Carousel className="">
                                <div className="flex justify-between text-white">
                                    <p className="mb-5 text-[20px] font-bold md:ml-3">Dari Creator</p>
                                    <p className="mb-5 text-[20px] font-bold md:ml-3">Lainnya</p>
                                </div>
                                <CarouselContent className="">
                                    <CarouselItem className="">
                                        <Image src={movie1} priority alt="movies-logo-banner" />
                                    </CarouselItem>
                                    <CarouselItem className="">
                                        <Image src={movie2} priority alt="movies-logo-banner" />
                                    </CarouselItem>
                                    <CarouselItem className="">
                                        <Image src={movie1} priority alt="movies-logo-banner" />
                                    </CarouselItem>
                                    <CarouselItem className="">
                                        <Image src={movie3} priority alt="movies-logo-banner" />
                                    </CarouselItem>
                                    <CarouselItem className="">
                                        <Image src={movie1} priority alt="movies-logo-banner" />
                                    </CarouselItem>
                                    <CarouselItem className="">
                                        <Image src={movie3} priority alt="movies-logo-banner" />
                                    </CarouselItem>
                                    <CarouselItem className="">
                                        <Image src={movie1} priority alt="movies-logo-banner" />
                                    </CarouselItem>
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </section>

                        <section className="mt-10">
                            <Carousel className="sm:max-h-auto sm:max-w-auto">
                                <div className="flex justify-between text-white">
                                    <p className="mb-5 text-[20px] font-bold md:ml-3">Rekomendasi Serupa</p>
                                    <p className="mb-5 text-[20px] font-bold md:ml-3">Lainnya</p>
                                </div>
                                <CarouselContent>
                                    <CarouselItem>
                                        <Image src={movie1} priority alt="logo-movie-banner" />
                                    </CarouselItem>
                                    <CarouselItem>
                                        <Image src={movie2} priority alt="logo-movie-banner" />
                                    </CarouselItem>
                                    <CarouselItem>
                                        <Image src={movie1} priority alt="logo-movie-banner" />
                                    </CarouselItem>
                                    <CarouselItem>
                                        <Image src={movie3} priority alt="logo-movie-banner" />
                                    </CarouselItem>
                                    <CarouselItem>
                                        <Image src={movie2} priority alt="logo-movie-banner" />
                                    </CarouselItem>
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </section>
                    </section>
                </section>

                <section className="grid grid-flow-row">
                    <div className="grid grid-flow-row">
                        <div className="flex flex-col">
                            <p className="mx-2 font-mono text-3xl font-bold text-white">Komentar</p>
                            <div className="flex justify-start">
                                <textarea
                                    placeholder="Tell us about you, maxs 150 character."
                                    className="my-2 mt-2 h-25 max-h-screen w-full resize rounded-md bg-gray-500 px-2.5 py-2.5 text-white saturate-50 placeholder:text-white focus-visible:placeholder:invisible"
                                />
                            </div>
                            <button className="w-full rounded-md bg-blue-500 py-2 text-white">Kirim</button>
                        </div>

                        <div className="mt-10 flex flex-col gap-10">
                            <div className="flex justify-between text-3xl">
                                <div className="flex w-1/3 flex-col">
                                    <div className="flex flex-row">
                                        <div className="mx-2">
                                            <Image
                                                className="rounded-full bg-white"
                                                src={logoUsersComment}
                                                alt="logo-usercomment"
                                            />
                                        </div>
                                        <div className="flex flex-col text-sm font-medium text-white">
                                            <div className="text-lg font-semibold">Cetul Leather Hearth</div>
                                            <div>11 Mar 2025</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <input
                                                placeholder="  Komen"
                                                className="placeholder:text-sm placeholder:font-semibold placeholder:text-white"
                                            />
                                            <p className="mx-2 text-lg text-blue-400">Balas</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mx-3 flex flex-col">
                                    <Image alt="pin-comment" src={logoPinComment} />
                                </div>
                            </div>

                            <div className="flex justify-between text-3xl">
                                <div className="flex w-1/3 flex-col">
                                    <div className="flex flex-row">
                                        <div className="mx-2">
                                            <Image
                                                className="rounded-full bg-blue-300"
                                                src={logoUsersComment}
                                                alt="logo-usercomment"
                                            />
                                        </div>
                                        <div className="flex flex-col text-sm font-medium text-white">
                                            <div className="text-lg font-semibold">User Premium</div>
                                            <div>11 Mar 2025</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <input
                                                placeholder="  Mantap Movie Nya"
                                                className="placeholder:text-sm placeholder:font-semibold placeholder:text-white"
                                            />
                                            <p className="mx-2 text-lg text-blue-400">Balas</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mx-3 flex flex-col">
                                    <Image src={logoPinComment} alt="pin-commentusers" />
                                </div>
                            </div>
                        </div>

                        <button className="mt-5 rounded-xl border border-gray-400 py-2 font-mono font-semibold text-white">
                            Komentar Lainnya
                        </button>
                    </div>
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
