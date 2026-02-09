"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";

/* Third-Party */
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/* Schemas */
import { createSeriesEpisodeSchema } from "@/lib/schemas/createSeriesEpisodeSchema";

/* API Hooks */
import {
    useGetEpisodeSeriesByIdQuery,
    useUpdateEpisodeSeriesMutation
} from "@/hooks/api/episodeSeriesSliceAPI";

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

/* ✅ SCHEMA EDIT: TERIMA URL ATAU FILE */
const editSeriesEpisodeSchema = createSeriesEpisodeSchema
    .omit({
        seriesId: true,
        termAccepted: true,
        agreementAccepted: true,
        episodeFileUrl: true,
    })
    .extend({
        coverEpisode: z
            .array(z.union([z.instanceof(File), z.string()]))
            .optional(),
    });

export default function EditSeriesEpisodePage() {
    const router = useRouter();
    const params = useParams();
    const episodeId = params?.episodeId;
    const seriesId = params?.id;

    const thumbnailInputRef = useRef(null);
    const formRef = useRef(null);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);

    const { data: episodeData, isLoading: isLoadingEpisode } =
        useGetEpisodeSeriesByIdQuery(episodeId, {
            skip: !episodeId,
        });

    const [updateEpisode, { isLoading: isUpdating, error }] =
        useUpdateEpisodeSeriesMutation();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(editSeriesEpisodeSchema),
        mode: "onChange",
        defaultValues: {
            title: "",
            description: "",
            price: "",
            coverEpisode: null,
        },
    });

    /* POLA SAMA — TIDAK DIUBAH */
    useEffect(() => {
        if (episodeData?.data) {
            const episode =
                episodeData?.data?.data ||
                episodeData?.data ||
                episodeData;

            reset({
                title: episode.title || "",
                description: episode.description || "",
                price: String(episode.price || "0"),
                coverEpisode: episode.thumbnailUrl
                    ? [episode.thumbnailUrl] // ⬅️ STRING AMAN
                    : null,
            });
        }
    }, [episodeData, reset]);

    const onSubmit = async (data) => {
        // Hanya submit jika flag canSubmit true
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

        // ✅ HANYA UPLOAD JIKA FILE BARU
        if (
            data.coverEpisode &&
            data.coverEpisode[0] instanceof File
        ) {
            formData.append("coverEpisode", data.coverEpisode[0]);
            console.log("📎 File baru akan diupload:", data.coverEpisode[0].name);
        } else {
            console.log("ℹ️ Tidak ada file baru, menggunakan thumbnail lama");
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
        // ✅ Gunakan replace agar tidak menambah history
        router.replace(`/creator/series/${seriesId}/episodes`);
    };

    const handleBackClick = () => {
        router.push(`/creator/series/${seriesId}/episodes`);
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

    return (
        <main className="relative mx-2 flex flex-col lg:mx-6 min-h-screen">
            <div className="mt-4 mb-6">
                <HeaderUploadForm
                    title="Edit Episode Series"
                    titlePosition="start"
                    onBackClick={handleBackClick}
                />
            </div>

            <form 
                ref={formRef}
                className="flex flex-col gap-2" 
                onSubmit={handleFormSubmit}
            >
                <InputText
                    label="Judul Episode"
                    name="title"
                    {...register("title")}
                    error={errors.title?.message}
                />

                <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState }) => (
                        <RichTextEditor
                            label="Sinopsis & Detail Episode Lengkap"
                            value={field.value}
                            onChange={field.onChange}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                <Controller
                    name="coverEpisode"
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputImageBanner
                            type="thumbnail"
                            label="Thumbnail Episode (Still Image)"
                            description="Gunakan rasio 1:1 (JPG/PNG, max 500KB)"
                            name="coverEpisode"
                            icon={IconsGalery}
                            inputRef={thumbnailInputRef}
                            files={field.value || []}
                            onUpload={(e) => {
                                if (e?.preventDefault) e.preventDefault();
                                if (e?.stopPropagation) e.stopPropagation();
                                
                                const files = e.target?.files || e;
                                field.onChange([...files]);
                                console.log("🖼️ Thumbnail selected, NOT submitting");
                            }}
                            onRemove={(e) => {
                                if (e?.preventDefault) e.preventDefault();
                                if (e?.stopPropagation) e.stopPropagation();
                                
                                field.onChange([]);
                            }}
                            error={fieldState.error?.message}
                        />
                    )}
                />

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

            {/* ✅ POPUP ASLI — TIDAK DISENTUH */}
            <FlexModal isOpen={isSuccessModalOpen} onClose={handleSuccessClose}>
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