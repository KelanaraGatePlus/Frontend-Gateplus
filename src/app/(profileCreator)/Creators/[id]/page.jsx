"use client";

import Footer from "@/components/Footer/MainFooter";
import Navbar from "@/components/Navbar/page";
import ProfileCard from "@/components/Profile/ProfileCard/ProfileCard";
import CreatorMostViewedContent from "@/components/Carousel/CarouselProfile/creatorMostViewedContent";
import ContentList from "@/components/Profile/ContentList";
import BackPage from "@/components/BackPage/page";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import React, { use, useState } from "react";
import { Pagination } from 'flowbite-react';
import { imageDefaultValue } from "@/lib/constants/imageDefaultValue";
import "react-loading-skeleton/dist/skeleton.css";

// eslint-disable-next-line react/prop-types
export default function CreatorsPage({ params }) {
  const { id } = use(params);
  const [bannerImageUrl, setBannerImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalItems, setTotalItems] = useState(0);

  return (
    <div className="flex h-screen w-full flex-col">
      <Navbar />
      <main className="relative mx-2 my-2 mt-16 flex flex-col md:mt-24 lg:mx-6">
        <BackPage />
        {
          isLoading ? (
            <section className="absolute top-1 -z-10 mb-2 hidden h-36 w-full overflow-hidden md:block md:h-64 lg:w-full rounded-xl">
              <Skeleton
                height="100%"
                width="100%"
                borderRadius="0.75rem"
                baseColor="#2e2e2e"
                highlightColor="#3d3d3d"
              />
            </section>
          ) : (
            <section className="absolute top-1 -z-10 mb-2 hidden h-36 w-full overflow-hidden md:block md:h-64 lg:w-full rounded-xl bg-[#2e2e2e]">
              {bannerImageUrl && bannerImageUrl !== "null" ? (
                <Image
                  priority
                  src={bannerImageUrl}
                  alt="banner-creator"
                  fill
                  className="object-cover object-center"
                />
              ) : (
                <Image
                  priority
                  src={imageDefaultValue.creator.bannerImageUrl}
                  alt="banner-creator"
                  fill
                  className="object-cover object-top"
                />
              )}
            </section>
          )
        }

        <div className="flex w-full flex-col items-start gap-2 transition-all duration-300 ease-out md:mt-32 md:flex-row md:items-end">
          <ProfileCard creatorId={id} setBannerImageUrl={setBannerImageUrl} setIsLoading={setIsLoading} />
          <section className="w-full md:min-w-[calc(100%-300px)] md:max-w-[calc(100%-300px)] transition-all duration-300 ease-out">
            <CreatorMostViewedContent creatorId={id} />
          </section>
        </div>

        {/* Baru ditambahkan */}
        <section className="md:mt-8 px-2">
          <div className="flex justify-between text-white">
            <p className="zeinFont md:mb-2 mb-1 text-2xl md:text-3xl lg:text-4xl xl:text-[40px] font-extrabold">
              Baru ditambahkan
            </p>
            <p className="cursor-pointer text-xs lg:text-base font-semibold text-[#14CAFB] montserratFont flex md:mr-4">
              <button className="cursor-pointer">Lainnya</button>
            </p>
          </div>
          <ContentList
            creatorId={id}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            setTotalItems={setTotalItems}
          />
        </section>

        <section className="mx-5 mt-10 flex justify-center">
          {
            totalItems > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.max(1, Math.ceil(totalItems / itemsPerPage))}
                onPageChange={(page) => setCurrentPage(page)}
                showIcons
              />
            )
          }
        </section>
      </main>
      <Footer />
    </div >
  );
}
