"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

/*[--- HOOKS IMPORT ---]*/
import { useCreateEbookMutation } from "@/hooks/api/ebookSliceAPI";

/*[--- CONSTANT VAR IMPORT ---]*/
import { languageOptions } from '@/lib/constants/languageOptions';

/*[--- COMPONENT IMPORT ---]*/
import InputText from '@/components/UploadForm/InputText';
import InputTextArea from '@/components/UploadForm/InputTextArea';
import InputSelect from '@/components/UploadForm/InputSelect';
import InputAgeResctriction from '@/components/UploadForm/InputAgeResctriction';
import InputImageBanner from '@/components/UploadForm/InputImageBanner';
import ButtonSubmit from '@/components/UploadForm/ButtonSubmit';
import HeaderUploadForm from '@/components/UploadForm/HeaderUploadForm';
import HeaderTab from '@/components/UploadForm/HeaderTab';
import Toast from "@/components/Toast/page";
import LoadingOverlay from "@/components/LoadingOverlay/page";

/*[--- ASSETS IMPORT ---]*/
import IconsGalery from "@@/icons/logo-upload-banner.svg";
import IconsButtonSubmit from "@@/IconsButton/buttonSubmit.svg";

export default function UploadEbookPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [creatorId, setCreatorId] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState([]);
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const [ageRestriction, setAgeRestriction] = useState("");
  const posterBannerInputRef = useRef(null);
  const coverBookInputRef = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const router = useRouter();
  const [createEbook] = useCreateEbookMutation();

  const [uploadedFiles, setUploadedFiles] = useState({
    posterBanner: [],
    coverBook: [],
  });

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

    if (type === "posterBanner" || type === "coverBook") {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !title ||
      !description ||
      !genre ||
      !language ||
      !ageRestriction ||
      uploadedFiles.coverBook.length === 0 ||
      uploadedFiles.posterBanner.length === 0
    ) {
      setToastMessage("Semua kolom harus diisi");
      setShowToast(true);
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("creatorId", creatorId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("categoriesId", genre);
    formData.append("language", language);
    formData.append("ageRestriction", ageRestriction);
    formData.append("coverImageUrl", uploadedFiles.coverBook[0]);
    formData.append("posterImageUrl", uploadedFiles.posterBanner[0]);

    try {
      const result = await createEbook(formData).unwrap();
      console.log(result);

      setIsLoading(false);
      setTitle("");
      setDescription("");
      setGenre("");
      setLanguage("");
      setAgeRestriction("");

      router.push(`/ebooks/upload/episode?series=${result.data.id}`);
    } catch (error) {
      console.error("Error during post request:", error);
      setIsLoading(false);
    }
  };

  const getDataCatgeory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://backend-gateplus-api.my.id/category/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCategory(response.data.data.data);
    } catch (error) {
      console.error("Error during get request:", error);
    }
  };

  useEffect(() => {
    const creator_id = localStorage.getItem("creators_id");
    if (creator_id) {
      setCreatorId(creator_id);
    }
    getDataCatgeory();
  }, []);

  return (
    <>
      <main className="mt-16 flex flex-col py-2 md:mt-[100px] lg:px-4">
        <HeaderUploadForm title={"Upload Ebook"} />
        <HeaderTab type={"ebooks"} />

        <div className="flex w-full flex-col px-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 lg:gap-0">
            <div className="flex flex-col gap-2">
              {/* Judul */}
              <InputText
                label="Judul"
                name="title"
                placeholder="Judul Series"
                onChange={(e) => setTitle(e.target.value)}
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
              {/* Genre */}
              <InputSelect
                label="Genre"
                name="genre"
                onChange={(e) => setGenre(e.target.value)}
                options={category}
                placeholder="Pilih Genre"
                isControlled={false}
              />
              {/* Bahasa */}
              <InputSelect
                label="Bahasa"
                name="language"
                onChange={(e) => setLanguage(e.target.value)}
                options={languageOptions}
                placeholder="Pilih Bahasa"
                isLanguage={true}
                isControlled={false}
              />
              {/* Age Restriction */}
              <InputAgeResctriction
                onChange={(e) => setAgeRestriction(e.target.value)}
              />
              {/* Banner Ebook */}
              <InputImageBanner
                type="banner"
                label="Poster Banner"
                description="Gunakan rasio 16:9 (1920x1080 px), format JPG/PNG, ukuran maksimal 500KB. Poster harus jelas dan mewakili isi konten."
                name="posterBanner"
                icon={IconsGalery}
                inputRef={posterBannerInputRef}
                files={uploadedFiles.posterBanner}
                onUpload={handleFileUpload}
                onRemove={handleRemoveFile}
              />
              {/* Cover Book */}
              <InputImageBanner
                type="cover"
                label="Cover Book"
                description="Gunakan rasio 1,6:2 (1600x2560), format JPG/PNG, ukuran maksimal 500KB. Poster harus jelas dan mewakili isi konten."
                name="coverBook"
                icon={IconsGalery}
                files={uploadedFiles.coverBook}
                inputRef={coverBookInputRef}
                onUpload={handleFileUpload}
                onRemove={handleRemoveFile}
              />
            </div>

            <ButtonSubmit
              type="submit"
              icon={IconsButtonSubmit}
              label="Buat Series"
              isLoading={isLoading}
            />

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
      {isLoading && (
        <LoadingOverlay message="Tunggu Sebentar... <br/> Sedang membuat series" />
      )}
    </>
  );
}
