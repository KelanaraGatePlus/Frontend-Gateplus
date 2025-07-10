/* eslint-disable react/react-in-jsx-scope */
"use client";
import Footer from "@/components/Footer/page";
import Navbar from "@/components/Navbar/page";
import logoBuy from "@@/icons/icons-buy.svg";
import BackPage from "@/components/BackPage/page";
import logoRiwayatTonton from "@@/icons/icons-riwayat-tonton.svg";
import logoSave from "@@/icons/icons-save.svg";
import logoUsersComment from "@@/icons/logo-users-comment.svg";
import film1 from "@@/logo/logoFilm/film_1.svg";
import axios from "axios";
import { Pagination } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import emptyWorkCreator from "@@/icons/empty-work-creator.svg";

const dataRiwayatTonton = [
  // { id: 1, name: "Film 1", image: film1 },
];

const dataFilmDibeli = [{ id: 1, name: "Film 1", image: film1 }];

export default function ProfilePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [profileName, setProfileName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [switchTab, setSwitchTab] = useState("RiwayatTonton");

  const onChangePage = (page) => setCurrentPage(page);
  const [imageUrl, setImageUrl] = useState(null);
  const [savedEbooks, setSavedEbooks] = useState([]);
  const handleSwitchTab = (tab) => {
    setSwitchTab(tab);
  };

  const getData = async () => {
    try {
      const userId = localStorage.getItem("users_id");
      const token = localStorage.getItem("token");
      if (!userId) {
        console.error("User ID not found in localStorage");
        console.error("User Unauthorized");
        return;
      }

      const response = await axios.get(
        `https://backend-gateplus-api.my.id/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const usersData = response.data.data.data;

      setProfileName(usersData.profileName);
      setUsername(usersData.username);
      setBio(usersData.bio);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getDataByUserId = async () => {
    try {
      const userId = localStorage.getItem("users_id");
      const response = await axios.get(
        `https://backend-gateplus-api.my.id/save/byUser/${userId}`,
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
    const storedImage = localStorage.getItem("image_users");
    if (storedImage) {
      setImageUrl(storedImage);
    }
  }, []);

  useEffect(() => {
    getData();
  }, []);

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
          {/* Detail Profil */}
          <div className="sticky mt-1 flex h-fit flex-col items-center justify-center rounded-xl bg-[#FFFFFF1A] p-4 md:max-w-[300px] md:min-w-[300px]">
            {/* Profile */}
            <div className="mt-2 h-28 w-28 shrink-0 lg:h-24 lg:w-24">
              {imageUrl && imageUrl !== "null" ? (
                <Image
                  priority
                  className="h-full w-full rounded-full bg-white object-cover"
                  src={imageUrl}
                  width={128}
                  height={128}
                  alt="logo-usercomment"
                />
              ) : (
                <Image
                  priority
                  className="h-full w-full rounded-full bg-white object-cover"
                  src={logoUsersComment}
                  width={128}
                  height={128}
                  alt="logo-defaultuser"
                />
              )}
            </div>

            {/* personal information */}
            <div className="flex w-full flex-col gap-4">
              {/* Name */}
              <div className="w-full text-white">
                <h1
                  className={`mt-4 text-xl font-semibold lg:text-2xl ${
                    !profileName ? "text-gray-500/60" : ""
                  }`}
                >
                  {profileName || "Nama Profile Belum di atur"}
                </h1>
                <div className="flex items-center gap-1 text-[12px] text-gray-300 lg:text-base">
                  <p>@{username}</p>
                </div>
              </div>

              {/* Description */}
              <p
                className={`mt-1 min-h-[100px] w-full bg-[#2222224D] p-2 text-[12px] text-gray-200 lg:text-base ${!bio ? "text-gray-500/60 italic" : ""}`}
              >
                {bio || "Tidak ada Bio"}
              </p>

              {/* Edit Profile */}
              <button className="mt-1 rounded-lg bg-[#0E5BA8] py-2 font-bold text-white hover:bg-[#0E5BA8]/80">
                <Link href="/Users/Setting">
                  <p>Edit Profile</p>
                </Link>
              </button>
            </div>
          </div>

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
