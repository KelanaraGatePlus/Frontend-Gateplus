"use client";
import React, { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/* Third-Party */
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "use-debounce";

/* Schemas */
import { createPodcastEpisodeSchema } from "@/lib/schemas/createPodcastEpisodeSchema";

/* API Hooks */
import { useSearchCreatorQuery } from "@/hooks/api/creatorSliceAPI";
import { useGetCreatorDetailQuery } from "@/hooks/api/creatorSliceAPI";
import { useCreateEpisodeMutation } from "@/hooks/api/podcastSliceAPI";
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
import InputCreatorCollab from '@/components/UploadForm/InputCreatorCollab';
import RichTextEditor from '@/components/RichTextEditor/page';
import ContentExplicitModal from "@/components/Modal/ContentExplicitModal";
import useExplicitContentHandler from "@/hooks/helper/useExplicitContentHandler";

/* Assets */
import IconsGalery from "@@/icons/logo-upload-banner.svg";
import IconsButtonSubmit from "@@/IconsButton/buttonSubmit.svg";

export default function UploadPodcastEpisodeForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const seriesFromUrl = searchParams.get("series") || "";
    const fromEducation = searchParams.get("education") || null;
    const creatorId = useGetCreatorId();
    const userId = useGetUserId();
    const [query, setQuery] = useState("");
    const coverEpisodeInputRef = useRef(null);
    const podcastFileInputRef = useRef(null);
    const [debouncedQuery] = useDebounce(query, 500);
    const { data: creators, isLoading: isLoadingCreator, isError: isErrorCreator } = useSearchCreatorQuery(debouncedQuery, {
        skip: !debouncedQuery,
    });
    const [selectedCreators, setSelectedCreators] = useState([]);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        getValues,
    } = useForm({
        resolver: zodResolver(createPodcastEpisodeSchema),
        mode: "onChange",
        defaultValues: {
            podcastId: seriesFromUrl,
            title: "",
            description: "",
            price: "",
            notedEpisode: "",
            coverPodcastEpisodeURL: [],
            podcastFileURL: [],
            creatorsCollaborationId: [],
            termAccepted: false,
            agreementAccepted: false,
        },
    });

    const [createEpisode, { isLoading, error }] = useCreateEpisodeMutation();
    const skip = !creatorId;
    const creatorDetailQuery = useGetCreatorDetailQuery({ id: creatorId, userId }, { skip });
    const {
        isExplicitModalOpen,
        explicitImageName,
        handleExplicitError,
        handleRetryExplicitUpload,
        closeExplicitModal,
    } = useExplicitContentHandler({
        getValues,
        fieldInputRefs: {
            coverPodcastEpisodeURL: coverEpisodeInputRef,
            podcastFileURL: podcastFileInputRef,
        },
    });

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("podcastId", data.podcastId);
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("notedPodcast", data.notedPodcast);
        formData.append("creatorsCollaborationId", JSON.stringify(selectedCreators.map(c => c.id)));
        formData.append("coverPodcastEpisodeURL", data.coverPodcastEpisodeURL[0]);
        formData.append("podcastFileURL", data.podcastFileURL[0]);

        try {
            await createEpisode(formData).unwrap();
            if (fromEducation) {
                router.push(`/education/detail/${fromEducation}`);
                return;
            }
            router.push(`/podcasts/detail/${data.podcastId}`);
        } catch (err) {
            if (handleExplicitError(err)) {
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
                    name="podcastId"
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputSelect
                            label="Judul Seri Podcast"
                            name="series"
                            options={creatorDetailQuery.data?.data?.data?.Podcast || []}
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
                    label="Judul Episode (Topik Utama)"
                    name="title"
                    placeholder='Tulis judul yang memikat dan mengandung kata kunci topik pembahasan (Contoh: "Strategi Marketing 2024 - Ep. 5")'
                    {...register("title")}
                    error={errors.title?.message}
                />

                {/* Deskripsi */}
                <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState }) => (
                        <RichTextEditor
                            label="Show Notes (Deskripsi Lengkap Episode)"
                            name="description"
                            placeholder="Tulis ringkasan padat, poin-poin pembahasan (timestamps), nama narasumber/tamu, dan tautan relevan."
                            value={field.value}
                            onChange={field.onChange}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                {/* Cover Episode */}
                <Controller
                    name="coverPodcastEpisodeURL"
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputImageBanner
                            type="thumbnail"
                            label="Sampul Episode (Cover Art)"
                            description="Rasio: 1:1, JPG/PNG, Ukuran Maksimal: 500 KB"
                            name="coverPodcastEpisodeURL"
                            icon={IconsGalery}
                            inputRef={coverEpisodeInputRef}
                            files={field.value}
                            onUpload={(e) => field.onChange([...e.target.files])}
                            onRemove={() => field.onChange([])}
                            error={fieldState.error?.message}
                        />
                    )}
                />
                {/* Input File */}
                <Controller
                    name="podcastFileURL"
                    control={control}
                    render={({ field, fieldState }) => (
                        <InputFileDoc
                            name="podcastFileURL"
                            label="File Audio Podcast Utama"
                            description="Unggah file rekaman akhir (MP3 disarankan) dengan kualitas audio terbaik agar nyaman didengar."
                            accept=".mp3"
                            inputRef={podcastFileInputRef}
                            files={field.value}
                            onUpload={(e) => field.onChange([...e.target.files])}
                            onRemove={() => field.onChange([])}
                            error={fieldState.error?.message}
                        />
                    )}
                />
                {/* Kreator Kolaborasi */}
                <InputCreatorCollab
                    query={query}
                    setQuery={setQuery}
                    selectedCreators={selectedCreators}
                    setSelectedCreators={setSelectedCreators}
                    creators={creators}
                    isLoadingCreator={isLoadingCreator}
                    isErrorCreator={isErrorCreator}
                />

                {/* Catatan Episode */}
                <InputTextArea
                    label="Catatan Kreator"
                    name="notedPodcast"
                    placeholder="Tulis catatan kreator"
                    {...register("notedPodcast")}
                    error={errors.notedPodcast?.message}
                />

                {/* Harga */}
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
                    onClose={closeExplicitModal}
                    onRetry={handleRetryExplicitUpload}
                />
            )}
        </>
    );
}
