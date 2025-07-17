/* eslint-disable react/react-in-jsx-scope */
"use client";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import Footer from "@/components/Footer/MainFooter";
import Navbar from "@/components/Navbar/page";
import Toast from "@/components/Toast/page";
import IconsGalery from "@@/icons/logo-upload-banner.svg";
import IconsButtonSubmit from "@@/IconsButton/buttonSubmit.svg";
import { Checkbox } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

/*[--- COMPONENT IMPORT ---]*/
import HeaderUploadForm from '@/components/UploadForm/HeaderUploadForm';
import HeaderTab from '@/components/UploadForm/HeaderTab';
import InputSelect from '@/components/UploadForm/InputSelect';
import InputText from '@/components/UploadForm/InputText';
import InputTextArea from '@/components/UploadForm/InputTextArea';
import InputImageBanner from '@/components/UploadForm/InputImageBanner';

export default function UploadEpisodePageContent() {
    const router = useRouter();
    const [termAccepted, setTermAccepted] = useState(false);
    const [agreementAccepted, setAgreementAccepted] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const inputFileRef = useRef(null);
    const episodeCoverRef = useRef(null);
    const priceOption = ["10000", "20000", "30000", "Free"];
    const [isTallScreen, setIsTallScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [ebooksCreator, setEbooksCreator] = useState([]);
    const [selectedEbookId, setSelectedEbookId] = useState("");
    const [episodeTitle, setEpisodeTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedPrice, setSelectedPrice] = useState("");
    const [creatorNotes, setCreatorNotes] = useState("");
    const seriesTitleParams = useSearchParams();
    const seriesFromUrl = seriesTitleParams.get("series");
    const [query, setQuery] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState({
        episodeCover: [],
        inputFile: [],
    });
    const creatorsDummyData = [
        {
            id: 1,
            profileName: "Mang Deden",
            imageUrl: "https://picsum.photos/seed/profile2/200/200"
        },
        {
            id: 2,
            profileName: "Mang Uceng",
            imageUrl: "https://picsum.photos/seed/profile1/200/200"
        },
        {
            id: 3,
            profileName: "Pak Friday",
            imageUrl: "https://picsum.photos/seed/profile3/200/200"
        },
    ]

    const handleFileUpload = (event, type) => {
        const files = Array.from(event.target.files);
        const file = files[0];
        event.target.value = "";

        if (!file) return;

        if (uploadedFiles[type].length > 0) {
            setToastMessage("Tidak bisa upload lebih dari 1 file");
            setShowToast(true);
            return;
        }

        if (type === "inputFile") {
            const allowedTypes = [
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ];

            const isValidFormat = files.every((file) =>
                allowedTypes.includes(file.type),
            );
            const isValidFileName = files.every(
                (file) =>
                    (file.name.endsWith(".doc") || file.name.endsWith(".docx")) &&
                    !file.name.includes(" "),
            );
            if (!isValidFormat) {
                setToastMessage("File harus berformat .doc atau .docx");
                setShowToast(true);
                return;
            }
            if (!isValidFileName) {
                setToastMessage(
                    "Nama file tidak boleh mengandung spasi, silakan ganti nama file",
                );
                setShowToast(true);
                return;
            }
        }

        if (
            type === "bannerStart" ||
            type === "bannerEnd" ||
            type === "episodeCover"
        ) {
            const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
            const isValid = files.every((file) => allowedTypes.includes(file.type));
            if (!isValid) {
                setToastMessage("File harus berformat .jpg, .png, atau .webp");
                setShowToast(true);
                return;
            }
        }

        setUploadedFiles((prev) => ({
            ...prev,
            [type]: [...prev[type], file],
        }));
    };

    const handleRemoveFile = (type, index) => {
        setUploadedFiles((prev) => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index),
        }));
    };

    const handleSelectChange = (e) => {
        setSelectedEbookId(e.target.value);
    };

    useEffect(() => {
        const checkScreenHeight = () => {
            setIsTallScreen(window.innerHeight > 1950);
        };

        checkScreenHeight();
        window.addEventListener("resize", checkScreenHeight);

        return () => window.removeEventListener("resize", checkScreenHeight);
    }, []);

    useEffect(() => {
        if (seriesFromUrl) {
            setSelectedEbookId(seriesFromUrl);
        }
    }, [seriesFromUrl]);

    const getData = async () => {
        try {
            const creatorId = localStorage.getItem("creators_id");
            const response = await axios.get(
                `https://backend-gateplus-api.my.id/creator/${creatorId}`,
            );

            const fullData = response.data.data;
            const creatorData = fullData.data[0];

            setEbooksCreator(creatorData.Podcast);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (
            !selectedEbookId ||
            !episodeTitle ||
            !description ||
            !creatorNotes ||
            !selectedPrice ||
            uploadedFiles.episodeCover.length === 0 ||
            uploadedFiles.inputFile.length === 0 ||
            uploadedFiles.bannerStart.length === 0 ||
            uploadedFiles.bannerEnd.length === 0
        ) {
            setToastMessage("Semua kolom harus diisi");
            setShowToast(true);
            setShowToast(true);
            setIsLoading(false);
            return;
        }

        if (selectedPrice === "Free") {
            setSelectedPrice("0");
        }

        const formData = new FormData();
        const creatorId = localStorage.getItem("creators_id");
        formData.append("creatorId", creatorId);
        formData.append("ebookId", selectedEbookId);
        formData.append("title", episodeTitle);
        formData.append("description", description);
        formData.append("price", selectedPrice);
        formData.append("notedEpisode", creatorNotes);
        formData.append("coverEpisodeUrl", uploadedFiles.episodeCover[0]);
        formData.append("bannerStartEpisodeUrl", uploadedFiles.bannerStart[0]);
        formData.append("bannerEndEpisodeUrl", uploadedFiles.bannerEnd[0]);
        formData.append("ebookUrl", uploadedFiles.inputFile[0]);

        try {
            const response = await axios.post(
                "https://backend-gateplus-api.my.id/episode",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            console.log(response.data);

            setIsLoading(false);
            setSelectedEbookId("");
            setEpisodeTitle("");
            setDescription("");
            setSelectedPrice("");
            setCreatorNotes("");

            router.push(`/Ebook/DetailEbook/${selectedEbookId}`);
        } catch (error) {
            console.error("Error during post request:", error);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col overflow-x-hidden">
            <Suspense fallback={<div>Loading...</div>}>
                <Navbar />
            </Suspense>
            <main className="mt-16 flex flex-col py-2 md:mt-[100px] lg:px-4">
                <HeaderUploadForm title={"Upload Podcast"} />
                <HeaderTab type={"Podcast"} />

                <div className="flex w-full flex-col px-2">
                    <form className="flex flex-col gap-2 lg:gap-2" onSubmit={handleSubmit}>
                        {/* Pilih Judul Series */}
                        <InputSelect
                            label="Judul"
                            name="series"
                            onChange={handleSelectChange}
                            value={selectedEbookId}
                            options={ebooksCreator}
                            placeholder="Pilih Judul Series"
                        />
                        {/* Judul Episode */}
                        <InputText
                            label="Judul Episode"
                            name="episdeTitle"
                            placeholder="Judul Episode"
                            onChange={(e) => setEpisodeTitle(e.target.value)}
                            required
                        />
                        {/* Deskripsi */}
                        <InputTextArea
                            label="Deskripsi"
                            name="description"
                            placeholder="Deskripsi"
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                        {/* Cover Book */}
                        <InputImageBanner
                            type="cover"
                            label="Episode Cover"
                            description="Format banner its 1x1 with maks 500kb."
                            name="episodeCover"
                            icon={IconsGalery}
                            files={uploadedFiles.episodeCover}
                            inputRef={episodeCoverRef}
                            onUpload={handleFileUpload}
                            onRemove={handleRemoveFile}
                        />
                        {/* upload file */}
                        <section className="flex items-start gap-2 text-[#979797]">
                            <div className="flex flex-2 flex-col">
                                <h3 className="montserratFont text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                                    File Input
                                </h3>
                                <p className="text-[10px] text-[#979797] italic md:text-sm">
                                    Audio Input .mp3, dll
                                </p>
                            </div>
                            <div className="flex h-full w-fit flex-4 flex-wrap items-stretch justify-start gap-x-6 text-white md:flex-10">
                                <div className="container flex w-full flex-wrap items-start gap-4 rounded-md bg-[#585454] p-2">
                                    {/* Upload Section */}
                                    <div className="flex flex-col items-center">
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="inputFile"
                                                name="inputFile"
                                                hidden
                                                ref={inputFileRef}
                                                accept=".doc,.docx"
                                                onChange={(e) => handleFileUpload(e, "inputFile")}
                                            />
                                            <label htmlFor="inputFile">
                                                <div className="flex cursor-pointer items-center justify-center rounded-md bg-gray-500 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-600 md:text-sm">
                                                    Upload Files
                                                </div>
                                            </label>
                                        </div>
                                        {/* Filename info */}
                                        <p className="mt-2 text-center text-xs text-white italic">
                                            {uploadedFiles.inputFile?.length > 0
                                                ? `${uploadedFiles.inputFile.length} file(s) selected`
                                                : "No file chosen"}
                                        </p>
                                    </div>

                                    {/* Preview Section */}
                                    <div className="flex flex-wrap gap-4">
                                        {uploadedFiles.inputFile?.map((file, index) => (
                                            <div
                                                key={index}
                                                className="relative flex w-36 items-center justify-between rounded-md bg-gray-500 px-2 py-2 md:w-40"
                                            >
                                                <p className="w-28 truncate text-[10px] text-white md:w-32 lg:text-[12px]">
                                                    {file.name}
                                                </p>
                                                <button
                                                    onClick={() => handleRemoveFile("inputFile", index)}
                                                    className="ml-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-500 text-xs text-white"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* Search Creator */}
                        <section className="flex items-start gap-2 text-[#979797]">
                            <div className="flex flex-2 flex-col">
                                <h3 className="montserratFont text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                                    Kreator Kolaborasi
                                </h3>
                                <p className="text-[10px] text-[#979797] italic md:text-sm">
                                    Optional
                                </p>
                            </div>
                            <div className="flex h-full w-fit flex-4 flex-wrap items-stretch justify-start gap-x-6 text-white md:flex-10 relative">
                                <div className="container flex w-full flex-wrap items-start gap-4 rounded-md bg-[#2a2a2a] p-2 border border-[#F5F5F540]">
                                    <div className="flex flex-col items-center w-full gap-2">
                                        {/* List Creator Tags */}
                                        <div className="flex flex-row flex-wrap w-full items-center justify-start gap-2">
                                            {creatorsDummyData.map((creator) => (
                                                <div
                                                    key={creator.id}
                                                    className="p-2 montserratFont border-2 w-fit rounded-lg border-[#F5F5F559] bg-[#F5F5F540] text-sm flex gap-2 items-center"
                                                >
                                                    <p>@{creator.profileName}</p>
                                                    <button className="h-6 w-6 shrink-0 rounded-full bg-black/25 text-white text-base">
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Input */}
                                        <input
                                            type="text"
                                            className="border-none outline-none w-full rounded-lg p-1 placeholder:montserratFont"
                                            placeholder="Masukan Nama Pengguna Kreator"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {query && (
                                    <div className="w-full bg-[#2e2e2e] h-fit rounded-md drop-shadow-black/40 drop-shadow-2xl border border-white/50 absolute translate-y-full -bottom-2 z-10">
                                        {creatorsDummyData
                                            .filter((creator) =>
                                                creator.profileName.toLowerCase().includes(query.toLowerCase())
                                            )
                                            .map((creator) => (
                                                <div
                                                    key={creator.id}
                                                    className="px-4 py-2 cursor-pointer hover:bg-white/30"
                                                >
                                                    {creator.profileName}
                                                </div>
                                            ))
                                            .concat(
                                                creatorsDummyData.filter((creator) =>
                                                    creator.profileName.toLowerCase().includes(query.toLowerCase())
                                                ).length === 0
                                                    ? [
                                                        <div key="notfound" className="px-4 py-2 text-sm text-gray-300">
                                                            Data tidak ditemukan
                                                        </div>,
                                                    ]
                                                    : []
                                            )}
                                    </div>
                                )}
                            </div>
                        </section>
                        {/* Catatan Kreator */}
                        <InputTextArea
                            label="Catatan Kreator"
                            name="creatorNotes"
                            placeholder="Tuliskan Catatan Anda"
                            onChange={(e) => setCreatorNotes(e.target.value)}
                            required
                        />
                        {/* Price */}
                        <section className="my-3 flex flex-col items-center justify-center gap-3">
                            <h3 className="montserratFont w-full flex-2 text-left text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                                Price
                            </h3>
                            <div className="flex w-full gap-3">
                                {priceOption.map((option) => (
                                    <div
                                        key={option}
                                        onClick={() => setSelectedPrice(option)}
                                        className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 border-[#F5F5F559] bg-[#F5F5F540] py-2 text-lg font-bold text-white ${selectedPrice === option ? "border-blue-700 bg-blue-500" : "bg-[#F5F5F540]"} transition hover:opacity-80`}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                            <div
                                className={`flex w-full flex-1 cursor-not-allowed items-center justify-center rounded-lg border-2 border-[#F5F5F559] bg-[#F5F5F540] px-2 py-2 text-lg font-bold text-white transition hover:opacity-80`}
                            >
                                Lihat Simulasi Pendapatan
                            </div>
                        </section>

                        <section className="flex w-4/6 flex-col text-sm md:text-base lg:w-10/12 lg:self-end">
                            <label className="flex flex-1 flex-row items-center justify-start gap-1">
                                <Checkbox
                                    name="term-and-condition"
                                    checked={termAccepted}
                                    onChange={(e) => setTermAccepted(e.target.checked)}
                                    sx={{
                                        color: "white",
                                        "&.Mui-checked": {
                                            color: "cyan",
                                        },
                                    }}
                                />
                                <Link
                                    href="/TermAndCondition"
                                    target="_blank"
                                    className="text-white underline"
                                >
                                    Term and Condition
                                </Link>
                            </label>

                            <label className="flex flex-1 flex-row items-center justify-start gap-1">
                                <Checkbox
                                    name="agreement"
                                    checked={agreementAccepted}
                                    onChange={(e) => setAgreementAccepted(e.target.checked)}
                                    sx={{
                                        color: "white",
                                        "&.Mui-checked": {
                                            color: "cyan",
                                        },
                                    }}
                                />
                                <Link
                                    href="/Agreement"
                                    target="_blank"
                                    className="text-white underline"
                                >
                                    Agreement
                                </Link>
                            </label>
                        </section>

                        <button
                            disabled={!termAccepted || !agreementAccepted}
                            className={`mt-1 flex w-full justify-center gap-2 rounded-lg border border-[#F5F5F559] bg-[#0E5BA8] py-2 font-bold text-white lg:mt-8 lg:w-10/12 lg:self-end ${!termAccepted || !agreementAccepted
                                ? "cursor-not-allowed bg-gray-500 text-white/50"
                                : "cursor-pointer"
                                }`}
                            type="submit"
                        >
                            <span className="flex">
                                <Image
                                    priority
                                    className="aspect-auto"
                                    height={16}
                                    width={16}
                                    alt="icon-save-changes"
                                    src={IconsButtonSubmit}
                                />
                            </span>
                            <p>{isLoading ? "Loading..." : "Buat Episode"}</p>
                        </button>
                    </form>
                </div>
            </main>

            {showToast && (
                <Toast
                    message={toastMessage}
                    type="failed"
                    onClose={() => setShowToast(false)}
                />
            )}
            {isLoading && <LoadingOverlay message="Uploading..." />}
            <div className={isTallScreen ? "absolute bottom-0 w-full" : ""}>
                <Footer />
            </div>
        </div>
    );
}
