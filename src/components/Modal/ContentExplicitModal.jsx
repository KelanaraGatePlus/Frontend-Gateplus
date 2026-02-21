import Link from "next/link";
import React from "react";

// eslint-disable-next-line react/prop-types
export default function ContentExplicitModal({ imageName = "Gambar", onClose, onRetry }) {
    return (
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md"
            aria-modal="true"
            role="dialog"
            aria-labelledby="loading-message"
        >
            <div className="bg-[#1297DC52] rounded-lg p-4 max-w-lg flex flex-col gap-6">
                <h1 className="text-white font-bold text-xl">{imageName} Tidak Sesuai Kebijakan</h1>
                <p className="text-[#F5F5F5] font-light">Gambar yang Anda unggah terdeteksi mengandung konten yang tidak sesuai dengan kebijakan platform.
                    Silakan unggah gambar lain yang memenuhi standar komunitas.</p>
                <Link href={'/'} className="text-[#1DBDF5] underline">
                    Pelajari Panduan Konten
                </Link>
                <div className="grid grid-cols-2 gap-2">
                    <button className="px-4 py-2 rounded-md text-white font-medium transition-colors duration-300" onClick={onClose}>
                        Batal
                    </button>
                    <button className="px-4 py-2 rounded-md text-white font-medium transition-colors duration-300 bg-[#184A97] hover:bg-blue-700 text-center" onClick={onRetry}>
                        Unggah Ulang
                    </button>
                </div>
            </div>
        </div>
    );
}
