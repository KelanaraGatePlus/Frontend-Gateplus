/* eslint-disable react/react-in-jsx-scope */
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export default function CarouselItemPodcastPage() {
    const [podcasts, setPodcasts] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const visiblePodcasts = showAll ? podcasts.slice(0, 15) : podcasts.slice(0, 5);

    const getData = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${BACKEND_URL}/podcast`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const getAllComics = response.data.data.data;
            console.log("Ini data komiknya :", getAllComics);
            setPodcasts(getAllComics);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <section className="px-4 md:px-15">
                {isLoading ? (
                    <div className="my-5 flex h-[70%] flex-col items-center justify-center">
                        <svg
                            aria-hidden="true"
                            className="dark:text-white-600 mr-2 h-16 w-16 animate-spin fill-blue-600 text-gray-200"
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
                        <p className="mt-5 text-white italic">Sedang mengambil data...</p>
                    </div>
                ) : (
                    podcasts.length > 0 && (
                        <section className="my-5 mb-10 flex flex-col">
                            <section className="mt-5">
                                <Carousel className="sm:max-h-auto sm:max-w-auto">
                                    <div className="flex justify-between text-white">
                                        <p className="mb-5 text-[20px] font-bold md:ml-3">
                                            Podcast Paling Banyak dilihat
                                        </p>
                                        <p className="mb-5 cursor-pointer text-[20px] font-bold md:ml-3">
                                            <button
                                                onClick={() => setShowAll(!showAll)}
                                                className="cursor-pointer"
                                            >
                                                {!showAll ? "Lainnya" : "Lebih sedikit"}
                                            </button>
                                        </p>
                                    </div>
                                    <CarouselContent className="">
                                        {[...visiblePodcasts].map((podcast, index) => (
                                            <CarouselItem
                                                key={index}
                                                className="relative h-[180px] w-[120px] cursor-pointer overflow-hidden rounded-lg sm:h-[200px] sm:w-[140px] md:h-[320px] md:w-[230px]"
                                            >
                                                <Link href={`/podcasts/detail/${podcast.id}`}>
                                                    <div className="relative h-full w-full">
                                                        <div className="bg-opacity-60 absolute top-2 right-2 z-10 rounded-md bg-black/85 px-2 py-1 text-xs text-white">
                                                            👁 {"0"}
                                                        </div>

                                                        <Image
                                                            src={podcast.coverPodcastImage}
                                                            priority
                                                            width={240}
                                                            height={353}
                                                            alt={podcast.title || "podcast-image"}
                                                            unoptimized
                                                            className="h-full w-full rounded-lg bg-white object-cover"
                                                        />
                                                    </div>
                                                </Link>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </section>
                        </section>
                    )
                )}
            </section>
        </div>
    );
}
