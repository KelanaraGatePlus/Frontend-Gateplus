"use client";
/* eslint-disable react/react-in-jsx-scope */
import AreaTrendChart from "@/components/Chart/AreaChart";
import MonthYearPicker from "@/components/Dropdown/MonthYearDropdown";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import FlexModal from "@/components/Modal/FlexModal";
import { useGetDashboardDataQuery } from "@/hooks/api/creatorSliceAPI";
import { useGetCreatorLogAnalyticsQuery } from "@/hooks/api/logSliceAPI";
import { contentType } from "@/lib/constants/contentType";
import IconsContentComics from "@@/icons/icons-dashboard/icons-content-comics.svg";
import IconsContentEbook from "@@/icons/icons-dashboard/icons-content-ebook.svg";
import IconsContentFilms from "@@/icons/icons-dashboard/icons-content-films.svg";
import IconsContentPodcast from "@@/icons/icons-dashboard/icons-content-podcast.svg";
import IconsDownload from "@@/icons/icons-dashboard/icons-download.svg";
import IconsHistory from "@@/icons/icons-dashboard/icons-history.svg";
import IconsIncome from "@@/icons/icons-dashboard/icons-penghasilan.svg";
import IconsUsers from "@@/icons/icons-dashboard/icons-users.svg";
import Image from "next/legacy/image";
import Link from "next/link";
import { useState } from "react";

