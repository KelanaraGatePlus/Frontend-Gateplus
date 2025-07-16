/* eslint-disable react/react-in-jsx-scope */
"use client";
import Footer from "@/components/Footer/MainFooter";
import Navbar from "@/components/Navbar/page";
import logoBuy from "@@/icons/icons-buy.svg";
import BackPage from "@/components/BackPage/page";
import logoRiwayatTonton from "@@/icons/icons-riwayat-tonton.svg";
import logoSave from "@@/icons/icons-save.svg";
import PropTypes from "prop-types";
import film1 from "@@/logo/logoFilm/film_1.svg";
import axios from "axios";
import { Pagination } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import emptyWorkCreator from "@@/icons/empty-work-creator.svg";
import ProfileCard from "@/components/Profile/ProfileCard/ProfileCard";

/*[--- HOOKS IMPORT ---]*/
import { useGetUserDetailQuery } from "@/hooks/api/userSliceAPI";

const dataFilmDibeli = [{ id: 1, name: "Film 1", image: film1 }];
const dataRiwayatTonton = [{ id: 1, name: "Film 1", image: film1 }];

export default function UserProfilePage({ params }) {
  const { id } = use(params);
  const [currentPage, setCurrentPage] = useState(1);
  const [switchTab, setSwitchTab] = useState("RiwayatTonton");
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const userDetailQuery = useGetUserDetailQuery(id);
  const userDetailData = userDetailQuery.data?.data?.data;

  useEffect(() => {
    if (userDetailQuery.isSuccess && userDetailData) {
      const storedUserId = localStorage.getItem("users_id");
      setIsOwnProfile(storedUserId === id);
    }
  }, [userDetailQuery.isSuccess, userDetailData]);

  const onChangePage = (page) => setCurrentPage(page);
  const [savedEbooks, setSavedEbooks] = useState([]);
  const handleSwitchTab = (tab) => {
    setSwitchTab(tab);
  };

  const getDataByUserId = async () => {
    try {
      const userId = localStorage.getItem("users_id");
      const response = await axios.get(
        `http://localhost:3000/save/byUser/${userId}`,
      );
      const usersSavedEbook = response.data.data.data;

      const allEbooks = usersSavedEbook
        .flatMap((item) => item.users?.savedEpisode || [])
        .map((se) => se.ebook);

      setSavedEbooks(allEbooks);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getDataByUserId();
  }, []);

  return (
    <div className="flex w-full flex-col">
      <Navbar />

      <main className="mt-16 flex w-full flex-col md:mt-24">
        {/* Back Menu */}
        <div className="px-6">
          <BackPage />
        </div>

        <div className="flex w-full flex-col px-5 md:flex-row md:gap-5 md:px-10">
          <ProfileCard
            data={userDetailData}
            profileFor="user"
            isLoading={userDetailQuery.isLoading}
            isOwnProfile={isOwnProfile}
          />


          {/* Activity Menu */}
          <div className="mb-4 flex flex-1 flex-col px-0">
            {/* menu */}
            <div className="relative flex w-full py-1 text-[12px] lg:text-base">
              <div className="flex w-full">
                <div className="flex flex-1 flex-col gap-1">
                  <div
                    className="flex cursor-pointer items-center justify-center gap-1 rounded-lg py-1 text-white hover:bg-white/10"
                    onClick={() => handleSwitchTab("RiwayatTonton")}
                  >
                    <div>
                      <Image
                        priority
                        className="aspect-auto"
                        height={20}
                        width={20}
                        alt="logo-riwayat-tonton"
                        src={logoRiwayatTonton}
                      />
                    </div>
                    <p className="font-bold">Riwayat Tonton</p>
                  </div>
                  <div
                    className={`h-2 w-full rounded-full bg-gradient-to-b from-[#0395BC] to-[#0E5BA8] lg:h-3 ${switchTab === "RiwayatTonton" ? "block" : "hidden"}`}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div
                    className="flex cursor-pointer items-center justify-center gap-1 rounded-lg py-1 text-white hover:bg-white/10"
                    onClick={() => handleSwitchTab("DiSimpan")}
                  >
                    <div>
                      <Image
                        priority
                        className="aspect-auto"
                        height={20}
                        width={20}
                        alt="logo-riwayat-tonton"
                        src={logoSave}
                      />
                    </div>
                    <p className="font-bold">Disimpan</p>
                  </div>
                  <div
                    className={`h-2 w-full rounded-full bg-gradient-to-b from-[#0395BC] to-[#0E5BA8] lg:h-3 ${switchTab === "DiSimpan" ? "block" : "hidden"}`}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div
                    className="flex cursor-pointer items-center justify-center gap-1 rounded-lg py-1 text-white hover:bg-white/10"
                    onClick={() => handleSwitchTab("DiBeli")}
                  >
                    <div>
                      <Image
                        priority
                        className="aspect-auto"
                        height={20}
                        width={20}
                        alt="logo-riwayat-tonton"
                        src={logoBuy}
                      />
                    </div>
                    <p className="font-bold">Dibeli</p>
                  </div>
                  <div
                    className={`h-2 w-full rounded-full bg-gradient-to-b from-[#0395BC] to-[#0E5BA8] lg:h-3 ${switchTab === "DiBeli" ? "block" : "hidden"}`}
                  />
                </div>
              </div>
              <div className="absolute bottom-1 -z-10 h-2 w-full rounded-full border border-[#164464] bg-[#193c52] lg:h-3" />
            </div>
            {/* content */}
            <div className="lg:x-0 grid grid-cols-3 justify-items-center gap-2 py-2 sm:grid-cols-4 lg:grid-cols-5 lg:gap-4 lg:pt-4">
              {switchTab === "RiwayatTonton" &&
                (dataRiwayatTonton.length > 0 ? (
                  dataRiwayatTonton.map((film) => (
                    <div key={film.id} className="text-center">
                      {film.image && (
                        <Image
                          priority
                          src={film.image}
                          alt={film.name}
                          className="mx-auto h-auto w-auto rounded-lg"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex w-full flex-col items-center">
                    {/* Image */}
                    <div className="relative h-[280px] w-[230px] md:h-[400px] md:w-[330px]">
                      <Image
                        src={emptyWorkCreator}
                        alt="belum ada karya"
                        fill
                        priority
                        className="object-cover object-center"
                      />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col items-center p-4 text-white">
                      <h3 className="zeinFont text-center text-3xl font-bold">
                        Konten Lagi On Progress!
                      </h3>
                      <p className="montserratFont text-center text-sm">
                        Sedang disiapin nih, cek lagi nanti buat yang seru-seru!
                      </p>
                    </div>
                  </div>
                ))}

              {switchTab === "DiSimpan" &&
                (savedEbooks.length > 0 ? (
                  savedEbooks.map((ebook) => (
                    <Link
                      key={ebook.id}
                      href={`/Ebook/DetailEbook/${ebook.id}`}
                    >
                      <div className="text-center">
                        {ebook.coverImageUrl && (
                          <Image
                            priority
                            src={ebook.coverImageUrl}
                            alt={ebook.title}
                            width={200}
                            height={400}
                            className="mx-auto h-auto w-auto rounded-lg"
                          />
                        )}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full flex w-full flex-col items-center">
                    {/* Image */}
                    <div className="relative h-[280px] w-[230px] md:h-[400px] md:w-[330px]">
                      <Image
                        src={emptyWorkCreator}
                        alt="belum ada karya"
                        fill
                        priority
                        className="object-cover object-center"
                      />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col items-center p-4 text-white">
                      <h3 className="zeinFont text-center text-3xl font-bold">
                        Konten Lagi On Progress!
                      </h3>
                      <p className="montserratFont text-center text-sm">
                        Sedang disiapin nih, cek lagi nanti buat yang seru-seru!
                      </p>
                    </div>
                  </div>
                ))}

              {switchTab === "DiBeli" &&
                (dataFilmDibeli.length > 0 ? (
                  dataFilmDibeli.map((film) => (
                    <div key={film.id} className="text-center">
                      {film.image && (
                        <Image
                          priority
                          src={film.image}
                          alt={film.name}
                          className="mx-auto h-auto w-auto rounded-lg"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex w-full flex-col items-center">
                    {/* Image */}
                    <div className="relative h-[280px] w-[230px] md:h-[400px] md:w-[330px]">
                      <Image
                        src={emptyWorkCreator}
                        alt="belum ada karya"
                        fill
                        priority
                        className="object-cover object-center"
                      />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col items-center p-4 text-white">
                      <h3 className="zeinFont text-center text-3xl font-bold">
                        Konten Lagi On Progress!
                      </h3>
                      <p className="montserratFont text-center text-sm">
                        Sedang disiapin nih, cek lagi nanti buat yang seru-seru!
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {/* pagination */}

            <Pagination
              className="flex justify-center"
              currentPage={currentPage}
              totalPages={10}
              onPageChange={onChangePage}
              alt="pagination"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

UserProfilePage.propTypes = {
  params: PropTypes.string.isRequired,
}