"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export default function ButtonSection({
  profileFor,
  isOwnProfile,
  isSubscribed,
  isSubscribing,
  handleToggleSubscribe,
  isLinkedWithGoogle = false,
}) {
  const [id, setId] = useState("");

  useEffect(() => {
    const userId =
      localStorage.getItem("users_id") || sessionStorage.getItem("users_id");

    if (userId) setId(userId);
  }, []);

  const handleLinkGoogle = () => {
    if (!id) {
      alert("Tidak dapat melakukan link Google: User ID kosong.");
      return;
    }

    const url = `${BACKEND_URL}/auth/link/google?id=${id}`;
    window.location.href = url;
  };

  if (isOwnProfile) {
    return (
      <div className="flex w-full flex-col gap-2">
        <Link
          href={
            profileFor === "creator" ? "/creator/settings" : "/user/settings"
          }
          className="mt-1 block rounded-lg bg-[#0E5BA8] py-2 text-center font-bold text-white hover:bg-[#0E5BA8]/80"
        >
          Edit Profile
        </Link>

        <button
          disabled={isLinkedWithGoogle || !id}
          onClick={handleLinkGoogle}
          className={`mt-1 rounded-lg py-2 font-bold text-white ${
            isLinkedWithGoogle || !id
              ? "cursor-not-allowed bg-gray-400"
              : "bg-[#0E5BA8] hover:bg-[#0E5BA8]/80"
          }`}
        >
          {isLinkedWithGoogle
            ? "Linked With Google Account"
            : "Link With Google Account"}
        </button>
      </div>
    );
  }

  if (profileFor === "creator") {
    return (
      <button
        className={`mt-1 rounded-lg py-2 font-bold text-white ${
          isSubscribed
            ? "bg-gray-500 hover:bg-gray-500/80"
            : "bg-[#0E5BA8] hover:bg-[#0E5BA8]/80"
        }`}
        onClick={handleToggleSubscribe}
        disabled={isSubscribing}
      >
        {isSubscribing
          ? "Subscribing..."
          : isSubscribed
            ? "Following"
            : "Follow Now"}
      </button>
    );
  }

  return null;
}

ButtonSection.propTypes = {
  profileFor: PropTypes.oneOf(["creator", "user"]).isRequired,
  isOwnProfile: PropTypes.bool.isRequired,
  isSubscribed: PropTypes.bool.isRequired,
  isSubscribing: PropTypes.bool.isRequired,
  handleToggleSubscribe: PropTypes.func.isRequired,
  isLinkedWithGoogle: PropTypes.bool,
};
