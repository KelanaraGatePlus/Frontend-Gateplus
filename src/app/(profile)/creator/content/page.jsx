/* eslint-disable react/react-in-jsx-scope */
"use client";

import Footer from "@/components/Footer/MainFooterEntertaint";
import NavbarLogin from "@/components/NavbarLogin/page";
import IconsArrowLeft from "@@/icons/icons-dashboard/icons-arrow-left.svg";
import PosterDiambangKematian from "@@/poster/poster-film-diambang-kematian.svg";
import PosterPanggonanWingit from "@@/poster/poster-film-panggonan-wingit.svg";
import PosterRacunSangga from "@@/poster/poster-film-racunSangga.svg";
import PosterSantetSegoroPitu from "@@/poster/poster-film-segoroPitu.svg";
import PosterSumala from "@@/poster/poster-film-sumala.svg";
import { Pagination } from "flowbite-react";
import Image from "next/legacy/image";
import { useState } from "react";

export default function ContentCreatorsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const onChangePage = (page) => setCurrentPage(page);

  return (
    <div className="top-0 right-0 bottom-0 left-0 flex h-screen w-screen flex-col">
      <NavbarLogin />
      <p className="mx-2 my-3 mb-10 flex flex-row items-center justify-start gap-2 text-2xl font-semibold text-white">
        <Image src={IconsArrowLeft} alt="icons-arrow-left" />
        <span>Karya</span>
      </p>
      <main>
        <section className="mx-5 grid grid-cols-5 gap-5 sm:grid-cols-5">
          <Image src={PosterDiambangKematian} alt="poster-fims-001" />
          <Image src={PosterPanggonanWingit} alt="poster-fims-001" />
          <Image src={PosterRacunSangga} alt="poster-fims-001" />
          <Image src={PosterSantetSegoroPitu} alt="poster-fims-001" />
          <Image src={PosterSumala} alt="poster-fims-001" />
          <Image src={PosterDiambangKematian} alt="poster-fims-001" />
          <Image src={PosterSantetSegoroPitu} alt="poster-fims-001" />
          <Image src={PosterPanggonanWingit} alt="poster-fims-001" />
          <Image src={PosterSumala} alt="poster-fims-001" />
          <Image src={PosterRacunSangga} alt="poster-fims-001" />
          <Image src={PosterDiambangKematian} alt="poster-fims-001" />
          <Image src={PosterRacunSangga} alt="poster-fims-001" />
          <Image src={PosterPanggonanWingit} alt="poster-fims-001" />
          <Image src={PosterSantetSegoroPitu} alt="poster-fims-001" />
          <Image src={PosterRacunSangga} alt="poster-fims-001" />
        </section>
      </main>
      <Pagination
        className="my-10 flex justify-center"
        currentPage={currentPage}
        totalPages={10}
        onPageChange={onChangePage}
        alt="poster-fims-001"
      />
      <Footer />
    </div>
  );
}
