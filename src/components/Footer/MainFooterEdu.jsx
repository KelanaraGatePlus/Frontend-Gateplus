"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

function Footer() {
  const footerMenus = [
    {
      title: "Gate+",
      items: [
        { name: "Entertaiment", href: "/" },
        { name: "Education", href: "education" },
        { name: "Profile" },
        { name: "Guide" },
      ],
    },
    {
      title: "Contact",
      items: [{ name: "hello@gateplus.id", href: "mailto:hello@gateplus.id" }],
    },
    {
      title: "Available Soon on Platform",
      items: ["Android", "iOS", "Web App"],
    },
  ];

  const socialLinks = [
    { href: "https://www.instagram.com/gateplus.id/", icon: "instagram" },
    {
      href: "https://www.tiktok.com/@gateplus.id",
      icon: "tiktok",
    },
    { href: "https://x.com/Gateplusid", icon: "twitter" },
    // { href: "#", icon: "facebook" },
  ];

  const renderSocialIcon = (icon) => {
    switch (icon) {
      case "instagram":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2m0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4zM12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6a3 3 0 0 0 0-6m5.25-2.75a1.25 1.25 0 1 1 0 2.5a1.25 1.25 0 0 1 0-2.5"
            />
          </svg>
        );
      case "tiktok":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M15 3c.3 1.6 1.6 3.1 3.2 3.6v3a7 7 0 0 1-3.2-.8v5.6a5.8 5.8 0 1 1-5.8-5.8c.4 0 .8 0 1.2.1v3.1a2.7 2.7 0 1 0 1.6 2.5V3z"
            />
          </svg>
        );
      case "twitter":
        return (
          <svg width="24" height="20" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M18.9 2H22l-7.2 8.2L23 22h-6.7l-5.2-6.8L4.9 22H2l7.7-8.8L1 2h6.8l4.7 6.2z"
            />
          </svg>
        );
      case "facebook":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M13 22v-8h3l1-4h-4V8c0-1.2.3-2 2-2h2V2.1C16.7 2 15.6 2 14.4 2C11.7 2 10 3.6 10 6.6V10H7v4h3v8z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <footer className="mt-40 flex min-h-75 flex-col border-t border-gray-700 text-white">
      <div className="container mx-auto flex flex-col px-4 py-12">
        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 md:grid-cols-5">
          <div className="flex flex-col">
            <Link
              href="/"
              className="mb-4 flex items-center text-inherit no-underline"
              aria-label="Gate Plus"
            >
              <Image
                src="/images/logo/logoGate+/logo-gateplus-blue.png"
                alt="Logo"
                width={150}
                height={40}
                priority
              />
              <span className="mt-[35px] text-[20px] font-bold text-white">
                Edu
              </span>
            </Link>

            <div className="flex flex-col">
              <div className="mb-6 flex gap-6">
                {socialLinks.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-full bg-[#6c757d] p-1 text-white transition-colors duration-200 hover:bg-blue-600"
                  >
                    {renderSocialIcon(s.icon)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4"></div>

          {footerMenus.map((menu, index) => (
            <div key={index} className="mb-6 w-[200px]">
              <h5 className="font-zeint mb-4 text-2xl font-bold">
                {menu.title}
              </h5>

              {menu.title === "Available Soon on Platform" ? (
                <div className="flex flex-col gap-4">
                  <Image
                    src="/images/Platform/app-store.png"
                    alt="App Store"
                    width={140}
                    height={45}
                  />
                  <Image
                    src="/images/Platform/play-store.png"
                    alt="Play Store"
                    width={140}
                    height={45}
                  />
                </div>
              ) : (
                <ul className="flex flex-col">
                  {menu.items.map((item) => (
                    <li key={item.name} className="mb-2">
                      <a
                        className="font-zeint text-base text-white"
                        href={item.href}
                        rel="noopener noreferrer"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="mt-20 flex items-end justify-between">
          <p className="font-zeint w-[300px] text-[14px] leading-[16.8px] font-medium text-[var(--Color-neutral-200,#DEDEDE)]">
            Copyright 2026 GATE+. All Right Reserved
          </p>
          <div className="font-zeint flex gap-8 text-[14px] text-[var(--Color-neutral-200,#DEDEDE)]">
            <a href="/term-of-service" rel="noopener noreferrer">
              Terms of Service
            </a>
            <a href="/privacy-policy" rel="noopener noreferrer">
              Privacy Policy
            </a>
            <a href="#" rel="noopener noreferrer">
              Cookies
            </a>
          </div>
        </div>
      </div>

      <div
        className="mt-auto h-[26px] w-full rounded-[6px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(3,149,188,0.45) 0%, rgba(3,149,188,0.15) 100%)",
        }}
      />
    </footer>
  );
}

export default Footer;
