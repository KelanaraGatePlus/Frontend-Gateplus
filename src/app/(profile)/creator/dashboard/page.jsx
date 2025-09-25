"use client";
/* eslint-disable react/react-in-jsx-scope */
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
import IconsChart from "@@/icons/icons-dashboard/icon-chart.svg";
import IconsUsers from "@@/icons/icons-dashboard/icons-users.svg";
import Image from "next/legacy/image";
import Link from "next/link";
import { useState } from "react";
import CustomizableAreaChart from "@/components/Chart/AreaChart";
import IconsChartNotFill from "@@/icons/icons-dashboard/icon-chart-not-fill.svg";
import IconWallet from "@@/icons/icons-dashboard/icons-wallet.svg";
import DefaultProgressBar from "@/components/ProgressBar/DefaultProgressBar";
import IconBag from "@@/icons/icons-dashboard/icons-bag.svg";
import IconBarChart from "@@/icons/icons-dashboard/icons-barchart.svg";
import IconEye from "@@/icons/icons-dashboard/icons-eye.svg";
import IconPeople from "@@/icons/icons-dashboard/icons-people.svg";
import IconLike from "@@/icons/icons-dashboard/icons-like.svg";
import IconDevice from "@@/icons/icons-dashboard/icons-device.svg";
import DefaultPieChart from "@/components/Chart/PieChart";
import IconEyeCircle from "@@/icons/icons-dashboard/icons-eye-circle.svg";
import IconPeopleCircle from "@@/icons/icons-dashboard/icons-people-circle.svg";
import IconLikeCircle from "@@/icons/icons-dashboard/icons-like-circle.svg";
import IconChartCircle from "@@/icons/icons-dashboard/icons-chart-circle.svg";

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
    <div className="montserratFont flex flex-col gap-8">
      {/* Dashboard Creators */}
      <section className="grid grid-cols-7 gap-8 text-white my-5 font-monsetrat">
        {/* Penghasilan */}
        <div className="col-span-5 flex flex-col gap-6">
          <div className="flex flex-row w-full justify-between items-center">
            <div className="flex flex-row items-center gap-2">
              <h1 className="text-3xl font-black zeinFont">Penghasilan</h1>
            </div>
            <p className="text-[#156EB7] font-bold">Lainnya</p>
          </div>
          <div className="grid grid-cols-2 gap-8 w-full">
            <div className="flex col-span-1 flex-col items-center gap-10 p-4 rounded-lg border border-white bg-gradient-to-r from-[#1FC16BB2] to-[#0F5B32B2]">
              <div className="flex flex-row w-full justify-between items-center">
                <h2 className="font-bold">Total Saldo Aktif & Tersedia</h2>
                <div className="rounded-full bg-[#1FC16B4D] items-center justify-center py-1 px-4 flex flex-row gap-2">
                  <Image
                    src={IconsChart}
                    width={18}
                    height={18}
                  />
                  <p>+50%</p>
                </div>
              </div>
              <div className="flex flex-row w-full justify-between items-center">
                <p className="font-bold text-[16px]">Rp.<span className="text-4xl">10.000.000</span></p>
                <h2 className="font-normal">Total Balance</h2>
              </div>
            </div>
            <div className="flex col-span-1 flex-row items-center gap-6">
              <div className="flex flex-col p-4 w-full h-max rounded-lg bg-[#393939] gap-2">
                <h2>Pendapatan Bulan Lalu</h2>
                <div className="flex flex-row items-start font-semibold text-[16px]">
                  <p>
                    Rp
                  </p>
                  <p className="text-xl">10.000.000</p>
                </div>
              </div>
              <div className="flex flex-col p-4 w-full h-max rounded-lg bg-[#393939] gap-2">
                <h2>Pendapatan Hari Ini</h2>
                <div className="flex flex-row items-start font-semibold text-[16px]">
                  <p>
                    Rp
                  </p>
                  <p className="text-xl">600.000</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full p-4 rounded-lg bg-[#393939] flex flex-col gap-4">
            <h2 className="font-medium">Trend 7 Hari Terakhir</h2>
            <div className="w-full h-60">
              <CustomizableAreaChart
                data={chartData}
                strokeColor="#1FC16B" // Biru tua
                gradientColors={["#1FC16B", "#007838"]} // Biru langit ke cyan
              />
            </div>
          </div>

          <div className="w-full flex flex-row rounded-lg gap-4 font-medium">
            <div className="w-full p-2.5 rounded-lg bg-[#1482C9B2] flex flex-row gap-2 items-center justify-center">
              <Image
                src={IconWallet}
                width={24}
                height={24}
              />
              <p>Penarikan</p>
            </div>
            <div className="w-full p-2.5 rounded-lg bg-[#1FC16BB2] flex flex-row gap-2 items-center justify-center">
              <Image
                src={IconsChartNotFill}
                width={24}
                height={24}
              />
              <p>Penarikan</p>
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
              <h1 className="text-3xl font-black zeinFont">History Penarikan</h1>
            </div>
            <p className="text-[#156EB7] font-bold">Lainnya</p>
          </div>
          <div className="flex flex-col gap-2 items-center w-full p-4 bg-[#393939] rounded-lg h-full text-xs">
            <div className="flex flex-row justify-between items-center w-full border-b-2 border-[#979797] py-2">
              <p>17 Mar - 23 Mar</p>
              <Image
                src={IconsDownload}
                width={24}
              />
            </div>
            <div className="flex flex-row justify-between items-center w-full border-b-2 border-[#979797] py-2">
              <p>17 Mar - 23 Mar</p>
              <Image
                src={IconsDownload}
                width={24}
              />
            </div>
            <div className="flex flex-row justify-between items-center w-full border-b-2 border-[#979797] py-2">
              <p>17 Mar - 23 Mar</p>
              <Image
                src={IconsDownload}
                width={24}
              />
            </div>
            <div className="flex flex-row justify-between items-center w-full border-b-2 border-[#979797] py-2">
              <p>17 Mar - 23 Mar</p>
              <Image
                src={IconsDownload}
                width={24}
              />
            </div>
            <div className="flex flex-row justify-between items-center w-full border-b-2 border-[#979797] py-2">
              <p>17 Mar - 23 Mar</p>
              <Image
                src={IconsDownload}
                width={24}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-[#393939] rounded-lg p-4 w-full flex flex-col gap-16 text-white">
          <div className="flex flex-row items-center gap-2.5">
            <Image
              src={IconsChart}
              width={30}
              height={30}
            />
            <h2 className="font-semibold">Bulan Ini</h2>
          </div>
          <div className="flex flex-col px-6 gap-4">
            <div className="flex flex-col gap-0 justify-center">
              <div className="flex flex-row gap-0 items-end">
                <p className="font-normal text-2xl">Rp</p>
                <p className="font-bold text-4xl">10.000.000</p>
              </div>
              <p className="text-xs"><span className="text-[#1FC16B]">+50% </span>VS Bulan Lalu</p>
            </div>
            <div className="w-full h-32">
              <CustomizableAreaChart
                noFill={true}
                data={chartData}
                strokeColor="#1FC16B"
              />
            </div>
          </div>
        </div>
        <div className="bg-[#393939] rounded-lg px-4 pt-4 pb-16 w-full flex flex-col gap-16 text-white">
          <div className="flex flex-row items-center gap-2.5">
            <Image
              src={IconBag}
              width={30}
              height={30}
            />
            <h2 className="font-semibold">Total Ditarik</h2>
          </div>
          <div className="flex flex-col px-6 gap-4">
            <div className="flex flex-col gap-0 justify-center">
              <div className="flex flex-row gap-0 items-end">
                <p className="font-normal text-2xl">Rp</p>
                <p className="font-bold text-4xl">10.000.000</p>
              </div>
              <p className="text-xs"><span className="text-[#FFDB43]">50 </span>Conversion Rate</p>
            </div>
            <div className="w-full h-32 flex flex-col items-center justify-center gap-1">
              <div className="flex flex-row justify-between w-full items-center text-xs">
                <p>Saldo Ditarik</p>
                <p>70%</p>
              </div>
              <DefaultProgressBar
                progress={70}
                backgroundColor="#FFDB43"
              />
            </div>
          </div>
        </div>
      </section>


      {/* Analitik & Insight */}
      <section className="flex flex-col w-full gap-6 mb-10">
        <div className="flex flex-row w-full justify-between items-center text-white">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black zeinFont">Analitik & Insight</h1>
            <p className="text-[#979797]">Monitor performa konten dan perilaku penonton dengan analisa mendalam</p>
          </div>
          <button className="bg-[#175BA6] flex flex-row gap-2 items-center justify-center py-2 px-4 rounded-lg">
            <Image
              src={IconBarChart}
              width={28}
              height={28}
            />
            <p className="font-bold text-sm">Lihat Detail Lengkap</p>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gradient-to-b from-[#393939] to-[#222222] rounded-lg w-full p-4 border-[#686868] border flex flex-col gap-4">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row gap-2.5 items-center">
                <Image
                  src={IconEye}
                  width={48}
                  height={48}
                />
                <h3 className="text-3xl text-white font-medium">Analitik Penonton</h3>
              </div>
              <h4 className="font-bold text-3xl text-[#1482C9]">3M</h4>
            </div>

            <p className="text-lg text-[#979797]">
              Total views, demografi penonton, peak hours, dan geographical distribution untuk memahami audience Anda
            </p>

            <div className="border border-[#1482C9] p-2 w-full h-60 rounded-lg flex flex-col text-white">
              <h2 className="text-xs">7 Hari Terakhir</h2>
              <CustomizableAreaChart
                data={chartData}
                strokeColor="#1482C9"
                gradientColors={["#1482C9", "#193B89"]} // Biru langit ke cyan
              />
            </div>

            <div className="flex flex-row items-center gap-2 relative">
              <div className="w-4 h-4 bg-[#1FC16B] rounded-full filter blur-[3px]"></div>
              <p className="text-xs font-semibold text-white">Realtime Data</p>
            </div>
          </div>
          <div className="bg-gradient-to-b from-[#393939] to-[#222222] rounded-lg w-full p-4 border-[#686868] border flex flex-col gap-4">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row gap-2.5 items-center">
                <Image
                  src={IconPeople}
                  width={48}
                  height={48}
                />
                <h3 className="text-3xl text-white font-medium">Analitik Penonton</h3>
              </div>
              <h4 className="font-bold text-3xl text-[#F07F26]">129K</h4>
            </div>

            <p className="text-lg text-[#979797]">
              Total views, demografi penonton, peak hours, dan geographical distribution untuk memahami audience Anda
            </p>

            <div className="border border-[#F07F26] p-2 w-full h-60 rounded-lg flex flex-col text-white">
              <h2 className="text-xs">7 Hari Terakhir</h2>
              <CustomizableAreaChart
                data={chartData}
                strokeColor="#F07F26"
                noFill={true}
              />
            </div>
            <div className="flex flex-row items-center gap-2 relative">
              <div className="w-4 h-4 bg-[#1FC16B] rounded-full filter blur-[3px]"></div>
              <p className="text-xs font-semibold text-white">Realtime Data</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gradient-to-b from-[#393939] to-[#222222] rounded-lg w-full p-4 border-[#686868] border flex flex-col gap-4">
            <div className="flex flex-row gap-2.5 items-center">
              <Image
                src={IconLike}
                width={28}
                height={28}
              />
              <h3 className="text-[16px] text-white font-medium">Engagement</h3>
            </div>
            <div className="flex flex-col gap-1 w-full h-40">
              <h4 className="text-white">Rate</h4>
              <CustomizableAreaChart
                data={chartData}
                strokeColor="#1FC16B"
                noFill={true}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 w-full text-sm">
              <div className="flex flex-col">
                <h4 className="text-white">Likes</h4>
                <p className=" text-[#1FC16B]">120k</p>
              </div>
              <div className="flex flex-col">
                <h4 className="text-white">Comments</h4>
                <p className="text-[#1FC16B]">30k</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-b from-[#393939] to-[#222222] rounded-lg w-full p-4 border-[#686868] border flex flex-col gap-6">
            <div className="flex flex-row gap-2.5 items-center">
              <Image
                src={IconEye}
                width={28}
                height={28}
              />
              <h3 className="text-[16px] text-white font-medium">Watch Time</h3>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <div className="flex flex-row justify-between w-full items-center text-sm">
                <h4 className="text-white">Retention Rate</h4>
                <p className="text-[#10ADF0]">70%</p>
              </div>
              <DefaultProgressBar
                progress={70}
                backgroundColor="#1482C9"
                data={chartData}
                strokeColor="#1482C9"
                noFill={true}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 w-full text-sm">
              <div className="flex flex-col">
                <h4 className="text-white">Likes</h4>
                <p className=" text-[#10ADF0]">120k</p>
              </div>
              <div className="flex flex-col">
                <h4 className="text-white">Comments</h4>
                <p className="text-[#10ADF0]">30k</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-b from-[#393939] to-[#222222] rounded-lg w-full p-4 border-[#686868] border flex flex-col gap-6">
            <div className="flex flex-row gap-2.5 items-center">
              <Image
                src={IconDevice}
                width={28}
                height={28}
              />
              <h3 className="text-[16px] text-white font-medium">Device</h3>
            </div>
            <div className="p-2 w-full h-60 rounded-lg flex flex-col text-white">
              <DefaultPieChart />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6 bg-gradient-to-b from-[#393939] to-[#222222] p-4 rounded-lg border-[#686868] border">
          <div className="flex flex-row gap-4">
            <Image
              src={IconEyeCircle}
              width={60}
              height={60}
            />
            <div className="flex flex-col gap-1 text-sm text-white justify-center">
              <h3>Total Views</h3>
              <p className="text-[#1FC16B]">1200K</p>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <Image
              src={IconPeopleCircle}
              width={60}
              height={60}
            />
            <div className="flex flex-col gap-1 text-sm text-white justify-center">
              <h3>Followers</h3>
              <p className="text-[#1FC16B]">1200K</p>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <Image
              src={IconChartCircle}
              width={60}
              height={60}
            />
            <div className="flex flex-col gap-1 text-sm text-white justify-center">
              <h3>Growth Rate</h3>
              <p className="text-[#1FC16B]">1200K</p>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <Image
              src={IconLikeCircle}
              width={60}
              height={60}
            />
            <div className="flex flex-col gap-1 text-sm text-white justify-center">
              <h3>Avg Likes</h3>
              <p className="text-[#1FC16B]">1200K</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Creators 2 */}
      <section className="flex flex-col text-white gap-4">
        <div className="flex flex-col gap-0">
          <h1 className="text-3xl font-black zeinFont">Konten Categories</h1>
          <p className="text-[16px] text-[#979797]">Overview konten yang telah Anda upload berdasarkan kategori</p>
        </div>
        <div className="grid grid-cols-5 gap-6">
          <Link href={`/${contentType.movie.pluralName}/upload`} className="w-full h-max p-4 bg-gradient-to-b from-[#393939] to-[#222222] rounded-md flex flex-col items-center justify-between">
            <Image
              src={contentType.movie.icon}
              width={148}
              height={148}
            />
            <h3 className="font-bold text-xl">MOVIE</h3>
            <h4 className="text-sm">12 Konten</h4>
          </Link>
          <Link href={`/${contentType.series.pluralName}/upload`} className="w-full h-max p-4 bg-gradient-to-b from-[#393939] to-[#222222] rounded-md flex flex-col items-center justify-between">
            <Image
              src={contentType.series.icon}
              width={148}
              height={148}
            />
            <h3 className="font-bold text-xl">SERIES</h3>
            <h4 className="text-sm">2 Series</h4>
            <h4 className="text-sm">12 Konten</h4>
          </Link>
          <Link href={`/${contentType.podcasts.pluralName}/upload`} className="w-full h-max p-4 bg-gradient-to-b from-[#393939] to-[#222222] rounded-md flex flex-col items-center justify-between">
            <Image
              src={contentType.podcasts.icon}
              width={148}
              height={148}
            />
            <h3 className="font-bold text-xl">PODCAST</h3>
            <h4 className="text-sm">2 Series</h4>
            <h4 className="text-sm">12 Konten</h4>
          </Link>
          <Link href={`/${contentType.ebooks.pluralName}/upload`} className="w-full h-max p-4 bg-gradient-to-b from-[#393939] to-[#222222] rounded-md flex flex-col items-center justify-between">
            <Image
              src={contentType.ebooks.icon}
              width={148}
              height={148}
            />
            <h3 className="font-bold text-xl">EBOOK</h3>
            <h4 className="text-sm">2 Series</h4>
            <h4 className="text-sm">12 Konten</h4>
          </Link>
          <Link href={`/${contentType.comics.pluralName}/upload`} className="w-full h-max p-4 bg-gradient-to-b from-[#393939] to-[#222222] rounded-md flex flex-col items-center justify-between">
            <Image
              src={contentType.comics.icon}
              width={148}
              height={148}
            />
            <h3 className="font-bold text-xl">COMIC</h3>
            <h4 className="text-sm">2 Series</h4>
            <h4 className="text-sm">12 Konten</h4>
          </Link>
        </div>
      </section>
    </div>
  );
}
