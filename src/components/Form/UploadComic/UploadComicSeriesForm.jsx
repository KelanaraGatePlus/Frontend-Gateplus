"use client";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";

/*[--- THIRD PARTY LIBRARIES ---]*/
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/*[--- SCHEMAS & HELPER ---]*/
import { createEbookSchema } from "@/lib/schemas/createEbookSchema";

/*[--- API HOOKS & FEATURES ---]*/
import { useGetAllGenresQuery } from "@/hooks/api/genreSliceAPI";
import { useCreateComicMutation } from "@/hooks/api/comicSliceAPI";

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

export default function UploadComicSeriesForm() {
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
        resolver: zodResolver(createEbookSchema),
        mode: "onChange",
        defaultValues: {
            title: "",
            description: "",
            genre: "",
            language: "",
            ageRestriction: "",
            posterBanner: null,
            coverBook: null,
            canSubscribe: false,
            subscriptionPrice: 0,
        },
    });

    const [createComic, { isLoading, error }] = useCreateComicMutation();
    const { data: genresData } = useGetAllGenresQuery();
    const canSubscribeValue = watch("canSubscribe");

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("categoriesId", data.genre);
        formData.append("language", data.language);
        formData.append("ageRestriction", data.ageRestriction);
        formData.append("canSubscribe", data.canSubscribe);
        formData.append("subscriptionPrice", data.subscriptionPrice.toString());

        if (data.coverBook?.[0]) formData.append("coverImageUrl", data.coverBook[0]);
        if (data.posterBanner?.[0]) formData.append("posterImageUrl", data.posterBanner[0]);

        try {
            const result = await createComic(formData).unwrap();
            router.push(`/comics/upload/episode?series=${result.data.id}`);
        } catch (err) {
            console.error("Error creating comic:", err);
        }
    };

    return (
        <>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 lg:gap-0">
                <div className="flex flex-col gap-2">
                    {/* Judul */}
                    <InputText
                        label="Judul Utama Seri Komik (Main Series Title)"
                        name="title"
                        placeholder="Tulis judul resmi dan unik dari seri komik ini. Hindari singkatan agar mudah dicari."
                        {...register("title")}
                        error={errors.title?.message}
                    />

                    {/* Deskripsi */}
                    <InputTextArea
                        label="Sinopsis Lengkap Seri Komik"
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
                            <InputSelect
                                label="Genre"
                                name="Genre / Kategori Utama Komik"
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
                                label="Bahasa Utama Teks (Original Language)"
                                name="language"
                                options={languageOptions}
                                placeholder="Pilih bahasa pengantar yang digunakan dalam teks seri komik ini."
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
                                <InputText
                                    label="Harga Langganan"
                                    name="subscriptionPrice"
                                    type="number"
                                    placeholder="Masukkan harga langganan"
                                    value={field.value}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                    )}

                    {/* Poster Banner */}
                    <Controller
                        name="coverBook"
                        control={control}
                        rules={{ required: "Poster banner wajib diunggah" }}
                        render={({ field, fieldState }) => (
                            <InputImageBanner
                                type="banner"
                                label="Banner Promosi Seri (Wide Banner)"
                                description="Gunakan rasio 16:9 (1920x1080 px), format JPG/PNG, maks 500KB. Banner ini digunakan untuk fitur promosi di halaman utama. Pastikan visualnya menarik dan memuat judul."
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
                    {/* Cover Book */}
                    <Controller
                        name="posterBanner"
                        control={control}
                        rules={{ required: "Cover book wajib diunggah" }}
                        render={({ field, fieldState }) => (
                            <InputImageBanner
                                type="cover"
                                label="Sampul Seri Utama (Cover Art)"
                                description="Gunakan rasio 1:1.6 (1600x2560 px), format JPG/PNG, maks 500KB. Cover harus menarik secara visual, memuat judul dengan jelas, dan memancing klik (High CTR) di hasil pencarian dan rak buku digital."
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