"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';

/*[--- CONSTANTS IMPORT ---]*/
import { siteMetadata } from '@/lib/constants/siteMetaData';
import { navbarOptions } from '@/lib/constants/navbarOptions';

/*[--- ASSETS IMPORT ---]*/
import logoHome from "@@/icons/logoHome.svg";

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="flex flex-col font-semibold text-white gap-4 mt-20">
      <section className="flex flex-col gap-2 px-2 md:px-8">
        <div className="flex flex-col gap-2 lg:flex-row">
          <div className="flex flex-col justify-start rounded-md bg-[#10ADF0] pl-5 py-4 lg:flex-row md:items-center flex-1 montserratFont">
            <p className="font-bold">JOIN OUR NEWSLATTER</p>
            <p className="text-sm font-light lg:hidden">
              Subscribe news latter to get any update our platform
            </p>
          </div>
          <div className="hidden items-center justify-center rounded-md bg-[#10ADF0] px-2 py-4 text-center md:flex flex-1 montserratFont">
            <p className="text-sm font-light">
              Subscribe news latter to get any update our platform
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-md bg-[#10ADF0] px-2 py-4 md:py-1 flex-1 montserratFont">
            <div className="flex-5">
              <input
                className="w-full rounded-full border border-white px-4 py-1.5 md:h-full md:py-1 focus:outline-none"
                type="email"
                placeholder="Email Address"
              />
            </div>
            <div className="flex-2">
              <button className="h-full w-full rounded-full bg-[#156EB7] py-1.5 md:py-1 px-1 font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:flex-row">
          <div className="flex flex-col gap-2 rounded-md bg-linear-to-t from-[#04475E] to-[#10ADF0] justify-between py-4 px-4 flex-1">
            <div className="flex flex-col gap-2">
              <div className="flex montserratFont text-lg items-center text-right font-semibold md:justify-center lg:justify-start">
                Contact
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-sm font-normal montserratFont">{siteMetadata.contact}</div>
                <div className="text-sm font-normal montserratFont">{siteMetadata.email}</div>
                <div className="text-sm font-normal montserratFont">{siteMetadata.address}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-md bg-linear-to-t from-[#04475E] to-[#10ADF0] md:px-4 py-2 flex-2 justify-evenly">
            <div className="flex content-center items-center justify-center">
              <Link href={"/"}>
                <div className="relative h-24 w-48 -mt-4">
                  <Image priority alt="logo-footer" src={logoHome} fill className="w-full h-full object object-contain" />
                </div>
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-evenly gap-2 h-fit montserratFont">
              {
                navbarOptions.map((option) => {
                  const isActive = option.url === pathname;
                  return (
                    <div key={option.id} className={`flex justify-center p-1 hover:underline hover underline-offset-4 ${isActive ? "font-bold text-white/70" : "text-white"}`}>
                      <Link href={option.url}>{option.tittle}</Link>
                    </div>
                  );
                })
              }
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-md bg-linear-to-t from-[#04475E] to-[#10ADF0] justify-between pt-4 pb-2 px-4 flex-1">
            <div className="flex montserratFont text-lg items-center text-right font-semibold justify-center lg:justify-end lg:pr-2">
              Social Media
            </div>
            <div className="flex flex-wrap items-center md:justify-between justify-center gap-2 h-fit">
              {siteMetadata.social.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-center rounded-full p-1.5 hover:bg-white/25"
                >
                  <Link
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <Image
                      priority
                      className="aspect-auto shrink-0"
                      height={35}
                      width={35}
                      alt={item.name}
                      src={item.icon}
                    />
                  </Link>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 md:mb-2 w-full py-2">
              {siteMetadata.appDownload.map((store) => (
                <Link key={store.name} href={store.link}>
                  <div className="flex rounded-md border-2 border-[#dedede] bg-[#383938] gap-2 flex-1 px-2 py-1 montserratFont items-center justify-center">
                    <figure className="flex relative h-8 w-8">
                      <Image priority alt={store.name} src={store.icon} fill className="w-full h-full object object-contain" />
                    </figure>
                    <div className="">
                      <p className="uppercase text-[10px] font-medium">Get iN On</p>
                      <h5 className="text-base">{store.name}</h5>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-5 mt-8 mb-4 flex flex-col gap-2 md:mt-0 md:block">
        <div className="-mb-1 flex justify-center md:hidden">© 2025 GATE+</div>
        <div className="flex flex-row justify-center gap-2">
          <div className="hidden text-sm md:flex">© 2025 GATE+</div>
          <p className="hidden md:flex">|</p>
          <div className="text-center text-sm text-blue-700 underline md:text-base">
            <Link href="/privacy-policy">Privacy policy</Link>
          </div>
          <p>|</p>
          <div className="text-center text-sm text-blue-700 underline md:text-base">
            <Link href="/term-of-service">Terms of services</Link>
          </div>
          <p>|</p>
          <div className="text-center text-sm text-blue-700 underline md:text-base">
            <Link href="/faq">Help Center</Link>
          </div>
        </div>
      </section>
    </footer>
  );
}
