"use client";
import React, { useEffect, useRef } from "react";

/*[--- THIRD PARTY LIBRARIES ---]*/
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/*[--- UI COMPONENTS ---]*/
import InputImageBanner from '@/components/UploadForm/InputImageBanner';
import InputSelect from '@/components/UploadForm/InputSelect';
import InputText from '@/components/UploadForm/InputText';
import InputTextArea from '@/components/UploadForm/InputTextArea';
import LoadingOverlay from "@/components/LoadingOverlay/page";

/*[--- ASSETS PUBLIC ---]*/
import IconsGalery from "@@/icons/logo-upload-banner.svg";
import UploadLargeFile from "@/components/UploadForm/UploadLargeFile";
import PriceSelector from "@/components/UploadForm/PriceSelector";
import { priceOption } from "@/lib/constants/priceOptions";
import { createEducationSchema } from "@/lib/schemas/createEducationSchema";
import { useCreateNewEducationMutation } from "@/hooks/api/educationSliceAPI";
import InputFileDoc from "@/components/UploadForm/InputFileDoc";
import InputMultiString from "@/components/UploadForm/InputMultiString";
import { useGetAllEducationCategoriesQuery } from "@/hooks/api/educationCategorySliceAPI";
import InputEducationLevel from "@/components/UploadForm/InputEducationLevel";
import EducationHeaderTab from "@/components/UploadForm/EducationHeaderTab";
import { Icon } from "@iconify/react";
import TermsCheckbox from "@/components/UploadForm/TermsCheckbox";
import StepSlider from "@/components/Slider/StepSlider";
import Switch from "@/components/Switch/Switch";

