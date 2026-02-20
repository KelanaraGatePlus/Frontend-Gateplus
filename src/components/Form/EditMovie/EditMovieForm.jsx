"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from '@/components/RichTextEditor/page';

/*[--- THIRD PARTY LIBRARIES ---]*/
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/*[--- SCHEMAS & HELPER ---]*/
import { editMovieSchema } from "@/lib/schemas/editMovieSchema";

/*[--- API HOOKS & FEATURES ---]*/
import { useGetAllGenresQuery } from "@/hooks/api/genreSliceAPI";
import { useGetMovieByIdQuery, useEditMovieMutation } from "@/hooks/api/movieSliceAPI";

/*[--- CONSTANT VARIABLE---]*/
import { languageOptions } from "@/lib/constants/languageOptions";

/*[--- UI COMPONENTS ---]*/
import ButtonSubmit from "@/components/UploadForm/ButtonSubmit";
import InputImageBanner from "@/components/UploadForm/InputImageBanner";
import GenreMultiSelect from "@/components/UploadForm/GenreMultiSelect";
import InputSelect from "@/components/UploadForm/InputSelect";
import InputText from "@/components/UploadForm/InputText";
import LoadingOverlay from "@/components/LoadingOverlay/page";

/*[--- ASSETS PUBLIC ---]*/
import IconsButtonSubmit from "@@/IconsButton/buttonSubmit.svg";
import IconsGalery from "@@/icons/logo-upload-banner.svg";
import PropTypes from "prop-types";

export default function EditMovieForm({ id }) {
    const router = useRouter();
    const posterBannerInputRef = useRef(null);
    const coverBookInputRef = useRef(null);
    const thumbnailInputRef = useRef(null);
    const [editMovie, { isLoading, error }] = useEditMovieMutation();
    const { data: movieData } = useGetMovieByIdQuery(id, { skip: !id });

    const normalizeGenres = (genres) => {
        if (Array.isArray(genres)) return genres;
        if (typeof genres === "string") {
            try {
                const parsed = JSON.parse(genres);
                if (Array.isArray(parsed)) return parsed;
            } catch {
                return genres ? [genres] : [];
            }
            return genres ? [genres] : [];
        }
        return [];
    };

    const getInitialGenres = (movie) => {
        const fromCategoriesId = normalizeGenres(movie?.categoriesId).map(String);
        if (fromCategoriesId.length > 0) return fromCategoriesId;

        const fromAllCategories = Array.isArray(movie?.allCategories)
            ? movie.allCategories
                .map((item) => String(item?.id || ""))
                .filter(Boolean)
            : [];
        if (fromAllCategories.length > 0) return fromAllCategories;

        return Array.isArray(movie?.categories)
            ? movie.categories
                .map((item) => String(item?.categoryId || item?.category?.id || ""))
                .filter(Boolean)
            : [];
    };

    const movie = movieData?.data?.data;

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(editMovieSchema),
        mode: "onChange",
        defaultValues: {
            title: movie?.title || "",
            description: movie?.description || "",
            genre: getInitialGenres(movie),
            language: movie?.language || "",
            director: movie?.director || "",
            producer: movie?.producer || "",
            writer: movie?.writer || "",
            talent: movie?.talent || "",
            releaseYear: movie?.releaseYear || "",
            productionHouse: movie?.productionHouse || "",
            duration: movie?.duration || "",
            posterBanner: null,
            coverBook: null,
            thumbnail: null,
        },
    });

    // Update form ketika data dari API sudah masuk
    useEffect(() => {
        if (movieData?.data?.data) {
            reset({
                title: movieData.data.data.title || "",
                description: movieData.data.data.description || "",
                genre: getInitialGenres(movieData.data.data),
                language: movieData.data.data.language || "",
                director: movieData.data.data.director || "",
                producer: movieData.data.data.producer || "",
                writer: movieData.data.data.writer || "",
                talent: movieData.data.data.talent || "",
                releaseYear: movieData.data.data.releaseYear || "",
                productionHouse: movieData.data.data.productionHouse || "",
                duration: movieData.data.data.duration || "",
                posterBanner: movieData.data.data.posterImageUrl ? [movieData.data.data.posterImageUrl] : null,
                coverBook: movieData.data.data.coverImageUrl ? [movieData.data.data.coverImageUrl] : null,
                thumbnail: movieData.data.data.thumbnailImageUrl ? [movieData.data.data.thumbnailImageUrl] : null,
            });
        }
    }, [movieData, reset]);

    const { data: genresData } = useGetAllGenresQuery();

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);

        const selectedGenres = Array.isArray(data.genre) ? data.genre : [data.genre].filter(Boolean);
        formData.append("categoriesId", JSON.stringify(selectedGenres));

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
            await editMovie({ id, formData }).unwrap();
            router.push(`/creator/dashboard/content`);
        } catch (err) {
            console.error("Error editing movie:", err);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 lg:gap-0">
                <div className="flex flex-col gap-2">
                    <InputText
                        label="Judul"
                        name="title"
                        placeholder="Judul Film"
                        {...register("title")}
                        error={errors.title?.message}
                    />

                    <Controller
                        name="description"
                        control={control}
                        render={({ field, fieldState }) => (
                            <RichTextEditor
                                label="Deskripsi"
                                name="description"
                                placeholder="Jelaskan premis utama film, konflik sentral, karakter utama, dan tema yang diangkat. Mesin pencari menggunakan teks ini untuk mempertemukan karyamu dengan penonton yang tepat."
                                value={field.value}
                                onChange={field.onChange}
                                error={fieldState.error?.message}
                            />
                        )}
                    />

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

                    <InputText
                        label="Durasi"
                        name="duration"
                        placeholder="Durasi (contoh: 120 menit)"
                        {...register("duration")}
                        error={errors.duration?.message}
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
                                label="Cover Film"
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
                <LoadingOverlay message="Tunggu Sebentar... <br/> Sedang mengubah film" />
            )}
        </>
    );
}

EditMovieForm.propTypes = {
    id: PropTypes.string.isRequired,
}