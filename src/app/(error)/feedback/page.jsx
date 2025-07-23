"use client";
import React from "react";
import Image from "next/image";
import MiniFooter from "@/components/Footer/MiniFooter";
import Picture404 from "@@/icons/error-page.svg";
import { useState, useRef } from "react";

export default function FeedbackPage() {
  const [uploadedScreenshot, setUploadedScreenshot] = useState(null);
  const inputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedScreenshot(file);
    }
  };

  const handleRemoveFile = () => {
    setUploadedScreenshot(null);
    if (inputRef.current) {
      inputRef.current.value = ""; // reset nilai file input
    }
  };

  return (
    <div className="montserratFont relative flex min-h-screen justify-center overflow-clip px-4 md:py-2">
      <main className="flex gap-10 self-center px-3 py-2 md:px-6">
        <section className="lg:max-h-lg hidden h-fit w-fit max-w-md flex-col gap-4 rounded-lg border border-[#1382C9] bg-[#166CA5] px-4 py-6 pb-16 [box-shadow:0px_4px_70px_rgba(19,130,201,0.7)] md:flex lg:max-w-md">
          <div className="flex w-full flex-col items-center">
            <div className="relative flex h-[350px] w-[350px] items-stretch justify-center">
              <Image
                priority
                src={Picture404}
                alt="icons 404"
                className="object-cover object-center"
                fill
              />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative flex w-fit items-center justify-start">
              <div className="text-white">
                <h1 className="zeinFont text-center text-3xl font-black">
                  Sorry for this trouble
                </h1>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex text-sm">
              <p className="text-center text-sm font-normal text-white/70 md:text-sm">
                <span>
                  Laporan dan feedback kamu sangat berharga untuk kemajuan dari
                  website ini, dari laporan kamu untuk perbaikan kami.
                </span>
                <br />
                <br />
                <span>Tunggu untuk versi lebih baiknya</span>
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 flex w-full max-w-md flex-col text-white md:mt-0">
          <div className="mb-6 w-full text-center text-2xl font-bold">
            Feedback Form & Report Problem
          </div>

          <form action="" className="flex flex-col gap-2 text-sm">
            {/* Check box */}
            <div className="flex gap-3">
              <input type="checkbox" name="anonymous" id="anonymous" />
              <label htmlFor="anonymous">Anonymous</label>
            </div>
            <div className="mb-3 flex gap-3">
              <input type="checkbox" name="updates" id="updates" />
              <label htmlFor="updates">Use Email (to receive updates)</label>
            </div>

            {/* Mail */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email">Email (Optional)</label>
              <input
                type="text"
                name="email"
                id="email"
                className="rounded-lg border border-white/70 px-2 py-2"
                placeholder="Masukan Email"
              />
            </div>
            {/* Permasalahan */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="problem">Permasalahan</label>
              <input
                type="text"
                name="problem"
                id="problem"
                className="rounded-lg border border-white/70 px-2 py-2"
                placeholder="Judul Permasalahan"
              />
            </div>
            {/* Deskripsi Masalah/Saran */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="problem-desc">Deskripsi Masalah/Saran</label>
              <textarea
                name="problem-desc"
                id="problem-desc"
                cols="30"
                rows="4"
                className="rounded-lg border border-white/70 px-2 py-2"
                placeholder="Jelaskan secara detail masalah atau masukan Anda"
              />
            </div>
            {/* Upload Screenshot */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="problem-desc">Upload Screenshot (Optional)</label>
              <div className="relative flex h-16 w-full items-center justify-center rounded-lg border-2 border-dashed border-white/70 bg-transparent p-2 text-sm text-white/40 italic">
                Drag and drop an image here, or click to upload
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  onChange={handleFileUpload}
                  ref={inputRef}
                />
              </div>
              {uploadedScreenshot && (
                <div className="relative h-28 w-full rounded-lg md:h-36">
                  <img
                    src={URL.createObjectURL(uploadedScreenshot)}
                    alt={`preview-report`}
                    className="h-full w-full rounded-lg object-cover object-center"
                  />
                  <div
                    className="absolute top-2 right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-lg"
                    onClick={handleRemoveFile}
                  >
                    &times;
                  </div>
                </div>
              )}

              <button
                href="/"
                type="submit"
                className="my-5 flex w-fit cursor-pointer self-center rounded-lg border border-[#184A97] bg-[#156EB7] px-4 py-2 text-center text-sm font-semibold [box-shadow:0px_7px_10px_rgba(0,0,0,0.25)] hover:bg-[#156EB7]/70 md:self-end"
              >
                Kirim Laporan
              </button>
            </div>
          </form>
          <div className="block h-20 w-full bg-transparent text-transparent lg:hidden">
            {"GatePlus"}
          </div>
        </section>
      </main>

      <div className="absolute bottom-0 text-[12px] md:text-sm">
        <MiniFooter />
      </div>
    </div>
  );
}