export default function UploadEducationForm() {
    const coverBookInputRef = useRef(null);
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
        setValue,
        unregister,
        trigger,
    } = useForm({
        resolver: zodResolver(createEducationSchema),
        mode: "onChange",
        defaultValues: {
            title: "",
            description: "",
            trailerUrl: "",
            bannerUrl: "",
            categoriesId: "",
            benefit: [],
            requirement: [],
            thirdPartyUrl: "",
            finalProjectType: "NONE",
            price: 5000,
            moduleUrl: null,
            quizData: null,
            passingGrade: 70,
            haveFinalProject: false,
            finalProjectInstructionUrl: null,
            EducationLevel: null,
            thumbnailUrl: null,
            instructorName: "",
            instructorBio: "",
            instructorPhoto: null,
            haveCertificate: false,
        },
    });

    const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
        control,
        name: "quizData.questions"
    });

    const [createEducation, { isLoading, error }] = useCreateNewEducationMutation();
    const { data: genresData } = useGetAllEducationCategoriesQuery();
    const watchFinalProjectType = watch("finalProjectType");
    const watchHaveFinalProject = watch("haveFinalProject");
    const watchPassingGrade = watch("passingGrade");
    const [step, setStep] = React.useState(1);

    useEffect(() => {
        if (watchFinalProjectType === "UPLOAD" || watchFinalProjectType === "NONE") {
            control.unregister("quizData"); // 💥 ini penting
        }
    }, [watchFinalProjectType, control]);

    useEffect(() => {
        if (!watchHaveFinalProject) {
            setValue("finalProjectType", "NONE", { shouldValidate: true });
            unregister("quizData");
            unregister("finalProjectInstructionUrl");
        }
    }, [watchHaveFinalProject, setValue, unregister]);


    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("trailerUrl", data.trailerUrl);
            formData.append("categoriesId", data.categoriesId);
            formData.append("benefit", JSON.stringify(data.benefit));
            formData.append("requirement", JSON.stringify(data.requirement));
            formData.append("finalProjectType", data.haveFinalProject ? data.finalProjectType : "NONE");
            formData.append("price", data.price);
            formData.append("passingGrade", data.passingGrade);
            formData.append("haveFinalProject", data.haveFinalProject);
            formData.append("EducationLevel", data.EducationLevel);
            formData.append("instructorName", data.instructorName);
            formData.append("instructorBio", data.instructorBio);
            formData.append("haveCertificate", data.haveCertificate);

            // Append files
            if (data.bannerUrl) formData.append("bannerUrl", data.bannerUrl);
            if (data.moduleUrl) formData.append("moduleUrl", data.moduleUrl);
            if (data.finalProjectInstructionUrl) formData.append("finalProjectInstructionUrl", data.finalProjectInstructionUrl);
            if (data.thumbnailUrl) formData.append("thumbnailUrl", data.thumbnailUrl);
            if (data.instructorPhoto) formData.append("instructorPhoto", data.instructorPhoto);

            // Only append quizData if finalProjectType is QUIZ
            if ((data.finalProjectType === "QUIZ" || data.finalProjectType === "MIXED") && data.quizData) {
                formData.append("quizData", JSON.stringify(data.quizData));
            }

            try {
                const result = await createEducation(formData).unwrap();
                if (result) {
                    window.location.href = "/education/upload/episode/" + result.id;
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

    const handleNextStep = async () => {
        // Validasi semua field di step 1
        const step1Fields = [
            "title",
            "description",
            "categoriesId",
            "EducationLevel",
            "bannerUrl",
            "thumbnailUrl",
            "trailerUrl",
            "instructorName",
            "instructorBio",
            "instructorPhoto",
            "price",
        ];

        const isValid = await trigger(step1Fields);

        if (isValid) {
            setStep(2);
        }
    };

    return (
        <>
            <EducationHeaderTab type={"education"} step={step} setStep={setStep} />
            <form onSubmit={handleSubmit(onSubmit, onErrors)} className="flex flex-col gap-4 lg:gap-0">
                <div>
                    <div className={`${step == 1 ? 'flex' : 'hidden'} flex-col gap-4`}>
                        <div className="flex flex-col gap-2 bg-[#393939] p-6 rounded-2xl border border-[#686868]">
                            <h1 className="montserratFont font-bold text-white text-xl mb-2">Informasi Dasar</h1>
                            {/* Judul */}
                            <InputText
                                label="Judul Utama Seri (Main Series Title)"
                                name="title"
                                placeholder="Judul Series"
                                {...register("title")}
                                error={errors.title?.message}
                            />
                            {/* Deskripsi */}
                            <InputTextArea
                                label="Sinopsis Lengkap Seri"
                                name="description"
                                placeholder="Jelaskan premis utama dunia cerita, konflik sentral, karakter utama, dan tema yang diangkat. Mesin pencari menggunakan teks ini untuk mempertemukan karyamu dengan pembaca yang tepat."
                                {...register("description")}
                                error={errors.description?.message}
                            />
                            {/* Genre */}
                            <Controller
                                name="categoriesId"
                                control={control}
                                rules={{ required: "Kategori wajib dipilih" }}
                                render={({ field, fieldState }) => (
                                    <InputSelect
                                        label="Kategori Kelas"
                                        name="categoriesId"
                                        options={genresData?.data.data || []}
                                        placeholder="Pilih satu kategori yang paling menggambarkan kelas ini."
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        error={fieldState.error?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="EducationLevel"
                                control={control}
                                rules={{ required: "Batasan umur harus dipilih" }}
                                render={({ field, fieldState }) => (
                                    <InputEducationLevel
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={fieldState.error?.message}
                                    />
                                )}
                            />
                            <InputText
                                label={"URL Pihak Ketiga (Opsional)"}
                                name="thirdPartyUrl"
                                placeholder="Masukkan URL eksternal seperti link grup WhatsApp atau platform lain."
                                {...register("thirdPartyUrl")}
                                error={errors.thirdPartyUrl?.message}
                            />
                        </div>

                        <div className="flex flex-col gap-2 bg-[#393939] p-6 rounded-2xl border border-[#686868]">
                            {/* Poster */}
                            <Controller
                                name="bannerUrl"
                                control={control}
                                rules={{ required: "Thumbnail wajib diunggah" }}
                                render={({ field, fieldState }) => (
                                    <InputImageBanner
                                        type="cover"
                                        label="Poster Utama / Cover Art (Rasio Potrait)"
                                        description='Gunakan gambar berkualitas tinggi (High-Res). Ini adalah hal pertama yang dilihat calon peserta di hasil pencarian.'
                                        name="bannerUrl"
                                        icon={IconsGalery}
                                        inputRef={coverBookInputRef}
                                        files={field.value ? [field.value] : []}
                                        onUpload={(e) => {
                                            const files = [...e.target.files];
                                            field.onChange(files[0]);
                                        }}
                                        onRemove={() => {
                                            field.onChange(null);
                                        }}
                                        error={fieldState.error?.message}
                                    />
                                )}
                            />
                            {/* Thumbnail */}
                            <Controller
                                name="thumbnailUrl"
                                control={control}
                                rules={{ required: "Thumbnail wajib diunggah" }}
                                render={({ field, fieldState }) => (
                                    <InputImageBanner
                                        type="banner"
                                        label="Thumbnail Video (Rasio 16:9)"
                                        description='Gambar statis yang muncul sebelum video diputar. Buat visual yang mencolok (eye-catching) untuk meningkatkan jumlah klik.'
                                        name="thumbnailUrl"
                                        icon={IconsGalery}
                                        inputRef={coverBookInputRef}
                                        files={field.value ? [field.value] : []}
                                        onUpload={(e) => {
                                            const files = [...e.target.files];
                                            field.onChange(files[0]);
                                        }}
                                        onRemove={() => {
                                            field.onChange(null);
                                        }}
                                        error={fieldState.error?.message}
                                    />
                                )}
                            />
                            {/* Trailer URL (muncul setelah movie ada) */}
                            <Controller
                                name="trailerUrl"
                                control={control}
                                rules={{ required: "File trailer wajib diunggah" }}
                                render={({ field, fieldState }) => (
                                    <div>
                                        <UploadLargeFile
                                            prefix="education/trailer"
                                            setDataUrl={field.onChange}
                                            name={'trailerUrl'}
                                            label="Video Trailer Kelas (Teaser)"
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
                        </div>
                        <div className="flex flex-col gap-2 bg-[#393939] p-6 rounded-2xl border border-[#686868]">
                            <h1 className="font-bold text-white montserratFont text-xl mb-4">Profil Instruktur</h1>
                            {/* Nama Instruktur */}
                            <InputText
                                label="Nama Instruktur"
                                name="instructorName"
                                placeholder="Masukkan nama lengkap beserta gelar jika ada"
                                {...register("instructorName")}
                                error={errors.instructorName?.message}
                            />
                            {/* Bio Instruktur */}
                            <InputText
                                label="Bio Instruktur"
                                name="instructorBio"
                                placeholder="Masukkan biografi singkat instruktur"
                                {...register("instructorBio")}
                                error={errors.instructorBio?.message}
                            />
                            {/* Profile Instruktur */}
                            <Controller
                                name="instructorPhoto"
                                control={control}
                                rules={{ required: "Thumbnail wajib diunggah" }}
                                render={({ field, fieldState }) => (
                                    <InputImageBanner
                                        type="thumbnail"
                                        label="Foto Profil / Avatar (Opsional)"
                                        description='"Unggah foto formal/semi-formal dengan latar belakang polos"
                                        Tips: Foto yang jelas dan terlihat ramah akan meningkatkan rasa percaya (trust) dari calon siswa.'
                                        name="instructorPhoto"
                                        icon={IconsGalery}
                                        inputRef={coverBookInputRef}
                                        files={field.value ? [field.value] : []}
                                        onUpload={(e) => {
                                            const files = [...e.target.files];
                                            field.onChange(files[0]);
                                        }}
                                        onRemove={() => {
                                            field.onChange(null);
                                        }}
                                        error={fieldState.error?.message}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-2 bg-[#393939] p-6 rounded-2xl border border-[#686868]">
                            {/* Harga */}
                            <Controller
                                name="price"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <PriceSelector
                                        label="Harga Kelas"
                                        options={priceOption}
                                        selected={field.value}
                                        onSelect={(val) => {
                                            field.onChange(val !== 'Free' ? parseInt(val, 10) : 0);
                                            field.onBlur();
                                        }}
                                        error={fieldState.error?.message}
                                        placeholder="Tentukan harga jual untuk kelas ini."
                                    />
                                )}
                            />
                        </div>

                        <div className="w-full flex flex-row justify-between">
                            <button onClick={() => setStep(1)} className="flex flex-row items-center gap-2 px-4 py-2 rounded-md border border-[#686868] bg-[#393939] text-white font-medium montserratFont ">
                                <Icon icon={'solar:arrow-left-linear'} width={32} height={32} />
                                <span>Previous</span>
                            </button>
                            <button type={`${step == 2 ? 'submit' : 'button'}`} onClick={handleNextStep} className="flex flex-row items-center gap-2 px-4 py-2 rounded-md border border-[#156EB7] bg-[#184A97] text-white font-medium montserratFont ">
                                <span>Next</span>
                                <Icon icon={'solar:arrow-right-linear'} width={32} height={32} />
                            </button>
                        </div>
                    </div>

                    <div className={`${step == 2 ? 'flex' : 'hidden'} flex-col gap-4`}>
                        <div className="flex flex-col gap-2 bg-[#393939] p-6 rounded-2xl border border-[#686868]">
                            <h1 className="font-bold text-white montserratFont text-xl mb-4">Aturan Pembelajaran</h1>
                            {/* Benefit */}
                            <Controller
                                name="benefit"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <InputMultiString
                                        label="Manfaat Kursus"
                                        name="benefit"
                                        placeholder="Contoh: Belajar Python dari dasar"
                                        values={field.value || []}
                                        onChange={field.onChange}
                                        error={fieldState.error?.message}
                                        description="Tambahkan manfaat yang akan didapat peserta setelah mengikuti kursus ini."
                                    />
                                )}
                            />
                            {/* Requirement */}
                            <Controller
                                name="requirement"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <InputMultiString
                                        label="Persyaratan Kursus"
                                        name="requirement"
                                        placeholder="Contoh: Pemahaman dasar matematika"
                                        values={field.value || []}
                                        onChange={field.onChange}
                                        error={fieldState.error?.message}
                                        description="Tambahkan persyaratan yang harus dipenuhi peserta sebelum mengikuti kursus."
                                    />
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-2 bg-[#393939] p-6 rounded-2xl border border-[#686868]">
                            <h1 className="font-bold text-white montserratFont text-xl mb-4">Evaluasi dan Sertifikat</h1>

                            <TermsCheckbox
                                name="haveFinalProject"
                                control={control}
                                label="Pembelajaran ini terdapat tugas akhir."
                            />
                            <Controller
                                name="passingGrade"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <StepSlider
                                        label="Nilai Kelulusan (%)"
                                        min={0}
                                        max={100}
                                        step={5}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />

                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-[#FEFCE8] rounded-2xl h-fit p-4 flex flex-row justify-between border-[#FFF085] border-2">
                                    <div className="flex flex-row gap-3 items-center">
                                        <Icon icon={'solar:medal-ribbon-outline'} className="text-[#E17100]" width={32} height={32} />
                                        <div className="flex flex-col">
                                            <p className="text-black montserratFont font-medium">Certificate</p>
                                            <p className="text-[#6A7282] montserratFont">Berikan sertifikat kepada peserta yang lulus</p>
                                        </div>
                                    </div>
                                    <Controller
                                        name="haveCertificate"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch

                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="bg-[#F0FDF4] rounded-2xl p-4 flex flex-col justify-between border-[#B9F8CF] border-2 font-medium text-[#1FC16B]">
                                    <div className="flex flex-row gap-2 items-center">
                                        <p className="flex items-center text-[#0D542B]">Certificate Requirements</p>
                                    </div>
                                    <ul>
                                        <li className="flex flex-row gap-2 items-center">
                                            <Icon icon={'material-symbols:check-rounded'} className="text-[#027A48]" width={32} height={32} />
                                            Complete All Episodes
                                        </li>
                                        <li className="flex flex-row gap-2 items-center">
                                            <Icon icon={'material-symbols:check-rounded'} className="text-[#027A48]" width={32} height={32} />
                                            Pass final assignment with minimum {watchPassingGrade}%
                                        </li>
                                        <li className="flex flex-row gap-2 items-center">
                                            <Icon icon={'material-symbols:check-rounded'} className="text-[#027A48]" width={32} height={32} />
                                            Meet All Requirements
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {watchHaveFinalProject && <div className="flex flex-col gap-2 bg-[#393939] p-6 rounded-2xl border border-[#686868]">
                            <h1 className="font-bold text-white montserratFont text-xl mb-4">Tugas Akhir</h1>

                            {/* Final Project Type */}
                            <Controller
                                name="finalProjectType"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <InputSelect
                                        label="Tipe Proyek Akhir"
                                        name="finalProjectType"
                                        options={[
                                            { id: "UPLOAD", title: "Upload File" },
                                            { id: "QUIZ", title: "Quiz" },
                                            { id: "MIXED", title: "Campuran (Upload & Quiz)" },
                                        ]}
                                        placeholder="Pilih tipe proyek akhir"
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        error={fieldState.error?.message}
                                    />
                                )}
                            />

                            {(watchFinalProjectType === "UPLOAD" || watchFinalProjectType === "MIXED") &&
                                <>
                                    {/* Input File */}
                                    <Controller
                                        name="finalProjectInstructionUrl"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <InputFileDoc
                                                name="finalProjectInstructionUrl"
                                                label="Unggah File Instruksi Tugas Akhir"
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
                                </>
                            }

                            {/* Quiz Data Section - Only show when finalProjectType is QUIZ */}
                            {console.log('Current Final Project Type:', watchFinalProjectType)}
                            {(watchFinalProjectType == 'QUIZ' || watchFinalProjectType == 'MIXED') && <div className={'flex items-start gap-2'}>
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
                                                    Belum ada soal. Klik "Tambah Soal" untuk membuat soal pertama.
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
                            </div>}
                        </div>}
                        <div className="w-full flex flex-row justify-between">
                            <button onClick={() => setStep(1)} className="flex flex-row items-center gap-2 px-4 py-2 rounded-md border border-[#686868] bg-[#393939] text-white font-medium montserratFont ">
                                <Icon icon={'solar:arrow-left-linear'} width={32} height={32} />
                                <span>Previous</span>
                            </button>
                            <button type={`${step == 2 ? 'submit' : 'button'}`} onClick={handleNextStep} className="flex flex-row items-center gap-2 px-4 py-2 rounded-md border border-[#156EB7] bg-[#184A97] text-white font-medium montserratFont ">
                                <span>Next</span>
                                <Icon icon={'solar:arrow-right-linear'} width={32} height={32} />
                            </button>
                        </div>
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm">Gagal upload: {error.data?.message || "Terjadi kesalahan"}</p>}
            </form>
            {isLoading && (
                <LoadingOverlay message="Tunggu Sebentar... <br/> Sedang membuat series" />
            )}
        </>
    )
}
