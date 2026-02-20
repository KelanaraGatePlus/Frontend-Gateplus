"use client";
import React, { useRef, useState } from "react";
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
import RichTextEditor from '@/components/RichTextEditor/page';
import InputSelect from "@/components/UploadForm/InputSelect";
import InputFileDoc from "@/components/UploadForm/InputFileDoc"
import InputImageBanner from "@/components/UploadForm/InputImageBanner";
import PriceSelector from "@/components/UploadForm/PriceSelector";
import ButtonSubmit from '@/components/UploadForm/ButtonSubmit';
import TermsCheckbox from '@/components/UploadForm/TermsCheckbox';
import LoadingOverlay from "@/components/LoadingOverlay/page";
import ContentExplicitModal from "@/components/Modal/ContentExplicitModal";

/* Assets */
import IconsGalery from "@@/icons/logo-upload-banner.svg";
import IconsButtonSubmit from "@@/IconsButton/buttonSubmit.svg";

export default function UploadEbookEpisodeForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const seriesFromUrl = searchParams.get("series") || "";
    const fromEducation = searchParams.get("education") || null;
    const creatorId = useGetCreatorId();
    const userId = useGetUserId();
    const episodeCoverInputRef = useRef(null);
    const bannerStartInputRef = useRef(null);
    const bannerEndInputRef = useRef(null);
    const inputFileInputRef = useRef(null);
    const audioUrlInputRef = useRef(null);
    const [isExplicitModalOpen, setIsExplicitModalOpen] = useState(false);
    const [explicitImageName, setExplicitImageName] = useState("");
    const [explicitField, setExplicitField] = useState("");

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        getValues,
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
            audioUrl: [],
        },
    });

    const [createEpisode, { isLoading, error }] = useCreateEpisodeMutation();
    const skip = !creatorId;
    const creatorDetailQuery = useGetCreatorDetailQuery({ id: creatorId, userId }, { skip });

    const findExplicitField = (fileName) => {
        if (!fileName) return "";
        const { episodeCover, bannerStart, bannerEnd, inputFile, audioUrl } = getValues();
        const candidates = [
            { name: "episodeCover", files: episodeCover },
            { name: "bannerStart", files: bannerStart },
            { name: "bannerEnd", files: bannerEnd },
            { name: "inputFile", files: inputFile },
            { name: "audioUrl", files: audioUrl },
        ];
        const match = candidates.find((item) =>
            Array.isArray(item.files)
            && item.files[0]
            && typeof item.files[0] !== "string"
            && item.files[0].name === fileName
        );
        return match?.name || "";
    };

    const handleRetryExplicitUpload = () => {
        setIsExplicitModalOpen(false);
        if (explicitField === "episodeCover") {
            episodeCoverInputRef.current?.click();
            return;
        }
        if (explicitField === "bannerStart") {
            bannerStartInputRef.current?.click();
            return;
        }
        if (explicitField === "bannerEnd") {
            bannerEndInputRef.current?.click();
            return;
        }
        if (explicitField === "inputFile") {
            inputFileInputRef.current?.click();
            return;
        }
        if (explicitField === "audioUrl") {
            audioUrlInputRef.current?.click();
        }
    };

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
        formData.append("audioUrl", data.audioUrl[0] ? data.audioUrl[0] : null);

        try {
            await createEpisode(formData).unwrap();
            if (fromEducation) {
                router.push(`/education/detail/${fromEducation}`);
                return;
            }
            router.push(`/ebooks/detail/${data.ebookId}`);
        } catch (err) {
            if (err.status == 403) {
                const fileName = err.data?.fileName || "Gambar";
                setExplicitField(findExplicitField(fileName));
                setIsExplicitModalOpen(true);
                setExplicitImageName(fileName);
                return;
            }
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
                    label="Judul Bab/Episode"
                    name="title"
                    placeholder="Contoh: Bab 1: Perjumpaan di Kota Tua"
                    {...register("title")}
                    error={errors.title?.message}
                />

                {/* Deskripsi - CHANGED TO RICH TEXT EDITOR */}
                <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState }) => (
                        <RichTextEditor
                            label="Deskripsi"
                            name="description"
                            placeholder="Deskripsi episode"
                            value={field.value}
                            onChange={field.onChange}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                {/* Cover Episode */}
                <Controller
                    name="episodeCover"
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputImageBanner
                            type="thumbnail"
                            label="Cover Episode"
                            description="Rasio: 1:1, Format: JPG/PNG, Ukuran Maksimal: 500 KB. Unggah sampul khusus untuk bab ini."
                            name="episodeCover"
                            icon={IconsGalery}
                            inputRef={episodeCoverInputRef}
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
                            description="maks upload per content 5mb, please make part while uploading and naming ascending number"
                            name="bannerStart"
                            icon={IconsGalery}
                            inputRef={bannerStartInputRef}
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
                            label="Unggah File Naskah (.docx)"
                            description="Pastikan file Anda berformat Microsoft Word (.docx). Klik untuk unggah."
                            accept=".doc,.docx"
                            inputRef={inputFileInputRef}
                            files={field.value}
                            onUpload={(e) => field.onChange([...e.target.files])}
                            onRemove={() => field.onChange([])}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                {/* Input audio opsional */}
                <Controller
                    name="audioUrl"
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputFileDoc
                            name="audioUrl"
                            label="File Audio (Opsional)"
                            description="Pilih file audio (MP3/WAV, maks. 3MB) untuk backsound atau audio Transkrip episode ini."
                            accept=".mp3,.wav"
                            inputRef={audioUrlInputRef}
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
                            inputRef={bannerEndInputRef}
                            files={field.value}
                            onUpload={(e) => field.onChange([...e.target.files])}
                            onRemove={() => field.onChange([])}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                {/* Catatan Episode */}
                <Controller
                    name="notedEpisode"
                    control={control}
                    render={({ field, fieldState }) => (
                        <RichTextEditor
                            label="Catatan Kreator"
                            name="notedEpisode"
                            placeholder="Tulis catatan kreator"
                            value={field.value}
                            onChange={field.onChange}
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
                            label="Harga Jual"
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
            {isExplicitModalOpen && (
                <ContentExplicitModal
                    imageName={explicitImageName}
                    onClose={() => setIsExplicitModalOpen(false)}
                    onRetry={handleRetryExplicitUpload}
                />
            )}
        </>
    );
}