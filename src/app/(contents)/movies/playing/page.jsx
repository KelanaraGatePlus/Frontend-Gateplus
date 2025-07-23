/* eslint-disable react/react-in-jsx-scope */
"use client";

import Footer from "@/components/Footer/MainFooter";
import NavbarLogin from "@/components/NavbarLogin/page";
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
import logoRacunSangga from "@@/logo/logoDetailFilm/detail-racun-sangga.svg";
import logoDislike from "@@/logo/logoDetailFilm/dislike-icons.svg";
import logoLike from "@@/logo/logoDetailFilm/like-icons.svg";
import logoSave from "@@/logo/logoDetailFilm/save-icons.svg";
import logoShare from "@@/logo/logoDetailFilm/share-icons.svg";
import logoSubscribe from "@@/logo/logoDetailFilm/subscribe-icon-kelanara.svg";
import film1 from "@@/logo/logoFilm/film_1.svg";
import film2 from "@@/logo/logoFilm/film_2.svg";
import film3 from "@@/logo/logoFilm/film_3.svg";
import Image from "next/legacy/image";
import Link from "next/link";
import ReactPlayer from "react-player";

export default function PlayingMoviePage() {
  return (
    <div className="overflow-y-a flex h-screen w-screen flex-col overflow-x-hidden">
      <NavbarLogin />
      <p className="mx-2.5 flex flex-row items-center justify-start gap-2 text-2xl font-semibold text-white">
        <Link className="" href="/">
          <Image src={IconsArrowLeft} alt="icons-arrow-left" />
        </Link>
      </p>
      <section className="flex justify-center rounded-md">
        <div className="mx-auto my-auto flex h-auto w-auto justify-center rounded-lg">
          <ReactPlayer
            width="1200vw"
            height="600px"
            playing="true"
            controls="true"
            url="https://youtu.be/RsaYQctIcYA?si=j2u9PyF0mVQ8tvVg"
          />
        </div>
      </section>
      <main className="mx-5">
        <section className="my-5 grid grid-cols-2">
          <div className="grid grid-rows-2">
            <div className="grid grid-rows-2">
              <div className="text-2xl font-semibold text-white">
                Racun Sangga: Santet Pemisah Rumah Tangga
              </div>
              <div className="text-sm font-light text-white">
                1 j 58m | 17+ | Horor Thriller
              </div>
            </div>
            <div className="grid grid-cols-5">
              <div className="flex items-center justify-center">
                <button className="rounded-3xl bg-[#0076E999] px-12 py-3 font-bold text-white">
                  Buy
                </button>
              </div>
              <div className="flex items-center justify-center transition delay-150 duration-400 ease-linear hover:-translate-y-1 hover:scale-x-110 hover:scale-y-110">
                <Image
                  className="focus-within:bg-purple-300"
                  width={35}
                  alt="logo-like"
                  src={logoLike}
                  priority
                />
              </div>
              <div className="flex items-center justify-center">
                <Image
                  width={35}
                  alt="logo-dislike"
                  src={logoDislike}
                  priority
                />
              </div>
              <div className="flex items-center justify-center">
                <Image width={35} alt="logo-save" src={logoSave} priority />
              </div>
              <div className="flex items-center justify-center">
                <Image width={35} alt="logo-share" src={logoShare} priority />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="grid grid-cols-2">
              <div className="ml-22 w-1/2">
                <Image alt="logo-subscribers" src={logoSubscribe} />
              </div>
              <div className="grid grid-rows-2">
                <div className="flex place-content-center justify-center text-2xl font-bold text-white">
                  Kelanara Studio
                </div>
                <div className="text-sm text-white">100k followers</div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-row gap-3">
          <div className="">
            <Image
              className="rounded-xl"
              src={logoRacunSangga}
              alt="logo-racunsangga-film"
            />
          </div>
          <div className="w-screen rounded-xl bg-[#393939]">
            <div className="mx-2 my-2 text-white">
              <p>
                Racun Sangga: Santet Pemisah Rumah Tangga adalah sebuah film
                horor Indonesia tahun 2024 yang disutradarai oleh Rizal
                Mantovani diproduksi Soraya Intercine Films. Film tersebut
                diangkat dari sebuah utas viral karya Gusti Gina yang juga
                bertindak sebagai penulis skenario.
              </p>
              <div className="mt-10">
                <p>Sutradara: Rizal Mantovani</p>
                <p>Tanggal rilis: 12 Desember 2024 (Indonesia)</p>
                <p>Durasi: 1 j 58 m</p>
                <p>Perusahaan produksi: Soraya Intercine Films</p>
                <p>Produser: Sunil Soraya</p>
                <p>
                  Pemeran: Frederika Cull; Fahad Haydra; Zidan El Hafiz; Julian
                  Kunto; Elly D. Luthan
                </p>
                <p>Bahasa: Indonesia; Banjar</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5">
          <section className="my-10 flex flex-col">
            <section className="mt-10">
              <Carousel className="">
                <div className="flex justify-between text-white">
                  <p className="mb-5 text-[20px] font-bold md:ml-3">
                    Dari Creator
                  </p>
                  <p className="mb-5 text-[20px] font-bold md:ml-3">Lainnya</p>
                </div>
                <CarouselContent className="">
                  <CarouselItem className="md:basis-1/4 lg:basis-1/4 xl:basis-1/4">
                    <Image src={film1} priority alt="films-logo-banner" />
                  </CarouselItem>
                  <CarouselItem className="md:basis-1/2 lg:basis-1/4">
                    <Image src={film2} priority alt="films-logo-banner" />
                  </CarouselItem>
                  <CarouselItem className="md:basis-1/2 lg:basis-1/4">
                    <Image src={film1} priority alt="films-logo-banner" />
                  </CarouselItem>
                  <CarouselItem className="md:basis-1/2 lg:basis-1/4">
                    <Image src={film3} priority alt="films-logo-banner" />
                  </CarouselItem>
                  <CarouselItem className="md:basis-1/2 lg:basis-1/4">
                    <Image src={film1} priority alt="films-logo-banner" />
                  </CarouselItem>
                  <CarouselItem className="md:basis-1/2 lg:basis-1/4">
                    <Image src={film3} priority alt="films-logo-banner" />
                  </CarouselItem>
                  <CarouselItem className="md:basis-1/2 lg:basis-1/4">
                    <Image src={film1} priority alt="films-logo-banner" />
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </section>

            <section className="mt-10">
              <Carousel className="sm:max-h-auto sm:max-w-auto">
                <div className="flex justify-between text-white">
                  <p className="mb-5 text-[20px] font-bold md:ml-3">
                    Rekomendasi Serupa
                  </p>
                  <p className="mb-5 text-[20px] font-bold md:ml-3">Lainnya</p>
                </div>
                <CarouselContent className="">
                  <CarouselItem className="md:basis-1/2 lg:basis-1/4">
                    <Image src={film1} priority alt="logo-film-banner" />
                  </CarouselItem>
                  <CarouselItem className="md:basis-1/2 lg:basis-1/4">
                    <Image src={film2} priority alt="logo-film-banner" />
                  </CarouselItem>
                  <CarouselItem className="md:basis-1/2 lg:basis-1/4">
                    <Image src={film1} priority alt="logo-film-banner" />
                  </CarouselItem>
                  <CarouselItem className="md:basis-1/2 lg:basis-1/4">
                    <Image src={film3} priority alt="logo-film-banner" />
                  </CarouselItem>
                  <CarouselItem className="md:basis-1/2 lg:basis-1/4">
                    <Image src={film2} priority alt="logo-film-banner" />
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
              <p className="mx-2 font-mono text-3xl font-bold text-white">
                Komentar
              </p>
              <div className="flex justify-start">
                <textarea
                  placeholder="Tell us about you, maxs 150 character."
                  className="my-2 mt-2 h-25 max-h-screen w-full resize rounded-md bg-gray-500 px-2.5 py-2.5 text-white saturate-50 placeholder:text-white focus-visible:placeholder:invisible"
                />
              </div>
              <button className="w-full rounded-md bg-blue-500 py-2 text-white">
                Kirim
              </button>
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
                      <div className="text-lg font-semibold">
                        Cetul Leather Hearth
                      </div>
                      <div>11 Mar 2025</div>
                    </div>
                  </div>
                  <div className="">
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
                  <div className="">
                    <div>
                      <input
                        placeholder="  Mantap Film Nya"
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
      <Footer />
    </div>
  );
}
