"use client";
import React, { useEffect, useState } from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import PropTypes from "prop-types";

/*[--- COMPONENT IMPORT ---]*/
import SearchResults from "@/components/SearchResults/page.jsx";
import SideBarMenu from "@/components/Navbar/SideBarMenu/page.jsx";
import NotificationMenu from "@/components/Navbar/NotificationMenu/page.jsx";
import ProfileMenu from "@/components/Navbar/ProfileMenu/page.jsx";

/*[--- CONSTANTS IMPORT ---]*/
import { navbarOptions } from "@/lib/constants/navbarOptions";

/*[--- ASSETS IMPORT ---]*/
import iconMenuBars from "@@/icons/icon-menubars.svg";
import iconMenuClose from "@@/icons/icon-menuclose.svg";
import logoHome from "@@/icons/logoHome.svg";
import logoSearch from "@@/logo/logoSearch/nav-search.svg";

/*[--- CONTEXT IMPORT ---]*/
import { useAuth } from "../Context/AuthContext";

export default function NavbarContent({ openCreateContentModal }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const [role, setRole] = useState(user?.role || "Users");
  const [imageUrl, setImageUrl] = useState(null);
  const [isMenuBarsOpen, setIsMenuBarsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isAuthenticated = !!user?.token;

  /* --- Handle Toggle Menu --- */
  const toggleMenuBars = () => setIsMenuBarsOpen((prev) => !prev);

  /* --- Search --- */
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSearchClick = () => setIsEditing(true);

  const handleBlur = () => {
    if (searchQuery.trim()) {
      router.push(`?search=${encodeURIComponent(searchQuery)}`);
    }
    setIsEditing(false);
  };

  /* --- Switch Role --- */
  const handleSwitchRole = () => {
    const newRole = role === "Users" ? "Creators" : "Users";
    setRole(newRole);
    localStorage.setItem("role", newRole);

    setImageUrl(
      newRole === "Creators"
        ? localStorage.getItem("image_creators")
        : localStorage.getItem("image_users")
    );
  };

  /* --- Listen storage changes --- */
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "role") {
        setRole(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <nav
      className={`${isMenuBarsOpen ? "rounded-b-xl" : ""} fixed z-20 w-full bg-white/5 backdrop-blur`}
    >
      <section className="flex items-center justify-between px-4 py-4 md:flex md:justify-between md:bg-fixed">
        {/* --- Mobile Menu Button --- */}
        <div className="flex w-1/3 md:hidden">
          <button
            className="flex h-6 w-6 cursor-pointer hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]"
            onClick={toggleMenuBars}
          >
            <Image
              className="h-auto w-auto"
              src={isMenuBarsOpen ? iconMenuClose : iconMenuBars}
              alt="menu-icon"
              priority
            />
          </button>
        </div>

        {/* --- Logo --- */}
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

        {/* --- Navbar Options + Search --- */}
        <div className="zeinFont mt-0.5 hidden w-fit justify-between gap-1 rounded-full p-2 text-xl leading-tight transition-all duration-300 ease-in-out md:flex md:bg-[#0881AB] lg:-mr-10">
          {navbarOptions.map((option) => {
            const isActive = option.url === pathname;
            return (
              <div key={option.id} className={`${isEditing && "hidden"}`}>
                <Link href={option.url}>
                  <div
                    className={`mt-0.5 flex cursor-pointer items-center justify-center rounded-full border-2 border-[#0881AB] from-[#0E5BA8] to-[#0395BC] p-2 text-center font-semibold text-white lg:px-5 xl:px-6 hover:bg-linear-to-t active:bg-linear-to-t active:border-white/40 ${isActive && "bg-linear-to-t border-white/40"}`}
                  >
                    <span className="drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]">
                      {option.tittle}
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}

          {/* --- Search Input --- */}
          <div
            className={`flex-cols relative flex items-center justify-start gap-1 rounded-3xl bg-blue-300 hover:ring-1 hover:ring-white transition-all duration-300 ease-in-out ${isEditing ? "px-0" : "px-2 lg:px-5 xl:px-6"
              }`}
          >
            <div
              className={`mt-0.5 cursor-pointer font-semibold drop-shadow-[0_0_2px_rgba(255,255,255,0.3)] ${searchQuery.length === 0 ? "text-white" : "text-[#184A97]"
                }`}
              onClick={handleSearchClick}
            >
              {isEditing ? (
                <input
                  type="text"
                  className="zeinFont text-md -mt-0 min-w-[550px] rounded-full border-none bg-blue-300 px-4 py-2.5 font-bold text-[#184A97] focus:outline-none"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onBlur={handleBlur}
                  onKeyDown={(e) => e.key === "Enter" && handleBlur()}
                  placeholder="Cari Kreator / Karya ..."
                  autoFocus
                />
              ) : searchQuery ? (
                searchQuery.length > 8
                  ? `${searchQuery.slice(0, 8)}...`
                  : searchQuery
              ) : (
                "Search"
              )}
            </div>
            <div
              className={`ml-2 flex transition-all duration-300 ease-in-out ${isEditing ? "mr-4" : "-mr-2"
                }`}
            >
              <Image height={20} width={20} src={logoSearch} alt="logo-search" priority />
            </div>
          </div>
        </div>

        {/* --- Right Side (Notification + Profile/Login) --- */}
        <div className="flex w-fit items-center justify-end gap-4 text-white md:flex md:w-auto md:gap-2 lg:gap-3">
          {/* --- Mobile Search Button --- */}
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
                alt="search-icon"
                className="object-cover object-center"
              />
            )}
          </div>

          <NotificationMenu key={role} />

          {isAuthenticated ? (
            console.log(user),
            <ProfileMenu
              creatorId={user.creators_id}
              userId={user.users_id}
              isCreator={user.isCreator}
              imageUrl={imageUrl}
              role={role}
              handleSwitchRole={handleSwitchRole}
              openCreateContentModal={openCreateContentModal}
            />
          ) : (
            <>
              <div className="hidden md:flex md:flex-col md:py-3">
                <Link href="/login">
                  <div className="flex justify-center rounded-full bg-linear-to-t from-[#0E5BA8] to-[#0395BC] py-2 font-semibold sm:px-2 md:px-4 lg:px-6 xl:px-8">
                    <span className="zeinFont mt-0.5 text-center text-lg leading-tight drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]">
                      Log In
                    </span>
                  </div>
                </Link>
              </div>
              <div className="hidden md:block md:py-3">
                <Link href="/register">
                  <div className="flex justify-center rounded-full bg-[#0881AB] py-2 font-semibold sm:px-2 md:px-4 lg:px-6 xl:px-8">
                    <span className="zeinFont mt-0.5 text-center text-base leading-tight drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]">
                      Sign Up
                    </span>
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* --- Sidebar Mobile Menu --- */}
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

      {/* --- Search Results --- */}
      <SearchResults />
    </nav>
  );
}

NavbarContent.propTypes = {
  openCreateContentModal: PropTypes.func.isRequired,
};
