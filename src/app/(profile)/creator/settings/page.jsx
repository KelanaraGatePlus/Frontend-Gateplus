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

export default function CreatorSettingsPage() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [id, setId] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [bannerProfileUrl, setBannerProfileUrl] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState(null);
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

  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [bannerProfilePicturePreview, setBannerProfilePicturePreview] =
    useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      profileName === "" ||
      username === "" ||
      email === "" ||
      profilePictureUrl === null
    ) {
      setShowToast(true);
      setToastMessage(
        "Profile Picture, Profile Name, Username, dan Email Wajib diisi",
      );
      setToastType("failed");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("profileName", profileName);
      formData.append("username", username);
      formData.append("description", description);
      if (gender !== "" && gender !== null) {
        formData.append("gender", gender);
      }
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("dateOfBirth", dateOfBirth);
      formData.append("region", region);
      formData.append("instagramUrl", instagramUrl);
      formData.append("tiktokUrl", tiktokUrl);
      formData.append("twitterUrl", twitterUrl);
      formData.append("facebookUrl", facebookUrl);
      if (profilePictureUrl) {
        formData.append("imageUrl", profilePictureUrl);
      }
      if (bannerProfileUrl) {
        formData.append("bannerImageUrl", bannerProfileUrl);
      }

      const response = await axios.patch(
        `${BACKEND_URL}/creator/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setShowToast(true);
      setToastMessage("Profil berhasil diupdate!");
      setToastType("success");
      console.log("Update success:", response.data);
      localStorage.setItem("image_users", response.data.data.imageUrl);
      setIsLoading(false);
      router.push(`/Creators/${id}`);
    } catch (error) {
      setIsLoading(false);
      console.error("Error during patch request:", error);
    }
  };

  const getData = async (id) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/creator/${id}`,
      );

      const creatorData = response.data.data.data[0];

      setProfilePictureUrl(creatorData.imageUrl);
      setBannerProfileUrl(creatorData.bannerImageUrl);
      setProfileName(creatorData.profileName);
      setUsername(creatorData.username);
      setDescription(creatorData.description);
      setGender(creatorData.gender);
      setEmail(creatorData.email);
      setPhone(creatorData.phone);
      setDateOfBirth(creatorData.dateOfBirth);
      setRegion(creatorData.region);
      setInstagramUrl(creatorData.instagramUrl);
      setTiktokUrl(creatorData.tiktokUrl);
      setTwitterUrl(creatorData.twitterUrl);
      setFacebookUrl(creatorData.facebookUrl);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const creatorId = localStorage.getItem("creators_id");
    if (creatorId) {
      setId(creatorId);
      getData(creatorId);
    }
  }, []);

  const handleFileUpload = (event) => {
    if (event.target.id === "profile-picture") {
      const file = event.target.files[0];
      if (file) {
        setProfilePicturePreview(URL.createObjectURL(file));
        setProfilePictureUrl(file);
      }
    }

    if (event.target.id === "banner-profile-picture") {
      const file = event.target.files[0];
      if (file) {
        setBannerProfilePicturePreview(URL.createObjectURL(file));
        setBannerProfileUrl(file);
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
      <main className="mx-2 my-2 mt-16 flex flex-col md:mt-24 lg:mx-6 lg:mb-10 lg:h-fit">
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
              {/* profile */}
              <div className="flex items-center gap-2">
                <h3 className="flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                  Profile Picture
                  <span className="align-super text-[12px] text-red-700">
                    {" *"}
                  </span>
                </h3>
                <div className="flex flex-4 text-white md:flex-10">
                  <label className="relative h-16 w-16 cursor-pointer lg:h-24 lg:w-24">
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

                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                      id="profile-picture"
                      onChange={(e) => handleFileUpload(e)}
                    />
                  </label>
                </div>
              </div>
              {/* Banner */}
              <div className="flex items-center gap-2">
                <h3 className="flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                  Banner Profile IMG
                </h3>

                <div className="relative flex w-full flex-4 overflow-hidden rounded-xl md:flex-10">
                  <label className="relative block h-full w-full cursor-pointer lg:max-h-42 lg:max-w-[70%]">
                    {/* Banner Image */}
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
                    value={profileName || ""}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Masukan Nama Profile"
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
                    value={username || ""}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukan Username"
                    required
                  />
                </div>
              </div>
              {/* Description */}
              <div className="flex items-center gap-2">
                <h3 className="flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                  Description
                </h3>
                <div className="flex w-full flex-4 text-white md:flex-10">
                  <textarea
                    name="about"
                    className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                    id="about"
                    cols="30"
                    rows="5"
                    placeholder="Tell us about you, maxs 150 character."
                    value={description || ""}
                    onChange={(e) => setDescription(e.target.value)}
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
                      checked={gender === "Male"}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <span>Male</span>
                  </label>
                  <label className="flex w-full cursor-pointer items-center gap-1">
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
                    value={email || ""}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukan Email"
                    required
                  />
                </div>
              </div>
              {/* Phone */}
              <div className="flex items-center gap-2">
                <h3 className="flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                  Phone
                  <span className="align-super text-[12px] text-red-700">
                    {" *"}
                  </span>
                </h3>
                <div className="flex w-full flex-4 text-white md:flex-10">
                  <input
                    type="number"
                    className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                    value={phone || ""}
                    placeholder="Masukan No. Telepon"
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
              {/* Date of Birth */}
              <div className="flex items-center gap-2">
                <h3 className="flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                  Date of Birth
                </h3>
                <div className="flex w-full flex-4 text-white md:flex-10">
                  <input
                    type="date"
                    className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1 text-white"
                    placeholder="your birthday"
                    value={dateOfBirth || ""}
                    onChange={(e) => setDateOfBirth(e.target.value)}
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
                    value={region || ""}
                    onChange={(e) => setRegion(e.target.value)}
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
              {/* Instagram Link */}
              <div className="flex items-center gap-2">
                <h3 className="flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                  Instagram Link
                </h3>
                <div className="flex w-full flex-4 text-white md:flex-10">
                  <input
                    type="text"
                    className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                    placeholder="https://www.instagram.com/profilename"
                    value={instagramUrl || ""}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                  />
                </div>
              </div>
              {/* Tiktok Link */}
              <div className="flex items-center gap-2">
                <h3 className="flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                  Tiktok Link
                </h3>
                <div className="flex w-full flex-4 text-white md:flex-10">
                  <input
                    type="text"
                    className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                    placeholder="https://www.tiktok.com/@profilename"
                    value={tiktokUrl || ""}
                    onChange={(e) => setTiktokUrl(e.target.value)}
                  />
                </div>
              </div>
              {/* Twitter/X Link */}
              <div className="flex items-center gap-2">
                <h3 className="flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                  Twitter/X Link
                </h3>
                <div className="flex w-full flex-4 text-white md:flex-10">
                  <input
                    type="text"
                    className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                    placeholder="https://www.x.com/profilename"
                    value={twitterUrl || ""}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                  />
                </div>
              </div>
              {/* Facebook Link */}
              <div className="flex items-center gap-2">
                <h3 className="flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                  Facebook Link
                </h3>
                <div className="flex w-full flex-4 text-white md:flex-10">
                  <input
                    type="text"
                    className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                    placeholder="https://www.facebook.com/profilename"
                    value={facebookUrl || ""}
                    onChange={(e) => setFacebookUrl(e.target.value)}
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
