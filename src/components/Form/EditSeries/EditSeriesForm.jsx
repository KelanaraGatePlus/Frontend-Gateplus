"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/*[--- THIRD PARTY LIBRARIES ---]*/
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/*[--- SCHEMAS & HELPER ---]*/
import { editSeriesSchema } from "@/lib/schemas/editSeriesSchema";

/*[--- API HOOKS & FEATURES ---]*/
import { useGetAllGenresQuery } from "@/hooks/api/genreSliceAPI";
import { useGetSeriesByIdQuery, useEditSeriesMutation } from "@/hooks/api/seriesSliceAPI";

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

export default function EditSeriesForm({ id }) {
    const router = useRouter();
    const posterBannerInputRef = useRef(null);
    const coverBookInputRef = useRef(null);
    const thumbnailInputRef = useRef(null);
    const [editSeries, { isLoading, error }] = useEditSeriesMutation();
    const { data: seriesData } = useGetSeriesByIdQuery({ id, withEpisodes: false }, { skip: !id });

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(editSeriesSchema),
        mode: "onChange",
        defaultValues: {
            title: seriesData?.data?.data?.title || "",
            description: seriesData?.data?.data?.description || "",
            genre: seriesData?.data?.data?.categoriesId || "",
            language: seriesData?.data?.data?.language || "",
            director: seriesData?.data?.data?.director || "",
            producer: seriesData?.data?.data?.producer || "",
            writer: seriesData?.data?.data?.writer || "",
            talent: seriesData?.data?.data?.talent || "",
            releaseYear: seriesData?.data?.data?.releaseYear || "",
            productionHouse: seriesData?.data?.data?.productionHouse || "",
            posterBanner: null,
            coverBook: null,
            thumbnail: null,
        },
    });

    // Update form ketika data dari API sudah masuk
    useEffect(() => {
        if (seriesData?.data) {
            reset({
                title: seriesData.data.data.title || "",
                description: seriesData.data.data.description || "",
                genre: seriesData.data.data.categoriesId || "",
                language: seriesData.data.data.language || "",
                director: seriesData.data.data.director || "",
                producer: seriesData.data.data.producer || "",
                writer: seriesData.data.data.writer || "",
                talent: seriesData.data.data.talent || "",
                releaseYear: seriesData.data.data.releaseYear || "",
                productionHouse: seriesData.data.data.productionHouse || "",
                posterBanner: seriesData.data.data.posterImageUrl ? [seriesData.data.data.posterImageUrl] : null,
                coverBook: seriesData.data.data.coverImageUrl ? [seriesData.data.data.coverImageUrl] : null,
                thumbnail: seriesData.data.data.thumbnailImageUrl ? [seriesData.data.data.thumbnailImageUrl] : null,
            });
        }
    }, [seriesData, reset]);

    const { data: genresData } = useGetAllGenresQuery();

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("categoriesId", data.genre);
        formData.append("language", data.language);
        formData.append("director", data.director);
        formData.append("producer", data.producer);
        formData.append("writer", data.writer);
        formData.append("talent", data.talent);
        formData.append("releaseYear", data.releaseYear);
        formData.append("productionHouse", data.productionHouse);

        if (data.coverBook && data.coverBook[0] && data.coverBook[0] instanceof File) {
            formData.append("coverImageUrl", data.coverBook[0]);
        }
        if (data.posterBanner && data.posterBanner[0] && data.posterBanner[0] instanceof File) {
            formData.append("posterImageUrl", data.posterBanner[0]);
        }
        if (data.thumbnail && data.thumbnail[0] && data.thumbnail[0] instanceof File) {
            formData.append("thumbnailImageUrl", data.thumbnail[0]);
        }

        try {
            await editSeries({ id, formData }).unwrap();
            router.push(`/creator/dashboard/content`);
        } catch (err) {
            console.error("Error editing series:", err);
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

                    <InputText
                        label="Sutradara"
                        name="director"
                        placeholder="Sutradara"
                        {...register("director")}
                        error={errors.director?.message}
                    />

                    <InputText
                        label="Produser"
                        name="producer"
                        placeholder="Produser"
                        {...register("producer")}
                        error={errors.producer?.message}
                    />

                    <InputText
                        label="Penulis"
                        name="writer"
                        placeholder="Penulis"
                        {...register("writer")}
                        error={errors.writer?.message}
                    />

                    <InputText
                        label="Pemeran"
                        name="talent"
                        placeholder="Pemeran"
                        {...register("talent")}
                        error={errors.talent?.message}
                    />

                    <InputText
                        label="Tahun Rilis"
                        name="releaseYear"
                        placeholder="Tahun Rilis"
                        {...register("releaseYear")}
                        error={errors.releaseYear?.message}
                    />

                    <InputText
                        label="Rumah Produksi"
                        name="productionHouse"
                        placeholder="Rumah Produksi"
                        {...register("productionHouse")}
                        error={errors.productionHouse?.message}
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
                                label="Cover Series"
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

                    <Controller
                        name="thumbnail"
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputImageBanner
                                type="thumbnail"
                                label="Thumbnail"
                                description="Gunakan format JPG/PNG, ukuran maksimal 500KB. Thumbnail harus jelas dan mewakili isi konten."
                                name="thumbnail"
                                icon={IconsGalery}
                                inputRef={thumbnailInputRef}
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
                <LoadingOverlay message="Tunggu Sebentar... <br/> Sedang mengubah series" />
            )}
        </>
    );
}

EditSeriesForm.propTypes = {
  id: PropTypes.string.isRequired,
}
