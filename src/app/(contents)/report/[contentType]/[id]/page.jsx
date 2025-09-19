"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import InputReportEvidence from "@/components/Form/UploadReport/UploadEvidence";
import InputSelect from "@/components/UploadForm/InputSelect";
import InputTextArea from "@/components/UploadForm/InputTextArea";
import { useCreateReportContentMutation } from "@/hooks/api/reportContentAPI";
import { createReportContentSchema } from "@/lib/schemas/createReportContentSchema";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import { useGetMovieByIdQuery } from "@/hooks/api/movieSliceAPI";
import { useGetEpisodeComicsByIdQuery, useGetEpisodeSeriesByIdQuery, useGetEpisodeEbookByIdQuery  } from "@/hooks/api/contentSliceAPI";
import PropTypes from "prop-types";

export default function ReportPage({ params }) {
    const { contentType, id } = params;
    const router = useRouter();

    // 1. Panggil semua hooks di top-level dengan opsi `skip`
    // Ini mematuhi Aturan Hooks, request hanya akan dijalankan jika `skip` bernilai false.
    const { data: movieData, isLoading: isMovieLoading, isError: isMovieError } = useGetMovieByIdQuery(id, {
        skip: contentType !== 'movie',
    });
    const { data: episodeComicData, isLoading: isComicLoading, isError: isComicError } = useGetEpisodeComicsByIdQuery(id, {
        skip: contentType !== 'episode_comic',
    });
    const { data: episodeEbookData, isLoading: isEbookLoading, isError: isEbookError } = useGetEpisodeEbookByIdQuery(id, {
        skip: contentType !== 'episode_ebook',
    });
    const { data: episodeSeriesData, isLoading: isSeriesLoading, isError: isSeriesError } = useGetEpisodeSeriesByIdQuery(id, {
        skip: contentType !== 'episode_series',
    });

    // 2. Gabungkan data dari hook yang aktif menjadi satu objek `content` yang konsisten
    const content = useMemo(() => {
        let sourceData;
        if (contentType === 'movie' && movieData) {
            sourceData = movieData.data.data;
            return {
                title: sourceData.title,
                description: sourceData.description,
                poster: sourceData.posterImageUrl,
                author: sourceData.writer, // Asumsi nama kreator ada di sini
                genres: [sourceData.categories?.tittle].filter(Boolean), // Ambil dari relasi kategori
                publicationDate: new Date(sourceData.createdAt).toLocaleDateString(),
                creatorName: sourceData.creator?.profileName, // Gunakan productionHouse jika ada
                creatorUsername: sourceData.creator?.username,
                creatorProfilePicture: sourceData.creator?.imageUrl,
            };
        } else if (contentType === 'episode_comic' && episodeComicData) {
            sourceData = episodeComicData.data.data;
            return {
                title: sourceData.comics.title,
                description: sourceData.comics.description,
                poster: sourceData.comics.posterImageUrl,
                author: sourceData.creators?.profileName,
                genres: [sourceData.comics?.categories?.tittle].filter(Boolean),
                publicationDate: new Date(sourceData.createdAt).toLocaleDateString(),
                creatorName: sourceData.creators?.profileName,
                creatorUsername: sourceData.creators?.username,
                creatorProfilePicture: sourceData.creators?.imageUrl,
            };
        } else if (contentType === 'episode_ebook' && episodeEbookData) {
            sourceData = episodeEbookData.data.data;
            return {
                title: sourceData.ebooks.title,
                description: sourceData.ebooks.description,
                poster: sourceData.ebooks.coverImageUrl,
                author: sourceData.creators?.profileName,
                genres: [sourceData.ebooks.categories.tittle].filter(Boolean),
                publicationDate: new Date(sourceData.ebooks.createdAt).toLocaleDateString(),
                creatorName: sourceData.ebooks?.creator?.profileName,
                creatorUsername: sourceData.ebooks?.creator?.username,
                creatorProfilePicture: sourceData.ebooks?.creator?.imageUrl,
            };
        } else if (contentType === 'episode_series' && episodeSeriesData) {
            sourceData = episodeSeriesData.data.data;
            return {
                title: sourceData.series.title,
                description: sourceData.series.description,
                poster: sourceData.series?.posterImageUrl,
                author: sourceData.series?.writer,
                genres: [sourceData.series?.categories?.tittle].filter(Boolean),
                publicationDate: new Date(sourceData.releaseDate).toLocaleDateString(),
                creatorName: sourceData.creator?.profileName,
                creatorUsername: sourceData.creator?.username,
                creatorProfilePicture: sourceData.creator?.imageUrl,
            };
        }

        // Default values jika data belum ada atau tipe konten tidak valid
        return {
            title: "Memuat Judul...",
            description: "Memuat Deskripsi...",
            poster: "/images/default-poster.png",
            author: "Memuat...",
            genres: [],
            publicationDate: "Memuat...",
            creatorName: "Memuat...",
        };
    }, [contentType, movieData, episodeComicData, episodeEbookData, episodeSeriesData]);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createReportContentSchema),
        mode: "onChange",
        defaultValues: {
            category: "",
            isAnonymous: true,
            reportDetail: "",
            evidence: null,
            evidenceDetail: "",
        },
    });

    const [createReport, { isLoading: isSubmitting }] = useCreateReportContentMutation();

    const onSubmit = async (data) => {
        const formData = new FormData();

        // Map contentType dari URL ke enum yang ada di database
        const reportContentTypeMapping = {
            'movie': 'MOVIE',
            'episode_series': 'EPISODE_SERIES',
            'episode_comic': 'EPISODE_COMIC',
            'episode_ebook': 'EPISODE_EBOOK',
        };

        formData.append("isAnonymous", String(data.isAnonymous)); // Kirim sebagai string
        formData.append("category", data.category);
        formData.append("reportDetail", data.reportDetail);
        formData.append("evidenceDetail", data.evidenceDetail);
        formData.append("contentId", id);
        formData.append("contentType", reportContentTypeMapping[contentType]); // Gunakan nilai yang sudah di-map

        if (data.evidence && data.evidence.length > 0) {
            Array.from(data.evidence).forEach((file) => {
                formData.append("evidence", file);
            });
        }

        try {
            await createReport(formData).unwrap();
            router.push("/");
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const isContentLoading = isMovieLoading || isComicLoading || isEbookLoading || isSeriesLoading;
    const isError = isMovieError || isComicError || isEbookError || isSeriesError;

    if (isContentLoading) {
        return <div className="text-white text-center">Loading content details...</div>;
    }

    if (isError) {
        return <div className="text-white text-center text-red-500">Failed to load content details. Please try again later.</div>;
    }

    return (
        <>
            <div className="flex flex-col gap-6 text-white">
                {/* Bagian Detail Konten */}
                <div className="flex flex-col items-center md:flex-row md:justify-between gap-6">
                    <div className="relative aspect-[2/3] w-64 md:h-full rounded-md overflow-hidden">
                        <Image
                            src={content.poster}
                            alt={content.title}
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                    {/* 3. Gunakan data dari objek `content` yang sudah terstruktur */}
                    <div className="flex flex-col flex-1 px-4 gap-6">
                        <div>
                            <div className="text-4xl font-black flex flex-col zeinFont">
                                <h1>{content.title}</h1>
                            </div>
                            <div className="flex flex-row gap-2 font-normal mt-2">
                                {content.genres.map((genre, index) => (
                                    <div key={index} className="rounded-full bg-[#1FC16B] px-4 py-1 font-bold">
                                        {genre}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 font-normal">
                            <p>{content.description}</p>
                            <div className="flex flex-col gap-0">
                                <p>Judul: {content.title}</p>
                                <p>Penulis Cerita: {content.author}</p>
                                <p>Genre: {content.genres.join(', ')}</p>
                                <p>Dipublikasi: {content.publicationDate}</p>
                            </div>
                        </div>

                        <div className="flex flex-row gap-2.5 items-center">
                            <div className="relative h-16 w-16 rounded-full overflow-hidden">
                                <Image
                                    src={content.creatorProfilePicture ?? '/images/ProfileIcon/alien-gurl.svg'} // Ganti dengan gambar profil creatorName/kreator jika ada
                                    alt="Avatar 1"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col justify-center gap-1">
                                <h2 className="zeinFont text-3xl font-black">{content.creatorName}</h2>
                                <p className="text-[#515151] text-sm">@{content.creatorUsername?.replace(" ", "").toLowerCase()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Report */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 text-white">
                    {/* ... sisa form tidak berubah ... */}
                    <div className="md:grid md:grid-cols-2 gap-8">
                        {/* Kolom Kiri */}
                        <div className="flex flex-col gap-4">
                            <Controller
                                name="isAnonymous"
                                control={control}
                                defaultValue={true}
                                render={({ field }) => (
                                    <div className="flex flex-col gap-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="true"
                                                checked={field.value === true}
                                                onChange={() => field.onChange(true)}
                                                className="w-5 h-5 accent-blue-500"
                                            />
                                            Anonymous
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="false"
                                                checked={field.value === false}
                                                onChange={() => field.onChange(false)}
                                                className="w-5 h-5 accent-blue-500"
                                            />
                                            Use Email (to receive updates)
                                        </label>
                                    </div>
                                )}
                            />
                            <div className="flex flex-col gap-2">
                                <label className="ml-2 font-semibold text-md">Kategori Laporan</label>
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <InputSelect
                                            options={[
                                                { id: "PLAGIARISM", title: "Plagiarisme" },
                                                { id: "HATE_SPEECH", title: "Ujaran Kebencian" },
                                                { id: "SPAM", title: "Spam" },
                                                { id: "INAPPROPRIATE_CONTENT", title: "Konten Tidak Pantas" },
                                                { id: "COPYRIGHT_INFRINGEMENT", title: "Pelanggaran Hak Cipta" },
                                                { id: "OTHER", title: "Lainnya" },
                                            ]}
                                            placeholder="Pilih Kategori Laporan"
                                            value={field.value}
                                            onChange={field.onChange}
                                            error={fieldState.error?.message}
                                        />
                                    )}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="ml-2 font-semibold text-md">Deskripsi Masalah/Saran</label>
                                <InputTextArea
                                    placeholder="Jelaskan secara detail masalah atau masukan Anda"
                                    {...register("reportDetail")}
                                    error={errors.reportDetail?.message}
                                />
                            </div>
                        </div>
                        {/* Kolom Kanan */}
                        <div className="flex flex-col gap-4">
                            <Controller
                                name="evidence"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <InputReportEvidence
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={fieldState.error?.message}
                                    />
                                )}
                            />
                            <div className="flex flex-col gap-2">
                                <label className="ml-2 font-semibold text-md">Deskripsi Bukti (Opsional)</label>
                                <InputTextArea
                                    placeholder="Jelaskan bukti yang Anda lampirkan"
                                    {...register("evidenceDetail")}
                                    error={errors.evidenceDetail?.message}
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#156EB7] w-max flex self-center px-16 py-2 rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
                    </button>
                </form>
                {isSubmitting && <LoadingOverlay />}
            </div>
        </>
    );
}

ReportPage.propTypes = {
  params: PropTypes.shape({
    contentType: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};