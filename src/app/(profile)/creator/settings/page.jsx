"use client";
import React from "react";
import Toast from "@/components/Toast/page";
import IconsCameraAdd from "@@/icons/icons-camera-add.svg";
import BackButton from "@/components/BackButton/page";
import IconsSaveChanges from "@@/icons/icons-save-changes.svg";
import BannerCreator from "@@/icons/logo-banner-creator.svg";
import IconsGalery from "@@/icons/logo-upload-banner.svg";
import logoUsersComment from "@@/icons/logo-users-comment.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProfileModal from "@/components/Modal/ProfileModal";
import {
  useUpdateCreatorMutation,
  useGetCreatorByIdQuery,
} from "@/hooks/api/creatorSliceAPI";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import { useAuth } from "@/components/Context/AuthContext";
import ImageCropperModal from "@/components/UploadForm/ImageCropperModal";

/*[--- CONSTANTS ---]*/
const SOCIAL_LINKS = [
  {
    key: "instagramUrl",
    label: "Instagram",
    pattern: /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/,
    placeholder: "https://www.instagram.com/profilename",
  },
  {
    key: "tiktokUrl",
    label: "Tiktok",
    pattern: /^https:\/\/(www\.)?tiktok\.com\/@?[a-zA-Z0-9._]+\/?$/,
    placeholder: "https://www.tiktok.com/@profilename",
  },
  {
    key: "twitterUrl",
    label: "Twitter/X",
    pattern: /^https:\/\/(www\.)?(x\.com|twitter\.com)\/[a-zA-Z0-9_]+\/?$/,
    placeholder: "https://www.x.com/profilename",
  },
  {
    key: "facebookUrl",
    label: "Facebook",
    pattern: /^https:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/,
    placeholder: "https://www.facebook.com/profilename",
  },
];

const REGIONS = ["Indonesia", "Malaysia", "Thailand", "Vietnam", "Philippines"];

const normalize = (v) => (v === null || v === "null" ? "" : (v ?? ""));

