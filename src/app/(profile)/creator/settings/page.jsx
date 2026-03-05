/* eslint-disable react/react-in-jsx-scope */
"use client";
import Toast from "@/components/Toast/page";
import IconsCameraAdd from "@@/icons/icons-camera-add.svg";
import BackButton from "@/components/BackButton/page";
import IconsSaveChanges from "@@/icons/icons-save-changes.svg";
import BannerCreator from "@@/icons/logo-banner-creator.svg";
import IconsGalery from "@@/icons/logo-upload-banner.svg";
import logoUsersComment from "@@/icons/logo-users-comment.svg";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";
import ProfileModal from "@/components/Modal/ProfileModal";
import { useUpdateCreatorMutation } from "@/hooks/api/creatorSliceAPI";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import { useAuth } from "@/components/Context/AuthContext";
import ImageCropperModal from "@/components/UploadForm/ImageCropperModal";

export default function CreatorSettingsPage() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [id, setId] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [bannerProfileUrl, setBannerProfileUrl] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("Male");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [region, setRegion] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [selectedIconUrl, setSelectedIconUrl] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [cropTarget, setCropTarget] = useState(null);
  const [pendingFileName, setPendingFileName] = useState("");
  const [cropSource, setCropSource] = useState(null);

  const [canChangeUsername, setCanChangeUsername] = useState(true);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [bannerProfilePicturePreview, setBannerProfilePicturePreview] =
    useState(null);
  const [updateCreator, { isLoading: isUpdateCreatorLoading }] =
    useUpdateCreatorMutation();
  const { refreshUser } = useAuth();

  const validateSocialUrl = (value, pattern, label) => {
    if (!value) return null;

    const trimmed = value.trim();

    // Tolak jika ada spasi
    if (/\s/.test(trimmed)) {
      return `Format URL ${label} tidak valid`;
    }

    try {
      new URL(trimmed); // validasi struktur URL

      if (!pattern.test(trimmed)) {
        return `Format URL ${label} tidak valid`;
      }

      return null;
    } catch {
      return `Format URL ${label} tidak valid`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validasi Input Wajib
    if (!profileName?.trim() || !email) {
      setShowToast(true);
      setToastMessage("Profile Name dan Email wajib diisi");
      setToastType("failed");
      return;
    }

    if (canChangeUsername && !username?.trim()) {
      setShowToast(true);
      setToastMessage("Username wajib diisi");
      setToastType("failed");
      return;
    }

    const socialErrors = [
      validateSocialUrl(
        instagramUrl,
        /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/,
        "Instagram",
      ),
      validateSocialUrl(
        tiktokUrl,
        /^https:\/\/(www\.)?tiktok\.com\/@?[a-zA-Z0-9._]+\/?$/,
        "Tiktok",
      ),
      validateSocialUrl(
        twitterUrl,
        /^https:\/\/(www\.)?(x\.com|twitter\.com)\/[a-zA-Z0-9_]+\/?$/,
        "Twitter/X",
      ),
      validateSocialUrl(
        facebookUrl,
        /^https:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/,
        "Facebook",
      ),
    ].filter(Boolean);

    if (socialErrors.length > 0) {
      setShowToast(true);
      setToastMessage(socialErrors[0]);
      setToastType("failed");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      const cleanValue = (v) =>
        v === "" || v === null || v === undefined ? "" : v;

      formData.append("id", id);
      formData.append("profileName", profileName);
      formData.append("username", username);
      formData.append("bio", cleanValue(bio));
      formData.append("gender", gender || "Male");
      formData.append("email", email);
      formData.append("phone", cleanValue(phone));
      formData.append("dateOfBirth", cleanValue(dateOfBirth));
      formData.append("region", cleanValue(region));
      formData.append("instagramUrl", cleanValue(instagramUrl));
      formData.append("tiktokUrl", cleanValue(tiktokUrl));
      formData.append("twitterUrl", cleanValue(twitterUrl));
      formData.append("facebookUrl", cleanValue(facebookUrl));

      if (profilePictureUrl instanceof File) {
        formData.append("imageUrl", profilePictureUrl);
      } else if (selectedIconUrl) {
        formData.append("iconUrl", selectedIconUrl);
      }

      if (bannerProfileUrl instanceof File) {
        formData.append("bannerImageUrl", bannerProfileUrl);
      }

      const response = await updateCreator(formData).unwrap();
      const updatedCreator = response?.data?.data || response?.data || response;

      if (updatedCreator?.imageUrl) {
        localStorage.setItem("image_users", updatedCreator.imageUrl);
        localStorage.setItem("image_creators", updatedCreator.imageUrl);
      }

      setShowToast(true);
      setToastMessage("Profil berhasil diupdate!");
      setToastType("success");

      if (refreshUser) {
        try {
          await refreshUser();
        } catch (err) {
          console.warn("refreshUser failed:", err);
        }
      }

      setTimeout(() => {
        setIsLoading(false);
        router.push(`/creator/${id}`);
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      console.error("Error during patch request:", error);

      const serverMessage =
        error?.data?.message ||
        error?.message ||
        "Terjadi kesalahan saat update profil";

      setShowToast(true);
      setToastMessage(serverMessage);
      setToastType("failed");
    }
  };

  const getData = async (id) => {
    try {
      // Ambil token untuk menghindari error 500 di backend
      const token = localStorage.getItem("token");

      const response = await axios.get(`${BACKEND_URL}/creator/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const creatorData = response.data.data.data.data;
      if (!creatorData) return;

      const normalize = (v) => (v === null || v === "null" ? "" : v);

      setProfilePictureUrl(normalize(creatorData.imageUrl));
      setBannerProfileUrl(normalize(creatorData.bannerImageUrl));
      setProfileName(normalize(creatorData.profileName));
      setUsername(normalize(creatorData.username));
      setBio(normalize(creatorData.bio));
      setGender(normalize(creatorData.gender) || "Male");
      setEmail(normalize(creatorData.email));
      setPhone(normalize(creatorData.phone));
      setRegion(normalize(creatorData.region));
      setInstagramUrl(normalize(creatorData.instagramUrl));
      setTiktokUrl(normalize(creatorData.tiktokUrl));
      setTwitterUrl(normalize(creatorData.twitterUrl));
      setFacebookUrl(normalize(creatorData.facebookUrl));
      setCanChangeUsername(creatorData.canChangeUsername || false);

      // Konversi format tanggal lahir untuk input type="date"
      if (creatorData.dateOfBirth) {
        const dob = new Date(creatorData.dateOfBirth)
          .toISOString()
          .split("T")[0];
        setDateOfBirth(dob);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const creatorId = localStorage.getItem("creators_id");
    console.log("Creator ID:", creatorId);
    if (creatorId) {
      setId(creatorId);
      getData(creatorId);
    }
  }, []);

  const openCropper = (file, target) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropSource(reader.result);
      setPendingFileName(file.name);
      setCropTarget(target);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob) => {
    if (!cropTarget) return;
    const fileName = pendingFileName || `${cropTarget}-image.jpg`;
    const croppedFile = new File([croppedBlob], fileName, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });

    const nextObjectUrl = URL.createObjectURL(croppedFile);

    if (cropTarget === "profile") {
      if (profilePicturePreview) URL.revokeObjectURL(profilePicturePreview);
      setProfilePicturePreview(nextObjectUrl);
      setProfilePictureUrl(croppedFile);
      setSelectedIconUrl(null);
    } else if (cropTarget === "banner") {
      if (bannerProfilePicturePreview)
        URL.revokeObjectURL(bannerProfilePicturePreview);
      setBannerProfilePicturePreview(nextObjectUrl);
      setBannerProfileUrl(croppedFile);
    }

    setShowCropper(false);
    setCropSource(null);
    setPendingFileName("");
    setCropTarget(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setCropSource(null);
    setPendingFileName("");
    setCropTarget(null);
  };

  const getCropAspect = () => (cropTarget === "banner" ? 16 / 9 : 1);

  const handleFileUpload = (event, type) => {
    if (type === "profile") {
      const file = event.target.files[0];
      if (file) {
        openCropper(file, "profile");
      }
    }

    if (event.target.id === "banner-profile-picture") {
      const file = event.target.files[0];
      if (file) {
        openCropper(file, "banner");
      }
    }
  };

  useEffect(() => {
    return () => {
      if (profilePicturePreview) URL.revokeObjectURL(profilePicturePreview);
      if (bannerProfilePicturePreview)
        URL.revokeObjectURL(bannerProfilePicturePreview);
    };
  }, [profilePicturePreview, bannerProfilePicturePreview]);

  return (
    <>
      {showCropper && cropSource && (
        <ImageCropperModal
          image={cropSource}
          aspectRatio={getCropAspect()}
          cropShape={cropTarget === "banner" ? "rect" : "round"}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          title={
            cropTarget === "banner" ? "Crop Banner" : "Crop Profile Picture"
          }
        />
      )}
      <main className="mx-2 my-2 flex flex-col text-white lg:mx-6 lg:mb-10 lg:h-fit">
        {/* Back Menu */}
        <BackButton />

        {/* Settings Form */}
        <div className="flex w-full flex-col px-2">
          {/* form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 lg:gap-0"
          >
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-4">
                  <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 md:text-base lg:text-xl">
                    Profile Picture
                    <span className="align-super text-[12px] text-red-700">
                      {" *"}
                    </span>
                  </h3>
                  <label
                    className="relative h-16 w-16 cursor-pointer lg:h-24 lg:w-24"
                    onClick={() => {
                      setShowProfileModal(true);
                      console.log("open modal");
                    }}
                  >
                    <div className="group relative h-16 w-16 cursor-pointer overflow-hidden rounded-full lg:h-24 lg:w-24">
                      {profilePictureUrl &&
                      profilePictureUrl !== "null" &&
                      profilePictureUrl !== "" &&
                      profilePicturePreview === null ? (
                        <Image
                          src={profilePictureUrl}
                          alt="profile"
                          fill
                          className="h-full w-full rounded-full bg-white object-cover"
                        />
                      ) : (
                        <Image
                          src={profilePicturePreview || logoUsersComment}
                          alt="profile"
                          fill
                          className="h-full w-full rounded-full bg-white object-cover"
                        />
                      )}
                      <div className="absolute right-0 bottom-0 left-0 flex h-[28%] items-center justify-center bg-black/40">
                        <Image
                          src={IconsCameraAdd}
                          alt="camera icon"
                          width={16}
                          height={16}
                          className="scale-110 object-contain"
                        />
                      </div>
                    </div>
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 md:text-base lg:text-xl">
                    Banner Profile IMG
                  </h3>
                  <div className="relative flex-1 overflow-hidden rounded-xl">
                    <label className="relative block h-full w-full cursor-pointer lg:max-h-42 lg:max-w-[70%]">
                      {bannerProfileUrl &&
                      bannerProfileUrl !== "null" &&
                      bannerProfileUrl !== "" &&
                      bannerProfilePicturePreview === null ? (
                        <Image
                          src={bannerProfileUrl}
                          alt="profile"
                          width={1080}
                          height={200}
                          className="aspect-auto h-full w-full object-cover object-center"
                        />
                      ) : (
                        <Image
                          src={bannerProfilePicturePreview || BannerCreator}
                          alt="banner"
                          width={1080}
                          height={200}
                          className="aspect-auto h-full w-full object-cover object-center"
                        />
                      )}

                      <div className="absolute top-1/2 right-0 left-0 flex h-[28%] -translate-y-1/2 items-center justify-center gap-2 bg-black/40">
                        <Image
                          src={IconsGalery}
                          alt="camera icon"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                        <p className="font-bold text-white">Upload</p>
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                        id="banner-profile-picture"
                        onChange={(e) => handleFileUpload(e)}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-4">
                  <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 md:text-base lg:text-xl">
                    Profile Name
                    <span className="align-super text-[12px] text-red-700">
                      {" *"}
                    </span>
                  </h3>
                  <div className="flex-1">
                    <input
                      type="text"
                      className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                      onChange={(e) => {
                        let value = e.target.value;
                        // cuma huruf dan spasi
                        value = value.replace(/[^a-zA-Z\s]/g, "");
                        // maksimal 40 karakter
                        value = value.slice(0, 40);

                        setProfileName(value);
                      }}
                      value={profileName}
                      placeholder="Masukan Profile Name"
                      maxLength={40}
                      required
                    />
                  </div>
                </div>
                <div className="group relative flex items-center gap-4">
                  <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 lg:text-xl">
                    Username<span className="text-red-700"> *</span>
                  </h3>
                  <div className="flex-1">
                    {!canChangeUsername && (
                      <span className="absolute -top-12 left-1/2 -translate-x-1/2 rounded-md bg-black px-3 py-1.5 text-sm whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                        Username hanya bisa diubah 3 bulan sekali
                      </span>
                    )}
                    <input
                      type="text"
                      className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-gray-400"
                      onChange={(e) => {
                        // Ambil value
                        let value = e.target.value;

                        // Hanya izinkan huruf a-z (besar & kecil)
                        value = value.replace(/[^a-zA-Z]/g, "");

                        // maksimal 40 karakter
                        value = value.slice(0, 40);

                        // Update state
                        setUsername(value);
                      }}
                      value={username}
                      placeholder="Masukan username"
                      disabled={!canChangeUsername}
                      maxLength={40}
                      required
                    />
                  </div>
                </div>
              </div>
              {/* bio */}
              <div className="flex items-start gap-4">
                <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 lg:text-xl">
                  Bio
                </h3>

                <div className="flex-1">
                  <textarea
                    className="w-full resize-none overflow-hidden rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                    placeholder="Tell us about you, max 150 characters."
                    value={bio}
                    maxLength={150}
                    rows={1}
                    onChange={(e) => {
                      const el = e.target;

                      // reset height kalo kosong
                      el.style.height = "auto";
                      el.style.height = el.scrollHeight + "px";

                      setBio(el.value);
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-4">
                  <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 md:text-base lg:text-xl">
                    Email
                    <span className="align-super text-[12px] text-red-700">
                      {" *"}
                    </span>
                  </h3>
                  <div className="flex-1">
                    <input
                      type="email"
                      className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1 select-none"
                      value={email}
                      placeholder="Masukan Email"
                      readOnly
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      onDrag={(e) => e.preventDefault()}
                      onDrop={(e) => e.preventDefault()}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 md:text-base lg:text-xl">
                    Phone
                    <span className="align-super text-[12px] text-red-700">
                      {" *"}
                    </span>
                  </h3>
                  <div className="flex-1">
                    <input
                      type="tel"
                      className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                      onChange={(e) => {
                        // gaboleh angka
                        const value = e.target.value.replace(/\D/g, "");
                        setPhone(value);
                        // otomatis 0 didepan
                        if (value.length > 0 && value[0] !== "0") {
                          setPhone("0" + value);
                        } else {
                          setPhone(value);
                        }
                      }}
                      value={phone}
                      placeholder="Masukan Nomor Telepon"
                      maxLength={12}
                      onBlur={() => {
                        if (phone.length < 10 || phone.length > 12) {
                          setToastMessage("Nomor telepon harus 10–12 digit");
                          setToastType("failed");
                          setShowToast(true);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 lg:text-xl">
                      Date Of Birth
                    </h3>
                    <div className="flex-1">
                      <input
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
                        className="w-full appearance-none rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1 text-white"
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        value={dateOfBirth || ""}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 md:text-base lg:text-xl">
                    Gender
                  </h3>
                  <div className="flex-1">
                    <div className="flex items-center gap-6 text-white">
                      <label className="flex cursor-pointer items-center gap-1">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          className="accent-green-500"
                          checked={gender === "Male"}
                          onChange={(e) => setGender(e.target.value)}
                        />
                        <span>Male</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-1">
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          className="accent-green-500"
                          checked={gender === "Female"}
                          onChange={(e) => setGender(e.target.value)}
                        />
                        <span>Female</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {/* Country & Social Links */}
              <div className="flex items-center gap-4">
                <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 lg:text-xl">
                  Country / Region
                </h3>
                <div className="flex-1">
                  <select
                    className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1 text-white"
                    onChange={(e) => setRegion(e.target.value)}
                    value={region}
                  >
                    <option className="bg-[#222222] text-white" value="">
                      Pilih Region
                    </option>
                    <option
                      className="bg-[#222222] text-white"
                      value="Indonesia"
                    >
                      Indonesia
                    </option>
                    <option
                      className="bg-[#222222] text-white"
                      value="Malaysia"
                    >
                      Malaysia
                    </option>
                    <option
                      className="bg-[#222222] text-white"
                      value="Thailand"
                    >
                      Thailand
                    </option>
                    <option className="bg-[#222222] text-white" value="Vietnam">
                      Vietnam
                    </option>
                    <option
                      className="bg-[#222222] text-white"
                      value="Philippines"
                    >
                      Philippines
                    </option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 md:text-base lg:text-xl">
                  Instagram Link
                </h3>
                <div className="flex-1">
                  <input
                    type="text"
                    className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                    placeholder="https://www.instagram.com/profilename"
                    value={instagramUrl || ""}
                    onChange={(e) => setInstagramUrl(e.target.value.trim())}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 md:text-base lg:text-xl">
                  Tiktok Link
                </h3>
                <div className="flex-1">
                  <input
                    type="text"
                    className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                    placeholder="https://www.tiktok.com/@profilename"
                    value={tiktokUrl || ""}
                    onChange={(e) => setTiktokUrl(e.target.value.trim())}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 md:text-base lg:text-xl">
                  Twitter/X Link
                </h3>
                <div className="flex-1">
                  <input
                    type="text"
                    className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                    placeholder="https://www.x.com/profilename"
                    value={twitterUrl || ""}
                    onChange={(e) => setTwitterUrl(e.target.value.trim())}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 md:text-base lg:text-xl">
                  Facebook Link
                </h3>
                <div className="flex-1">
                  <input
                    type="text"
                    className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                    placeholder="https://www.facebook.com/profilename"
                    value={facebookUrl || ""}
                    onChange={(e) => setFacebookUrl(e.target.value.trim())}
                  />
                </div>
              </div>
            </div>

            {/* button */}
            <button
              className="mt-1 flex cursor-pointer justify-center gap-2 rounded-lg border border-[#F5F5F559] bg-[#0E5BA8] py-2 font-bold text-white hover:bg-[#0E5BA8]/80 lg:mt-8"
              type="submit"
            >
              <span className="flex">
                <Image
                  priority
                  className="aspect-auto"
                  height={16}
                  width={16}
                  alt="icon-save-changes"
                  src={IconsSaveChanges}
                />
              </span>
              <p>{isLoading ? "Saving..." : "Save Changes"}</p>
            </button>
          </form>
        </div>

        <ProfileModal
          isShow={showProfileModal}
          setIsShow={setShowProfileModal}
          onImageUpload={(e) => {
            const file = e.target.files[0];
            if (file) {
              setShowProfileModal(false);
              openCropper(file, "profile");
            }
          }}
          onIconSelect={(iconImage, iconUrl) => {
            setSelectedIconUrl(iconUrl);
            setProfilePicturePreview(iconImage);
            setProfilePictureUrl(null); // reset file kalau pilih icon
            setShowProfileModal(false);
          }}
        />
      </main>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      {(isLoading || isUpdateCreatorLoading) && <LoadingOverlay />}
    </>
  );
}
