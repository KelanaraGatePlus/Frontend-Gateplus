"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";

import { formatFollowersCount } from "@/lib/followersCount";
import { DEFAULT_AVATAR } from "@/lib/defaults";
import { subscribeCreator } from "./utils";
import Toast from "@/components/Toast/page";
import VerifiedCreator from "../Profile/VerifiedCreator";

export default function CreatorCard({
  isLogin,
  productType,
  creatorDetail,
  initialIsSubscribed = false,
  initialTotalSubs = 0,
}) {
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [totalSubs, setTotalSubs] = useState(initialTotalSubs);
  const [isOwnChannel, setIsOwnChannel] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const creatorId = localStorage.getItem("creators_id");
      if (creatorId === creatorDetail?.id) setIsOwnChannel(true);
    }
  }, [creatorDetail?.id]);

  useEffect(() => {
    setIsSubscribed(initialIsSubscribed);
    setTotalSubs(initialTotalSubs);
  }, [initialIsSubscribed, initialTotalSubs]);

  // follow dan unfollow pake reload
  const handleToggleSubscribe = async () => {
    try {
      // set loading
      setIsSubscribing(true);

      const userId = localStorage.getItem("users_id");
      const creatorId = creatorDetail?.id;

      if (!userId || !creatorId) {
        setShowToast(true);
        setToastMessage("Silakan login atau refresh halaman");
        setToastType("failed");
        return;
      }

      if (!isSubscribed) {
        // FOLLOW
        await subscribeCreator(
          false,
          creatorDetail?.profileName,
          creatorId,
          totalSubs,
          {
            setIsSubscribed,
            setTotalSubs,
            setIsSubscribing,
            setShowToast,
            setToastMessage,
            setToastType,
          },
        );
      } else {
        // UNFOLLOW
        await subscribeCreator(
          true,
          creatorDetail?.profileName,
          creatorId,
          totalSubs,
          {
            setIsSubscribed,
            setTotalSubs,
            setIsSubscribing,
            setShowToast,
            setToastMessage,
            setToastType,
          },
        );
      }

      // reload full halaman setelah berhasil
      window.location.reload();
    } catch (error) {
      console.error("FOLLOW/UNFOLLOW ERROR:", error);
      const message =
        error?.response?.data?.message ||
        `Gagal mengubah status follow ${creatorDetail?.profileName}`;
      setShowToast(true);
      setToastMessage(message);
      setToastType("failed");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <>
      <div
        className={`flex items-center gap-2 ${productType === "podcast" ? "flex-row-reverse" : ""
          }`}
      >
        <Link href={`/creator/${creatorDetail?.id}`}>
          <div className="h-15 w-15 rounded-full bg-white">
            <Image
              priority
              src={
                creatorDetail?.imageUrl && creatorDetail?.imageUrl !== "null"
                  ? creatorDetail?.imageUrl
                  : DEFAULT_AVATAR
              }
              alt="creator-avatar"
              width={100}
              height={100}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </Link>

        <Link href={`/creator/${creatorDetail?.id}`} className="flex group items-center gap-4">
          <div>
            <h3 className="zeinFont group-hover:underline text-2xl font-extrabold">
              {creatorDetail?.profileName || "Nama Channel belum diatur"}
              <VerifiedCreator isVerified={creatorDetail?.isVerified} />
            </h3>
            <p className="text-sm">
              {formatFollowersCount(totalSubs)} Followers
            </p>
          </div>

          {!isOwnChannel && isLogin && (
            <button
              onClick={handleToggleSubscribe}
              disabled={isSubscribing}
              className={`flex items-center justify-center gap-2 rounded-full px-5 py-2 text-white transition ${isSubscribed
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-blue-800 hover:bg-blue-900"
                }`}
            >
              {isSubscribing ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3H4z"
                    ></path>
                  </svg>
                  Loading...
                </>
              ) : isSubscribed ? (
                "Following"
              ) : (
                "Follow Now"
              )}
            </button>
          )}
        </Link>
      </div>

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

CreatorCard.propTypes = {
  productType: PropTypes.string,
  creatorDetail: PropTypes.object.isRequired,
  initialIsSubscribed: PropTypes.bool,
  initialTotalSubs: PropTypes.number,
  onSubscriptionChange: PropTypes.func,
  isLogin: PropTypes.bool.isRequired,
};
