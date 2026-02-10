"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

/* Third-Party */
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/* API Hooks */
import {
    useGetEpisodeEbookByIdQuery,
    useUpdateEpisodeEbookMutation
} from "@/hooks/api/episodeEbookSliceAPI";

/* Constants & Components */
import { priceOption } from "@/lib/constants/priceOptions";
import InputText from "@/components/UploadForm/InputText";
import RichTextEditor from '@/components/RichTextEditor/page';
import InputImageBanner from "@/components/UploadForm/InputImageBanner";
import InputFileDoc from "@/components/UploadForm/InputFileDoc";
import PriceSelector from "@/components/UploadForm/PriceSelector";
import ButtonSubmit from '@/components/UploadForm/ButtonSubmit';
import LoadingOverlay from "@/components/LoadingOverlay/page";
import HeaderUploadForm from "@/components/UploadForm/HeaderUploadForm";
import FlexModal from "@/components/Modal/FlexModal";

/* Assets */
import IconsGalery from "@@/icons/logo-upload-banner.svg";
import IconsButtonSubmit from "@@/IconsButton/buttonSubmit.svg";

// Schema untuk edit (fields opsional)
const editEbookEpisodeSchema = z.object({
    title: z.string().min(1, "Judul wajib diisi"),
    description: z.string().min(1, "Deskripsi wajib diisi"),
    price: z.string(),
    notedEpisode: z.string().optional(),
    episodeCover: z.any().optional(),
    bannerStart: z.any().optional(),
    bannerEnd: z.any().optional(),
    inputFile: z.any().optional(),
    audioUrl: z.any().optional(),
});

