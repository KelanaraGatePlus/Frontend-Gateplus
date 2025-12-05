// src/components/UploadForm/UploadLargeFile.jsx

"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { XIcon } from "flowbite-react";
import PropTypes from "prop-types";

// Sesuaikan path ke hook dan komponen LoadingOverlay Anda
import LoadingOverlay from "@/components/LoadingOverlay/page";
import { useUploadSessionData } from "@/hooks/helper/useUploadSession"; // Pastikan path ini benar
import IconUploadGallery from "@@/icons/upload-content/icons-video-upload.svg";

// Terima prop 'setDuration' yang baru
export default function UploadLargeFile({ label = "Film", prefix, setDataUrl, setDuration = null, error, name }) {
    const {
        progress,
        totalBytes,
        uploading,
        isLoading,
        resumeMeta,
        fileInputRef,
        onNewFile,
        onResumeFile,
        triggerResume,
        handleCancel,
        isFinish,
        fileUrl,
        videoDuration,
    } = useUploadSessionData({ prefix: prefix });

    // Efek ini mengirimkan URL file setelah upload selesai
    useEffect(() => {
        if (isFinish && fileUrl) {
            setDataUrl(fileUrl.muxAsset.playback_ids[0].id);
            if (setDuration) {
                // Jika durasi terdeteksi (bukan null) dan prop setDuration ada
                if (videoDuration && setDuration) {
                    // Panggil fungsi callback dengan nilai durasi yang sudah dibulatkan
                    setDuration(Math.round(videoDuration).toString());
                }
            }
        }
    }, [isFinish, fileUrl, setDataUrl]);

    // --- EFEK BARU: Mengirimkan durasi video saat terdeteksi ---
    useEffect(() => {

    }, [videoDuration, setDuration]); // Jalankan efek ini jika videoDuration atau setDuration berubah


    return (
        <div className="flex items-start gap-2">
            <h3 className="montserratFont flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                {label}
            </h3>
            <div className="flex h-full w-fit flex-4 flex-wrap items-stretch justify-start gap-x-6 text-white md:flex-10">
                <div className={`${error && "border-red-500 focus:border-red-500 border"} container flex w-full flex-wrap items-start gap-4 rounded-md bg-[#585454] p-2`}>
                    {/* Upload Box */}
                    <div className="flex flex-col items-center">
                        <div className={`relative ${uploading || totalBytes > 0 ? 'w-32' : 'w-40'} h-32 cursor-pointer overflow-hidden rounded-md bg-gray-500 md:h-36 ${uploading || totalBytes > 0 ? 'md:w-56' : 'md:w-36'}`}>
                            <button onClick={handleCancel} className="absolute hover:cursor-pointer w-max h-max right-0 top-0 z-10 p-1 bg-gray-600/20 m-1 rounded-full">
                                <XIcon className="h-4 w-4 text-white" />
                            </button>
                            {!uploading && <div>
                                <input
                                    type="file"
                                    accept="video/*"
                                    name={name}
                                    onChange={onNewFile}
                                    disabled={uploading || isLoading}
                                    id={name}
                                    hidden
                                />
                                <label
                                    htmlFor={name}
                                    className="absolute inset-0 flex cursor-pointer items-center justify-center gap-1 bg-black/50 text-xs font-semibold"
                                >
                                    {IconUploadGallery && (
                                        <Image
                                            src={IconUploadGallery}
                                            alt="icon"
                                            width={12}
                                            height={12}
                                            className="object-contain lg:h-5 lg:w-5"
                                        />
                                    )}
                                    <p className="text-[10px] font-semibold text-white lg:text-[12px]">
                                        Upload
                                    </p>
                                </label>
                            </div>}

                            <div className="flex flex-col justify-center items-center h-full">
                                {/* --- Tampilan Progress Upload --- */}
                                {(uploading) && (
                                    <div className="w-full">
                                        <div className="w-full bg-[#22222233]">
                                            <div className="flex flex-col justify-center items-center text-sm font-medium text-white">
                                                <Image
                                                    src={IconUploadGallery}
                                                    alt="icon"
                                                    width={24}
                                                    height={24}
                                                    className="object-contain lg:h-6 lg:w-6"
                                                />
                                                <span>Wait until your file uploaded</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-green-800 rounded-full h-max overflow-hidden">
                                            <div
                                                className="h-4 bg-gradient-to-r bg-green-500 rounded-3xl transition-all duration-300"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* --- Loading Overlay (muncul saat hashing) --- */}
                            {isLoading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 rounded-2xl z-10">
                                    <LoadingOverlay />
                                    <p className="mt-2 text-gray-700 font-semibold">Mempersiapkan file...</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-5">
                        {/* --- Tombol Lanjutkan Upload (muncul jika ada sesi) --- */}
                        {resumeMeta && !uploading && (
                            <div className="p-3 border border-blue-200 rounded-lg">
                                <p className="text-sm text-white mb-2">
                                    Sesi upload sebelumnya ditemukan untuk: <span className="font-bold">{resumeMeta.fileName}</span>
                                </p>
                                <button
                                    onClick={triggerResume}
                                    disabled={isLoading}
                                    className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                                >
                                    Lanjutkan Upload
                                </button>
                            </div>
                        )}
                        {/* --- Input File tersembunyi untuk proses resume --- */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="video/*"
                            onChange={onResumeFile}
                            className="hidden"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

UploadLargeFile.propTypes = {
    label: PropTypes.string,
    prefix: PropTypes.string.isRequired,
    setDataUrl: PropTypes.func.isRequired,
    setDuration: PropTypes.func,
    name: PropTypes.string.isRequired,
    error: PropTypes.string,
};