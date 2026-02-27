/* eslint-disable react/react-in-jsx-scope */
"use client";
import BackButton from "@/components/BackButton/page";
import Toast from "@/components/Toast/page";
import IconsCameraAdd from "@@/icons/icons-camera-add.svg";
import IconsSaveChanges from "@@/icons/icons-save-changes.svg";
import logoUsersComment from "@@/icons/logo-users-comment.svg";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";
import { useUpdateUserMutation } from "@/hooks/api/userSliceAPI";
import ProfileModal from "@/components/Modal/ProfileModal";
import { useAuth } from "@/components/Context/AuthContext";

export default function UserSettingsPage() {
  const todayDate = new Date().toISOString().split("T")[0];
  const today = new Date();
  const minAgeDate = new Date(
    today.getFullYear() - 13,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [userId, setUserId] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setdateOfBirth] = useState("");
  const [region, setRegion] = useState("");
  const [uploadedPhotoProfile, setuploadedPhotoProfile] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [token, setToken] = useState("");
  const [canChangeUsername, setCanChangeUsername] = useState(true);
  const [canChangeDateOfBirth, setCanChangeDateOfBirth] = useState(true);
  const [updateUser] = useUpdateUserMutation();
  const { refreshUser } = useAuth();
  const [isShowProfileModal, setIsShowProfileModal] = useState(false);
  const [selectedIconUrl, setSelectedIconUrl] = useState(null);

  const handleIconSelect = (icon, url) => {
    setuploadedPhotoProfile(icon); // Set preview gambar dengan URL ikon
    setSelectedIconUrl(url); // Simpan URL ikon untuk dikirim ke backend
    setImageFile(null); // Hapus file jika sebelumnya user sudah memilih file
    setIsShowProfileModal(false); // Langsung tutup modal
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // bio gaboleh spasi doang
    if (bio && bio.trim().length === 0) {
      setToastMessage("Bio tidak boleh hanya berisi spasi");
      setToastType("failed");
      setShowToast(true);
      return;
    }

    // profile gaboleh spasi doang
    if (!profileName.trim()) {
      setToastMessage("Profile name tidak valid");
      setToastType("failed");
      setShowToast(true);
      return;
    }

    // username gaboleh spasi doang
    if (!username.trim()) {
      setToastMessage("Username tidak valid");
      setToastType("failed");
      setShowToast(true);
      return;
    }

    if (profileName === "" || username === "" || email === "") {
      setShowToast(true);
      setToastMessage("Profile Name, Username, dan Email Wajib diisi");
      setToastType("failed");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("profileName", profileName);
      formData.append("username", username);
      formData.append("bio", bio);
      if (gender !== "" && gender !== null) {
        formData.append("gender", gender);
      }
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("dateOfBirth", dateOfBirth);
      formData.append("region", region);

      if (imageFile) {
        formData.append("imageUrl", imageFile);
      } else if (selectedIconUrl) {
        formData.append("iconUrl", selectedIconUrl);
      }

      const response = await updateUser(formData).unwrap();
      const updatedUser = response.data || response;

      // jika ada image simpan
      if (updatedUser?.imageUrl) {
        localStorage.setItem("image_users", updatedUser.imageUrl);
      }

      await refreshUser();

      // notif
      setToastMessage("Profil berhasil diupdate!");
      setToastType("success");
      setShowToast(true);

      setTimeout(() => {
        // full reload
        window.location.href = `/user/${updatedUser.id}`;
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      console.error("Error during patch request:", error);
      setShowToast(true);
      setToastMessage(`${error?.data?.message || "Update gagal"}`);
      setToastType("failed");
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setuploadedPhotoProfile(URL.createObjectURL(file));
      setImageFile(file);
    }
    setIsShowProfileModal(false);
  };

  const handleDateOfBirthChange = (event) => {
    const value = event.target.value;
    const year = value?.split("-")?.[0] || "";

    if (year.length > 4) {
      event.target.value = dateOfBirth || "";
      return;
    }

    setdateOfBirth(value);
  };

  const getData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersData = response.data.data.data;

      setProfileName(usersData.profileName || "");
      setUsername(usersData.username || "");
      setBio(usersData.bio || "");
      setGender(usersData.gender || "");
      setEmail(usersData.email || "");
      setPhone(usersData.phone || "");

      // konversi format tgl lahir
      const dob = usersData.dateOfBirth
        ? new Date(usersData.dateOfBirth).toISOString().split("T")[0]
        : "";

      setdateOfBirth(dob);
      setCanChangeDateOfBirth(!usersData.dateOfBirth);
      setRegion(usersData.region || "");
      setCanChangeUsername(usersData.canChangeUsername || false);
      setImageUrl(usersData.imageUrl || null);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const userIdFromSession = localStorage.getItem("users_id");
    const tokenFromSession = localStorage.getItem("token");

    setUserId(userIdFromSession);
    setToken(tokenFromSession);
  }, []);

  useEffect(() => {
    if (userId && token) {
      getData();
    }
  }, [userId, token]);

  return (
    <>
      <main className="mx-2 my-2 flex flex-col text-white lg:mx-6 lg:mb-10 lg:h-fit lg:min-h-[80vh]">
        {/* Back Menu */}
        <BackButton />

        {/* Settings Form */}
        <div className="flex w-full flex-col px-2">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 lg:gap-0"
          >
            <div className="flex flex-col gap-2">
              {/* profile */}
              <div className="flex items-center gap-4">
                <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 md:text-base lg:text-xl">
                  Profile Picture
                </h3>
                <label
                  className="relative h-16 w-16 cursor-pointer lg:h-24 lg:w-24"
                  onClick={() => setIsShowProfileModal(true)}
                >
                  <div className="group relative h-16 w-16 overflow-hidden rounded-full bg-amber-600 lg:h-24 lg:w-24">
                    {imageUrl &&
                      imageUrl !== "null" &&
                      !uploadedPhotoProfile ? (
                      <Image
                        src={imageUrl}
                        alt="profile"
                        fill
                        className="h-full w-full rounded-full bg-white object-cover"
                      />
                    ) : (
                      <Image
                        src={uploadedPhotoProfile || logoUsersComment}
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* name */}
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
                        // maksimal 20 karakter
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
                {/* username */}
                <div className="group relative flex items-center gap-4">
                  <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 lg:text-xl">
                    Username<span className="text-red-700"> *</span>
                  </h3>
                  <div className="relative flex-1">
                    {!canChangeUsername && (
                      <span className="pointer-events-none absolute -top-11 left-1/2 z-20 hidden w-max max-w-60 -translate-x-1/2 rounded-md bg-black px-3 py-1.5 text-center text-sm whitespace-normal text-white opacity-0 transition-opacity md:block md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                        Username hanya bisa diubah 3 bulan sekali
                      </span>
                    )}
                    <input
                      type="text"
                      className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-gray-400"
                      onChange={(e) => {
                        let value = e.target.value;
                        // cuma abjad
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
                    {!canChangeUsername && (
                      <p className="mt-1 text-xs text-[#979797] md:hidden">
                        Username hanya bisa diubah 3 bulan sekali
                      </p>
                    )}
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
                {/* email */}
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
                {/* phone */}
                <div className="flex items-center gap-4">
                  <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 lg:text-xl">
                    Phone
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
                {/* dob */}
                <div className="group relative flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 lg:text-xl">
                      Date Of Birth
                    </h3>
                    <div className="relative flex-1">
                      {!canChangeDateOfBirth && (
                        <span className="pointer-events-none absolute -top-11 left-1/2 z-20 hidden w-max max-w-60 -translate-x-1/2 rounded-md bg-black px-3 py-1.5 text-center text-sm whitespace-normal text-white opacity-0 transition-opacity md:block md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                          Date of birth hanya bisa diisi sekali
                        </span>
                      )}
                      <input
                        type="date"
                        className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-gray-400"
                        onChange={handleDateOfBirthChange}
                        value={dateOfBirth}
                        placeholder="Masukan Tanggal Lahir"
                        max={todayDate}
                        min={minAgeDate}
                        disabled={!canChangeDateOfBirth}
                      />
                      {!canChangeDateOfBirth && (
                        <p className="mt-1 text-xs text-[#979797] md:hidden">
                          Date of birth hanya bisa diisi sekali
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* gender */}
                <div className="flex items-center gap-4">
                  <h3 className="w-40 text-base font-semibold text-[#979797] md:w-56 lg:text-xl">
                    Gender
                  </h3>
                  <div className="flex-1">
                    <div className="flex items-center gap-6">
                      <label className="flex cursor-pointer items-center gap-1">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          className="accent-green-500"
                          onChange={(e) => setGender(e.target.value)}
                          checked={gender === "Male"}
                        />
                        <span>Male</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-1">
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          className="accent-green-500"
                          onChange={(e) => setGender(e.target.value)}
                          checked={gender === "Female"}
                        />
                        <span>Female</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {/* region */}
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
      </main>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      <ProfileModal
        isShow={isShowProfileModal}
        setIsShow={setIsShowProfileModal}
        onImageUpload={handleFileUpload}
        onIconSelect={handleIconSelect}
      />
    </>
  );
}
