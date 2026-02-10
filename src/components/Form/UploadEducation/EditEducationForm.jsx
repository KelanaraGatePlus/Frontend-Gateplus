"use client";
import React, { useEffect, useRef } from "react";
import PropTypes from 'prop-types';

/*[--- THIRD PARTY LIBRARIES ---]*/
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/*[--- UI COMPONENTS ---]*/
import InputImageBanner from '@/components/UploadForm/InputImageBanner';
import InputSelect from '@/components/UploadForm/InputSelect';
import InputText from '@/components/UploadForm/InputText';
import LoadingOverlay from "@/components/LoadingOverlay/page";
import RichTextEditor from '@/components/RichTextEditor/page';

/*[--- ASSETS PUBLIC ---]*/
import IconsGalery from "@@/icons/logo-upload-banner.svg";
import UploadLargeFile from "@/components/UploadForm/UploadLargeFile";
import PriceSelector from "@/components/UploadForm/PriceSelector";
import { priceOption } from "@/lib/constants/priceOptions";
import { editEducationSchema } from "@/lib/schemas/editEducationSchema";
import { useGetEducationByIdQuery, useUpdateEducationByIdMutation } from "@/hooks/api/educationSliceAPI";
import InputFileDoc from "@/components/UploadForm/InputFileDoc";
import InputMultiString from "@/components/UploadForm/InputMultiString";
import { useGetAllEducationCategoriesQuery } from "@/hooks/api/educationCategorySliceAPI";
import InputEducationLevel from "@/components/UploadForm/InputEducationLevel";
import { Icon } from "@iconify/react";
import StepSlider from "@/components/Slider/StepSlider";
import Switch from "@/components/Switch/Switch";

export default function EditEducationForm({ educationId, step, setStep }) {
    const coverBookInputRef = useRef(null);
    const { data: educationData } = useGetEducationByIdQuery(educationId);
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
        setValue,
        trigger,
    } = useForm({
        resolver: zodResolver(editEducationSchema),
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
            price: null,
            moduleUrl: null,
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

    const [updateEducation, { isLoading, error }] = useUpdateEducationByIdMutation();
    const { data: genresData } = useGetAllEducationCategoriesQuery();
    const watchPassingGrade = watch("passingGrade");

    useEffect(() => {
        if (educationData?.data) {
            const education = educationData.data;

            setValue("title", education.title || "");
            setValue("description", education.description || "");
            setValue("trailerUrl", education.trailerUrl || "");
            setValue("bannerUrl", education.bannerUrl || "");
            setValue("categoriesId", education.categoriesId || "");
            setValue("benefit", education.benefit || []);
            setValue("requirement", education.requirement || []);
            setValue("thirdPartyUrl", education.thirdPartyUrl || "");
            setValue("finalProjectType", education.finalProjectType || "NONE");
            setValue("price", education.price ?? 0);
            setValue("moduleUrl", education.moduleUrl || null);
            setValue("passingGrade", education.passingGrade || 70);
            setValue("haveFinalProject", education.haveFinalProject || false);
            setValue("finalProjectInstructionUrl", education.finalProjectInstructionUrl || null);
            setValue("EducationLevel", education.EducationLevel);
            setValue("thumbnailUrl", education.thumbnailUrl || null);
            setValue("instructorName", education.instructorName || "");
            setValue("instructorBio", education.instructorBio || "");
            setValue("instructorPhoto", education.instructorPhoto || null);
            setValue("haveCertificate", education.haveCertificate || false);
        }
    }, [educationData, setValue]);



    const onSubmit = async (data) => {
        // Hanya izinkan update jika pengguna sudah berada di step 2
        if (step !== 2) {
            setStep(2);
            return;
        }
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

            // Append files only when user uploads a new one
            if (data.bannerUrl instanceof File) formData.append("bannerUrl", data.bannerUrl);
            if (data.moduleUrl instanceof File) formData.append("moduleUrl", data.moduleUrl);
            if (data.finalProjectInstructionUrl instanceof File) formData.append("finalProjectInstructionUrl", data.finalProjectInstructionUrl);
            if (data.thumbnailUrl instanceof File) formData.append("thumbnailUrl", data.thumbnailUrl);
            if (data.instructorPhoto instanceof File) formData.append("instructorPhoto", data.instructorPhoto);

            try {
                const result = await updateEducation({ id: educationId, formData }).unwrap();
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

    const handleNextStep = async (e) => {
        e.preventDefault(); // Prevent form submission
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
                            <Controller
                                name="description"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <RichTextEditor
                                        label="Sinopsis Lengkap Seri"
                                        name="description"
                                        placeholder="Jelaskan premis utama dunia cerita, konflik sentral, karakter utama, dan tema yang diangkat. Mesin pencari menggunakan teks ini untuk mempertemukan karyamu dengan pembaca yang tepat."
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={fieldState.error?.message}
                                    />
                                )}
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
                                rules={{
                                    validate: (value) => {
                                        // Jika ada value (baik file baru atau URL existing), valid
                                        if (value) return true;
                                        return "Poster wajib diunggah";
                                    }
                                }}
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
                                rules={{
                                    validate: (value) => {
                                        // Jika ada value (baik file baru atau URL existing), valid
                                        if (value) return true;
                                        return "Thumbnail wajib diunggah";
                                    }
                                }}
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
                                rules={{
                                    validate: (value) => {
                                        if (value) return true;
                                        return "File trailer wajib diunggah";
                                    }
                                }}
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
                                rules={{ required: false }}
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
                            <Controller
                                name="passingGrade"
                                control={control}
                                render={({ field }) => (
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
                        <div className="w-full flex flex-row justify-between">
                            <button onClick={() => setStep(1)} className="flex flex-row items-center gap-2 px-4 py-2 rounded-md border border-[#686868] bg-[#393939] text-white font-medium montserratFont ">
                                <Icon icon={'solar:arrow-left-linear'} width={32} height={32} />
                                <span>Previous</span>
                            </button>
                            <button type="submit" className="flex flex-row items-center gap-2 px-4 py-2 rounded-md border border-[#156EB7] bg-[#184A97] text-white font-medium montserratFont ">
                                <Icon icon={'solar:diskette-bold'} width={32} height={32} />
                                <span>Save Update</span>
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

EditEducationForm.propTypes = {
    educationId: PropTypes.string.isRequired,
    step: PropTypes.number.isRequired,
    setStep: PropTypes.func.isRequired
};
