/* eslint-disable react/react-in-jsx-scope */
import Footer from "@/components/Footer/MainFooter";
import NavbarLogin from "@/components/NavbarLogin/page";
import IconsArrowLeft from "@@/icons/icons-dashboard/icons-arrow-left.svg";
import IconsFilterContent from "@@/icons/icons-filtering-contents.svg";
import PosterRacunSangga from "@@/poster/poster-content-racunSangga.svg";
import { Progress } from "flowbite-react";
import Image from "next/legacy/image";
import { FaEye } from "react-icons/fa";

export default function ContentDetailPage() {
  return (
    <div className="top-0 right-0 bottom-0 left-0 mt-auto mb-auto flex h-screen w-screen flex-col">
      <NavbarLogin />
      <p className="mx-2 my-3 mb-10 flex flex-row items-center justify-start gap-2 text-2xl font-semibold text-white">
        <Image src={IconsArrowLeft} alt="icons-arrow-left" />
        <span>Detail Konten</span>
      </p>
      <main className="flex flex-col gap-2">
        <section className="my-5 grid grid-cols-5">
          <div className="flex justify-center text-lg font-semibold text-white hover:bg-blue-500 active:bg-blue-400">
            Film
          </div>
          <div className="flex justify-center text-lg font-semibold text-white hover:bg-blue-500 active:bg-blue-400">
            Series
          </div>
          <div className="flex justify-center text-lg font-semibold text-white hover:bg-blue-500 active:bg-blue-400">
            Podcast
          </div>
          <div className="flex justify-center text-lg font-semibold text-white hover:bg-blue-500 active:bg-blue-400">
            Ebook
          </div>
          <div className="flex justify-center text-lg font-semibold text-white hover:bg-blue-500 active:bg-blue-400">
            Komik
          </div>
        </section>
        <section className="my-5 grid grid-cols-7">
          <div className="flex flex-row justify-center font-normal text-white hover:bg-blue-500 active:bg-blue-400">
            <div>
              <span>Konten</span>
            </div>
            <div>
              <Image
                width={20}
                height={20}
                src={IconsFilterContent}
                alt="Icons-filter-content"
              />
            </div>
          </div>
          <div className="flex flex-row justify-center font-normal text-white hover:bg-blue-500 active:bg-blue-400">
            <div>
              <span>Visibilitas</span>
            </div>
            <div>
              <Image
                width={20}
                height={20}
                alt="Icons-filter-visibilitas"
                src={IconsFilterContent}
              />
            </div>
          </div>
          <div className="flex flex-row justify-center font-normal text-white hover:bg-blue-500 active:bg-blue-400">
            <div>
              <span>Pembatasan</span>
            </div>
            <div>
              <Image
                height={20}
                width={20}
                alt="Icons-filter-pembatasan"
                src={IconsFilterContent}
              />
            </div>
          </div>
          <div className="flex flex-row justify-center font-normal text-white hover:bg-blue-500 active:bg-blue-400">
            <div>
              <span>Tanggal Rilis</span>
            </div>
            <div>
              <Image
                alt="Icons-filter-TanggalRilis"
                width={20}
                height={20}
                src={IconsFilterContent}
              />
            </div>
          </div>
          <div className="flex flex-row justify-center font-normal text-white hover:bg-blue-500 active:bg-blue-400">
            <div>
              <span>Jumlah Penonton</span>
            </div>
            <div>
              <Image
                alt="Icons-filter-JumlahPenonton"
                height={20}
                width={20}
                src={IconsFilterContent}
              />
            </div>
          </div>
          <div className="flex flex-row justify-center font-normal text-white hover:bg-blue-500 active:bg-blue-400">
            <div>
              <span>Komentar</span>
            </div>
            <div>
              <Image
                alt="Icons-filter-komentar"
                height={20}
                width={20}
                src={IconsFilterContent}
              />
            </div>
          </div>
          <div className="flex flex-row justify-center font-normal text-white hover:bg-blue-500 active:bg-blue-400">
            <div>
              <span>Persentase Like</span>
            </div>
            <div>
              <Image
                alt="Icons-filter-PersentaseLike"
                width={20}
                height={20}
                src={IconsFilterContent}
              />
            </div>
          </div>
        </section>
        <section className="mx-5 my-5 grid grid-cols-7">
          <div className="grid grid-cols-2">
            <div>
              <Image alt="poster-detail-content" src={PosterRacunSangga} />
            </div>
            <div className="ml-3 flex flex-col">
              <div className="mb-7">
                <span className="text-lg leading-1.5 font-semibold text-white">
                  Racun Sangga: Santet Pemisah Rumah Tangga
                </span>
              </div>
              <div>
                <span className="align-middle text-sm font-normal text-white">
                  Racun Sangga: Santet Pemisah Rumah Tangga adalah sebuah film
                  horor Indonesia tahun 2024 yang disutradarai oleh Rizal
                  Mantovani diproduksi Soraya Intercine Films. Film tersebut
                  diangkat dari sebuah utas viral karya Gusti Gina yang juga
                  bertindak sebagai penulis skenario.
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-2">
            <div className="flex items-center justify-center gap-0.5 rounded-lg bg-slate-500 px-3 py-1 saturate-50">
              <FaEye className="mt-0.5" />
              <span className="mx-1 text-lg font-normal text-white">
                Public
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-lg font-semibold text-white">17+</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-lg font-semibold text-white">12-12-2024</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-lg font-semibold text-white">2000</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-lg font-semibold text-white">20</span>
          </div>
          <div className="my-2 flex items-center justify-center">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-center">
                <span className="text-lg font-semibold text-white">80%</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-sm font-normal text-white">
                  1.5k Suka
                </span>
              </div>
              <div className="">
                <Progress progress={80} />
              </div>
            </div>
          </div>
        </section>
        <section className="mx-5 my-5 grid grid-cols-7">
          <div className="grid grid-cols-2">
            <div>
              <Image alt="poster-banner-konten-film" src={PosterRacunSangga} />
            </div>
            <div className="ml-3 flex flex-col">
              <div className="mb-7">
                <span className="text-lg leading-1.5 font-semibold text-white">
                  Racun Sangga: Santet Pemisah Rumah Tangga
                </span>
              </div>
              <div>
                <span className="align-middle text-sm font-normal text-white">
                  Racun Sangga: Santet Pemisah Rumah Tangga adalah sebuah film
                  horor Indonesia tahun 2024 yang disutradarai oleh Rizal
                  Mantovani diproduksi Soraya Intercine Films. Film tersebut
                  diangkat dari sebuah utas viral karya Gusti Gina yang juga
                  bertindak sebagai penulis skenario.
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-2">
            <div className="flex items-center justify-center gap-0.5 rounded-lg bg-slate-500 px-3 py-1 saturate-50">
              <FaEye className="mt-0.5" />
              <span className="mx-1 text-lg font-normal text-white">
                Public
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-lg font-semibold text-white">17+</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-lg font-semibold text-white">12-12-2024</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-lg font-semibold text-white">2000</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-lg font-semibold text-white">20</span>
          </div>
          <div className="my-2 flex items-center justify-center">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-center">
                <span className="text-lg font-semibold text-white">80%</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-sm font-normal text-white">
                  1.5k Suka
                </span>
              </div>
              <div className="">
                <Progress progress={80} />
              </div>
            </div>
          </div>
        </section>
        <section className="mx-5 my-5 grid grid-cols-7">
          <div className="grid grid-cols-2">
            <div>
              <Image
                alt="poster-detail-content-racunSangga"
                src={PosterRacunSangga}
              />
            </div>
            <div className="ml-3 flex flex-col">
              <div className="mb-7">
                <span className="text-lg leading-1.5 font-semibold text-white">
                  Racun Sangga: Santet Pemisah Rumah Tangga
                </span>
              </div>
              <div>
                <span className="align-middle text-sm font-normal text-white">
                  Racun Sangga: Santet Pemisah Rumah Tangga adalah sebuah film
                  horor Indonesia tahun 2024 yang disutradarai oleh Rizal
                  Mantovani diproduksi Soraya Intercine Films. Film tersebut
                  diangkat dari sebuah utas viral karya Gusti Gina yang juga
                  bertindak sebagai penulis skenario.
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-2">
            <div className="flex items-center justify-center gap-0.5 rounded-lg bg-slate-500 px-3 py-1 saturate-50">
              <FaEye className="mt-0.5" />
              <span className="mx-1 text-lg font-normal text-white">
                Public
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-lg font-semibold text-white">17+</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-lg font-semibold text-white">12-12-2024</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-lg font-semibold text-white">2000</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-lg font-semibold text-white">20</span>
          </div>
          <div className="my-2 flex items-center justify-center">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-center">
                <span className="text-lg font-semibold text-white">80%</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-sm font-normal text-white">
                  1.5k Suka
                </span>
              </div>
              <div className="">
                <Progress progress={80} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
