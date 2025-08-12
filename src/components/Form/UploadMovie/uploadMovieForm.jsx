"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";

/*[--- THIRD PARTY LIBRARIES ---]*/
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/*[--- SCHEMAS & HELPER ---]*/
import { createMovieSchema } from "@/lib/schemas/createMovieSchema";

/*[--- API HOOKS & FEATURES ---]*/
import { useGetAllGenresQuery } from "@/hooks/api/genreSliceAPI";
import { useGetCreatorId } from "@/lib/features/useGetCreatorId";

/*[--- CONSTANT VARIABLE---]*/
import { languageOptions } from '@/lib/constants/languageOptions';

/*[--- UI COMPONENTS ---]*/
import ButtonSubmit from '@/components/UploadForm/ButtonSubmit';
import InputAgeResctriction from '@/components/UploadForm/InputAgeResctriction';
import InputImageBanner from '@/components/UploadForm/InputImageBanner';
import InputSelect from '@/components/UploadForm/InputSelect';
import InputText from '@/components/UploadForm/InputText';
import InputTextArea from '@/components/UploadForm/InputTextArea';
import LoadingOverlay from "@/components/LoadingOverlay/page";

/*[--- ASSETS PUBLIC ---]*/
import IconsButtonSubmit from "@@/IconsButton/buttonSubmit.svg";
import IconsGalery from "@@/icons/logo-upload-banner.svg";
import UploadLargeFile from "@/components/UploadForm/UploadLargeFile";
import { useCreateFilmMutation } from "@/hooks/api/filmSliceAPI";
import PriceSelector from "@/components/UploadForm/PriceSelector";
import { priceOption } from "@/lib/constants/priceOptions";


export default function UploadMovieForm() {
    const router = useRouter();
    const creatorId = useGetCreatorId();
    const posterBannerInputRef = useRef(null);
    const coverBookInputRef = useRef(null);
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createMovieSchema),
        mode: "onChange",
        defaultValues: {
            title: "",
            description: "",
            genre: "",
            language: "",
            ageRestriction: "",
            posterBanner: null,
            coverBook: null,
            price: "",
            filmFileUrl: "",
            thumbnail: "",
            duration: "",
            productionHouse: "",
            producer: "",
            writer: "",
            talent: "",
            releaseYear: "",
            trailerFileUrl: "",
        },
    });

    const [createFilm, { isLoading, error }] = useCreateFilmMutation();
    const { data: genresData } = useGetAllGenresQuery();

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("creatorId", creatorId);
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("categoriesId", data.genre);
            formData.append("language", data.language);
            formData.append("ageRestriction", data.ageRestriction);
            formData.append("price", data.price);
            formData.append("filmFileUrl", data.filmFileUrl);
            formData.append("duration", data.duration);
            formData.append("productionHouse", data.productionHouse);
            formData.append("director", data.director);
            formData.append("producer", data.producer);
            formData.append("writer", data.writer);
            formData.append("talent", data.talent);
            formData.append("releaseYear", data.releaseYear);
            formData.append("trailerFileUrl", data.trailerFileUrl);

            if (data.coverBook?.[0]) formData.append("coverImageUrl", data.coverBook[0]);
            if (data.posterBanner?.[0]) formData.append("posterImageUrl", data.posterBanner[0]);
            if (data.thumbnail?.[0]) formData.append("thumbnailImageUrl", data.thumbnail[0]);

            try {
                const result = await createFilm(formData).unwrap();
                router.push(`/`);
            } catch (err) {
                console.error("Error creating film:", err);
            }
        } catch (error) {
            console.error("Error preparing form data:", error);
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

                    {/* Deskripsi */}
                    <InputTextArea
                        label="Deskripsi"
                        name="description"
                        placeholder="Deskripsi"
                        {...register("description")}
                        error={errors.description?.message}
                    />

                    <InputText
                        label={"Durasi"}
                        name="duration"
                        placeholder="00Minute"
                        {...register("duration")}
                        error={errors.duration?.message}
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

                    <InputText
                        label={"Rumah Produksi"}
                        name="productionHouse"
                        placeholder="Production House"
                        {...register("productionHouse")}
                        error={errors.productionHouse?.message}
                    />

                    <InputText
                        label={"Sutradara"}
                        name="director"
                        placeholder="Name"
                        {...register("director")}
                        error={errors.director?.message}
                    />

                    {/* Produser */}
                    <InputText
                        label={"Produser"}
                        name="producer"
                        placeholder="Name"
                        {...register("producer")}
                        error={errors.producer?.message}
                    />

                    {/* Penulis */}
                    <InputText
                        label={"Penulis"}
                        name="writer"
                        placeholder="Full Name"
                        {...register("writer")}
                        error={errors.writer?.message}
                    />

                    {/* Pemain */}
                    <InputText
                        label={"Pemain"}
                        name="talent"
                        placeholder="Full Name"
                        {...register("talent")}
                        error={errors.talent?.message}
                    />

                    {/* Tahun Rilis */}
                    <InputText
                        label={"Tahun Rilis"}
                        name="releaseYear"
                        placeholder="Year"
                        {...register("releaseYear")}
                        error={errors.releaseYear?.message}
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

                    {/* Movie URL */}
                    <Controller
                        name="filmFileUrl"
                        control={control}
                        rules={{ required: "File film wajib diunggah" }}
                        render={({ field, fieldState }) => (
                            <div>
                                <UploadLargeFile
                                    prefix="movie/file"
                                    setData={field.onChange}
                                    name={'film'}
                                    label="Film Upload"
                                />
                                <input type="hidden" {...field} value={field.value || ""} />
                                {fieldState.error?.message && (
                                    <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                                )}
                            </div>
                        )}
                    />

                    {/* Trailer URL (muncul setelah film ada) */}
                    {watch("filmFileUrl") && (
                        <Controller
                            name="trailerFileUrl"
                            control={control}
                            rules={{ required: "File trailer wajib diunggah" }}
                            render={({ field, fieldState }) => (
                                <div>
                                    <UploadLargeFile
                                        prefix="movie/trailer"
                                        setData={field.onChange}
                                        name={'trailer'}
                                        label="Trailer Upload"
                                    />
                                    <input type="hidden" {...field} value={field.value || ""} />
                                    {fieldState.error?.message && (
                                        <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                                    )}
                                </div>
                            )}
                        />
                    )}

                    {/* Thumbnail */}
                    <Controller
                        name="thumbnail"
                        control={control}
                        rules={{ required: "Thumbnail wajib diunggah" }}
                        render={({ field, fieldState }) => (
                            <InputImageBanner
                                type="cover"
                                label="Thumbnail"
                                description="Gunakan rasio 1,6:2 (1600x2560), format JPG/PNG, ukuran maksimal 500KB. Poster harus jelas dan mewakili isi konten."
                                name="thumbnail"
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

                    {/* Poster Banner */}
                    <Controller
                        name="posterBanner"
                        control={control}
                        rules={{ required: "Poster banner wajib diunggah" }}
                        render={({ field, fieldState }) => (
                            <InputImageBanner
                                type="banner"
                                label="Poster Input"
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
                                label="Banner Input"
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

                    {/* Harga */}
                    <Controller
                        name="price"
                        control={control}
                        render={({ field, fieldState }) => (
                            <PriceSelector
                                label="Price"
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
