"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/*[--- THIRD PARTY LIBRARIES ---]*/
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/*[--- SCHEMAS & HELPER ---]*/
import { editEbookSchema } from "@/lib/schemas/editEbookSchema";

/*[--- API HOOKS & FEATURES ---]*/
import { useGetAllGenresQuery } from "@/hooks/api/genreSliceAPI";
import { useEditEbookMutation, useGetEbookByIdQuery } from "@/hooks/api/ebookSliceAPI";

/*[--- CONSTANT VARIABLE---]*/
import { languageOptions } from '@/lib/constants/languageOptions';

/*[--- UI COMPONENTS ---]*/
import ButtonSubmit from '@/components/UploadForm/ButtonSubmit';
import InputImageBanner from '@/components/UploadForm/InputImageBanner';
import InputSelect from '@/components/UploadForm/InputSelect';
import InputText from '@/components/UploadForm/InputText';
import RichTextEditor from '@/components/RichTextEditor/page';
import LoadingOverlay from "@/components/LoadingOverlay/page";

/*[--- ASSETS PUBLIC ---]*/
import IconsButtonSubmit from "@@/IconsButton/buttonSubmit.svg";
import IconsGalery from "@@/icons/logo-upload-banner.svg";
import PropTypes from "prop-types";

export default function EditEbookForm({ id }) {
    const router = useRouter();
    const posterBannerInputRef = useRef(null);
    const coverBookInputRef = useRef(null);
    const [editEbook, { isLoading, error }] = useEditEbookMutation();
    const { data: ebookData } = useGetEbookByIdQuery(
        {
            id,
            withEpisodes: false
        }, { skip: !id }
    );
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(editEbookSchema),
        mode: "onChange",
        defaultValues: {
            title: ebookData?.data.title || "",
            description: ebookData?.data.description || "",
            genre: ebookData?.data.categoriesId || "",
            language: ebookData?.data.language || "",
            posterBanner: null,
            coverBook: null,
        },
    });

    // ⚡ Update form ketika data dari API sudah masuk
    useEffect(() => {
        if (ebookData?.data) {
            reset({
                title: ebookData.data.title || "",
                description: ebookData.data.description || "",
                genre: ebookData.data.categoriesId || "",
                language: ebookData.data.language || "",
                posterBanner: ebookData.data.posterImageUrl ? [ebookData.data.posterImageUrl] : null,
                coverBook: ebookData.data.coverImageUrl ? [ebookData.data.coverImageUrl] : null,
            });
        }
    }, [ebookData, reset]);

    const { data: genresData } = useGetAllGenresQuery();

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("categoriesId", data.genre);
        formData.append("language", data.language);

        // Only append file if user uploads new one
        if (data.coverBook && data.coverBook[0] && data.coverBook[0] instanceof File) {
            formData.append("coverImageUrl", data.coverBook[0]);
        }
        if (data.posterBanner && data.posterBanner[0] && data.posterBanner[0] instanceof File) {
            formData.append("posterImageUrl", data.posterBanner[0]);
        }

        try {
            await editEbook({ id, formData }).unwrap();
            router.push(`/creator/dashboard/content`);
        } catch (err) {
            console.error("Error editing ebook:", err);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 lg:gap-0">
                <div className="flex flex-col gap-2">
                    {/* Judul */}
                    <InputText
                        label="Judul"
                        name="title"
                        placeholder="Judul Series"
                        {...register("title")}
                        error={errors.title?.message}
                    />

                    {/* Deskripsi - CHANGED TO RICH TEXT EDITOR */}
                    <Controller
                        name="description"
                        control={control}
                        render={({ field, fieldState }) => (
                            <RichTextEditor
                                label="Deskripsi"
                                name="description"
                                placeholder="Deskripsi"
                                value={field.value}
                                onChange={field.onChange}
                                error={fieldState.error?.message}
                            />
                        )}
                    />

                    {/* Genre */}
                    <Controller
                        name="genre"
                        control={control}
                        rules={{ required: "Genre wajib dipilih" }}
                        render={({ field, fieldState }) => (
                            <InputSelect
                                label="Genre"
                                name="genre"
                                options={genresData?.data.data || []}
                                placeholder="Pilih Genre"
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={fieldState.error?.message}
                            />
                        )}
                    />

                    {/* Bahasa */}
                    <Controller
                        name="language"
                        control={control}
                        rules={{ required: "Bahasa wajib dipilih" }}
                        render={({ field, fieldState }) => (
                            <InputSelect
                                label="Bahasa"
                                name="language"
                                options={languageOptions}
                                placeholder="Pilih Bahasa"
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={fieldState.error?.message}
                                isLanguage={true}
                            />
                        )}
                    />

                    {/* Poster Banner */}
                    <Controller
                        name="posterBanner"
                        control={control}
                        rules={{ required: "Poster banner wajib diunggah" }}
                        render={({ field, fieldState }) => (
                            <InputImageBanner
                                type="banner"
                                label="Poster Banner"
                                description="Gunakan rasio 16:9 (1920x1080 px), format JPG/PNG, ukuran maksimal 500KB. Poster harus jelas dan mewakili isi konten."
                                name="posterBanner"
                                icon={IconsGalery}
                                inputRef={posterBannerInputRef}
                                files={field.value || []}
                                onUpload={(e) => {
                                    const files = [...e.target.files];
                                    field.onChange(files);
                                }}
                                onRemove={() => {
                                    field.onChange([]);
                                }}
                                error={fieldState.error?.message}
                            />
                        )}
                    />
                    {/* Cover Book */}
                    <Controller
                        name="coverBook"
                        control={control}
                        rules={{ required: "Cover book wajib diunggah" }}
                        render={({ field, fieldState }) => (
                            <InputImageBanner
                                type="cover"
                                label="Cover Book"
                                description="Gunakan rasio 1,6:2 (1600x2560), format JPG/PNG, ukuran maksimal 500KB. Poster harus jelas dan mewakili isi konten."
                                name="coverBook"
                                icon={IconsGalery}
                                inputRef={coverBookInputRef}
                                files={field.value || []}
                                onUpload={(e) => {
                                    const files = [...e.target.files];
                                    field.onChange(files);
                                }}
                                onRemove={() => {
                                    field.onChange([]);
                                }}
                                error={fieldState.error?.message}
                            />
                        )}
                    />
                </div>

                <ButtonSubmit type="submit" icon={IconsButtonSubmit} label="Konfirmasi Perubahan" isLoading={isLoading} />
                {error && <p className="text-red-500 text-sm">Gagal upload: {error.data?.message || "Terjadi kesalahan"}</p>}
            </form>
            {isLoading && (
                <LoadingOverlay message="Tunggu Sebentar... <br/> Sedang mengubah ebook" />
            )}
        </>
    )
}

EditEbookForm.propTypes = {
    id: PropTypes.string.isRequired,
}