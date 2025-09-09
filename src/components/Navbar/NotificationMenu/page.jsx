"use client";
import React from "react";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";

/*[--- UTILITY IMPORT ---]*/
import { formatDateTime } from "@/lib/timeFormatter";

/*[--- ASSETS IMPORT ---]*/
import logoLonceng from "@@/logo/logoSosmed/lonceng_fix.svg";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export default function NotificationMenu() {
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const fetchNotifications = async () => {
    try {
      const role = localStorage.getItem("role");
      const userId = localStorage.getItem("users_id");
      const creatorId = localStorage.getItem("creators_id");
      const token = Cookies.get("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      let notifList = [];
      if (!token) {
        localStorage.clear();
        setIsAuthorized(false);
      }
      if (token) {
        setIsAuthorized(true);
        if (role === "Creators" && creatorId) {
          const resCreator = await axios.get(
            `${BACKEND_URL}/creator/${creatorId}`,
            {
              headers,
            },
          );
          const creatorData = resCreator.data?.data?.data;
          console.log("data notif creator 2:", creatorData);
          notifList =
            creatorData.notifications?.filter(
              (notif) => notif.notificationTarget === "Creators",
            ) || [];
        } else if (role === "Users" && userId) {
          const resUser = await axios.get(
            `${BACKEND_URL}/users/${userId}`,
            {
              headers,
            },
          );
          const userData = resUser.data?.data?.data;
          console.log("data notif user:", userId);
          notifList =
            userData.notifications?.filter(
              (notif) => notif.notificationTarget === "Users",
            ) || [];
        }
      }
      const hasUnread = notifList.some((notif) => !notif.isRead);

      setNotifications(notifList);
      setHasNotifications(hasUnread);
      console.log(notifList);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const toggleNotificationDropdown = () => {
    setNotificationOpen(!isNotificationOpen);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => {
      if (prev >= notifications.length) {
        return 5;
      } else {
        const newCount = prev + 5;
        return newCount > notifications.length
          ? notifications.length
          : newCount;
      }
    });
  };

  const handleReadNotification = async (id) => {
    try {
      const response = await axios.patch(
        `${BACKEND_URL}/notifications/${id}/read`,
      );
      console.log("Notifikasi dibaca:", response.data);
      fetchNotifications();
    } catch (error) {
      console.error("Gagal update notifikasi:", error.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={notificationRef}
      className="relative flex cursor-pointer items-center justify-end rounded-full py-1.5 hover:bg-white/30 md:w-fit lg:mr-1.5 lg:px-2"
    >
      <Image
        priority
        height={30}
        width={27}
        src={logoLonceng}
        alt="logo-lonceng"
        onClick={toggleNotificationDropdown}
      />
      {hasNotifications && (
        <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 md:top-0" />
      )}
      {isNotificationOpen && (
        <div className="max-h-[210px]] absolute top-8 right-0 z-50 mt-3.5 w-3xs overflow-y-auto rounded-lg bg-[#2a6475] p-3.5 shadow-lg md:top-11 md:right-0 lg:w-md">
          <div className="flex items-start justify-between">
            <h2 className="mb-2 flex text-lg font-bold text-white">
              Notifications
            </h2>
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full bg-[#808080] pb-1 text-xl font-bold text-white"
              onClick={toggleNotificationDropdown}
            >
              &times;
            </div>
          </div>
          {!isAuthorized ? (
            <p className="text-sm text-white/75">
              Anda belum login. Silakan{" "}
              <Link href="/Login" className="text-blue-300 underline">
                login
              </Link>{" "}
              untuk melihat notifikasi.
            </p>
          ) : hasNotifications > 0 ? (
            <ul>
              {notifications
                .slice(0, visibleCount)
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .map((notification) => (
                  <li
                    key={notification.id}
                    className={`relative my-2 flex flex-col rounded-lg p-2 text-lg text-gray-500 ${notification.isRead ? "bg-transparent" : "bg-[#28a4cc]"}`}
                  >
                    <div className="flex flex-wrap gap-1 text-white">
                      <span
                        className="leading-6 font-bold"
                        title={notification.user?.username || "Unknown"}
                      >
                        {(notification.user?.username || "Unknown").slice(
                          0,
                          10,
                        )}
                        {(notification.user?.username || "Unknown").length > 10
                          ? "..."
                          : ""}
                      </span>
                      <span>{notification.message}</span>
                    </div>
                    <span className="text-xs text-white/75">
                      {formatDateTime(notification.createdAt)}
                    </span>
                    <div
                      className={`absolute top-1/2 right-0 flex h-fit w-1/3 -translate-y-1/2 items-center justify-end bg-gradient-to-l from-[#28a4cc] via-[#28a4cc] to-[#28a4cc00] ${notification.isRead ? "hidden" : ""}`}
                    >
                      <div
                        className="mr-3 flex w-fit transform cursor-pointer self-center rounded-md bg-[#156EB780] px-2 py-1 text-sm text-[#FFFFFF] transition duration-200 hover:scale-105 hover:bg-[#156EB7] hover:text-white hover:shadow-lg"
                        onClick={() => handleReadNotification(notification.id)}
                      >
                        Baca
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-sm text-white/75">No new notifications.</p>
          )}
          {notifications.length > 5 && (
            <button
              className={`my-2 w-full cursor-pointer rounded-full px-4 py-1 text-white transition ${
                visibleCount >= notifications.length
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={handleLoadMore}
            >
              {visibleCount >= notifications.length
                ? "Sembunyikan"
                : "Muat Lebih Banyak"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
