/* eslint-disable react/react-in-jsx-scope */
"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import PropTypes from "prop-types";

import logoPinComment from "@@/icons/icon-comment.svg";
import IconsArrowLeft from "@@/icons/icons-dashboard/icons-arrow-left.svg";
import logoUsersComment from "@@/icons/logo-users-comment.svg";
import movie1 from "@@/logo/logoFilm/film_1.svg";
import movie2 from "@@/logo/logoFilm/film_2.svg";
import movie3 from "@@/logo/logoFilm/film_3.svg";
import { useEffect, useState } from "react";

import Image from "next/legacy/image";
import Link from "next/link";
import DefaultVideoPlayer from "@/components/VideoPlayer/DefaultVideoPlayer";
import ProductEpisodeSection from "@/components/MainDetailProduct/ProductEpisodeSection";
import { useGetEpisodeSeriesByIdQuery } from "@/hooks/api/contentSliceAPI";

/* ===========================
   Halaman: DetailSeriesPage (JSX)
   =========================== */
export default function DetailSeriesPage({ params }) {
    const { id } = params;
    const { data, error } = useGetEpisodeSeriesByIdQuery(id);
    const [loading] = useState(false);

    const episodeData = data?.data?.data || {};
    const seriesData = data?.data?.data?.series || {};
    const episode_series = (seriesData.episodes || []).slice().sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
    });

    useEffect(() => {
        if (error && error.status === 403) {
            window.location.href = "/";
        }
    }, [error]);

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
                    {episodeData && <DefaultVideoPlayer
                        className="rounded-lg"
                        src={episodeData?.episodeFileUrl}
                        poster={seriesData?.thumbnailImageUrl}
                    />}
                </div>
            </section>

            <main className="px-5 text-white">
                <ProductEpisodeSection
                    productType={'series'}
                    productEpisodes={episode_series}
                    isLoading={loading}
                    handlePayment={() => {
                        console.log('Payment initiated for series:');
                    }}
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
            </main>
        </div>
    );
}

DetailSeriesPage.propTypes = {
    params: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired,
};