export default function CreatorSettingsPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  /*[--- UI STATE ---]*/
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);

  /*[--- CROP STATE ---]*/
  const [showCropper, setShowCropper] = useState(false);
  const [cropTarget, setCropTarget] = useState(null);
  const [cropSource, setCropSource] = useState(null);
  const [pendingFileName, setPendingFileName] = useState("");

  /*[--- PREVIEW STATE ---]*/
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [bannerProfilePicturePreview, setBannerProfilePicturePreview] =
    useState(null);

  /*[--- FORM STATE ---]*/
  const [id, setId] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [bannerProfileUrl, setBannerProfileUrl] = useState(null);
  const [selectedIconUrl, setSelectedIconUrl] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("Male");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [region, setRegion] = useState("");
  const [canChangeUsername, setCanChangeUsername] = useState(true);
  const [socialUrls, setSocialUrls] = useState({
    instagramUrl: "",
    tiktokUrl: "",
    twitterUrl: "",
    facebookUrl: "",
  });

  /*[--- API HOOKS ---]*/
  // ⚠️ NOTE: getCreatorById di creatorSliceAPI ada bug URL
  // `url: creator/${id}` → dengan baseUrl /creator, jadi /creator/creator/:id
  // Harusnya `url: `/${id}`` — sesuaikan setelah API diperbaiki
  const creatorId =
    typeof window !== "undefined" ? localStorage.getItem("creators_id") : null;

  const { data: creatorData, isLoading: isLoadingGet } = useGetCreatorByIdQuery(
    creatorId,
    { skip: !creatorId },
  );

  const [updateCreator, { isLoading: isUpdating }] = useUpdateCreatorMutation();

  /*[--- HELPERS ---]*/
  const showError = (message) => {
    setToastMessage(message);
    setToastType("failed");
    setShowToast(true);
  };

  const validateSocialUrl = (value, pattern, label) => {
    if (!value) return null;
    const trimmed = value.trim();
    if (/\s/.test(trimmed)) return `Format URL ${label} tidak valid`;
    try {
      new URL(trimmed);
      if (!pattern.test(trimmed)) return `Format URL ${label} tidak valid`;
      return null;
    } catch {
      return `Format URL ${label} tidak valid`;
    }
  };

  /*[--- EFFECT: set id from localStorage ---]*/
  useEffect(() => {
    const storedId = localStorage.getItem("creators_id");
    if (storedId) setId(storedId);
  }, []);

  /*[--- EFFECT: populate form from API ---]*/
  useEffect(() => {
    if (!creatorData) return;
    const d = creatorData?.data?.data?.data;
    if (!d) return;

    setProfilePictureUrl(normalize(d.imageUrl));
    setBannerProfileUrl(normalize(d.bannerImageUrl));
    setProfileName(normalize(d.profileName));
    setUsername(normalize(d.username));
    setBio(normalize(d.bio));
    setGender(normalize(d.gender) || "Male");
    setEmail(normalize(d.email));
    setPhone(normalize(d.phone));
    setRegion(normalize(d.region));
    setCanChangeUsername(d.canChangeUsername || false);
    setSocialUrls({
      instagramUrl: normalize(d.instagramUrl),
      tiktokUrl: normalize(d.tiktokUrl),
      twitterUrl: normalize(d.twitterUrl),
      facebookUrl: normalize(d.facebookUrl),
    });

    if (d.dateOfBirth) {
      setDateOfBirth(new Date(d.dateOfBirth).toISOString().split("T")[0]);
    }
  }, [creatorData]);

  /*[--- EFFECT: cleanup object URLs on unmount ---]*/
  useEffect(() => {
    return () => {
      if (profilePicturePreview) URL.revokeObjectURL(profilePicturePreview);
      if (bannerProfilePicturePreview)
        URL.revokeObjectURL(bannerProfilePicturePreview);
    };
  }, [profilePicturePreview, bannerProfilePicturePreview]);

  /*[--- CROP HANDLERS ---]*/
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

  const handleCropComplete = (croppedBlob) => {
    if (!cropTarget) return;
    const croppedFile = new File(
      [croppedBlob],
      pendingFileName || `${cropTarget}-image.jpg`,
      { type: "image/jpeg", lastModified: Date.now() },
    );
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

  const handleFileUpload = (e, target) => {
    const file = e.target.files[0];
    if (!file) return;
    const resolvedTarget =
      target === "profile"
        ? "profile"
        : e.target.id === "banner-profile-picture"
          ? "banner"
          : null;
    if (resolvedTarget) openCropper(file, resolvedTarget);
  };

  /*[--- SUBMIT ---]*/
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profileName?.trim() || !email) {
      showError("Profile Name dan Email wajib diisi");
      return;
    }

    if (canChangeUsername && !username?.trim()) {
      showError("Username wajib diisi");
      return;
    }

    const socialError = SOCIAL_LINKS.map(({ key, label, pattern }) =>
      validateSocialUrl(socialUrls[key], pattern, label),
    ).find(Boolean);

    if (socialError) {
      showError(socialError);
      return;
    }

    try {
      const cleanVal = (v) => v ?? "";
      const formData = new FormData();

      formData.append("id", id);
      formData.append("profileName", profileName);
      formData.append("username", username);
      formData.append("bio", cleanVal(bio));
      formData.append("gender", gender || "Male");
      formData.append("email", email);
      formData.append("phone", cleanVal(phone));
      formData.append("dateOfBirth", cleanVal(dateOfBirth));
      formData.append("region", cleanVal(region));

      SOCIAL_LINKS.forEach(({ key }) => {
        formData.append(key, cleanVal(socialUrls[key]));
      });

      if (profilePictureUrl instanceof File) {
        formData.append("imageUrl", profilePictureUrl);
      } else if (selectedIconUrl) {
        formData.append("iconUrl", selectedIconUrl);
      }

      if (bannerProfileUrl instanceof File) {
        formData.append("bannerImageUrl", bannerProfileUrl);
      }

      const response = await updateCreator(formData).unwrap();
      const updated = response?.data?.data || response?.data || response;

      if (updated?.imageUrl) {
        localStorage.setItem("image_users", updated.imageUrl);
        localStorage.setItem("image_creators", updated.imageUrl);
      }

      setToastMessage("Profil berhasil diupdate!");
      setToastType("success");
      setShowToast(true);

      try {
        await refreshUser?.();
      } catch (err) {
        console.warn("refreshUser failed:", err);
      }

      setTimeout(() => router.push(`/creator/${id}`), 1500);
    } catch (error) {
      console.error("Error during patch request:", error);
      showError(
        error?.data?.message ||
          error?.message ||
          "Terjadi kesalahan saat update profil",
      );
    }
  };

  /*[--- RENDER ---]*/
  return (
    <>
      {/* ===== IMAGE CROPPER MODAL ===== */}
      {showCropper && cropSource && (
        <ImageCropperModal
          image={cropSource}
          aspectRatio={cropTarget === "banner" ? 16 / 9 : 1}
          cropShape={cropTarget === "banner" ? "rect" : "round"}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          title={
            cropTarget === "banner" ? "Crop Banner" : "Crop Profile Picture"
          }
        />
      )}

      <main className="mx-2 my-2 flex flex-col text-white lg:mx-6 lg:mb-10 lg:h-fit">
        <BackButton />

        <div className="flex w-full flex-col px-2">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 lg:gap-0"
          >
            <div className="flex flex-col gap-2">
              {/* ===== IMAGES ROW ===== */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Profile Picture */}
                <div className="flex items-center gap-4">
                  <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 lg:text-xl">
                    Profile Picture
                    <span className="align-super text-[12px] text-red-700">
                      {" "}
                      *
                    </span>
                  </h3>
                  <label
                    className="relative h-16 w-16 cursor-pointer lg:h-24 lg:w-24"
                    onClick={() => setShowProfileModal(true)}
                  >
                    <div className="group relative h-16 w-16 overflow-hidden rounded-full lg:h-24 lg:w-24">
                      <Image
                        src={
                          profilePicturePreview ||
                          (profilePictureUrl &&
                          profilePictureUrl !== "null" &&
                          profilePictureUrl !== ""
                            ? profilePictureUrl
                            : logoUsersComment)
                        }
                        alt="profile"
                        fill
                        className="h-full w-full rounded-full bg-white object-cover"
                      />
                      <div className="absolute right-0 bottom-0 left-0 flex h-[28%] items-center justify-center bg-black/40">
                        <Image
                          src={IconsCameraAdd}
                          alt="camera"
                          width={16}
                          height={16}
                          className="scale-110 object-contain"
                        />
                      </div>
                    </div>
                  </label>
                </div>

                {/* Banner */}
                <div className="flex items-center gap-4">
                  <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 lg:text-xl">
                    Banner Profile IMG
                  </h3>
                  <div className="relative flex-1 overflow-hidden rounded-xl">
                    <label className="relative block h-full w-full cursor-pointer lg:max-h-42 lg:max-w-[70%]">
                      <Image
                        src={
                          bannerProfilePicturePreview ||
                          (bannerProfileUrl &&
                          bannerProfileUrl !== "null" &&
                          bannerProfileUrl !== ""
                            ? bannerProfileUrl
                            : BannerCreator)
                        }
                        alt="banner"
                        width={1080}
                        height={200}
                        className="aspect-auto h-full w-full object-cover object-center"
                      />
                      <div className="absolute top-1/2 right-0 left-0 flex h-[28%] -translate-y-1/2 items-center justify-center gap-2 bg-black/40">
                        <Image
                          src={IconsGalery}
                          alt="upload"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                        <p className="font-bold text-white">Upload</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        id="banner-profile-picture"
                        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                        onChange={(e) => handleFileUpload(e)}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* ===== PROFILE NAME + USERNAME ===== */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-4">
                  <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 lg:text-xl">
                    Profile Name
                    <span className="align-super text-[12px] text-red-700">
                      {" "}
                      *
                    </span>
                  </h3>
                  <div className="flex-1">
                    <input
                      type="text"
                      className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                      value={profileName}
                      placeholder="Masukan Profile Name"
                      maxLength={40}
                      required
                      onChange={(e) =>
                        setProfileName(
                          e.target.value
                            .replace(/[^a-zA-Z\s]/g, "")
                            .slice(0, 40),
                        )
                      }
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
                      value={username}
                      placeholder="Masukan username"
                      disabled={!canChangeUsername}
                      maxLength={40}
                      required
                      onChange={(e) =>
                        setUsername(
                          e.target.value.replace(/[^a-zA-Z]/g, "").slice(0, 40),
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {/* ===== BIO ===== */}
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
                      el.style.height = "auto";
                      el.style.height = el.scrollHeight + "px";
                      setBio(el.value);
                    }}
                  />
                </div>
              </div>

              {/* ===== EMAIL + PHONE ===== */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-4">
                  <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 lg:text-xl">
                    Email
                    <span className="align-super text-[12px] text-red-700">
                      {" "}
                      *
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
                  <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 lg:text-xl">
                    Phone
                    <span className="align-super text-[12px] text-red-700">
                      {" "}
                      *
                    </span>
                  </h3>
                  <div className="flex-1">
                    <input
                      type="tel"
                      className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                      value={phone}
                      placeholder="Masukan Nomor Telepon"
                      maxLength={12}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "");
                        setPhone(
                          digits.length > 0 && digits[0] !== "0"
                            ? "0" + digits
                            : digits,
                        );
                      }}
                      onBlur={() => {
                        if (phone.length < 10 || phone.length > 12) {
                          showError("Nomor telepon harus 10–12 digit");
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ===== DATE OF BIRTH + GENDER ===== */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-4">
                  <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 lg:text-xl">
                    Date Of Birth
                  </h3>
                  <div className="flex-1">
                    <input
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      className="w-full appearance-none rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1 text-white"
                      value={dateOfBirth || ""}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 lg:text-xl">
                    Gender
                  </h3>
                  <div className="flex items-center gap-6 text-white">
                    {["Male", "Female"].map((g) => (
                      <label
                        key={g}
                        className="flex cursor-pointer items-center gap-1"
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          className="accent-green-500"
                          checked={gender === g}
                          onChange={(e) => setGender(e.target.value)}
                        />
                        <span>{g}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* ===== REGION ===== */}
              <div className="flex items-center gap-4">
                <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 lg:text-xl">
                  Country / Region
                </h3>
                <div className="flex-1">
                  <select
                    className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1 text-white"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  >
                    <option className="bg-[#222222] text-white" value="">
                      Pilih Region
                    </option>
                    {REGIONS.map((r) => (
                      <option
                        key={r}
                        className="bg-[#222222] text-white"
                        value={r}
                      >
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ===== SOCIAL LINKS ===== */}
              {SOCIAL_LINKS.map(({ key, label, placeholder }) => (
                <div key={key} className="flex items-center gap-4">
                  <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 lg:text-xl">
                    {label} Link
                  </h3>
                  <div className="flex-1">
                    <input
                      type="text"
                      className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                      placeholder={placeholder}
                      value={socialUrls[key] || ""}
                      onChange={(e) =>
                        setSocialUrls((prev) => ({
                          ...prev,
                          [key]: e.target.value.trim(),
                        }))
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* ===== SUBMIT ===== */}
            <button
              type="submit"
              className="mt-1 flex cursor-pointer justify-center gap-2 rounded-lg border border-[#F5F5F559] bg-[#0E5BA8] py-2 font-bold text-white hover:bg-[#0E5BA8]/80 lg:mt-8"
            >
              <Image
                priority
                className="aspect-auto"
                height={16}
                width={16}
                alt="icon-save-changes"
                src={IconsSaveChanges}
              />
              <p>{isUpdating ? "Saving..." : "Save Changes"}</p>
            </button>
          </form>
        </div>

        {/* ===== PROFILE MODAL ===== */}
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
            setProfilePictureUrl(null);
            setShowProfileModal(false);
          }}
        />
      </main>

      {/* ===== TOAST ===== */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* ===== LOADING OVERLAY ===== */}
      {(isLoadingGet || isUpdating) && <LoadingOverlay />}
    </>
  );
}
