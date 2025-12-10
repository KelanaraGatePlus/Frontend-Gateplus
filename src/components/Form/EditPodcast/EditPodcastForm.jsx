"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/*[--- THIRD PARTY LIBRARIES ---]*/
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/*[--- SCHEMAS & HELPER ---]*/
import { editPodcastSchema } from "@/lib/schemas/editPodcastSchema";

/*[--- API HOOKS & FEATURES ---]*/
import { useGetAllGenresQuery } from "@/hooks/api/genreSliceAPI";
import { useGetPodcastByIdQuery, useEditPodcastMutation } from "@/hooks/api/podcastSliceAPI";

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

export default function EditPodcastForm({ id }) {
    const router = useRouter();
    const coverPodcastInputRef = useRef(null);
    const [editPodcast, { isLoading, error }] = useEditPodcastMutation();
    const { data: podcastData } = useGetPodcastByIdQuery({ id, withEpisodes: false }, { skip: !id });

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(editPodcastSchema),
        mode: "onChange",
        defaultValues: {
            title: podcastData?.data.title || "",
            description: podcastData?.data.description || "",
            genre: podcastData?.data.categoriesId || "",
            language: podcastData?.data.language || "",
            coverPodcast: null,
        },
    });

    // Update form ketika data dari API sudah masuk
    useEffect(() => {
        if (podcastData?.data) {
            reset({
                title: podcastData.data.title || "",
                description: podcastData.data.description || "",
                genre: podcastData.data.categoriesId || "",
                language: podcastData.data.language || "",
                coverPodcast: podcastData.data.coverPodcastImage ? [podcastData.data.coverPodcastImage] : null,
            });
        }
    }, [podcastData, reset]);

    const { data: genresData } = useGetAllGenresQuery();

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("categoriesId", data.genre);
        formData.append("language", data.language);

        if (data.coverPodcast && data.coverPodcast[0] && data.coverPodcast[0] instanceof File) {
            formData.append("coverPodcastImage", data.coverPodcast[0]);
        }

        try {
            await editPodcast({ id, formData }).unwrap();
            router.push(`/creator/dashboard/content`);
        } catch (err) {
            console.error("Error editing podcast:", err);
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
                        name="coverPodcast"
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputImageBanner
                                type="cover"
                                label="Cover Podcast"
                                description="Gunakan rasio 1,6:2 (1600x2560), format JPG/PNG, ukuran maksimal 500KB. Cover harus jelas dan mewakili isi konten."
                                name="coverPodcast"
                                icon={IconsGalery}
                                inputRef={coverPodcastInputRef}
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
                <LoadingOverlay message="Tunggu Sebentar... <br/> Sedang mengubah podcast" />
            )}
        </>
    );
}

EditPodcastForm.propTypes = {
  id: PropTypes.string.isRequired,
}
