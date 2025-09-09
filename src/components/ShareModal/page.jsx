/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import logoWhatsapp from "@@/logo/logoSosmed/icons-whatsapp.svg";
import logoFacebook from "@@/logo/logoSosmed/icons-facebook.svg";
import logoTwitter from "@@/logo/logoSosmed/icons-twitter.svg";
import logoTelegram from "@@/logo/logoSosmed/icons-telegram.svg";
import iconLink from "@@/icons/icon-link.svg";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  LineShareButton,
  LineIcon,
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  EmailShareButton,
  EmailIcon,
} from "next-share";
import Toast from "@/components/Toast/page";
import Image from "next/image";

export default function ShareModal({ isOpen, contentType, onClose }) {
  const [show, setShow] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    switch (contentType) {
      case "MOVIE":
        setTitle("Aku merekomendasikanmu untuk menonton film ini");
        break;
      case "EBOOK":
        setTitle("Aku merekomendasikanmu untuk membaca ebook ini");
        break;
      case "PODCAST":
        setTitle("Aku merekomendasikanmu untuk mendengarkan podcast ini");
        break;
      case "SERIES":
        setTitle("Aku merekomendasikanmu untuk menonton series ini");
        break;
      case "COMIC":
        setTitle("Aku merekomendasikanmu untuk membaca komik ini");
        break;
    }
  }, [contentType]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setToastMessage("Tautan telah disalin ke clipboard.");
    setShowToast(true);
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShow(true), 10);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  // 🔹 Wrapper untuk menyamakan ukuran icon
  const ShareIconWrapper = ({ src, alt }) => (
    <div className="flex h-8 w-full items-center justify-center">
      <Image
        src={src}
        alt={alt}
        width={32}
        height={32}
        className="object-contain"
      />
    </div>
  );

  if (!isOpen && !show) return null;

  return (
    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3">
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      <div
        className={`flex flex-row gap-6 items-center bg-gradient-to-b from-[#0394bc] to-[#0E5BA8] px-6 py-3 rounded-full shadow-lg transform transition-all duration-500 origin-left
    ${show ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center" onClick={handleCopy}>
          <Image src={iconLink} width={32} height={32} alt="Salin Tautan" />
          <span className="text-white text-xs whitespace-nowrap mt-1">Salin Tautan</span>
        </div>

        {/* Tombol share */}
        <WhatsappShareButton
          url={window.location.href}
          title={title}
          className="flex flex-col items-center justify-center"
        >
          <ShareIconWrapper src={logoWhatsapp} alt="Whatsapp" />
          <p className="text-xs text-white mt-1">Whatsapp</p>
        </WhatsappShareButton>

        <TelegramShareButton
          url={window.location.href}
          title={title}
          className="flex flex-col items-center justify-center"
        >
          <ShareIconWrapper src={logoTelegram} alt="Telegram" />
          <p className="text-xs text-white mt-1">Telegram</p>
        </TelegramShareButton>

        <TwitterShareButton
          url={window.location.href}
          title={title}
          className="flex flex-col items-center justify-center"
        >
          <ShareIconWrapper src={logoTwitter} alt="Twitter" />
          <p className="text-xs text-white mt-1">Twitter</p>
        </TwitterShareButton>

        <FacebookShareButton
          url={window.location.href}
          quote={title}
          className="flex flex-col items-center justify-center"
        >
          <ShareIconWrapper src={logoFacebook} alt="Facebook" />
          <p className="text-xs text-white mt-1">Facebook</p>
        </FacebookShareButton>
      </div>
    </div>
  );
}
