/* eslint-disable react/react-in-jsx-scope */
import Footer from "@/components/Footer/page";
import NavbarLogin from "@/components/NavbarLogin/page";
import IconsAnalytics from "@@/icons/icons-dashboard/icons-analytics.svg";
import IconsContentComics from "@@/icons/icons-dashboard/icons-content-comics.svg";
import IconsContentEbook from "@@/icons/icons-dashboard/icons-content-ebook.svg";
import IconsContentFilms from "@@/icons/icons-dashboard/icons-content-films.svg";
import IconsContentPodcast from "@@/icons/icons-dashboard/icons-content-podcast.svg";
import IconsDownload from "@@/icons/icons-dashboard/icons-download.svg";
import IconsHistory from "@@/icons/icons-dashboard/icons-history.svg";
import IconsIncome from "@@/icons/icons-dashboard/icons-penghasilan.svg";
import IconsPosterFilms from "@@/icons/icons-dashboard/icons-poster.svg";
import IconsUsers from "@@/icons/icons-dashboard/icons-users.svg";
import Image from "next/legacy/image";

export default function DashboardCreatorsPage() {
  return (
    <div className="flex h-screen w-screen flex-col">
      <NavbarLogin />
      <main className="">
        <section className="mx-5 my-5 grid grid-cols-4">
          <div className="col-span-3 flex flex-col">
            <div className="mx-2 flex justify-between">
              <div className="flex flex-row gap-2">
                <Image src={IconsIncome} alt="icons-income-01" />
                <span className="text-2xl font-bold text-white">
                  Penghasilan
                </span>
              </div>
              <div>
                <span className="mx-2 font-semibold text-blue-400">
                  Lainnya
                </span>
              </div>
            </div>
            <div className="my-4 grid grid-cols-4">
              <div className="grid grid-flow-row">
                <div className="text-2xl font-medium text-white">
                  <span>Proses</span>
                </div>
                <div className="my-1 font-semibold text-gray-500">Total</div>
                <div className="flex flex-row">
                  <span className="mt-2 text-white">Rp.</span>
                  <p className="text-3xl font-bold text-white">12.000.000</p>
                </div>
              </div>
              <div className="grid grid-flow-row">
                <div className="text-2xl font-medium text-white">
                  <span>Penarikan</span>
                </div>
                <div className="my-1 font-semibold text-gray-500">
                  Minggu Ini
                </div>
                <div className="flex flex-row">
                  <span className="mt-2 text-white">Rp.</span>
                  <p className="text-3xl font-bold text-white">9.000.000</p>
                </div>
              </div>
              <div className="grid grid-flow-row">
                <div className="mt-5 text-white">Bulan Ini</div>
                <div className="flex flex-row gap-1">
                  <span className="mt-1 text-white">Rp.</span>
                  <p className="text-lg font-semibold text-white">30.000.000</p>
                </div>
              </div>
              <div className="grid grid-flow-row">
                <div className="mt-5 text-white">Bulan Sebelumnya</div>
                <div className="flex flex-row gap-1">
                  <span className="mt-1 text-white">Rp.</span>
                  <p className="text-lg font-semibold text-white">35.000.000</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <div className="flex flex-row gap-2">
                <Image src={IconsHistory} alt="icons-history-01" />
                <span className="mt-0.5 text-white">History Penarikan</span>
              </div>
              <span className="mx-2 text-blue-400">Lainnya</span>
            </div>
            <div className="flex place-content-center content-center justify-between border border-b-white">
              <span className="mt-1 text-white">12 Jan - 12 Feb</span>
              <Image src={IconsDownload} alt="icons-download-001" />
            </div>
            <div className="flex place-content-center content-center justify-between border border-b-white">
              <span className="mt-1 text-white">12 Mar - 12 Apr</span>
              <Image src={IconsDownload} alt="icons-download-002" />
            </div>
            <div className="flex place-content-center content-center justify-between border border-b-white">
              <span className="mt-1 text-white">12 May - 12 June</span>
              <Image src={IconsDownload} alt="icons-download-003" />
            </div>
            <div className="flex place-content-center content-center justify-between border border-b-white">
              <span className="mt-1 text-white">12 June - 12 July</span>
              <Image src={IconsDownload} alt="icons-download-004" />
            </div>
            <div className="flex place-content-center content-center justify-between border border-b-white">
              <span className="mt-1 text-white">12 Mar - 12 Apr</span>
              <Image src={IconsDownload} alt="icons-download-005" />
            </div>
          </div>
        </section>
        <p className="mx-5 my-5 text-lg font-semibold text-white">
          Upload Konten
        </p>
        <section className="mx-5 my-5 grid grid-cols-4 gap-4">
          <div className="grid grid-flow-row content-center justify-center rounded-lg bg-[#0881AB]">
            <div className="flex justify-center">
              <Image src={IconsContentFilms} alt="icons-contents-films-01" />
            </div>
            <div className="">
              <span className="flex justify-center text-sm font-light text-white">
                Upload Konten Film
              </span>
            </div>
            <div className="">
              <span className="text-lg font-semibold text-white">
                Upload Films & Series
              </span>
            </div>
          </div>
          <div className="grid grid-flow-row content-center justify-center rounded-lg bg-[#0881AB]">
            <div className="flex justify-center">
              <Image src={IconsContentPodcast} alt="icons-contents-films-01" />
            </div>
            <div className="">
              <span className="flex justify-center text-sm font-light text-white">
                Upload Konten Podcast
              </span>
            </div>
            <div className="">
              <span className="text-lg font-semibold text-white">
                Upload Podcast
              </span>
            </div>
          </div>
          <div className="grid grid-flow-row content-center justify-center rounded-lg bg-[#0881AB]">
            <div className="flex justify-center">
              <Image src={IconsContentEbook} alt="icons-contents-films-01" />
            </div>
            <div className="">
              <span className="flex justify-center text-sm font-light text-white">
                Upload Konten Ebook
              </span>
            </div>
            <div className="">
              <span className="text-lg font-semibold text-white">
                Upload Ebook
              </span>
            </div>
          </div>
          <div className="grid grid-flow-row content-center justify-center rounded-lg bg-[#0881AB]">
            <div className="flex justify-center">
              <Image src={IconsContentComics} alt="icons-contents-films-01" />
            </div>
            <div className="">
              <span className="flex justify-center text-sm font-light text-white">
                Upload Konten Comics
              </span>
            </div>
            <div className="">
              <span className="text-lg font-semibold text-white">
                Upload Comics
              </span>
            </div>
          </div>
        </section>
        <section className="mx-5 my-5 grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <Image
              className="flex w-full"
              src={IconsAnalytics}
              alt="icons-analytics"
            />
          </div>
          <div className="flex flex-col rounded-lg border border-white">
            <span className="mx-5 my-5 text-2xl font-semibold text-white">
              Analytics Akun
            </span>
            <div className="mx-5 flex flex-col">
              <span className="text-white">Subscribers</span>
              <span className="text-2xl font-bold text-white">1.560</span>
            </div>
            <div className="mx-5 my-4 flex flex-col">
              <span className="text-lg font-bold text-white">Ringkasan</span>
              <span className="text-white">30 Hari terakhir</span>
            </div>
            <div className="mx-5 font-medium text-white">
              <div className="my-0.5 flex justify-between">
                <span>Pembelian Konten</span>
                <span>16.000</span>
              </div>
              <div className="my-0.5 flex justify-between">
                <span>Total Like</span>
                <span>12.500</span>
              </div>
              <div className="my-0.5 flex justify-between">
                <span>Total Dislike</span>
                <span>3.500</span>
              </div>
            </div>
            <div className="mx-5 my-3 flex flex-col text-white">
              <span className="text-lg font-semibold">Video Teratas</span>
              <span className="text-sm">24 Jam terakahir - Penayangan</span>
            </div>
            <div className="mx-5 my-2 mb-3 flex justify-center rounded-lg bg-[#0E5BA8B2] py-2">
              <button className="text-lg font-semibold text-white">
                Analisis Akun
              </button>
            </div>
          </div>
        </section>
        <section className="mx-5 my-5 grid grid-cols-4 gap-3">
          <div className="grid grid-flow-row rounded-lg border border-white">
            <div className="mx-2 flex items-start py-3 font-semibold">
              <span className="text-xl font-medium text-white">
                Pendukung Teratas
              </span>
            </div>
            <div className="mx-2 my-1 flex place-content-center items-center justify-between">
              <div className="flex flex-row justify-center rounded-full">
                <Image
                  className="rounded-full bg-blue-400"
                  src={IconsUsers}
                  alt="icons-users"
                />
                <span className="mx-2 flex place-content-center items-center text-white">
                  Users 1
                </span>
              </div>
              <div className="mx-2 flex justify-center text-white">
                <span>Rp.1000k</span>
              </div>
            </div>
            <div className="mx-2 my-1 flex place-content-center items-center justify-between">
              <div className="flex flex-row justify-center rounded-full">
                <Image
                  className="rounded-full bg-blue-400"
                  src={IconsUsers}
                  alt="icons-users"
                />
                <span className="mx-2 flex place-content-center items-center text-white">
                  Users 2
                </span>
              </div>
              <div className="mx-2 flex justify-center text-white">
                <span>Rp.1000k</span>
              </div>
            </div>
            <div className="mx-2 my-1 flex place-content-center items-center justify-between">
              <div className="flex flex-row justify-center rounded-full">
                <Image
                  className="rounded-full bg-blue-400"
                  src={IconsUsers}
                  alt="icons-users"
                />
                <span className="mx-2 flex place-content-center items-center text-white">
                  Users 3
                </span>
              </div>
              <div className="mx-2 flex justify-center text-white">
                <span>Rp.1000k</span>
              </div>
            </div>
            <div className="mx-2 my-1 flex place-content-center items-center justify-between">
              <div className="flex flex-row justify-center rounded-full">
                <Image
                  className="rounded-full bg-blue-400"
                  src={IconsUsers}
                  alt="icons-users"
                />
                <span className="mx-2 flex place-content-center items-center text-white">
                  Users 4
                </span>
              </div>
              <div className="mx-2 flex justify-center text-white">
                <span>Rp.1000k</span>
              </div>
            </div>
            <div className="mx-2 my-5 flex justify-center rounded-lg bg-blue-400 py-2">
              <button className="text-white">Lihat Semua</button>
            </div>
          </div>
          <div className="grid grid-flow-row rounded-lg border border-white">
            <div className="mx-2 flex items-start py-3 font-semibold">
              <span className="text-xl font-medium text-white">
                Pengikut Baru
              </span>
            </div>
            <div className="mx-2 my-1 flex place-content-center items-center justify-between">
              <div className="flex flex-row justify-center rounded-full">
                <Image
                  className="rounded-full bg-blue-400"
                  src={IconsUsers}
                  alt="icons-users"
                />
                <span className="mx-2 flex place-content-center items-center text-white">
                  Users 1
                </span>
              </div>
            </div>
            <div className="mx-2 my-1 flex place-content-center items-center justify-between">
              <div className="flex flex-row justify-center rounded-full">
                <Image
                  className="rounded-full bg-blue-400"
                  src={IconsUsers}
                  alt="icons-users"
                />
                <span className="mx-2 flex place-content-center items-center text-white">
                  Users 2
                </span>
              </div>
            </div>
            <div className="mx-2 my-1 flex place-content-center items-center justify-between">
              <div className="flex flex-row justify-center rounded-full">
                <Image
                  className="rounded-full bg-blue-400"
                  src={IconsUsers}
                  alt="icons-users"
                />
                <span className="mx-2 flex place-content-center items-center text-white">
                  Users 3
                </span>
              </div>
            </div>
            <div className="mx-2 my-1 flex place-content-center items-center justify-between">
              <div className="flex flex-row justify-center rounded-full">
                <Image
                  className="rounded-full bg-blue-400"
                  src={IconsUsers}
                  alt="icons-users"
                />
                <span className="mx-2 flex place-content-center items-center text-white">
                  Users 4
                </span>
              </div>
            </div>
            <div className="mx-2 my-5 flex justify-center rounded-lg bg-blue-400 py-2">
              <button className="text-white">Lihat Semua</button>
            </div>
          </div>
          <div className="col-span-2">
            <Image src={IconsAnalytics} alt="icons-analytics-01" />
          </div>
        </section>
        <span className="mx-5 mt-5 text-2xl font-bold text-white">
          Karya Teratas
        </span>
        <section className="mx-5 my-5 grid grid-cols-4 gap-1">
          <div className="mx-2 flex flex-row">
            <div className="">
              <Image src={IconsPosterFilms} alt="icons-posters-films-01" />
            </div>
            <div className="flex flex-col">
              <div className="mx-2 mb-4 font-semibold text-white">
                <span>Kampung Jabang Mayit Rangkaspuna</span>
              </div>
              <div className="mx-2 my-0.5 flex flex-col">
                <div className="flex justify-between text-white">
                  <span>Pembelian</span>
                  <span>2.000</span>
                </div>
              </div>
              <div className="mx-2 my-0.5 flex flex-col">
                <div className="flex justify-between text-white">
                  <span>Penayangan Trailer</span>
                  <span>2.000</span>
                </div>
              </div>
              <div className="mx-2 my-0.5 flex flex-col">
                <div className="flex justify-between text-white">
                  <span>Total Like</span>
                  <span>1.500</span>
                </div>
              </div>
              <div className="mx-2 my-0.5 flex flex-col">
                <div className="flex justify-between text-white">
                  <span>Total Dislike</span>
                  <span>100</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-2 flex flex-row">
            <div className="">
              <Image src={IconsPosterFilms} alt="icons-posters-films-01" />
            </div>
            <div className="flex flex-col">
              <div className="mx-2 mb-4 font-semibold text-white">
                <span>Kampung Jabang Mayit Rangkaspuna</span>
              </div>
              <div className="mx-2 my-0.5 flex flex-col">
                <div className="flex justify-between text-white">
                  <span>Pembelian</span>
                  <span>2.000</span>
                </div>
              </div>
              <div className="mx-2 my-0.5 flex flex-col">
                <div className="flex justify-between text-white">
                  <span>Penayangan Trailer</span>
                  <span>2.000</span>
                </div>
              </div>
              <div className="mx-2 my-0.5 flex flex-col">
                <div className="flex justify-between text-white">
                  <span>Total Like</span>
                  <span>1.500</span>
                </div>
              </div>
              <div className="mx-2 my-0.5 flex flex-col">
                <div className="flex justify-between text-white">
                  <span>Total Dislike</span>
                  <span>100</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-2 flex flex-row">
            <div className="">
              <Image src={IconsPosterFilms} alt="icons-posters-films-01" />
            </div>
            <div className="flex flex-col">
              <div className="mx-2 mb-4 font-semibold text-white">
                <span>Kampung Jabang Mayit Rangkaspuna</span>
              </div>
              <div className="mx-2 my-0.5 flex flex-col">
                <div className="flex justify-between text-white">
                  <span>Pembelian</span>
                  <span>2.000</span>
                </div>
              </div>
              <div className="mx-2 my-0.5 flex flex-col">
                <div className="flex justify-between text-white">
                  <span>Penayangan Trailer</span>
                  <span>2.000</span>
                </div>
              </div>
              <div className="mx-2 my-0.5 flex flex-col">
                <div className="flex justify-between text-white">
                  <span>Total Like</span>
                  <span>1.500</span>
                </div>
              </div>
              <div className="mx-2 my-0.5 flex flex-col">
                <div className="flex justify-between text-white">
                  <span>Total Dislike</span>
                  <span>100</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-2 flex flex-row">
            <div className="">
              <Image src={IconsPosterFilms} alt="icons-posters-films-01" />
            </div>
            <div className="flex flex-col">
              <div className="mx-2 mb-4 font-semibold text-white">
                <span>Kampung Jabang Mayit Rangkaspuna</span>
              </div>
              <div className="mx-2 my-0.5 flex flex-col">
                <div className="flex justify-between text-white">
                  <span>Pembelian</span>
                  <span>2.000</span>
                </div>
              </div>
              <div className="mx-2 my-0.5 flex flex-col">
                <div className="flex justify-between text-white">
                  <span>Penayangan Trailer</span>
                  <span>2.000</span>
                </div>
              </div>
              <div className="mx-2 my-0.5 flex flex-col">
                <div className="flex justify-between text-white">
                  <span>Total Like</span>
                  <span>1.500</span>
                </div>
              </div>
              <div className="mx-2 my-0.5 flex flex-col">
                <div className="flex justify-between text-white">
                  <span>Total Dislike</span>
                  <span>100</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
