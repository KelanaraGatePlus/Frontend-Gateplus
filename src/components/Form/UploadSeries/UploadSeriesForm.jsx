"use client";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";

/*[--- THIRD PARTY LIBRARIES ---]*/
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/*[--- SCHEMAS & HELPER ---]*/
import { createSeriesSchema } from "@/lib/schemas/createSeriesSchema";

/*[--- API HOOKS & FEATURES ---]*/
import { useGetAllGenresQuery } from "@/hooks/api/genreSliceAPI";

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
import PriceSelector from "@/components/UploadForm/PriceSelector";
import { priceOption } from "@/lib/constants/priceOptions";
import { useCreateSeriesMutation } from "@/hooks/api/seriesSliceAPI";
import GenreMultiSelect from "@/components/UploadForm/GenreMultiSelect";



export default function UploadSeriesForm() {
    const router = useRouter();
    const posterBannerInputRef = useRef(null);
    const coverBookInputRef = useRef(null);
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createSeriesSchema),
        mode: "onChange",
        defaultValues: {
            title: "",
            description: "",
            genre: [],
            language: "",
            ageRestriction: "",
            posterBanner: null,
            coverBook: null,
            subscriptionPrice: "",
            thumbnail: "",
            productionHouse: "",
            producer: "",
            writer: "",
            talent: "",
            releaseYear: "",
            trailerFileUrl: "",
            canSubscribe: false
        },
    });

    const [createSeries, { isLoading, error }] = useCreateSeriesMutation();
    const { data: genresData } = useGetAllGenresQuery();

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            const selectedGenres = Array.isArray(data.genre) ? data.genre : [data.genre].filter(Boolean);
            formData.append("categoriesId", JSON.stringify(selectedGenres));
            formData.append("language", data.language);
            formData.append("ageRestriction", data.ageRestriction);
            formData.append("subscriptionPrice", data.subscriptionPrice);
            formData.append("productionHouse", data.productionHouse);
            formData.append("director", data.director);
            formData.append("producer", data.producer);
            formData.append("writer", data.writer);
            formData.append("talent", data.talent);
            formData.append("releaseYear", data.releaseYear);
            formData.append("trailerFileUrl", data.trailerFileUrl);
            formData.append("canSubscribe", data.canSubscribe);

            if (data.coverBook?.[0]) formData.append("coverImageUrl", data.coverBook[0]);
            if (data.posterBanner?.[0]) formData.append("posterImageUrl", data.posterBanner[0]);
            if (data.thumbnail?.[0]) formData.append("thumbnailImageUrl", data.thumbnail[0]);

            try {
                const result = await createSeries(formData).unwrap();
                if (result) {
                    router.push(`/`);
                }
            } catch (err) {
                console.error("Error creating series:", err);
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
                        label="Judul Utama Seri (Main Series Title)"
                        name="title"
                        placeholder="Judul Series"
                        {...register("title")}
                        error={errors.title?.message}
                    />

                    {/* Deskripsi */}
                    <InputTextArea
                        label="Sinopsis Lengkap Seri"
                        name="description"
                        placeholder="Jelaskan premis utama dunia cerita, konflik sentral, karakter utama, dan tema yang diangkat. Mesin pencari menggunakan teks ini untuk mempertemukan karyamu dengan pembaca yang tepat."
                        {...register("description")}
                        error={errors.description?.message}
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
                        placeholder="Tulis nama resmi studio atau perusahaan produksi yang bertanggung jawab"
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
                        label={"Penulis Naskah (Screenwriter)"}
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
                                label="Bahasa Utama Konten (Original Language)"
                                name="language"
                                options={languageOptions}
                                placeholder="Pilih bahasa pengantar yang digunakan dalam seri ini."
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={fieldState.error?.message}
                                isLanguage={true}
                            />
                        )}
                    />

                    {/* Can Subscribe */}
                    <Controller
                        name="canSubscribe"
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputText
                                type="checkbox"
                                {...field}
                                isSelected={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                                label="Izinkan Langganan"
                                className="text-white w-6 h-6"
                                error={fieldState.error?.message}
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

                    {/* Trailer URL (muncul setelah movie ada) */}
                    <Controller
                        name="trailerFileUrl"
                        control={control}
                        rules={{ required: "File trailer wajib diunggah" }}
                        render={({ field, fieldState }) => (
                            <div>
                                <UploadLargeFile
                                    prefix="series/trailer"
                                    setDataUrl={field.onChange}
                                    name={'trailer'}
                                    label="Video Trailer Seri Utama (Teaser)"
                                    description="Gunakan rasio 16:9, format MP4/MOV, maks 500KB. Trailer yang menarik sangat penting untuk memancing penonton pertama kali dan meningkatkan visibilitas di hasil pencarian video."
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
                                description='Gunakan rasio 1,6:2 (1600x2560), format JPG/PNG, ukuran maksimal 500KB. Poster harus jelas dan mewakili isi konten. Gunakan gambar beresolusi tinggi (format vertikal/portrait biasanya standar industri film). Ini adalah "wajah" film Anda di seluruh platform dan hasil pencarian Google. Pastikan gambarnya profesional, memuat judul yang jelas, dan sangat memancing klik (High CTR).'
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
                    {watch('canSubscribe') && <Controller
                        name="subscriptionPrice"
                        control={control}
                        render={({ field, fieldState }) => (
                            <PriceSelector
                                label="Subscription Price"
                                options={[
                                    "5000", "10000", "20000", "50000", "100000"
                                ]}
                                selected={field.value}
                                onSelect={(val) => {
                                    field.onChange(Number(val));
                                    field.onBlur();
                                }}
                                error={fieldState.error?.message}
                                canFree={false}
                            />
                        )}
                    />}
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
