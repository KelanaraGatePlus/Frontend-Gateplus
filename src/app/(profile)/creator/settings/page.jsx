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
  const [description, setDescription] = useState("");
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

  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [bannerProfilePicturePreview, setBannerProfilePicturePreview] =
    useState(null);
  const [updateCreator, { isLoading: isUpdateCreatorLoading }] = useUpdateCreatorMutation();
  const { refreshUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      profileName === "" ||
      username === "" ||
      email === "" ||
      ((profilePictureUrl === null || profilePictureUrl === "") && (selectedIconUrl === null || selectedIconUrl === ""))
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
      // when frontend shows empty string, send backend the string "null" so backend stores null-equivalent
      const toBackend = (v) => (v === "" || v === null ? "null" : v);

      formData.append("profileName", profileName);
      formData.append("username", username);
      formData.append("description", toBackend(description));
      // backend requires a non-null gender; default to 'Male' when empty
      formData.append("gender", gender || "Male");
      formData.append("email", email);
      formData.append("phone", toBackend(phone));
      formData.append("dateOfBirth", toBackend(dateOfBirth));
      formData.append("region", toBackend(region));
      formData.append("instagramUrl", toBackend(instagramUrl));
      formData.append("tiktokUrl", toBackend(tiktokUrl));
      formData.append("twitterUrl", toBackend(twitterUrl));
      formData.append("facebookUrl", toBackend(facebookUrl));
      if (profilePictureUrl) {
        formData.append("imageUrl", profilePictureUrl);
      } else if (selectedIconUrl) {
        formData.append("iconUrl", selectedIconUrl);
      }

      if (bannerProfileUrl) {
        formData.append("bannerImageUrl", bannerProfileUrl);
      }

      const response = await updateCreator(formData).unwrap();
      setShowToast(true);
      setToastMessage("Profil berhasil diupdate!");
      setToastType("success");
      console.log("Update success:", response.data);
      localStorage.setItem("image_creators", response.data.imageUrl);
      // refresh AuthContext so consumers (eg. Navbar) update immediately
      try {
        refreshUser();
      } catch (err) {
        console.warn("refreshUser failed:", err);
      }
      setIsLoading(false);
      router.push(`/creator/${id}`);
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

      const creatorData = response.data.data.data;
      // normalize values: backend sometimes returns string "null"; show empty in UI
      const normalize = (v) => (v === null || v === "null" ? "" : v);

      setProfilePictureUrl(normalize(creatorData.imageUrl));
      setBannerProfileUrl(normalize(creatorData.bannerImageUrl));
      setProfileName(normalize(creatorData.profileName));
      setUsername(normalize(creatorData.username));
      setDescription(normalize(creatorData.description));
      setGender(normalize(creatorData.gender) || "Male");
      setEmail(normalize(creatorData.email));
      setPhone(normalize(creatorData.phone));
      setDateOfBirth(normalize(creatorData.dateOfBirth));
      setRegion(normalize(creatorData.region));
      setInstagramUrl(normalize(creatorData.instagramUrl));
      setTiktokUrl(normalize(creatorData.tiktokUrl));
      setTwitterUrl(normalize(creatorData.twitterUrl));
      setFacebookUrl(normalize(creatorData.facebookUrl));
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
      if (bannerProfilePicturePreview) URL.revokeObjectURL(bannerProfilePicturePreview);
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
          title={cropTarget === "banner" ? "Crop Banner" : "Crop Profile Picture"}
        />
      )}
      <main className="mx-2 my-2 flex flex-col lg:mx-6 lg:mb-10 lg:h-fit text-white">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                  <h3 className="w-40 md:w-56 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                    Profile Picture
                    <span className="align-super text-[12px] text-red-700">{" *"}</span>
                  </h3>
                  <label className="relative h-16 w-16 cursor-pointer lg:h-24 lg:w-24"
                    onClick={() => {
                      setShowProfileModal(true);
                      console.log("open modal");
                    }}>
                    <div className="group relative h-16 w-16 cursor-pointer overflow-hidden rounded-full lg:h-24 lg:w-24">
                      {profilePictureUrl && profilePictureUrl !== "null" && profilePictureUrl !== "" && profilePicturePreview === null ? (
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
                  <h3 className="w-40 md:w-56 text-base font-semibold text-[#979797] md:text-base lg:text-xl">Banner Profile IMG</h3>
                  <div className="relative flex-1 overflow-hidden rounded-xl">
                    <label className="relative block h-full w-full cursor-pointer lg:max-h-42 lg:max-w-[70%]">
                      {bannerProfileUrl && bannerProfileUrl !== "null" && bannerProfileUrl !== "" && bannerProfilePicturePreview === null ? (
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                  <h3 className="w-40 md:w-56 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                    Profile Name
                    <span className="align-super text-[12px] text-red-700">{" *"}</span>
                  </h3>
                  <div className="flex-1">
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
                <div className="flex items-center gap-4">
                  <h3 className="w-40 md:w-56 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                    Username
                    <span className="align-super text-[12px] text-red-700">{" *"}</span>
                  </h3>
                  <div className="flex-1">
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
              </div>
              {/* Description */}
              <div className="flex items-start gap-4">
                <h3 className="w-40 md:w-56 text-base font-semibold text-[#979797] md:text-base lg:text-xl">Description</h3>
                <div className="flex-1">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                  <h3 className="w-40 md:w-56 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                    Email
                    <span className="align-super text-[12px] text-red-700">{" *"}</span>
                  </h3>
                  <div className="flex-1">
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
                <div className="flex items-center gap-4">
                  <h3 className="w-40 md:w-56 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                    Phone
                    <span className="align-super text-[12px] text-red-700">{" *"}</span>
                  </h3>
                  <div className="flex-1">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                  <h3 className="w-40 md:w-56 text-base font-semibold text-[#979797] md:text-base lg:text-xl">Date of Birth</h3>
                  <div className="flex-1">
                    <input
                      type="date"
                      className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1 text-white"
                      placeholder="your birthday"
                      value={dateOfBirth || ""}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <h3 className="w-40 md:w-56 text-base font-semibold text-[#979797] md:text-base lg:text-xl">Gender</h3>
                  <div className="flex-1">
                    <div className="flex gap-6 items-center text-white">
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
                <h3 className="w-40 md:w-56 text-base font-semibold text-[#979797] md:text-base lg:text-xl">Country / Region</h3>
                <div className="flex-1">
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

              <div className="flex items-center gap-4">
                <h3 className="w-40 md:w-56 text-base font-semibold text-[#979797] md:text-base lg:text-xl">Instagram Link</h3>
                <div className="flex-1">
                  <input
                    type="text"
                    className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                    placeholder="https://www.instagram.com/profilename"
                    value={instagramUrl || ""}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <h3 className="w-40 md:w-56 text-base font-semibold text-[#979797] md:text-base lg:text-xl">Tiktok Link</h3>
                <div className="flex-1">
                  <input
                    type="text"
                    className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                    placeholder="https://www.tiktok.com/@profilename"
                    value={tiktokUrl || ""}
                    onChange={(e) => setTiktokUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <h3 className="w-40 md:w-56 text-base font-semibold text-[#979797] md:text-base lg:text-xl">Twitter/X Link</h3>
                <div className="flex-1">
                  <input
                    type="text"
                    className="w-full rounded-md border border-[#F5F5F540] bg-[#2222224D] px-2 py-1"
                    placeholder="https://www.x.com/profilename"
                    value={twitterUrl || ""}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <h3 className="w-40 md:w-56 text-base font-semibold text-[#979797] md:text-base lg:text-xl">Facebook Link</h3>
                <div className="flex-1">
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

      {(isLoading || isUpdateCreatorLoading) && (
        <LoadingOverlay />
      )}
    </>
  );
}
