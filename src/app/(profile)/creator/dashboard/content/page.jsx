"use client";
import ContentTable from "@/components/Table/ContentTable";
import { useGetContentDashboardQuery, useGetPerContentDashboardQuery } from "@/hooks/api/creatorSliceAPI";
import { useDeleteEbookMutation, useGetEbookPerContentAnalyticsQuery } from "@/hooks/api/ebookSliceAPI";
import { contentTypeArray, contentTypeSingle } from "@/lib/constants/contentType";
import React from "react";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import iconMore from "@@/icons/icon_more.svg";
import Image from "next/image";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import HeaderUploadForm from "@/components/UploadForm/HeaderUploadForm";
import FlexModal from "@/components/Modal/FlexModal";
import DatabaseDelete from "@@/AdditionalImages/database-delete.png";
import { useDeleteComicMutation, useGetComicPerContentAnalyticsQuery } from "@/hooks/api/comicSliceAPI";
import { useDeletePodcastMutation, useGetPodcastPerContentAnalyticsQuery } from "@/hooks/api/podcastSliceAPI";
import { useDeleteSeriesMutation, useGetSeriesPerContentAnalyticsQuery } from "@/hooks/api/seriesSliceAPI";
import { useDeleteMovieMutation, useGetMoviePerContentAnalyticsQuery } from "@/hooks/api/movieSliceAPI";
import Link from "next/link";
import PreviewContentHeader from "@/components/Header/PreviewContentHeader";
import LoadingOverlay from "@/components/LoadingOverlay/page";

