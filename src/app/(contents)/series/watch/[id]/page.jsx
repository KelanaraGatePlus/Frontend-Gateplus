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

import IconsArrowLeft from "@@/icons/icons-dashboard/icons-arrow-left.svg";
import movie1 from "@@/logo/logoFilm/film_1.svg";
import movie2 from "@@/logo/logoFilm/film_2.svg";
import movie3 from "@@/logo/logoFilm/film_3.svg";
import { useEffect, useState } from "react";

import Image from "next/legacy/image";
import Link from "next/link";
import DefaultVideoPlayer from "@/components/VideoPlayer/DefaultVideoPlayer";
import ProductEpisodeSection from "@/components/MainDetailProduct/ProductEpisodeSection";
import { useGetEpisodeSeriesByIdQuery } from "@/hooks/api/contentSliceAPI";
import CommentComponent from "@/components/Comment/page";
import { useGetCommentByEpisodeSeriesQuery } from "@/hooks/api/commentSliceAPI";

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
    const { data: commentData, isLoading: isLoadingGetComment } = useGetCommentByEpisodeSeriesQuery(id, {
        skip: !id,
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

                {/* Comment Baru */}
                <CommentComponent
                    commentData={commentData?.data?.data || []}
                    isLoadingGetComment={isLoadingGetComment}
                    typeContent={"series"}
                    episodeId={id}
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
