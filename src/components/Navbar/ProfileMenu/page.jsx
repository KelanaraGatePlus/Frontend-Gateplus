"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import iconsAccountsPrivacy from "@@/icons/icons-accounts-privacy.svg";
import iconsAdvertisement from "@@/icons/icons-advertisement.svg";
import iconsBecomeCreator from "@@/icons/icons-become-creator.svg";
import iconsDashboard from "@@/icons/icons-dashboard.svg";
import iconsHelp from "@@/icons/icons-help.svg";
import iconsProfile from "@@/icons/icons-profile.svg";
import iconsSettings from "@@/icons/icons-settings.svg";
import iconsUploadContent from "@@/icons/icons-upload-content.svg";
import logoUsersComment from "@@/AvatarIcons/avatar-face-2.jpg";
import iconsArrow from "@@/icons/icon-arrow.svg";

export default function ProfileMenu({
  creatorId,
  userId,
  isCreator,
  imageUrl,
  role,
  handleSwitchRole,
}) {
  const router = useRouter();
  const profileRef = useRef();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDashboardMenuOpen, setIsDashboardMenuOpen] = useState(false);
  const [isUploadContentMenuOpen, setIsUploadContentMenuOpen] = useState(false);
  const linkHref =
    role === "Creators" ? `/Creators/${creatorId}` : `/Users/${userId}`;

  const toggleProfile = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };
  const toggleDashboard = () => {
    setIsDashboardMenuOpen(!isDashboardMenuOpen);
  };
  const toggleUploadContent = () => {
    setIsUploadContentMenuOpen(!isUploadContentMenuOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    });
    router.push("/Login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={profileRef} className="relative md:mt-0.5 md:block md:py-3">
      <div
        className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white md:h-10 md:w-10"
        onClick={toggleProfile}
      >
        {imageUrl && imageUrl !== "null" ? (
          <Image
            src={imageUrl}
            alt="Profile Picture"
            layout="fill"
            objectFit="cover"
            className="rounded-full object-center"
          />
        ) : (
          <Image
            src={logoUsersComment}
            alt="Profile Picture"
            layout="fill"
            objectFit="cover"
            className="rounded-full object-center"
          />
        )}
      </div>
      {/* Dropdown Profile */}
      {isProfileMenuOpen && (
        <div
          className="montserratFont custom-scrollbar absolute top-11 right-0 flex max-h-[85vh] w-60 flex-col gap-3 overflow-y-auto rounded-lg bg-[#0395BC] px-3 py-4 transition-all duration-300 ease-in-out lg:top-16"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ul className="flex flex-col gap-1">
            <Link href={linkHref}>
              <li className="flex flex-row gap-2 rounded-md p-2 font-semibold text-white hover:bg-[#F5F5F54D]">
                <span className="relative h-6 w-6">
                  <Image
                    src={iconsProfile}
                    alt="icon profile"
                    layout="fill"
                    objectFit="cover"
                    className="object-cover"
                  />
                </span>

                <span>Profile</span>
              </li>
            </Link>
            {/* Dashboard */}
            {role === "Creators" && (
              <>
                <li className="flex flex-col gap-1 rounded-md bg-[#F5F5F54D] p-2 font-semibold text-white transition-all duration-300 ease-in-out">
                  <div
                    className="relative flex cursor-pointer flex-row gap-2 rounded-md font-semibold text-[#F5F5F5] transition-all duration-300 ease-in-out"
                    onClick={toggleDashboard}
                  >
                    <span className="relative h-6 w-6">
                      <Image
                        src={iconsDashboard}
                        alt="icon profile"
                        layout="fill"
                        objectFit="cover"
                        className="object-cover"
                      />
                    </span>
                    <span>Dashboard</span>
                    <span
                      className={`absolute top-1/2 right-0 h-4 w-4 -translate-y-1/2 transition-transform duration-300 ${isDashboardMenuOpen ? "-rotate-90" : "rotate-90"}`}
                    >
                      <Image
                        src={iconsArrow}
                        alt="arrow"
                        layout="fill"
                        objectFit="cover"
                        className="object-cover"
                      />
                    </span>
                  </div>
                  <div
                    className={`flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
                      isDashboardMenuOpen
                        ? "max-h-[500px] opacity-100"
                        : "-mt-1 max-h-0 opacity-0"
                    }`}
                  >
                    <div className="ms-8 flex flex-row gap-2 rounded-md py-1 font-medium text-white">
                      <span>Dashboard</span>
                    </div>
                    <div className="ms-8 flex flex-row gap-2 rounded-md py-1 font-medium text-white">
                      <span>Penarikan Saldo</span>
                    </div>
                    <div className="ms-8 flex flex-row gap-2 rounded-md py-1 font-medium text-white">
                      <Link href="/Creators/Dashboard">
                        <span>Analytic</span>
                      </Link>
                    </div>
                  </div>
                </li>
                {/* Upload Konten */}
                <li className="flex flex-col gap-1 rounded-md bg-[#F5F5F54D] p-2 font-semibold text-white transition-all duration-300 ease-in-out">
                  <div
                    className="relative flex cursor-pointer flex-row gap-2 rounded-md font-semibold text-[#F5F5F5] transition-all duration-300 ease-in-out"
                    onClick={toggleUploadContent}
                  >
                    <span className="relative h-6 w-6">
                      <Image
                        src={iconsUploadContent}
                        alt="icon profile"
                        layout="fill"
                        objectFit="cover"
                        className="object-cover"
                      />
                    </span>
                    <span>Upload Konten</span>
                    <span
                      className={`absolute top-1/2 right-0 h-4 w-4 -translate-y-1/2 transition-transform duration-300 ${
                        isUploadContentMenuOpen ? "-rotate-90" : "rotate-90"
                      }`}
                    >
                      <Image
                        src={iconsArrow}
                        alt="icon arrow"
                        layout="fill"
                        objectFit="cover"
                        className="object-cover"
                      />
                    </span>
                  </div>

                  <div
                    className={`flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
                      isUploadContentMenuOpen
                        ? "max-h-[500px] opacity-100"
                        : "-mt-1 max-h-0 opacity-0"
                    }`}
                  >
                    <div className="ms-8 flex flex-row gap-2 rounded-md py-1 font-medium text-white">
                      <Link href="/Ebook/UploadEbook">
                        <span>Upload Ebook</span>
                      </Link>
                    </div>
                    <div className="ms-8 flex flex-row gap-2 rounded-md py-1 font-medium text-white">
                      <Link href="/Comic/UploadComic">
                        <span>Upload Komik</span>
                      </Link>
                    </div>
                    <div className="ms-8 flex flex-row gap-2 rounded-md py-1 font-medium text-white">
                      <Link href="/Podcast/UploadPodcast">
                        <span>Upload Podcast</span>
                      </Link>
                    </div>
                    <div className="ms-8 flex flex-row gap-2 rounded-md py-1 font-medium text-white">
                      <span>Lihat Konten</span>
                    </div>
                  </div>
                </li>

                <li className="flex flex-row gap-2 rounded-md p-2 font-semibold text-white hover:bg-[#F5F5F54D]">
                  <span className="relative h-6 w-6">
                    <Image
                      src={iconsAdvertisement}
                      alt="icon profile"
                      layout="fill"
                      objectFit="cover"
                      className="object-cover"
                    />
                  </span>
                  <span>Promosi Iklan Produk</span>
                </li>
              </>
            )}
            <li className="flex flex-row gap-2 rounded-md p-2 font-semibold text-white hover:bg-[#F5F5F54D]">
              <span className="relative h-6 w-6">
                <Image
                  src={iconsAccountsPrivacy}
                  alt="icon profile"
                  layout="fill"
                  objectFit="cover"
                  className="object-cover"
                />
              </span>
              <span>Accounts & Privacy</span>
            </li>
            <Link href="/Users/FAQ">
              <li className="flex flex-row gap-2 rounded-md p-2 font-semibold text-white hover:bg-[#F5F5F54D]">
                <span className="relative h-6 w-6">
                  <Image
                    src={iconsHelp}
                    alt="icon profile"
                    layout="fill"
                    objectFit="cover"
                    className="object-cover"
                  />
                </span>
                <span>Help</span>
              </li>
            </Link>
            <Link href="/Users/Setting">
              <li className="flex flex-row gap-2 rounded-md p-2 font-semibold text-white hover:bg-[#F5F5F54D]">
                <span className="relative h-6 w-6">
                  <Image
                    src={iconsSettings}
                    alt="icon profile"
                    layout="fill"
                    objectFit="cover"
                    className="object-cover"
                  />
                </span>
                <span>Settings</span>
              </li>
            </Link>
          </ul>
          {role === "Users" && !isCreator && (
            <div className="flex flex-row justify-center gap-2 rounded-md bg-[#04475EB2] p-2 font-semibold text-white">
              <span className="relative h-6 w-6">
                <Image
                  src={iconsBecomeCreator}
                  alt="icon profile"
                  layout="fill"
                  objectFit="cover"
                  className="object-cover"
                />
              </span>
              <Link href="/RegisterCreators">
                <span>Be Creator</span>
              </Link>
            </div>
          )}
          {isCreator && (
            <div
              className="flex cursor-pointer flex-row justify-center gap-2 rounded-md bg-[#04475EB2] p-2 font-semibold text-white"
              onClick={handleSwitchRole}
            >
              <span>Switch to {role === "Users" ? "Creators" : "User"}</span>
            </div>
          )}
          <button
            className="flex cursor-pointer flex-row justify-center gap-2 rounded-md bg-red-700 p-2 font-semibold text-white hover:bg-red-800"
            onClick={handleLogout}
          >
            <span>Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
}

ProfileMenu.propTypes = {
  isAuthenticated: PropTypes.bool,
  creatorId: PropTypes.string,
  userId: PropTypes.string,
  isCreator: PropTypes.bool,
  imageUrl: PropTypes.string,
  role: PropTypes.string,
  handleSwitchRole: PropTypes.func,
};
