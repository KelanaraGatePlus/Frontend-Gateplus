/* eslint-disable react/react-in-jsx-scope */
"use client";
import BackPage from "@/components/BackPage/page";
import Toast from "@/components/Toast/page";
import IconsCameraAdd from "@@/icons/icons-camera-add.svg";
import IconsSaveChanges from "@@/icons/icons-save-changes.svg";
import logoUsersComment from "@@/icons/logo-users-comment.svg";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SettingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [userId, setUserId] = useState(null);
  const [id, setId] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      console.log("ini gender", gender);
      if (gender !== "" && gender !== null) {
        formData.append("gender", gender);
      }
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("dateOfBirth", dateOfBirth);
      formData.append("region", region);
      if (imageFile) {
        formData.append("imageUrl", imageFile);
      }

      const response = await axios.patch(
        `https://backend-gateplus-api.my.id/users/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      localStorage.setItem("image_users", response.data.data.imageUrl);
      setShowToast(true);
      setToastMessage("Profil berhasil diupdate!");
      setToastType("success");
      setIsLoading(false);
      router.push(`/Users/${id}`);
    } catch (error) {
      setIsLoading(false);
      console.error("Error during patch request:", error);
      setShowToast(true);
      setToastMessage(
        `${error.response.data.message} - ${error.response.data.error}`,
      );
      setToastType("failed");
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setuploadedPhotoProfile(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const getData = async () => {
    try {
      const response = await axios.get(
        `https://backend-gateplus-api.my.id/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const usersData = response.data.data.data;

      setProfileName(usersData.profileName || "");
      setUsername(usersData.username || "");
      setBio(usersData.bio || "");
      setGender(usersData.gender || "");
      setEmail(usersData.email || "");
      setPhone(usersData.phone || "");
      setdateOfBirth(usersData.dateOfBirth || "");
      setRegion(usersData.region || "");
      setId(usersData.id || "");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const userIdFromSession = localStorage.getItem("users_id");
    const imageFromSession = localStorage.getItem("image_users");
    const tokenFromSession = localStorage.getItem("token");

    setUserId(userIdFromSession);
    setImageUrl(imageFromSession);
    setToken(tokenFromSession);
    console.log(token);
  }, []);

  useEffect(() => {
    if (userId && token) {
      getData();
    }
  }, [userId, token]);

  return (
    <>
      <main className="mx-2 my-2 mt-16 flex flex-col md:mt-24 lg:mx-6 lg:mb-10 lg:h-fit lg:min-h-[80vh]">
        {/* Back Menu */}
        <BackPage />

        {/* Settings Form */}
        <div className="flex w-full flex-col px-2">
          {/* form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 lg:gap-0"
          >
            <div className="flex flex-col gap-2">
              {/* profile */}
              <div className="flex items-center gap-2">
                <h3 className="flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                  Profile Picture
                </h3>
                <div className="flex flex-4 text-white md:flex-10">
                  <label className="relative h-16 w-16 cursor-pointer lg:h-24 lg:w-24">
                    <div className="group relative h-16 w-16 cursor-pointer overflow-hidden rounded-full bg-amber-600 lg:h-24 lg:w-24">
                      {imageUrl &&
                        imageUrl !== "null" &&
                        imageUrl !== "" &&
                        uploadedPhotoProfile === null ? (
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
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                      onChange={(e) => handleFileUpload(e)}
                    />
                  </label>
                </div>
              </div>
              {/* name */}
              <div className="flex items-center gap-2">
                <h3 className="flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                  Profile Name
                  <span className="align-super text-[12px] text-red-700">
                    {" *"}
                  </span>
                </h3>
                <div className="flex w-full flex-4 text-white md:flex-10">
                  <input
                    type="text"
                    className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                    onChange={(e) => setProfileName(e.target.value)}
                    value={profileName}
                    placeholder="Masukan Profile Name"
                    required
                  />
                </div>
              </div>
              {/* Username */}
              <div className="flex items-center gap-2">
                <h3 className="flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                  Username
                  <span className="align-super text-[12px] text-red-700">
                    {" *"}
                  </span>
                </h3>
                <div className="flex w-full flex-4 text-white md:flex-10">
                  <input
                    type="text"
                    className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    placeholder="Masukan username"
                    required
                  />
                </div>
              </div>
              {/* Bio */}
              <div className="flex items-center gap-2">
                <h3 className="flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                  Bio
                </h3>
                <div className="flex w-full flex-4 text-white md:flex-10">
                  <textarea
                    name="about"
                    className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                    id="about"
                    cols="30"
                    rows="4"
                    placeholder="Tell us about you, maxs 150 character."
                    onChange={(e) => setBio(e.target.value)}
                    value={bio}
                  />
                </div>
              </div>
              {/* Gender */}
              <div className="flex items-center gap-2">
                <h3 className="flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                  Gender
                </h3>
                <div className="flex w-fit flex-4 justify-start gap-6 text-white md:flex-10">
                  <label className="flex w-fit cursor-pointer items-center gap-1">
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
                  <label className="flex w-full cursor-pointer items-center gap-1">
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
              {/* Email */}
              <div className="flex items-center gap-2">
                <h3 className="flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                  Email
                  <span className="align-super text-[12px] text-red-700">
                    {" *"}
                  </span>
                </h3>
                <div className="flex w-full flex-4 text-white md:flex-10">
                  <input
                    type="email"
                    className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder="Masukan Email"
                    required
                  />
                </div>
              </div>
              {/* Phone */}
              <div className="flex items-center gap-2">
                <h3 className="flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                  Phone
                </h3>
                <div className="flex w-full flex-4 text-white md:flex-10">
                  <input
                    type="number"
                    className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone}
                    placeholder="Masukan Nomor Telepon"
                  />
                </div>
              </div>
              {/* Date Of Birthday */}
              <div className="flex items-center gap-2">
                <h3 className="flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                  Date Of Birthday
                </h3>
                <div className="flex w-full flex-4 text-white md:flex-10">
                  <input
                    type="date"
                    className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                    onChange={(e) => setdateOfBirth(e.target.value)}
                    value={dateOfBirth}
                    placeholder="Masukan Nomor Telepon"
                  />
                </div>
              </div>
              {/* Country */}
              <div className="flex items-center gap-2">
                <h3 className="flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                  Country / Region
                </h3>
                <div className="flex w-full flex-4 text-white md:flex-10">
                  <select
                    className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1 text-white"
                    onChange={(e) => setRegion(e.target.value)}
                    value={region}
                  >
                    <option value="">Pilih Region</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Philippines">Philippines</option>
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
    </>
  );
}
