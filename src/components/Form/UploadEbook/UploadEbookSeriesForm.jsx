"use client";
import React, { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/*[--- THIRD PARTY LIBRARIES ---]*/
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/*[--- SCHEMAS & HELPER ---]*/
import { createEbookSchema } from "@/lib/schemas/createEbookSchema";

/*[--- API HOOKS & FEATURES ---]*/
import { useGetAllGenresQuery } from "@/hooks/api/genreSliceAPI";
import { useCreateEbookMutation } from "@/hooks/api/ebookSliceAPI";

/*[--- CONSTANT VARIABLE---]*/
import { languageOptions } from '@/lib/constants/languageOptions';

/*[--- UI COMPONENTS ---]*/
import ButtonSubmit from '@/components/UploadForm/ButtonSubmit';
import InputAgeResctriction from '@/components/UploadForm/InputAgeResctriction';
import InputImageBanner from '@/components/UploadForm/InputImageBanner';
import InputSelect from '@/components/UploadForm/InputSelect';
import InputText from '@/components/UploadForm/InputText';
import RichTextEditor from '@/components/RichTextEditor/page';
import LoadingOverlay from "@/components/LoadingOverlay/page";

/*[--- ASSETS PUBLIC ---]*/
import IconsButtonSubmit from "@@/IconsButton/buttonSubmit.svg";
import IconsGalery from "@@/icons/logo-upload-banner.svg";
import GenreMultiSelect from "@/components/UploadForm/GenreMultiSelect";
import PriceSelector from "@/components/UploadForm/PriceSelector";

export default function UploadEbookSeriesForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const fromEducation = searchParams.get("education") || null;
    const posterBannerInputRef = useRef(null);
    const coverBookInputRef = useRef(null);
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createEbookSchema),
        mode: "onChange",
        defaultValues: {
            title: "",
            description: "",
            genre: [],
            language: "",
            ageRestriction: "",
            posterBanner: null,
            coverBook: null,
            canSubscribe: false,
            subscriptionPrice: 5000,
        },
    });

    const [createEbook, { isLoading, error }] = useCreateEbookMutation();
    const { data: genresData } = useGetAllGenresQuery();
    const canSubscribeValue = watch("canSubscribe");

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        const selectedGenres = Array.isArray(data.genre) ? data.genre : [data.genre].filter(Boolean);
        formData.append("categoriesId", JSON.stringify(selectedGenres));
        formData.append("language", data.language);
        formData.append("ageRestriction", data.ageRestriction);
        formData.append("canSubscribe", data.canSubscribe);
        console.log(data);
        if (data.canSubscribe == true && data.subscriptionPrice) {
            formData.append("subscriptionPrice", data.subscriptionPrice);
        } else {
            formData.append("subscriptionPrice", null);
        }

        if (data.coverBook?.[0]) formData.append("coverImageUrl", data.coverBook[0]);
        if (data.posterBanner?.[0]) formData.append("posterImageUrl", data.posterBanner[0]);

        try {
            const result = await createEbook(formData).unwrap();
            if(fromEducation) {
                router.push(`/ebooks/upload/episode?education=${fromEducation}&series=${result.data.id}`);
                return;
            }
            router.push(`/ebooks/upload/episode?series=${result.data.id}`);
        } catch (err) {
            console.error("Error creating ebook:", err);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 lg:gap-0">
                <div className="flex flex-col gap-2">
                    {/* Judul */}
                    <InputText
                        label="Judul Utama"
                        name="title"
                        placeholder="Judul Utama Seri Karya, Contoh: Petualangan Abadi di Lembah Sunyi"
                        {...register("title")}
                        error={errors.title?.message}
                    />

                    {/* Deskripsi - CHANGED TO RICH TEXT EDITOR */}
                    <Controller
                        name="description"
                        control={control}
                        render={({ field, fieldState }) => (
                            <RichTextEditor
                                label="Sinopsis Lengkap Seri"
                                name="description"
                                placeholder="Tuliskan ringkasan cerita Anda yang paling menarik, meliputi genre, latar belakang, dan karakter utama (minimal 50 karakter)."
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

                    {/* Subscription Price */}
                    {canSubscribeValue == true && (
                        <Controller
                            name="subscriptionPrice"
                            control={control}
                            rules={{ required: "Harga langganan wajib diisi" }}
                            render={({ field, fieldState }) => (
                                <PriceSelector
                                    label="Harga Langganan Seri"
                                    options={[
                                        "5000", "10000", "15000", "25000", "50000"
                                    ]}
                                    selected={field.value}
                                    onSelect={(val) => {
                                        field.onChange(parseInt(val, 10));
                                        field.onBlur();
                                    }}
                                    error={fieldState.error?.message}
                                    placeholder="Tentukan harga jual untuk kelas ini."
                                    canFree={false}
                                />
                            )}
                        />
                    )}

                    <Controller
                        name="posterBanner"
                        control={control}
                        rules={{ required: "Cover book wajib diunggah" }}
                        render={({ field, fieldState }) => (
                            <InputImageBanner
                                type="cover"
                                label="Sampul Utama Seri"
                                description="Gunakan rasio 1,6:2 (1600x2560), format JPG/PNG, ukuran maksimal 500KB. Poster harus jelas dan mewakili isi konten. Poster ini krusial untuk tampilan di aplikasi seluler (portrait view). Pastikan judul dan visual utama langsung menarik perhatian."
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

                    {/* Poster Banner */}
                    <Controller
                        name="coverBook"
                        control={control}
                        rules={{ required: "Poster banner wajib diunggah" }}
                        render={({ field, fieldState }) => (
                            <InputImageBanner
                                type="banner"
                                label="Poster Banner"
                                description="Gunakan rasio 16:9 (1920x1080 px), format JPG/PNG, ukuran maksimal 500KB. Poster harus jelas dan mewakili isi konten. Poster ini akan digunakan pada tampilan desktop dan landscape (web view). Pastikan detail visual utama terlihat jelas."
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

                <ButtonSubmit type="submit" icon={IconsButtonSubmit} label="Buat Series" isLoading={isLoading} />
                {error && <p className="text-red-500 text-sm">Gagal upload: {error.data?.message || "Terjadi kesalahan"}</p>}
            </form>
            {isLoading && (
                <LoadingOverlay message="Tunggu Sebentar... <br/> Sedang membuat series" />
            )}
        </>
    )
}