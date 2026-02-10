"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Pagination } from "flowbite-react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DOMPurify from "dompurify";


// Components
import FlexModal from "@/components/Modal/FlexModal";
import HeaderUploadForm from "@/components/UploadForm/HeaderUploadForm";

// API Hooks
import {
  useGetEpisodesBySeriesIdQuery,
  useDeleteEpisodeSeriesMutation
} from "@/hooks/api/episodeSeriesSliceAPI";
import { useGetSeriesByIdQuery } from "@/hooks/api/seriesSliceAPI";

// Assets
import iconMore from "@@/icons/icon_more.svg";
import DatabaseDelete from "@@/AdditionalImages/database-delete.png";

export default function SeriesEpisodesPage() {
  const router = useRouter();
  const params = useParams();
  const seriesId = params?.id;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch data using RTK Query
  const { data: episodesData, isLoading: isLoadingEpisodes, refetch } = useGetEpisodesBySeriesIdQuery(
    { seriesId, page: currentPage, limit: itemsPerPage, paginate: true },
    { skip: !seriesId }
  );

  const { data: seriesData } = useGetSeriesByIdQuery(
    { id: seriesId, withEpisodes: false },
    { skip: !seriesId }
  );

  const [deleteEpisode, { isLoading: isDeleting }] = useDeleteEpisodeSeriesMutation();

  const episodes = episodesData?.data?.episodes || [];
  const totalPages = episodesData?.data?.pagination?.pageCount || 1;
  const seriesInfo = seriesData?.data?.data;

  // Delete Episode Handler
  const handleDeleteEpisode = async () => {
    if (!deleteTarget) return;

    try {
      await deleteEpisode(deleteTarget).unwrap();
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
      // Refresh the current page data
      await refetch();
    } catch (error) {
      console.error("Failed to delete episode:", error);
      alert(error?.data?.message || "Gagal menghapus episode");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleBackClick = () => {
    router.replace(`/creator/series/${seriesId}/episodes`);
  };

  return (
    <main className="relative mx-2 flex flex-col lg:mx-6 min-h-screen">
      <div className="mt-4 mb-6">
        <HeaderUploadForm
          title={seriesInfo ? `Episode - ${seriesInfo.title}` : "Episode Series"}
          titlePosition="start"
          onBackClick={handleBackClick}
        />
      </div>

      {/* TABLE */}
      <div className="bg-[#222222] rounded-lg border border-[#686868] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead className="bg-[#393939]">
              <tr>
                <th className="px-6 py-4 text-left">Thumbnail</th>
                <th className="px-6 py-4 text-left">Judul</th>
                <th className="px-6 py-4 text-left">Deskripsi</th>
                <th className="px-6 py-4 text-left">Tanggal</th>
                <th className="px-6 py-4 text-left">Views</th>
                <th className="px-6 py-4 text-left">Harga</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {isLoadingEpisodes ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <Skeleton width={80} height={60} baseColor="#393939" highlightColor="#686868" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton width={150} baseColor="#393939" highlightColor="#686868" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton width={200} baseColor="#393939" highlightColor="#686868" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton width={100} baseColor="#393939" highlightColor="#686868" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton width={50} baseColor="#393939" highlightColor="#686868" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton width={80} baseColor="#393939" highlightColor="#686868" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton width={30} baseColor="#393939" highlightColor="#686868" />
                    </td>
                  </tr>
                ))
              ) : episodes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    Belum ada episode untuk series ini
                  </td>
                </tr>
              ) : (
                episodes.map((episode) => (
                  <tr key={episode.id} className="hover:bg-[#2a2a2a] border-b border-[#393939]">
                    <td className="px-6 py-4">
                      <div className="relative w-20 h-14 bg-[#393939] rounded overflow-hidden">
                        {episode.thumbnailUrl && (
                          <Image
                            src={episode.thumbnailUrl}
                            alt={episode.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate">{episode.title}</td>
                    <td className="px-6 py-4 text-gray-400 max-w-md">
                      <div
                        className="line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(episode.description || "-"),
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {formatDate(episode.releaseDate || episode.createdAt)}
                    </td>
                    <td className="px-6 py-4">{episode.views || 0}</td>
                    <td className="px-6 py-4">
                      {episode.price > 0
                        ? `Rp ${Number(episode.price).toLocaleString("id-ID")}`
                        : "Gratis"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Dropdown>
                        <DropdownTrigger>
                          <button className="hover:bg-[#4a4a4a] p-2 rounded transition-colors">
                            <Image src={iconMore} alt="more" width={20} className="rotate-90" />
                          </button>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Episode Actions"
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
                            min-w-[140px]
                            font-semibold
                            text-sm
                          "
                        >
                          <DropdownItem
                            key="preview"
                            onClick={() => router.push(`/series/watch/${episode.id}`)}
                            className="hover:bg-[#4a4a4a] rounded-sm px-2 flex items-center w-full"
                          >
                            <EyeIcon size={16} className="inline-block mr-2" />
                            Preview
                          </DropdownItem>
                          <DropdownItem
                            key="edit"
                            onClick={() => router.push(`/creator/series/${seriesId}/episodes/edit/${episode.id}`)}
                            className="hover:bg-[#4a4a4a] rounded-sm px-2 flex items-center w-full"
                          >
                            <PencilIcon size={16} className="inline-block mr-2" />
                            Edit
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            className="text-red-500 hover:bg-[#4a4a4a] rounded-sm px-2 flex items-center w-full"
                            onClick={() => {
                              setDeleteTarget(episode.id);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <TrashIcon size={16} className="inline-block mr-2" />
                            Hapus
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showIcons
            theme={{
              pages: {
                base: "inline-flex items-center -space-x-px",
                showIcon: "inline-flex",
                previous: {
                  base: "ml-0 rounded-l-lg border border-gray-700 bg-[#393939] px-3 py-2 leading-tight text-gray-400 hover:bg-[#4a4a4a] hover:text-white",
                  icon: "h-5 w-5"
                },
                next: {
                  base: "rounded-r-lg border border-gray-700 bg-[#393939] px-3 py-2 leading-tight text-gray-400 hover:bg-[#4a4a4a] hover:text-white",
                  icon: "h-5 w-5"
                },
                selector: {
                  base: "w-12 border border-gray-700 bg-[#393939] py-2 leading-tight text-gray-400 hover:bg-[#4a4a4a] hover:text-white",
                  active: "bg-[#156EB7] text-white hover:bg-[#0d5a94]"
                }
              }
            }}
          />
        </div>
      )}

      {/* DELETE MODAL */}
      <FlexModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
      >
        <div className="flex flex-col gap-6 items-center text-white montserratFont max-w-md">
          <Image src={DatabaseDelete} alt="delete" className="w-48 h-auto" />
          <div className="flex flex-col gap-2 text-center">
            <p className="text-2xl font-bold">Hapus Episode?</p>
            <p className="text-sm text-gray-400">
              Episode yang sudah dihapus tidak dapat dipulihkan kembali
            </p>
          </div>
          <div className="flex gap-4 w-full">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeleteTarget(null);
              }}
              className="flex-1 p-2 border border-[#686868] rounded-lg hover:bg-[#4a4a4a] transition-all"
            >
              Batal
            </button>
            <button
              onClick={handleDeleteEpisode}
              disabled={isDeleting}
              className="flex-1 p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </div>
      </FlexModal>
    </main>
  );
}