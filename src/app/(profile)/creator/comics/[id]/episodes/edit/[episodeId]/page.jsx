"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

/* Third-Party */
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/* API Hooks */
import {
    useGetEpisodeComicByIdQuery,
    useUpdateEpisodeComicMutation
} from "@/hooks/api/episodeComicSliceAPI";

/* Constants & Components */
import { priceOption } from "@/lib/constants/priceOptions";
import InputText from "@/components/UploadForm/InputText";
import RichTextEditor from '@/components/RichTextEditor/page';
import InputImageBanner from "@/components/UploadForm/InputImageBanner";
import PriceSelector from "@/components/UploadForm/PriceSelector";
import ButtonSubmit from '@/components/UploadForm/ButtonSubmit';
import LoadingOverlay from "@/components/LoadingOverlay/page";
import HeaderUploadForm from "@/components/UploadForm/HeaderUploadForm";
import FlexModal from "@/components/Modal/FlexModal";

/* Assets */
import IconsGalery from "@@/icons/logo-upload-banner.svg";
import IconsButtonSubmit from "@@/IconsButton/buttonSubmit.svg";

// Schema untuk edit
const editComicEpisodeSchema = z.object({
    title: z.string().min(1, "Judul wajib diisi"),
    description: z.string().min(1, "Deskripsi wajib diisi"),
    price: z.string(),
    notedEpisode: z.string().optional(),
    coverImageUrl: z.any().optional(),
    fileImageComics: z.any().optional(),
});