export default function DashboardContentPage() {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState({ id: null, type: null });
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [detailTarget, setDetailTarget] = useState({ id: null, type: null });
    const [deleteEbook, { isLoading: isDeletingEbook }] = useDeleteEbookMutation();
    const [deleteComic, { isLoading: isDeletingComic }] = useDeleteComicMutation();
    const [deletePodcast, { isLoading: isDeletingPodcast }] = useDeletePodcastMutation();
    const [deleteSeries, { isLoading: isDeletingSeries }] = useDeleteSeriesMutation();
    const [deleteMovie, { isLoading: isDeletingMovie }] = useDeleteMovieMutation();

    // Analytics hooks - conditionally enabled based on detailTarget
    const { data: ebookAnalytics, isLoading: isLoadingEbookAnalytics } = useGetEbookPerContentAnalyticsQuery(
        detailTarget.id,
        { skip: !detailTarget.id || (detailTarget.type !== 'ebooks' && detailTarget.type !== 'ebook') }
    );
    const { data: comicAnalytics, isLoading: isLoadingComicAnalytics } = useGetComicPerContentAnalyticsQuery(
        detailTarget.id,
        { skip: !detailTarget.id || (detailTarget.type !== 'comics' && detailTarget.type !== 'comic') }
    );
    const { data: podcastAnalytics, isLoading: isLoadingPodcastAnalytics } = useGetPodcastPerContentAnalyticsQuery(
        detailTarget.id,
        { skip: !detailTarget.id || (detailTarget.type !== 'podcasts' && detailTarget.type !== 'podcast') }
    );
    const { data: seriesAnalytics, isLoading: isLoadingSeriesAnalytics } = useGetSeriesPerContentAnalyticsQuery(
        detailTarget.id,
        { skip: !detailTarget.id || detailTarget.type !== 'series' }
    );
    const { data: movieAnalytics, isLoading: isLoadingMovieAnalytics } = useGetMoviePerContentAnalyticsQuery(
        detailTarget.id,
        { skip: !detailTarget.id || (detailTarget.type !== 'movies' && detailTarget.type !== 'movie') }
    );

    const hoverColorClasses = {
        blue: 'hover:from-[#156EB7] hover:to-[#093151]',
        darkPurple: 'hover:from-[#5856D6] hover:to-[#2E2D70]',
        purple: 'hover:from-[#AF52DE] hover:to-[#5F2C78]',
        orange: 'hover:from-[#F07F26] hover:to-[#8A4916]',
        green: 'hover:from-[#00C7BE] hover:to-[#00615D]',
        grey: 'hover:from-[#222222] hover:to-[#393939]',
    };

    const colorClasses = {
        blue: 'from-[#156EB7] to-[#093151]',
        darkPurple: 'from-[#5856D6] to-[#2E2D70]',
        purple: 'from-[#AF52DE] to-[#5F2C78]',
        orange: 'from-[#F07F26] to-[#8A4916]',
        green: 'from-[#00C7BE] to-[#00615D]',
        grey: 'from-[#222222] to-[#393939]',
    };

    const colorClassesArray = Object.keys(colorClasses);
    const color = colorClassesArray.slice(0, contentTypeArray.length);
    const hoverColorClassesArray = Object.keys(hoverColorClasses);
    const hoverColor = hoverColorClassesArray.slice(0, contentTypeArray.length);
    const { data: contentData, refetch: refetchPerContent } = useGetPerContentDashboardQuery();
    const { data: contentDashboardData, refetch: refetchContentDashboard } = useGetContentDashboardQuery();

    const tabsData = [
        {
            id: 1, title: 'ALL', key: 'result',
            color: 'grey',
            hoverColor: 'grey',
        },
        ...contentTypeArray.map((type, index) => ({
            id: index + 2,
            title: type.capitalizedLabel,
            key: type.pluralName,
            color: color[index % color.length],
            hoverColor: hoverColor[index % hoverColor.length],
            totalSeries: contentData?.data?.[type.pluralName]?.length || 0,
            totalEpisodes: contentData?.data?.[type.pluralName]?.reduce((acc, item) => acc + (item.totalEpisodes || 0), 0) || null,
        }))
    ];

    const [isActive, setIsActive] = useState(tabsData[0].id);
    const [dataType, setDataType] = useState('result');

    // Get analytics data based on content type
    const getAnalyticsData = () => {
        switch (detailTarget.type) {
            case 'ebooks':
            case 'ebook':
                return ebookAnalytics?.data;
            case 'comics':
            case 'comic':
                return comicAnalytics?.data;
            case 'podcasts':
            case 'podcast':
                return podcastAnalytics?.data;
            case 'series':
                return seriesAnalytics?.data;
            case 'movies':
            case 'movie':
                return movieAnalytics?.data;
            default:
                return null;
        }
    };

    const analyticsData = getAnalyticsData();
    const isLoadingAnalytics = isLoadingEbookAnalytics || isLoadingComicAnalytics ||
        isLoadingPodcastAnalytics || isLoadingSeriesAnalytics ||
        isLoadingMovieAnalytics;

    const handleConfirmDelete = async () => {
        if (!deleteTarget?.id || !deleteTarget?.type) return;
        try {
            switch (deleteTarget.type) {
                case 'ebooks':
                case 'ebook':
                    await deleteEbook(deleteTarget.id).unwrap();
                    break;
                case 'comics':
                case 'comic':
                    await deleteComic(deleteTarget.id).unwrap();
                    break;
                case 'podcast':
                case 'podcasts':
                    await deletePodcast(deleteTarget.id).unwrap();
                    break;
                case 'series':
                    await deleteSeries(deleteTarget.id).unwrap();
                    break;
                case 'movies':
                case 'movie':
                    await deleteMovie(deleteTarget.id).unwrap();
                    break;
                default:
                    console.warn(`Delete not implemented for type: ${deleteTarget.type}`);
            }
            setIsDeleteModalOpen(false);
            setDeleteTarget({ id: null, type: null });
            await Promise.all([
                refetchPerContent?.(),
                refetchContentDashboard?.(),
            ]);
        } catch (error) {
            console.error('Failed to delete content:', error);
        }
    };

    return (
        <div>
            <HeaderUploadForm title={"Dashboard"} titlePosition="start" />
            <div className="flex flex-col gap-8">
                <div className="grid grid-cols-5 montserratFont gap-4">
                    {contentDashboardData && (
                        <>
                            <div className="bg-gradient-to-b flex items-center flex-col from-[#393939] to-[#222222] p-4 rounded-lg border-[#686868] border">
                                <h2 className="text-[#979797]">
                                    Total Konten
                                </h2>
                                <p className="text-white text-2xl font-semibold">{contentDashboardData?.data?.totalContent || 0}</p>
                            </div>
                            <div className="bg-gradient-to-b flex items-center flex-col from-[#393939] to-[#222222] p-4 rounded-lg border-[#686868] border">
                                <h2 className="text-[#979797]">
                                    Total Tontonan
                                </h2>
                                <p className="text-white text-2xl font-semibold">{contentDashboardData?.data?.totalViews || 0}</p>
                            </div>
                            <div className="bg-gradient-to-b flex items-center flex-col from-[#393939] to-[#222222] p-4 rounded-lg border-[#686868] border">
                                <h2 className="text-[#979797]">
                                    Total Likes
                                </h2>
                                <p className="text-white text-2xl font-semibold">{contentDashboardData?.data?.totalLikes || 0}</p>
                            </div>
                            <div className="bg-gradient-to-b flex items-center flex-col from-[#393939] to-[#222222] p-4 rounded-lg border-[#686868] border">
                                <h2 className="text-[#979797]">
                                    Avg Engagement
                                </h2>
                                <p className="text-white text-2xl font-semibold">{contentDashboardData?.data.avgEngagementScore || 0}</p>
                            </div>
                            <div className="bg-gradient-to-b flex items-center flex-col from-[#393939] to-[#222222] p-4 rounded-lg border-[#686868] border">
                                <h2 className="text-[#979797]">
                                    Growth Rate
                                </h2>
                                <p className="text-2xl font-semibold text-green-500">{contentDashboardData?.data?.growthRate > 0 ? `+${contentDashboardData?.data?.growthRate || 0}%` : `-${contentDashboardData?.data?.growthRate || 0}%`}</p>
                            </div>
                        </>
                    )}
                    {!contentDashboardData && (
                        Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="w-full p-14 rounded-lg" baseColor="#393939" highlightColor="#686868" />
                        ))
                    )}
                </div>
                <h2 className="zeinFont text-2xl font-black text-white">Analitik Konten</h2>
                <div className="flex flex-col">
                    <h3 className="zeinFont text-3xl font-black text-white">Kategori Konten</h3>
                    <p className="text-[#979797] font-medium">Overview konten yang telah Anda upload berdasarkan kategori</p>
                    <div className="grid grid-cols-6 montserratFont gap-4">
                        {tabsData && contentData && tabsData.map((tab) => (
                            <div
                                key={tab.id}
                                onClick={() => {
                                    setIsActive(tab.id);
                                    setDataType(tab.key || 'results');
                                }}
                                className={`self-stretch hover:cursor-pointer py-10 mt-4 rounded-md backdrop-blur-sm bg-gradient-to-b inline-flex flex-col justify-center items-center overflow-hidden ${hoverColorClasses[tab.hoverColor]} ${isActive === tab.id ? colorClasses[tab.color] : ''}`}
                            >
                                <div className="flex flex-col gap-1 text-center text-white montserratFont">
                                    <h3 className="text-xl font-bold leading-6">{tab.title}</h3>
                                    {tab.totalSeries && <p className="text-sm">{tab.totalSeries} Series</p>}
                                    {tab.totalEpisodes && <p className="text-sm">{tab.totalEpisodes} Konten</p>}
                                </div>
                            </div>
                        ))}
                        {!contentData && (
                            Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="w-full p-14 rounded-lg mt-4" baseColor="#393939" highlightColor="#686868" />
                            ))
                        )}
                    </div>
                    <div className="mt-4">
                        {contentData ? <ContentTable data={
                            contentData ? contentData.data?.[dataType]?.map(item => ({
                                title: item.title,
                                posterImageUrl: item.posterImageUrl || item.coverPodcastImage,
                                description: item.description,
                                visibility: 'Publik',
                                restriction: item.ageRestriction,
                                releaseDate: item.createdAt,
                                comments: item.totalComments,
                                likePercentage: (item.totalLikes + item.totalDislikes) > 0 ? Math.round((item.totalLikes / (item.totalLikes + item.totalDislikes)) * 100) : 0,
                                totalLikes: item.totalLikes,
                                action: (
                                    <div className="flex justify-center items-center">
                                        <Dropdown>
                                            <DropdownTrigger>
                                                <Image
                                                    src={iconMore}
                                                    alt="More Icon"
                                                    className="hover:underline rotate-90 hover:cursor-pointer"
                                                />
                                            </DropdownTrigger>
                                            <DropdownMenu
                                                aria-label="Static Actions"
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
                                                <DropdownItem key="edit" className="hover:bg-[#4a4a4a] rounded-sm px-2 flex items-center">
                                                    <Link href={`/${contentTypeSingle[item.contentType || item.type]?.pluralName}/edit/${item._id || item.id}`}>
                                                        <PencilIcon size={16} className="inline-block mr-2" />
                                                        Edit
                                                    </Link>
                                                </DropdownItem>
                                                <DropdownItem key="preview" className="hover:bg-[#4a4a4a] rounded-sm px-2 flex items-center">
                                                    <EyeIcon size={16} className="inline-block mr-2" />
                                                    Preview
                                                </DropdownItem>
                                                <DropdownItem
                                                    key="detail"
                                                    onClick={() => {
                                                        const id = item?._id ?? item?.id ?? null;
                                                        const type = dataType !== 'result' ? dataType : (item?.contentType ?? item?.type ?? null);
                                                        setDetailTarget({ id, type });
                                                        setIsDetailModalOpen(true);
                                                    }}
                                                    className="hover:bg-[#4a4a4a] rounded-sm px-2 flex items-center"
                                                >
                                                    <EyeIcon size={16} className="inline-block mr-2" />
                                                    Detail
                                                </DropdownItem>
                                                <DropdownItem
                                                    key="delete"
                                                    onClick={() => {
                                                        const id = item?._id ?? item?.id ?? null;
                                                        const type = dataType !== 'result' ? dataType : (item?.contentType ?? item?.type ?? null);
                                                        setDeleteTarget({ id, type });
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    className="text-red-500 hover:bg-[#4a4a4a] rounded-sm px-2 flex items-center"
                                                    color="danger"
                                                >
                                                    <TrashIcon size={16} className="inline-block mr-2" />
                                                    Delete
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </div>
                                )
                            })) : [
                                {
                                    title: 'Racun Sangga',
                                    visibility: 'Public',
                                    restriction: 'D21+',
                                    releaseDate: '2023-01-01',
                                    comments: 10,
                                    likePercentage: 80,
                                }
                            ]
                        } /> : <Skeleton className="w-full p-14 rounded-lg mt-4" baseColor="#393939" highlightColor="#686868" />
                        }
                    </div>
                    <FlexModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                    >
                        <div className="flex max-w-lg flex-col gap-8 items-center text-[#F5F5F5] montserratFont">
                            <Image src={DatabaseDelete} alt="Delete Database" className="w-64 h-64 mb-4 mx-auto" />
                            <div className="flex flex-col items-center">
                                <p className="text-2xl font-bold">Hapus Permanen Konten</p>
                                <p className="text-center">Anda Yakin Ingin Menghapus Konten, Konten Yang Sudah Di Hapus Tidak Dapat Di Pulihkan Lagi</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 w-full justify-between">
                                <button onClick={() => setIsDeleteModalOpen(false)} className="flex items-center justify-center p-2 hover:bg-[#156EB7] rounded-lg">
                                    Batal
                                </button>
                                <button onClick={handleConfirmDelete} disabled={isDeletingEbook || isDeletingPodcast || isDeletingSeries || isDeletingComic || isDeletingMovie} className="flex items-center justify-center p-2 bg-[#156EB7] rounded-lg disabled:opacity-60 disabled:cursor-not-allowed">
                                    {isDeletingEbook || isDeletingPodcast || isDeletingSeries || isDeletingComic || isDeletingMovie ? 'Menghapus…' : 'Hapus'}
                                </button>
                            </div>
                        </div>
                    </FlexModal>
                    <FlexModal
                        isOpen={isDetailModalOpen}
                        onClose={() => {
                            setIsDetailModalOpen(false);
                            setDetailTarget({ id: null, type: null });
                        }}
                    >
                        <div className="flex flex-col gap-4 w-full">
                            {isLoadingAnalytics ? (
                                <LoadingOverlay />
                            ) : analyticsData ? (
                                <PreviewContentHeader
                                    posterImageUrl={
                                        analyticsData.contentData?.posterImageUrl ||
                                        analyticsData.contentData?.coverPodcastImage ||
                                        analyticsData.posterImageUrl ||
                                        analyticsData.coverPodcastImage ||
                                        ''
                                    }
                                    title={analyticsData.contentData?.title || analyticsData.title || ''}
                                    description={analyticsData.contentData?.description || analyticsData.description || ''}
                                    author={
                                        analyticsData.contentData?.Creator?.profileName ||
                                        analyticsData.contentData?.creator?.fullname ||
                                        analyticsData.author ||
                                        analyticsData.creator?.fullname ||
                                        ''
                                    }
                                    ageRestriction={analyticsData.contentData?.ageRestriction || analyticsData.ageRestriction || ''}
                                    createdAt={analyticsData.contentData?.createdAt || analyticsData.createdAt || ''}
                                    categories={
                                        analyticsData.contentData?.categories?.tittle ||
                                        analyticsData.categories?.[0]?.tittle ||
                                        analyticsData.category ||
                                        ''
                                    }
                                    totalLikes={analyticsData.totalLikes || 0}
                                    totalDislikes={analyticsData.totalDislikes || 0}
                                    totalSaves={analyticsData.totalSaved || 0}
                                    totalShares={analyticsData.totalShares || 0}
                                    totalRevenue={analyticsData.totalRevenue || 0}
                                    totalUnitsSold={analyticsData.totalUnitsSold || analyticsData.totalPurchaseCount || 0}
                                    totalViews={analyticsData.contentData?.totalViews || analyticsData.totalViews || 0}
                                    totalReports={analyticsData.totalReports || 0}
                                />
                            ) : (
                                <div className="flex justify-center items-center p-8">
                                    <p className="text-white">No analytics data available</p>
                                </div>
                            )}
                        </div>
                    </FlexModal>
                </div>
            </div>
        </div>
    )
}