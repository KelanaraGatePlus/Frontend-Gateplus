/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
"use client";

import store from "@/hooks/store/store.js";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Provider } from "react-redux";
import "./globals.css";
import Navbar from "@/components/Navbar/page";
import Footer from "@/components/Footer/MainFooter";
import { useState } from "react";
import FlexModal from "@/components/Modal/FlexModal";
import Image from "next/image";
import { contentType } from "@/lib/constants/contentType";
import Script from "next/script";

export default function RootLayout({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      default:
        return "/";
    }
  };

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
          <Navbar openCreateContentModal={(objective) => {
            setObjective(objective);
            setIsModalOpen(true);
          }} />
          <FlexModal isOpen={isModalOpen} onClose={() => {
            setIsModalOpen(false);
          }} title={"Kategori Upload Karya"}>
            <div className="flex flex-row items-center text-white text-md px-52">
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
                    className="flex flex-col items-center justify-center mr-4 hover:cursor-pointer"
                  >
                    <Image
                      src={content.icon}
                      alt={content.singleName}
                      width={148}
                    />
                    <p>{content.pluralName.toUpperCase()}</p>
                  </button>
                ))}
            </div>
          </FlexModal>
          <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
          <Footer />
        </body>
      </html>
    </Provider>
  );
}