export default function EditEbookEpisodePage() {
    const router = useRouter();
    const params = useParams();
    const episodeId = params?.episodeId;
    const ebookId = params?.id;

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);
    const formRef = useRef(null);

    const { data: episodeData, isLoading: isLoadingEpisode } = useGetEpisodeEbookByIdQuery(episodeId, {
        skip: !episodeId,
    });

    const [updateEpisode, { isLoading: isUpdating, error }] = useUpdateEpisodeEbookMutation();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(editEbookEpisodeSchema),
        mode: "onChange",
        defaultValues: {
            title: "",
            description: "",
            price: "",
            notedEpisode: "",
            episodeCover: [],
            bannerStart: [],
            bannerEnd: [],
            inputFile: [],
            audioUrl: [],
        },
    });

    // Set default values when data loaded
    useEffect(() => {
        const episode = episodeData?.data?.data || episodeData?.data || episodeData;

        if (episode?.title) {
            console.log("📦 Episode Data:", episode);
            
            reset({
                title: episode.title || "",
                description: episode.description || "",
                price: String(episode.price) || "0",
                notedEpisode: episode.notedEpisode || "",
                episodeCover: episode.coverEpisodeUrl ? [episode.coverEpisodeUrl] : [],
                bannerStart: episode.bannerStartEpisodeUrl ? [episode.bannerStartEpisodeUrl] : [],
                bannerEnd: episode.bannerEndEpisodeUrl ? [episode.bannerEndEpisodeUrl] : [],
                inputFile: [],
                audioUrl: [],
            });
        }
    }, [episodeData, reset]);

    const onSubmit = async (data) => {
        if (!canSubmit) {
            console.log("🚫 Submit blocked - not from Update Episode button");
            return;
        }

        console.log("📤 FORM SUBMITTED - Button clicked");
        
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("price", String(data.price || "0"));
        formData.append("explicitUpdate", "true");
        
        if (data.notedEpisode) {
            formData.append("notedEpisode", data.notedEpisode);
        }

        // Only append files if new files selected
        if (data.episodeCover && data.episodeCover[0] instanceof File) {
            formData.append("coverEpisodeUrl", data.episodeCover[0]);
            console.log("📎 Cover baru akan diupload:", data.episodeCover[0].name);
        } else {
            console.log("ℹ️ Tidak ada cover baru, menggunakan cover lama");
        }

        if (data.bannerStart && data.bannerStart[0] instanceof File) {
            formData.append("bannerStartEpisodeUrl", data.bannerStart[0]);
            console.log("📎 Banner Start baru akan diupload:", data.bannerStart[0].name);
        } else {
            console.log("ℹ️ Tidak ada banner start baru");
        }

        if (data.bannerEnd && data.bannerEnd[0] instanceof File) {
            formData.append("bannerEndEpisodeUrl", data.bannerEnd[0]);
            console.log("📎 Banner End baru akan diupload:", data.bannerEnd[0].name);
        } else {
            console.log("ℹ️ Tidak ada banner end baru");
        }

        if (data.inputFile && data.inputFile[0] instanceof File) {
            formData.append("ebookUrl", data.inputFile[0]);
            console.log("📎 File Ebook baru akan diupload:", data.inputFile[0].name);
        } else {
            console.log("ℹ️ Tidak ada file ebook baru");
        }

        if (data.audioUrl && data.audioUrl[0] instanceof File) {
            formData.append("audioUrl", data.audioUrl[0]);
            console.log("📎 File Audio baru akan diupload:", data.audioUrl[0].name);
        } else {
            console.log("ℹ️ Tidak ada file audio baru");
        }

        try {
            await updateEpisode({ id: episodeId, formData }).unwrap();
            setIsSuccessModalOpen(true);
        } catch (err) {
            console.error("Error updating episode:", err);
        } finally {
            setCanSubmit(false);
        }
    };

    const handleSuccessClose = () => {
        setIsSuccessModalOpen(false);
        router.replace(`/creator/ebooks/${ebookId}/episodes`);
    };

    const handleBackClick = () => {
        router.push(`/creator/ebooks/${ebookId}/episodes`);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        if (canSubmit) {
            handleSubmit(onSubmit)(e);
        } else {
            console.log("🚫 Form submit prevented - canSubmit is false");
        }
    };

    const handleUpdateClick = () => {
        setCanSubmit(true);
        if (formRef.current) {
            formRef.current.dispatchEvent(
                new Event('submit', { cancelable: true, bubbles: true })
            );
        }
    };

    if (isLoadingEpisode) {
        return <LoadingOverlay message="Loading episode data..." />;
    }

    const episode = episodeData?.data?.data || episodeData?.data || episodeData;

    return (
        <main className="relative mx-2 flex flex-col lg:mx-6 min-h-screen">
            <div className="mt-4 mb-6">
                <HeaderUploadForm 
                    title="Edit Episode Ebook" 
                    titlePosition="start"
                    onBackClick={handleBackClick}
                />
            </div>

            <form 
                ref={formRef}
                className="flex flex-col gap-2" 
                onSubmit={handleFormSubmit}
            >
                {/* Judul Episode */}
                <InputText
                    label="Judul Bab/Episode"
                    name="title"
                    placeholder="Contoh: Bab 1: Perjumpaan di Kota Tua"
                    {...register("title")}
                    error={errors.title?.message}
                />

                {/* Deskripsi */}
                <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState }) => (
                        <RichTextEditor
                            label="Deskripsi"
                            name="description"
                            placeholder="Deskripsi episode"
                            value={field.value}
                            onChange={field.onChange}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                {/* Cover Episode */}
                <Controller
                    name="episodeCover"
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputImageBanner
                            type="thumbnail"
                            label="Cover Episode"
                            description="Rasio: 1:1, Format: JPG/PNG, Ukuran Maksimal: 500 KB. Unggah sampul khusus untuk bab ini."
                            name="episodeCover"
                            icon={IconsGalery}
                            files={field.value}
                            onUpload={(e) => {
                                const files = e.target?.files || e;
                                field.onChange([...files]);
                            }}
                            onRemove={() => field.onChange([])}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                {/* Banner Start */}
                <Controller
                    name="bannerStart"
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputImageBanner
                            type="banner"
                            label="Banner Cover Episode Start"
                            description="maks upload per content 5mb, please make part while uploading and naming ascending number"
                            name="bannerStart"
                            icon={IconsGalery}
                            files={field.value}
                            onUpload={(e) => {
                                const files = e.target?.files || e;
                                field.onChange([...files]);
                            }}
                            onRemove={() => field.onChange([])}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                {/* Input File */}
                <Controller
                    name="inputFile"
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputFileDoc
                            name="inputFile"
                            label="Unggah File Naskah (.docx)"
                            description="Pastikan file Anda berformat Microsoft Word (.docx). Klik untuk unggah."
                            accept=".doc,.docx"
                            files={field.value}
                            onUpload={(e) => {
                                const files = e.target?.files || e;
                                field.onChange([...files]);
                            }}
                            onRemove={() => field.onChange([])}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                {/* Input audio opsional */}
                <Controller
                    name="audioUrl"
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputFileDoc
                            name="audioUrl"
                            label="File Audio (Opsional)"
                            description="Pilih file audio (MP3/WAV, maks. 3MB) untuk backsound atau audio Transkrip episode ini."
                            accept=".mp3,.wav"
                            files={field.value}
                            onUpload={(e) => {
                                const files = e.target?.files || e;
                                field.onChange([...files]);
                            }}
                            onRemove={() => field.onChange([])}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                {/* Banner End */}
                <Controller
                    name="bannerEnd"
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputImageBanner
                            type="banner"
                            label="Banner Cover Episode End"
                            description="maks upload per content 5gb, please make part while uploading and naming ascending number"
                            name="bannerEnd"
                            icon={IconsGalery}
                            files={field.value}
                            onUpload={(e) => {
                                const files = e.target?.files || e;
                                field.onChange([...files]);
                            }}
                            onRemove={() => field.onChange([])}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                {/* Catatan Episode */}
                <Controller
                    name="notedEpisode"
                    control={control}
                    render={({ field, fieldState }) => (
                        <RichTextEditor
                            label="Catatan Kreator"
                            name="notedEpisode"
                            placeholder="Tulis catatan kreator"
                            value={field.value}
                            onChange={field.onChange}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                {/* Harga */}
                <Controller
                    name="price"
                    control={control}
                    render={({ field, fieldState }) => (
                        <PriceSelector
                            label="Harga Jual"
                            options={priceOption}
                            selected={field.value}
                            onSelect={(val) => {
                                field.onChange(val);
                                field.onBlur();
                            }}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                {/* Submit Button */}
                <div onClick={handleUpdateClick}>
                    <ButtonSubmit
                        type="button"
                        icon={IconsButtonSubmit}
                        label="Update Episode"
                        isLoading={isUpdating}
                    />
                </div>
                
                {error && (
                    <p className="text-red-500 mt-2 text-sm">
                        Gagal update: {error.data?.message || "Terjadi kesalahan"}
                    </p>
                )}
            </form>

            {isUpdating && <LoadingOverlay message="Updating episode..." />}

            {/* Success Modal */}
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
                        Perubahan pada episode ebook telah berhasil disimpan dan diperbarui ke dalam sistem.
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