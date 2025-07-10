/* eslint-disable react/react-in-jsx-scope */
"use client";

import Footer from "@/components/Footer/page";
import NavbarLogin from "@/components/NavbarLogin/page";
import buttonFacebook from "@@/icons/facebook.svg";
import iconsDibeli from "@@/icons/icons-buy.svg";
import IconsArrowLeft from "@@/icons/icons-dashboard/icons-arrow-left.svg";
import iconsRiwayatTonton from "@@/icons/icons-riwayat-tonton.svg";
import iconsDisimpan from "@@/icons/icons-save.svg";
import avatarProfileUsers from "@@/icons/icons-user-profile.svg";
import buttonInstagram from "@@/icons/instagram.svg";
import buttonTikTok from "@@/icons/tiktok.svg";
import buttonX from "@@/icons/x.svg";
import film1 from "@@/logo/logoFilm/film_1.svg";
import film2 from "@@/logo/logoFilm/film_2.svg";
import film3 from "@@/logo/logoFilm/film_3.svg";
import { Pagination } from "@heroui/react";
import Image from "next/legacy/image";
import Link from "next/link";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function RiwayatPage() {
  return (
    <div className="flex h-screen w-screen flex-col">
      <NavbarLogin />
      <p className="mx-2 my-2.5 mb-5 flex flex-row items-center justify-start gap-2 text-2xl font-semibold text-white">
        <Image src={IconsArrowLeft} alt="icons-arrow-left" />
      </p>
      <main className="mx-5 flex flex-col">
        <section className="mb-10 flex flex-col">
          <div className="flex flex-row justify-between gap-5">
            <div className="flex flex-row">
              <Image
                priority
                className="rounded-full bg-cyan-400"
                width={80}
                height={80}
                src={avatarProfileUsers}
                alt="user-profile"
              />
              <div className="mx-3.5 mb-3 flex flex-col justify-end">
                <div>
                  <p className="font-extrabold text-white">mimi</p>
                </div>
                <div>
                  <p className="font-light text-white">@mimi</p>
                </div>
                <div className="mt">
                  <p className="font-extrabold text-white">
                    Viwers 100jt | Followers 100k
                  </p>
                </div>
              </div>
            </div>
            <section className="flex justify-end">
              <Link href="https://www.instagram.com/tamana_mg/">
                <Image
                  className="mx-7 mt-5 flex h-min rounded-full bg-slate-700 px-2 py-2 hover:bg-slate-600 hover:grayscale-25"
                  src={buttonInstagram}
                  priority
                  alt="icons-button"
                />
              </Link>

              <Image
                className="mx-7 mt-5 flex h-min rounded-full bg-slate-700 px-2 py-2 hover:bg-slate-600 hover:grayscale-25"
                src={buttonTikTok}
                priority
                alt="icons-button"
              />
              <Image
                className="mx-7 mt-5 flex h-min rounded-full bg-slate-700 px-2 py-2 hover:bg-slate-600 hover:grayscale-25"
                src={buttonX}
                priority
                alt="icons-button"
              />
              <Image
                className="mx-7 mt-5 flex h-min rounded-full bg-slate-700 px-2 py-2 hover:bg-slate-600 hover:grayscale-25"
                src={buttonFacebook}
                priority
                alt="icons-button"
              />
            </section>
          </div>
          <div className="mt-15">
            <button className="my-4 w-full rounded-md border border-[#6aa3db] bg-[#0E5BA8] py-2 text-white">
              Edit Profile
            </button>
          </div>
        </section>

        <section className="my-5 flex flex-row gap-7">
          <div className="flex flex-row gap-2.5">
            <Image src={iconsRiwayatTonton} alt="icons-riwayat-tonton" />
            <p className="flex items-center font-semibold text-white">
              Riwayat Tonton
            </p>
          </div>
          <div className="flex flex-row gap-2.5">
            <Image src={iconsDisimpan} alt="icons-riwayat-tonton" />
            <p className="flex items-center font-semibold text-white">
              Disimpan
            </p>
          </div>
          <div className="flex flex-row gap-2.5">
            <Image src={iconsDibeli} alt="icons-riwayat-tonton" />
            <p className="flex items-center font-semibold text-white">Dibeli</p>
          </div>
        </section>

        <section className="mx-auto my-auto flex flex-col gap-8">
          {[film1, film2, film3].map((film, index) => (
            <section key={index}>
              <Carousel className="sm:max-h-auto sm:max-w-auto">
                <div className="mx-5 flex justify-between text-white"></div>
                <CarouselContent className="ml-4 md:ml-4">
                  {[film1, film2, film3, film1, film2, film3, film1].map(
                    (film, idx) => (
                      <CarouselItem
                        key={idx}
                        className="sm:basis-1/5 md:basis-1/5 lg:basis-1/5 xl:basis-1/5"
                      >
                        <Image src={film} priority alt="films-logo-banner" />
                      </CarouselItem>
                    ),
                  )}
                </CarouselContent>
              </Carousel>
            </section>
          ))}
        </section>

        <section className="my-10 flex justify-center">
          <Pagination
            classNames={{
              wrapper: "h-15 mt-10",
              item: "w-12 h-12 text-small hover:bg-gray-600 text-white has-active:bg-amber-200 saturate-100 rounded-md mx-1.5",
              cursor: "text-white font-bold",
              next: "bg-gray-400 saturate-100 py-2 ml-7 rounded-md",
              prev: "bg-gray-400 saturate-100 py-2 mr-7 rounded-md",
            }}
            showControls="true"
            color="warning"
            initialPage={1}
            total={10}
            variant="bordered"
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
