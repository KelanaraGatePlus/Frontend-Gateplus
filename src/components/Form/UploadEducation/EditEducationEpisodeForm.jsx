"use client";
import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';

/*[--- THIRD PARTY LIBRARIES ---]*/
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/*[--- UI COMPONENTS ---]*/
import InputText from '@/components/UploadForm/InputText';
import InputTextArea from '@/components/UploadForm/InputTextArea';
import LoadingOverlay from "@/components/LoadingOverlay/page";

/*[--- ASSETS PUBLIC ---]*/
import UploadLargeFile from "@/components/UploadForm/UploadLargeFile";
import InputFileDoc from "@/components/UploadForm/InputFileDoc";
import { editEducationEpisodeSchema } from "@/lib/schemas/editEducationEpisodeSchema";
import { useGetEducationEpisodeByIdQuery, useUpdateEducationEpisodeByIdMutation } from "@/hooks/api/educationEpisodeSliceAPI";
import { Icon } from "@iconify/react";

const getFileName = (url) => {
    if (!url) return null;
    if (typeof url === 'string') {
        return url.split('/').pop() || 'File';
    }
    return url.name || 'File';
};

export default function EditEducationEpisodeForm({ episodeId, onClose }) {
    const {data: episodeData} = useGetEducationEpisodeByIdQuery(episodeId);
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: zodResolver(editEducationEpisodeSchema),
        mode: "onChange",
        defaultValues: {
            title: "",
            description: "",
            episodeFileUrl: "",
            editModuleUrl: null,
            editHomeWorkUrl: null,
            duration: 0,
        },
    });

    // Separate state for tracking existing files (not part of form schema)
    const [existingModuleUrl, setExistingModuleUrl] = useState(null);
    const [existingHomeWorkUrl, setExistingHomeWorkUrl] = useState(null);

    const [updateEducationEpisode, { isLoading, error }] = useUpdateEducationEpisodeByIdMutation();

    useEffect(() => {
        if (episodeData?.data) {
            const episode = episodeData.data;
            
            setValue("title", episode.title || "");
            setValue("description", episode.description || "");
            setValue("episodeFileUrl", episode.episodeFileUrl || "");
            setValue("moduleUrl", null);
            setValue("homeWorkUrl", null);
            setValue("duration", episode.duration || 0);
            
            // Store existing URLs separately
            setExistingModuleUrl(episode.moduleUrl || null);
            setExistingHomeWorkUrl(episode.homeWorkUrl || null);
        }
    }, [episodeData, setValue]);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("duration", data.duration);

            // Handle episodeFileUrl - send only if it's a new File, not if it's existing URL string
            if (data.episodeFileUrl instanceof File) {
                formData.append("episodeFileUrl", data.episodeFileUrl);
            }

            // Handle moduleUrl - send file if it's a File, or null if user deleted it
            if (data.editModuleUrl instanceof File) {
                formData.append("moduleUrl", data.editModuleUrl);
            } else if (data.editModuleUrl === null && existingModuleUrl) {
                // User deleted the existing file
                formData.append("moduleUrl", null);
            }

            // Handle homeWorkUrl - send file if it's a File, or null if user deleted it
            if (data.editHomeWorkUrl instanceof File) {
                formData.append("homeWorkUrl", data.editHomeWorkUrl);
            } else if (data.editHomeWorkUrl === null && existingHomeWorkUrl) {
                // User deleted the existing file
                formData.append("homeWorkUrl", null);
            }

            try {
                const result = await updateEducationEpisode({ id: episodeId, formData }).unwrap();
                if (result) {
                    onClose();
                    window.location.reload();
                }
            } catch (err) {
                console.error("Error updating episode:", err);
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
            <form onSubmit={handleSubmit(onSubmit, onErrors)} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 bg-[#393939] rounded-2xl p-6 border-[#686868] border">
                    {/* Judul */}
                    <InputText
                        label="Judul Episode"
                        name="title"
                        placeholder="Masukkan judul episode"
                        {...register("title")}
                        error={errors.title?.message}
                    />

                    {/* Deskripsi */}
                    <InputTextArea
                        label="Deskripsi Episode"
                        name="description"
                        placeholder="Jelaskan konten episode ini"
                        {...register("description")}
                        error={errors.description?.message}
                    />

                    {/* Episode Video File */}
                    <Controller
                        name="episodeFileUrl"
                        control={control}
                        rules={{
                            validate: (value) => {
                                if (value) return true;
                                return "File episode kelas wajib diunggah";
                            }
                        }}
                        render={({ field, fieldState }) => (
                            <div>
                                <UploadLargeFile
                                    prefix="education/episodes"
                                    setDataUrl={field.onChange}
                                    setDuration={(durationValue) => {
                                        setValue('duration', durationValue, { shouldValidate: true });
                                    }}
                                    name={'episodeFileUrl'}
                                    label="Video Materi Kelas"
                                    description="Gunakan rasio 16:9, format MP4/MOV, maks 500KB."
                                />
                                <input type="hidden" {...field} value={field.value || ""} />
                                {fieldState.error?.message && (
                                    <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                                )}
                            </div>
                        )}
                    />

                    {/* Module File */}
                    <Controller
                        name="editModuleUrl"
                        control={control}
                        render={({ field, fieldState }) => (
                            <div>
                                {/* Display existing file */}
                                {existingModuleUrl && !field.value && (
                                    <div className="mb-4 p-3 bg-[#2a2a2a] rounded-lg border border-[#686868]">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Icon icon="material-symbols:description" width={24} height={24} className="text-blue-500" />
                                                <div>
                                                    <p className="text-sm text-white font-medium">{getFileName(existingModuleUrl)}</p>
                                                    <p className="text-xs text-gray-400">File yang ada</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setExistingModuleUrl(null);
                                                    field.onChange(null);
                                                }}
                                                className="text-red-500 hover:text-red-700 text-sm"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Always show InputFileDoc */}
                                <InputFileDoc
                                    name="editModuleUrl"
                                    label={existingModuleUrl && !field.value ? "Ganti File Modul" : "Unggah File Modul Pendukung Kelas"}
                                    description="Pastikan file Anda berformat Microsoft Word (.docx) atau PDF. Klik untuk unggah."
                                    accept=".doc,.docx,.pdf"
                                    files={field.value instanceof File ? [field.value] : []}
                                    onUpload={(e) => {
                                        const file = e.target.files?.[0] ?? null;
                                        field.onChange(file);
                                    }}
                                    onRemove={() => field.onChange(null)}
                                    error={fieldState.error?.message}
                                />
                            </div>
                        )}
                    />

                    {/* Homework File */}
                    <Controller
                        name="editHomeWorkUrl"
                        control={control}
                        render={({ field, fieldState }) => (
                            <div>
                                {/* Display existing file */}
                                {existingHomeWorkUrl && !field.value && (
                                    <div className="mb-4 p-3 bg-[#2a2a2a] rounded-lg border border-[#686868]">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Icon icon="material-symbols:description" width={24} height={24} className="text-blue-500" />
                                                <div>
                                                    <p className="text-sm text-white font-medium">{getFileName(existingHomeWorkUrl)}</p>
                                                    <p className="text-xs text-gray-400">File yang ada</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setExistingHomeWorkUrl(null);
                                                    field.onChange(null);
                                                }}
                                                className="text-red-500 hover:text-red-700 text-sm"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Always show InputFileDoc */}
                                <InputFileDoc
                                    name="editHomeWorkUrl"
                                    label={existingHomeWorkUrl && !field.value ? "Ganti File Tugas" : "Unggah File Tugas Kelas"}
                                    description="Pastikan file Anda berformat Microsoft Word (.docx) atau PDF. Klik untuk unggah."
                                    accept=".doc,.docx,.pdf"
                                    files={field.value instanceof File ? [field.value] : []}
                                    onUpload={(e) => {
                                        const file = e.target.files?.[0] ?? null;
                                        field.onChange(file);
                                    }}
                                    onRemove={() => field.onChange(null)}
                                    error={fieldState.error?.message}
                                />
                            </div>
                        )}
                    />
                </div>

                <div className="w-full flex flex-row justify-between">
                    <button onClick={onClose} className="flex flex-row items-center gap-2 px-4 py-2 rounded-md border border-[#686868] bg-[#393939] text-white font-medium montserratFont ">
                        <Icon icon={'solar:close-circle-linear'} width={32} height={32} />
                        <span>Cancel</span>
                    </button>
                    <button type="submit" className="flex flex-row items-center gap-2 px-4 py-2 rounded-md border border-[#156EB7] bg-[#184A97] text-white font-medium montserratFont ">
                        <Icon icon={'solar:diskette-bold'} width={32} height={32} />
                        <span>Save Update</span>
                    </button>
                </div>

                {error && <p className="text-red-500 text-sm">Gagal update: {error.data?.message || "Terjadi kesalahan"}</p>}
            </form>
            {isLoading && (
                <LoadingOverlay message="Tunggu Sebentar... <br/> Sedang mengupdate episode" />
            )}
        </>
    )
}

EditEducationEpisodeForm.propTypes = {
    episodeId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
};
