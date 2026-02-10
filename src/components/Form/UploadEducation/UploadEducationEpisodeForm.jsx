"use client";
import React, { useEffect } from "react";
import PropTypes from 'prop-types';
import { useRouter } from "next/navigation";

/*[--- THIRD PARTY LIBRARIES ---]*/
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/*[--- UI COMPONENTS ---]*/
import ButtonSubmit from '@/components/UploadForm/ButtonSubmit';
import InputText from '@/components/UploadForm/InputText';
import InputTextArea from '@/components/UploadForm/InputTextArea';
import LoadingOverlay from "@/components/LoadingOverlay/page";
import RichTextEditor from '@/components/RichTextEditor/page';

/*[--- ASSETS PUBLIC ---]*/
import IconsButtonSubmit from "@@/IconsButton/buttonSubmit.svg";
import UploadLargeFile from "@/components/UploadForm/UploadLargeFile";
import InputFileDoc from "@/components/UploadForm/InputFileDoc";
import { createEducationEpisodeSchema } from "@/lib/schemas/createEducationEpisodeSchema";
import { useCreateNewEducationEpisodeMutation } from "@/hooks/api/educationEpisodeSliceAPI";

export default function UploadEducationEpisodeForm({ educationId }) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
        setValue,
        reset,
    } = useForm({
        resolver: zodResolver(createEducationEpisodeSchema),
        mode: "onChange",
        defaultValues: {
            title: "",
            educationId: educationId || "",
            description: "",
            episodeFileUrl: "",
            moduleUrl: null,
            homeWorkUrl: null,
            hasQuiz: false,
            duration: 0,
            quizData: {
                title: "",
                description: "",
                duration: 10,
                passingScore: 70,
                questions: [],
            },
        },
    });

    const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
        control,
        name: "quizData.questions"
    });

    const [createEducationEpisode, { isLoading, error }] = useCreateNewEducationEpisodeMutation();
    const watchHasQuiz = watch("hasQuiz");

    // Reset quizData when hasQuiz is unchecked
    useEffect(() => {
        if (!watchHasQuiz) {
            control._formValues.quizData = null;
        }
    }, [watchHasQuiz, control]);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("educationId", data.educationId);
            formData.append("description", data.description);
            formData.append("episodeFileUrl", data.episodeFileUrl);
            formData.append("duration", data.duration);

            // Append quizData: jika hasQuiz true, append data, jika false append null
            if (data.hasQuiz && data.quizData) {
                formData.append("quizData", JSON.stringify(data.quizData));
            } else {
                formData.append("quizData", null);
            }

            // Append files
            if (data.moduleUrl) formData.append("moduleUrl", data.moduleUrl);
            if (data.homeWorkUrl) formData.append("homeWorkUrl", data.homeWorkUrl);

            try {
                const result = await createEducationEpisode(formData).unwrap();
                if (result) {
                    reset();
                    router.push(`/education/upload/episode/${educationId}`);
                    window.location.reload();
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
            <form onSubmit={handleSubmit(onSubmit, onErrors)} className="flex flex-col gap-4 lg:gap-0 overflow-scroll">
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
                    <Controller
                        name="description"
                        control={control}
                        render={({ field, fieldState }) => (
                            <RichTextEditor
                                label="Deskripsi Episode"
                                name="description"
                                placeholder="Jelaskan premis utama dunia cerita, konflik sentral, karakter utama, dan tema yang diangkat. Mesin pencari menggunakan teks ini untuk mempertemukan karyamu dengan pembaca yang tepat."
                                value={field.value}
                                onChange={field.onChange}
                                error={fieldState.error?.message}
                            />
                        )}
                    />

                    {/* Trailer URL (muncul setelah movie ada) */}
                    <Controller
                        name="episodeFileUrl"
                        control={control}
                        rules={{ required: "File episode kelas wajib diunggah" }}
                        render={({ field, fieldState }) => (
                            <div>
                                <UploadLargeFile
                                    prefix="education/episodes"
                                    setDataUrl={field.onChange}
                                    setDuration={(durationValue) => {
                                        // Gunakan setValue untuk mengisi field 'duration'
                                        setValue('duration', durationValue, { shouldValidate: true });
                                    }}
                                    name={'episodeFileUrl'}
                                    label="Video Materi Kelas"
                                    description="Gunakan rasio 16:9, format MP4/MOV, maks 500KB. Trailer yang menarik sangat penting untuk memancing penonton pertama kali dan meningkatkan visibilitas di hasil pencarian video."
                                />
                                <input type="hidden" {...field} value={field.value || ""} />
                                {fieldState.error?.message && (
                                    <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                                )}
                            </div>
                        )}
                    />

                    {/* Input File */}
                    <Controller
                        name="moduleUrl"
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputFileDoc
                                name="moduleUrl"
                                label="Unggah File Modul Pendukung Kelas"
                                description="Pastikan file Anda berformat Microsoft Word (.docx) atau PDF. Klik untuk unggah."
                                accept=".doc,.docx,.pdf"
                                files={field.value ? [field.value] : []}
                                onUpload={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    field.onChange(file);
                                }}
                                onRemove={() => field.onChange(null)}
                                error={fieldState.error?.message}
                            />
                        )}
                    />

                    {/* Input File */}
                    <Controller
                        name="homeWorkUrl"
                        control={control}
                        render={({ field, fieldState }) => (
                            <InputFileDoc
                                name="homeWorkUrl"
                                label="Unggah File Tugas Kelas"
                                description="Pastikan file Anda berformat Microsoft Word (.docx) atau PDF. Klik untuk unggah."
                                accept=".doc,.docx,.pdf"
                                files={field.value ? [field.value] : []}
                                onUpload={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    field.onChange(file);
                                }}
                                onRemove={() => field.onChange(null)}
                                error={fieldState.error?.message}
                            />
                        )}
                    />

                    {/* Checkbox: Apakah kelas ini memiliki quiz? */}
                    <div className="flex items-center gap-2 my-4">
                        <Controller
                            name="hasQuiz"
                            control={control}
                            render={({ field }) => (
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                        className="w-5 h-5 rounded border-[#F5F5F540] accent-blue-600"
                                    />
                                    <span className="montserratFont text-base font-semibold text-white">
                                        Apakah kelas ini memiliki quiz?
                                    </span>
                                </label>
                            )}
                        />
                    </div>

                    {/* Quiz Data Section - Only show when hasQuiz is checked */}
                    {watchHasQuiz && (
                        <div className="flex items-start gap-2">
                            <h3 className="montserratFont flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                                Konfigurasi Quiz
                            </h3>
                            <div className="flex w-full flex-4 text-white md:flex-10 flex-col">
                                <div className="w-full rounded-md border border-[#F5F5F540] bg-[#2a2a2a] p-4">
                                    {/* Quiz Title */}
                                    <InputText
                                        label="Judul Quiz"
                                        name="quizData.title"
                                        placeholder="Contoh: Quiz Akhir Python Dasar"
                                        {...register("quizData.title")}
                                        error={errors.quizData?.title?.message}
                                    />

                                    {/* Quiz Description */}
                                    <InputTextArea
                                        label="Deskripsi Quiz (Opsional)"
                                        name="quizData.description"
                                        placeholder="Jelaskan instruksi atau informasi tambahan untuk quiz ini..."
                                        {...register("quizData.description")}
                                        error={errors.quizData?.description?.message}
                                    />

                                    {/* Duration */}
                                    <Controller
                                        name="quizData.duration"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <InputText
                                                label="Durasi Quiz (menit)"
                                                name="quizData.duration"
                                                type="number"
                                                min="1"
                                                placeholder="30"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                error={fieldState.error?.message}
                                            />
                                        )}
                                    />

                                    {/* Passing Score */}
                                    <Controller
                                        name="quizData.passingScore"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <InputText
                                                label="Nilai Kelulusan (%)"
                                                name="quizData.passingScore"
                                                type="number"
                                                min="0"
                                                max="100"
                                                placeholder="70"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                error={fieldState.error?.message}
                                            />
                                        )}
                                    />

                                    {/* Questions Section */}
                                    <div className="mt-4 pt-4 border-t border-[#F5F5F540]">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="text-base font-semibold text-[#979797] montserratFont">Soal-soal Quiz</h4>
                                            <button
                                                type="button"
                                                onClick={() => appendQuestion({
                                                    question: "",
                                                    options: [
                                                        { text: "", isCorrect: false },
                                                        { text: "", isCorrect: false }
                                                    ]
                                                })}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 montserratFont font-medium transition-colors"
                                            >
                                                + Tambah Soal
                                            </button>
                                        </div>

                                        {questionFields.length === 0 && (
                                            <div className="text-center py-6 text-[#979797] text-sm montserratFont border border-dashed border-[#F5F5F540] rounded-md bg-[#1a1a1a]">
                                                Belum ada soal. Klik &quot;Tambah Soal&quot; untuk membuat soal pertama.
                                            </div>
                                        )}

                                        {questionFields.map((field, qIndex) => (
                                            <div key={field.id} className="border border-[#F5F5F540] p-4 mb-3 rounded-md bg-[#1a1a1a]">
                                                <div className="flex justify-between items-center mb-3">
                                                    <label className="text-sm font-semibold text-[#979797] montserratFont">
                                                        Soal #{qIndex + 1}
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeQuestion(qIndex)}
                                                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 montserratFont transition-colors"
                                                    >
                                                        Hapus Soal
                                                    </button>
                                                </div>

                                                {/* Question Text */}
                                                <textarea
                                                    placeholder="Tulis pertanyaan di sini..."
                                                    className="w-full rounded-md border border-[#F5F5F540] bg-[#2a2a2a] px-3 py-2 text-white transition-all duration-200 focus:border-blue-500 focus:outline-none montserratFont text-sm placeholder:text-sm placeholder:text-[#979797] mb-2"
                                                    rows="3"
                                                    {...register(`quizData.questions.${qIndex}.question`)}
                                                />
                                                {errors.quizData?.questions?.[qIndex]?.question && (
                                                    <p className="text-red-500 text-sm mb-2 montserratFont">
                                                        {errors.quizData.questions[qIndex].question.message}
                                                    </p>
                                                )}

                                                {/* Options */}
                                                <div className="mt-3">
                                                    <label className="text-xs font-semibold text-[#979797] mb-2 block montserratFont">
                                                        Opsi Jawaban (minimal 2):
                                                    </label>
                                                    <Controller
                                                        name={`quizData.questions.${qIndex}.options`}
                                                        control={control}
                                                        render={({ field: optionsField }) => {
                                                            const options = optionsField.value || [];
                                                            return (
                                                                <div className="space-y-2">
                                                                    {options.map((option, oIndex) => (
                                                                        <div key={oIndex} className="flex gap-2 items-center">
                                                                            <span className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white text-xs font-bold rounded-full montserratFont flex-shrink-0">
                                                                                {String.fromCharCode(65 + oIndex)}
                                                                            </span>
                                                                            <input
                                                                                type="text"
                                                                                placeholder={`Opsi ${String.fromCharCode(65 + oIndex)}`}
                                                                                className="flex-1 rounded-md border border-[#F5F5F540] bg-[#2a2a2a] px-2 py-2 text-white transition-all duration-200 focus:border-blue-500 focus:outline-none montserratFont text-sm placeholder:text-sm placeholder:text-[#979797]"
                                                                                value={option.text}
                                                                                onChange={(e) => {
                                                                                    const updated = [...options];
                                                                                    updated[oIndex].text = e.target.value;
                                                                                    optionsField.onChange(updated);
                                                                                }}
                                                                            />
                                                                            <label className="flex items-center gap-1 text-sm text-white montserratFont whitespace-nowrap">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={option.isCorrect}
                                                                                    onChange={(e) => {
                                                                                        const updated = [...options];
                                                                                        updated[oIndex].isCorrect = e.target.checked;
                                                                                        optionsField.onChange(updated);
                                                                                    }}
                                                                                    className="w-4 h-4"
                                                                                />
                                                                                Benar
                                                                            </label>
                                                                            {options.length > 2 && (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        const updated = options.filter((_, i) => i !== oIndex);
                                                                                        optionsField.onChange(updated);
                                                                                    }}
                                                                                    className="px-2 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 montserratFont transition-colors"
                                                                                >
                                                                                    ✕
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            optionsField.onChange([...options, { text: "", isCorrect: false }]);
                                                                        }}
                                                                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 montserratFont transition-colors"
                                                                    >
                                                                        + Tambah Opsi
                                                                    </button>
                                                                </div>
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        {errors.quizData?.questions?.message && (
                                            <p className="text-red-500 text-sm mt-2 montserratFont">
                                                {errors.quizData.questions.message}
                                            </p>
                                        )}
                                        {errors.quizData?.message && (
                                            <p className="text-red-500 text-sm mt-2 montserratFont">
                                                {errors.quizData.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
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

UploadEducationEpisodeForm.propTypes = {
    educationId: PropTypes.string.isRequired
};
