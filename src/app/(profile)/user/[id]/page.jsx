/* eslint-disable react/react-in-jsx-scope */
"use client";
import BackButton from "@/components/BackButton/page";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import ProfileCard from "@/components/Profile/ProfileCard/ProfileCard";
import UserLibraryTabs from "@/components/Profile/UserLibraryTabs/page";
import { useGetUserDetailQuery } from "@/hooks/api/userSliceAPI";
import { useToast } from "@/components/ToastProvider/page";
import { useSearchParams, useRouter } from "next/navigation";

export default function UserProfilePage({ params }) {
  const { id } = params;
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const { data, isLoading, isSuccess } = useGetUserDetailQuery(id);
  const userDetailData = data?.data?.data;
  const isLinkedWithGoogle = userDetailData?.googleId ? true : false;

  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToast } = useToast();

  // Toast Google link
  useEffect(() => {
    if (!searchParams) return;

    const linkedStatus = searchParams.get("linked");
    const errorStatus = searchParams.get("error");

    if (linkedStatus === "success") {
      addToast("Berhasil link akun Google!", "success");
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("linked");
      router.replace(`${window.location.pathname}?${newParams.toString()}`, {
        shallow: true,
      });
    }

    if (errorStatus) {
      let msg = "Gagal link akun Google!";
      switch (errorStatus) {
        case "google_email_mismatch":
          msg = "Gagal link Google: Email tidak cocok!";
          break;
        case "auth_failed":
          msg = "Gagal link Google: Autentikasi gagal!";
          break;
        case "login_failed":
          msg = "Gagal link Google: Login gagal!";
          break;
        default:
          msg = `Gagal link Google: ${errorStatus}`;
          break;
      }

      addToast(msg, "error");

      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("error");
      router.replace(`${window.location.pathname}?${newParams.toString()}`, {
        shallow: true,
      });
    }
  }, [searchParams, router, addToast]);

  // Cek apakah profil sendiri
  useEffect(() => {
    if (isSuccess && userDetailData) {
      const storedUserId = localStorage.getItem("users_id");
      setIsOwnProfile(storedUserId === id);
    }
  }, [isSuccess, userDetailData, id]);

  return (
    <main className="flex w-full flex-col px-2 lg:px-6">
      <BackButton />
      <div className="flex w-full gap-4 flex-col md:flex-row md:gap-5">
        <ProfileCard
          data={userDetailData}
          profileFor="user"
          isLoading={isLoading}
          isOwnProfile={isOwnProfile}
          isLinkedWithGoogle={isLinkedWithGoogle}
        />
        <UserLibraryTabs id={id} />
      </div>
    </main>
  );
}

UserProfilePage.propTypes = {
  params: PropTypes.object.isRequired,
};
