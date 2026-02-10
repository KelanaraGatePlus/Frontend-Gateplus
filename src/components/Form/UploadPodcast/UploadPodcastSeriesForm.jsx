"use client";
import React, { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/*[--- THIRD PARTY LIBRARIES ---]*/
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/*[--- SCHEMAS & HELPER ---]*/
import { createPodcastSchema } from "@/lib/schemas/createPodcastSchema";

/*[--- API HOOKS & FEATURES ---]*/
import { useGetAllGenresQuery } from "@/hooks/api/genreSliceAPI";
import { useCreatePodcastMutation } from "@/hooks/api/podcastSliceAPI";

/*[--- CONSTANT VARIABLE---]*/
import { languageOptions } from '@/lib/constants/languageOptions';

/*[--- UI COMPONENTS ---]*/
import ButtonSubmit from '@/components/UploadForm/ButtonSubmit';
import InputAgeResctriction from '@/components/UploadForm/InputAgeResctriction';
import InputImageBanner from '@/components/UploadForm/InputImageBanner';
import InputSelect from '@/components/UploadForm/InputSelect';
import InputText from '@/components/UploadForm/InputText';
import LoadingOverlay from "@/components/LoadingOverlay/page";
import RichTextEditor from '@/components/RichTextEditor/page';

/*[--- ASSETS PUBLIC ---]*/
import IconsButtonSubmit from "@@/IconsButton/buttonSubmit.svg";
import IconsGalery from "@@/icons/logo-upload-banner.svg";
import GenreMultiSelect from "@/components/UploadForm/GenreMultiSelect";

export default function UploadPodcastSeriesForm() {
    const router = useRouter();
    const coverPodcastInputRef = useRef(null);
    const searchParams = useSearchParams();
    const fromEducation = searchParams.get("education") || null;
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createPodcastSchema),
        mode: "onChange",
        defaultValues: {
            title: "",
            description: "",
            genre: [],
            language: "",
            ageRestriction: "",
            coverPodcast: null,
        },
    });

    const [createPodcast, { isLoading, error }] = useCreatePodcastMutation();
    const { data: genresData } = useGetAllGenresQuery();

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        const selectedGenres = Array.isArray(data.genre) ? data.genre : [data.genre].filter(Boolean);
        formData.append("categoriesId", JSON.stringify(selectedGenres));
        formData.append("language", data.language);
        formData.append("ageRestriction", data.ageRestriction);

        if (data.coverPodcast?.[0]) formData.append("coverPodcastImage", data.coverPodcast[0]);

        try {
            const result = await createPodcast(formData).unwrap();
            if (fromEducation) {
                router.push(`/podcasts/upload/episode?fromEducation=${fromEducation}&series=${result.data.id}`);
                return;
            }
            router.push(`/podcasts/upload/episode?series=${result.data.id}`);
        } catch (err) {
            console.error("Error creating podcast:", err);
        }
    };

    return (
        <>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 lg:gap-0">
                <div className="flex flex-col gap-2">
                    {/* Judul */}
                    <InputText
                        label="Judul Seri Podcast"
                        name="title"
                        placeholder="Tulis nama podcast yang unik dan mudah diingat (Contoh: Podkeskak)"
                        {...register("title")}
                        error={errors.title?.message}
                    />

                    {/* Deskripsi */}
                    <Controller
                        name="description"
                        control={control}
                        render={({ field, fieldState }) => (
                            <RichTextEditor
                                label="Sinopsis Lengkap Podcast"
                                name="description"
                                placeholder="Jelaskan topik utama, format acara, dan siapa target pendengar Anda agar mudah ditemukan."
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
                            <GenreMultiSelect
                                label="Genre"
                                name="genre"
                                options={genresData?.data.data || []}
                                placeholder="Pilih satu atau lebih genre yang paling menggambarkan film ini (Misal: Aksi, Horor, Drama Komedi, Sci-Fi)."
                                value={field.value || []}
                                onChange={(val) => {
                                    field.onChange(val);
                                    field.onBlur();
                                }}
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
                                label="Bahasa Pengantar Audio"
                                name="language"
                                options={languageOptions}
                                placeholder="Pilih bahasa utama yang digunakan dalam rekaman (Misal: Indonesia)"
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={fieldState.error?.message}
                                isLanguage={true}
                            />
                        )}
                    />

                    {/* Age Restriction */}
                    <Controller
                        name="ageRestriction"
                        control={control}
                        rules={{ required: "Batasan umur harus dipilih" }}
                        render={({ field, fieldState }) => (
                            <InputAgeResctriction
                                value={field.value}
                                onChange={field.onChange}
                                error={fieldState.error?.message}
                            />
                        )}
                    />
                    {/* Cover Podcast */}
                    <Controller
                        name="coverPodcast"
                        control={control}
                        rules={{ required: "Cover podcast wajib diunggah" }}
                        render={({ field, fieldState }) => (
                            <InputImageBanner
                                type="thumbnail"
                                label="Sampul Seri Utama (Cover Art)"
                                description="Rasio: 1:1 Format: JPG/PNG Ukuran Maksimal: 500 KB"
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

                <ButtonSubmit type="submit" icon={IconsButtonSubmit} label="Buat Series" isLoading={isLoading} />
                {error && <p className="text-red-500 text-sm">Gagal upload: {error.data?.message || "Terjadi kesalahan"}</p>}
            </form>
            {isLoading && (
                <LoadingOverlay message="Tunggu Sebentar... <br/> Sedang membuat series" />
            )}
        </>
    )
}
