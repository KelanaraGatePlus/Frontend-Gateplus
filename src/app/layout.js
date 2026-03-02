/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
"use client";

import store from "@/hooks/store/store.js";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Provider } from "react-redux";
import "./globals.css";
import Navbar from "@/components/Navbar/page";
import Footer from "@/components/Footer/MainFooter";
import { useEffect, useState } from "react";
import FlexModal from "@/components/Modal/FlexModal";
import Image from "next/image";
import { contentType } from "@/lib/constants/contentType";
import Script from "next/script";
import { AuthProvider } from "@/components/Context/AuthContext";
import RedeemVoucherModal from "@/components/Modal/RedeemVoucherModal";
import { usePathname } from "next/navigation";
import routeWithoutNavbar from "@/lib/constants/routeWithoutNavbar";
import routeWithoutFooter from "@/lib/constants/routeWithoutFooter";
import { PodcastPlayerProvider } from "@/context/PodcastPlayerContext";

export default function RootLayout({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalRedeemOpen, setIsModalRedeemOpen] = useState(false);
  const [objective, setObjective] = useState("");

  const redirect = (type, objective) => {
    setIsModalOpen(false);
    const url = objective == 'upload' ? 'upload' : 'upload/episode';
    switch (type) {
      case "movies":
        return `/movies/${url}`;
      case "series":
        return `/series/${url}`;
      case "podcasts":
        return `/podcasts/${url}`;
      case "ebooks":
        return `/ebooks/${url}`;
      case "comics":
        return `/comics/${url}`;
      case "education":
        return `/education/${url}`;
      default:
        return "/";
    }
  };

  const pathname = usePathname();

  useEffect(() => {
    const RECOVERY_FLAG = "__gateplus_chunk_recovery_at";
    const RECOVERY_COOLDOWN_MS = 30000;

    const isChunkLoadError = (error) => {
      if (!error) {
        return false;
      }

      const name = String(error?.name || "");
      const message = String(error?.message || error || "");

      return /ChunkLoadError|Loading chunk\s+\d+\s+failed|CSS_CHUNK_LOAD_FAILED|Failed to fetch dynamically imported module/i.test(
        `${name} ${message}`,
      );
    };

    const recoverFromChunkError = () => {
      const lastRecoveryAt = Number(sessionStorage.getItem(RECOVERY_FLAG) || "0");
      if (Date.now() - lastRecoveryAt < RECOVERY_COOLDOWN_MS) {
        return;
      }

      sessionStorage.setItem(RECOVERY_FLAG, Date.now().toString());
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set("_chunk_recovery", Date.now().toString());
      window.location.replace(nextUrl.toString());
    };

    const handleWindowError = (event) => {
      if (isChunkLoadError(event?.error || event?.message)) {
        recoverFromChunkError();
      }
    };

    const handleUnhandledRejection = (event) => {
      if (isChunkLoadError(event?.reason)) {
        recoverFromChunkError();
      }
    };

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  // true kalau salah satu pattern cocok
  const hideNavbar = routeWithoutNavbar.some((pattern) => pattern.test(pathname));
  const hideFooter = routeWithoutFooter.some((pattern) => pattern.test(pathname));

  const hidePlayerRoutes = [/^\/login$/, /^\/register$/];
  const hidePlayer = hidePlayerRoutes.some((pattern) => pattern.test(pathname));

  return (
    <Provider store={store}>
      <html lang="en">
        <head>
          {/* Google Analytics */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-JRSR883RSP"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JRSR883RSP');
          `}
          </Script>
        </head>
        <body className={`antialiased overflow-x-hidden`}>
          <AuthProvider>
            <PodcastPlayerProvider disablePlayer={hidePlayer}>
              {!hideNavbar && <Navbar openCreateContentModal={(objective) => {
                setObjective(objective);
                setIsModalOpen(true);
              }}
                openRedeemVoucherModal={() => {
                  setIsModalRedeemOpen(true);
                }}
              />}
              <FlexModal isOpen={isModalOpen} onClose={() => {
                setIsModalOpen(false);
              }} title={"Kategori Upload Karya"}>
                <div className="flex flex-row items-center text-white text-xs md:text-sm xl:text-md xl:px-52">
                  {Object.values(contentType)
                    .filter((content) => {
                      if (objective === "episode") {
                        return content.haveEpisodes; // hanya yang true
                      }
                      return true; // tampilkan semua kalau bukan "episode"
                    })
                    .map((content) => (
                      <button
                        onClick={() => {
                          setIsModalOpen(false);
                          window.location.href = redirect(content.pluralName, objective);
                        }}
                        key={content.singleName}
                        className="flex flex-col items-center justify-center mr-4 hover:cursor-pointer w-12 md:w-28 xl:w-[148px]"
                      >
                        <Image
                          src={content.icon}
                          alt={content.singleName}
                        />
                        <p>{content.pluralName.toUpperCase()}</p>
                      </button>
                    ))}
                </div>
              </FlexModal>
              <RedeemVoucherModal isModalRedeemOpen={isModalRedeemOpen} setIsModalRedeemOpen={setIsModalRedeemOpen} />
              <AppRouterCacheProvider>
                {hideNavbar ? children : (
                  <div className="pt-12.5 md:pt-18.5 2xl:pt-[100px]">
                    {children}
                  </div>
                )}
              </AppRouterCacheProvider>
              {
                !hideFooter && <Footer />
              }
            </PodcastPlayerProvider>
          </AuthProvider>
        </body>
      </html>
    </Provider>
  );
}
