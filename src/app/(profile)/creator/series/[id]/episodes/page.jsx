"use client";

import React, { useState, useEffect } from "react";
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

// Components
import BackButton from "@/components/BackButton/page";
import FlexModal from "@/components/Modal/FlexModal";
import HeaderUploadForm from "@/components/UploadForm/HeaderUploadForm";

// Assets
import iconMore from "@@/icons/icon_more.svg";
import DatabaseDelete from "@@/AdditionalImages/database-delete.png";

export default function SeriesEpisodesPage() {
  const router = useRouter();
  const params = useParams();
  const seriesId = params?.id;

  console.log("✅ seriesId from useParams:", seriesId);

  const [episodes, setEpisodes] = useState([]);
  const [seriesInfo, setSeriesInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ===============================
  // FETCH EPISODES
  // ===============================
  useEffect(() => {
    if (!seriesId) {
      console.warn("⚠️ seriesId belum tersedia");
      return;
    }

    const fetchEpisodes = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        console.log("🔍 DEBUG - Fetching Episodes");
        console.log("Series ID:", seriesId);

const episodesUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/episode-series/series/${seriesId}?page=${currentPage}&limit=${itemsPerPage}`;

        console.log("Episodes API URL:", episodesUrl);

        const response = await fetch(episodesUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const err = await response.text();
          throw new Error(err);
        }

        const result = await response.json();

        setEpisodes(result.data?.episodes || []);
        setTotalPages(result.data?.pagination?.pageCount || 1);

        // FETCH SERIES INFO
        const seriesRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/series/${seriesId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (seriesRes.ok) {
          const seriesData = await seriesRes.json();
          setSeriesInfo(seriesData.data?.data);
        }
      } catch (error) {
        console.error("❌ Fetch episodes error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEpisodes();
  }, [seriesId, currentPage]);

  // ===============================
  // DELETE EPISODE
  // ===============================
  const handleDeleteEpisode = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");

      const deleteUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/episode-series/${deleteTarget}`;

      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus episode");
      }

      setEpisodes((prev) => prev.filter((ep) => ep.id !== deleteTarget));
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsDeleting(false);
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

  return (
    <main className="relative mx-2 flex flex-col lg:mx-6 min-h-screen">
      <BackButton />

      <div className="mt-4 mb-6">
        <HeaderUploadForm
          title={seriesInfo ? `Episode - ${seriesInfo.title}` : "Episode Series"}
          titlePosition="start"
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
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <Skeleton width={80} height={60} />
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
                  <tr key={episode.id} className="hover:bg-[#2a2a2a]">
                    <td className="px-6 py-4">
                      <div className="relative w-20 h-14 bg-[#393939]">
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
                    <td className="px-6 py-4">{episode.title}</td>
                    <td className="px-6 py-4 text-gray-400">
                      {episode.description || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(episode.releaseDate || episode.createdAt)}
                    </td>
                    <td className="px-6 py-4">{episode.views || 0}</td>
                    <td className="px-6 py-4">
                      {episode.price > 0
                        ? `Rp ${episode.price.toLocaleString("id-ID")}`
                        : "Gratis"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Dropdown>
                        <DropdownTrigger>
                          <button>
                            <Image src={iconMore} alt="more" width={20} />
                          </button>
                        </DropdownTrigger>
                        <DropdownMenu>
                          <DropdownItem
                            onClick={() =>
                              router.push(`/series/watch/${episode.id}`)
                            }
                          >
                            <EyeIcon size={16} /> Preview
                          </DropdownItem>
                          <DropdownItem
                            onClick={() =>
                              router.push(
                                `/creator/series/episodes/edit/${episode.id}`
                              )
                            }
                          >
                            <PencilIcon size={16} /> Edit
                          </DropdownItem>
                          <DropdownItem
                            className="text-red-500"
                            onClick={() => {
                              setDeleteTarget(episode.id);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <TrashIcon size={16} /> Hapus
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

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showIcons
          />
        </div>
      )}

      {/* DELETE MODAL */}
      <FlexModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="text-center text-white">
          <Image src={DatabaseDelete} alt="delete" className="mx-auto w-48" />
          <p className="mt-4 font-bold text-xl">Hapus Episode?</p>
          <div className="mt-6 flex gap-4 justify-center">
            <button onClick={() => setIsDeleteModalOpen(false)}>Batal</button>
            <button
              onClick={handleDeleteEpisode}
              disabled={isDeleting}
              className="bg-red-600 px-4 py-2 rounded"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </div>
      </FlexModal>
    </main>
  );
}
