"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateCommentReportMutation } from "@/hooks/api/reportCommentAPI";
import InputSelect from "@/components/UploadForm/InputSelect";
import InputTextArea from "@/components/UploadForm/InputTextArea";

const reportCommentSchema = z.object({
    category: z.string().min(1, "Kategori harus dipilih"),
    isAnonymous: z.boolean(),
    reportDetail: z.string().min(10, "Deskripsi minimal 10 karakter"),
    evidence: z.any().optional(),
    evidenceDetail: z.string().optional(),
});

export default function ReportCommentModal({ isOpen, onClose, commentId, isDark }) {
    const [createReport, { isLoading }] = useCreateCommentReportMutation();
    const [previewImages, setPreviewImages] = useState([]);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(reportCommentSchema),
        defaultValues: {
            category: "",
            isAnonymous: false,
            reportDetail: "",
            evidence: [],
            evidenceDetail: "",
        },
    });

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("isAnonymous", String(data.isAnonymous));
        formData.append("commentId", commentId);
        formData.append("category", data.category);
        formData.append("reportDetail", data.reportDetail);
        formData.append("evidenceDetail", data.evidenceDetail || "");

        if (data.evidence && data.evidence.length > 0) {
            Array.from(data.evidence).forEach((file) => {
                formData.append("evidence", file);
            });
        }

        try {
            await createReport(formData).unwrap();
            alert("Laporan berhasil dikirim!");
            reset();
            setPreviewImages([]);
            onClose();
        } catch (error) {
            console.error("Error:", error);
            alert("Gagal mengirim laporan: " + (error?.data?.message || error.message));
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-2xl rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto ${isDark ? "bg-[#2A2A2A] text-white" : "bg-white text-gray-900"}`}>
                {/* Header */}
                <div className="sticky top-0 bg-inherit p-6 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Laporkan Komentar</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    {/* Anonymous Toggle */}
                    <Controller
                        name="isAnonymous"
                        control={control}
                        render={({ field }) => (
                            <div className="flex flex-col gap-3">
                                <label className="font-semibold">Identitas Pelapor</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={field.value === true}
                                            onChange={() => field.onChange(true)}
                                            className="w-5 h-5 accent-blue-500"
                                        />
                                        <span>Anonim</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={field.value === false}
                                            onChange={() => field.onChange(false)}
                                            className="w-5 h-5 accent-blue-500"
                                        />
                                        <span>Gunakan Email</span>
                                    </label>
                                </div>
                            </div>
                        )}
                    />

                    {/* Category */}
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Kategori Laporan *</label>
                        <Controller
                            name="category"
                            control={control}
                            render={({ field, fieldState }) => (
                                <InputSelect
                                    options={[
                                        { id: "SPAM", title: "Spam" },
                                        { id: "HATE_SPEECH", title: "Ujaran Kebencian" },
                                        { id: "HARASSMENT", title: "Pelecehan" },
                                        { id: "INAPPROPRIATE_CONTENT", title: "Konten Tidak Pantas" },
                                        { id: "OTHER", title: "Lainnya" },
                                    ]}
                                    placeholder="Pilih Kategori"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                    </div>

                    {/* Detail */}
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Deskripsi Masalah *</label>
                        <InputTextArea
                            placeholder="Jelaskan secara detail mengapa Anda melaporkan komentar ini"
                            {...register("reportDetail")}
                            error={errors.reportDetail?.message}
                        />
                    </div>

                    {/* Evidence Upload */}
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Bukti Pendukung (Opsional)</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            {...register("evidence")}
                            onChange={(e) => {
                                register("evidence").onChange(e);
                                handleFileChange(e);
                            }}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {previewImages.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {previewImages.map((src, idx) => (
                                    <img key={idx} src={src} alt={`Preview ${idx}`} className="w-full h-24 object-cover rounded" />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Evidence Detail */}
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Deskripsi Bukti (Opsional)</label>
                        <InputTextArea
                            placeholder="Jelaskan bukti yang Anda lampirkan"
                            {...register("evidenceDetail")}
                            error={errors.evidenceDetail?.message}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                            disabled={isLoading}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? "Mengirim..." : "Kirim Laporan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

ReportCommentModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    commentId: PropTypes.string.isRequired,
    isDark: PropTypes.bool,
};