"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RichTextEditor from '@/components/RichTextEditor/page';

/* Third-Party */
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/* Schemas */
import { createSeriesEpisodeSchema } from "@/lib/schemas/createSeriesEpisodeSchema";

/* API Hooks */
import { useGetCreatorDetailQuery } from "@/hooks/api/creatorSliceAPI";
import { useGetCreatorId } from "@/lib/features/useGetCreatorId";
import { useGetUserId } from "@/lib/features/useGetUserId";
import { useCreateEpisodeSeriesMutation } from "@/hooks/api/seriesSliceAPI";

/* Constants & Components */
import { priceOption } from "@/lib/constants/priceOptions";
import InputText from "@/components/UploadForm/InputText";
import InputSelect from "@/components/UploadForm/InputSelect";
import InputImageBanner from "@/components/UploadForm/InputImageBanner";
import PriceSelector from "@/components/UploadForm/PriceSelector";
import ButtonSubmit from '@/components/UploadForm/ButtonSubmit';
import TermsCheckbox from '@/components/UploadForm/TermsCheckbox';
import LoadingOverlay from "@/components/LoadingOverlay/page";

/* Assets */
import IconsGalery from "@@/icons/logo-upload-banner.svg";
import IconsButtonSubmit from "@@/IconsButton/buttonSubmit.svg";
import UploadLargeFile from "@/components/UploadForm/UploadLargeFile";


export default function UploadSeriesEpisodeForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const seriesFromUrl = searchParams.get("series") || "";
    const fromEducation = searchParams.get("education") || null;
    const creatorId = useGetCreatorId();
    const userId = useGetUserId();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createSeriesEpisodeSchema),
        mode: "onChange",
        defaultValues: {
            seriesId: seriesFromUrl,
            title: "",
            description: "",
            price: "",
            coverEpisode: [],
            episodeFileUrl: '',
            termAccepted: false,
            agreementAccepted: false,
        },
    });

    const [createEpisodeSeries, { isLoading, error }] = useCreateEpisodeSeriesMutation();
    const skip = !creatorId;
    const creatorDetailQuery = useGetCreatorDetailQuery({ id: creatorId, userId }, { skip });

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("seriesId", data.seriesId);
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("coverEpisode", data.coverEpisode[0]);
        formData.append("episodeFileUrl", data.episodeFileUrl);
        formData.append("termAccepted", data.termAccepted);
        formData.append("agreementAccepted", data.agreementAccepted);

        try {
            await createEpisodeSeries(formData).unwrap();
            if(fromEducation) {
                router.push(`/education/detail/${fromEducation}`);
                return;
            }
            router.push(`/series/detail/${data.seriesId}`);
        } catch (err) {
            console.error("Error creating episode of series:", err);
        }
    };

    return (
        <>
            <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
                {/* Series Select */}
                <Controller
                    name="seriesId"
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputSelect
                            label="Judul Utama Seri Film (Main Series Title)"
                            name="series"
                            options={creatorDetailQuery.data?.data?.data?.series || []}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={fieldState.error?.message}
                            placeholder="Pilih Judul Series"
                        />
                    )}
                />

                {/* Judul Episode */}
                <InputText
                    label="Judul Episode (Sub-Judul & Nomor)"
                    name="title"
                    placeholder='Tulis judul episode yang spesifik, menarik, dan mengandung kata kunci plot utama (Contoh: "Ep 5: Pertempuran di Benteng Kegelapan")'
                    {...register("title")}
                    error={errors.title?.message}
                />

{/* Deskripsi */}
<Controller
    name="description"
    control={control}
    render={({ field, fieldState }) => (
        <RichTextEditor
            label="Sinopsis & Detail Episode Lengkap"
            name="description"
            placeholder="Jelaskan plot spesifik episode ini, konflik yang terjadi, dan karakter yang terlibat. Jangan gunakan sinopsis umum seri. Mesin pencari membaca teks ini."
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
        />
    )}
/>

                {/* Cover Episode */}
                <Controller
                    name="coverEpisode"
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputImageBanner
                            type="thumbnail"
                            label="Thumbnail Episode (Still Image)"
                            description="Gunakan rasio 16:9 (landscape), format JPG/PNG, maks 500KB. Pilih satu frame adegan paling dramatis dari episode ini untuk memancing klik (High CTR)."
                            name="coverEpisode"
                            icon={IconsGalery}
                            files={field.value}
                            onUpload={(e) => field.onChange([...e.target.files])}
                            onRemove={() => field.onChange([])}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                <Controller
                    name="episodeFileUrl"
                    control={control}
                    rules={{ required: "File episode wajib diunggah" }}
                    render={({ field, fieldState }) => (
                        <div>
                            <UploadLargeFile
                                prefix="series/episode"
                                setDataUrl={field.onChange}
                                name={'episodeFileUrl'}
                                label="File Master Video Episode"
                                description="Gunakan rasio 16:9 (1920x1080 px), format MP4/MOV disarankan. Pastikan kualitas visual dan audio adalah yang terbaik."
                            />
                            <input type="hidden" {...field} value={field.value || ""} />
                            {fieldState.error?.message && (
                                <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                            )}
                        </div>
                    )}
                />

                {/* Harga */}
                <Controller
                    name="price"
                    control={control}
                    render={({ field, fieldState }) => (
                        <PriceSelector
                            label="Harga Akses Episode (Monetisasi)"
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
                        label="Saya menyetujui"
                        linkHref="/term-and-conditions"
                        linkText="Syarat & Ketentuan"
                    />
                    <TermsCheckbox
                        name="agreementAccepted"
                        control={control}
                        label="Saya menyetujui"
                        linkHref="/agreement"
                        linkText="Agreement"
                    />
                </section>

                {/* Submit Button */}
                <ButtonSubmit type="submit" icon={IconsButtonSubmit} label="Buat Epsiode" isLoading={isLoading} />
                {error && (
                    <p className="text-red-500 mt-2 text-sm">Gagal upload: {error.data?.message}</p>
                )}
            </form>
            {isLoading && <LoadingOverlay message="Uploading..." />}
        </>
    );
}
