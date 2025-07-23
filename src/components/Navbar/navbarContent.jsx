"use client";
import React from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';

/*[--- COMPONENT IMPORT ---]*/
import SearchResults from "@/components/SearchResults/page.jsx";
import SideBarMenu from "@/components/Navbar/SideBarMenu/page.jsx";
import NotificationMenu from "@/components/Navbar/NotificationMenu/page.jsx";
import ProfileMenu from "@/components/Navbar/ProfileMenu/page.jsx";

/*[--- CONSTANTS IMPORT ---]*/
import { navbarOptions } from '@/lib/constants/navbarOptions';

/*[--- ASSETS IMPORT ---]*/
import iconMenuBars from "@@/icons/icon-menubars.svg";
import iconMenuClose from "@@/icons/icon-menuclose.svg";
import logoHome from "@@/icons/logoHome.svg";
import logoSearch from "@@/logo/logoSearch/nav-search.svg";

export default function NavbarContent() {
  const router = useRouter();
  const pathname = usePathname();
  const [imageUrl, setImageUrl] = useState(null);
  const [isMenuBarsOpen, setIsMenuBarsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState(null);
  const [creatorId, setCreatorId] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
    setUserId(localStorage.getItem("users_id"));
    setRole(localStorage.getItem("role"));
    setCreatorId(localStorage.getItem("creators_id"));
    setIsCreator(JSON.parse(localStorage.getItem("isCreator")));
    if (isCreator && role === "Creator") {
      setImageUrl(localStorage.getItem("image_users"));
    } else {
      setImageUrl(localStorage.getItem("image_creators"));
    }
  }, []);

  const toggleMenuBars = () => {
    setIsMenuBarsOpen(!isMenuBarsOpen);
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchClick = () => {
    setIsEditing(true);
  };

  const handleSwitchRole = () => {
    const newRole = role === "Users" ? "Creators" : "Users";
    setRole(newRole);
    localStorage.setItem("role", newRole);
    if (newRole === "Creators") {
      setImageUrl(localStorage.getItem("image_users"));
    } else {
      setImageUrl(localStorage.getItem("image_creators"));
    }
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "role") {
        setRole(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleBlur = () => {
    if (searchQuery.trim()) {
      router.push(`?search=${encodeURIComponent(searchQuery)}`);
    }
    setIsEditing(false);
  };

  return (
    <>
      <nav
        className={`${isMenuBarsOpen ? "rounded-b-xl" : ""} fixed z-20 w-full bg-white/5 backdrop-blur`}
      >
        <section className="flex items-center justify-between px-4 py-4 md:flex md:justify-between md:bg-fixed">
          <div className="flex w-1/3 md:hidden">
            <button
              className="flex h-6 w-6 cursor-pointer hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]"
              onClick={toggleMenuBars}
            >
              {isMenuBarsOpen ? (
                <Image
                  className="h-auto w-auto"
                  src={iconMenuClose}
                  alt="icon-menubars"
                  priority
                />
              ) : (
                <Image
                  className="h-auto w-auto"
                  src={iconMenuBars}
                  alt="icon-menubars"
                  priority
                />
              )}
            </button>
          </div>
          <div className="-mt-3 w-fit -translate-x-8 ps-0 md:mt-0 md:-translate-x-0 md:place-items-start lg:ps-6">
            <Link href="/">
              <div className="flex aspect-auto justify-center">
                <Image
                  className="ml-6 h-auto w-auto"
                  src={logoHome}
                  alt="logo-gate+"
                  priority
                />
              </div>
            </Link>
          </div>
          <div className="zeinFont mt-0.5 hidden w-fit justify-between gap-1 rounded-full p-2 text-xl leading-tight transition-all duration-300 ease-in-out md:flex md:bg-[#0881AB] lg:-mr-10">
            {navbarOptions.map((option) => {
              const isActive = option.url === pathname;
              return (
                <div key={option.id} className={`${isEditing && "hidden"}`}>
                  <Link
                    href={option.url}
                  >
                    <div className={`mt-0.5 flex flex-2 cursor-pointer justify-center items-center leading-none rounded-full from-[#0E5BA8] to-[#0395BC] p-2 text-center font-semibold border-2 border-[#0881AB] text-white lg:px-5 xl:px-6 hover:bg-linear-to-t active:bg-linear-to-t active:border-2 active:border-white/40 ${isActive && "bg-linear-to-t border-2 border-white/40"}`}>
                      <span className="drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]">
                        {option.tittle}
                      </span>
                    </div>
                  </Link>
                </div>
              );
            }
            )}
            <div
              className={`flex-cols relative flex flex-4 items-center justify-start gap-1 rounded-3xl bg-blue-300 hover:ring-1 hover:ring-white ${isEditing ? "px-0" : "px-2 lg:px-5 xl:px-6"} transition-all duration-300 ease-in-out`}
            >
              <div
                className={`mt-0.5 cursor-pointer font-semibold drop-shadow-[0_0_2px_rgba(255,255,255,0.3)] ${searchQuery.length === 0 ? "text-white" : "text-[#184A97]"} transition-all duration-300 ease-in-out`}
                onClick={handleSearchClick}
              >
                {isEditing ? (
                  <input
                    type="text"
                    className="zeinFont text-md -mt-0 min-w-[550px] cursor-pointer rounded-full border-none bg-blue-300 px-4 py-2.5 font-bold text-[#184A97] transition-all duration-300 ease-in-out focus:outline-none"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onBlur={handleBlur}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleBlur();
                      }
                    }}
                    placeholder="Cari Kreator / Karya ..."
                    autoFocus
                  />
                ) : searchQuery ? (
                  searchQuery.length > 8 ? (
                    `${searchQuery.slice(0, 8)}...`
                  ) : (
                    searchQuery
                  )
                ) : (
                  "Search"
                )}
              </div>
              <div
                className={`ml-2 flex transition-all duration-300 ease-in-out ${isEditing ? "mr-4" : "-mr-2"}`}
              >
                <Image
                  height={20}
                  width={20}
                  src={logoSearch}
                  alt="logo-search"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="flex w-fit items-center justify-end gap-4 text-white md:flex md:w-auto md:gap-2 lg:gap-3">
            <div
              className="flex h-7 w-7 cursor-pointer outline-none md:hidden md:w-auto"
              onClick={toggleMenuBars}
            >
              {!isMenuBarsOpen && (
                <Image
                  priority
                  height={30}
                  width={27}
                  src={logoSearch}
                  alt="logo-lonceng"
                  className="object-cover object-center"
                />
              )}
            </div>
            <NotificationMenu key={role} />

            {isAuthenticated ? (
              <>
                <ProfileMenu
                  creatorId={creatorId}
                  userId={userId}
                  isCreator={isCreator}
                  imageUrl={imageUrl}
                  role={role}
                  handleSwitchRole={handleSwitchRole}
                />
              </>
            ) : (
              <>
                <div className="hidden md:mt-0.5 md:flex md:flex-col md:py-3">
                  <Link
                    href="/login"
                  >
                    <div className="flex justify-center rounded-full bg-linear-to-t from-[#0E5BA8] to-[#0395BC] py-2 font-semibold sm:px-2 md:px-4 lg:px-6 xl:px-8">
                      <span className="zeinFont mt-0.5 text-center text-lg leading-tight drop-shadow-[0_0_2px_rgba(255,255,255,0.4)] sm:text-lg lg:text-xl">
                        Log In
                      </span>
                    </div>
                  </Link>
                </div>
                <div className="hidden md:mt-0.5 md:block md:py-3">
                  <Link href="/register">
                    <div className="flex justify-center rounded-full bg-[#0881AB] py-2 font-semibold saturate-35 sm:px-2 md:px-4 lg:px-6 xl:px-8">
                      <span className="zeinFont mt-0.5 text-center text-base leading-tight drop-shadow-[0_0_2px_rgba(255,255,255,0.4)] sm:text-sm lg:text-xl">
                        Sign Up
                      </span>
                    </div>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        {isMenuBarsOpen && (
          <SideBarMenu
            searchQuery={searchQuery}
            pathname={pathname}
            handleSearchChange={handleSearchChange}
            handleBlur={handleBlur}
            logoSearch={logoSearch}
            isAuthenticated={isAuthenticated}
          />
        )}
        <SearchResults />
      </nav>
    </>
  );
}
