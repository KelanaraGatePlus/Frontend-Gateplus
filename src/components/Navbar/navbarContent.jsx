"use client";
import React, { Fragment, useEffect, useState } from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import PropTypes from "prop-types";

/*[--- COMPONENT IMPORT ---]*/
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
import iconChartRed from "@@/icons/icon-chart-red.svg";
import iconChartYellow from "@@/icons/icon-chart-yellow.svg";

/*[--- CONTEXT IMPORT ---]*/
import { useAuth } from "../Context/AuthContext";
import { contentType } from "@/lib/constants/contentType";
import { useGetPopularSearchesQuery, useGetSearchHistoryByUserQuery } from "@/hooks/api/searchAPI";

export default function NavbarContent({ openCreateContentModal }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const [role, setRole] = useState(user?.role || "Users");
  const [imageUrl, setImageUrl] = useState(null);
  const [isMenuBarsOpen, setIsMenuBarsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { data } = useGetSearchHistoryByUserQuery();
  const { data: trendingData } = useGetPopularSearchesQuery();

  const isAuthenticated = !!user?.token;

  const toggleMenuBars = () => setIsMenuBarsOpen((prev) => !prev);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push(`/search?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSwitchRole = () => {
    const newRole = role === "Users" ? "Creators" : "Users";
    setRole(newRole);
    localStorage.setItem("role", newRole);
    setImageUrl(newRole === "Creators" ? localStorage.getItem("image_creators") : localStorage.getItem("image_users"));
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

  return (
    <Fragment>
      <nav
        // [PERBAIKAN] z-index diturunkan agar di bawah overlay konten search
        className={`${isMenuBarsOpen ? "rounded-b-xl" : ""} fixed z-30 w-full bg-white/5 backdrop-blur`}
      >
        <section className="flex items-center justify-between px-4 py-4 md:flex md:justify-between md:bg-fixed">
          <div className="flex w-1/3 md:hidden">
            <button className="flex h-6 w-6 cursor-pointer hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]" onClick={toggleMenuBars}>
              <Image className="h-auto w-auto" src={isMenuBarsOpen ? iconMenuClose : iconMenuBars} alt="menu-icon" priority />
            </button>
          </div>

          <div className="-mt-3 w-fit -translate-x-8 ps-0 md:mt-0 md:-translate-x-0 md:place-items-start lg:ps-6">
            <Link href="/"><div className="flex aspect-auto justify-center"><Image className="ml-6 h-auto w-auto" src={logoHome} alt="logo-gate+" priority /></div></Link>
          </div>

          {!isSearchActive ? (
            <div className="zeinFont mt-0.5 hidden w-fit justify-between gap-1 rounded-full p-2 text-xl leading-tight transition-all duration-300 ease-in-out md:flex md:bg-[#0881AB] lg:-mr-10">
              {navbarOptions.map((option) => {
                const isActive = option.url === pathname;
                return (
                  <div key={option.id}>
                    <Link href={option.url}>
                      <div className={`mt-0.5 flex cursor-pointer items-center justify-center rounded-full border-2 border-[#0881AB] from-[#0E5BA8] to-[#0395BC] p-2 text-center font-semibold text-white lg:px-5 xl:px-6 hover:bg-linear-to-t active:bg-linear-to-t active:border-white/40 ${isActive && "bg-linear-to-t border-white/40"}`}>
                        <span className="drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]">{option.tittle}</span>
                      </div>
                    </Link>
                  </div>
                );
              })}
              <div
                className="flex-cols relative flex items-center justify-start gap-1 rounded-3xl bg-blue-300 px-2 transition-all duration-300 ease-in-out hover:ring-1 hover:ring-white lg:px-5 xl:px-6"
                onClick={() => setIsSearchActive(true)}
              >
                <div className={`mt-0.5 cursor-pointer font-semibold drop-shadow-[0_0_2px_rgba(255,255,255,0.3)] ${searchQuery.length === 0 ? "text-white" : "text-[#184A97]"}`}>
                  {searchQuery ? (searchQuery.length > 8 ? `${searchQuery.slice(0, 8)}...` : searchQuery) : ("Search")}
                </div>
                <div className="ml-2 flex -mr-2 transition-all duration-300 ease-in-out">
                  <Image height={20} width={20} src={logoSearch} alt="logo-search" priority />
                </div>
              </div>
            </div>
          ) : (
            <div className="zeinFont mt-0.5 hidden border-white/20 border justify-between gap-1 rounded-t-3xl p-2 text-xl leading-tight transition-all duration-300 ease-in-out md:flex md:bg-[#0395BC80] lg:-mr-10 w-full max-w-3xl absolute left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-3 rounded-full px-4 py-2 border border-white/20 w-full">
                <input
                  type="text"
                  className="w-full flex-grow bg-transparent text-lg text-white placeholder:text-white/60 focus:outline-none"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                  autoFocus
                />
                <button onClick={handleSearchSubmit} className="flex-shrink-0" aria-label="Cari">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
              </div>
            </div>
          )}

          <div className="flex w-fit items-center justify-end gap-4 text-white md:flex md:w-auto md:gap-2 lg:gap-3">
            <button
              className="flex h-7 w-7 cursor-pointer items-center justify-center outline-none md:hidden"
              onClick={() => setIsSearchActive(true)}
              aria-label="Buka Pencarian"
            >
              <Image priority height={30} width={27} src={logoSearch} alt="search-icon" className="object-cover object-center" />
            </button>
            <NotificationMenu key={role} />
            {isAuthenticated ? (
              <ProfileMenu creatorId={user.creators_id} userId={user.users_id} isCreator={user.isCreator} imageUrl={imageUrl} role={role} handleSwitchRole={handleSwitchRole} openCreateContentModal={openCreateContentModal} />
            ) : (
              <>
                <div className="hidden md:flex md:flex-col md:py-3"><Link href="/login"><div className="flex justify-center rounded-full bg-linear-to-t from-[#0E5BA8] to-[#0395BC] py-2 font-semibold sm:px-2 md:px-4 lg:px-6 xl:px-8"><span className="zeinFont mt-0.5 text-center text-lg leading-tight drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]">Log In</span></div></Link></div>
                <div className="hidden md:block md:py-3"><Link href="/register"><div className="flex justify-center rounded-full bg-[#0881AB] py-2 font-semibold sm:px-2 md:px-4 lg:px-6 xl:px-8"><span className="zeinFont mt-0.5 text-center text-base leading-tight drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]">Sign Up</span></div></Link></div>
              </>
            )}
          </div>
        </section>

        {isMenuBarsOpen && (
          <SideBarMenu searchQuery={searchQuery} pathname={pathname} handleSearchChange={handleSearchChange} handleBlur={handleSearchSubmit} logoSearch={logoSearch} isAuthenticated={isAuthenticated} />
        )}
      </nav>

      {isSearchActive && (
        <div
          // [PERBAIKAN] z-index dinaikkan agar di atas navbar
          className="fixed left-0 right-0 z-40 mt-[76px] mx-auto w-full max-w-3xl rounded-b-2xl border-x border-b border-white/20 bg-[#0395BC80] text-white backdrop-blur-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="my-6 grid grid-cols-5 gap-4 text-center">
            <Link href={`/${contentType.movie.pluralName}`} className="flex flex-col items-center gap-2 text-white hover:text-white transition-colors"><Image src={contentType.movie.icon} width={65} height={65} /> <span className="text-sm font-semibold">MOVIE</span></Link>
            <Link href={`/${contentType.series.pluralName}`} className="flex flex-col items-center gap-2 text-white hover:text-white transition-colors"><Image src={contentType.series.icon} width={65} height={65} /> <span className="text-sm font-semibold">SERIES</span></Link>
            <Link href={`/${contentType.podcasts.pluralName}`} className="flex flex-col items-center gap-2 text-white hover:text-white transition-colors"><Image src={contentType.podcasts.icon} width={65} height={65} /> <span className="text-sm font-semibold">PODCAST</span></Link>
            <Link href={`/${contentType.ebooks.pluralName}`} className="flex flex-col items-center gap-2 text-white hover:text-white transition-colors"><Image src={contentType.ebooks.icon} width={65} height={65} /> <span className="text-sm font-semibold">EBOOK</span></Link>
            <Link href={`/${contentType.comics.pluralName}`} className="flex flex-col items-center gap-2 text-white hover:text-white transition-colors"><Image src={contentType.comics.icon} width={65} height={65} /> <span className="text-sm font-semibold">COMIC</span></Link>
          </div>
          <hr className="border-white/10" />
          <div className="grid grid-cols-1 gap-2 p-4 text-xs">
            <div>
              <div className="flex items-center gap-1">
                <Image src={iconChartRed} width={24} height={24} className="inline-block mr-2" />
                <h3 className="font-semibold text-white mb-1">Trending Search</h3>
              </div>
              <div className="p-1">
                <ul className="space-y-1">{trendingData?.popularSearches?.map((item, index) => (<li key={index}><Link href={`/search?search=${item.searchQuery}`} className="text-white hover:text-white flex flex-row items-center gap-1">
                <Image src={iconChartYellow} width={24} height={24} className="inline-block " />
                <p>{item.searchQuery}</p></Link></li>))}</ul>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <Image src={iconChartRed} width={24} height={24} className="inline-block mr-2" />
                <h3 className="font-semibold text-white mb-1">Search History</h3>
              </div>
              <div>
                <div className="px-2 py-1">
                  <ul className="space-y-1">{data?.searchHistories?.map((item, index) => (<li key={index}><Link href={`/search?search=${item.searchQuery}`} className="text-white hover:text-white">{item.searchQuery}</Link></li>))}</ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSearchActive && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setIsSearchActive(false)}
        ></div>
      )}
    </Fragment>
  );
}

NavbarContent.propTypes = {
  openCreateContentModal: PropTypes.func.isRequired,
};