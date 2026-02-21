"use client";
import React, { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RichTextEditor from '@/components/RichTextEditor/page';

/*[--- THIRD PARTY LIBRARIES ---]*/
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/*[--- SCHEMAS & HELPER ---]*/
import { createMovieSchema } from "@/lib/schemas/createMovieSchema";

/*[--- API HOOKS & FEATURES ---]*/
import { useGetAllGenresQuery } from "@/hooks/api/genreSliceAPI";

/*[--- CONSTANT VARIABLE---]*/
import { languageOptions } from '@/lib/constants/languageOptions';

/*[--- UI COMPONENTS ---]*/
import ButtonSubmit from '@/components/UploadForm/ButtonSubmit';
import InputAgeResctriction from '@/components/UploadForm/InputAgeResctriction';
import InputImageBanner from '@/components/UploadForm/InputImageBanner';
import GenreMultiSelect from '@/components/UploadForm/GenreMultiSelect';
import InputSelect from '@/components/UploadForm/InputSelect';
import InputText from '@/components/UploadForm/InputText';
import LoadingOverlay from "@/components/LoadingOverlay/page";

/*[--- ASSETS PUBLIC ---]*/
import IconsButtonSubmit from "@@/IconsButton/buttonSubmit.svg";
import IconsGalery from "@@/icons/logo-upload-banner.svg";
import UploadLargeFile from "@/components/UploadForm/UploadLargeFile";
import { useCreateMovieMutation } from "@/hooks/api/movieSliceAPI";
import PriceSelector from "@/components/UploadForm/PriceSelector";
import { priceOption } from "@/lib/constants/priceOptions";
import TermsCheckbox from "@/components/UploadForm/TermsCheckbox";
import ContentExplicitModal from "@/components/Modal/ContentExplicitModal";
import useExplicitContentHandler from "@/hooks/helper/useExplicitContentHandler";


export default function UploadMovieForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const fromEducation = searchParams.get("education") || null;
    const posterBannerInputRef = useRef(null);
    const coverBookInputRef = useRef(null);
    const thumbnailInputRef = useRef(null);

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
        setValue,
        getValues,
    } = useForm({
        resolver: zodResolver(createMovieSchema),
        mode: "onChange",
        defaultValues: {
            title: "",
            description: "",
            genre: [],
            language: "",
            ageRestriction: "",
            posterBanner: null,
            coverBook: null,
            price: "",
            movieFileUrl: "",
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

    const [createMovie, { isLoading, error }] = useCreateMovieMutation();
    const { data: genresData } = useGetAllGenresQuery();
    const {
        isExplicitModalOpen,
        explicitImageName,
        handleExplicitError,
        handleRetryExplicitUpload,
        closeExplicitModal,
    } = useExplicitContentHandler({
        getValues,
        fieldInputRefs: {
            posterBanner: posterBannerInputRef,
            coverBook: coverBookInputRef,
            thumbnail: thumbnailInputRef,
        },
    });

    const onSubmit = async (data) => {
        console.log("Form Data:", data);
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            const selectedGenres = Array.isArray(data.genre) ? data.genre : [data.genre].filter(Boolean);
            formData.append("categoriesId", JSON.stringify(selectedGenres));
            formData.append("language", data.language);
            formData.append("ageRestriction", data.ageRestriction);
            formData.append("price", data.price);
            formData.append("movieFileUrl", data.movieFileUrl);
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
                const result = await createMovie(formData).unwrap();
                if (result) {
                    if (fromEducation) {
                        router.push(`/education/detail/${fromEducation}`);
                        return;
                    }
                    router.push(`/movies/detail/${result.data.data.id}`);
                }
            } catch (err) {
                if (handleExplicitError(err)) {
                    return;
                }
                console.error("Error creating movie:", err);
            }
        } catch (error) {
            console.error("Error preparing form data:", error);
        }
    };

    const onErrors = (errors) => {
        console.error("Validation Errors:", errors);
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit, onErrors)} className="flex flex-col gap-4 lg:gap-0">
                <div className="flex flex-col gap-2">
                    {/* Judul */}
                    <InputText
                        label="Judul"
                        name="title"
                        placeholder="Tulis judul yang menarik, akurat, dan mengandung kata kunci utama video"
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

                    <InputText
                        label={"Rumah Produksi (Production House / Studio)"}
                        name="productionHouse"
                        placeholder="Tulis nama resmi studio atau perusahaan produksi yang bertanggung jawab (Contoh: Miles Films, A24, Warner Bros)."
                        {...register("productionHouse")}
                        error={errors.productionHouse?.message}
                    />

                    <InputText
                        label={"Sutradara (Director)"}
                        name="director"
                        placeholder="Tulis nama lengkap sutradara film ini. Pastikan ejaan benar agar muncul di hasil pencarian profil mereka."
                        {...register("director")}
                        error={errors.director?.message}
                    />

                    {/* Produser */}
                    <InputText
                        label={"Produser (Producer)"}
                        name="producer"
                        placeholder="Tulis nama produser utama atau produser eksekutif."
                        {...register("producer")}
                        error={errors.producer?.message}
                    />

                    {/* Penulis */}
                    <InputText
                        label={"Penulis Naskah (Script Writer)"}
                        name="writer"
                        placeholder="Tulis nama penulis skenario atau cerita asli (Original Story)."
                        {...register("writer")}
                        error={errors.writer?.message}
                    />

                    {/* Pemain */}
                    <InputText
                        label={"Pemeran & Kru (Cast & Crew)"}
                        name="talent"
                        placeholder="Tag nama aktor utama, sutradara, atau produser agar film muncul saat nama mereka dicari."
                        {...register("talent")}
                        error={errors.talent?.message}
                    />

                    {/* Tahun Rilis */}
                    <InputText
                        label={"Tahun Rilis Perdana"}
                        name="releaseYear"
                        placeholder="Masukkan tahun tayang perdana film ini secara publik (Format: YYYY, Contoh: 2024)."
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
                                label="Bahasa Utama Audio (Original Language)"
                                name="language"
                                options={languageOptions}
                                placeholder="Pilih bahasa dialog asli yang dominan digunakan dalam film."
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
                        name="movieFileUrl"
                        control={control}
                        rules={{ required: "File movie wajib diunggah" }}
                        render={({ field, fieldState }) => (
                            <div>
                                <UploadLargeFile
                                    prefix="movie/file"
                                    setDataUrl={field.onChange}
                                    name={'movie'}
                                    label="Terbitkan Film / Video"
                                    placeholder="Unggah file video final (MP4/MOV disarankan) dengan kualitas terbaik. Proses encoding mungkin memakan waktu."
                                    error={fieldState.error?.message}
                                    setDuration={(durationValue) => {
                                        // Gunakan setValue untuk mengisi field 'duration'
                                        setValue('duration', durationValue, { shouldValidate: true });
                                    }}
                                />
                                <input type="hidden" {...field} value={field.value || ""} />
                                {fieldState.error?.message && (
                                    <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                                )}
                            </div>
                        )}
                    />
                    {/* Input durasi disembunyikan karena nilainya diisi otomatis */}
                    <input type="hidden" {...register("duration")} />

                    {/* (Opsional) Tampilkan durasi yang terdeteksi untuk feedback ke user */}
                    {watch("duration") && (
                        <div className="flex items-start gap-2">
                            <h3 className="montserratFont flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                                Durasi
                            </h3>
                            <p className="flex-4 md:flex-10 text-sm text-white mt-1">
                                {watch("duration")} detik
                            </p>
                        </div>
                    )}

                    {/* Trailer URL (muncul setelah movie ada) */}
                    <Controller
                        name="trailerFileUrl"
                        control={control}
                        rules={{ required: "File trailer wajib diunggah" }}
                        render={({ field, fieldState }) => (
                            <div>
                                <UploadLargeFile
                                    prefix="movie/trailer"
                                    setDataUrl={field.onChange}
                                    name={'trailer'}
                                    label="File Video Trailer (Teaser)"
                                    placeholder="Unggah video trailer pendek (durasi 1-3 menit disarankan) dengan kualitas terbaik. Trailer yang menarik sangat penting untuk memancing penonton pertama kali dan meningkatkan visibilitas di hasil pencarian video."
                                />
                                <input type="hidden" {...field} value={field.value || ""} />
                                {fieldState.error?.message && (
                                    <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                                )}
                            </div>
                        )}
                    />

                    {/* Thumbnail */}
                    <Controller
                        name="thumbnail"
                        control={control}
                        rules={{ required: "Thumbnail wajib diunggah" }}
                        render={({ field, fieldState }) => (
                            <InputImageBanner
                                type="cover"
                                label="Poster Utama Film (Key Visual / Cover Art)"
                                description="Gunakan rasio 1,6:2 (1600x2560), format JPG/PNG, ukuran maksimal 500KB. Poster harus jelas dan mewakili isi konten."
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

                    {/* Checkbox: Term & Agreement */}
                    <section className="flex w-4/6 flex-col text-sm md:text-base lg:w-10/12 lg:self-end">
                        <TermsCheckbox
                            name="termAccepted"
                            control={control}
                            label="Saya telah membaca dan menyetujui Syarat & Ketentuan serta Panduan Komunitas."
                            linkHref="/term-and-conditions"
                            linkText="Syarat & Ketentuan"
                        />
                        <TermsCheckbox
                            name="agreementAccepted"
                            control={control}
                            label="Saya menyatakan bahwa materi video ini orisinal atau saya memiliki hak penuh untuk mempublikasikannya (Bebas Pelanggaran Hak Cipta)."
                            linkHref="/agreement"
                            linkText="Agreement"
                        />
                    </section>
                </div>

                <ButtonSubmit type="submit" icon={IconsButtonSubmit} label="Publikasikan Video" isLoading={isLoading} />
                {error && <p className="text-red-500 text-sm">Gagal upload: {error.data?.message || "Terjadi kesalahan"}</p>}
            </form>
            {isLoading && (
                <LoadingOverlay message="Tunggu Sebentar... <br/> Sedang membuat series" />
            )}
            {isExplicitModalOpen && (
                <ContentExplicitModal
                    imageName={explicitImageName}
                    onClose={closeExplicitModal}
                    onRetry={handleRetryExplicitUpload}
                />
            )}
        </>
    )
}
