"use client";
import { useGetContentDashboardQuery, useGetEngagementOverviewQuery, useGetOverviewDashboardQuery, useGetPerContentDashboardQuery, useGetRevenueOverviewQuery, useGetViewersOverviewQuery } from "@/hooks/api/creatorSliceAPI";
import React from "react";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { ChartLineIcon, ChevronDownIcon, CircleDollarSignIcon, EyeIcon, MessageSquareIcon, ThumbsUpIcon, UserRoundIcon } from "lucide-react";
import CustomizableAreaChart from "@/components/Chart/AreaChart";
import DefaultProgressBar from "@/components/ProgressBar/DefaultProgressBar";
import DefaultPieChart from "@/components/Chart/PieChart";
import CustomizableComposedChart from "@/components/Chart/CustomizableComposedChart";
import CustomizableMultiBarChart from "@/components/Chart/CustomizableMultiBarChart";
import HeaderUploadForm from "@/components/UploadForm/HeaderUploadForm";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";

export default function DashboardDetailPage() {
    const [isActive, setIsActive] = useState(0);
    const { data: contentData } = useGetPerContentDashboardQuery();
    const { data: contentDashboardData } = useGetContentDashboardQuery();
    const daysDropdownItems = [
        { key: 7, label: "7 Hari" },
        { key: 14, label: "14 Hari" },
        { key: 30, label: "30 Hari" },
    ];
    const [selectedDayItem, setSelectedDayItem] = useState(daysDropdownItems[0]);
    const { data: overviewData } = useGetOverviewDashboardQuery({ days: selectedDayItem.key });
    const { dailyViews, dailyLikes, dailyComments } = overviewData?.data || {};

    const mergeDailyData = () => {
        const viewMap = new Map(dailyViews?.logsByDay?.map(v => [v.date, v.count]));
        const likeMap = new Map(dailyLikes?.map(v => [v.date, v.like]));
        const commentMap = new Map(dailyComments?.map(v => [v.date, v.comment]));

        // ambil semua tanggal unik
        const allDates = Array.from(new Set([
            ...viewMap.keys(),
            ...likeMap.keys(),
            ...commentMap.keys(),
        ])).sort();

        // gabungkan jadi satu objek per tanggal
        return allDates.map(date => ({
            name: date,
            views: viewMap.get(date) || 0,
            likes: likeMap.get(date) || 0,
            comments: commentMap.get(date) || 0,
        }));
    };

    const { data: viewersOverviewData, isLoading: isViewersOverviewLoading } = useGetViewersOverviewQuery(undefined, {
        skip: isActive !== 1,
    });
    const {
        data: overviewRevenueData
    } = useGetRevenueOverviewQuery({ days: selectedDayItem.key }, {
        skip: isActive !== 4,
    });
    const {
        data: engagementData
    } = useGetEngagementOverviewQuery({ days: selectedDayItem.key }, {
        skip: isActive !== 3,
    });

    const chartData = mergeDailyData();

    const tabsData = [
        {
            key: 'overview',
            title: 'Overview',
            description: 'Forecasting trend konten dan audiens',
            view: <>
                <div className="grid grid-cols-4 gap-6">

                    {/* === TOTAL VIEWS === */}
                    <div className="flex flex-row justify-between bg-gradient-to-b from-[#393939] to-[#222222] py-5 px-4 outline-[#686868] outline rounded-lg shadow shadow-black">
                        <div className="flex flex-row gap-1">
                            <EyeIcon size={60} className="text-[#1FC16B]" />
                            <div className="flex flex-col text-sm text-white justify-center">
                                <h3 className="text-[#979797]">Total Views</h3>
                                <p className="text-white text-2xl font-medium">
                                    {overviewData?.data?.dailyViews?.totalLogs || 0}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <ChartLineIcon
                                size={15}
                                className={`${overviewData?.data?.viewGrowthPercentage >= 0
                                    ? "text-[#1FC16B]"
                                    : "text-[#EF4444]"
                                    }`}
                            />
                            <p
                                className={`text-xs font-medium ${overviewData?.data?.viewGrowthPercentage >= 0
                                    ? "text-[#1FC16B]"
                                    : "text-[#EF4444]"
                                    }`}
                            >
                                {overviewData?.data?.viewGrowthPercentage || 0}%
                            </p>
                        </div>
                    </div>

                    {/* === FOLLOWERS === */}
                    <div className="flex flex-row justify-between bg-gradient-to-b from-[#393939] to-[#222222] py-5 px-4 outline-[#686868] outline rounded-lg shadow shadow-black">
                        <div className="flex flex-row gap-1">
                            <UserRoundIcon size={60} className="text-[#1482C9]" />
                            <div className="flex flex-col text-sm text-white justify-center">
                                <h3 className="text-[#979797]">Followers</h3>
                                <p className="text-white text-2xl font-medium">
                                    {overviewData?.data?.totalFollowers || 0}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <ChartLineIcon
                                size={15}
                                className={`${overviewData?.data?.followersPercentageChange >= 0
                                    ? "text-[#1FC16B]"
                                    : "text-[#EF4444]"
                                    }`}
                            />
                            <p
                                className={`text-xs font-medium ${overviewData?.data?.followersPercentageChange >= 0
                                    ? "text-[#1FC16B]"
                                    : "text-[#EF4444]"
                                    }`}
                            >
                                {overviewData?.data?.followersPercentageChange || 0}%
                            </p>
                        </div>
                    </div>

                    {/* === ENGAGEMENT RATE === */}
                    <div className="flex flex-row justify-between bg-gradient-to-b from-[#393939] to-[#222222] py-5 px-4 outline-[#686868] outline rounded-lg shadow shadow-black">
                        <div className="flex flex-row gap-1">
                            <ThumbsUpIcon size={60} className="text-[#DFB400]" />
                            <div className="flex flex-col text-sm text-white justify-center">
                                <h3 className="text-[#979797]">Engagement</h3>
                                <p className="text-white text-2xl font-medium">
                                    {overviewData?.data?.totalEngagement || 0}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-1">
                            <ChartLineIcon
                                size={15}
                                className={`${overviewData?.data?.engagementGrowthPercentage?.toFixed(2) >= 0
                                    ? "text-[#1FC16B]"
                                    : "text-[#EF4444]"
                                    }`}
                            />
                            <p
                                className={`text-xs font-medium ${overviewData?.data?.engagementGrowthPercentage?.toFixed(2) >= 0
                                    ? "text-[#1FC16B]"
                                    : "text-[#EF4444]"
                                    }`}
                            >
                                {overviewData?.data?.engagementGrowthPercentage?.toFixed(2) ?? 0}%
                            </p>
                        </div>
                    </div>

                    {/* === REVENUE === */}
                    <div className="flex flex-row justify-between bg-gradient-to-b from-[#393939] to-[#222222] py-5 px-4 outline-[#686868] outline rounded-lg shadow shadow-black">
                        <div className="flex flex-row gap-1">
                            <CircleDollarSignIcon size={60} className="text-[#1FC16B]" />
                            <div className="flex flex-col text-sm text-white justify-center">
                                <h3 className="text-[#979797]">Revenue</h3>
                                <p className="text-white text-2xl font-medium">
                                    Rp{overviewData?.data?.totalRevenue || 0}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-1">
                            <ChartLineIcon
                                size={15}
                                className={`${overviewData?.data?.revenueGrowthPercentage >= 0
                                    ? "text-[#1FC16B]"
                                    : "text-[#EF4444]"
                                    }`}
                            />
                            <p
                                className={`text-xs font-medium ${overviewData?.data?.revenueGrowthPercentage >= 0
                                    ? "text-[#1FC16B]"
                                    : "text-[#EF4444]"
                                    }`}
                            >
                                {overviewData?.data?.revenueGrowthPercentage ?? 0}%
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-gradient-to-b from-[#393939] to-[#222222] rounded-lg w-full p-4 border-[#686868] border flex flex-col gap-4">
                        <div className="flex flex-row gap-2.5 items-center">
                            <ThumbsUpIcon size={32} className="text-[#1FC16B]" />
                            <h3 className="text-3xl text-white font-medium">Engagement</h3>
                        </div>

                        <div className="p-2 w-full h-96 rounded-lg flex flex-col text-white">
                            <CustomizableComposedChart
                                data={chartData}
                                charts={[
                                    {
                                        type: "area",
                                        dataKey: "views",
                                        strokeColor: "#3b82f6",
                                        gradientColors: ["#93c5fd", "#3b82f6"],
                                        label: "Views",
                                    },
                                    {
                                        type: "bar",
                                        dataKey: "likes",
                                        strokeColor: "#f59e0b",
                                        fillColor: "#fbbf24",
                                        label: "Likes",
                                    },
                                    {
                                        type: "area",
                                        dataKey: "comments",
                                        strokeColor: "#ef4444",
                                        gradientColors: ["#fca5a5", "#ef4444"],
                                        label: "Comments",
                                    },
                                ]}
                                withAxis
                                showLegend
                            />
                        </div>
                    </div>
                </div>

                <section className="grid grid-cols-3 gap-4 mb-10">
                    <div className="bg-gradient-to-b from-[#393939] to-[#222222] border-[#686868] border rounded-lg p-4 w-full flex flex-col gap-16 text-white">
                        <h2 className="font-semibold">Top Performing Content</h2>

                        <div className="flex flex-col px-6 gap-4">
                            <div className="flex flex-col gap-0 justify-center">
                                <div className="flex flex-row gap-0 items-end">
                                    <p className="font-normal text-2xl">Rp</p>
                                    <p className="font-bold text-4xl">50.000</p>
                                </div>
                                <p className="text-xs"><span className="text-[#1FC16B]">+5% </span>VS Bulan Lalu</p>
                            </div>
                            <div className="w-full h-32">
                                <CustomizableAreaChart
                                    noFill={true}
                                    data={[]}
                                    strokeColor="#1FC16B"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-b from-[#393939] to-[#222222] rounded-lg w-full p-4 border-[#686868] border flex flex-col gap-6">
                        <h3 className="text-[16px] text-white font-medium">Device</h3>
                        <div className="p-2 w-full h-60 rounded-lg flex flex-col text-white">
                            <DefaultPieChart data={
                                overviewData?.data?.deviceTypePercentages?.map(item => ({
                                    name: item.device,
                                    value: item.percentage,
                                    percentage: item.percentage,
                                    color: item.device === "MOBILE" ? "#1FC16B" : item.device === "DESKTOP" ? "#1482C9" : "#DFB400",
                                })) || []
                            }
                            />
                        </div>
                    </div>
                    <div className="bg-gradient-to-b from-[#393939] to-[#222222] border-[#686868] border rounded-lg px-4 pt-4 pb-16 w-full flex flex-col gap-16 text-white">
                        <h2 className="font-semibold">Growth Trend</h2>
                        <div className="flex flex-col px-6 gap-4">
                            <div className="w-full flex flex-col items-center justify-center gap-1">
                                <div className="flex flex-row justify-between w-full items-center text-xs">
                                    <p>Follower Growth</p>
                                    <p className="text-[#1FC16B]">{overviewData?.data?.followersPercentageChange}%</p>
                                </div>
                                <DefaultProgressBar
                                    progress={overviewData?.data?.followersPercentageChange > 100 ? 100 : overviewData?.data?.followersPercentageChange || 0}
                                    barColor="#1FC16B"
                                />
                            </div>
                            <div className="w-full flex flex-col items-center justify-center gap-1">
                                <div className="flex flex-row justify-between w-full items-center text-xs">
                                    <p>View Growth</p>
                                    <p className="text-[#1482C9]">{overviewData?.data?.viewGrowthPercentage}%</p>
                                </div>
                                <DefaultProgressBar
                                    progress={overviewData?.data?.viewGrowthPercentage > 100 ? 100 : overviewData?.data?.viewGrowthPercentage || 0}
                                    barColor="#1482C9"
                                />
                            </div>
                            <div className="w-full flex flex-col items-center justify-center gap-1">
                                <div className="flex flex-row justify-between w-full items-center text-xs">
                                    <p>Revenue Growth</p>
                                    <p className="text-[#DFB400]">{overviewData?.data?.revenueGrowthPercentage}%</p>
                                </div>
                                <DefaultProgressBar
                                    progress={overviewData?.data?.revenueGrowthPercentage > 100 ? 100 : overviewData?.data?.revenueGrowthPercentage || 0}
                                    barColor="#DFB400"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </>
        }, {
            key: 'audience',
            title: 'Audience',
            description: 'Pengelompokan perilaku audiens',
            view: <>
                <div className="grid grid-cols-5 gap-4 mb-10">
                    {viewersOverviewData && <div className="bg-gradient-to-b col-span-2 from-[#393939] to-[#222222] border-[#686868] border rounded-lg p-4 w-full flex flex-col gap-8 text-white">
                        <h2 className="font-semibold text-2xl">Gender Demographic</h2>
                        <div className="w-full h-60">
                            <DefaultPieChart
                                data={
                                    viewersOverviewData.data.genderDemographics.map((item, index) => ({
                                        name: item.name,
                                        value: item.value,
                                        percentage: item.percentage,
                                        color: index === 0 ? "#1482C9" : "#1FC16B",
                                    })) || []
                                }
                                withAxis
                            />
                        </div>
                    </div>}
                    {viewersOverviewData && <div className="bg-gradient-to-b col-span-2 from-[#393939] to-[#222222] border-[#686868] border rounded-lg p-4 w-full flex flex-col gap-8 text-white">
                        <h2 className="font-semibold text-2xl">Age Demographic</h2>
                        <div className="flex flex-col gap-4">
                            <div className="w-full h-60">
                                <CustomizableMultiBarChart
                                    data={viewersOverviewData?.data?.genderAndAgeDemographics.map(item => {
                                        return {
                                            name: item.range,
                                            male: item.male,
                                            female: item.female,
                                        }
                                    })}
                                    bars={[
                                        { key: "male", color: "#1FC16B", label: "Male" },
                                        { key: "female", color: "#1482C9", label: "Female" },
                                    ]}
                                    withAxis
                                />
                            </div>
                        </div>
                    </div>}
                    {
                        isViewersOverviewLoading && Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton key={index} className="col-span-1 bg-gradient-to-b from-[#393939] to-[#222222] border-[#686868] border rounded-lg p-4 w-full flex flex-col gap-8 text-white" />
                        ))
                    }
                </div>
            </>
        },
        {
            key: 'content',
            title: 'Content',
            description: 'Pelacakan journey penonton',
            view: <>
                <div className="bg-gradient-to-b from-[#393939] to-[#222222] border-[#686868] border rounded-lg p-4 w-full flex flex-col gap-16 text-white">
                    <h2 className="font-semibold text-2xl">Content Performance Analysis</h2>

                    <div className="flex flex-col px-6 gap-4">
                        <div className="w-full h-60">
                            <CustomizableComposedChart
                                data={[
                                    { name: "A", sales: 590, profit: 800, expense: 1400, visitors: 490 },
                                    { name: "B", sales: 868, profit: 967, expense: 1506, visitors: 590 },
                                    { name: "C", sales: 1397, profit: 1098, expense: 989, visitors: 350 },
                                    { name: "D", sales: 1480, profit: 1200, expense: 1228, visitors: 480 },
                                    { name: "E", sales: 1520, profit: 1108, expense: 1100, visitors: 460 },
                                    { name: "F", sales: 1400, profit: 680, expense: 1700, visitors: 380 },

                                ]}
                                charts={[
                                    {
                                        type: "area",
                                        dataKey: "expense",
                                        strokeColor: "#a855f7",
                                        gradientColors: ["#c084fc", "#a855f7"],
                                        label: "Expense",
                                    },
                                    {
                                        type: "bar",
                                        dataKey: "profit",
                                        strokeColor: "#f59e0b",
                                        fillColor: "#fbbf24",
                                        label: "Profit",
                                    },
                                    {
                                        type: "area",
                                        dataKey: "sales",
                                        strokeColor: "#16a34a",
                                        label: "Sales",
                                    },
                                ]}
                                withAxis
                                showLegend
                            />

                        </div>
                    </div>
                </div>
            </>
        },
        {
            key: 'engagement',
            title: 'Engagement',
            description: 'Analisis mendalam setiap konten',
            view: <>
                <div className="bg-gradient-to-b from-[#393939] to-[#222222] border-[#686868] border rounded-lg p-4 w-full flex flex-col gap-16 text-white">
                    <h2 className="font-semibold text-2xl">Content Performance Analysis</h2>

                    <div className="flex flex-col px-6 gap-4">
                        <div className="w-full h-60">
                            <CustomizableComposedChart
                                data={
                                    engagementData?.data?.dailyRatios.map(item => ({
                                        name: item.date,
                                        viewToClickRatio: item.viewToClickRatio,
                                        likeToViewsRatio: item.likesToViewsRatio,
                                        commentsToViewsRatio: item.commentsToViewsRatio,
                                    })) || []
                                }
                                charts={[
                                    {
                                        type: "area",
                                        dataKey: "viewToClickRatio",
                                        strokeColor: "#a855f7",
                                        gradientColors: ["#c084fc", "#a855f7"],
                                        label: "View to Click Ratio",
                                    },
                                    {
                                        type: "bar",
                                        dataKey: "likeToViewsRatio",
                                        strokeColor: "#f59e0b",
                                        fillColor: "#fbbf24",
                                        label: "Like to Views Ratio",
                                    },
                                    {
                                        type: "area",
                                        dataKey: "commentsToViewsRatio",
                                        strokeColor: "#16a34a",
                                        label: "Comments to Views Ratio",
                                    },
                                ]}
                                withAxis
                                showLegend
                            />
                        </div>
                    </div>
                </div>

                <section className="grid grid-cols-3 gap-4 mb-10">
                    <div className="bg-gradient-to-b from-[#393939] to-[#222222] rounded-lg w-full p-4 items-center justify-center border-[#686868] border flex flex-col gap-6">
                        <h3 className="text-[16px] text-white font-medium">
                            This Feature will be available Soon
                        </h3>
                    </div>
                    <div className="bg-gradient-to-b from-[#393939] to-[#222222] border-[#686868] border rounded-lg px-4 pt-4 pb-16 w-full flex flex-col gap-16 text-white">
                        <h2 className="font-semibold">Growth Trend</h2>
                        <div className="flex flex-col px-6 gap-4">
                            <div className="w-full flex flex-col items-center justify-center gap-1">
                                <div className="flex flex-row justify-between w-full items-center text-xs">
                                    <p>View To Click Ratio</p>
                                    <p className="text-[#1FC16B]">{engagementData?.data?.viewToClickRatio}</p>
                                </div>
                                <DefaultProgressBar
                                    progress={engagementData?.data?.viewToClickRatio * 100 > 100 ? 100 : engagementData?.data?.viewToClickRatio * 100 || 0}
                                    barColor="#1FC16B"
                                />
                            </div>
                            <div className="w-full flex flex-col items-center justify-center gap-1">
                                <div className="flex flex-row justify-between w-full items-center text-xs">
                                    <p>Like To View Ratio</p>
                                    <p className="text-[#1482C9]">{engagementData?.data?.likesToViewsRatio}</p>
                                </div>
                                <DefaultProgressBar
                                    progress={engagementData?.data?.likesToViewsRatio * 100 > 100 ? 100 : engagementData?.data?.likesToViewsRatio * 100 || 0}
                                    barColor="#1482C9"
                                />
                            </div>
                            <div className="w-full flex flex-col items-center justify-center gap-1">
                                <div className="flex flex-row justify-between w-full items-center text-xs">
                                    <p>Comment To View Ratio</p>
                                    <p className="text-[#DFB400]">{engagementData?.data?.commentsToViewsRatio}</p>
                                </div>
                                <DefaultProgressBar
                                    progress={engagementData?.data?.commentsToViewsRatio * 100 > 100 ? 100 : engagementData?.data?.commentsToViewsRatio * 100 || 0}
                                    barColor="#DFB400"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-b from-[#393939] to-[#222222] rounded-lg w-full p-4 items-center justify-center border-[#686868] border flex flex-col gap-6">
                        <h3 className="text-[16px] text-white font-medium">
                            This Feature will be available Soon
                        </h3>
                    </div>
                </section>
            </>
        },
        {
            key: 'revenue',
            title: 'Revenue',
            description: 'Pemantauan aktivitas langsung',
            view: <>
                <section className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-gradient-to-b from-[#393939] to-[#222222] border-[#686868] border rounded-lg px-4 pt-4 pb-16 w-full flex flex-col gap-16 text-white">
                        <h2 className="font-semibold">Growth Trend</h2>
                        <div className="flex flex-col px-6 gap-4">
                            <div className="w-full flex flex-col items-center justify-center gap-1">
                                <div className="flex flex-row justify-between w-full items-center text-xs">
                                    <p>Follower Growth</p>
                                    <p className="text-[#1FC16B]">+50%</p>
                                </div>
                                <DefaultProgressBar
                                    progress={50}
                                    barColor="#1FC16B"
                                />
                            </div>
                            <div className="w-full flex flex-col items-center justify-center gap-1">
                                <div className="flex flex-row justify-between w-full items-center text-xs">
                                    <p>View Growth</p>
                                    <p className="text-[#1482C9]">+10%</p>
                                </div>
                                <DefaultProgressBar
                                    progress={10}
                                    barColor="#1482C9"
                                />
                            </div>
                            <div className="w-full flex flex-col items-center justify-center gap-1">
                                <div className="flex flex-row justify-between w-full items-center text-xs">
                                    <p>Revenue Growth</p>
                                    <p className="text-[#DFB400]">+5%</p>
                                </div>
                                <DefaultProgressBar
                                    progress={5}
                                    barColor="#DFB400"
                                />
                            </div>
                            <div className="w-full flex flex-col items-center justify-center gap-1">
                                <div className="flex flex-row justify-between w-full items-center text-xs">
                                    <p>Revenue Growth</p>
                                    <p className="text-[#DFB400]">+5%</p>
                                </div>
                                <DefaultProgressBar
                                    progress={5}
                                    barColor="#DFB400"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-b from-[#393939] to-[#222222] border-[#686868] border rounded-lg p-4 w-full flex flex-col gap-16 text-white">
                        <h2 className="font-semibold">Revenue Trends</h2>

                        <div className="flex flex-col pr-4 gap-4">
                            <div className="w-full h-60">
                                <CustomizableAreaChart
                                    noFill={true}
                                    data={
                                        overviewRevenueData?.data?.dailyRevenue.map(
                                            item => ({
                                                date: item.date,
                                                value: item.count,
                                            })
                                        ) || []
                                    }
                                    strokeColor="#1FC16B"
                                    withAxis

                                />
                            </div>
                        </div>
                    </div>
                </section>
            </>
        },
        {
            key: 'Real-Time',
            title: 'Real-Time',
            description: 'Pemantauan aktivitas langsung',
            view: <>
                <div className="grid grid-cols-4 gap-6">
                    <div className="flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#393939] to-[#222222] py-5 px-4 outline-[#686868] outline rounded-lg shadow shadow-black">
                        <EyeIcon size={30} className="text-[#1FC16B]" />
                        <div className="flex flex-col gap-1 text-sm text-white justify-center items-center">
                            <h3 className="text-[#979797]">Active Viewers</h3>
                            <p className="text-white text-2xl font-bold">3.5 M</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#393939] to-[#222222] py-5 px-4 outline-[#686868] outline rounded-lg shadow shadow-black">
                        <UserRoundIcon size={30} className="text-[#1482C94D]" />
                        <div className="flex flex-col gap-1 text-sm text-white justify-center items-center">
                            <h3 className="text-[#979797]">Subscribers</h3>
                            <p className="text-white text-2xl font-bold">100</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#393939] to-[#222222] py-5 px-4 outline-[#686868] outline rounded-lg shadow shadow-black">
                        <ThumbsUpIcon size={30} className="text-[#DFB400]" />
                        <div className="flex flex-col gap-1 text-sm text-white justify-center items-center">
                            <h3 className="text-[#979797]">Likes</h3>
                            <p className="text-white text-2xl font-bold">+5%</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#393939] to-[#222222] py-5 px-4 outline-[#686868] outline rounded-lg shadow shadow-black">
                        <MessageSquareIcon size={30} className="text-[#1FC16B]" />
                        <div className="flex flex-col gap-1 text-sm text-white justify-center items-center">
                            <h3 className="text-[#979797]">Comments</h3>
                            <p className="text-white text-2xl font-bold">50</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 bg-gradient-to-b from-[#393939] to-[#222222] py-5 px-4 outline-[#686868] outline rounded-lg shadow shadow-black">
                    <h2 className="text-white text-md font-bold">Real Time Activity</h2>
                    <div className="w-full flex flex-col gap-2">
                        {[1, 2, 3, 4, 5].map((index) => (<div key={index} className="self-stretch px-4 py-2 bg-[#393939] text-white text-sm rounded-lg outline outline-[#686868] outline-offset-[-1px] outline-Color-neutral-700 inline-flex flex-col justify-start items-center gap-1">
                            <div className="self-stretch rounded-lg inline-flex justify-start items-center gap-2">
                                <div className="w-4 h-4 relative bg-green-500 rounded-lg" />
                                <div className="flex-1 inline-flex flex-col justify-center items-start">
                                    <div className="self-stretch inline-flex justify-start items-end">
                                        <div className="flex-1 justify-start text-Color-neutral-100 text-sm font-medium montserratFont leading-5">(nama user) was subscribed</div>
                                    </div>
                                </div>
                                <div className="inline-flex flex-col justify-start items-end">
                                    <div className="px-2 bg-Color-neutral-700 rounded-lg inline-flex justify-start items-center">
                                        <div className="text-center justify-start text-Color-neutral-100 text-xs font-medium montserratFont leading-5">43s</div>
                                    </div>
                                </div>
                            </div>
                        </div>))}
                    </div>
                </div>
            </>
        }
    ];

    return (
        <div>
            <div className="flex flex-row justify-between items-center mb-4">
                <HeaderUploadForm title={"Dashboard"} titlePosition="start" />
                <Dropdown>
                    <DropdownTrigger>
                        <button className="border-[#F5F5F5] p-2 rounded-lg border text-white font-medium text-sm flex flex-row items-center gap-2">
                            <p>{selectedDayItem.label}</p>
                            <ChevronDownIcon size={16} className="text-white" />
                        </button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Dynamic Actions"
                        items={daysDropdownItems}
                        className="
                                inline-flex
                                flex-col
                                justify-center
                                items-center
                                rounded-sm
                                border border-[#979797]
                                bg-[#393939]
                                text-white
                                py-1
                                shadow-md
                                min-w-[120px]
                                font-semibold
                                text-sm
                        "
                    >
                        {(daysDropdownItem) => (
                            <DropdownItem
                                key={daysDropdownItem.key}
                                className={daysDropdownItem.key === "delete" ? "text-danger" : ""}
                                color={daysDropdownItem.key === "delete" ? "danger" : "default"}
                                onClick={() => setSelectedDayItem(daysDropdownItem)}
                            >
                                {daysDropdownItem.label}
                            </DropdownItem>
                        )}
                    </DropdownMenu>
                </Dropdown>
            </div>
            <div className="flex flex-col gap-8">
                <div className="grid grid-cols-6 montserratFont gap-4 bg-[#393939] p-2 rounded-3xl">
                    {contentDashboardData && (
                        <>
                            {tabsData && contentData && tabsData.map((tab, index) => (
                                <div
                                    key={tab.id}
                                    onClick={() => {
                                        setIsActive(index);
                                    }}
                                    className={`self-stretch hover:cursor-pointer py-4 px-2 rounded-3xl outline-[#515151] bg-gradient-to-t backdrop-blur-xl inline-flex flex-col justify-center items-center overflow-hidden hover:from-[#222222] hover:to-[#393939] ${isActive === index ? 'from-[#222222] to-[#393939] outline' : ''}`}
                                >
                                    <div className="flex flex-col gap-1 text-center text-white montserratFont">
                                        <h3 className="text-xl font-bold leading-6">{tab.title}</h3>
                                        {tab.description && <p className="text-sm">{tab.description}</p>}
                                    </div>
                                </div>
                            ))}
                            {!contentData && (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <Skeleton key={i} className="w-full p-14 rounded-lg mt-4" baseColor="#393939" highlightColor="#686868" />
                                ))
                            )}
                        </>
                    )}
                    {!contentDashboardData && (
                        Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="w-full p-14 rounded-lg" baseColor="#393939" highlightColor="#686868" />
                        ))
                    )}
                </div>
                {tabsData[isActive].view}
            </div>
        </div>
    )
}