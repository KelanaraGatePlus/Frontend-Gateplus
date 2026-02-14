/* eslint-disable react/react-in-jsx-scope */
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

/*[--- ASSETS IMPORT ---]*/
import { navbarOptions } from "@/lib/constants/navbarOptions";

export default function CategoryMenu() {
  const [selectedCategory] = useState(null);
  const [ebookGenres, setEbookGenres] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const token = Cookies.get("token");
        if (token) {
          setIsAuthorized(true);
          const response = await axios.get(
            `${BACKEND_URL}/category`,
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
                  href="/login"
                  className="zeinFont mt-0.5 text-center text-lg leading-tight drop-shadow-[0_0_2px_rgba(255,255,255,0.4)] sm:text-lg lg:text-xl"
                >
                  Log In
                </Link>
              </div>
            </div>
            <div className="mt-0.5 block py-3 text-white">
              <div className="flex justify-center rounded-full bg-[#0881AB] py-2 font-semibold saturate-35 sm:px-2 md:px-4 lg:px-6 xl:px-8">
                <Link
                  href="/register"
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
    <div className="block md:hidden">
      <section className="my-5 md:my-10">
        <div className="grid grid-cols-5 md:grid-cols-5 justify-between">
          {navbarOptions.map((content, index) =>
            <Link
              key={index}
              className={`flex transform cursor-pointer flex-col items-center justify-between gap-0 transition duration-100 ease-linear md:gap-2 ${selectedCategory === "Comic"
                ? "scale-110 rounded-lg bg-[#04475E] grayscale-35"
                : "hover:scale-105 hover:grayscale-50"
                }`}
              href={`${content.url}`}
            >
              <div className="flex h-full w-full flex-col items-center">
                <div className="aspect-auto scale-90 md:scale-100 relative w-16 h-16 ">
                  <Image priority alt={content.tittle} src={content.icon} fill className="w-full h-full object-cover scale-125" />
                </div>
                <div className="montserratFont w-full text-center font-medium text-white ">
                  <span className="text-sm md:text-base">{content.tittle}</span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>
      {selectedCategory === "e-Book" && renderContent()}
    </div>
  );
}
