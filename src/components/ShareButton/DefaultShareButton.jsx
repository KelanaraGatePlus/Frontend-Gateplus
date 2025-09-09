import { useState } from "react";
import logoShare from "@@/logo/logoDetailFilm/share-icons.svg";
import Image from "next/image";
import ShareModal from "../ShareModal/page";

export default function DefaultShareButton({ className, contentType }) {
    const [open, setOpen] = useState(false);

    const toggleShare = () => {
        setOpen((prev) => !prev);
    };

    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <button onClick={toggleShare} className="hover:cursor-pointer">
                <Image width={35} alt="logo-share" src={logoShare} priority />
            </button>

            {/* Share modal keluar dari tombol */}
            <ShareModal
                isOpen={open}
                contentType={contentType}
                onClose={() => setOpen(false)}
            />
        </div>
    );
}
