"use client";
import React from "react";
import BackButton from "@/components/BackButton/page";
import Toast from "@/components/Toast/page";
import IconsCameraAdd from "@@/icons/icons-camera-add.svg";
import IconsSaveChanges from "@@/icons/icons-save-changes.svg";
import logoUsersComment from "@@/icons/logo-users-comment.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/hooks/api/userSliceAPI";
import ProfileModal from "@/components/Modal/ProfileModal";
import { useAuth } from "@/components/Context/AuthContext";
import LoadingOverlay from "@/components/LoadingOverlay/page";

/*[--- CONSTANTS ---]*/
const REGIONS = ["Indonesia", "Malaysia", "Thailand", "Vietnam", "Philippines"];

export default function UserSettingsPage() {
  const { refreshUser } = useAuth();
  const today = new Date().toISOString().split("T")[0];

  /*[--- UI STATE ---]*/
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [isShowProfileModal, setIsShowProfileModal] = useState(false);

  /*[--- IMAGE STATE ---]*/
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadedPhotoProfile, setUploadedPhotoProfile] = useState(null);
  const [selectedIconUrl, setSelectedIconUrl] = useState(null);

  /*[--- FORM STATE ---]*/
  const [profileName, setProfileName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [region, setRegion] = useState("");
  const [canChangeUsername, setCanChangeUsername] = useState(true);
  const [canChangeDob, setCanChangeDob] = useState(true);

  /*[--- API HOOKS ---]*/
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("users_id") : null;

  const { data } = useGetUserByIdQuery(userId, {
    skip: !userId,
  });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  /*[--- HELPERS ---]*/
  const showError = (message) => {
    setToastMessage(message);
    setToastType("failed");
    setShowToast(true);
  };

  /*[--- EFFECT: populate form from API ---]*/
  useEffect(() => {
    if (!data) return;
    const d = data?.data?.data;
    if (!d) return;

    setProfileName(d.profileName || "");
    setUsername(d.username || "");
    setBio(d.bio || "");
    setGender(d.gender || "");
    setEmail(d.email || "");
    setPhone(d.phone || "");
    setRegion(d.region || "");
    setCanChangeUsername(d.canChangeUsername || false);
    setCanChangeDob(d.canChangeDob ?? true);
    setImageUrl(d.imageUrl || null);

    if (d.dateOfBirth) {
      setDateOfBirth(new Date(d.dateOfBirth).toISOString().split("T")[0]);
    }
  }, [data]);

  /*[--- IMAGE HANDLERS ---]*/
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedPhotoProfile(URL.createObjectURL(file));
      setImageFile(file);
    }
    setIsShowProfileModal(false);
  };

  const handleIconSelect = (icon, url) => {
    setUploadedPhotoProfile(icon);
    setSelectedIconUrl(url);
    setImageFile(null);
    setIsShowProfileModal(false);
  };

  /*[--- SUBMIT ---]*/
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (bio && bio.trim().length === 0) {
      showError("Bio tidak boleh hanya berisi spasi");
      return;
    }
    if (!profileName.trim()) {
      showError("Profile name tidak valid");
      return;
    }
    if (!username.trim()) {
      showError("Username tidak valid");
      return;
    }
    if (!profileName || !username || !email) {
      showError("Profile Name, Username, dan Email Wajib diisi");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("profileName", profileName);
      formData.append("username", username);
      formData.append("bio", bio || "");
      formData.append("email", email);

      if (gender) formData.append("gender", gender);
      if (phone) formData.append("phone", phone);
      if (dateOfBirth) formData.append("dateOfBirth", dateOfBirth);
      if (region) formData.append("region", region);

      if (imageFile) {
        formData.append("imageUrl", imageFile);
      } else if (selectedIconUrl) {
        formData.append("iconUrl", selectedIconUrl);
      }

      const response = await updateUser(formData).unwrap();
      const updatedUser = response.data || response;

      if (updatedUser?.imageUrl) {
        localStorage.setItem("image_users", updatedUser.imageUrl);
      }

      await refreshUser();

      setToastMessage("Profil berhasil diupdate!");
      setToastType("success");
      setShowToast(true);

      setTimeout(() => {
        window.location.href = `/user/${updatedUser.id}`;
      }, 1000);
    } catch (error) {
      console.error("Error during patch request:", error);
      showError(error?.data?.message || "Update gagal");
    }
  };

  /*[--- RENDER ---]*/
  return (
    <>
      <main className="mx-2 my-2 flex flex-col text-white lg:mx-6 lg:mb-10 lg:h-fit lg:min-h-[80vh]">
        <BackButton />

        <div className="flex w-full flex-col px-2">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 lg:gap-0"
          >
            <div className="flex flex-col gap-2">
              {/* ===== PROFILE PICTURE ===== */}
              <div className="flex items-center gap-4">
                <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 lg:text-xl">
                  Profile Picture
                </h3>
                <label
                  className="relative h-16 w-16 cursor-pointer lg:h-24 lg:w-24"
                  onClick={() => setIsShowProfileModal(true)}
                >
                  <div className="group relative h-16 w-16 overflow-hidden rounded-full bg-amber-600 lg:h-24 lg:w-24">
                    <Image
                      src={
                        uploadedPhotoProfile ||
                        (imageUrl && imageUrl !== "null"
                          ? imageUrl
                          : logoUsersComment)
                      }
                      alt="profile"
                      fill
                      className="h-full w-full rounded-full bg-white object-cover"
                    />
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
                      maxLength={20}
                      required
                      onChange={(e) =>
                        setProfileName(
                          e.target.value
                            .replace(/[^a-zA-Z\s]/g, "")
                            .slice(0, 20),
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
                      required
                      onChange={(e) =>
                        setUsername(e.target.value.replace(/[^a-zA-Z]/g, ""))
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
                    Email<span className="text-red-700"> *</span>
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
                        if (
                          phone.length > 0 &&
                          (phone.length < 10 || phone.length > 12)
                        ) {
                          showError("Nomor telepon harus 10–12 digit");
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ===== DATE OF BIRTH + GENDER ===== */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="group relative flex items-center gap-4">
                  <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 lg:text-xl">
                    Date Of Birth
                  </h3>
                  <div className="flex-1">
                    {!canChangeDob && (
                      <span className="absolute -top-12 left-1/2 -translate-x-1/2 rounded-md bg-black px-3 py-1.5 text-sm whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                        Tanggal lahir hanya dapat diubah satu kali
                      </span>
                    )}
                    <input
                      type="date"
                      className="w-full appearance-none rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1 text-white disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-gray-400"
                      value={dateOfBirth || ""}
                      min="1945-01-01"
                      max={today}
                      disabled={!canChangeDob}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 lg:text-xl">
                    Gender
                  </h3>
                  <div className="flex items-center gap-6">
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
      {isUpdating && <LoadingOverlay />}

      {/* ===== PROFILE MODAL ===== */}
      <ProfileModal
        isShow={isShowProfileModal}
        setIsShow={setIsShowProfileModal}
        onImageUpload={handleFileUpload}
        onIconSelect={handleIconSelect}
      />
    </>
  );
}
