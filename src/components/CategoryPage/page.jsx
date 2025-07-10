/* eslint-disable react/react-in-jsx-scope */
"use client";
import { useEffect, useState } from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";

/*[--- ASSETS IMPORT ---]*/
import logoEComics from "@@/logo/logo-icons-comic-news.svg";
import logoEbook from "@@/logo/logo-icons-ebook-news.svg";
import logoMovie from "@@/logo/logo-icons-film-news.svg";
import logoPodcast from "@@/logo/logo-icons-podcast-news.svg";
import logoSeries from "@@/logo/logo-icons-series-news.svg";

export default function CategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [ebookGenres, setEbookGenres] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const token = Cookies.get("token");
        if (token) {
          setIsAuthorized(true);
          const response = await axios.get(
            "https://backend-gateplus-api.my.id/category",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          const data = response.data?.data?.data || [];
          setEbookGenres(data);
        }
      } catch (error) {
        setIsAuthorized(false);
        console.error("Gagal fetch genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const renderGenres = (genres) => {
    const linkParent = selectedCategory === "e-Book" ? "/Ebook/Category" : "/";

    return (
      <section className="flex flex-wrap justify-center gap-2.5">
        {genres
          .sort((a, b) => a.tittle.localeCompare(b.tittle))
          .map((genre) => (
            <Link href={`${linkParent}?filter=${genre.tittle}`} key={genre.id}>
              <div className="montserratFont flex w-fit cursor-pointer items-center justify-center gap-3 rounded-full bg-gradient-to-t from-[#0881AB] to-[#10ADF0] px-6 py-1.5 whitespace-nowrap text-white transition-all duration-200 ease-in hover:from-[#10ADF0] hover:to-[#0881AB] hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]">
                {genre.tittle}
              </div>
            </Link>
          ))}
      </section>
    );
  };

  const renderContent = () => {
    const renderHeader = () => (
      <p className="zeinFont text-3xl font-bold text-white">
        Genre {selectedCategory}s
      </p>
    );

    if (!isAuthorized) {
      return (
        <section>
          <div className="flex flex-col items-center text-white/60">
            {renderHeader()}
            Anda perlu login untuk melihat genre.
          </div>
          <div className="flex flex-wrap justify-center gap-2.5">
            <div className="mt-0.5 flex flex-col py-3 text-white">
              <div className="flex justify-center rounded-full bg-linear-to-t from-[#0E5BA8] to-[#0395BC] py-2 font-semibold sm:px-2 md:px-4 lg:px-6 xl:px-8">
                <Link
                  href="/Login"
                  className="zeinFont mt-0.5 text-center text-lg leading-tight drop-shadow-[0_0_2px_rgba(255,255,255,0.4)] sm:text-lg lg:text-xl"
                >
                  Log In
                </Link>
              </div>
            </div>
            <div className="mt-0.5 block py-3 text-white">
              <div className="flex justify-center rounded-full bg-[#0881AB] py-2 font-semibold saturate-35 sm:px-2 md:px-4 lg:px-6 xl:px-8">
                <Link
                  href="/Register"
                  className="zeinFont mt-0.5 text-center text-base leading-tight drop-shadow-[0_0_2px_rgba(255,255,255,0.4)] sm:text-sm lg:text-xl"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (selectedCategory === "e-Book") {
      if (ebookGenres.length === 0) {
        return (
          <section className="flex flex-col flex-wrap justify-center gap-3 overflow-clip md:mx-5 md:my-10 md:gap-4">
            <div className="flex flex-col items-center text-white/60">
              {renderHeader()}
              List genre belum tersedia. Silakan Kontak Pengelola untuk
              menambahkan genre.
            </div>
          </section>
        );
      }

      return (
        <section className="flex flex-col flex-wrap justify-center gap-3 overflow-clip md:mx-5 md:my-10 md:gap-4">
          <div className="flex flex-col items-center text-white/60">
            {renderHeader()}
          </div>
          {renderGenres(ebookGenres)}
        </section>
      );
    }

    return null;
  };

  if (selectedCategory && selectedCategory !== "e-Book") {
    if (typeof window !== "undefined") {
      window.location.href = "/" + selectedCategory;
    }
    return null;
  }

  return (
    <div className="">
      <section className="my-5 md:my-10">
        <div className="grid grid-cols-5 gap-4 md:grid-cols-5">
          <div
            className={`flex transform cursor-pointer flex-col items-center justify-between gap-0 transition duration-100 ease-linear md:gap-2 ${
              selectedCategory === "Movie"
                ? "scale-110 rounded-lg bg-[#04475E] grayscale-35"
                : "hover:scale-105 hover:grayscale-50"
            }`}
            onClick={() => setSelectedCategory("Movie")}
          >
            <div className="flex h-full w-full flex-col items-center">
              <div className="aspect-auto scale-90 md:scale-100">
                <Image priority alt="logo-movie" src={logoMovie} />
              </div>
              <div className="montserratFont w-full text-center font-medium text-white">
                <span className="text-sm md:text-base">MOVIE</span>
              </div>
            </div>
          </div>

          <div
            className={`flex transform cursor-pointer flex-col items-center justify-between gap-0 transition duration-100 ease-linear md:gap-2 ${
              selectedCategory === "Series"
                ? "scale-110 rounded-lg bg-[#04475E] grayscale-35"
                : "hover:scale-105 hover:grayscale-50"
            }`}
            onClick={() => setSelectedCategory("Series")}
          >
            <div className="flex h-full w-full flex-col items-center">
              <div className="aspect-auto scale-90 md:scale-100">
                <Image priority alt="logo-series" src={logoSeries} />
              </div>
              <div className="montserratFont w-full text-center font-medium text-white">
                <span className="text-sm md:text-base">SERIES</span>
              </div>
            </div>
          </div>

          <div
            className={`flex transform cursor-pointer flex-col items-center justify-between gap-0 transition duration-100 ease-linear md:gap-2 ${
              selectedCategory === "Podcast"
                ? "scale-110 rounded-lg bg-[#04475E] grayscale-35"
                : "hover:scale-105 hover:grayscale-50"
            }`}
            onClick={() => setSelectedCategory("Podcast")}
          >
            <div className="flex h-full w-full flex-col items-center">
              <div className="aspect-auto scale-90 md:scale-100">
                <Image priority alt="logo-podcast" src={logoPodcast} />
              </div>
              <div className="montserratFont w-full text-center font-medium text-white">
                <span className="text-sm md:text-base">PODCAST</span>
              </div>
            </div>
          </div>

          <div
            className={`flex transform cursor-pointer flex-col items-center justify-between gap-0 transition duration-100 ease-linear md:gap-2 ${
              selectedCategory === "e-Book"
                ? "scale-110 rounded-lg bg-[#04475E] grayscale-35"
                : "hover:scale-105 hover:grayscale-50"
            }`}
            onClick={() => {
              if (!selectedCategory) {
                setSelectedCategory("e-Book");
              } else {
                setSelectedCategory(null);
              }
            }}
          >
            <div className="flex h-full w-full flex-col items-center">
              <div className="aspect-auto scale-90 md:scale-100">
                <Image priority alt="logo-ebook" src={logoEbook} />
              </div>
              <div className="montserratFont w-full text-center font-medium text-white">
                <span className="text-sm md:text-base">EBOOK</span>
              </div>
            </div>
          </div>

          <div
            className={`flex transform cursor-pointer flex-col items-center justify-between gap-0 transition duration-100 ease-linear md:gap-2 ${
              selectedCategory === "Comic"
                ? "scale-110 rounded-lg bg-[#04475E] grayscale-35"
                : "hover:scale-105 hover:grayscale-50"
            }`}
            onClick={() => setSelectedCategory("Comic")}
          >
            <div className="flex h-full w-full flex-col items-center">
              <div className="aspect-auto scale-90 md:scale-100">
                <Image priority alt="logo-comic" src={logoEComics} />
              </div>
              <div className="montserratFont w-full text-center font-medium text-white">
                <span className="text-sm md:text-base">COMIC</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {selectedCategory === "e-Book" && renderContent()}
    </div>
  );
}
