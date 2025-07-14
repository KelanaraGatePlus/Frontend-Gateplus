/* eslint-disable react/react-in-jsx-scope */
"use client";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import BackPage from "@/components/BackPage/page";
import Footer from "@/components/Footer/page";
import Navbar from "@/components/Navbar/page";
import Toast from "@/components/Toast/page";
import ArrowRight from "@@/icons/icons-arrow-right.svg";
import IconsGalery from "@@/icons/logo-upload-banner.svg";
import IconsButtonSubmit from "@@/IconsButton/buttonSubmit.svg";
import { Checkbox } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

export default function UploadEpisodeComicContent() {
  const router = useRouter();
  const [termAccepted, setTermAccepted] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const inputFileRef = useRef(null);
  const episodeCoverRef = useRef(null);
  const priceOption = ["10000", "20000", "30000", "Free"];
  const [isTallScreen, setIsTallScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [comicsCreator, setComicsCreator] = useState([]);
  // form
  const [selectedComicId, setSelectedComicId] = useState("");
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [creatorNotes, setCreatorNotes] = useState("");
  const seriesTitleParams = useSearchParams();
  const seriesFromUrl = seriesTitleParams.get("series");
  const [uploadedFiles, setUploadedFiles] = useState({
    episodeCover: [],
    inputFile: [],
  });

  const handleFileUpload = (event, type) => {
    const files = Array.from(event.target.files);
    event.target.value = "";

    if (!files.length) return;

    if (type === "episodeCover") {
      if (uploadedFiles[type].length > 0) {
        setToastMessage("Tidak bisa upload lebih dari 1 file");
        setShowToast(true);
        return;
      }
    }

    if (type === "inputFile") {
      const regexAwalAngka = /^\d{2}/;
      const isValidNames = files.every((file) =>
        regexAwalAngka.test(file.name),
      );
      if (!isValidNames) {
        setToastMessage(
          "Terdapat nama file yang tidak diawali 2 digit angka (contoh: 01.jpg, 02 - page 2.png)",
        );
        setShowToast(true);
        return;
      }

      const existingFileNames = uploadedFiles[type].map((f) =>
        f.name.toLowerCase(),
      );
      const duplicateNames = files.filter((file) =>
        existingFileNames.includes(file.name.toLowerCase()),
      );
      if (duplicateNames.length > 0) {
        setToastMessage(
          `Terdapat nama file yang sudah diupload: ${duplicateNames.map((f) => f.name).join(", ")}`,
        );
        setShowToast(true);
        return;
      }

      const maxFiles = 10;
      const remainingSlots = maxFiles - uploadedFiles[type].length;

      if (remainingSlots <= 0) {
        setToastMessage(
          "Maaf anda sudah mencapai maximum page untuk di upload",
        );
        setShowToast(true);
        return;
      }

      if (files.length > remainingSlots) {
        setToastMessage(
          "Sebagian file dipotong agar total tidak lebih dari 10 (Maksimum 10 page)",
        );
        setShowToast(true);
      }
      files.splice(remainingSlots);
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const isValidTypes = files.every((file) =>
      allowedTypes.includes(file.type),
    );
    if (!isValidTypes) {
      setToastMessage("File harus berformat .jpg, .png, atau .webp");
      setShowToast(true);
      return;
    }

    const sortedFiles = [...uploadedFiles[type], ...files].sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    setUploadedFiles((prev) => ({
      ...prev,
      [type]: sortedFiles,
    }));

    console.log(sortedFiles);
  };

  const handleRemoveFile = (type, index) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSelectChange = (e) => {
    setSelectedComicId(e.target.value);
  };

  useEffect(() => {
    const checkScreenHeight = () => {
      setIsTallScreen(window.innerHeight > 1950);
    };

    checkScreenHeight();
    window.addEventListener("resize", checkScreenHeight);

    return () => window.removeEventListener("resize", checkScreenHeight);
  }, []);

  useEffect(() => {
    if (seriesFromUrl) {
      setSelectedComicId(seriesFromUrl);
    }
  }, [seriesFromUrl]);

  const getData = async () => {
    try {
      const creatorId = localStorage.getItem("creators_id");
      const response = await axios.get(
        `https://backend-gateplus-api.my.id/creator/${creatorId}`,
      );

      const fullData = response.data.data;
      const creatorData = fullData.data[0];
      setComicsCreator(creatorData.Comics);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !selectedComicId ||
      !episodeTitle ||
      !description ||
      !creatorNotes ||
      !selectedPrice ||
      uploadedFiles.episodeCover.length === 0 ||
      uploadedFiles.inputFile.length === 0
    ) {
      setToastMessage("Semua kolom harus diisi");
      setShowToast(true);
      setShowToast(true);
      setIsLoading(false);
      return;
    }

    if (selectedPrice === "Free") {
      setSelectedPrice("0");
    }

    const formData = new FormData();
    const creatorId = localStorage.getItem("creators_id");
    formData.append("comicsId", selectedComicId);
    formData.append("creatorId", creatorId);
    formData.append("title", episodeTitle);
    formData.append("description", description);
    formData.append("price", selectedPrice);
    formData.append("notedEpisode", creatorNotes);
    formData.append("coverImageUrl", uploadedFiles.episodeCover[0]);
    uploadedFiles.inputFile.forEach((file) => {
      formData.append("fileImageComics", file);
    });

    try {
      const response = await axios.post(
        "https://backend-gateplus-api.my.id/episodeComics",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log(response.data);

      setIsLoading(false);
      setSelectedComicId("");
      setEpisodeTitle("");
      setDescription("");
      setSelectedPrice("");
      setCreatorNotes("");

      router.push(`/Comic/DetailComic/${selectedComicId}`);
    } catch (error) {
      console.error("Error during post request:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col overflow-x-hidden">
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
      </Suspense>
      <main className="mt-16 flex flex-col py-2 md:mt-[100px] lg:px-4">
        <section className="relative mb-2 flex items-center">
          <BackPage />
          <div className="zeinFont absolute left-1/2 -translate-x-1/2 text-3xl font-bold text-[#979797]">
            Upload Komik
          </div>
        </section>
        <section className="mb-4 flex flex-row items-center justify-center gap-3">
          <div className="flex flex-row items-center gap-1 rounded-full">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/25 text-2xl font-extrabold text-[#979797]">
              1
            </span>
            <span className="gap-1.5 text-xl font-bold text-[#979797]">
              <Link href="/Comic/UploadComic">Series</Link>
            </span>
          </div>
          <div>
            <Image src={ArrowRight} alt="arrow-right" />
          </div>
          <div className="flex flex-row items-center justify-center gap-1 rounded-full">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1DBDF580] text-2xl font-extrabold text-white">
              2
            </span>
            <span className="gap-1.5 text-xl font-bold text-[#1DBDF580]">
              <Link href="/Comic/UploadComic/Episode">Episode</Link>
            </span>
          </div>
        </section>
        <div className="flex w-full flex-col px-2">
          {/* form */}
          <form
            className="flex flex-col gap-2 lg:gap-2"
            onSubmit={handleSubmit}
          >
            <section className="flex items-start gap-2 text-[#979797]">
              <h3 className="montserratFont flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                Judul
              </h3>
              <div className="flex w-full flex-4 text-white md:flex-10">
                <select
                  className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1 text-white"
                  onChange={handleSelectChange}
                  value={selectedComicId}
                >
                  <option value="" disabled>
                    Pilih Judul Series
                  </option>
                  {comicsCreator.map((comic) => (
                    <option key={comic.id} value={comic.id}>
                      {comic.title}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <section className="flex items-start gap-2 text-[#979797]">
              <h3 className="montserratFont flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                Judul Episode
              </h3>
              <div className="flex w-full flex-4 text-white md:flex-10">
                <input
                  type="text"
                  name="episdeTitle"
                  className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                  placeholder="Judul Episode"
                  onChange={(e) => setEpisodeTitle(e.target.value)}
                  required
                />
              </div>
            </section>
            <section className="flex items-start gap-2 text-[#979797]">
              <h3 className="montserratFont flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                Deskripsi
              </h3>
              <div className="flex w-full flex-4 text-white md:flex-10">
                <textarea
                  name="description"
                  className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                  id="about"
                  cols="30"
                  rows="5"
                  placeholder="Tuliskan Deskripsi"
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
            </section>
            <section className="flex items-start gap-2 text-[#979797]">
              <div className="flex flex-2 flex-col">
                <h3 className="montserratFont text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                  Cover Episode
                </h3>
                <p className="text-[10px] text-[#979797] italic md:text-sm">
                  Format banner its 1x1 with maks 500kb
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
                        id="episodeCover"
                        name="episodeCover"
                        hidden
                        ref={episodeCoverRef}
                        onChange={(e) => handleFileUpload(e, "episodeCover")}
                      />
                      <label
                        htmlFor="episodeCover"
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
                      {uploadedFiles.episodeCover?.length > 0
                        ? `${uploadedFiles.episodeCover.length} file(s) selected`
                        : "No file chosen"}
                    </p>
                  </div>

                  {/* Preview Section */}
                  <div className="flex flex-wrap gap-4">
                    {uploadedFiles.episodeCover?.map((file, index) => (
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
                            type="button"
                            onClick={() =>
                              handleRemoveFile("episodeCover", index)
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
            <section className="flex items-start gap-2 text-[#979797]">
              <div className="flex flex-2 flex-col">
                <h3 className="montserratFont text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                  File Input
                </h3>
                <p className="text-[10px] text-[#979797] italic md:text-sm">
                  Penting: Agar File Terunggah Sesuai Urutan Sebelum mengunggah,
                  mohon ubah nama file Anda dengan menambahkan nomor urut di
                  bagian depan nama file. Gunakan format dua digit (contoh: 01,
                  02, 03, ..., 10) agar urutan tetap benar.
                </p>
              </div>
              <div className="flex h-full w-fit flex-4 flex-wrap items-stretch justify-start gap-x-6 text-white md:flex-10">
                <div className="container flex w-full flex-wrap items-start gap-4 rounded-md bg-[#585454] p-2">
                  {/* Upload Section */}
                  <div className="flex flex-col items-center">
                    <div className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-md bg-gray-500 md:h-42 md:w-32">
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        id="inputFile"
                        hidden
                        name="inputFile"
                        ref={inputFileRef}
                        multiple
                        onChange={(e) => handleFileUpload(e, "inputFile")}
                      />
                      <label
                        htmlFor="inputFile"
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
                      {uploadedFiles.inputFile?.length > 0
                        ? `${uploadedFiles.inputFile.length} file(s) selected`
                        : "No file chosen"}
                    </p>
                  </div>

                  {/* Preview Section */}
                  <div className="flex flex-wrap gap-4">
                    {uploadedFiles.inputFile?.map((file, index) => (
                      <div
                        key={index}
                        className="relative flex h-28 w-36 flex-col items-center overflow-hidden rounded-md bg-gray-500 md:h-46 md:w-32"
                      >
                        <div className="relative h-24 w-full md:h-42 md:w-32">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`preview-${index}`}
                            className="h-full w-full object-cover object-center"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFile("inputFile", index)}
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
            <section className="flex items-start gap-2 text-[#979797]">
              <h3 className="montserratFont flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                Catatan Kreator
              </h3>
              <div className="flex w-full flex-4 text-white md:flex-10">
                <textarea
                  name="creatorNotes"
                  className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                  id="about"
                  cols="30"
                  rows="5"
                  placeholder="Tuliskan Catatan Anda"
                  onChange={(e) => setCreatorNotes(e.target.value)}
                  required
                ></textarea>
              </div>
            </section>
            {/* Price */}
            <section className="my-3 flex flex-col items-center justify-center gap-3">
              <h3 className="montserratFont w-full flex-2 text-left text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                Price
              </h3>
              <div className="flex w-full gap-3">
                {priceOption.map((option) => (
                  <div
                    key={option}
                    onClick={() => setSelectedPrice(option)}
                    className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 border-[#F5F5F559] bg-[#F5F5F540] py-2 text-lg font-bold text-white ${selectedPrice === option ? "border-blue-700 bg-blue-500" : "bg-[#F5F5F540]"} transition hover:opacity-80`}
                  >
                    {option}
                  </div>
                ))}
              </div>
              <div
                className={`flex w-full flex-1 cursor-not-allowed items-center justify-center rounded-lg border-2 border-[#F5F5F559] bg-[#F5F5F540] px-2 py-2 text-lg font-bold text-white transition hover:opacity-80`}
              >
                Lihat Simulasi Pendapatan
              </div>
            </section>
            <section className="flex w-4/6 flex-col text-sm md:text-base lg:w-10/12 lg:self-end">
              <label className="flex flex-1 flex-row items-center justify-start gap-1">
                <Checkbox
                  name="term-and-condition"
                  checked={termAccepted}
                  onChange={(e) => setTermAccepted(e.target.checked)}
                  sx={{
                    color: "white",
                    "&.Mui-checked": {
                      color: "cyan",
                    },
                  }}
                />
                <Link
                  href="/TermAndCondition"
                  target="_blank"
                  className="text-white underline"
                >
                  Term and Condition
                </Link>
              </label>

              <label className="flex flex-1 flex-row items-center justify-start gap-1">
                <Checkbox
                  name="agreement"
                  checked={agreementAccepted}
                  onChange={(e) => setAgreementAccepted(e.target.checked)}
                  sx={{
                    color: "white",
                    "&.Mui-checked": {
                      color: "cyan",
                    },
                  }}
                />
                <Link
                  href="/Agreement"
                  target="_blank"
                  className="text-white underline"
                >
                  Agreement
                </Link>
              </label>
            </section>
            <button
              disabled={!termAccepted || !agreementAccepted}
              className={`mt-1 flex w-full justify-center gap-2 rounded-lg border border-[#F5F5F559] bg-[#0E5BA8] py-2 font-bold text-white lg:mt-8 lg:w-10/12 lg:self-end ${
                !termAccepted || !agreementAccepted
                  ? "cursor-not-allowed bg-gray-500 text-white/50"
                  : "cursor-pointer"
              }`}
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
              <p>{isLoading ? "Loading..." : "Buat Episode"}</p>
            </button>
          </form>
        </div>
      </main>

      {showToast && (
        <Toast
          message={toastMessage}
          type="failed"
          onClose={() => setShowToast(false)}
        />
      )}
      {isLoading && <LoadingOverlay message="Uploading..." />}
      <div className={isTallScreen ? "absolute bottom-0 w-full" : ""}>
        <Footer />
      </div>
    </div>
  );
}
