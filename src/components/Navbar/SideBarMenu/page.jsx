import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";

/*[--- CONSTANTS IMPORT ---]*/
import { navbarOptions } from '@/lib/constants/navbarOptions';

export default function SideBarMenu({
  searchQuery,
  pathname,
  logoSearch,
  isAuthenticated,
  handleBlur,
  handleSearchChange,
}) {
  return (
    <section className="flex h-fit flex-col gap-4 px-2 pb-4 md:hidden">
      <div className="flex w-full flex-col gap-2 rounded-2xl bg-[#0881AB] p-3">
        <div className="relative block">
          <input
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleBlur();
              }
            }}
            className="w-full rounded-full border border-[#F5F5F526] bg-[#F5F5F526] p-2 px-4 font-bold text-white [text-shadow:0_0_4px_#FFFFFF40] placeholder:text-lg placeholder:font-bold placeholder:text-white/75"
          />
          <div className="absolute top-1/2 right-4 flex h-6 w-6 -translate-y-1/2">
            <Image
              priority
              height={30}
              width={27}
              src={logoSearch}
              alt="logo-lonceng"
              className="object-cover object-center"
            />
          </div>
        </div>

        <ul className="flex justify-between gap-1 text-sm font-semibold text-white mx-2">
          {navbarOptions.map((option) => {
            const isActive = option.url === pathname;
            return (
              <Link href={option.url} key={option.id}>
                <li className={`zeinFont flex flex-2 cursor-pointer items-center justify-center rounded-full px-2 py-2 text-center text-xl [text-shadow:0_0_4px_#FFFFFF40] hover:underline hover:underline-offset-4 ${isActive ? "underline underline-offset-4" : ""}`}>
                  {option.tittle}
                </li>
              </Link>
            );
          }
          )}
        </ul>
      </div>
      {!isAuthenticated && (
        <div className="flex justify-center gap-4 font-bold text-white">
          <Link
            href="/login"
            className="rounded-full bg-linear-to-b from-[#0395BC] to-[#0E5BA8] px-4 py-1 text-center [text-shadow:0_0_4px_#FFFFFF40]"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-[#0395BC26] bg-[#0881AB59] px-4 py-1 text-center [text-shadow:0_0_4px_#FFFFFF40]"
          >
            Sign Up
          </Link>
        </div>
      )}
    </section>
  );
}

SideBarMenu.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  pathname: PropTypes.string,
  logoSearch: PropTypes.string,
  isAuthenticated: PropTypes.bool,
  handleBlur: PropTypes.func,
  handleSearchChange: PropTypes.func.isRequired,
};
