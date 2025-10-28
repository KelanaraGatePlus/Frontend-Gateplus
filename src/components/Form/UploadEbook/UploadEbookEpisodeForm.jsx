"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

/* Third-Party */
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/* Schemas */
import { createEbookEpisodeSchema } from "@/lib/schemas/createEbookEpisodeSchema";

/* API Hooks */
import { useGetCreatorDetailQuery } from "@/hooks/api/creatorSliceAPI";
import { useCreateEpisodeMutation } from "@/hooks/api/ebookSliceAPI";
import { useGetCreatorId } from "@/lib/features/useGetCreatorId";
import { useGetUserId } from "@/lib/features/useGetUserId";

/* Constants & Components */
import { priceOption } from "@/lib/constants/priceOptions";
import InputText from "@/components/UploadForm/InputText";
import InputTextArea from "@/components/UploadForm/InputTextArea";
import InputSelect from "@/components/UploadForm/InputSelect";
import InputFileDoc from "@/components/UploadForm/InputFileDoc"
import InputImageBanner from "@/components/UploadForm/InputImageBanner";
import PriceSelector from "@/components/UploadForm/PriceSelector";
import ButtonSubmit from '@/components/UploadForm/ButtonSubmit';
import TermsCheckbox from '@/components/UploadForm/TermsCheckbox';
import LoadingOverlay from "@/components/LoadingOverlay/page";

/* Assets */
import IconsGalery from "@@/icons/logo-upload-banner.svg";
import IconsButtonSubmit from "@@/IconsButton/buttonSubmit.svg";

export default function UploadEbookEpisodeForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const seriesFromUrl = searchParams.get("series") || "";
    const creatorId = useGetCreatorId();
    const userId = useGetUserId();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createEbookEpisodeSchema),
        mode: "onChange",
        defaultValues: {
            ebookId: seriesFromUrl,
            title: "",
            description: "",
            price: "",
            notedEpisode: "",
            episodeCover: [],
            bannerStart: [],
            bannerEnd: [],
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
        formData.append("ebookId", data.ebookId);
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("notedEpisode", data.notedEpisode);
        formData.append("coverEpisodeUrl", data.episodeCover[0]);
        formData.append("bannerStartEpisodeUrl", data.bannerStart[0]);
        formData.append("bannerEndEpisodeUrl", data.bannerEnd[0]);
        formData.append("ebookUrl", data.inputFile[0]);

        try {
            await createEpisode(formData).unwrap();
            router.push(`/ebooks/detail/${data.ebookId}`);
        } catch (err) {
            console.error("Error creating episode of ebook:", err);
        }
    };

    return (
        <>
            <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
                {/* Series Select */}
                <Controller
                    name="ebookId"
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputSelect
                            label="Judul Series"
                            name="series"
                            options={creatorDetailQuery.data?.data?.data?.Ebooks || []}
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
                    label="Judul Episode"
                    name="title"
                    placeholder="Masukkan judul episode"
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

                {/* Cover Episode */}
                <Controller
                    name="episodeCover"
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputImageBanner
                            type="cover"
                            label="Cover Episode"
                            description="Format banner its 1x1 with maks 500kb."
                            name="episodeCover"
                            icon={IconsGalery}
                            files={field.value}
                            onUpload={(e) => field.onChange([...e.target.files])}
                            onRemove={() => field.onChange([])}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                {/* Banner Start */}
                <Controller
                    name="bannerStart"
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputImageBanner
                            type="banner"
                            label="Banner Cover Episode Start"
                            description="maks upload per content 5gb, please make part while uploading and naming ascending number"
                            name="bannerStart"
                            icon={IconsGalery}
                            files={field.value}
                            onUpload={(e) => field.onChange([...e.target.files])}
                            onRemove={() => field.onChange([])}
                            error={fieldState.error?.message}
                        />
                    )}
                />
                {/* Input File */}
                <Controller
                    name="inputFile"
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputFileDoc
                            name="inputFile"
                            label="Upload File"
                            description="Format input .docx"
                            accept=".doc,.docx"
                            files={field.value}
                            onUpload={(e) => field.onChange([...e.target.files])}
                            onRemove={() => field.onChange([])}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                {/* Banner End */}
                <Controller
                    name="bannerEnd"
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputImageBanner
                            type="banner"
                            label="Banner Cover Episode End"
                            description="maks upload per content 5gb, please make part while uploading and naming ascending number"
                            name="bannerEnd"
                            icon={IconsGalery}
                            files={field.value}
                            onUpload={(e) => field.onChange([...e.target.files])}
                            onRemove={() => field.onChange([])}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                {/* Catatan Episode */}
                <InputTextArea
                    label="Catatan Kreator"
                    name="notedEpisode"
                    placeholder="Tulis catatan kreator"
                    {...register("notedEpisode")}
                    error={errors.notedEpisode?.message}
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
