"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createComicEpisodeSchema } from "@/lib/schemas/createComicEpisodeSchema";
import { useGetCreatorDetailQuery } from "@/hooks/api/creatorSliceAPI";
import { useCreateEpisodeMutation } from "@/hooks/api/comicSliceAPI";
import { useGetCreatorId } from "@/lib/features/useGetCreatorId";
import { useGetUserId } from "@/lib/features/useGetUserId";

import { priceOption } from "@/lib/constants/priceOptions";
import InputText from "@/components/UploadForm/InputText";
import InputTextArea from "@/components/UploadForm/InputTextArea";
import InputSelect from "@/components/UploadForm/InputSelect";
import InputComicPic from "@/components/UploadForm/InputComicPic";
import InputImageBanner from "@/components/UploadForm/InputImageBanner";
import PriceSelector from "@/components/UploadForm/PriceSelector";
import ButtonSubmit from "@/components/UploadForm/ButtonSubmit";
import TermsCheckbox from "@/components/UploadForm/TermsCheckbox";
import LoadingOverlay from "@/components/LoadingOverlay/page";

import IconsGalery from "@@/icons/logo-upload-banner.svg";
import IconsButtonSubmit from "@@/IconsButton/buttonSubmit.svg";
import RichTextEditor from '@/components/RichTextEditor/page';

export default function UploadComicEpisodeForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const seriesFromUrl = searchParams.get("series") || "";
    const creatorId = useGetCreatorId();
    const userId = useGetUserId();
    const fromEducation = searchParams.get("education") || null;

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createComicEpisodeSchema),
        mode: "onChange",
        defaultValues: {
            comicId: seriesFromUrl,
            title: "",
            description: "",
            price: "",
            notedEpisode: "",
            episodeCover: [],
            inputFile: [],
            termAccepted: false,
            agreementAccepted: false,
        },
    });

    const [createEpisode, { isLoading, error }] = useCreateEpisodeMutation();
    const skip = !creatorId;
    const creatorDetailQuery = useGetCreatorDetailQuery({ id: creatorId, userId }, { skip });

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("comicsId", data.comicId);
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("notedEpisode", data.notedEpisode);
        formData.append("coverImageUrl", data.episodeCover[0]);

        data.inputFile.forEach((file) => {
            formData.append("fileImageComics", file);
        });

        try {
            await createEpisode(formData).unwrap();
            if (fromEducation) {
                router.push(`/education/detail/${fromEducation}`);
                return;
            }
            router.push(`/comics/detail/${data.comicId}`);
        } catch (err) {
            console.error("Error creating episode of comic:", err);
        }
    };

    return (
        <>
            <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="comicId"
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputSelect
                            label="Bagian dari Serial Komik Induk"
                            name="series"
                            options={creatorDetailQuery.data?.data?.data?.Comics || []}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            error={fieldState.error?.message}
                            placeholder="Pilih Judul Series"
                        />
                    )}
                />

                <InputText
                    label="Judul Chapter / Episode (Nomor & Sub-Judul)"
                    name="title"
                    placeholder='Tulis judul chapter yang spesifik. Gabungkan nomor dan kata kunci plot utama (Contoh: "Chapter 45: Pertarungan di Menara Iblis")'
                    {...register("title")}
                    error={errors.title?.message}
                />

                <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState }) => (
                        <RichTextEditor
                            label="Sinopsis & Detail Chapter Lengkap"
                            name="description"
                            placeholder="Jelaskan plot spesifik chapter ini, kejadian penting, dan karakter yang terlibat. Jangan gunakan sinopsis umum seri. Mesin pencari membaca teks ini."
                            value={field.value}
                            onChange={field.onChange}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                <Controller
                    name="episodeCover"
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputImageBanner
                            type="thumbnail"
                            label="Thumbnail Chapter (Still Image)"
                            description="Gunakan rasio 1:1 atau sesuai standar platform, format JPG/PNG, maks 500KB. Pilih satu panel paling menarik atau representatif dari chapter ini untuk memancing klik (High CTR)."
                            name="episodeCover"
                            icon={IconsGalery}
                            files={field.value}
                            onUpload={(e) => field.onChange([...e.target.files])}
                            onRemove={() => field.onChange([])}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                <Controller
                    name="inputFile"
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputComicPic
                            uploadedFiles={{ inputFile: field.value }}
                            description="Unggah semua halaman chapter (JPG/PNG). Setelah upload, geser/drag gambar untuk mengatur urutan halaman."
                            label="File Gambar Chapter Komik (Halaman Lengkap)"
                            handleFileUpload={(e) => field.onChange([...field.value, ...e.target.files].sort((a, b) => a.name.localeCompare(b.name)))}
                            handleRemoveFile={(_, index) => {
                                const updated = [...field.value];
                                updated.splice(index, 1);
                                field.onChange(updated);
                            }}
                            onReorder={(reorderedFiles) => field.onChange(reorderedFiles)}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                <InputTextArea
                    label="Catatan Kreator"
                    name="notedEpisode"
                    placeholder="Tulis catatan kreator"
                    {...register("notedEpisode")}
                    error={errors.notedEpisode?.message}
                />

                <Controller
                    name="price"
                    control={control}
                    render={({ field, fieldState }) => (
                        <PriceSelector
                            label="Harga Karya"
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

                <ButtonSubmit type="submit" icon={IconsButtonSubmit} label="Buat Epsiode" isLoading={isLoading} />
                {error && (
                    <p className="text-red-500 mt-2 text-sm">Gagal upload: {error.data?.message}</p>
                )}
            </form>
            {isLoading && <LoadingOverlay message="Uploading..." />}
        </>
    );
}
