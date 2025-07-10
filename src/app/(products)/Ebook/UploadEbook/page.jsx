/* eslint-disable react/react-in-jsx-scope */
"use client";

import BackPage from "@/components/BackPage/page";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import Footer from "@/components/Footer/page";
import Navbar from "@/components/Navbar/page";
import Toast from "@/components/Toast/page";
import ArrowRight from "@@/icons/icons-arrow-right.svg";
import IconsGalery from "@@/icons/logo-upload-banner.svg";
import IconsButtonSubmit from "@@/IconsButton/buttonSubmit.svg";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function UploadEbookPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [creatorId, setCreatorId] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState([]);
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const [ageRestriction, setAgeRestriction] = useState("");
  const posterBannerInputRef = useRef(null);
  const coverBookInputRef = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const router = useRouter();

  const [uploadedFiles, setUploadedFiles] = useState({
    posterBanner: [],
    coverBook: [],
  });

  const handleFileUpload = (event, type) => {
    const files = Array.from(event.target.files);
    const file = files[0];
    event.target.value = "";

    if (!file) return;

    if (uploadedFiles[type].length > 0) {
      setToastMessage("Tidak bisa upload lebih dari 1 file");
      setShowToast(true);
      return;
    }

    if (type === "posterBanner" || type === "coverBook") {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      const isValid = files.every((file) => allowedTypes.includes(file.type));
      if (!isValid) {
        setToastMessage("File harus berformat .jpg, .png, atau .webp");
        setShowToast(true);
        return;
      }
    }

    setUploadedFiles((prev) => ({
      ...prev,
      [type]: [...prev[type], file],
    }));
  };

  const handleRemoveFile = (type, index) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !title ||
      !description ||
      !genre ||
      !language ||
      !ageRestriction ||
      uploadedFiles.coverBook.length === 0 ||
      uploadedFiles.posterBanner.length === 0
    ) {
      setToastMessage("Semua kolom harus diisi");
      setShowToast(true);
      setShowToast(true);
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("creatorId", creatorId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("categoriesId", genre);
    formData.append("language", language);
    formData.append("ageRestriction", ageRestriction);
    formData.append("coverImageUrl", uploadedFiles.coverBook[0]);
    formData.append("posterImageUrl", uploadedFiles.posterBanner[0]);

    try {
      const response = await axios.post(
        "https://backend-gateplus-api.my.id/ebooks",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log(response.data);

      setIsLoading(false);
      setTitle("");
      setDescription("");
      setGenre("");
      setLanguage("");
      setAgeRestriction("");

      router.push(`/Ebook/UploadEbook/Episode?series=${response.data.data.id}`);
    } catch (error) {
      console.error("Error during post request:", error);
      setIsLoading(false);
    }
  };

  const getDataCatgeory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://backend-gateplus-api.my.id/category/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCategory(response.data.data.data);
    } catch (error) {
      console.error("Error during get request:", error);
    }
  };

  useEffect(() => {
    const creator_id = localStorage.getItem("creators_id");
    if (creator_id) {
      setCreatorId(creator_id);
    }
    getDataCatgeory();
  }, []);

  return (
    <div className="flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="mt-16 flex flex-col py-2 md:mt-[100px] lg:px-4">
        <section className="relative mb-2 flex items-center">
          <BackPage />
          <div className="zeinFont absolute left-1/2 -translate-x-1/2 text-3xl font-bold text-[#979797]">
            Upload Ebook
          </div>
        </section>
        <section className="mb-4 flex flex-row items-center justify-center gap-3">
          <div className="flex flex-row items-center justify-center gap-1 rounded-full">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1DBDF580] text-2xl font-extrabold text-white">
              1
            </span>
            <span className="gap-1.5 text-xl font-bold text-[#1DBDF580]">
              <Link href="/Ebook/UploadEbook">Series</Link>
            </span>
          </div>
          <div>
            <Image src={ArrowRight} alt="arrow-right" />
          </div>
          <div className="flex flex-row items-center gap-1 rounded-full">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/25 text-2xl font-extrabold text-[#979797]">
              2
            </span>
            <span className="gap-1.5 text-xl font-bold text-[#979797]">
              <Link href="/Ebook/UploadEbook/Episode">Episode</Link>
            </span>
          </div>
        </section>
        {/* form */}
        <div className="flex w-full flex-col px-2">
          {/* form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 lg:gap-0"
          >
            <div className="flex flex-col gap-2">
              {/* Judul */}
              <div className="flex items-start gap-2">
                <h3 className="montserratFont flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                  Judul
                </h3>
                <div className="flex w-full flex-4 text-white md:flex-10">
                  <input
                    type="text"
                    name="title"
                    className="w-full scroll-mt-32 rounded-md border border-[#F5F5F540] bg-[#2a2a2a] px-2 py-1 transition-all duration-200 focus:border-blue-500 focus:outline-none"
                    placeholder="Judul Series"
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
              </div>
              {/* Deskripsi */}
              <div className="flex items-start gap-2">
                <h3 className="montserratFont bg-[#2a2a2a]md:text-base flex-2 text-base font-semibold text-[#979797] lg:text-xl">
                  Deskripsi
                </h3>
                <div className="flex w-full flex-4 text-white md:flex-10">
                  <textarea
                    name="description"
                    className="w-full scroll-mt-32 rounded-md border border-[#F5F5F540] bg-[#2a2a2a] px-2 py-1 transition-all duration-200 focus:border-blue-500 focus:outline-none"
                    id="description"
                    cols="30"
                    rows="5"
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tuliskan Deskripsi"
                    required
                  ></textarea>
                </div>
              </div>
              {/* Genre */}
              <div className="flex items-start gap-2">
                <h3 className="montserratFont flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                  Genre
                </h3>
                <div className="relative flex w-full flex-4 text-white md:flex-10">
                  <select
                    className="w-full appearance-none rounded-md border border-white/20 bg-[#2a2a2a] px-2 py-2 text-sm text-white transition-all duration-200 focus:border-blue-500 focus:outline-none"
                    defaultValue=""
                    name="genre"
                    onChange={(e) => setGenre(e.target.value)}
                    required
                  >
                    <option value="" disabled hidden>
                      Pilih Genre
                    </option>
                    {category.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                        className="bg-[#2a2a2a] text-white"
                      >
                        {item.tittle}
                      </option>
                    ))}
                  </select>

                  <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-white/60">
                    ▼
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <h3 className="montserratFont flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                  Bahasa
                </h3>
                <div className="flex w-full flex-4 text-white md:flex-10">
                  <div className="relative w-full">
                    <select
                      className="w-full appearance-none rounded-md border border-white/20 bg-[#2a2a2a] px-2 py-2 text-sm text-white transition-all duration-200 focus:border-blue-500 focus:outline-none"
                      defaultValue=""
                      name="language"
                      onChange={(e) => setLanguage(e.target.value)}
                      required
                    >
                      <option value="" disabled hidden>
                        Pilih Bahasa
                      </option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="Inggris">Inggris</option>
                      <option value="Sunda">Sunda</option>
                      <option value="Melayu">Melayu</option>
                      <option value="Batak">Batak</option>
                      <option value="Jawa">Jawa</option>
                    </select>

                    <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-white/60">
                      ▼
                    </div>
                  </div>
                </div>
              </div>
              {/* Age Restriction */}
              <div className="flex items-start gap-2">
                <h3 className="montserratFont flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                  Age Restrictions
                </h3>
                <div className="flex w-fit flex-4 flex-wrap justify-start gap-x-6 text-white md:flex-10">
                  <FormControl component="fieldset" required>
                    <RadioGroup
                      row
                      name="rating"
                      onChange={(e) => setAgeRestriction(e.target.value)}
                    >
                      <FormControlLabel
                        value="SU"
                        control={
                          <Radio
                            sx={{
                              color: "white",
                              "&.Mui-checked": {
                                color: "cyan",
                              },
                            }}
                          />
                        }
                        label={<span className="text-white">SU</span>}
                        className="flex-1"
                      />
                      <FormControlLabel
                        value="R13"
                        control={
                          <Radio
                            sx={{
                              color: "white",
                              "&.Mui-checked": {
                                color: "cyan",
                              },
                            }}
                          />
                        }
                        label={<span className="text-white">R13+</span>}
                        className="flex-1"
                      />
                      <FormControlLabel
                        value="D17"
                        control={
                          <Radio
                            sx={{
                              color: "white",
                              "&.Mui-checked": {
                                color: "cyan",
                              },
                            }}
                          />
                        }
                        label={<span className="text-white">D17+</span>}
                        className="flex-1"
                      />
                      <FormControlLabel
                        value="D21"
                        control={
                          <Radio
                            sx={{
                              color: "white",
                              "&.Mui-checked": {
                                color: "cyan",
                              },
                            }}
                          />
                        }
                        label={<span className="text-white">D21+</span>}
                        className="flex-1"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
              {/* Poster Banner */}
              <section className="flex items-start gap-2 text-[#979797]">
                <div className="flex flex-2 flex-col">
                  <h3 className="montserratFont text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                    Poster Banner
                  </h3>
                  <p className="text-[10px] text-[#979797] italic md:text-sm">
                    Gunakan rasio 16:9 (1920x1080 px), format JPG/PNG, ukuran
                    maksimal 500KB. Poster harus jelas dan mewakili isi konten.
                  </p>
                </div>
                <div className="flex h-full w-fit flex-4 flex-wrap items-stretch justify-start gap-x-6 text-white md:flex-10">
                  <div className="container flex w-full flex-wrap items-start gap-4 rounded-md bg-[#585454] p-2">
                    {/* Upload Section */}
                    <div className="flex flex-col items-center">
                      <div className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-md bg-gray-500 md:h-28 md:w-28">
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          id="upload-poster-banner-series"
                          hidden
                          name="poster-banner"
                          ref={posterBannerInputRef}
                          onChange={(e) => handleFileUpload(e, "posterBanner")}
                        />
                        <label
                          htmlFor="upload-poster-banner-series"
                          className="absolute top-0 right-0 bottom-0 left-0 flex cursor-pointer items-center justify-center gap-1 bg-black/50 text-xs font-semibold"
                        >
                          <Image
                            src={IconsGalery}
                            alt="camera icon"
                            width={12}
                            height={12}
                            className="object-contain lg:h-5 lg:w-5"
                          />
                          <p className="text-[10px] font-semibold text-white lg:text-[12px]">
                            Upload
                          </p>
                        </label>
                      </div>
                      {/* Filename Text */}
                      <p className="mt-2 text-center text-xs text-white italic">
                        {uploadedFiles.posterBanner?.length > 0
                          ? `${uploadedFiles.posterBanner.length} file(s) selected`
                          : "No file chosen"}
                      </p>
                    </div>

                    {/* Preview Section */}
                    <div className="flex flex-wrap gap-4">
                      {uploadedFiles.posterBanner?.map((file, index) => (
                        <div
                          key={index}
                          className="relative flex h-28 w-36 flex-col items-center overflow-hidden rounded-md bg-gray-500 md:h-32 md:w-42"
                        >
                          <div className="relative h-24 w-full md:h-28">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`preview-${index}`}
                              className="h-full w-full object-cover object-center"
                            />
                            <button
                              onClick={() =>
                                handleRemoveFile("posterBanner", index)
                              }
                              className="absolute top-1 right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-600/50 text-xs text-white"
                            >
                              <span className="flex text-base lg:-mt-0.5">
                                &times;
                              </span>
                            </button>
                          </div>
                          <p className="w-full truncate px-1 py-0.5 text-center text-[8px] text-white lg:text-[10px]">
                            {file.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
              {/* Cover Book */}
              <section className="flex items-start gap-2 text-[#979797]">
                <div className="flex flex-2 flex-col">
                  <h3 className="montserratFont text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                    Cover Book
                  </h3>
                  <p className="text-[10px] text-[#979797] italic md:text-sm">
                    Gunakan rasio 1,6:2 (1600x2560), format JPG/PNG, ukuran
                    maksimal 500KB. Poster harus jelas dan mewakili isi konten.
                  </p>
                </div>
                <div className="flex h-full w-fit flex-4 flex-wrap items-stretch justify-start gap-x-6 text-white md:flex-10">
                  <div className="container flex w-full flex-wrap items-start gap-4 rounded-md bg-[#585454] p-2">
                    {/* Upload Section */}
                    <div className="flex flex-col items-center">
                      <div className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-md bg-gray-500 md:h-28 md:w-28">
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          id="upload-cover-book"
                          name="cover-book"
                          hidden
                          ref={coverBookInputRef}
                          onChange={(e) => handleFileUpload(e, "coverBook")}
                        />
                        <label
                          htmlFor="upload-cover-book"
                          className="absolute top-0 right-0 bottom-0 left-0 flex cursor-pointer items-center justify-center gap-1 bg-black/50 text-xs font-semibold"
                        >
                          <Image
                            src={IconsGalery}
                            alt="camera icon"
                            width={12}
                            height={12}
                            className="object-contain lg:h-5 lg:w-5"
                          />
                          <p className="text-[10px] font-semibold text-white lg:text-[12px]">
                            Upload
                          </p>
                        </label>
                      </div>
                      {/* Filename Text */}
                      <p className="mt-2 text-center text-xs text-white italic">
                        {uploadedFiles.coverBook?.length > 0
                          ? `${uploadedFiles.coverBook.length} file(s) selected`
                          : "No file chosen"}
                      </p>
                    </div>

                    {/* Preview Section */}
                    <div className="flex flex-wrap gap-4">
                      {uploadedFiles.coverBook?.map((file, index) => (
                        <div
                          key={index}
                          className="relative flex h-28 w-24 flex-col items-center overflow-hidden rounded-md bg-gray-500 md:h-32 md:w-28"
                        >
                          <div className="relative h-24 w-full md:h-28">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`preview-${index}`}
                              className="h-full w-full object-cover object-center"
                            />
                            <button
                              onClick={() =>
                                handleRemoveFile("coverBook", index)
                              }
                              className="absolute top-1 right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-600/50 text-xs text-white"
                            >
                              <span className="flex text-base lg:-mt-0.5">
                                &times;
                              </span>
                            </button>
                          </div>
                          <p className="w-full truncate px-1 py-0.5 text-center text-[8px] text-white lg:text-[10px]">
                            {file.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* button */}
            <button
              className="mt-1 flex w-full cursor-pointer justify-center gap-2 rounded-lg border border-[#F5F5F559] bg-[#0E5BA8] py-2 font-bold text-white lg:mt-8 lg:w-10/12 lg:self-end"
              type="submit"
            >
              <span className="flex">
                <Image
                  priority
                  className="aspect-auto"
                  height={16}
                  width={16}
                  alt="icon-save-changes"
                  src={IconsButtonSubmit}
                />
              </span>
              <p>{isLoading ? "Loading..." : "Buat Series"}</p>
            </button>
          </form>
        </div>
      </main>
      <div className="block h-20 w-full bg-transparent text-transparent">
        {"GatePlus"}
      </div>

      <Footer />
      {showToast && (
        <Toast
          message={toastMessage}
          type="failed"
          onClose={() => setShowToast(false)}
        />
      )}
      {isLoading && (
        <LoadingOverlay message="Tunggu Sebentar... <br/> Sedang membuat series" />
      )}
    </div>
  );
}