export default function DashboardCreatorsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dashboardData = useGetDashboardDataQuery();
  const {
    data: clickData,
    isLoading: isAnalyticsLoading,
  } = useGetCreatorLogAnalyticsQuery("CLICK");

  // JANGAN proses data di sini

  if (isAnalyticsLoading) {
    return <LoadingOverlay />;
  }

  // ✅ Proses data HANYA setelah loading selesai
  const chartData = clickData?.data?.data?.logsByDay.map(item => ({
    date: item.date,
    value: item.count
  }));

  return (
    <div className="montserratFont">
      {/* Dashboard Creators */}
      <section className="grid grid-cols-6 gap-8 text-white mt-5 font-monsetrat">
        {/* Penghasilan */}
        <div className="col-span-4 flex flex-col gap-6">
          <div className="flex flex-row w-full justify-between items-center">
            <div className="flex flex-row items-center gap-2">
              <Image
                src={IconsIncome}
                width={24}
              />
              <h1 className="text-xl font-bold">Penghasilan</h1>
            </div>
            <p className="text-[#156EB7] font-bold">Lainnya</p>
          </div>
          <div className="grid grid-cols-4 gap-32 w-full">
            <div className="col-span-1 flex flex-col gap-2 w-max">
              <h2 className="text-lg font-bold">Proses</h2>
              <div>
                <h3>Total</h3>
                <p className="text-lg font-bold">Rp <span className="text-3xl">10.000.000</span></p>
              </div>
            </div>
            <div className="col-span-3 flex flex-col gap-2 w-full">
              <p className="text-lg font-bold">Penarikan</p>
              <div className="flex flex-row w-full justify-between items-end">
                <div>
                  <h3>Minggu Ini</h3>
                  <p className="text-lg font-bold">Rp <span className="text-3xl">5.000.000</span></p>
                </div>
                <div>
                  <h3>Bulan Ini</h3>
                  <p className="text-lg font-bold">Rp <span className="text-xl">5.000.000</span></p>
                </div>
                <div>
                  <h3>Tahun Ini</h3>
                  <p className="text-lg font-bold">Rp <span className="text-xl">5.000.000</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* History Penarikan */}
        <div className="col-span-2 flex flex-col gap-4">
          <div className="flex flex-row w-full justify-between items-center">
            <div className="flex flex-row gap-2 items-center">
              <Image
                src={IconsHistory}
                width={24}
              />
              <h1 className="text-xl font-bold">History Penarikan</h1>
            </div>
            <p className="text-[#156EB7] font-bold">Lainnya</p>
          </div>
          <div className="flex flex-col gap-2 items-center w-full p-4">
            <div className="flex flex-row justify-between items-center w-full border-b-2 border-[#979797] py-2">
              <p className="text-lg font-bold">17 Mar - 23 Mar</p>
              <Image
                src={IconsDownload}
                width={24}
              />
            </div>
            <div className="flex flex-row justify-between items-center w-full border-b-2 border-[#979797] py-2">
              <p className="text-lg font-bold">17 Mar - 23 Mar</p>
              <Image
                src={IconsDownload}
                width={24}
              />
            </div>
            <div className="flex flex-row justify-between items-center w-full border-b-2 border-[#979797] py-2">
              <p className="text-lg font-bold">17 Mar - 23 Mar</p>
              <Image
                src={IconsDownload}
                width={24}
              />
            </div>
            <div className="flex flex-row justify-between items-center w-full border-b-2 border-[#979797] py-2">
              <p className="text-lg font-bold">17 Mar - 23 Mar</p>
              <Image
                src={IconsDownload}
                width={24}
              />
            </div>
            <div className="flex flex-row justify-between items-center w-full border-b-2 border-[#979797] py-2">
              <p className="text-lg font-bold">17 Mar - 23 Mar</p>
              <Image
                src={IconsDownload}
                width={24}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Creators 2 */}
      <section className="flex flex-col text-white gap-4">
        <h1 className="text-xl font-bold">Upload Konten</h1>
        <div className="grid grid-cols-4 gap-4">
          <button onClick={() => {
            setIsModalOpen(true);
          }} className="w-full h-max p-4 hover:cursor-pointer bg-[#0881AB] rounded-md flex flex-col items-center justify-between">
            <Image
              src={IconsContentFilms}
              width={48}
            />
            <h3 className="font-normal text-sm">upload konten movie</h3>
            <h4 className="font-bold text-lg">Upload Film & Series</h4>
          </button>
          <Link href={'/podcasts/upload'} className="w-full h-max p-4 bg-[#0881AB] rounded-md flex flex-col items-center justify-between">
            <Image
              src={IconsContentPodcast}
              width={48}
            />
            <h3 className="font-normal text-sm">upload konten podcast</h3>
            <h4 className="font-bold text-lg">Upload Podcast</h4>
          </Link>
          <Link href={'/ebooks/upload'} className="w-full h-max p-4 bg-[#0881AB] rounded-md flex flex-col items-center justify-between">
            <Image
              src={IconsContentEbook}
              width={48}
            />
            <h3 className="font-normal text-sm">upload konten ebook</h3>
            <h4 className="font-bold text-lg">Upload Ebook</h4>
          </Link>
          <Link href={'/comics/upload'} className="w-full h-max p-4 bg-[#0881AB] rounded-md flex flex-col items-center justify-between">
            <Image
              src={IconsContentComics}
              width={48}
            />
            <h3 className="font-normal text-sm">upload konten komik</h3>
            <h4 className="font-bold text-lg">Upload Komik</h4>
          </Link>
          <div className="col-span-3 flex flex-col p-2 gap-6 items-center justify-center">
            <div className="flex flex-row w-full justify-between">
              <h1 className="text-lg font-bold">Analytics Penonton</h1>
              <MonthYearPicker
                defaultYear={2025}
                defaultMonth="March"
                onChange={() => {
                  // Handle month and year change
                  console.log("Month or year changed");
                }}
              />
            </div>
            <AreaTrendChart />
          </div>
          <div className="col-span-1 rounded-lg p-4 border border-white flex flex-col gap-3">
            <h2 className="text-lg font-bold">Analisa Akun</h2>
            <div className="flex flex-col gap-1">
              <h3 className="font-normal">Subscriber</h3>
              <p className="zeinFont text-4xl font-black">{dashboardData?.data?.data?.data?.totalSubscriber}</p>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold">Ringkasan</h3>
              <p className="text-xs">30 hari terakhir</p>
            </div>
            <div className="flex flex-row justify-between w-full items-center text-xs">
              <h3>Pembelian Konten</h3>
              <p>{dashboardData?.data?.data?.data?.totalTransactions}</p>
            </div>
            <div className="flex flex-row justify-between w-full items-center text-xs">
              <h3>Total Like</h3>
              <p>{dashboardData?.data?.data?.data?.totalLike}</p>
            </div>
            <div className="flex flex-row justify-between w-full items-center text-xs">
              <h3>Total Dislike</h3>
              <p>{dashboardData?.data?.data?.data?.totalDislike}</p>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold">Video Teratas</h3>
              <p className="text-xs">24 jam terakhir - penayangan</p>
            </div>
            <button className="bg-[#0E5BA8B2] text-white rounded-md p-2 py-3 font-bold">
              Analisis Akun
            </button>
          </div>
          <div className="col-span-2 flex flex-row justify-between gap-4">
            {/* Pendukung Teratas */}
            <div className="rounded-lg p-4 border border-white flex flex-col gap-3 w-full min-h-80">
              <h2 className="font-bold">Pendukung Teratas</h2>
              <div className="flex flex-col gap-2">
                {/* User */}
                {dashboardData.data?.data?.data.topSpenders.map((spenders) => (
                  <div key={spenders.user.id || spenders.user.username} className="flex flex-row justify-between items-center">
                    <div className="flex flex-row items-center gap-2">
                      <Image
                        src={IconsUsers}
                        width={42}
                        className="rounded-full"
                      />
                      <p className="font-semibold">{spenders.user.username}</p>
                    </div>
                    <p>Rp. {spenders.totalSpent.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pengikut Baru */}
            <div className="rounded-lg p-4 border border-white flex flex-col gap-3 w-full">
              <h2 className="font-bold">Pengikut Baru</h2>
              <div className="flex flex-col gap-2">
                {/* User */}
                {dashboardData.data?.data?.data?.newestSubscribers?.map((subscriber) => (
                  <div className="flex flex-row justify-between items-center" key={subscriber.id}>
                    <div className="flex flex-row items-center gap-2">
                      <Image
                        src={IconsUsers}
                        width={42}
                        className="rounded-full"
                      />
                      <p className="font-semibold">{subscriber.user.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-2 flex flex-col p-2 gap-6 items-center justify-center">
            <div className="flex flex-row w-full">
              <h1 className="text-lg font-bold">Rasio Klik Tayang</h1>
            </div>
            <AreaTrendChart data={chartData} />
          </div>
          <div className="col-span-4 flex flex-col gap-4 mt-10">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-lg font-bold">Karya Teratas</h2>
              {/* Dropdown */}
            </div>
            <div className="grid grid-cols-4 gap-10">
              {dashboardData.data?.data?.data?.topContents.map((content) => (
                <div key={content.id || content.title} className="grid grid-cols-3 items-center gap-4">
                  <div className="w-full col-span-1 aspect-[12/17]">
                    <img
                      src={content.image}
                      className="rounded-lg w-full h-full"
                    />
                  </div>
                  <div className="flex flex-col w-full col-span-2 gap-6">
                    <p className="font-semibold">{content.title}</p>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-row justify-between items-center w-full">
                        <p className="text-sm">Pembelian</p>
                        <p className="text-sm">Rp {content.totalRevenue.toLocaleString()}</p>
                      </div>
                      <div className="flex flex-row justify-between items-center w-full">
                        <p className="text-sm">Penayangan Trailer</p>
                        <p className="text-sm">{content.trailerViews.toLocaleString()}</p>
                      </div>
                      <div className="flex flex-row justify-between items-center w-full">
                        <p className="text-sm">Total Like</p>
                        <p className="text-sm">{content.likes.toLocaleString()}</p>
                      </div>
                      <div className="flex flex-row justify-between items-center w-full">
                        <p className="text-sm">Total Dislike</p>
                        <p className="text-sm">{content.dislikes.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <FlexModal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false);
      }} title={"Kategori Upload Karya"}>
        <div className="flex flex-row items-center text-white text-md px-52">
          <Link href={`/${contentType.movie.pluralName}/upload`}
            key={contentType.movie.singleName}
            className="flex flex-col items-center justify-center mr-4 hover:cursor-pointer"
          >
            <Image
              src={contentType.movie.icon}
              alt={contentType.movie.singleName}
              width={148}
            />
            <p>{contentType.movie.pluralName.toUpperCase()}</p>
          </Link>
          <Link href={`/${contentType.series.pluralName}/upload`}
            key={contentType.series.singleName}
            className="flex flex-col items-center justify-center mr-4 hover:cursor-pointer"
          >
            <Image
              src={contentType.series.icon}
              alt={contentType.series.singleName}
              width={148}
            />
            <p>{contentType.series.pluralName.toUpperCase()}</p>
          </Link>
        </div>
      </FlexModal>
    </div>
  );
}
