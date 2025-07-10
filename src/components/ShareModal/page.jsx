/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
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

export default function ShareModal({ isOpen, onClose }) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setToastMessage("Tautan telah disalin ke clipboard.");
    setShowToast(true);
  };

  useEffect(() => {
    if (isOpen) {
      setShowAnimation(true);
    } else {
      setTimeout(() => setShowAnimation(false), 300);
    }
  }, [isOpen]);

  if (!isOpen && !showAnimation) return null;

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
      <div
        className={`w-fit max-w-lg rounded-2xl bg-white px-4 py-6 text-black shadow-lg transition-transform duration-300 ${
          isOpen ? "" : "translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-lg font-semibold">Share to</h4>
          <button
            onClick={onClose}
            className="cursor-pointer text-sm text-gray-500 hover:text-black"
          >
            Close
          </button>
        </div>

        <div className="flex w-fit flex-wrap gap-3">
          <div
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#7f7f7f]"
            onClick={handleCopy}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="27"
              height="27"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M11 17H7C5.61667 17 4.43767 16.5123 3.463 15.537C2.48833 14.5617 2.00067 13.3827 2 12C1.99933 10.6173 2.487 9.43833 3.463 8.463C4.439 7.48767 5.618 7 7 7H11V9H7C6.16667 9 5.45833 9.29167 4.875 9.875C4.29167 10.4583 4 11.1667 4 12C4 12.8333 4.29167 13.5417 4.875 14.125C5.45833 14.7083 6.16667 15 7 15H11V17ZM8 13V11H16V13H8ZM13 17V15H17C17.8333 15 18.5417 14.7083 19.125 14.125C19.7083 13.5417 20 12.8333 20 12C20 11.1667 19.7083 10.4583 19.125 9.875C18.5417 9.29167 17.8333 9 17 9H13V7H17C18.3833 7 19.5627 7.48767 20.538 8.463C21.5133 9.43833 22.0007 10.6173 22 12C21.9993 13.3827 21.5117 14.562 20.537 15.538C19.5623 16.514 18.3833 17.0013 17 17H13Z"
                fill="white"
              />
            </svg>
          </div>
          <EmailShareButton
            url={window.location.href}
            subject={"Silakan Periksa Ebook Ini"}
            body={`Aku merekomendasikanmu untuk membaca ebook ini ${window.location.href}`}
            blankTarget={true}
          >
            <EmailIcon size={45} round />
          </EmailShareButton>
          <WhatsappShareButton
            url={window.location.href}
            title={"Aku merekomendasikanmu untuk membaca ebook ini"}
            separator=": "
            blankTarget={true}
          >
            <WhatsappIcon size={45} round />
          </WhatsappShareButton>
          <TwitterShareButton
            url={window.location.href}
            title={"Aku merekomendasikanmu untuk membaca ebook ini"}
            blankTarget={true}
          >
            <TwitterIcon size={45} round />
          </TwitterShareButton>
          <FacebookShareButton
            url={window.location.href}
            quote={"Aku merekomendasikanmu untuk membaca ebook ini"}
            hashtag="#gateplusid"
            blankTarget={true}
          >
            <FacebookIcon size={45} round />
          </FacebookShareButton>
          <FacebookMessengerShareButton
            url={window.location.href}
            appId={""}
            blankTarget={true}
          >
            <FacebookMessengerIcon size={45} round />
          </FacebookMessengerShareButton>
          <TelegramShareButton
            url={window.location.href}
            title={"Aku merekomendasikanmu untuk membaca ebook ini"}
            blankTarget={true}
          >
            <TelegramIcon size={45} round />
          </TelegramShareButton>
          <LineShareButton
            url={window.location.href}
            title={"Aku merekomendasikanmu untuk membaca ebook ini"}
            blankTarget={true}
          >
            <LineIcon size={45} round />
          </LineShareButton>
        </div>
      </div>
    </div>
  );
}
