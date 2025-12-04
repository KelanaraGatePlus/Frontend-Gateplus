"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";

import { formatFollowersCount } from "@/lib/followersCount";
import { DEFAULT_AVATAR } from "@/lib/defaults";
import { subscribeCreator } from "./utils";

export default function CreatorCard({
  productType,
  creatorDetail,
  initialIsSubscribed = false,
  initialTotalSubs = 0,
  onSubscriptionChange,
}) {
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [totalSubs, setTotalSubs] = useState(initialTotalSubs);
  const [isOwnChannel, setIsOwnChannel] = useState(false);

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

  const handleToggleSubscribe = () => {
    subscribeCreator(
      isSubscribed,
      creatorDetail?.profileName,
      creatorDetail?.id,
      totalSubs,
      {
        setIsSubscribed,
        setTotalSubs,
        setIsSubscribing,
      }
    );

    if (typeof onSubscriptionChange === "function") {
      const newStatus = !isSubscribed;
      const newTotal = newStatus ? totalSubs + 1 : Math.max(0, totalSubs - 1);
      onSubscriptionChange({ isSubscribed: newStatus, totalSubs: newTotal });
    }
  };

  return (
    <div className={`flex items-center gap-2 ${productType === 'podcast' ? "flex-row-reverse" : ""}`}>
      <Link href={`/creator/${creatorDetail?.id}`}>
        <div className="h-15 w-15 rounded-full bg-white">
          <Image
            priority
            src={creatorDetail?.imageUrl !== 'null' && creatorDetail?.imageUrl !== null ? creatorDetail?.imageUrl : DEFAULT_AVATAR}
            alt={`profile-image-creator-${creatorDetail?.username}`}
            width={100}
            height={100}
            className="h-full w-full rounded-full object-cover object-center"
          />
        </div>
      </Link>

      <div className={`flex flex-row items-center gap-4 ${productType === 'podcast' ? "flex-row-reverse" : ""}`}>
        <Link href={`/creator/${creatorDetail?.id}`}>
          <div className="group flex max-w-36 cursor-pointer flex-col rounded-lg text-ellipsis whitespace-nowrap md:max-w-72">
            <h3
              className={`zeinFont truncate text-2xl font-extrabold group-hover:text-blue-400 group-hover:underline md:text-3xl ${creatorDetail?.profileName ? "" : "text-gray-600/60 italic"}`}
            >
              {creatorDetail?.profileName || "Nama Channel belum diatur"}
            </h3>
            <p className={`-mt-1 text-[10px] font-light md:text-sm ${productType === 'podcast' ? "text-right" : ""}`}>
              {formatFollowersCount(totalSubs ? totalSubs : 0)}{' '}
              {totalSubs > 1 ? ' Followers' : ' Follower'}
            </p>
          </div>
        </Link>

        {!isOwnChannel && (
          <button
            className={`zeinFont mt-1 flex cursor-pointer items-center justify-center rounded-full ${!isSubscribed ? "bg-blue-800 hover:bg-blue-900" : "bg-gray-600 hover:bg-gray-700"} px-0 md:px-5 pt-1.5 pb-1 text-xl`}
            onClick={handleToggleSubscribe}
          >
            {isSubscribing ? (
              <div className="flex">
                <svg
                  aria-hidden="true"
                  className="dark:text-white-600 mr-2 h-6 w-6 animate-spin fill-white text-gray-200"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <p className="flex">Subscribing...</p>
              </div>
            ) : isSubscribed ? (
              'Following'
            ) : (
              'Follow Now'
            )}
          </button>
        )}
      </div>
    </div>
  );
}

CreatorCard.propTypes = {
  productType: PropTypes.string,
  creatorDetail: PropTypes.object.isRequired,
  initialIsSubscribed: PropTypes.bool,
  initialTotalSubs: PropTypes.number,
  onSubscriptionChange: PropTypes.func,
};
