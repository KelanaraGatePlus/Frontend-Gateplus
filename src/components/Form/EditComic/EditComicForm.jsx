"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/*[--- THIRD PARTY LIBRARIES ---]*/
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/*[--- SCHEMAS & HELPER ---]*/
import { editComicSchema } from "@/lib/schemas/editComicSchema";

/*[--- API HOOKS & FEATURES ---]*/
import { useGetAllGenresQuery } from "@/hooks/api/genreSliceAPI";
import { useGetComicByIdQuery, useUpdateComicMutation } from "@/hooks/api/comicSliceAPI";

/*[--- CONSTANT VARIABLE---]*/
import { languageOptions } from "@/lib/constants/languageOptions";

/*[--- UI COMPONENTS ---]*/
import ButtonSubmit from "@/components/UploadForm/ButtonSubmit";
import InputImageBanner from "@/components/UploadForm/InputImageBanner";
import InputSelect from "@/components/UploadForm/InputSelect";
import InputText from "@/components/UploadForm/InputText";
import InputTextArea from "@/components/UploadForm/InputTextArea";
import LoadingOverlay from "@/components/LoadingOverlay/page";

/*[--- ASSETS PUBLIC ---]*/
import IconsButtonSubmit from "@@/IconsButton/buttonSubmit.svg";
import IconsGalery from "@@/icons/logo-upload-banner.svg";
import PropTypes from "prop-types";

export default function EditComicForm({ id }) {
    const router = useRouter();
    const posterBannerInputRef = useRef(null);
    const coverBookInputRef = useRef(null);
    const [updateComic, { isLoading, error }] = useUpdateComicMutation();
    const { data: comicData } = useGetComicByIdQuery({ id, withEpisodes: false }, { skip: !id });

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(editComicSchema),
        mode: "onChange",
        defaultValues: {
            title: comicData?.data.title || "",
            description: comicData?.data.description || "",
            genre: comicData?.data.categoriesId || "",
            language: comicData?.data.language || "",
            posterBanner: null,
            coverBook: null,
        },
    });

    // Update form ketika data dari API sudah masuk
    useEffect(() => {
        if (comicData?.data) {
            reset({
                title: comicData.data.title || "",
                description: comicData.data.description || "",
                genre: comicData.data.categoriesId || "",
                language: comicData.data.language || "",
                posterBanner: comicData.data.posterImageUrl ? [comicData.data.posterImageUrl] : null,
                coverBook: comicData.data.coverImageUrl ? [comicData.data.coverImageUrl] : null,
            });
        }
    }, [comicData, reset]);

    const { data: genresData } = useGetAllGenresQuery();

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("categoriesId", data.genre);
        formData.append("language", data.language);

        if (data.coverBook && data.coverBook[0] && data.coverBook[0] instanceof File) {
            formData.append("coverImageUrl", data.coverBook[0]);
        }
        if (data.posterBanner && data.posterBanner[0] && data.posterBanner[0] instanceof File) {
            formData.append("posterImageUrl", data.posterBanner[0]);
        }

        try {
            await updateComic({ id, formData }).unwrap();
            router.push(`/creator/dashboard/content`);
        } catch (err) {
            console.error("Error editing comic:", err);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 lg:gap-0">
                <div className="flex flex-col gap-2">
                    <InputText
                        label="Judul"
                        name="title"
                        placeholder="Judul Series"
                        {...register("title")}
                        error={errors.title?.message}
                    />

                    <InputTextArea
                        label="Deskripsi"
                        name="description"
                        placeholder="Deskripsi"
                        {...register("description")}
                        error={errors.description?.message}
                    />

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

                    <Controller
                        name="posterBanner"
                        control={control}
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

                    <Controller
                        name="coverBook"
                        control={control}
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
                {error && <p className="text-red-500 text-sm">Gagal ubah data: {error.data?.message || "Terjadi kesalahan"}</p>}
            </form>
            {isLoading && (
                <LoadingOverlay message="Tunggu Sebentar... <br/> Sedang mengubah comic" />
            )}
        </>
    );
}

EditComicForm.propTypes = {
    id: PropTypes.string.isRequired,
}
