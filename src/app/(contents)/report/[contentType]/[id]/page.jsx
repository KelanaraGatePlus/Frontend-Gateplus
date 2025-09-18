"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

import InputReportEvidence from "@/components/Form/UploadReport/UploadEvidence";
import InputSelect from "@/components/UploadForm/InputSelect";
import InputTextArea from "@/components/UploadForm/InputTextArea";
import { useCreateReportContentMutation } from "@/hooks/api/reportContentAPI";
import { createReportContentSchema } from "@/lib/schemas/createReportContentSchema";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import { useRouter } from "next/navigation";

export default function ReportPage({ params }) {
    const { contentType, id } = params;
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createReportContentSchema),
        mode: "onChange",
        defaultValues: {
            category: "",
            isAnonymous: true,
            reportDetail: "",
            evidence: null,
            evidenceDetail: "",
        },
    });

    const [createReport, { isLoading }] = useCreateReportContentMutation();

    const onSubmit = async (data) => {
        const formData = new FormData();

        formData.append("isAnonymous", data.isAnonymous === true ? true : false);
        formData.append("category", data.category);
        formData.append("reportDetail", data.reportDetail);
        formData.append("evidenceDetail", data.evidenceDetail);
        formData.append("contentId", id);
        formData.append("contentType", contentType.toUpperCase());

        if (data.evidence && data.evidence.length > 0) {
            Array.from(data.evidence).forEach((file) => {
                formData.append("evidence", file);
            });
        }

        try {
            await createReport(formData).unwrap();
            router.push("/");
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <div className="flex flex-col gap-6 text-white">
                {/* Bagian Detail Konten (sudah benar) */}
                <div className="flex flex-col items-center md:flex-row md:justify-between gap-6">
                    <div className="relative aspect-[2/3] w-64 md:h-full rounded-md overflow-hidden">
                        <Image
                            src={"/images/poster/poster-film-diambang-kematian.svg"}
                            alt="Poster Film Diambang Kematian"
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                    {/* Detail Film */}

                    <div className="flex flex-col flex-1 px-4 gap-6">
                        <div>
                            <div className="text-4xl font-black flex flex-col zeinFont">
                                <h1>Laut Bercerita</h1>
                            </div>
                            <div className="flex flex-row gap-2 font-normal">
                                <div className="rounded-full bg-[#1FC16B] px-4 py-1 font-bold">
                                    Active
                                </div>

                                <div className="rounded-full bg-[#1FC16B] px-4 py-1 font-bold">
                                    Active
                                </div>

                                <div className="rounded-full bg-[#1FC16B] px-4 py-1 font-bold">
                                    Active
                                </div>
                            </div>
                        </div>



                        <div className="flex flex-col gap-6 font-normal">
                            <p>
                                Racun Sangga: Santet Pemisah Rumah Tangga adalah sebuah film horor Indonesia tahun 2024 yang disutradarai oleh Rizal Mantovani diproduksi Soraya Intercine Films. Film tersebut diangkat dari sebuah utas viral karya Gusti Gina yang juga bertindak sebagai penulis skenario.
                            </p>

                            <div className="flex flex-col gap-0">
                                <p>Judul : Laut Bercerita</p>
                                <p>Penulis Cerita : Gusti Gina</p>
                                <p>Genre : Horor</p>
                                <p>Dipublikasi : 01-10-2025</p>
                            </div>
                        </div>



                        {/* Profile Studio */}

                        <div className="flex flex-row gap-2.5 items-center">
                            <div className="relative h-16 w-16 rounded-full overflow-hidden">
                                <Image
                                    src={"/images/ProfileIcon/alien-gurl.svg"}
                                    alt="Avatar 1"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex flex-col justify-center gap-1">
                                <h2 className="zeinFont text-3xl font-black">Kelanara Studios</h2>
                                <p className="text-[#515151] text-sm">@kelanaraStudios</p>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Form Report */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 text-white">
                    <div className="md:grid md:grid-cols-2 gap-8">
                        {/* Kolom Kiri */}
                        <div className="flex flex-col gap-4">
                            <Controller
                                name="isAnonymous"
                                control={control}
                                defaultValue={true} // wajib ada defaultValue
                                render={({ field }) => (
                                    <div className="flex flex-col gap-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="true"
                                                checked={field.value === true}
                                                onChange={() => field.onChange(true)}
                                                className="w-5 h-5 accent-blue-500"
                                            />
                                            Anonymous
                                        </label>

                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="false"
                                                checked={field.value === false}
                                                onChange={() => field.onChange(false)}
                                                className="w-5 h-5 accent-blue-500"
                                            />
                                            Use Email (to receive updates)
                                        </label>
                                    </div>
                                )}
                            />


                            <div className="flex flex-col gap-2">
                                <label className="ml-2 font-semibold text-md">Kategori Laporan</label>
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <InputSelect
                                            options={[ // Ganti dengan data kategori yang sesuai
                                                { id: "PLAGIARISM", title: "Plagiarisme" },
                                                { id: "HATE_SPEECH", title: "Ujaran Kebencian" },
                                                { id: "SPAM", title: "Spam" },
                                                { id: "INAPPROPRIATE_CONTENT", title: "Konten Tidak Pantas" },
                                                { id: "COPYRIGHT_INFRINGEMENT", title: "Pelanggaran Hak Cipta" },
                                                { id: "OTHER", title: "Lainnya" },
                                            ]}
                                            placeholder="Pilih Kategori Laporan"
                                            value={field.value}
                                            onChange={field.onChange}
                                            error={fieldState.error?.message}
                                        />
                                    )}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="ml-2 font-semibold text-md">Deskripsi Masalah/Saran</label>
                                <InputTextArea
                                    placeholder="Jelaskan secara detail masalah atau masukan Anda"
                                    {...register("reportDetail")}
                                    error={errors.reportDetail?.message}
                                />
                            </div>
                        </div>

                        {/* Kolom Kanan */}
                        <div className="flex flex-col gap-4">
                            <Controller
                                name="evidence"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <InputReportEvidence
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={fieldState.error?.message}
                                    />
                                )}
                            />

                            <div className="flex flex-col gap-2">
                                <label className="ml-2 font-semibold text-md">Deskripsi Bukti (Opsional)</label>
                                <InputTextArea
                                    placeholder="Jelaskan bukti yang Anda lampirkan"
                                    {...register("evidenceDetail")}
                                    error={errors.evidenceDetail?.message}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-[#156EB7] w-max flex self-center px-16 py-2 rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Mengirim..." : "Kirim Laporan"}
                    </button>
                </form>
                {isLoading && <LoadingOverlay />}
            </div>
        </>
    );
}