export default function EditComicEpisodePage() {
    const router = useRouter();
    const params = useParams();
    const episodeId = params?.episodeId;
    const comicId = params?.id;

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);
    const formRef = useRef(null);

    const { data: episodeData, isLoading: isLoadingEpisode } = useGetEpisodeComicByIdQuery(episodeId, {
        skip: !episodeId,
    });

    const [updateEpisode, { isLoading: isUpdating, error }] = useUpdateEpisodeComicMutation();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(editComicEpisodeSchema),
        mode: "onChange",
        defaultValues: {
            title: "",
            description: "",
            price: "",
            notedEpisode: "",
            coverImageUrl: [],
            fileImageComics: [],
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
                coverImageUrl: [],
                fileImageComics: [],
            });
        }
    }, [episodeData, reset]);

    const onSubmit = async (data) => {
        // Hanya submit jika flag canSubmit true
        if (!canSubmit) {
            console.log("🚫 Submit blocked - not from Update Episode button");
            return;
        }

        console.log("📤 Submitting data:", data);
        
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("price", String(data.price || "0"));
        
        if (data.notedEpisode) {
            formData.append("notedEpisode", data.notedEpisode);
        }

        // Only append cover if selected
        if (data.coverImageUrl && data.coverImageUrl.length > 0) {
            formData.append("coverImageUrl", data.coverImageUrl[0]);
        }

        // Only append comic images if selected
        if (data.fileImageComics && data.fileImageComics.length > 0) {
            data.fileImageComics.forEach((file) => {
                formData.append("fileImageComics", file);
            });
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
        // Replace current history entry to prevent back button returning to form
        router.replace(`/creator/comics/${comicId}/episodes`);
    };

    // Handle back button click
    const handleBackClick = () => {
        router.back();
    };

    // Handle form submit dengan flag control
    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        if (canSubmit) {
            handleSubmit(onSubmit)(e);
        } else {
            console.log("🚫 Form submit prevented - canSubmit is false");
        }
    };

    // Handle Update Episode button click
    const handleUpdateClick = () => {
        setCanSubmit(true);
        // Trigger form submit programmatically
        if (formRef.current) {
            formRef.current.dispatchEvent(
                new Event('submit', { cancelable: true, bubbles: true })
            );
        }
    };

    if (isLoadingEpisode) {
        return <LoadingOverlay message="Loading episode data..." />;
    }

    // Get episode data dengan fallback
    const episode = episodeData?.data?.data || episodeData?.data || episodeData;

    return (
        <main className="relative mx-2 flex flex-col lg:mx-6 min-h-screen">
            <div className="mt-4 mb-6">
                <HeaderUploadForm 
                    title="Edit Episode Comic" 
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
                    label="Judul Episode"
                    name="title"
                    placeholder="Contoh: Chapter 1: The Beginning"
                    {...register("title")}
                    error={errors.title?.message}
                />

                {/* Deskripsi - RICH TEXT EDITOR */}
                <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState }) => (
                        <RichTextEditor
                            label="Deskripsi Episode"
                            name="description"
                            placeholder="Jelaskan isi episode ini"
                            value={field.value || ""}
                            onChange={field.onChange}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                {/* Cover Image */}
                <Controller
                    name="coverImageUrl"
                    control={control}
                    render={({ field, fieldState }) => (
                        <div className="flex flex-col gap-2">
                            <label className="text-white font-semibold">Cover Episode</label>
                            <p className="text-sm text-gray-400">
                                Gunakan rasio 1:1 (square), format JPG/PNG, maks 500KB
                            </p>
                            
                            <div className="bg-[#2A2A2A] rounded-lg p-4 border border-[#4A4A4A]">
                                <p className="text-white font-medium mb-2">Upload Gambar</p>
                                
                                {/* Jika ada gambar existing dan belum upload baru */}
                                {episode?.coverImageUrl && field.value.length === 0 ? (
                                    <div className="flex items-start gap-3">
                                        {/* Button Upload */}
                                        <label className="cursor-pointer flex-shrink-0">
                                            <div className="w-24 h-24 bg-[#3A3A3A] rounded flex flex-col items-center justify-center hover:bg-[#4A4A4A] transition">
                                                <img src={IconsGalery} alt="upload" className="w-8 h-8 mb-1" />
                                                <span className="text-white text-xs">Upload</span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files.length > 0) {
                                                        field.onChange([...e.target.files]);
                                                    }
                                                }}
                                            />
                                        </label>

                                        {/* Preview gambar existing */}
                                        <div className="relative">
                                            <img
                                                src={episode.coverImageUrl}
                                                alt="cover"
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    const input = e.currentTarget.closest('.bg-\\[\\#2A2A2A\\]').querySelector('input[type="file"]');
                                                    if (input) input.click();
                                                }}
                                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs transition"
                                            >
                                                ✕
                                            </button>
                                            <p className="text-xs text-gray-400 mt-1 max-w-[80px] truncate">
                                                {episode.coverImageUrl.split('/').pop()}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <InputImageBanner
                                        type="thumbnail"
                                        name="coverImageUrl"
                                        icon={IconsGalery}
                                        files={field.value}
                                        onUpload={(e) => {
                                            if (e?.preventDefault) e.preventDefault();
                                            if (e?.stopPropagation) e.stopPropagation();
                                            
                                            const files = e.target?.files || e;
                                            field.onChange([...files]);
                                        }}
                                        onRemove={(e) => {
                                            if (e?.preventDefault) e.preventDefault();
                                            if (e?.stopPropagation) e.stopPropagation();
                                            
                                            field.onChange([]);
                                        }}
                                        error={fieldState.error?.message}
                                    />
                                )}

                                {!episode?.coverImageUrl && field.value.length === 0 && (
                                    <p className="text-sm text-gray-400 mt-2 italic">No file chosen</p>
                                )}
                            </div>
                            
                            {fieldState.error?.message && (
                                <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                            )}
                        </div>
                    )}
                />

                {/* Comic Images - Multiple Upload */}
                <Controller
                    name="fileImageComics"
                    control={control}
                    render={({ field, fieldState }) => (
                        <div className="flex flex-col gap-2">
                            <label className="text-white font-semibold">
                                Halaman Comic (Multiple Images) - Opsional
                            </label>
                            <p className="text-sm text-gray-400">
                                Upload gambar baru jika ingin mengganti. Maksimal 10 file. Kosongkan jika tidak ingin mengubah.
                            </p>
                            
                            {episode?.fileImageComics && episode.fileImageComics.length > 0 && field.value.length === 0 && (
                                <div className="p-3 bg-[#2D2D2D] rounded-lg border border-[#4A4A4A] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm text-gray-300">
                                            {episode.fileImageComics.length} halaman sudah terupload
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            const input = document.querySelector('input[name="fileImageComics"]');
                                            if (input) input.click();
                                        }}
                                        className="text-blue-500 hover:text-blue-400 text-sm font-semibold transition"
                                    >
                                        Ganti
                                    </button>
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                name="fileImageComics"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        field.onChange([...e.target.files]);
                                    }
                                }}
                                className="block w-full text-sm text-gray-400
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-[#156EB7] file:text-white
                                    hover:file:bg-[#0d5a94]
                                    file:cursor-pointer cursor-pointer
                                    border border-[#686868] rounded-lg p-2"
                            />
                            {field.value && field.value.length > 0 && (
                                <p className="text-sm text-green-400">
                                    ✓ {field.value.length} file baru dipilih
                                </p>
                            )}
                            {fieldState.error?.message && (
                                <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                            )}
                        </div>
                    )}
                />

                {/* Catatan Episode - RICH TEXT EDITOR */}
                <Controller
                    name="notedEpisode"
                    control={control}
                    render={({ field, fieldState }) => (
                        <RichTextEditor
                            label="Catatan Episode (Opsional)"
                            name="notedEpisode"
                            placeholder="Tambahkan catatan atau informasi tambahan"
                            value={field.value || ""}
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
                            label="Harga Akses Episode"
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
                        Perubahan pada episode comic telah berhasil disimpan dan diperbarui ke dalam sistem.
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