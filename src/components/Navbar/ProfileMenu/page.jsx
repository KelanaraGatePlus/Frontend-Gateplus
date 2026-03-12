"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import iconsAccountsPrivacy from "@@/icons/icons-accounts-privacy.svg";
import iconsAdvertisement from "@@/icons/icons-advertisement.svg";
import iconsBecomeCreator from "@@/icons/icons-become-creator.svg";
import iconsDashboard from "@@/icons/icons-dashboard.svg";
import iconsHelp from "@@/icons/icons-help.svg";
import iconsProfile from "@@/icons/icons-profile.svg";
import iconsUploadContent from "@@/icons/icons-upload-content.svg";
import { DEFAULT_AVATAR } from "@/lib/defaults";
import iconsArrow from "@@/icons/icon-arrow.svg";
import { useAuth } from "@/components/Context/AuthContext";
import { TicketIcon } from "lucide-react";
import ShowCoin from "@/components/Coin/ShowCoin";
import { Icon } from "@iconify/react";
import PurchaseHistoryModal from "@/components/Modal/PurchaseHistoryModal";

export default function ProfileMenu({
  creatorId,
  userId,
  isCreator,
  imageUrl,
  role,
  openCreateContentModal,
  openRedeemVoucherModal,
  userBalance = 0
}) {
  const router = useRouter();
  const pathname = usePathname();
  const profileRef = useRef();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDashboardMenuOpen, setIsDashboardMenuOpen] = useState(false);
  const [isUploadContentMenuOpen, setIsUploadContentMenuOpen] = useState(false);
  const [showPurchaseHistory, setShowPurchaseHistory] = useState(false);
  const linkHref =
    isCreator ? `/creator/${creatorId}` : `/user/${userId}`;
  const { logout } = useAuth();

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
    logout();
    router.push("/login");
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

  // Auto-close dropdowns when the route changes (e.g., after redirect)
  useEffect(() => {
    if (isProfileMenuOpen || isDashboardMenuOpen || isUploadContentMenuOpen) {
      setIsProfileMenuOpen(false);
      setIsDashboardMenuOpen(false);
      setIsUploadContentMenuOpen(false);
    }
  }, [pathname]);

  return (
    <div ref={profileRef} className="relative md:mt-0.5 md:block md:py-3">
      <div
        className="relative flex h-8 w-8 border-[#222222] border cursor-pointer items-center justify-center rounded-full bg-white md:h-10 md:w-10"
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
            src={DEFAULT_AVATAR}
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
          className="montserratFont custom-scrollbar absolute top-11 right-0 flex max-h-[85vh] w-70 flex-col gap-3 overflow-y-auto rounded-lg bg-[#0395BC] text-white px-3 py-4 transition-all duration-300 ease-in-out lg:top-16"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ul className="flex flex-col gap-1">
            <div className="flex flex-col items-center w-full gap-2 bg-linear-to-br from-[#979797CC] to-[#EC7F29CC] rounded-xl p-3">
              <h1 className="montserratFont font-medium text-lg text-white">GateCoins Balance</h1>
              <ShowCoin balance={userBalance} withPayment={false} />
              <div className="flex flex-row gap-2 w-full justify-between">
                <Link href="/top-up" className="rounded-lg bg-[#F07F26] text-white h-full px-9 shadow-[0px_2px_4px_-2px_rgba(0,0,0,0.10)] shadow-md col-span-3 py-2 flex items-center justify-center gap-1.5 font-bold text-xs montserratFont transition-all hover:outline hover:outline-[#F5F5F5] delay-100 hover:bg-[#ff6f00]">
                  <Icon
                    icon={'ph:plus-bold'}
                    width={16}
                    height={16}
                    className="text-white"
                  />
                  <span>Top Up</span>
                </Link>
                <button onClick={() => {
                  setShowPurchaseHistory(true);
                }} className="bg-[#F5F5F50D] h-full rounded-md border border-[#F5F5F51A] w-max p-2 hover:bg-[#f5f5f556] transition-all">
                  <Icon
                    icon={'humbleicons:history'}
                    width={16}
                    height={16}
                    className="text-white"
                  />
                </button>
                <Link href={'/'} className="bg-[#F5F5F50D] h-full rounded-md border border-[#F5F5F51A] w-max p-2 hover:bg-[#f5f5f556] transition-all">
                  <Icon
                    icon={'iconamoon:arrow-right-1-bold'}
                    width={16}
                    height={16}
                    className="text-white"
                  />
                </Link>
              </div>
            </div>
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
            <button onClick={() => openRedeemVoucherModal()} className="hover:cursor-pointer">
              <li className="flex flex-row gap-2 rounded-md p-2 font-semibold text-white hover:bg-[#F5F5F54D]">
                <span className="relative h-6 w-6">
                  <TicketIcon className="h-6 w-6 text-white" />
                </span>

                <span>Redeem Voucher</span>
              </li>
            </button>
            {/* Dashboard */}
            {isCreator && (
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
                    className={`flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isDashboardMenuOpen
                      ? "max-h-[500px] opacity-100"
                      : "-mt-1 max-h-0 opacity-0"
                      }`}
                  >
                    <Link href={"/creator/dashboard"} className="ms-8 flex flex-row gap-2 rounded-md py-1 font-medium text-white">
                      <span>Dashboard</span>
                    </Link>
                    <Link href={"/creator/withdrawal"} className="ms-8 flex flex-row gap-2 rounded-md py-1 font-medium text-white">
                      <span>Penarikan Saldo</span>
                    </Link>
                    <div className="ms-8 flex flex-row gap-2 rounded-md py-1 font-medium text-white">
                      <Link href="/creator/dashboard/detail">
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
                      className={`absolute top-1/2 right-0 h-4 w-4 -translate-y-1/2 transition-transform duration-300 ${isUploadContentMenuOpen ? "-rotate-90" : "rotate-90"
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
                    className={`flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isUploadContentMenuOpen
                      ? "max-h-[500px] opacity-100"
                      : "-mt-1 max-h-0 opacity-0"
                      }`}
                  >
                    <div className="ms-8 flex flex-row gap-2 rounded-md py-1 font-medium text-white">
                      <button className="hover:cursor-pointer" onClick={() => openCreateContentModal('upload')}>
                        <span>Upload Konten Baru</span>
                      </button>
                    </div>
                    <div className="ms-8 flex flex-row gap-2 rounded-md py-1 font-medium text-white">
                      <button className="hover:cursor-pointer" onClick={() => openCreateContentModal('episode')}>
                        <span>Upload Episode Baru</span>
                      </button>
                    </div>
                    <Link href={'/creator/dashboard/content'} className="ms-8 flex flex-row gap-2 rounded-md py-1 font-medium text-white">
                      <span>Lihat Karya</span>
                    </Link>
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
            <Link href="/help">
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
              <Link href="/register-creators">
                <span>Be Creator</span>
              </Link>
            </div>
          )}
          <Link href="/education" className="w-full bg-[#04475E] text-white rounded-full py-2.5 flex gap-1 items-center justify-center font-bold zeinFont hover:bg-[#023444] hover:outline hover:outline-white transition-all">
            <Icon
              icon={'solar:square-academic-cap-bold'}
              width={24}
              height={24}
            />
            <span>Education</span>
          </Link>
          <button
            className="flex cursor-pointer flex-row justify-center gap-2 rounded-md bg-red-700 p-2 font-semibold text-white hover:bg-red-800"
            onClick={handleLogout}
          >
            <span>Log Out</span>
          </button>
        </div>
      )}
      {showPurchaseHistory && <PurchaseHistoryModal isOpen={showPurchaseHistory} onClose={() => setShowPurchaseHistory(false)} />}
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
  openCreateContentModal: PropTypes.func.isRequired,
  openRedeemVoucherModal: PropTypes.func.isRequired,
};
