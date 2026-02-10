"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

/* Third-Party */
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/* API Hooks */
import {
    useGetEpisodePodcastByIdQuery,
    useUpdateEpisodePodcastMutation,
} from "@/hooks/api/episodePodcastSliceAPI";

/* Constants & Components */
import { priceOption } from "@/lib/constants/priceOptions";
import InputText from "@/components/UploadForm/InputText";
import InputTextArea from "@/components/UploadForm/InputTextArea";
import InputImageBanner from "@/components/UploadForm/InputImageBanner";
import PriceSelector from "@/components/UploadForm/PriceSelector";
import ButtonSubmit from "@/components/UploadForm/ButtonSubmit";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import HeaderUploadForm from "@/components/UploadForm/HeaderUploadForm";
import FlexModal from "@/components/Modal/FlexModal";
import RichTextEditor from "@/components/RichTextEditor/page";

/* Assets */
import IconsGalery from "@@/icons/logo-upload-banner.svg";
import IconsButtonSubmit from "@@/IconsButton/buttonSubmit.svg";

/* ================= SCHEMA ================= */
const editPodcastEpisodeSchema = z.object({
    title: z.string().min(1, "Judul wajib diisi"),
    description: z.string().min(1, "Deskripsi wajib diisi"),
    price: z.string(),
    notedPodcast: z.string().optional(),
    coverPodcastEpisodeURL: z.any().optional(),
    podcastFileURL: z.any().optional(),
});

export default function EditPodcastEpisodePage() {
    const router = useRouter();
    const params = useParams();

    const episodeId = params?.episodeId;
    const podcastId = params?.id;

    const thumbnailInputRef = useRef(null);

    /** 🔒 GUARD SUBMIT */
    const allowSubmitRef = useRef(false);

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    /* ===== FETCH ===== */
    const { data: episodeData, isLoading } =
        useGetEpisodePodcastByIdQuery(episodeId, {
            skip: !episodeId,
        });

    const episode =
        episodeData?.data?.data ??
        episodeData?.data ??
        episodeData ??
        null;

    /* ===== MUTATION ===== */
    const [updateEpisode, { isLoading: isUpdating, error }] =
        useUpdateEpisodePodcastMutation();

    /* ===== FORM ===== */
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(editPodcastEpisodeSchema),
        mode: "onChange",
        defaultValues: {
            title: "",
            description: "",
            price: "0",
            notedPodcast: "",
            coverPodcastEpisodeURL: [],
            podcastFileURL: [],
        },
    });

    /* ===== RESET FROM API ===== */
    useEffect(() => {
        if (!episode) return;

        reset({
            title: episode.title || "",
            description: episode.description || "",
            price: String(episode.price || "0"),
            notedPodcast: episode.notedPodcast || "",
            coverPodcastEpisodeURL: episode.coverPodcastEpisodeURL
                ? [episode.coverPodcastEpisodeURL]
                : [],
            podcastFileURL: [],
        });
    }, [episode, reset]);

    /* ===== SUBMIT ===== */
    const onSubmit = async (data) => {
        /** ⛔ BLOCK kalau bukan klik tombol Update */
        if (!allowSubmitRef.current) return;

        allowSubmitRef.current = false;

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("price", String(data.price || "0"));

        if (data.notedPodcast) {
            formData.append("notedPodcast", data.notedPodcast);
        }

        if (data.coverPodcastEpisodeURL?.[0] instanceof File) {
            formData.append(
                "coverPodcastEpisodeURL",
                data.coverPodcastEpisodeURL[0]
            );
        }

        if (data.podcastFileURL?.[0] instanceof File) {
            formData.append(
                "podcastFileURL",
                data.podcastFileURL[0]
            );
        }

        try {
            await updateEpisode({
                id: episodeId,
                formData,
            }).unwrap();

            setIsSuccessModalOpen(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleBackClick = () => {
        router.replace(`/creator/podcast/${podcastId}/episodes`);
    };

    /** ✅ FIX: Gunakan replace agar tidak menambah history */
    const handleSuccessClose = () => {
        setIsSuccessModalOpen(false);
        router.replace(`/creator/podcast/${podcastId}/episodes`);
    };

    if (isLoading) {
        return <LoadingOverlay message="Loading episode data..." />;
    }

    return (
        <main className="relative mx-2 flex flex-col lg:mx-6 min-h-screen">
            <div className="mt-4 mb-6">
                <HeaderUploadForm
                    title="Edit Episode Podcast"
                    titlePosition="start"
                    onBackClick={handleBackClick}
                />
            </div>

            <form
                className="flex flex-col gap-2"
                onSubmit={handleSubmit(onSubmit)}
                onSubmitCapture={(e) => {
                    if (!allowSubmitRef.current) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }}
            >
                <InputText
                    label="Judul Episode"
                    name="title"
                    placeholder="Tulis judul episode yang menarik"
                    {...register("title")}
                    error={errors.title?.message}
                />

                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <RichTextEditor
                            label="Deskripsi Episode"
                            value={field.value || ""}
                            onChange={field.onChange}
                            error={errors.description?.message}
                        />
                    )}
                />

                <Controller
                    name="notedPodcast"
                    control={control}
                    render={({ field }) => (
                        <InputTextArea
                            label="Catatan Episode (Opsional)"
                            value={field.value || ""}
                            onChange={field.onChange}
                            error={errors.notedPodcast?.message}
                        />
                    )}
                />

                <Controller
                    name="coverPodcastEpisodeURL"
                    control={control}
                    render={({ field }) => (
                        <InputImageBanner
                            type="thumbnail"
                            label="Cover Episode"
                            description="Rasio 1:1 (JPG/PNG)"
                            icon={IconsGalery}
                            inputRef={thumbnailInputRef}
                            files={field.value || []}
                            onUpload={(e) =>
                                field.onChange(
                                    Array.from(e.target.files || [])
                                )
                            }
                            onRemove={() => field.onChange([])}
                        />
                    )}
                />

                <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                        <PriceSelector
                            label="Harga Akses Episode"
                            options={priceOption}
                            selected={field.value}
                            onSelect={field.onChange}
                        />
                    )}
                />

                <div
                    onClick={() => {
                        allowSubmitRef.current = true;
                    }}
                >
                    <ButtonSubmit
                        type="submit"
                        icon={IconsButtonSubmit}
                        label="Update Episode"
                        isLoading={isUpdating}
                    />
                </div>

                {error && (
                    <p className="text-red-500 mt-2 text-sm">
                        {error?.data?.message || "Gagal update"}
                    </p>
                )}
            </form>

            {isUpdating && (
                <LoadingOverlay message="Updating episode..." />
            )}

            {/* ===== SUCCESS MODAL ===== */}
            <FlexModal
                isOpen={isSuccessModalOpen}
                onClose={handleSuccessClose}
            >
                <div className="w-full max-w-[420px] px-8 py-10 flex flex-col items-center text-center text-white montserratFont">
                    <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-green-500/15">
                        <svg
                            className="w-8 h-8 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>

                    <h2 className="text-xl font-semibold mb-2">
                        Update Berhasil
                    </h2>
                    <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                        Perubahan pada episode telah berhasil disimpan dan
                        diperbarui ke dalam sistem.
                    </p>

                    <button
                        onClick={handleSuccessClose}
                        className="w-full h-11 rounded-lg bg-[#156EB7] hover:bg-[#0d5a94] transition font-semibold"
                    >
                        Kembali ke Daftar Episode
                    </button>
                </div>
            </FlexModal>
        </main>
    );
}