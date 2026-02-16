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
import { useGetAllNotificationsQuery } from "@/hooks/api/notificationSliceAPI";

export default function NotificationMenu() {
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { data: notificationData } = useGetAllNotificationsQuery();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      localStorage.clear();
      setIsAuthorized(false);
      setNotifications([]);
      setHasNotifications(false);
    } else {
      setIsAuthorized(true);
      if (notificationData?.data) {
        setNotifications(notificationData?.data || []);
        const hasUnread = notificationData?.data?.some((notif) => !notif.isRead);
        setHasNotifications(hasUnread);
        console.log("Notifications:", notificationData);
      }
    }
  }, [notificationData]);

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
      const token = Cookies.get("token");

      const response = await axios.patch(
        `${BACKEND_URL}/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Notifikasi dibaca:", response.data);
      // Hook akan otomatis refetch data setelah notifikasi dibaca
    } catch (error) {
      console.error("Gagal update notifikasi:", error.message);
    }
  };

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
        <div className="absolute top-8 right-0 z-50 mt-3.5 max-h-[1100px] w-3xs overflow-y-auto rounded-lg bg-[#2a6475] p-3.5 shadow-lg md:top-11 md:right-0 lg:w-md">
          <div className="flex items-start justify-between">
            <h2 className="mb-2 text-lg font-bold text-white">
              Notifications
            </h2>
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full bg-[#808080] pb-1 text-xl font-bold text-white cursor-pointer"
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
          ) : notificationData?.data?.length > 0 ? (
            <ul>
              {[...notifications]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt) // 🔥 terbaru di atas
                )
                .slice(0, visibleCount)
                .map((notification) => (
                  <li
                    key={notification.id}
                    className={`relative my-2 flex flex-col rounded-lg p-2 text-lg text-gray-500 ${
                      notification.isRead
                        ? "bg-transparent"
                        : "bg-[#28a4cc]"
                    }`}
                  >
                    <div className="flex flex-wrap gap-1 text-white">
                      <span
                        className="font-bold leading-6"
                        title={notification.user?.username || "Unknown"}
                      >
                        {notification.title}
                      </span>
                      <span>{notification.message}</span>
                    </div>

                    <span className="text-xs text-white/75">
                      {formatDateTime(notification.createdAt)}
                    </span>

                    {!notification.isRead && (
                      <div className="absolute top-1/2 right-0 flex w-1/3 -translate-y-1/2 items-center justify-end bg-gradient-to-l from-[#28a4cc] via-[#28a4cc] to-transparent">
                        <div
                          className="mr-3 cursor-pointer rounded-md bg-[#156EB780] px-2 py-1 text-sm text-white transition duration-200 hover:scale-105 hover:bg-[#156EB7]"
                          onClick={() =>
                            handleReadNotification(notification.id)
                          }
                        >
                          Baca
                        </div>
                      </div>
                    )}
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-sm text-white/75">
              No new notifications.
            </p>
          )}

          {notifications.length > 5 && (
            <button
              className={`my-2 w-full cursor-pointer rounded-full px-4 py-1 text-white transition ${visibleCount >= notifications.length
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
